import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'

export function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  )
}
