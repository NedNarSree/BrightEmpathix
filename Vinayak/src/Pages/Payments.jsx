import { useState } from 'react'
import { invoices, payments } from '../data/mockData.js'

const pageStyle = {
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '100vh',
  padding: '24px',
  background: '#F3F7F2',
  color: '#0F261F',
  textAlign: 'left',
}

const headingStyle = {
  margin: '0 0 16px',
  color: '#0F261F',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.25,
}

const wrapperStyle = {
  overflowX: 'auto',
  background: '#fff',
  border: '1px solid #D9E4DA',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgb(15 38 31 / 8%)',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
}

const headerCellStyle = {
  padding: '12px 16px',
  color: '#0F261F',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  borderBottom: '1px solid #D9E4DA',
}

const bodyCellStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #E8EEE8',
  whiteSpace: 'nowrap',
}

function Payments() {
  const [currentInvoices, setCurrentInvoices] = useState(invoices)
  const [paymentHistory, setPaymentHistory] = useState(payments)
  const pendingInvoices = currentInvoices.filter((invoice) => invoice.status !== 'paid')

  function processPayment(invoiceId, timestamp) {
    const invoice = currentInvoices.find((item) => item.id === invoiceId)
    if (!invoice) {
      return
    }

    const payment = {
      id: `pay_${timestamp}`,
      invoice_id: invoiceId,
      method: 'credit_card',
      amount: invoice.total,
      date: new Date().toISOString().split('T')[0],
    }
    const updatedInvoice = { ...invoice, status: 'paid', amount_paid: invoice.total }

    setPaymentHistory((history) => [...history, payment])
    setCurrentInvoices((items) => items.map((item) => item.id === invoiceId ? updatedInvoice : item))
    window.alert('Payment successful!')
  }

  return (
    <main style={pageStyle}>
      <section style={{ marginBottom: '32px' }}>
        <h1 style={headingStyle}>Pending Invoices</h1>
        <div style={wrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Invoice Number</th>
                <th style={headerCellStyle}>Due Date</th>
                <th style={{ ...headerCellStyle, textAlign: 'right' }}>Total</th>
                <th style={{ ...headerCellStyle, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingInvoices.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...bodyCellStyle, padding: '24px 16px', color: '#52665A', textAlign: 'center' }}>
                    No pending invoices.
                  </td>
                </tr>
              ) : pendingInvoices.map((invoice, index) => (
                <tr key={invoice.id ?? `${invoice.number}-${index}`}>
                  <td style={bodyCellStyle}>{invoice.number}</td>
                  <td style={bodyCellStyle}>{invoice.due_date}</td>
                  <td style={{ ...bodyCellStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {`₹${(invoice.total / 100).toFixed(2)}`}
                  </td>
                  <td style={{ ...bodyCellStyle, textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => processPayment(invoice.id, Date.now())}
                      style={{ padding: '8px 14px', border: 0, borderRadius: '4px', background: '#00592E', color: '#fff', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={headingStyle}>Recent Payments</h2>
        <div style={wrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Payment ID</th>
                <th style={headerCellStyle}>Invoice ID</th>
                <th style={headerCellStyle}>Date</th>
                <th style={{ ...headerCellStyle, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...bodyCellStyle, padding: '24px 16px', color: '#52665A', textAlign: 'center' }}>
                    No payments recorded yet.
                  </td>
                </tr>
              ) : paymentHistory.map((payment, index) => (
                <tr key={payment.id ?? index}>
                  <td style={bodyCellStyle}>{payment.id}</td>
                  <td style={bodyCellStyle}>{payment.invoice_id}</td>
                  <td style={bodyCellStyle}>{payment.date}</td>
                  <td style={{ ...bodyCellStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {`₹${(payment.amount / 100).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default Payments