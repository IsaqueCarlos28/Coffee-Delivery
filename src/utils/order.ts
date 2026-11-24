import type { DeliveryAddress, DetailedCartItem, Order, PaymentMethod } from '../types'

interface BuildOrderParams {
  items: DetailedCartItem[]
  address: DeliveryAddress
  payment: PaymentMethod
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
  id?: string
  createdAt?: string
}

export function buildOrder({
  items,
  address,
  payment,
  subtotalInCents,
  deliveryFeeInCents,
  totalInCents,
  id = crypto.randomUUID(),
  createdAt = new Date().toISOString(),
}: BuildOrderParams): Order {
  return {
    id,
    createdAt,
    items: items.map((item) => ({
      coffeeId: item.coffeeId,
      name: item.coffee.name,
      unitPriceInCents: item.coffee.priceInCents,
      quantity: item.quantity,
    })),
    address,
    payment,
    subtotalInCents,
    deliveryFeeInCents,
    totalInCents,
  }
}
