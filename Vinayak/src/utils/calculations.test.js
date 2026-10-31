import assert from 'node:assert/strict'
import {
  calculateInvoice,
  getOutstanding,
  isDiscountApplicable,
  isOverdue,
} from './calculations.js'

const today = '2026-10-31'
const taxes = [
  { id: 'gst-18', name: 'GST 18%', rate_percent: 18 },
  { id: 'gst-5', name: 'GST 5%', rate_percent: 5 },
]

function makeDiscount(overrides = {}) {
  return {
    id: 'discount-test',
    type: 'percent',
    value: 10,
    min_purchase: 0,
    min_qty: 0,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    usage_limit: 10,
    times_used: 0,
    ...overrides,
  }
}

const caseA = calculateInvoice({
  lines: [{ product_name: 'Item', qty: 10, unit_price: 50000, tax_id: 'gst-18' }],
  taxes,
  discount: makeDiscount(),
  today,
})
assert.equal(caseA.subtotal, 500000)
assert.equal(caseA.discount_total, 50000)
assert.equal(caseA.tax_total, 81000)
assert.equal(caseA.total, 531000)
assert.deepEqual(
  [caseA.lines[0].amount, caseA.lines[0].discount_amount, caseA.lines[0].tax_amount],
  [500000, 50000, 81000],
)

const caseB = calculateInvoice({
  lines: [{ product_name: 'Item', qty: 1, unit_price: 100000, tax_id: 'gst-18' }],
  taxes,
  discount: makeDiscount({ type: 'fixed', value: 20000, min_purchase: 100000 }),
  today,
})
assert.equal(caseB.discount_total, 20000)
assert.equal(caseB.tax_total, 14400)
assert.equal(caseB.total, 94400)

const caseC = calculateInvoice({
  lines: [
    { product_name: 'Five percent item', qty: 2, unit_price: 30000, tax_id: 'gst-5' },
    { product_name: 'Eighteen percent item', qty: 1, unit_price: 100000, tax_id: 'gst-18' },
  ],
  taxes,
  discount: null,
  today,
})
assert.equal(caseC.tax_total, 21000)
assert.equal(caseC.total, 181000)

const discountTestLines = [{ product_name: 'Item', qty: 5, unit_price: 50000, tax_id: 'gst-18' }]
const expiredDiscount = makeDiscount({ end_date: '2026-10-30' })
const overusedDiscount = makeDiscount({ usage_limit: 2, times_used: 2 })
assert.equal(isDiscountApplicable(expiredDiscount, discountTestLines, today), false)
assert.equal(isDiscountApplicable(overusedDiscount, discountTestLines, today), false)
for (const ignoredDiscount of [expiredDiscount, overusedDiscount]) {
  const result = calculateInvoice({ lines: discountTestLines, taxes, discount: ignoredDiscount, today })
  assert.equal(result.discount_total, 0)
}

assert.equal(getOutstanding({ total: 531000, amount_paid: 100000 }), 431000)
assert.equal(isOverdue({ status: 'confirmed', due_date: '2026-10-30', total: 1000, amount_paid: 0 }, today), true)
assert.equal(isOverdue({ status: 'confirmed', due_date: today, total: 1000, amount_paid: 0 }, today), false)
assert.equal(isOverdue({ status: 'confirmed', due_date: '2026-10-30', total: 1000, amount_paid: 1000 }, today), false)

console.log('Calculation engine tests passed')