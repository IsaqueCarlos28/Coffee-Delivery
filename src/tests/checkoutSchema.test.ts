import { describe, expect, it } from 'vitest'
import { checkoutSchema } from '../schemas/checkoutSchema'

const validData = {
  cep: '30130-010',
  street: 'Rua dos Bobos',
  number: '0',
  complement: '',
  district: 'Centro',
  city: 'Belo Horizonte',
  uf: 'MG',
  payment: 'credit' as const,
}

describe('checkoutSchema (RF-08, RF-09, RN-07)', () => {
  it('accepts valid data and normalizes CEP', () => {
    const result = checkoutSchema.safeParse(validData)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cep).toBe('30130010')
      expect(result.data.complement).toBe('')
    }
  })

  it('accepts CEP without mask', () => {
    const result = checkoutSchema.safeParse({ ...validData, cep: '30130010' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cep).toBe('30130010')
    }
  })

  it('rejects invalid CEP', () => {
    const result = checkoutSchema.safeParse({ ...validData, cep: '123' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.cep?.[0]).toBe('CEP deve ter 8 dígitos')
    }
  })

  it('requires mandatory address fields', () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      street: '   ',
      number: '',
      district: '',
      city: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.street?.[0]).toBe('Informe a rua')
      expect(errors.number?.[0]).toBe('Informe o número')
      expect(errors.district?.[0]).toBe('Informe o bairro')
      expect(errors.city?.[0]).toBe('Informe a cidade')
    }
  })

  it('allows empty complement', () => {
    const result = checkoutSchema.safeParse({ ...validData, complement: '' })

    expect(result.success).toBe(true)
  })

  it('validates UF', () => {
    const invalidUf = checkoutSchema.safeParse({ ...validData, uf: 'XX' })
    const lowercaseUf = checkoutSchema.safeParse({ ...validData, uf: 'mg' })

    expect(invalidUf.success).toBe(false)
    expect(lowercaseUf.success).toBe(true)
    if (lowercaseUf.success) {
      expect(lowercaseUf.data.uf).toBe('MG')
    }
  })

  it('requires a valid payment method', () => {
    const result = checkoutSchema.safeParse({ ...validData, payment: undefined })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.payment?.[0]).toBe(
        'Selecione a forma de pagamento',
      )
    }
  })
})
