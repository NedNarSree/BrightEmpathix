// Five palettes from the BrightEmpathix colour-theme PDF.
// Add a theme here and it shows up in the switcher automatically.
export const themes = {
  midnightIndigo: { label: 'Midnight Indigo', primary: '#0D2B52', secondary: '#202D85', accent: '#0D75FF', highlight: '#96BFE6', bg: '#F4F7FC', text: '#172033' },
  electricViolet: { label: 'Electric Violet', primary: '#06004F', secondary: '#340059', accent: '#4733FF', highlight: '#9C52F2', bg: '#F6F4FF', text: '#211B35' },
  emeraldLedger:  { label: 'Emerald Ledger',  primary: '#0F261F', secondary: '#00592E', accent: '#417777', highlight: '#B5FFC2', bg: '#F3F7F2', text: '#172820' },
  roseQuartz:     { label: 'Rose Quartz',     primary: '#5C2C45', secondary: '#9E194D', accent: '#D94D99', highlight: '#FFB3F0', bg: '#FFF5F8', text: '#382331' },
  amberSlate:     { label: 'Amber & Slate',   primary: '#0D2B52', secondary: '#003E83', accent: '#C05200', highlight: '#FFBF6E', bg: '#FFF8EB', text: '#252B35' },
}

export const DEFAULT_THEME = 'emeraldLedger'

// Same in every theme so all four members' badges match.
export const statusColors = {
  Draft: '#6B7280',
  Quotation: '#3B82F6',
  Confirmed: '#3B82F6',
  Active: '#16A34A',
  Paid: '#16A34A',
  'Partially Paid': '#D97706',
  Pending: '#D97706',
  Overdue: '#DC2626',
  Closed: '#475569',
}

const channels = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

// Writes the palette to CSS variables as "r g b" so Tailwind opacity (bg-accent/20) works.
export function applyTheme(key) {
  const t = themes[key] || themes[DEFAULT_THEME]
  const root = document.documentElement
  ;['primary', 'secondary', 'accent', 'highlight', 'bg', 'text'].forEach((k) =>
    root.style.setProperty(`--${k}`, channels(t[k]))
  )
}
