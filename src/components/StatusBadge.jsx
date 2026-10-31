import { statusColors } from '../theme/themes'

// Shared by every page: <StatusBadge status="Paid" />
export default function StatusBadge({ status }) {
  const c = statusColors[status] || '#6B7280'
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color: c, backgroundColor: `${c}1A` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c }} />
      {status}
    </span>
  )
}
