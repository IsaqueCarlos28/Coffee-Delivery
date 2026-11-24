import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { media } from '../styles/breakpoints'
import { Header } from './Header'

const MainContent = styled.main`
  width: min(100%, 1120px);
  margin: 0 auto;
  padding: 2rem 1.5rem;

  ${media.desktop} {
    padding: 2.5rem 1.5rem;
  }
`

export function PageLayout() {
  return (
    <>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  )
}
