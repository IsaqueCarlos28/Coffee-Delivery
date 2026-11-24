import styled from 'styled-components'
import { useCart } from '../hooks/useCart'
import { formatBRL } from '../utils/money'
import type { DetailedCartItem } from '../types'
import { QuantityInput } from './QuantityInput'

interface CartItemProps {
  item: DetailedCartItem
}

const ItemContainer = styled.article`
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ItemImage = styled.img`
  width: 4rem;
  height: 4rem;
  flex-shrink: 0;
`

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
  }
`

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ItemName = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  text-transform: uppercase;
`

const ItemPrice = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`

export function CartItem({ item }: CartItemProps) {
  const { increment, decrement, remove } = useCart()
  const itemTotal = formatBRL(item.coffee.priceInCents * item.quantity)

  return (
    <ItemContainer>
      <ItemImage src={item.coffee.image} alt={item.coffee.name} width={64} height={64} />
      <ItemContent>
        <ItemInfo>
          <ItemName>{item.coffee.name}</ItemName>
          <Actions>
            <QuantityInput
              value={item.quantity}
              onChange={(value) => {
                const difference = value - item.quantity

                if (difference > 0) {
                  for (let i = 0; i < difference; i += 1) increment(item.coffeeId)
                }

                if (difference < 0) {
                  for (let i = 0; i < Math.abs(difference); i += 1) decrement(item.coffeeId)
                }
              }}
              ariaLabel={`Quantidade de ${item.coffee.name}`}
            />
            <RemoveButton
              type="button"
              onClick={() => remove(item.coffeeId)}
              aria-label={`Remover ${item.coffee.name}`}
            >
              Remover
            </RemoveButton>
          </Actions>
        </ItemInfo>
        <ItemPrice>{itemTotal}</ItemPrice>
      </ItemContent>
    </ItemContainer>
  )
}
