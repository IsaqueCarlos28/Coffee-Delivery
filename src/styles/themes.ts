export type ThemeMode = 'light' | 'dark'

export interface AppTheme {
  mode: ThemeMode
  colors: {
    background: string
    surface: string
    surfaceAlt: string
    text: string
    textMuted: string
    border: string
    primary: string
    primaryContrast: string
    accent: string
    danger: string
    success: string
    focusRing: string
  }
}

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#FAFAFA',
    surface: '#F3F2F2',
    surfaceAlt: '#EDEDED',
    text: '#272221',
    textMuted: '#574F4D',
    border: '#D7D5D5',
    primary: '#DBAC2C',
    primaryContrast: '#272221',
    accent: '#8047F8',
    danger: '#C44117',
    success: '#2B8A3E',
    focusRing: '#8047F8',
  },
}

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1716',
    surface: '#272221',
    surfaceAlt: '#403937',
    text: '#F3F2F2',
    textMuted: '#D7D5D5',
    border: '#574F4D',
    primary: '#DBAC2C',
    primaryContrast: '#272221',
    accent: '#A277FF',
    danger: '#FF6B6B',
    success: '#51CF66',
    focusRing: '#A277FF',
  },
}
