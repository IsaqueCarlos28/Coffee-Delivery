import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCep } from '../hooks/useCep'
import type { CheckoutFormInput } from '../schemas/checkoutSchema'

function CepHarness() {
  const { register, watch, setValue, setFocus } = useForm<CheckoutFormInput>({
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      uf: '',
    },
  })
  const cep = watch('cep')
  const { status, message } = useCep({ cep, setValue, setFocus })

  return (
    <div>
      <label htmlFor="cep">CEP</label>
      <input id="cep" {...register('cep')} />
      <label htmlFor="street">Rua</label>
      <input id="street" {...register('street')} />
      <label htmlFor="district">Bairro</label>
      <input id="district" {...register('district')} />
      <label htmlFor="city">Cidade</label>
      <input id="city" {...register('city')} />
      <label htmlFor="uf">UF</label>
      <input id="uf" {...register('uf')} />
      <label htmlFor="number">Número</label>
      <input id="number" {...register('number')} />
      <p data-testid="status">{status}</p>
      {message ? <p role="alert">{message}</p> : null}
    </div>
  )
}

describe('useCep (RF-08, RN-07)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fills address fields and focuses number on success', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        localidade: 'Porto Alegre',
        uf: 'RS',
      }),
    } as Response)

    render(<CepHarness />)

    await user.type(screen.getByLabelText('CEP'), '01001000')

    await waitFor(() => {
      expect(screen.getByLabelText('Rua')).toHaveValue('Rua das Flores')
    })

    expect(screen.getByLabelText('Bairro')).toHaveValue('Centro')
    expect(screen.getByLabelText('Cidade')).toHaveValue('Porto Alegre')
    expect(screen.getByLabelText('UF')).toHaveValue('RS')
    expect(screen.getByLabelText('Número')).toHaveFocus()
    expect(screen.getByTestId('status')).toHaveTextContent('success')
  })

  it('shows not found message when ViaCEP returns erro', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ erro: true }),
    } as Response)

    render(<CepHarness />)

    await user.type(screen.getByLabelText('CEP'), '99999999')

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('notFound')
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'CEP não encontrado. Preencha o endereço manualmente.',
    )
    expect(screen.getByLabelText('Rua')).not.toBeDisabled()
  })

  it('shows error message on network failure', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    render(<CepHarness />)

    await user.type(screen.getByLabelText('CEP'), '01001000')

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error')
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível consultar o CEP. Preencha o endereço manualmente.',
    )
  })

  it('aborts previous request when CEP changes', async () => {
    const user = userEvent.setup()
    let firstSignal: AbortSignal | undefined

    vi.mocked(fetch).mockImplementation((_url, init) => {
      const signal = init?.signal as AbortSignal | undefined
      if (!firstSignal) {
        firstSignal = signal
        return new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }) as Promise<Response>
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          logradouro: 'Rua B',
          bairro: 'Bairro B',
          localidade: 'Cidade B',
          uf: 'SP',
        }),
      } as Response)
    })

    render(<CepHarness />)

    await user.type(screen.getByLabelText('CEP'), '01001000')
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    await user.clear(screen.getByLabelText('CEP'))
    await user.type(screen.getByLabelText('CEP'), '02002000')

    await waitFor(() => {
      expect(screen.getByLabelText('Rua')).toHaveValue('Rua B')
    })

    expect(firstSignal?.aborted).toBe(true)
    expect(screen.getByTestId('status')).toHaveTextContent('success')
  })
})
