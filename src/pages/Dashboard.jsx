import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getDashboardSummary } from '../lib/dashboardData'
import { useTheme } from '../theme/ThemeProvider'
import { formatCurrency, formatDate } from '../utils/format'

const daysBetween = (d) => Math.round((Date.now() - new Date(d)) / 864e5)
const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}
const ago = (d) => {
  const n = daysBetween(d)
  return n <= 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`
}

const Heading = ({ children, link, onLink }) => (
  <div className="mb-3 flex items-baseline justify-between border-b border-ink/15 pb-2">
    <h2 className="font-display text-xl text-primary">{children}</h2>
    {link && <button onClick={onLink} className="text-sm text-accent underline-offset-4 hover:underline">{link}</button>}
  </div>
)

export default function Dashboard({ onNavigate }) {
  const { theme } = useTheme()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [reminded, setReminded] = useState({})

  useEffect(() => {
    getDashboardSummary().then(setData).catch(() => setError('Could not load dashboard data. Refresh to try again.'))
  }, [])

  if (error) return <p className="rounded-lg bg-red-600/10 p-4 text-sm text-red-700">{error}</p>
  if (!data) return <div className="h-96 animate-pulse rounded-lg bg-ink/5" />

  const last = data.monthlyRevenue[data.monthlyRevenue.length - 1]
  const rate = Math.round((last.collected / last.billed) * 100)
  const hiddenOverdue = data.overdueCount - data.overdue.length

  return (
    <div>
      <p className="max-w-3xl font-display text-3xl leading-snug text-primary sm:text-4xl">
        {greeting()}. {formatCurrency(data.outstandingAmount)} is still owed across {data.openInvoices} invoices,
        and {data.overdueCount} of them are past due.
      </p>
      <p className="mt-3 text-ink/60">
        {last.month} so far: {formatCurrency(last.collected)} collected, which is {rate}% of what was billed.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-12">
          <section>
            <Heading link="All invoices" onLink={() => onNavigate('invoices')}>Needs chasing</Heading>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-ink/50">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Customer</th>
                    <th className="py-2 pr-4 font-medium">Invoice</th>
                    <th className="py-2 pr-4 font-medium">Late by</th>
                    <th className="py-2 pr-4 text-right font-medium">Balance</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {data.overdue.map((o) => (
                    <tr key={o.invoice_number} className="border-t border-ink/10">
                      <td className="py-3 pr-4 font-medium text-primary">{o.customer}</td>
                      <td className="py-3 pr-4 text-ink/60">{o.invoice_number}</td>
                      <td className={`py-3 pr-4 ${daysBetween(o.due_date) > 14 ? 'font-medium text-red-700' : ''}`}>{daysBetween(o.due_date)} days</td>
                      <td className="py-3 pr-4 text-right">{formatCurrency(o.balance)}</td>
                      <td className="py-3 text-right">
                        {reminded[o.invoice_number]
                          ? <span className="text-ink/50">Reminder sent</span>
                          : <button onClick={() => setReminded((r) => ({ ...r, [o.invoice_number]: true }))} className="text-accent underline-offset-4 hover:underline">Send reminder</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hiddenOverdue > 0 && <p className="mt-2 text-sm text-ink/50">and {hiddenOverdue} more, smaller or newer ones.</p>}
          </section>

          <section>
            <Heading>Money in, month by month</Heading>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={`${theme.text}18`} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="billed" name="Billed" stroke={`${theme.text}77`} strokeDasharray="4 4" fill="none" />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke={theme.secondary} strokeWidth={2.5} fill={theme.highlight} fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-sm text-ink/60">Solid line is cash collected. Dashed line is what was billed.</p>
          </section>
        </div>

        <aside className="space-y-10 lg:border-l lg:border-ink/15 lg:pl-10">
          <section>
            <p className="font-display text-6xl text-primary">{data.dueForBilling}</p>
            <p className="mt-1 text-ink/70">subscriptions are ready to be invoiced.</p>
            <button onClick={() => onNavigate('invoices')} className="mt-4 rounded-md bg-secondary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary">
              Run billing
            </button>
            <p className="mt-2 text-xs text-ink/50">Each subscription is billed once per period.</p>
          </section>

          <section>
            <Heading>This month</Heading>
            <dl className="space-y-2 text-sm">
              {[
                ['Active subscriptions', data.activeSubscriptions],
                ['Billed', formatCurrency(last.billed)],
                ['Collected', formatCurrency(last.collected)],
                ['Closed', data.closedThisMonth],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-ink/60">{k}</dt><dd className="font-medium text-primary">{v}</dd></div>
              ))}
            </dl>
          </section>

          <section>
            <Heading>Coming up</Heading>
            <ul className="space-y-3 text-sm">
              {data.upcomingRenewals.map((r) => (
                <li key={r.customer} className="flex gap-3">
                  <span className="w-12 shrink-0 text-ink/50">{formatDate(r.date).slice(0, 6)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-primary">{r.customer}</span>
                    <span className="text-ink/50">{r.plan}</span>
                  </span>
                  <span>{formatCurrency(r.amount)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Heading link="Record one" onLink={() => onNavigate('payments')}>Latest payments</Heading>
            <ul className="space-y-3 text-sm">
              {data.recentPayments.map((p) => (
                <li key={p.customer + p.date} className="flex justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-primary">{p.customer}</span>
                    <span className="text-ink/50">{p.method}, {ago(p.date)}</span>
                  </span>
                  <span>{formatCurrency(p.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
