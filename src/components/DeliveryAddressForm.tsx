import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetFocus,
  UseFormSetValue,
} from 'react-hook-form'
import styled from 'styled-components'
import { useCep } from '../hooks/useCep'
import type { CheckoutFormInput } from '../schemas/checkoutSchema'

interface DeliveryAddressFormProps {
  register: UseFormRegister<CheckoutFormInput>
  errors: FieldErrors<CheckoutFormInput>
  cep: string
  setValue: UseFormSetValue<CheckoutFormInput>
  setFocus: UseFormSetFocus<CheckoutFormInput>
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const SectionHeader = styled.div`
  display: flex;
  gap: 0.5rem;
`

const SectionIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  line-height: 1;
`

const SectionTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.125rem;
`

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const FieldsGrid = styled.div`
  display: grid;
  gap: 1rem 0.75rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 12.5rem 1fr 3.75rem;
  }
`

const Field = styled.div<{ $span?: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (min-width: 768px) {
    grid-column: ${({ $span }) => $span ?? 'auto'};
  }
`

const Label = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
`

const CepStatusMessage = styled.p<{ $status: 'loading' | 'notFound' | 'error' | 'success' }>`
  font-size: 0.75rem;
  color: ${({ theme, $status }) =>
    $status === 'loading' ? theme.colors.textMuted : theme.colors.danger};
`

function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

interface AddressFieldProps {
  id: string
  label: string
  error?: string
  span?: string
  children: React.ReactNode
}

function AddressField({ id, label, error, span, children }: AddressFieldProps) {
  return (
    <Field $span={span}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <ErrorMessage id={`${id}-error`} role="alert">
          {error}
        </ErrorMessage>
      ) : null}
    </Field>
  )
}

export function DeliveryAddressForm({
  register,
  errors,
  cep,
  setValue,
  setFocus,
}: DeliveryAddressFormProps) {
  const { status: cepStatus, message: cepMessage } = useCep({ cep, setValue, setFocus })
  const cepRegistration = register('cep')

  return (
    <FormContainer>
      <SectionHeader>
        <SectionIcon aria-hidden="true">📍</SectionIcon>
        <div>
          <SectionTitle>Endereço de Entrega</SectionTitle>
          <SectionDescription>Informe o endereço onde deseja receber seu pedido</SectionDescription>
        </div>
      </SectionHeader>

      <FieldsGrid>
        <AddressField id="cep" label="CEP" error={errors.cep?.message} span="1 / 2">
          <Input
            id="cep"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="CEP"
            aria-invalid={errors.cep ? 'true' : 'false'}
            aria-describedby={
              [errors.cep ? 'cep-error' : null, cepMessage ? 'cep-status' : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            $hasError={!!errors.cep}
            {...cepRegistration}
            onChange={(event) => {
              event.target.value = formatCep(event.target.value)
              cepRegistration.onChange(event)
            }}
          />
          {cepMessage ? (
            <CepStatusMessage
              id="cep-status"
              role={cepStatus === 'notFound' || cepStatus === 'error' ? 'alert' : undefined}
              aria-live="polite"
              $status={cepStatus as 'loading' | 'notFound' | 'error' | 'success'}
            >
              {cepMessage}
            </CepStatusMessage>
          ) : null}
        </AddressField>

        <AddressField id="street" label="Rua" error={errors.street?.message} span="1 / 4">
          <Input
            id="street"
            type="text"
            autoComplete="address-line1"
            placeholder="Rua"
            aria-invalid={errors.street ? 'true' : 'false'}
            aria-describedby={errors.street ? 'street-error' : undefined}
            $hasError={!!errors.street}
            {...register('street')}
          />
        </AddressField>

        <AddressField id="number" label="Número" error={errors.number?.message} span="1 / 2">
          <Input
            id="number"
            type="text"
            autoComplete="address-line2"
            placeholder="Número"
            aria-invalid={errors.number ? 'true' : 'false'}
            aria-describedby={errors.number ? 'number-error' : undefined}
            $hasError={!!errors.number}
            {...register('number')}
          />
        </AddressField>

        <AddressField
          id="complement"
          label="Complemento (opcional)"
          error={errors.complement?.message}
          span="2 / 4"
        >
          <Input
            id="complement"
            type="text"
            autoComplete="address-line3"
            placeholder="Complemento"
            aria-invalid={errors.complement ? 'true' : 'false'}
            aria-describedby={errors.complement ? 'complement-error' : undefined}
            $hasError={!!errors.complement}
            {...register('complement')}
          />
        </AddressField>

        <AddressField id="district" label="Bairro" error={errors.district?.message} span="1 / 2">
          <Input
            id="district"
            type="text"
            autoComplete="address-level3"
            placeholder="Bairro"
            aria-invalid={errors.district ? 'true' : 'false'}
            aria-describedby={errors.district ? 'district-error' : undefined}
            $hasError={!!errors.district}
            {...register('district')}
          />
        </AddressField>

        <AddressField id="city" label="Cidade" error={errors.city?.message} span="2 / 3">
          <Input
            id="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Cidade"
            aria-invalid={errors.city ? 'true' : 'false'}
            aria-describedby={errors.city ? 'city-error' : undefined}
            $hasError={!!errors.city}
            {...register('city')}
          />
        </AddressField>

        <AddressField id="uf" label="UF" error={errors.uf?.message} span="3 / 4">
          <Input
            id="uf"
            type="text"
            autoComplete="address-level1"
            placeholder="UF"
            maxLength={2}
            aria-invalid={errors.uf ? 'true' : 'false'}
            aria-describedby={errors.uf ? 'uf-error' : undefined}
            $hasError={!!errors.uf}
            {...register('uf')}
          />
        </AddressField>
      </FieldsGrid>
    </FormContainer>
  )
}
