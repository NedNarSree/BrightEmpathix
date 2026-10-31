import PublicNav from '../components/PublicNav'

const steps = [
  ['Set up a plan', 'Add a product, give it variants and a price, then decide how often it bills: daily, weekly, monthly or yearly.'],
  ['Start a subscription', 'Pick a customer and a plan. It gets its own number and moves from Draft to Active, and anyone on the team can see where it stands.'],
  ['Invoice on billing day', 'One click creates every invoice that is due. Customer, lines, tax and discounts are already filled in, and nothing is billed twice.'],
  ['Record the payment', 'Log the method, amount and date against the invoice. It flips to Paid when the balance reaches zero.'],
  ['See where you stand', 'Active subscriptions, cash collected, what is owed and which invoices are late, all on one page.'],
]

const before = [
  ['Subscriptions live in a spreadsheet', 'Every subscription has a number, a status and an expiry date'],
  ['Renewals get remembered by whoever notices first', 'Renewals are listed with dates, so nobody has to remember'],
  ['Invoices are typed by hand every month', 'Invoices are generated from the subscription'],
  ['Payments are matched by scrolling bank statements', 'Payments are recorded against the invoice they belong to'],
  ['Revenue reports are built at the end of the quarter', 'The dashboard is the report, and it is current'],
]

export default function Landing({ go, enter }) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-highlight/70 via-accent/15 to-transparent" />
        <div className="relative">
          <PublicNav go={go} enter={enter} />
          <section className="mx-auto max-w-4xl px-5 pb-24 pt-20 text-center">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-primary sm:text-7xl">
              Billing that doesn’t wait for someone to remember.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70">
              BrightEmpathix turns plans into subscriptions, subscriptions into invoices and invoices into money in the bank. No spreadsheets, no hand-typed totals.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <button onClick={() => enter('Admin')} className="rounded-md bg-secondary px-6 py-3 font-medium text-white transition hover:bg-primary">Open the demo</button>
              <button onClick={() => go('pricing')} className="rounded-md border border-primary/30 bg-surface/70 px-6 py-3 font-medium text-primary transition hover:bg-surface">See pricing</button>
            </div>
          </section>

          <div className="mx-auto max-w-3xl px-5 pb-20">
            <div className="rounded-xl bg-surface p-6 shadow-xl shadow-primary/10 sm:p-8">
              <p className="font-display text-2xl leading-snug text-primary">₹1,96,340 is still owed across 21 invoices, and 9 of them are past due.</p>
              <table className="mt-5 w-full text-left text-sm">
                <tbody>
                  {[['Backwater Cafe', 'INV-1039', '21 days', '₹1,179'], ['Marine Tech Ltd', 'INV-1034', '16 days', '₹15,964'], ['Periyar Labs', 'INV-1031', '12 days', '₹5,994']].map((r) => (
                    <tr key={r[1]} className="border-t border-ink/10">
                      <td className="py-2.5 font-medium text-primary">{r[0]}</td>
                      <td className="py-2.5 text-ink/50">{r[1]}</td>
                      <td className="py-2.5 text-ink/70">{r[2]} late</td>
                      <td className="py-2.5 text-right">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-24 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="font-display text-4xl leading-tight text-primary lg:sticky lg:top-8">One billing month, start to finish.</h2>
        </div>
        <ol className="divide-y divide-ink/15 border-y border-ink/15">
          {steps.map(([t, d], i) => (
            <li key={t} className="flex gap-5 py-6">
              <span className="font-display text-2xl text-accent">{i + 1}</span>
              <div>
                <h3 className="text-lg font-semibold text-primary">{t}</h3>
                <p className="mt-1 text-ink/70">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-2xl font-display text-4xl leading-tight text-primary">What stops being manual.</h2>
          <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {before.map(([a, b]) => (
              <div key={a} className="grid gap-2 py-5 md:grid-cols-2 md:gap-10">
                <p className="text-ink/50 line-through decoration-ink/30">{a}</p>
                <p className="font-medium text-primary">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-center text-white">
        <h2 className="mx-auto max-w-2xl px-5 font-display text-4xl leading-tight">Try it on sample data. It takes two minutes.</h2>
        <button onClick={() => enter('Admin')} className="mt-8 rounded-md bg-highlight px-6 py-3 font-medium text-primary transition hover:bg-white">Open the demo</button>
      </section>
      <footer className="px-5 py-8 text-center text-sm text-ink/50">BrightEmpathix, a subscription billing platform.</footer>
    </div>
  )
}
