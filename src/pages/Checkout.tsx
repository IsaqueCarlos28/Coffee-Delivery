import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { DeliveryAddressForm } from '../components/DeliveryAddressForm'
import { EmptyCart } from '../components/EmptyCart'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { DELIVERY_FEE_IN_CENTS, STORAGE_KEYS } from '../constants'
import { useCart } from '../hooks/useCart'
import {
  checkoutSchema,
  type CheckoutFormData,
  type CheckoutFormInput,
} from '../schemas/checkoutSchema'
import { media } from '../styles/breakpoints'
import { buildOrder } from '../utils/order'
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

const Form = styled.form`
  display: contents;
`

export function Checkout() {
  const { detailedItems, subtotalInCents, clear } = useCart()
  const navigate = useNavigate()
  const {
    register,
    watch,
    setValue,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      uf: '',
    },
  })
  const cep = watch('cep')
  const isCartEmpty = detailedItems.length === 0
  const deliveryFeeInCents = isCartEmpty ? 0 : DELIVERY_FEE_IN_CENTS
  const totalInCents = calculateTotal(subtotalInCents, DELIVERY_FEE_IN_CENTS)

  function handleConfirmOrder(data: CheckoutFormData) {
    if (isCartEmpty) return

    const order = buildOrder({
      items: detailedItems,
      address: {
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        district: data.district,
        city: data.city,
        uf: data.uf,
      },
      payment: data.payment,
      subtotalInCents,
      deliveryFeeInCents: DELIVERY_FEE_IN_CENTS,
      totalInCents,
    })

    try {
      window.localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order))
    } catch {
      // Sem persistência disponível: segue fluxo em memória.
    }

    clear()
    navigate('/success')
  }

  if (isCartEmpty) {
    return <EmptyCart />
  }

  const itemsList = detailedItems.map((item) => <CartItem key={item.coffeeId} item={item} />)

  return (
    <CheckoutContainer>
      <Form noValidate onSubmit={handleSubmit(handleConfirmOrder)}>
        <LeftColumn>
          <div>
            <SectionTitle>Complete seu pedido</SectionTitle>
            <Card>
              <DeliveryAddressForm
                register={register}
                errors={errors}
                cep={cep}
                setValue={setValue}
                setFocus={setFocus}
              />
            </Card>
          </div>
          <Card>
            <PaymentMethodSelector register={register} errors={errors} />
          </Card>
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
                isConfirmDisabled={false}
              />
            </SelectedCoffeesCard>
          </div>
        </RightColumn>
      </Form>
    </CheckoutContainer>
  )
}
