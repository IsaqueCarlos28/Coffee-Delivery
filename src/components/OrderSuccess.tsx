import styled from 'styled-components'
import { DELIVERY_ETA } from '../constants'
import { media } from '../styles/breakpoints'
import type { Order } from '../types'

interface OrderSuccessProps {
  order: Order
}

const Container = styled.section`
  display: grid;
  gap: 2.5rem;
  padding: 2rem 0;

  ${media.desktop} {
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
`

const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 0.25rem;
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
`

const OrderInfoCard = styled.div`
  margin-top: 2.5rem;
  padding: 1.5rem;
  border-radius: 6px 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${media.tablet} {
    padding: 2.5rem;
  }
`

const InfoRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`

const IconBadge = styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.surface};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const InfoText = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.3;
`

const Illustration = styled.div`
  min-height: 16rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Baloo 2', cursive;
  font-size: 1.5rem;
`

function getPaymentLabel(payment: Order['payment']) {
  if (payment === 'credit') return 'Cartão de Crédito'
  if (payment === 'debit') return 'Cartão de Débito'
  return 'Dinheiro'
}

export function OrderSuccess({ order }: OrderSuccessProps) {
  const paymentLabel = getPaymentLabel(order.payment)
  const { address } = order
  const complement = address.complement ? `, ${address.complement}` : ''

  return (
    <Container>
      <div>
        <Heading>Uhu! Pedido confirmado</Heading>
        <Subtitle>Agora é só aguardar que logo o café chegará até você</Subtitle>

        <OrderInfoCard>
          <InfoRow>
            <IconBadge aria-hidden="true">📍</IconBadge>
            <InfoText>
              <p>
                Entrega em{' '}
                <strong>
                  {address.street}, {address.number}
                  {complement}
                </strong>
              </p>
              <p>
                {address.district} - {address.city}, {address.uf}
              </p>
            </InfoText>
          </InfoRow>

          <InfoRow>
            <IconBadge aria-hidden="true">⏱️</IconBadge>
            <InfoText>
              <p>Previsão de entrega</p>
              <p>
                <strong>{DELIVERY_ETA}</strong>
              </p>
            </InfoText>
          </InfoRow>

          <InfoRow>
            <IconBadge aria-hidden="true">💲</IconBadge>
            <InfoText>
              <p>Pagamento na entrega</p>
              <p>
                <strong>{paymentLabel}</strong>
              </p>
            </InfoText>
          </InfoRow>
        </OrderInfoCard>
      </div>

      <Illustration aria-hidden="true">Pedido a caminho</Illustration>
    </Container>
  )
}
