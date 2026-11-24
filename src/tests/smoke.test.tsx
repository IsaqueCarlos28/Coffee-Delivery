import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('App smoke (RNF-05)', () => {
  it('renders the application shell', () => {
    render(<App />)
    expect(
      screen.getByRole('link', { name: /coffee delivery - ir para a página inicial/i }),
    ).toBeInTheDocument()
  })
})
