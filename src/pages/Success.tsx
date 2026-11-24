import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { OrderSuccess } from '../components/OrderSuccess'
import { STORAGE_KEYS } from '../constants'
import type { Order, PaymentMethod } from '../types'

const EmptyContainer = styled.section`
  padding: 2rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const EmptyTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`

const HomeLink = styled(Link)`
  width: fit-content;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-weight: 700;
`

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'credit' || value === 'debit' || value === 'cash'
}

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== 'object') return false

  const order = value as Record<string, unknown>
  const address = order.address as Record<string, unknown> | undefined

  return (
    typeof order.id === 'string' &&
    typeof order.createdAt === 'string' &&
    Array.isArray(order.items) &&
    !!address &&
    typeof address.cep === 'string' &&
    typeof address.street === 'string' &&
    typeof address.number === 'string' &&
    typeof address.district === 'string' &&
    typeof address.city === 'string' &&
    typeof address.uf === 'string' &&
    isPaymentMethod(order.payment) &&
    typeof order.subtotalInCents === 'number' &&
    typeof order.deliveryFeeInCents === 'number' &&
    typeof order.totalInCents === 'number'
  )
}

function getStoredOrder(): Order | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.lastOrder)
    if (!stored) return null

    const parsed: unknown = JSON.parse(stored)
    return isOrder(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function Success() {
  const order = getStoredOrder()

  if (!order) {
    return (
      <EmptyContainer>
        <EmptyTitle>Nenhum pedido confirmado</EmptyTitle>
        <EmptyDescription>Você ainda não tem um pedido confirmado.</EmptyDescription>
        <HomeLink to="/">Voltar para a Home</HomeLink>
      </EmptyContainer>
    )
  }

  return <OrderSuccess order={order} />
}
