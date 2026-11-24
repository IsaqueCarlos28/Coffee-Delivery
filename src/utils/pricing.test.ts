import { describe, expect, it } from 'vitest'
import { DELIVERY_FEE_IN_CENTS } from '../constants'
import type { CartItem, Coffee } from '../types'
import { calculateSubtotal, calculateTotal } from './pricing'

const catalog: Coffee[] = [
  {
    id: 'coffee-1',
    name: 'Coffee 1',
    description: 'Desc 1',
    priceInCents: 990,
    image: 'coffee-1.png',
    tags: ['tradicional'],
  },
  {
    id: 'coffee-2',
    name: 'Coffee 2',
    description: 'Desc 2',
    priceInCents: 1250,
    image: 'coffee-2.png',
    tags: ['especial'],
  },
]

describe('pricing utils (RF-10, RN-03, RN-04, D-01)', () => {
  it('calculates subtotal for an empty list as 0', () => {
    const items: CartItem[] = []
    expect(calculateSubtotal(items, catalog)).toBe(0)
  })

  it('calculates subtotal from items and catalog', () => {
    const items: CartItem[] = [
      { coffeeId: 'coffee-1', quantity: 2 },
      { coffeeId: 'coffee-2', quantity: 1 },
    ]

    expect(calculateSubtotal(items, catalog)).toBe(3230)
  })

  it('ignores items whose coffeeId is not in the catalog', () => {
    const items: CartItem[] = [
      { coffeeId: 'coffee-1', quantity: 1 },
      { coffeeId: 'missing', quantity: 3 },
    ]

    expect(calculateSubtotal(items, catalog)).toBe(990)
  })

  it('calculates total as subtotal plus delivery fee', () => {
    expect(calculateTotal(2970, DELIVERY_FEE_IN_CENTS)).toBe(3320)
  })

  it('returns total 0 when subtotal is 0 (empty cart has no delivery fee)', () => {
    expect(calculateTotal(0, DELIVERY_FEE_IN_CENTS)).toBe(0)
  })
})
