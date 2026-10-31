// Single swap point. Replace the body with Supabase queries later, keep the return shape.
// Revenue = sum of payments (not invoice totals). Outstanding = sum(max(total - amount_paid, 0)).
const day = 864e5
const daysAgo = (n) => new Date(Date.now() - n * day).toISOString().slice(0, 10)
const daysAhead = (n) => new Date(Date.now() + n * day).toISOString().slice(0, 10)

export async function getDashboardSummary() {
  return {
    activeSubscriptions: 128,
    closedThisMonth: 3,
    revenueCollected: 842500,
    outstandingAmount: 196340,
    openInvoices: 21,
    overdueCount: 9,
    dueForBilling: 12,
    monthlyRevenue: [
      { month: 'May', collected: 98000, billed: 120000 },
      { month: 'Jun', collected: 126000, billed: 141000 },
      { month: 'Jul', collected: 139500, billed: 158000 },
      { month: 'Aug', collected: 152000, billed: 171000 },
      { month: 'Sep', collected: 163000, billed: 190000 },
      { month: 'Oct', collected: 164000, billed: 203000 },
    ],
    overdue: [
      { invoice_number: 'INV-1039', customer: 'Backwater Cafe', due_date: daysAgo(21), balance: 1178.82 },
      { invoice_number: 'INV-1034', customer: 'Marine Tech Ltd', due_date: daysAgo(16), balance: 15964 },
      { invoice_number: 'INV-1031', customer: 'Periyar Labs', due_date: daysAgo(12), balance: 5994 },
      { invoice_number: 'INV-1029', customer: 'Lotus Traders', due_date: daysAgo(6), balance: 11988 },
      { invoice_number: 'INV-1027', customer: 'Kovalam Stays', due_date: daysAgo(3), balance: 8820 },
    ],
    upcomingRenewals: [
      { customer: 'Lotus Traders', plan: 'Business Pro, monthly', date: daysAhead(2), amount: 11988 },
      { customer: 'Periyar Labs', plan: 'Starter, yearly', date: daysAhead(5), amount: 5994 },
      { customer: 'Marine Tech Ltd', plan: 'Business Pro, monthly', date: daysAhead(7), amount: 35964 },
    ],
    recentPayments: [
      { customer: 'Kerala Spices Co.', method: 'UPI', date: daysAgo(1), amount: 2157.84 },
      { customer: 'Marine Tech Ltd', method: 'Bank transfer', date: daysAgo(3), amount: 20000 },
      { customer: 'Lotus Traders', method: 'Card', date: daysAgo(5), amount: 11988 },
      { customer: 'Periyar Labs', method: 'Cash', date: daysAgo(7), amount: 5994 },
    ],
  }
}
