import { MAX_QUANTITY } from '../constants'
import type { CartItem } from '../types'

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { coffeeId: string; quantity: number } }
  | { type: 'INCREMENT'; payload: { coffeeId: string } }
  | { type: 'DECREMENT'; payload: { coffeeId: string } }
  | { type: 'REMOVE'; payload: { coffeeId: string } }
  | { type: 'CLEAR' }

function normalizeQuantity(quantity: number): number | null {
  if (!Number.isInteger(quantity) || quantity < 1) return null
  return Math.min(quantity, MAX_QUANTITY)
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const quantity = normalizeQuantity(action.payload.quantity)
      if (!quantity) return state

      const existingItem = state.find((item) => item.coffeeId === action.payload.coffeeId)
      if (!existingItem) {
        return [...state, { coffeeId: action.payload.coffeeId, quantity }]
      }

      return state.map((item) =>
        item.coffeeId === action.payload.coffeeId
          ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
          : item,
      )
    }

    case 'INCREMENT': {
      const item = state.find((cartItem) => cartItem.coffeeId === action.payload.coffeeId)
      if (!item || item.quantity >= MAX_QUANTITY) return state

      return state.map((cartItem) =>
        cartItem.coffeeId === action.payload.coffeeId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      )
    }

    case 'DECREMENT': {
      const item = state.find((cartItem) => cartItem.coffeeId === action.payload.coffeeId)
      if (!item || item.quantity <= 1) return state

      return state.map((cartItem) =>
        cartItem.coffeeId === action.payload.coffeeId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      )
    }

    case 'REMOVE': {
      return state.filter((item) => item.coffeeId !== action.payload.coffeeId)
    }

    case 'CLEAR': {
      return []
    }

    default: {
      return state
    }
  }
}
