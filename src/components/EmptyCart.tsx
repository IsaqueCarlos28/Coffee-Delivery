import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.section`
  padding: 2rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Title = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-weight: 700;
`

export function EmptyCart() {
  return (
    <Container>
      <Title>Seu carrinho está vazio</Title>
      <Description>Adicione cafés na página inicial para montar seu pedido.</Description>
      <HomeLink to="/">Ver catálogo</HomeLink>
    </Container>
  )
}
