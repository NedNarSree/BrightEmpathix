import assert from 'node:assert/strict'
import { getNextPeriod, isDueForBilling, runBilling } from './billing.js'

const today = '2026-10-31'
const taxes = [{ id: 'tax-18', name: 'GST 18%', rate_percent: 18 }]
const discounts = []
const subscription = {
  id: 'sub-test-001',
  number: 'SUB-TEST-001',
  customer_id: 'customer-test-001',
  plan_id: 'plan-daily',
  start_date: today,
  expiry_date: '2026-11-02',
  status: 'active',
  payment_terms_days: 7,
  billing_period: 'daily',
  lines: [{ product_name: 'Daily Workspace', qty: 1, unit_price: 50000, tax_id: 'tax-18' }],
}

assert.deepEqual(getNextPeriod(subscription, []), {
  period_start: today,
  period_end: today,
})
assert.equal(isDueForBilling(subscription, [], today), true)

const firstRun = runBilling([subscription], taxes, discounts, [], today)
assert.equal(firstRun.created.length, 1)
assert.deepEqual(firstRun.skipped, [])
assert.equal(firstRun.created[0].status, 'draft')
assert.equal(firstRun.created[0].amount_paid, 0)
assert.equal(firstRun.created[0].total, 59000)

// Reusing the first run's invoices proves the same subscription period cannot bill twice.
const secondRun = runBilling([subscription], taxes, discounts, firstRun.created, today)
assert.deepEqual(secondRun, {
  created: [],
  skipped: [{
    subscription_id: subscription.id,
    period_start: today,
    reason: 'already billed',
  }],
})

const missedPeriodsSubscription = {
  ...subscription,
  id: 'sub-test-missed',
  start_date: '2026-10-29',
  expiry_date: today,
}
const catchUpRun = runBilling([missedPeriodsSubscription], taxes, discounts, [], today)
assert.equal(catchUpRun.created.length, 3)
assert.deepEqual(catchUpRun.created.map((invoice) => invoice.period_start), [
  '2026-10-29',
  '2026-10-30',
  today,
])

console.log('Billing duplicate-prevention tests passed')