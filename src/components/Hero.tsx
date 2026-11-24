import styled from 'styled-components'
import coffeeFillIcon from '../assets/icons/coffee-fill.png'
import packageFillIcon from '../assets/icons/package-fill.png'
import shoppingCartFillIcon from '../assets/icons/shopping-cart-fill.png'
import timerFillIcon from '../assets/icons/timer-fill.png'
import { media } from '../styles/breakpoints'

const HeroSection = styled.section`
  width: 100%;
  padding: 2rem 0 3rem;

  ${media.desktop} {
    padding: 5.75rem 0;
  }
`

const HeroContent = styled.div`
  display: grid;
  gap: 2rem;
  align-items: center;

  ${media.desktop} {
    grid-template-columns: 1fr 1fr;
  }
`

const HeroTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  margin-bottom: 1rem;

  ${media.tablet} {
    font-size: 3rem;
  }
`

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.125rem;
  margin-bottom: 2rem;
`

const BenefitsList = styled.ul`
  list-style: none;
  display: grid;
  gap: 1rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`

const IconCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.surface};
  flex-shrink: 0;
`

const BenefitIcon = styled.img`
  width: 1rem;
  height: 1rem;
  object-fit: contain;
`

const HeroImagePlaceholder = styled.div`
  width: min(100%, 29.75rem);
  min-height: 16rem;
  margin: 0 auto;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Baloo 2', cursive;
  font-size: 1.5rem;
`

const benefits = [
  { icon: shoppingCartFillIcon, text: 'Compra simples e segura' },
  { icon: packageFillIcon, text: 'Embalagem mantém o café intacto' },
  { icon: timerFillIcon, text: 'Entrega rápida e rastreada' },
  { icon: coffeeFillIcon, text: 'O café chega fresquinho até você' },
]

export function Hero() {
  return (
    <HeroSection>
      <HeroContent>
        <div>
          <HeroTitle>Encontre o café perfeito para qualquer hora do dia</HeroTitle>
          <HeroSubtitle>
            Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora
          </HeroSubtitle>
          <BenefitsList>
            {benefits.map((benefit) => (
              <BenefitItem key={benefit.text}>
                <IconCircle aria-hidden="true">
                  <BenefitIcon src={benefit.icon} alt="" />
                </IconCircle>
                <span>{benefit.text}</span>
              </BenefitItem>
            ))}
          </BenefitsList>
        </div>
        <HeroImagePlaceholder aria-hidden="true">Coffee Delivery</HeroImagePlaceholder>
      </HeroContent>
    </HeroSection>
  )
}
