import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from '../AppRoutes'
import { STORAGE_KEYS } from '../constants'
import { CartProvider } from '../contexts/CartContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function renderCheckout() {
  return render(
    <ThemeProvider>
      <CartProvider>
        <MemoryRouter initialEntries={['/checkout']}>
          <AppRoutes />
        </MemoryRouter>
      </CartProvider>
    </ThemeProvider>,
  )
}

describe('Checkout (RF-05, RF-10, RN-09)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ erro: true }),
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows empty state when cart is empty', () => {
    renderCheckout()

    expect(screen.getByRole('heading', { name: /seu carrinho está vazio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ver catálogo/i })).toHaveAttribute('href', '/')
  })

  it('shows correct totals for items in cart', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 3 }]),
    )

    renderCheckout()

    expect(screen.getAllByText(/R\$\s*29,70/).length).toBeGreaterThan(0)
    expect(screen.getByText(/R\$\s*3,50/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*33,20/)).toBeInTheDocument()
  })

  it('removes an item and updates totals/state', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([
        { coffeeId: 'expresso-tradicional', quantity: 3 },
        { coffeeId: 'expresso-americano', quantity: 1 },
      ]),
    )

    renderCheckout()

    expect(screen.getByText(/R\$\s*39,60/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*43,10/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /remover expresso americano/i }))

    expect(screen.queryByText(/expresso americano/i)).not.toBeInTheDocument()
    expect(screen.getAllByText(/R\$\s*29,70/).length).toBeGreaterThan(0)
    expect(screen.getByText(/R\$\s*33,20/)).toBeInTheDocument()
  })

  it('enables confirm button when cart has items (T-16)', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )

    renderCheckout()

    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeEnabled()
  })

  it('shows accessible address validation errors on blur (RF-08, RN-07)', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )

    renderCheckout()

    const cepInput = screen.getByLabelText(/^cep$/i)
    await user.click(cepInput)
    await user.tab()

    expect(screen.getByText('Informe o CEP')).toHaveAttribute('role', 'alert')
    expect(cepInput).toHaveAttribute('aria-invalid', 'true')
    expect(cepInput).toHaveAttribute('aria-describedby', 'cep-error')
    expect(screen.getByLabelText(/complemento \(opcional\)/i)).toBeInTheDocument()
  })

  it('renders payment methods with no pre-selection (RF-09, RN-05)', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )

    renderCheckout()

    const credit = screen.getByLabelText(/cartão de crédito/i)
    const debit = screen.getByLabelText(/cartão de débito/i)
    const cash = screen.getByLabelText(/dinheiro/i)

    expect(credit).not.toBeChecked()
    expect(debit).not.toBeChecked()
    expect(cash).not.toBeChecked()
  })

  it('blocks submit with invalid form and shows accessible feedback (RF-11)', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )

    renderCheckout()

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(screen.getByText('Informe o CEP')).toBeInTheDocument()
    expect(screen.getByText('Selecione a forma de pagamento')).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEYS.lastOrder)).toBeNull()
    expect(screen.getByRole('heading', { name: /complete seu pedido/i })).toBeInTheDocument()
  })

  it('completes happy flow: saves order, clears cart, navigates to success (RF-11, RF-12, RF-13)', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 2 }]),
    )

    renderCheckout()

    await user.type(screen.getByLabelText(/^cep$/i), '30130010')
    await user.type(screen.getByLabelText(/^rua$/i), 'Rua A')
    await user.type(screen.getByLabelText(/^número$/i), '100')
    await user.type(screen.getByLabelText(/^bairro$/i), 'Centro')
    await user.type(screen.getByLabelText(/^cidade$/i), 'Belo Horizonte')
    await user.type(screen.getByLabelText(/^uf$/i), 'MG')
    await user.click(screen.getByLabelText(/cartão de crédito/i))

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(await screen.findByRole('heading', { name: /pedido confirmado/i })).toBeInTheDocument()

    const storedOrder = window.localStorage.getItem(STORAGE_KEYS.lastOrder)
    expect(storedOrder).not.toBeNull()
    const order = JSON.parse(storedOrder!) as {
      items: Array<{
        coffeeId: string
        name: string
        unitPriceInCents: number
        quantity: number
      }>
      payment: string
      subtotalInCents: number
      deliveryFeeInCents: number
      totalInCents: number
    }
    expect(order.items).toEqual([
      {
        coffeeId: 'expresso-tradicional',
        name: 'Expresso Tradicional',
        unitPriceInCents: 990,
        quantity: 2,
      },
    ])
    expect(order.payment).toBe('credit')
    expect(order.subtotalInCents).toBe(1980)
    expect(order.deliveryFeeInCents).toBe(350)
    expect(order.totalInCents).toBe(2330)

    const storedCart = window.localStorage.getItem(STORAGE_KEYS.cart)
    expect(storedCart).toBe('[]')
  })
})
