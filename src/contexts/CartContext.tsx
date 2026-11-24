import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { MAX_QUANTITY, STORAGE_KEYS } from '../constants'
import { coffees } from '../data/coffees'
import { cartReducer } from '../reducers/cartReducer'
import { calculateSubtotal } from '../utils/pricing'
import type { CartItem, DetailedCartItem } from '../types'

interface CartContextValue {
  items: CartItem[]
  detailedItems: DetailedCartItem[]
  totalUnits: number
  subtotalInCents: number
  add: (coffeeId: string, quantity: number) => void
  increment: (coffeeId: string) => void
  decrement: (coffeeId: string) => void
  remove: (coffeeId: string) => void
  clear: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextValue | undefined>(undefined)

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>
  return (
    typeof item.coffeeId === 'string' &&
    item.coffeeId.length > 0 &&
    Number.isInteger(item.quantity) &&
    typeof item.quantity === 'number' &&
    item.quantity >= 1 &&
    item.quantity <= MAX_QUANTITY
  )
}

function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.cart)
    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    const catalogIds = new Set(coffees.map((coffee) => coffee.id))
    const mergedItems = new Map<string, number>()

    for (const entry of parsed) {
      if (!isValidCartItem(entry)) continue
      if (!catalogIds.has(entry.coffeeId)) continue

      const currentQuantity = mergedItems.get(entry.coffeeId) ?? 0
      mergedItems.set(entry.coffeeId, Math.min(MAX_QUANTITY, currentQuantity + entry.quantity))
    }

    return Array.from(mergedItems.entries()).map(([coffeeId, quantity]) => ({
      coffeeId,
      quantity,
    }))
  } catch {
    return []
  }
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, dispatch] = useReducer(cartReducer, undefined, getInitialCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items))
    } catch {
      // Storage indisponível ou quota excedida: mantém estado em memória.
    }
  }, [items])

  const add = useCallback((coffeeId: string, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { coffeeId, quantity } })
  }, [])

  const increment = useCallback((coffeeId: string) => {
    dispatch({ type: 'INCREMENT', payload: { coffeeId } })
  }, [])

  const decrement = useCallback((coffeeId: string) => {
    dispatch({ type: 'DECREMENT', payload: { coffeeId } })
  }, [])

  const remove = useCallback((coffeeId: string) => {
    dispatch({ type: 'REMOVE', payload: { coffeeId } })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const detailedItems = useMemo<DetailedCartItem[]>(() => {
    return items.flatMap((item) => {
      const coffee = coffees.find((catalogCoffee) => catalogCoffee.id === item.coffeeId)
      if (!coffee) return []
      return [{ ...item, coffee }]
    })
  }, [items])

  const totalUnits = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const subtotalInCents = useMemo(() => calculateSubtotal(items, coffees), [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      detailedItems,
      totalUnits,
      subtotalInCents,
      add,
      increment,
      decrement,
      remove,
      clear,
    }),
    [add, clear, decrement, detailedItems, increment, items, remove, subtotalInCents, totalUnits],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
