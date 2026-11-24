import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from '../contexts/CartContext'
import { STORAGE_KEYS } from '../constants'
import { useCart } from '../hooks/useCart'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

describe('CartProvider (RF-06, RN-10, RNF-04)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('hydrates from localStorage and discards invalid or unknown items', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([
        { coffeeId: 'expresso-tradicional', quantity: 2 },
        { coffeeId: 'unknown-coffee', quantity: 1 },
        { coffeeId: 'expresso-americano', quantity: 0 },
        { bad: 'item' },
      ]),
    )

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toEqual([{ coffeeId: 'expresso-tradicional', quantity: 2 }])
    expect(result.current.totalUnits).toBe(2)
    expect(result.current.subtotalInCents).toBe(1980)
    expect(result.current.detailedItems[0]?.coffee.id).toBe('expresso-tradicional')
  })

  it('persists cart changes to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.add('expresso-tradicional', 1)
    })

    expect(result.current.items).toEqual([{ coffeeId: 'expresso-tradicional', quantity: 1 }])
    expect(window.localStorage.getItem(STORAGE_KEYS.cart)).toBe(
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )
  })
})
