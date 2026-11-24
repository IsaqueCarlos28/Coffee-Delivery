import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../AppRoutes'
import { CartProvider } from '../contexts/CartContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function renderApp(initialEntry = '/') {
  return render(
    <ThemeProvider>
      <CartProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <AppRoutes />
        </MemoryRouter>
      </CartProvider>
    </ThemeProvider>,
  )
}

describe('Catalog and CartBadge (RF-01, RF-02, RF-03, RF-04)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  it('adds the same coffee twice as a single cart line and resets quantity', async () => {
    const user = userEvent.setup()
    renderApp('/')

    const addButton = screen.getByRole('button', {
      name: /adicionar expresso tradicional ao carrinho/i,
    })
    const quantityInput = screen.getByRole('textbox', {
      name: /quantidade de expresso tradicional/i,
    })
    const increaseButton = screen.getAllByRole('button', { name: /aumentar quantidade/i })[0]

    await user.click(increaseButton)
    expect(quantityInput).toHaveValue('2')

    await user.click(addButton)

    expect(quantityInput).toHaveValue('1')
    expect(screen.getByLabelText(/ir para o carrinho, 2 itens/i)).toBeInTheDocument()

    await user.click(addButton)
    expect(screen.getByLabelText(/ir para o carrinho, 3 itens/i)).toBeInTheDocument()
  })

  it('hides badge when cart is empty', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: 'Ir para o carrinho' })).toBeInTheDocument()
  })

  it('sums units from different coffees in the badge', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(
      screen.getByRole('button', { name: /adicionar expresso tradicional ao carrinho/i }),
    )
    await user.click(
      screen.getByRole('button', { name: /adicionar expresso americano ao carrinho/i }),
    )

    expect(screen.getByLabelText(/ir para o carrinho, 2 itens/i)).toBeInTheDocument()
  })

  it('does not allow quantity below 1 or above 99 in the input', async () => {
    const user = userEvent.setup()
    renderApp('/')

    const quantityInput = screen.getByRole('textbox', {
      name: /quantidade de expresso tradicional/i,
    })
    const decreaseButtons = screen.getAllByRole('button', { name: /diminuir quantidade/i })
    const increaseButtons = screen.getAllByRole('button', { name: /aumentar quantidade/i })
    const decrease = decreaseButtons[0]
    const increase = increaseButtons[0]

    expect(decrease).toBeDisabled()

    await user.clear(quantityInput)
    expect(quantityInput).toHaveValue('1')

    await user.type(quantityInput, '0')
    expect(quantityInput).toHaveValue('10')

    await user.clear(quantityInput)
    await user.type(quantityInput, '120')
    expect(quantityInput).toHaveValue('99')
    expect(increase).toBeDisabled()
  })
})
