import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../AppRoutes'
import { DELIVERY_ETA, STORAGE_KEYS } from '../constants'
import { CartProvider } from '../contexts/CartContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import type { Order } from '../types'

function renderSuccess() {
  return render(
    <ThemeProvider>
      <CartProvider>
        <MemoryRouter initialEntries={['/success']}>
          <AppRoutes />
        </MemoryRouter>
      </CartProvider>
    </ThemeProvider>,
  )
}

const order: Order = {
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
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 10',
    district: 'Centro',
    city: 'Porto Alegre',
    uf: 'RS',
  },
  payment: 'credit',
  subtotalInCents: 1980,
  deliveryFeeInCents: 350,
  totalInCents: 2330,
}

describe('Success (RF-12, RN-09, D-10)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders confirmed order summary from last-order', () => {
    window.localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order))

    renderSuccess()

    expect(screen.getByRole('heading', { name: /uhu! pedido confirmado/i })).toBeInTheDocument()
    expect(screen.getByText(/rua das flores, 123, apto 10/i)).toBeInTheDocument()
    expect(screen.getByText(/centro - porto alegre, rs/i)).toBeInTheDocument()
    expect(screen.getByText(DELIVERY_ETA)).toBeInTheDocument()
    expect(screen.getByText(/cartão de crédito/i)).toBeInTheDocument()
  })

  it('shows empty state when there is no valid order', () => {
    renderSuccess()

    expect(screen.getByRole('heading', { name: /nenhum pedido confirmado/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar para a home/i })).toHaveAttribute('href', '/')
  })

  it('keeps order on refresh/revisit of /success (RN-09)', () => {
    window.localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order))

    renderSuccess()

    expect(screen.getByRole('heading', { name: /uhu! pedido confirmado/i })).toBeInTheDocument()
    expect(screen.getByText(/pagamento na entrega/i)).toBeInTheDocument()
  })
})
