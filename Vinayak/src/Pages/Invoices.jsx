import { runBilling } from '../utils/billing.js'
import { useState, useEffect } from 'react';
import { supabase } from "../supabase";

const pageStyle = {
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '100vh',
  padding: '24px',
  background: '#F3F7F2',
  color: '#172820',
  textAlign: 'left',
}

const headingStyle = {
  margin: '0 0 24px',
  color: '#0F261F',
  fontSize: '30px',
  fontWeight: 600,
  lineHeight: 1.2,
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

function Invoices({ invoices, setInvoices, subscriptions, taxes, discounts }) {
  function handleRunBilling() {
    const result = runBilling(subscriptions, taxes, discounts, invoices, '2026-10-31')
    setInvoices((currentInvoices) => [...currentInvoices, ...result.created])
    window.alert(`${result.created.length} invoices created and ${result.skipped.length} skipped.`)
  }

  return (
    <main className="p-6 bg-[#F3F7F2] min-h-screen text-[#172820]" style={pageStyle}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <h1 className="text-[#0F261F] font-semibold" style={headingStyle}>Invoices</h1>
        <button
          className="px-4 py-2 rounded bg-[#00592E] text-white font-medium hover:opacity-90"
          style={{ padding: '8px 16px', border: 0, borderRadius: '4px', background: '#00592E', color: '#fff', fontWeight: 500, cursor: 'pointer' }}
          type="button"
          onClick={handleRunBilling}
        >
          Run Auto-Billing
        </button>
      </header>

      <div className="bg-white border border-[#D9E4DA] rounded shadow-sm" style={wrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th className="text-[#0F261F] font-semibold" style={headerCellStyle}>Invoice Number</th>
              <th className="text-[#0F261F] font-semibold" style={headerCellStyle}>Period Start</th>
              <th className="text-[#0F261F] font-semibold" style={headerCellStyle}>Due Date</th>
              <th className="text-[#0F261F] font-semibold" style={headerCellStyle}>Status</th>
              <th className="text-[#0F261F] font-semibold" style={{ ...headerCellStyle, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...bodyCellStyle, padding: '28px 16px', color: '#52665A', textAlign: 'center' }}>
                  No invoices yet. Run auto-billing to generate invoices for active subscriptions.
                </td>
              </tr>
            ) : invoices.map((invoice, index) => (
              <tr key={invoice.id ?? `${invoice.subscription_id}-${invoice.period_start}-${index}`}>
                <td style={bodyCellStyle}>{invoice.number}</td>
                <td style={bodyCellStyle}>{invoice.period_start}</td>
                <td style={bodyCellStyle}>{invoice.due_date}</td>
                <td style={bodyCellStyle}>
                  <span
                    className="px-2 py-1 rounded text-sm bg-[#B5FFC2] text-[#0F261F]"
                    style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', background: '#B5FFC2', color: '#0F261F', fontSize: '14px', lineHeight: 1.2 }}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td style={{ ...bodyCellStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {`₹${(invoice.total / 100).toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Invoices