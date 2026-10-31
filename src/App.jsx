import { useEffect, useState } from 'react'
import Sidebar, { navGroups } from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'

// When teammates push their pages, import them here and replace the Placeholder:
// import Products from './pages/Products'  ...  then: products: <Products />
const Placeholder = ({ name }) => (
  <div className="rounded-lg border border-dashed border-ink/25 p-10 text-center text-ink/60">
    The {name} page is coming from its owner. Import it in App.jsx.
  </div>
)

const labels = Object.fromEntries(navGroups.flatMap((g) => g.items).map((i) => [i.id, i.label]))

export default function App() {
  const [view, setView] = useState('landing') // landing | pricing | login | app
  const [page, setPage] = useState('dashboard')
  const [role, setRole] = useState('Admin')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [view])

  const changeRole = (r) => {
    setRole(r)
    setPage(r === 'Customer' ? 'invoices' : 'dashboard') // customers never see the dashboard
  }
  const enterApp = (r = 'Admin') => { changeRole(r); setView('app') }

  if (view === 'landing') return <Landing go={setView} enter={enterApp} />
  if (view === 'pricing') return <Pricing go={setView} enter={enterApp} />
  if (view === 'login') return <Auth go={setView} enter={enterApp} />

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    // products: <Products />, plans: <Plans />, customers: <Customers />,
    // subscriptions: <Subscriptions />, invoices: <Invoices />, payments: <Payments />,
  }

  return (
    <div className="min-h-screen">
      <Sidebar page={page} onNavigate={setPage} role={role} onRoleChange={changeRole} open={menuOpen} onClose={() => setMenuOpen(false)} onHome={() => setView('landing')} />
      <div className="lg:pl-60">
        <Navbar title={page === 'dashboard' ? '' : labels[page]} onMenu={() => setMenuOpen(true)} />
        <main className="px-4 pb-16 pt-4 lg:px-10">{pages[page] || <Placeholder name={labels[page]} />}</main>
      </div>
    </div>
  )
}
