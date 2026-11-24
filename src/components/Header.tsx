import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logoDark from '../assets/logo-dark.svg'
import logoLight from '../assets/logo-light.svg'
import { HEADER_LOCATION } from '../constants'
import { useCart } from '../hooks/useCart'
import { useTheme } from '../hooks/useTheme'
import { media } from '../styles/breakpoints'
import { CartBadge } from './CartBadge'
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
`

const LogoImage = styled.img`
  display: block;
  height: 2.5rem;
  width: auto;
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
  position: relative;
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
  const { totalUnits } = useCart()
  const { theme } = useTheme()
  const cartLabel =
    totalUnits > 0
      ? `Ir para o carrinho, ${totalUnits} ${totalUnits === 1 ? 'item' : 'itens'}`
      : 'Ir para o carrinho'
  const logoSrc = theme === 'dark' ? logoDark : logoLight

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoLink to="/" aria-label="Coffee Delivery - ir para a página inicial">
          <LogoImage src={logoSrc} alt="Coffee Delivery" width={387} height={128} />
        </LogoLink>

        <Actions>
          <LocationBadge aria-label={`Localização: ${HEADER_LOCATION}`}>
            <span aria-hidden="true">📍</span>
            {HEADER_LOCATION}
          </LocationBadge>
          <ThemeToggle />
          <CartLink to="/checkout" aria-label={cartLabel}>
            Carrinho
            <CartBadge />
          </CartLink>
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  )
}
