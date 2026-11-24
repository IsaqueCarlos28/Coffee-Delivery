import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import styled from 'styled-components'
import bankRegularIcon from '../assets/icons/bank-regular.png'
import creditCardRegularIcon from '../assets/icons/credit-card-regular.png'
import currentDollarRegularIcon from '../assets/icons/current-dollar-regular.png'
import moneyRegularIcon from '../assets/icons/money-regular.png'
import type { CheckoutFormInput } from '../schemas/checkoutSchema'

interface PaymentMethodSelectorProps {
  register: UseFormRegister<CheckoutFormInput>
  errors: FieldErrors<CheckoutFormInput>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Header = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Icon = styled.img`
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
  object-fit: contain;
`

const Title = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.125rem;
`

const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
`

const Legend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Options = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;

  &:has(input:checked) {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surface};
  }

  &:has(input:focus-visible) {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`

const RadioInput = styled.input`
  accent-color: ${({ theme }) => theme.colors.accent};
  margin: 0;
`

const OptionIcon = styled.img`
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  object-fit: contain;
`

const ErrorMessage = styled.p`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
`

const paymentOptions = [
  { value: 'credit', label: 'Cartão de crédito', icon: creditCardRegularIcon },
  { value: 'debit', label: 'Cartão de débito', icon: bankRegularIcon },
  { value: 'cash', label: 'Dinheiro', icon: moneyRegularIcon },
] as const

export function PaymentMethodSelector({ register, errors }: PaymentMethodSelectorProps) {
  const error = errors.payment?.message
  const errorId = 'payment-error'

  return (
    <Container>
      <Header>
        <Icon src={currentDollarRegularIcon} alt="" aria-hidden="true" />
        <div>
          <Title>Pagamento</Title>
          <Description>
            O pagamento é feito na entrega. Escolha a forma que deseja pagar
          </Description>
        </div>
      </Header>

      <Fieldset aria-describedby={error ? errorId : undefined}>
        <Legend>Forma de pagamento</Legend>
        <Options>
          {paymentOptions.map((option) => (
            <OptionLabel key={option.value}>
              <RadioInput
                type="radio"
                value={option.value}
                aria-invalid={error ? 'true' : 'false'}
                {...register('payment')}
              />
              <OptionIcon src={option.icon} alt="" aria-hidden="true" />
              <span>{option.label}</span>
            </OptionLabel>
          ))}
        </Options>
        {error ? (
          <ErrorMessage id={errorId} role="alert">
            {error}
          </ErrorMessage>
        ) : null}
      </Fieldset>
    </Container>
  )
}
