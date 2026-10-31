import { assertPaise, calculateInvoice, isISODate } from './calculations.js'

export const INVOICE_STATUSES = Object.freeze({
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
})

const allowedTransitions = {
  draft: ['confirmed', 'cancelled'],
  confirmed: ['paid', 'cancelled'],
  paid: [],
  cancelled: [],
}

function dateToUTC(dateString) {
  if (!isISODate(dateString)) {
    throw new TypeError('Date must be an ISO date (YYYY-MM-DD).')
  }
  return new Date(`${dateString}T00:00:00.000Z`)
}

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(dateString, days) {
  const date = dateToUTC(dateString)
  date.setUTCDate(date.getUTCDate() + days)
  return toISODate(date)
}

function addMonthsClamped(dateString, months) {
  const date = dateToUTC(dateString)
  const originalDay = date.getUTCDate()
  date.setUTCDate(1)
  date.setUTCMonth(date.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
  date.setUTCDate(Math.min(originalDay, lastDay))
  return toISODate(date)
}

function getPeriodEnd(start, billingPeriod) {
  if (billingPeriod === 'daily') {
    return start
  }
  if (billingPeriod === 'weekly') {
    return addDays(start, 6)
  }
  if (billingPeriod === 'monthly') {
    return addDays(addMonthsClamped(start, 1), -1)
  }
  if (billingPeriod === 'yearly') {
    return addDays(addMonthsClamped(start, 12), -1)
  }
  throw new TypeError(`Unsupported billing period: ${billingPeriod}`)
}

// Select the first calendar period not already covered by an invoice for this subscription.
export function getNextPeriod(subscription, existingInvoices) {
  if (!Array.isArray(existingInvoices)) {
    throw new TypeError('Existing invoices must be an array.')
  }
  const subscriptionInvoices = existingInvoices
    .filter((invoice) => invoice.subscription_id === subscription.id)
    .sort((left, right) => left.period_end.localeCompare(right.period_end))
  const lastInvoice = subscriptionInvoices.at(-1)
  const period_start = lastInvoice
    ? addDays(lastInvoice.period_end, 1)
    : subscription.start_date

  if (!isISODate(subscription.expiry_date) || period_start > subscription.expiry_date) {
    return null
  }

  const naturalEnd = getPeriodEnd(period_start, subscription.billing_period)
  return {
    period_start,
    period_end: naturalEnd > subscription.expiry_date ? subscription.expiry_date : naturalEnd,
  }
}

// Billing is due only for active subscriptions whose next period has started.
export function isDueForBilling(subscription, existingInvoices, today) {
  if (subscription.status !== 'active' || !isISODate(today)) {
    return false
  }
  const period = getNextPeriod(subscription, existingInvoices)
  return period !== null && period.period_start <= today
}

// The period key check prevents a second invoice for the same subscription period.
export function generateInvoice(subscription, taxes, discounts, existingInvoices, today) {
  const period = getNextPeriod(subscription, existingInvoices)
  if (!period) {
    return null
  }

  const duplicate = existingInvoices.some((invoice) =>
    invoice.subscription_id === subscription.id && invoice.period_start === period.period_start,
  )
  if (duplicate) {
    return { skipped: true, reason: 'already billed' }
  }

  const discount = discounts.find((item) => item.id === subscription.discount_id) ?? null
  const totals = calculateInvoice({ lines: subscription.lines, taxes, discount, today })
  const number = `INV-${Date.now()}-${period.period_start.replaceAll('-', '')}`
  const dueDays = subscription.payment_terms_days
  if (!Number.isSafeInteger(dueDays) || dueDays < 0) {
    throw new TypeError('Payment terms must be a non-negative integer number of days.')
  }

  return {
    id: `${subscription.id}-${period.period_start}`,
    number,
    subscription_id: subscription.id,
    customer_id: subscription.customer_id,
    period_start: period.period_start,
    period_end: period.period_end,
    issue_date: today,
    due_date: addDays(today, dueDays),
    status: INVOICE_STATUSES.DRAFT,
    ...totals,
    amount_paid: 0,
  }
}

// Existing period keys and today's issue-date marker make repeated runs idempotent.
export function runBilling(subscriptions, taxes, discounts, existingInvoices, today) {
  if (!Array.isArray(subscriptions) || !Array.isArray(existingInvoices)) {
    throw new TypeError('Subscriptions and existing invoices must be arrays.')
  }
  const created = []
  const skipped = []
  const workingInvoices = [...existingInvoices]

  for (const subscription of subscriptions) {
    if (subscription.status !== 'active') {
      continue
    }

    // A prior run today already handled every currently due period, so report rather than recreate it.
    const alreadyRunToday = workingInvoices.find((invoice) =>
      invoice.subscription_id === subscription.id && invoice.issue_date === today,
    )
    if (alreadyRunToday) {
      skipped.push({
        subscription_id: subscription.id,
        period_start: alreadyRunToday.period_start,
        reason: 'already billed',
      })
      continue
    }

    while (isDueForBilling(subscription, workingInvoices, today)) {
      const result = generateInvoice(subscription, taxes, discounts, workingInvoices, today)
      if (!result) {
        break
      }
      if (result.skipped) {
        skipped.push({
          subscription_id: subscription.id,
          period_start: getNextPeriod(subscription, workingInvoices)?.period_start,
          reason: result.reason,
        })
        break
      }
      created.push(result)
      workingInvoices.push(result)
    }
  }

  return { created, skipped }
}

export function transitionInvoice(invoice, nextStatus, changedAt = new Date().toISOString()) {
  if (!invoice || !allowedTransitions[invoice.status]?.includes(nextStatus)) {
    throw new Error(`Cannot change invoice status from ${invoice?.status ?? 'unknown'} to ${nextStatus}.`)
  }
  if (Number.isNaN(Date.parse(changedAt)) || new Date(changedAt).toISOString() !== changedAt) {
    throw new TypeError('Change date must be an ISO timestamp.')
  }

  return { ...invoice, status: nextStatus, updatedAt: changedAt }
}

export function recordPayment(invoice, payment) {
  if (invoice?.status !== INVOICE_STATUSES.CONFIRMED) {
    throw new Error('Payments can only be recorded for confirmed invoices.')
  }
  assertPaise(invoice.totalPaise)
  assertPaise(payment?.amountPaise)
  if (payment.amountPaise === 0) {
    throw new RangeError('Payment must be greater than zero paise.')
  }
  if (!isISODate(payment.paidOn)) {
    throw new TypeError('Payment date must be an ISO date (YYYY-MM-DD).')
  }

  const payments = invoice.payments ?? []
  const alreadyPaidPaise = payments.reduce((sumPaise, item) => sumPaise + item.amountPaise, 0)
  const nextPaidPaise = alreadyPaidPaise + payment.amountPaise
  if (!Number.isSafeInteger(nextPaidPaise) || nextPaidPaise > invoice.totalPaise) {
    throw new RangeError('Payment cannot be more than the remaining invoice balance.')
  }

  const updatedInvoice = { ...invoice, payments: [...payments, payment] }
  if (nextPaidPaise === invoice.totalPaise) {
    return transitionInvoice(updatedInvoice, INVOICE_STATUSES.PAID)
  }
  return updatedInvoice
}