export const taxes = [
  { id: 'tax-gst-18', name: 'GST 18%', rate_percent: 18 },
  { id: 'tax-gst-5', name: 'GST 5%', rate_percent: 5 },
]

export const discounts = [
  {
    id: 'discount-volume-10',
    type: 'percent',
    value: 10,
    min_purchase: 0,
    min_qty: 5,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    usage_limit: 100,
    times_used: 0,
  },
  {
    id: 'discount-purchase-20000',
    type: 'fixed',
    value: 20000,
    min_purchase: 100000,
    min_qty: 0,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    usage_limit: 50,
    times_used: 0,
  },
]

export const subscriptions = [
  {
    id: 'sub-001',
    number: 'SUB-2026-001',
    customer_id: 'customer-101',
    plan_id: 'plan-daily',
    start_date: '2026-10-01',
    expiry_date: '2026-12-31',
    status: 'active',
    payment_terms_days: 7,
    billing_period: 'daily',
    lines: [
      { product_name: 'Daily Workspace', qty: 1, unit_price: 5000, tax_id: 'tax-gst-18' },
    ],
  },
  {
    id: 'sub-002',
    number: 'SUB-2026-002',
    customer_id: 'customer-102',
    plan_id: 'plan-weekly',
    start_date: '2026-10-05',
    expiry_date: '2027-01-04',
    status: 'active',
    payment_terms_days: 14,
    billing_period: 'weekly',
    lines: [
      { product_name: 'Weekly Workspace', qty: 2, unit_price: 12500, tax_id: 'tax-gst-18' },
      { product_name: 'Priority Support', qty: 1, unit_price: 4000, tax_id: 'tax-gst-5' },
    ],
    discount_id: 'discount-volume-10',
  },
  {
    id: 'sub-003',
    number: 'SUB-2026-003',
    customer_id: 'customer-103',
    plan_id: 'plan-monthly',
    start_date: '2026-10-15',
    expiry_date: '2027-10-14',
    status: 'active',
    payment_terms_days: 30,
    billing_period: 'monthly',
    lines: [
      { product_name: 'Monthly Workspace', qty: 5, unit_price: 30000, tax_id: 'tax-gst-18' },
    ],
    discount_id: 'discount-purchase-20000',
  },
  {
    id: 'sub-004',
    number: 'SUB-2026-004',
    customer_id: 'customer-104',
    plan_id: 'plan-yearly',
    start_date: '2026-01-01',
    expiry_date: '2026-12-31',
    status: 'active',
    payment_terms_days: 30,
    billing_period: 'yearly',
    lines: [
      { product_name: 'Annual Workspace', qty: 1, unit_price: 240000, tax_id: 'tax-gst-18' },
      { product_name: 'Data Retention', qty: 1, unit_price: 30000, tax_id: 'tax-gst-5' },
    ],
  },
]

// Invoices and payments are empty until the billing workflow creates records.
export const invoices = []
export const payments = []