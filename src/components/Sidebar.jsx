import { LayoutDashboard, Package, Layers, Users, Repeat, FileText, CreditCard, X } from 'lucide-react'

// roles: which roles see the link (demo role switcher, enforce real access in Supabase RLS)
export const navGroups = [
  { label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Staff'] }] },
  { label: 'Catalogue', items: [
    { id: 'products', label: 'Products', icon: Package, roles: ['Admin', 'Staff'] },
    { id: 'plans', label: 'Plans', icon: Layers, roles: ['Admin', 'Staff'] },
  ] },
  { label: 'Customers', items: [
    { id: 'customers', label: 'Customers', icon: Users, roles: ['Admin', 'Staff'] },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat, roles: ['Admin', 'Staff', 'Customer'] },
  ] },
  { label: 'Billing', items: [
    { id: 'invoices', label: 'Invoices', icon: FileText, roles: ['Admin', 'Staff', 'Customer'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: ['Admin', 'Staff'] },
  ] },
]

export default function Sidebar({ page, onNavigate, role, onRoleChange, open, onClose, onHome }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-ink/15 bg-canvas px-5 py-6 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <button onClick={onHome} className="font-display text-xl font-semibold text-primary">BrightEmpathix</button>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          {navGroups.map((g) => {
            const items = g.items.filter((i) => i.roles.includes(role))
            if (!items.length) return null
            return (
              <div key={g.label} className="mt-6 first:mt-0">
                <p className="pb-1 text-xs text-ink/40">{g.label}</p>
                {items.map(({ id, label, icon: Icon }) => {
                  const active = page === id
                  return (
                    <button
                      key={id}
                      onClick={() => { onNavigate(id); onClose() }}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 border-l-2 py-2 pl-3 text-sm transition ${
                        active ? 'border-secondary font-semibold text-primary' : 'border-transparent text-ink/60 hover:text-primary'
                      }`}
                    >
                      <Icon size={16} /> {label}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-ink/15 pt-4">
          <label className="text-xs text-ink/50" htmlFor="role">Viewing as</label>
          <select id="role" value={role} onChange={(e) => onRoleChange(e.target.value)} className="mt-1 w-full rounded-md border border-ink/15 bg-surface px-2 py-1.5 text-sm">
            {['Admin', 'Staff', 'Customer'].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </aside>
    </>
  )
}
