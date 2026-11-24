import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      <p>A página que você tentou acessar não existe.</p>
      <Link to="/">Voltar para a Home</Link>
    </section>
  )
}
