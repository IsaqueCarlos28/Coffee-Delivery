import styled from 'styled-components'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { EmptyCart } from '../components/EmptyCart'
import { DELIVERY_FEE_IN_CENTS } from '../constants'
import { useCart } from '../hooks/useCart'
import { media } from '../styles/breakpoints'
import { calculateTotal } from '../utils/pricing'

const CheckoutContainer = styled.div`
  display: grid;
  gap: 2rem;

  ${media.desktop} {
    grid-template-columns: 1fr 28rem;
    align-items: start;
  }
`

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  padding: 2rem;
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const RightColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SelectedCoffeesCard = styled(Card)`
  border-radius: 6px 44px;
`

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`

export function Checkout() {
  const { detailedItems, subtotalInCents } = useCart()
  const isCartEmpty = detailedItems.length === 0
  const deliveryFeeInCents = isCartEmpty ? 0 : DELIVERY_FEE_IN_CENTS
  const totalInCents = calculateTotal(subtotalInCents, DELIVERY_FEE_IN_CENTS)

  if (isCartEmpty) {
    return <EmptyCart />
  }

  const itemsList = detailedItems.map((item) => <CartItem key={item.coffeeId} item={item} />)

  return (
    <CheckoutContainer>
      <LeftColumn>
        <div>
          <SectionTitle>Complete seu pedido</SectionTitle>
          <Card>
            <PlaceholderText>Formulário de endereço e pagamento será implementado nas próximas tarefas.</PlaceholderText>
          </Card>
        </div>
      </LeftColumn>

      <RightColumn>
        <div>
          <SectionTitle>Cafés selecionados</SectionTitle>
          <SelectedCoffeesCard>
            {itemsList}
            <CartSummary
              subtotalInCents={subtotalInCents}
              deliveryFeeInCents={deliveryFeeInCents}
              totalInCents={totalInCents}
              isConfirmDisabled
            />
          </SelectedCoffeesCard>
        </div>
      </RightColumn>
    </CheckoutContainer>
  )
}
