import { describe, expect, it } from 'vitest'
import { MAX_QUANTITY } from '../constants'
import type { CartItem } from '../types'
import { cartReducer } from './cartReducer'

describe('cartReducer (RF-03, RF-05, RN-01, RN-02, D-03)', () => {
  it('adds an item to the cart', () => {
    const state: CartItem[] = []

    const nextState = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'coffee-1', quantity: 2 },
    })

    expect(nextState).toEqual([{ coffeeId: 'coffee-1', quantity: 2 }])
  })

  it('sums repeated items without duplicating lines', () => {
    const state: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 1 }]

    const nextState = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'coffee-1', quantity: 2 },
    })

    expect(nextState).toEqual([{ coffeeId: 'coffee-1', quantity: 3 }])
  })

  it('caps ADD_ITEM at 99 per line', () => {
    const state: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 95 }]

    const nextState = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'coffee-1', quantity: 10 },
    })

    expect(nextState).toEqual([{ coffeeId: 'coffee-1', quantity: MAX_QUANTITY }])
  })

  it('ignores invalid ADD_ITEM payloads (<1, non-integer, >99 normalized)', () => {
    const state: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 2 }]

    expect(
      cartReducer(state, { type: 'ADD_ITEM', payload: { coffeeId: 'coffee-1', quantity: 0 } }),
    ).toBe(state)
    expect(
      cartReducer(state, { type: 'ADD_ITEM', payload: { coffeeId: 'coffee-1', quantity: -1 } }),
    ).toBe(state)
    expect(
      cartReducer(state, { type: 'ADD_ITEM', payload: { coffeeId: 'coffee-1', quantity: 1.5 } }),
    ).toBe(state)

    const normalized = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'coffee-2', quantity: 200 },
    })
    expect(normalized).toEqual([
      { coffeeId: 'coffee-1', quantity: 2 },
      { coffeeId: 'coffee-2', quantity: MAX_QUANTITY },
    ])
  })

  it('increments quantity and is no-op at 99', () => {
    const state: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 1 }]

    const incremented = cartReducer(state, {
      type: 'INCREMENT',
      payload: { coffeeId: 'coffee-1' },
    })
    expect(incremented).toEqual([{ coffeeId: 'coffee-1', quantity: 2 }])

    const maxState: CartItem[] = [{ coffeeId: 'coffee-1', quantity: MAX_QUANTITY }]
    const noOp = cartReducer(maxState, { type: 'INCREMENT', payload: { coffeeId: 'coffee-1' } })
    expect(noOp).toBe(maxState)
  })

  it('decrements quantity but never below 1', () => {
    const state: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 2 }]

    const decremented = cartReducer(state, {
      type: 'DECREMENT',
      payload: { coffeeId: 'coffee-1' },
    })
    expect(decremented).toEqual([{ coffeeId: 'coffee-1', quantity: 1 }])

    const minState: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 1 }]
    const noOp = cartReducer(minState, { type: 'DECREMENT', payload: { coffeeId: 'coffee-1' } })
    expect(noOp).toBe(minState)
  })

  it('removes an item', () => {
    const state: CartItem[] = [
      { coffeeId: 'coffee-1', quantity: 1 },
      { coffeeId: 'coffee-2', quantity: 2 },
    ]

    const nextState = cartReducer(state, { type: 'REMOVE', payload: { coffeeId: 'coffee-1' } })
    expect(nextState).toEqual([{ coffeeId: 'coffee-2', quantity: 2 }])
  })

  it('clears the cart', () => {
    const state: CartItem[] = [{ coffeeId: 'coffee-1', quantity: 1 }]
    expect(cartReducer(state, { type: 'CLEAR' })).toEqual([])
  })

  it('does not mutate the previous state', () => {
    const state: CartItem[] = [
      { coffeeId: 'coffee-1', quantity: 1 },
      { coffeeId: 'coffee-2', quantity: 2 },
    ]
    const snapshot = structuredClone(state)

    cartReducer(state, { type: 'ADD_ITEM', payload: { coffeeId: 'coffee-1', quantity: 1 } })
    cartReducer(state, { type: 'INCREMENT', payload: { coffeeId: 'coffee-2' } })
    cartReducer(state, { type: 'DECREMENT', payload: { coffeeId: 'coffee-2' } })
    cartReducer(state, { type: 'REMOVE', payload: { coffeeId: 'coffee-1' } })
    cartReducer(state, { type: 'CLEAR' })

    expect(state).toEqual(snapshot)
  })
})
