import { useState } from 'react'
import { Check } from 'lucide-react'
import PublicNav from '../components/PublicNav'
import { formatCurrency } from '../utils/format'

const plans = [
  { name: 'Starter', blurb: 'For a small shop sending its first recurring invoices.', price: 499 },
  { name: 'Business', blurb: 'For teams that bill every month and need taxes and discounts handled.', price: 999 },
  { name: 'Enterprise', blurb: 'For large companies on yearly contracts with several staff.', price: null },
]

const rows = [
  ['Products and plans', true, true, true],
  ['Active subscriptions', '25', 'Unlimited', 'Unlimited'],
  ['Invoices generated automatically', true, true, true],
  ['Tax and discount rules', false, true, true],
  ['Customer portal', false, true, true],
  ['Staff accounts', '1', '5', 'Unlimited'],
  ['Revenue dashboard', 'Basic', 'Full', 'Full'],
  ['Support', 'Email', 'Email and chat', 'Priority'],
]

const Cell = ({ v }) =>
  v === true ? <Check size={18} className="text-secondary" aria-label="Included" />
  : v === false ? <span className="sr-only">Not included</span>
  : <span>{v}</span>

export default function Pricing({ go, enter }) {
  const [yearly, setYearly] = useState(false)
  const price = (p) => (p == null ? 'Custom' : formatCurrency(yearly ? Math.round(p * 0.85) : p))

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNav go={go} enter={enter} />
      <section className="mx-auto max-w-5xl px-5 pb-10 pt-14 text-center">
        <h1 className="font-display text-5xl leading-tight text-primary sm:text-6xl">Pay for the invoices you stop typing.</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">Start small, move up when you need taxes, discounts and a customer portal. Cancel whenever you like.</p>
        <div className="mx-auto mt-8 inline-flex rounded-md border border-ink/20 bg-surface p-1 text-sm" role="group" aria-label="Billing period">
          {[['Monthly', false], ['Yearly, save 15%', true]].map(([label, val]) => (
            <button key={label} onClick={() => setYearly(val)} aria-pressed={yearly === val} className={`rounded px-4 py-2 transition ${yearly === val ? 'bg-primary text-white' : 'text-ink/70'}`}>{label}</button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl overflow-x-auto px-5 pb-24">
        <div className="min-w-[720px] border border-ink/20 bg-surface">
          <div className="grid grid-cols-4 border-b border-ink/20">
            <div />
            {plans.map((p) => (
              <div key={p.name} className="border-l border-ink/20 p-5">
                <h2 className="font-display text-2xl text-primary">{p.name}</h2>
                <p className="mt-1 min-h-[60px] text-sm text-ink/60">{p.blurb}</p>
                <p className="mt-3 text-3xl font-semibold text-primary">{price(p.price)}{p.price != null && <span className="text-sm font-normal text-ink/50"> /month</span>}</p>
                <button onClick={() => (p.price == null ? go('login') : enter('Admin'))} className="mt-4 w-full rounded-md bg-secondary py-2.5 text-sm font-medium text-white transition hover:bg-primary">
                  {p.price == null ? 'Talk to us' : 'Start with ' + p.name}
                </button>
              </div>
            ))}
          </div>
          {rows.map(([label, ...vals]) => (
            <div key={label} className="grid grid-cols-4 border-b border-ink/10 last:border-b-0">
              <div className="p-4 text-sm text-ink/80">{label}</div>
              {vals.map((v, i) => (
                <div key={i} className={`flex items-center border-l border-ink/10 p-4 text-sm ${v === false ? 'bg-ink/5' : ''}`}><Cell v={v} /></div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
