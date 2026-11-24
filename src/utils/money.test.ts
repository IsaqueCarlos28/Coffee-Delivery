import { describe, expect, it } from 'vitest'
import { formatBRL } from './money'

describe('formatBRL (RF-10, RN-04)', () => {
  it('formats cents to BRL currency', () => {
    expect(formatBRL(0)).toBe('R$\u00A00,00')
    expect(formatBRL(350)).toBe('R$\u00A03,50')
    expect(formatBRL(2970)).toBe('R$\u00A029,70')
    expect(formatBRL(3320)).toBe('R$\u00A033,20')
  })
})
