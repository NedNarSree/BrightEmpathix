import { createContext, useContext, useEffect, useState } from 'react'
import { themes, DEFAULT_THEME, applyTheme } from './themes'

const Ctx = createContext(null)

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => {
    try { return localStorage.getItem('be-theme-v2') || DEFAULT_THEME } catch { return DEFAULT_THEME }
  })
  const safeKey = themes[themeKey] ? themeKey : DEFAULT_THEME

  useEffect(() => {
    applyTheme(safeKey)
    try { localStorage.setItem('be-theme-v2', safeKey) } catch { /* storage unavailable */ }
  }, [safeKey])

  return (
    <Ctx.Provider value={{ themeKey: safeKey, setThemeKey, theme: themes[safeKey] }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)
