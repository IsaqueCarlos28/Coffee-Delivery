import styled from 'styled-components'
import { useCart } from '../hooks/useCart'

const Badge = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const VisuallyHidden = styled.span`
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

export function CartBadge() {
  const { totalUnits } = useCart()

  const label =
    totalUnits === 1 ? '1 item no carrinho' : `${totalUnits} itens no carrinho`

  return (
    <>
      {totalUnits > 0 && <Badge aria-hidden="true">{totalUnits}</Badge>}
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {totalUnits > 0 ? label : ''}
      </VisuallyHidden>
    </>
  )
}
