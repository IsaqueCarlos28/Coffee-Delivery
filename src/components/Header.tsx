import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { HEADER_LOCATION } from '../constants'
import { media } from '../styles/breakpoints'
import { ThemeToggle } from './ThemeToggle'

const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
`

const HeaderContent = styled.div`
  width: min(100%, 1120px);
  min-height: 6.5rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  ${media.desktop} {
    height: 6.5rem;
    padding: 0;
  }
`

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Baloo 2', cursive;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const LocationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.875rem;
`

const CartLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-weight: 700;
`

export function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoLink to="/" aria-label="Coffee Delivery - ir para a página inicial">
          Coffee Delivery
        </LogoLink>

        <Actions>
          <LocationBadge aria-label={`Localização: ${HEADER_LOCATION}`}>
            <span aria-hidden="true">📍</span>
            {HEADER_LOCATION}
          </LocationBadge>
          <ThemeToggle />
          <CartLink to="/checkout" aria-label="Ir para o carrinho">
            Carrinho
          </CartLink>
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  )
}
