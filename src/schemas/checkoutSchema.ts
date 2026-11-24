import { z } from 'zod'

const UF_VALUES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

const cepRegex = /^\d{5}-?\d{3}$/

export const checkoutSchema = z.object({
  cep: z
    .string()
    .trim()
    .min(1, 'Informe o CEP')
    .regex(cepRegex, 'CEP deve ter 8 dígitos')
    .transform((value) => value.replace(/\D/g, '')),
  street: z.string().trim().min(1, 'Informe a rua'),
  number: z.string().trim().min(1, 'Informe o número'),
  complement: z.string().trim().optional(),
  district: z.string().trim().min(1, 'Informe o bairro'),
  city: z.string().trim().min(1, 'Informe a cidade'),
  uf: z
    .string()
    .trim()
    .length(2, 'UF deve ter 2 letras')
    .transform((value) => value.toUpperCase())
    .refine((value) => UF_VALUES.includes(value as (typeof UF_VALUES)[number]), {
      message: 'Informe uma UF válida',
    }),
  payment: z.enum(['credit', 'debit', 'cash'], {
    message: 'Selecione a forma de pagamento',
  }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type CheckoutFormInput = z.input<typeof checkoutSchema>
