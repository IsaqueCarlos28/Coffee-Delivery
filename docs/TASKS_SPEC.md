# TASKS_SPEC — Plano de implementação

> Uma tarefa por vez. Ao concluir: marcar `[x]`, registrar o teste realizado e fazer commit semântico
> (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`, `chore:`).

Legenda de status: `[ ]` pendente · `[~]` em andamento · `[x]` concluída

| ID | Status | Objetivo | Requisitos | Arquivos principais | Critério de pronto |
|----|--------|----------|------------|---------------------|--------------------|
| T-01 | [ ] | Criar projeto Vite + React + TS, Git, dependências, estrutura de pastas, ESLint/Prettier, Vitest | RNF-05 | `package.json`, `vite.config.ts`, `tsconfig*.json`, pastas `src/*` | `npm run dev`, `build`, `lint` e `test:run` rodam sem erro |
| T-02 | [ ] | Tipos de domínio e catálogo tipado (com imagens exportadas do Figma) | RF-01, RN-08 | `types/*`, `data/coffees.ts`, `assets/coffees/*` | Catálogo compila; ids únicos; imagens carregam |
| T-03 | [ ] | Utilitários monetários e de preço (centavos, BRL, subtotal, total, taxa fixa) | RF-10, RN-03, RN-04 | `utils/money.ts`, `utils/pricing.ts` + testes | Testes unitários passam, incluindo arredondamento |
| T-04 | [ ] | Tokens light/dark, `GlobalStyle`, fontes Baloo 2 e Roboto, breakpoints | RF-14, RNF-01 | `styles/*` | Temas tipados; página base muda de tema |
| T-05 | [ ] | Branding com IA: gerar logo, variantes light/dark, favicon; registrar prompt e escolha | RF-16 | `assets/logo-*.svg`, `public/favicon.*`, `docs/AI_USAGE.md` | Logo nítida em 32 px nos dois fundos; processo documentado |
| T-06 | [ ] | `PageLayout`, `Header` (logo, localização decorativa, carrinho) e rotas | RF-07 | `App.tsx`, `components/Header`, `pages/*` (esqueleto) | Navegar entre `/`, `/checkout`, `/success` sem reload |
| T-07 | [ ] | `ThemeProvider`, `useTheme` e `ThemeToggle` com persistência e fallback do sistema | RF-14 | `contexts/ThemeContext`, `components/ThemeToggle` | Tema persiste após F5; segue o sistema sem escolha salva |
| T-08 | [ ] | Hero e catálogo da Home: `CoffeeCard`, `QuantityInput`, `CoffeeCatalog` | RF-01, RF-02 | `pages/Home`, `components/Coffee*`, `QuantityInput` | Cards fiéis ao Figma; quantidade 1–99 validada |
| T-09 | [ ] | `cartReducer` puro com todas as ações e testes | RF-03, RF-05, RN-01, RN-02 | `reducers/cartReducer.ts` + testes | Testes cobrem ADD/INC/DEC/REMOVE/CLEAR e imutabilidade |
| T-10 | [ ] | `CartProvider`, `useCart`, persistência com `useLocalStorage` resiliente | RF-06, RNF-04 | `contexts/CartContext`, `hooks/*` | Itens sobrevivem ao refresh; JSON corrompido não quebra |
| T-11 | [ ] | Integrar "Adicionar ao carrinho" e `CartBadge` | RF-03, RF-04 | `CoffeeCard`, `CartBadge`, `Header` | Badge mostra soma de unidades; some quando vazio |
| T-12 | [ ] | Checkout: lista de itens, `CartItem` (+/−/remover), `CartSummary`, `EmptyCart` | RF-05, RF-10, RN-09 | `pages/Checkout`, `CartItem`, `CartSummary`, `EmptyCart` | Totais corretos e atualizados; estado vazio exibido |
| T-13 | [ ] | `checkoutSchema` (Zod) e `DeliveryAddressForm` com RHF | RF-08, RN-07 | `schemas/checkoutSchema.ts`, `DeliveryAddressForm` + testes do schema | Erros por campo, acessíveis; complemento opcional |
| T-14 | [ ] | `useCep` com ViaCEP (loading, não encontrado, falha, abort) e preenchimento automático | RF-08, RN-07 | `hooks/useCep.ts` + testes com `fetch` mockado | CEP real preenche 4 campos; erros tratados e campos editáveis |
| T-15 | [ ] | `PaymentMethodSelector` (crédito, débito, dinheiro) integrado ao formulário | RF-09, RN-05 | `PaymentMethodSelector` | Sem seleção, não envia; navegável por teclado |
| T-16 | [ ] | Confirmar pedido: validar, montar `Order` (snapshot), salvar `last-order`, limpar carrinho, navegar | RF-11, RF-12, RF-13, RN-06, RN-10 | `pages/Checkout`, `utils/order.ts` | Carrinho vazio/inválido não confirma; carrinho zerado após sucesso |
| T-17 | [ ] | Página de sucesso com resumo e estado vazio | RF-12, RN-09 | `pages/Success`, `OrderSuccess` | Endereço e pagamento corretos; refresh mantém; sem pedido mostra vazio |
| T-18 | [ ] | Responsividade completa (320, 375/390, 768, 1280/1440) | RF-15, RNF-02 | estilos de todas as páginas | Sem rolagem horizontal; toque confortável; fluxo completo no mobile |
| T-19 | [ ] | Acessibilidade e dark mode em todas as telas (foco, contraste, `aria-*`, labels) | RF-14, RNF-01 | todos os componentes | Checklist de a11y do `QA_CHECKLIST.md` sem pendências |
| T-20 | [ ] | Testes de integração do fluxo de compra e do tema | RF-02..05, RF-11..14 | `tests/*` | Testes passam; fluxo feliz e 3 fluxos de erro cobertos |
| T-21 | [ ] | Deploy (Vercel/Netlify) com rewrite de SPA | RF-07 | `vercel.json` ou `public/_redirects` | URL pública abre as 3 rotas por acesso direto |
| T-22 | [ ] | README, screenshots (desktop, mobile, dark mode), `docs/AI_USAGE.md` (≥ 3 interações), atualização dos SPEC | RNF-07 | `README.md`, `docs/*`, `docs/screenshots/*` | Todos os itens da seção 11 do enunciado presentes |
| T-23 | [ ] | Revisão final: QA completo, console limpo, `build/lint/test`, ensaio da explicação oral | todos | — | Checklist de validação final 100% |

## Registro de execução

| Tarefa | Data | Teste realizado | Commit |
|--------|------|-----------------|--------|
| — | — | — | — |
