export type CoffeeTag = 'tradicional' | 'especial' | 'com leite' | 'alcoólico' | 'gelado'

export interface Coffee {
  id: string
  name: string
  description: string
  priceInCents: number
  image: string
  tags: CoffeeTag[]
}
