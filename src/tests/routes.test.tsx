import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../AppRoutes'
import { HEADER_LOCATION } from '../constants'
import { CartProvider } from '../contexts/CartContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function renderWithRouter(initialEntry: string) {
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

describe('Routes (RF-07, D-09)', () => {
  it('renders Home on /', () => {
    renderWithRouter('/')
    expect(
      screen.getByRole('heading', { name: /encontre o café perfeito para qualquer hora do dia/i }),
    ).toBeInTheDocument()
  })

  it('renders Checkout on /checkout', () => {
    renderWithRouter('/checkout')
    expect(screen.getByRole('heading', { name: /seu carrinho está vazio/i })).toBeInTheDocument()
  })

  it('renders Success on /success', () => {
    renderWithRouter('/success')
    expect(screen.getByRole('heading', { name: /nenhum pedido confirmado/i })).toBeInTheDocument()
  })

  it('renders NotFound on unknown route', () => {
    renderWithRouter('/rota-inexistente')
    expect(screen.getByRole('heading', { name: /página não encontrada/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar para a home/i })).toHaveAttribute('href', '/')
  })

  it('renders Header with location, cart link and theme toggle', () => {
    renderWithRouter('/')

    expect(screen.getByRole('link', { name: /coffee delivery - ir para a página inicial/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByLabelText(`Localização: ${HEADER_LOCATION}`)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ir para o carrinho/i })).toHaveAttribute(
      'href',
      '/checkout',
    )
    expect(screen.getByRole('button', { name: /ativar tema escuro/i })).toBeInTheDocument()
  })
})
