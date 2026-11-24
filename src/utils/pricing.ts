import { DELIVERY_FEE_IN_CENTS } from '../constants'
import type { CartItem, Coffee } from '../types'

export function calculateSubtotal(items: CartItem[], catalog: Coffee[]): number {
  return items.reduce((sum, item) => {
    const coffee = catalog.find((catalogItem) => catalogItem.id === item.coffeeId)
    if (!coffee) return sum
    return sum + coffee.priceInCents * item.quantity
  }, 0)
}

export function calculateTotal(
  subtotalInCents: number,
  deliveryFeeInCents: number = DELIVERY_FEE_IN_CENTS,
): number {
  if (subtotalInCents <= 0) return 0
  return subtotalInCents + deliveryFeeInCents
}
