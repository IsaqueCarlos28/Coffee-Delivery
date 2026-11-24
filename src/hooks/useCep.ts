import { useEffect, useState } from 'react'
import type { UseFormSetFocus, UseFormSetValue } from 'react-hook-form'
import type { CheckoutFormInput } from '../schemas/checkoutSchema'

export type CepStatus = 'idle' | 'loading' | 'success' | 'notFound' | 'error'

interface UseCepParams {
  cep: string
  setValue: UseFormSetValue<CheckoutFormInput>
  setFocus: UseFormSetFocus<CheckoutFormInput>
}

interface ViaCepResponse {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

function normalizeCep(value: string) {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function useCep({ cep, setValue, setFocus }: UseCepParams) {
  const [status, setStatus] = useState<CepStatus>('idle')

  useEffect(() => {
    const normalizedCep = normalizeCep(cep)

    if (normalizedCep.length !== 8) {
      setStatus('idle')
      return
    }

    const controller = new AbortController()

    async function fetchCep() {
      setStatus('loading')

      try {
        const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('CEP request failed')
        }

        const data = (await response.json()) as ViaCepResponse

        if (data.erro) {
          setStatus('notFound')
          return
        }

        setValue('street', data.logradouro ?? '', { shouldValidate: true })
        setValue('district', data.bairro ?? '', { shouldValidate: true })
        setValue('city', data.localidade ?? '', { shouldValidate: true })
        setValue('uf', data.uf ?? '', { shouldValidate: true })
        setStatus('success')
        setFocus('number')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setStatus('error')
      }
    }

    void fetchCep()

    return () => {
      controller.abort()
    }
  }, [cep, setFocus, setValue])

  const message =
    status === 'loading'
      ? 'Consultando CEP...'
      : status === 'notFound'
        ? 'CEP não encontrado. Preencha o endereço manualmente.'
        : status === 'error'
          ? 'Não foi possível consultar o CEP. Preencha o endereço manualmente.'
          : ''

  return {
    status,
    message,
  }
}
