import { themes } from '../theme/themes'
import { useTheme } from '../theme/ThemeProvider'

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme()
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Colour theme">
      {Object.entries(themes).map(([key, t]) => (
        <button
          key={key}
          role="radio"
          aria-checked={themeKey === key}
          title={t.label}
          onClick={() => setThemeKey(key)}
          className={`h-6 w-6 rounded-full border-2 ${themeKey === key ? 'border-ink' : 'border-transparent'}`}
          style={{ background: `linear-gradient(135deg, ${t.primary} 50%, ${t.accent} 50%)` }}
        />
      ))}
    </div>
  )
}
