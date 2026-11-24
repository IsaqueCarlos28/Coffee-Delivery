import { useState } from 'react'
import styled from 'styled-components'
import shoppingCartFillIcon from '../assets/icons/shopping-cart-fill.png'
import { useCart } from '../hooks/useCart'
import { formatBRL } from '../utils/money'
import type { Coffee } from '../types'
import { QuantityInput } from './QuantityInput'

interface CoffeeCardProps {
  coffee: Coffee
}

const CardContainer = styled.article`
  width: 100%;
  max-width: 16rem;
  padding: 0 1.25rem 1.25rem;
  border-radius: 6px 36px;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const CoffeeImage = styled.img`
  width: 7.5rem;
  height: 7.5rem;
  margin-top: -1.25rem;
  margin-bottom: 0.75rem;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
`

const Name = styled.h3`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
`

const Description = styled.p`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`

const Footer = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const Price = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;

  strong {
    font-family: 'Baloo 2', cursive;
    font-size: 1.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const AddToCartButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.5rem;
  border: 0;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.surface};
  font-weight: 700;
`

const CartIcon = styled.img`
  width: 1.375rem;
  height: 1.375rem;
  object-fit: contain;
`

export function CoffeeCard({ coffee }: CoffeeCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { add } = useCart()

  const handleAddToCart = () => {
    add(coffee.id, quantity)
    setQuantity(1)
  }

  const price = formatBRL(coffee.priceInCents)

  return (
    <CardContainer>
      <CoffeeImage src={coffee.image} alt={coffee.name} width={120} height={120} />
      <Tags>
        {coffee.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Tags>
      <Name>{coffee.name}</Name>
      <Description>{coffee.description}</Description>
      <Footer>
        <Price>
          <span>R$ </span>
          <strong>{price.replace('R$\u00A0', '')}</strong>
        </Price>
        <Actions>
          <QuantityInput
            value={quantity}
            onChange={setQuantity}
            ariaLabel={`Quantidade de ${coffee.name}`}
          />
          <AddToCartButton
            type="button"
            onClick={handleAddToCart}
            aria-label={`Adicionar ${coffee.name} ao carrinho`}
          >
            <CartIcon src={shoppingCartFillIcon} alt="" aria-hidden="true" />
          </AddToCartButton>
        </Actions>
      </Footer>
    </CardContainer>
  )
}
