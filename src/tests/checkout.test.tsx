import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
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

  it('keeps confirm button disabled when cart is not submittable in T-12 scope', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )

    renderCheckout()

    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeDisabled()
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
})
