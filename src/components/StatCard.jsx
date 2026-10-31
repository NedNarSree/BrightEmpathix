import { ArrowUpRight } from 'lucide-react'

// filled = dark gradient hero card. No metric labels hard-coded inside.
export default function StatCard({ title, value, note, filled = false, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`rounded-2xl p-5 text-left transition ${
        filled ? 'bg-gradient-to-br from-secondary to-primary text-white' : 'bg-surface text-primary hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-medium ${filled ? 'text-white/90' : 'text-ink/70'}`}>{title}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${filled ? 'border-white bg-white text-primary' : 'border-primary/30'}`}>
          <ArrowUpRight size={16} />
        </span>
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
      {note && <p className={`mt-3 text-xs ${filled ? 'text-highlight' : 'text-accent'}`}>{note}</p>}
    </Tag>
  )
}
