import { useState } from 'react'
import { discounts, invoices as initialInvoices, payments as initialPayments, subscriptions, taxes } from './data/mockData.js'
import Invoices from './Pages/Invoices.jsx'
import Payments from './Pages/Payments.jsx'

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  background: '#0F261F',
}

const buttonStyle = {
  padding: '8px 14px',
  border: '1px solid transparent',
  borderRadius: '4px',
  fontSize: '15px',
  fontWeight: 500,
  cursor: 'pointer',
}

function App() {
  const [activePage, setActivePage] = useState('invoices')
  const [sharedInvoices, setSharedInvoices] = useState(initialInvoices)
  const [sharedPayments, setSharedPayments] = useState(initialPayments)

  return (
    <>
      <nav aria-label="Billing pages" style={navStyle}>
        <button
          type="button"
          aria-current={activePage === 'invoices' ? 'page' : undefined}
          onClick={() => setActivePage('invoices')}
          style={{ ...buttonStyle, background: activePage === 'invoices' ? '#00592E' : 'transparent', color: '#fff' }}
        >
          Invoices
        </button>
        <button
          type="button"
          aria-current={activePage === 'payments' ? 'page' : undefined}
          onClick={() => setActivePage('payments')}
          style={{ ...buttonStyle, background: activePage === 'payments' ? '#00592E' : 'transparent', color: '#fff' }}
        >
          Payments
        </button>
      </nav>
      {activePage === 'invoices' ? (
        <Invoices
          invoices={sharedInvoices}
          setInvoices={setSharedInvoices}
          subscriptions={subscriptions}
          taxes={taxes}
          discounts={discounts}
        />
      ) : (
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

export default App