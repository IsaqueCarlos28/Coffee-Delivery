import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'

export function App() {
  return (
    <ThemeProvider>
      <main>
        <h1>Coffee Delivery</h1>
        <ThemeToggle />
      </main>
    </ThemeProvider>
  )
}
