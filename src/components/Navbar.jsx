import { Menu, Search } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navbar({ title, onMenu }) {
  return (
    <header className="flex h-16 items-center gap-4 px-4 lg:px-10">
      <button className="lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={22} /></button>
      {title && <h1 className="font-display text-2xl text-primary">{title}</h1>}
      <label className="ml-auto flex items-center gap-2 border-b border-ink/20 pb-1 focus-within:border-accent">
        <Search size={15} className="text-ink/40" />
        <input placeholder="Search customers or invoices" className="w-40 bg-transparent text-sm outline-none placeholder:text-ink/40 sm:w-64" />
      </label>
      <ThemeSwitcher />
    </header>
  )
}
