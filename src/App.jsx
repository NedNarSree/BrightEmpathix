
import { useEffect, useState } from 'react'

import Sidebar, { navGroups } from './components/Sidebar'
import Navbar from './components/Navbar'

import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'

import Products from './Pages/Products'
import Plans from './Pages/Plans'

import './App.css'

const Placeholder = ({ name }) => (
  <div className="rounded-lg border border-dashed border-ink/25 p-10 text-center text-ink/60">
    The {name} page is coming from its owner.
  </div>
)

const labels = Object.fromEntries(
  navGroups.flatMap((g) =>
    g.items.map((i) => [i.id, i.label])
  )
)

export default function App() {
  const [view, setView] = useState('landing')
  const [page, setPage] = useState('dashboard')
  const [role, setRole] = useState('Admin')
  const [menuOpen, setMenuOpen] = useState(false)

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Business Pro',
      type: 'Software',
      salesPrice: 999,
      costPrice: 450,
      notes: 'Monthly business software subscription',
    },
    {
      id: 2,
      name: 'Enterprise Suite',
      type: 'Service',
      salesPrice: 2499,
      costPrice: 1200,
      notes: 'Enterprise management package',
    },
  ])

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Business Pro Monthly',
      productId: '1',
      billingCycle: 'Monthly',
      price: 999,
      minQuantity: 1,
      availableFrom: '2026-01-01',
      availableTo: '',
    },
    {
      id: 2,
      name: 'Enterprise Yearly',
      productId: '2',
      billingCycle: 'Yearly',
      price: 24999,
      minQuantity: 1,
      availableFrom: '2026-01-01',
      availableTo: '',
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const changeRole = (r) => {
    setRole(r)
    setPage(r === 'Customer' ? 'invoices' : 'dashboard')
  }

  const enterApp = (r = 'Admin') => {
    changeRole(r)
    setView('app')
  }

  if (view === 'landing') return <Landing go={setView} enter={enterApp} />
  if (view === 'pricing') return <Pricing go={setView} enter={enterApp} />
  if (view === 'login') return <Auth go={setView} enter={enterApp} />

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    products: (
      <Products
        products={products}
        setProducts={setProducts}
        plans={plans}
      />
    ),
    plans: (
      <Plans
        products={products}
        plans={plans}
        setPlans={setPlans}
      />
    ),
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        page={page}
        onNavigate={setPage}
        role={role}
        onRoleChange={changeRole}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onHome={() => setView('landing')}
      />

      <div className="lg:pl-60">
        <Navbar
          title={page === 'dashboard' ? '' : labels[page]}
          onMenu={() => setMenuOpen(true)}
        />

        <main className="px-4 pb-16 pt-4 lg:px-10">
          {pages[page] || (
            <Placeholder name={labels[page] || page} />
          )}
        </main>
      </div>
    </div>
  )
}

