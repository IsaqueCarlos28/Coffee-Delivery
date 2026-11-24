export type PaymentMethod = 'credit' | 'debit' | 'cash'

export interface DeliveryAddress {
  cep: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  uf: string
}

// Snapshot imutável do pedido concluído (RN-06)
export interface Order {
  id: string // ex.: crypto.randomUUID()
  createdAt: string // ISO string
  items: {
    coffeeId: string
    name: string
    unitPriceInCents: number
    quantity: number
  }[]
  address: DeliveryAddress
  payment: PaymentMethod
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
}
