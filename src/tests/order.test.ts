import { describe, expect, it } from 'vitest'
import { buildOrder } from '../utils/order'
import type { DetailedCartItem } from '../types'

const items: DetailedCartItem[] = [
  {
    coffeeId: 'expresso-tradicional',
    quantity: 2,
    coffee: {
      id: 'expresso-tradicional',
      name: 'Expresso Tradicional',
      description: 'desc',
      tags: ['tradicional'],
      priceInCents: 990,
      image: '/coffee.png',
    },
  },
]

describe('buildOrder (RF-11, RF-13, RN-06)', () => {
  it('creates an immutable order snapshot with item prices at purchase time', () => {
    const order = buildOrder({
      items,
      address: {
        cep: '30130010',
        street: 'Rua A',
        number: '10',
        complement: 'Apto 1',
        district: 'Centro',
        city: 'BH',
        uf: 'MG',
      },
      payment: 'credit',
      subtotalInCents: 1980,
      deliveryFeeInCents: 350,
      totalInCents: 2330,
      id: 'order-1',
      createdAt: '2026-11-24T10:00:00.000Z',
    })

    expect(order).toEqual({
      id: 'order-1',
      createdAt: '2026-11-24T10:00:00.000Z',
      items: [
        {
          coffeeId: 'expresso-tradicional',
          name: 'Expresso Tradicional',
          unitPriceInCents: 990,
          quantity: 2,
        },
      ],
      address: {
        cep: '30130010',
        street: 'Rua A',
        number: '10',
        complement: 'Apto 1',
        district: 'Centro',
        city: 'BH',
        uf: 'MG',
      },
      payment: 'credit',
      subtotalInCents: 1980,
      deliveryFeeInCents: 350,
      totalInCents: 2330,
    })
  })
})
