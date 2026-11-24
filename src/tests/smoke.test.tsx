import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('App smoke (RNF-05)', () => {
  it('renders the application title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /coffee delivery/i })).toBeInTheDocument()
  })
})
