import type { Coffee } from './coffee'

// O carrinho guarda só id + quantidade; nome e preço vêm do catálogo (evita preço defasado no storage)
export interface CartItem {
  coffeeId: string
  quantity: number
}

// Item enriquecido para UI/cálculo (não persiste no storage)
export interface DetailedCartItem extends CartItem {
  coffee: Coffee
}
