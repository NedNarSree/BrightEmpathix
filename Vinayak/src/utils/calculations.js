const inrWholeNumber = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function assertPaise(amountPaise) {
  if (!Number.isSafeInteger(amountPaise) || amountPaise < 0) {
    throw new TypeError('Amount must be a non-negative integer number of paise.')
  }
  return amountPaise
}

export function calculateInvoiceTotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('Invoice items must be an array.')
  }

  return items.reduce((totalPaise, item) => {
    assertPaise(item.unitPricePaise)
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new TypeError('Quantity must be a positive integer.')
    }

    const lineTotalPaise = item.unitPricePaise * item.quantity
    if (!Number.isSafeInteger(lineTotalPaise) || !Number.isSafeInteger(totalPaise + lineTotalPaise)) {
      throw new RangeError('Invoice total exceeds the safe integer limit.')
    }
    return totalPaise + lineTotalPaise
  }, 0)
}

export function formatPaise(amountPaise) {
  assertPaise(amountPaise)
  const amount = BigInt(amountPaise)
  const wholeRupees = amount / 100n
  const paise = String(amount % 100n).padStart(2, '0')
  return `${inrWholeNumber.format(wholeRupees)}.${paise}`
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function isISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function safePaiseFromBigInt(amount) {
  if (amount < 0n || amount > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError('Amount exceeds the safe integer limit.')
  }
  return Number(amount)
}

// Half-up integer rounding matches Math.round without creating fractional paise.
function roundedRatio(amount, numerator, denominator) {
  if (denominator <= 0) {
    return 0
  }
  const top = BigInt(amount) * BigInt(numerator)
  return safePaiseFromBigInt((top * 2n + BigInt(denominator)) / (BigInt(denominator) * 2n))
}

function getLineSummary(lines) {
  if (!Array.isArray(lines)) {
    throw new TypeError('Invoice lines must be an array.')
  }

  let subtotal = 0
  let totalQty = 0
  const summarizedLines = lines.map((line) => {
    if (!Number.isSafeInteger(line.qty) || line.qty < 1) {
      throw new TypeError('Line quantity must be a positive integer.')
    }
    assertPaise(line.unit_price)
    const amount = line.qty * line.unit_price
    if (!Number.isSafeInteger(amount) || !Number.isSafeInteger(subtotal + amount) || !Number.isSafeInteger(totalQty + line.qty)) {
      throw new RangeError('Invoice amount or quantity exceeds the safe integer limit.')
    }
    subtotal += amount
    totalQty += line.qty
    return { ...line, amount }
  })

  return { lines: summarizedLines, subtotal, totalQty }
}

function isValidDiscount(discount) {
  return Boolean(
    discount &&
    (discount.type === 'fixed' || discount.type === 'percent') &&
    Number.isSafeInteger(discount.value) &&
    discount.value >= 0 &&
    (discount.type !== 'percent' || discount.value <= 100) &&
    Number.isSafeInteger(discount.min_purchase) &&
    discount.min_purchase >= 0 &&
    Number.isSafeInteger(discount.min_qty) &&
    discount.min_qty >= 0 &&
    Number.isSafeInteger(discount.times_used) &&
    discount.times_used >= 0 &&
    Number.isSafeInteger(discount.usage_limit) &&
    discount.usage_limit >= 0 &&
    isISODate(discount.start_date) &&
    isISODate(discount.end_date)
  )
}

// Discounts apply only while their dates, usage limit, quantity, and purchase minimum all pass.
export function isDiscountApplicable(discount, lines, today) {
  if (!isValidDiscount(discount) || !isISODate(today)) {
    return false
  }
  const { subtotal, totalQty } = getLineSummary(lines)
  return today >= discount.start_date &&
    today <= discount.end_date &&
    discount.times_used < discount.usage_limit &&
    totalQty >= discount.min_qty &&
    subtotal >= discount.min_purchase
}

// Invoice totals apply discounts before calculating tax on each line.
export function calculateInvoice({ lines, taxes = [], discount = null, today }) {
  const summary = getLineSummary(lines)
  if (!Array.isArray(taxes)) {
    throw new TypeError('Taxes must be an array.')
  }

  const discountApplies = isDiscountApplicable(discount, lines, today)
  const discountAmounts = summary.lines.map(() => 0)
  if (discountApplies && discount.type === 'percent') {
    summary.lines.forEach((line, index) => {
      discountAmounts[index] = roundedRatio(line.amount, discount.value, 100)
    })
  } else if (discountApplies && discount.type === 'fixed' && summary.subtotal > 0) {
    let remainingDiscount = Math.min(discount.value, summary.subtotal)
    let remainingSubtotal = summary.subtotal
    summary.lines.forEach((line, index) => {
      if (index === summary.lines.length - 1) {
        discountAmounts[index] = remainingDiscount
        return
      }

      remainingSubtotal -= line.amount
      const proportionalShare = roundedRatio(discount.value, line.amount, summary.subtotal)
      const minimumShare = Math.max(0, remainingDiscount - remainingSubtotal)
      const maximumShare = Math.min(line.amount, remainingDiscount)
      const lineDiscount = Math.max(minimumShare, Math.min(proportionalShare, maximumShare))
      discountAmounts[index] = lineDiscount
      remainingDiscount -= lineDiscount
    })
  }

  let discount_total = 0
  let tax_total = 0
  const calculatedLines = summary.lines.map((line, index) => {
    const discount_amount = discountAmounts[index]
    const discountedAmount = line.amount - discount_amount
    const tax = line.tax_id == null ? null : taxes.find((item) => item.id === line.tax_id)
    if (line.tax_id != null && !tax) {
      throw new Error(`Tax not found for line: ${line.tax_id}`)
    }
    const rate = tax?.rate_percent ?? 0
    if (!Number.isSafeInteger(rate) || rate < 0) {
      throw new TypeError('Tax rate must be a non-negative integer percentage.')
    }
    const tax_amount = roundedRatio(discountedAmount, rate, 100)
    discount_total += discount_amount
    tax_total += tax_amount
    if (!Number.isSafeInteger(discount_total) || !Number.isSafeInteger(tax_total)) {
      throw new RangeError('Invoice totals exceed the safe integer limit.')
    }
    return { ...line, amount: line.amount, discount_amount, tax_amount }
  })

  const total = summary.subtotal - discount_total + tax_total
  if (!Number.isSafeInteger(total)) {
    throw new RangeError('Invoice total exceeds the safe integer limit.')
  }

  return {
    lines: calculatedLines,
    subtotal: summary.subtotal,
    discount_total,
    tax_total,
    total,
  }
}

// Outstanding balance is the invoice total minus all payments already recorded.
export function getOutstanding(invoice) {
  assertPaise(invoice.total)
  assertPaise(invoice.amount_paid)
  const outstanding = invoice.total - invoice.amount_paid
  if (!Number.isSafeInteger(outstanding)) {
    throw new RangeError('Outstanding balance exceeds the safe integer limit.')
  }
  return outstanding
}

// An invoice is overdue only after its due date and while a confirmed balance remains.
export function isOverdue(invoice, today) {
  return invoice.status === 'confirmed' &&
    isISODate(invoice.due_date) &&
    isISODate(today) &&
    invoice.due_date < today &&
    getOutstanding(invoice) > 0
}