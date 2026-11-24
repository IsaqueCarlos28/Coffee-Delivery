import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { STORAGE_KEYS } from '../constants'

function mockMatchMedia(prefersDark: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const mediaQuery: MediaQueryList = {
    matches: prefersDark,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: ((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type !== 'change') return
      if (typeof listener === 'function') {
        listeners.add(listener as (event: MediaQueryListEvent) => void)
      } else {
        listeners.add((event) => listener.handleEvent(event))
      }
    }) as MediaQueryList['addEventListener'],
    removeEventListener: ((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type !== 'change') return
      if (typeof listener === 'function') {
        listeners.delete(listener as (event: MediaQueryListEvent) => void)
      } else {
        listeners.forEach((registered) => {
          if (registered.toString() === ((event: MediaQueryListEvent) => listener.handleEvent(event)).toString()) {
            listeners.delete(registered)
          }
        })
      }
    }) as MediaQueryList['removeEventListener'],
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    dispatchEvent: (event: Event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent))
      return true
    },
  }

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))
  return mediaQuery
}

function renderThemeToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('Theme (RF-14, D-07)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.dataset.theme = ''
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('toggles theme, updates aria attributes, and persists the choice', async () => {
    const user = userEvent.setup()
    renderThemeToggle()

    const button = screen.getByRole('button', { name: /ativar tema escuro/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await user.click(button)

    expect(screen.getByRole('button', { name: /ativar tema claro/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('follows system preference when there is no stored value', () => {
    mockMatchMedia(true)
    renderThemeToggle()

    expect(screen.getByRole('button', { name: /ativar tema claro/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('uses stored theme over system preference', () => {
    window.localStorage.setItem(STORAGE_KEYS.theme, 'light')
    mockMatchMedia(true)
    renderThemeToggle()

    expect(screen.getByRole('button', { name: /ativar tema escuro/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
