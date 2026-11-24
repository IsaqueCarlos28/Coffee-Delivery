import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from '../AppRoutes'
import { STORAGE_KEYS } from '../constants'
import { CartProvider } from '../contexts/CartContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function mockMatchMedia(prefersDark = false) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

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

describe('Integration flows (T-20)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.dataset.theme = ''
    mockMatchMedia(false)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ erro: true }),
      }),
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('completes purchase flow from catalog to success (RF-02, RF-03, RF-04, RF-05, RF-10, RF-11, RF-12, RF-13, RN-01, RN-03, RN-06)', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(
      screen.getByRole('button', { name: /adicionar expresso tradicional ao carrinho/i }),
    )
    await user.click(
      screen.getByRole('button', { name: /adicionar expresso americano ao carrinho/i }),
    )

    expect(screen.getByLabelText(/ir para o carrinho, 2 itens/i)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/ir para o carrinho, 2 itens/i))

    expect(screen.getByRole('heading', { name: /complete seu pedido/i })).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*19,80/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*3,50/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*23,30/)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^cep$/i), '30130010')
    await user.type(screen.getByLabelText(/^rua$/i), 'Rua A')
    await user.type(screen.getByLabelText(/^número$/i), '100')
    await user.type(screen.getByLabelText(/^bairro$/i), 'Centro')
    await user.type(screen.getByLabelText(/^cidade$/i), 'Belo Horizonte')
    await user.type(screen.getByLabelText(/^uf$/i), 'MG')
    await user.click(screen.getByLabelText(/cartão de crédito/i))
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(
      await screen.findByRole('heading', { name: /uhu! pedido confirmado/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/rua a, 100/i)).toBeInTheDocument()
    expect(screen.getByText(/cartão de crédito/i)).toBeInTheDocument()

    expect(window.localStorage.getItem(STORAGE_KEYS.cart)).toBe('[]')
    expect(window.localStorage.getItem(STORAGE_KEYS.lastOrder)).not.toBeNull()
  }, 15000)

  it('blocks confirmation with invalid form and shows accessible errors (RF-11, RN-07)', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([{ coffeeId: 'expresso-tradicional', quantity: 1 }]),
    )

    renderApp('/checkout')

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(screen.getByText('Informe o CEP')).toHaveAttribute('role', 'alert')
    expect(screen.getByText('Selecione a forma de pagamento')).toHaveAttribute('role', 'alert')
    expect(window.localStorage.getItem(STORAGE_KEYS.lastOrder)).toBeNull()
  })

  it('blocks confirmation when cart is empty by showing empty state (RF-05, RF-11, RN-09)', () => {
    renderApp('/checkout')

    expect(screen.getByRole('heading', { name: /seu carrinho está vazio/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /confirmar pedido/i })).not.toBeInTheDocument()
  })

  it('persists cart after provider remount (RF-06, RN-10, RNF-04)', async () => {
    const user = userEvent.setup()

    const { unmount } = renderApp('/')

    await user.click(
      screen.getByRole('button', { name: /adicionar expresso tradicional ao carrinho/i }),
    )
    expect(screen.getByLabelText(/ir para o carrinho, 1 item/i)).toBeInTheDocument()

    unmount()

    renderApp('/')
    expect(screen.getByLabelText(/ir para o carrinho, 1 item/i)).toBeInTheDocument()
  })

  it('falls back to empty cart when stored JSON is corrupted (RF-06, RNF-04)', () => {
    window.localStorage.setItem(STORAGE_KEYS.cart, '{invalid-json')

    renderApp('/')

    expect(screen.getByRole('link', { name: 'Ir para o carrinho' })).toBeInTheDocument()
  })

  it('persists theme after remount (RF-14, D-07)', async () => {
    const user = userEvent.setup()

    const { unmount } = renderApp('/')

    await user.click(screen.getByRole('button', { name: /ativar tema escuro/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')

    unmount()

    renderApp('/')
    expect(screen.getByRole('button', { name: /ativar tema claro/i })).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
