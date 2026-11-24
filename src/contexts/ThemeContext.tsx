import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { STORAGE_KEYS } from '../constants'
import { GlobalStyle } from '../styles/global'
import { darkTheme, lightTheme, type ThemeMode } from '../styles/themes'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    return getSystemTheme()
  }

  return getSystemTheme()
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [hasStoredPreference, setHasStoredPreference] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.theme)
      return stored === 'light' || stored === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!hasStoredPreference) return

    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme)
    } catch {
      // Ignora falha de persistência e mantém tema apenas em memória.
    }
  }, [hasStoredPreference, theme])

  useEffect(() => {
    if (hasStoredPreference) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [hasStoredPreference])

  const toggleTheme = useCallback(() => {
    setHasStoredPreference(true)
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={selectedTheme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}
