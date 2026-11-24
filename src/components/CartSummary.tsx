import styled from 'styled-components'
import { formatBRL } from '../utils/money'

interface CartSummaryProps {
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
  isConfirmDisabled: boolean
}

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`

const TotalRow = styled(SummaryRow)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
`

const ConfirmButton = styled.button`
  margin-top: 0.75rem;
  width: 100%;
  min-height: 2.875rem;
  border: 0;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-weight: 700;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export function CartSummary({
  subtotalInCents,
  deliveryFeeInCents,
  totalInCents,
  isConfirmDisabled,
}: CartSummaryProps) {
  const subtotalLabel = formatBRL(subtotalInCents)
  const deliveryLabel = formatBRL(deliveryFeeInCents)
  const totalLabel = formatBRL(totalInCents)

  return (
    <SummaryContainer>
      <SummaryRow>
        <span>Total de itens</span>
        <span>{subtotalLabel}</span>
      </SummaryRow>
      <SummaryRow>
        <span>Entrega</span>
        <span>{deliveryLabel}</span>
      </SummaryRow>
      <TotalRow>
        <span>Total</span>
        <span>{totalLabel}</span>
      </TotalRow>
      <ConfirmButton type="submit" disabled={isConfirmDisabled}>
        Confirmar pedido
      </ConfirmButton>
    </SummaryContainer>
  )
}
