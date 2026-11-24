import styled from 'styled-components'
import { coffees } from '../data/coffees'
import { CoffeeCard } from './CoffeeCard'

const CatalogSection = styled.section`
  width: 100%;
  padding: 2rem 0;
`

const Title = styled.h2`
  margin-bottom: 3.375rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem 2rem;
  justify-items: center;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1120px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export function CoffeeCatalog() {
  return (
    <CatalogSection>
      <Title>Nossos cafés</Title>
      <Grid>
        {coffees.map((coffee) => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </Grid>
    </CatalogSection>
  )
}
