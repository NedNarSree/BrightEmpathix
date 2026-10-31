<import { useState } from 'react'
import Subscriptions from './Pages/Subscriptions'
import Invoices from './Pages/Invoices'
import Payments from './Pages/Payments'
import {
  discounts,
  invoices as initialInvoices,
  payments as initialPayments,
  subscriptions,
  taxes,
} from './data/mockData.js'

function App() {
  const [activePage, setActivePage] = useState('subscriptions')
  const [sharedInvoices, setSharedInvoices] = useState(initialInvoices)
  const [sharedPayments, setSharedPayments] = useState(initialPayments)

  return (
    <>
      <nav>
        <button onClick={() => setActivePage('subscriptions')}>Subscriptions</button>
        <button onClick={() => setActivePage('invoices')}>Invoices</button>
        <button onClick={() => setActivePage('payments')}>Payments</button>
      </nav>

      {activePage === 'subscriptions' && <Subscriptions />}

      {activePage === 'invoices' && (
        <Invoices
          invoices={sharedInvoices}
          setInvoices={setSharedInvoices}
          subscriptions={subscriptions}
          taxes={taxes}
          discounts={discounts}
        />
      )}

      {activePage === 'payments' && (
        <Payments
          invoices={sharedInvoices}
          setInvoices={setSharedInvoices}
          payments={sharedPayments}
          setPayments={setSharedPayments}
        />
      )}
    </>
  )
}

export default App>>>> main
