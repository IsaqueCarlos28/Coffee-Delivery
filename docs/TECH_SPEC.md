# TECH_SPEC — Coffee Delivery

> Especificação técnica. Explica **como** os requisitos do `PRD_SPEC.md` serão implementados.

## 1. Stack e justificativas

| Tecnologia | Uso | Justificativa |
|------------|-----|---------------|
| React + Vite + TypeScript (strict) | SPA | Exigido; build rápido; tipagem forte |
| React Router | Rotas `/`, `/checkout`, `/success`, `*` (NotFound) | Exigido; navegação sem reload (RF-07) |
| Context API + `useReducer` | Estado do carrinho | Exigido; ações previsíveis e testáveis em função pura |
| Hooks próprios | `useCart`, `useTheme`, `useLocalStorage`, `useCep` | Reuso e isolamento de efeitos |
| React Hook Form + Zod (+ `@hookform/resolvers`) | Formulário de endereço | Exigido; schema único de validação |
| styled-components | Estilos e tema | Recomendado pelo enunciado; `ThemeProvider` facilita tokens light/dark |
| ViaCEP (fetch) | Consulta de CEP | API pública exigida (RF-08) |
| Vitest + React Testing Library + jsdom | Testes | Integração nativa com Vite |
| ESLint + Prettier | Qualidade | Código consistente |
| Vercel (ou Netlify) | Deploy | Exigido; exige regra de rewrite para SPA |
| Playwright + @playwright/test | E2E (extra aprovado) | Aprovado pelo aluno para T-01; complementa testes de integração |
| @playwright/mcp (via opencode.jsonc) | MCP de browser para agente | Aprovado pelo aluno para T-01; habilita automação/inspeção via MCP no projeto |

## 2. Arquitetura

Camadas com responsabilidades separadas:

- **data/**: catálogo estático tipado.
- **types/**: interfaces de domínio.
- **utils/**: funções puras (centavos → BRL, subtotal, total, máscara de CEP).
- **reducers/**: `cartReducer` puro e imutável.
- **contexts/**: `CartProvider` (reducer + persistência) e `ThemeProvider`.
- **hooks/**: acesso tipado aos contextos e lógica reutilizável.
- **schemas/**: schema Zod do checkout.
- **components/**: UI reutilizável, sem regra de negócio.
- **pages/**: composição de componentes por rota (`Home`, `Checkout`, `Success`).
- **styles/**: tokens, temas, `GlobalStyle`, breakpoints.

`App.tsx` apenas monta providers e rotas.

### Estrutura de diretórios

```txt
coffee-delivery/
├── public/                  # favicon, vercel.json (ou _redirects)
├── src/
│   ├── assets/              # logo (light/dark), imagens dos cafés
│   ├── components/          # Header, ThemeToggle, CoffeeCard, CoffeeCatalog, QuantityInput,
│   │                        # CartBadge, CartItem, CartSummary, DeliveryAddressForm,
│   │                        # PaymentMethodSelector, OrderSuccess, EmptyCart, PageLayout
│   ├── pages/               # Home, Checkout, Success, NotFound
│   ├── contexts/            # CartContext, ThemeContext
│   ├── reducers/            # cartReducer
│   ├── hooks/               # useCart, useTheme, useLocalStorage, useCep
│   ├── data/                # coffees.ts
│   ├── types/               # coffee.ts, cart.ts, order.ts
│   ├── schemas/             # checkoutSchema.ts
│   ├── utils/               # money.ts, pricing.ts, storage.ts, order.ts
│   ├── constants.ts         # DELIVERY_FEE_IN_CENTS, MAX_QUANTITY, DELIVERY_ETA, HEADER_LOCATION, STORAGE_KEYS
│   ├── styles/              # themes (light/dark), GlobalStyle, breakpoints
│   ├── tests/               # testes de integração
│   ├── App.tsx
│   └── main.tsx
├── docs/                    # PRD_SPEC, TECH_SPEC, TASKS_SPEC, AI_USAGE
├── AGENTS.md
├── opencode.jsonc           # configuração MCP do projeto (Playwright MCP)
├── playwright.config.ts
└── README.md
```

## 3. Modelo de dados

```ts
type CoffeeTag = 'tradicional' | 'especial' | 'com leite' | 'alcoólico' | 'gelado'

interface Coffee {
  id: string
  name: string
  description: string
  priceInCents: number
  image: string
  tags: CoffeeTag[]
}

// O carrinho guarda só id + quantidade; nome e preço vêm do catálogo (evita preço defasado no storage)
interface CartItem { coffeeId: string; quantity: number }

// Item enriquecido para UI/cálculo (não persiste no storage)
interface DetailedCartItem extends CartItem { coffee: Coffee }

type PaymentMethod = 'credit' | 'debit' | 'cash'

interface DeliveryAddress {
  cep: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  uf: string
}

// Snapshot imutável do pedido concluído (RN-06)
interface Order {
  id: string              // ex.: crypto.randomUUID()
  createdAt: string       // ISO string
  items: { coffeeId: string; name: string; unitPriceInCents: number; quantity: number }[]
  address: DeliveryAddress
  payment: PaymentMethod
  subtotalInCents: number
  deliveryFeeInCents: number
  totalInCents: number
}
```

## 4. Estado global do carrinho

`cartReducer(state: CartItem[], action: CartAction): CartItem[]`

| Ação | Payload | Comportamento |
|------|---------|---------------|
| `ADD_ITEM` | `coffeeId, quantity` | Ignora payload inválido (`quantity < 1` ou não inteiro); normaliza `quantity` para `1..MAX_QUANTITY`; soma na linha existente ou cria nova (RN-02); teto por linha: `min(MAX_QUANTITY, existente + qtdNormalizada)` (D-03) |
| `INCREMENT` | `coffeeId` | `+1` até `MAX_QUANTITY`; no-op em 99 e o botão `+` fica desabilitado (D-03) |
| `DECREMENT` | `coffeeId` | `-1`, nunca abaixo de 1 (RN-01) |
| `REMOVE` | `coffeeId` | Remove a linha |
| `CLEAR` | — | Retorna `[]` |

Regras: apenas `map`, `filter`, `find`, `reduce` e spread; nunca `push`/mutação. `MAX_QUANTITY = 99` vem de `src/constants.ts`.

**Contrato de carrinho e precificação (A6):**
- `utils/pricing.ts` recebe `items` e `catalog` por parâmetro (funções puras), sem importar dados globais.
- `CartProvider` importa `data/coffees.ts`, descarta ids desconhecidos na hidratação (RN-10) e expõe `items`, `detailedItems` (item + `coffee` do catálogo), `totalUnits`, `subtotalInCents`, `add`, `increment`, `decrement`, `remove`, `clear`.
- Estado inicial via inicializador lazy lendo `localStorage` com `try/catch` e validação de formato; efeito grava a cada mudança.
- Chaves em `STORAGE_KEYS` (`src/constants.ts`): `coffee-delivery:cart`, `coffee-delivery:theme`, `coffee-delivery:last-order`.

## 5. Cálculos e formatação (RN-03, RN-04)

- Constantes em `src/constants.ts`: `DELIVERY_FEE_IN_CENTS = 350` (D-01), `MAX_QUANTITY = 99` (D-03), `DELIVERY_ETA = "20 min - 30 min"` (D-10), `HEADER_LOCATION = "Porto Alegre, RS"` (D-09), `STORAGE_KEYS`.
- `utils/pricing.ts` expõe funções puras que recebem `items` e `catalog` por parâmetro (A6), ex.: `getSubtotalInCents(items, catalog)` e `getTotalInCents(subtotalInCents, deliveryFeeInCents = DELIVERY_FEE_IN_CENTS)`.
- `subtotal = items.reduce((sum, i) => sum + coffee.priceInCents * i.quantity, 0)`, onde `coffee` vem do `catalog` recebido.
- `formatBRL(cents)` usa `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` sobre `cents / 100` **somente na exibição**.
- Item cujo `coffeeId` não existe no catálogo é descartado na hidratação (RN-10).

## 6. Rotas

| Rota | Página | Observação |
|------|--------|------------|
| `/` | Home | Hero + catálogo |
| `/checkout` | Checkout | Itens, endereço, pagamento, totais; `EmptyCart` se vazio |
| `/success` | Success | Lê `last-order`; estado vazio se não houver |
| `*` | NotFound | Link para a Home |

Deploy: `vercel.json` com rewrite de todas as rotas para `/index.html` (ou `_redirects` no Netlify).

## 7. Formulário e validação

Schema Zod (`checkoutSchema`):

- `cep`: 8 dígitos, aceita `00000-000` ou `00000000`, normalizado.
- `street`, `district`, `city`: string não vazia (trim).
- `number`: string não vazia.
- `complement`: opcional.
- `uf`: uma das 27 UFs, 2 letras.
- `payment`: enum `credit | debit | cash` com mensagem "Selecione a forma de pagamento".

React Hook Form com `zodResolver`, `mode: 'onBlur'` (revalida no change após o primeiro erro). Erros ligados ao input via `aria-describedby` e `aria-invalid`.

### Consulta de CEP (`useCep`)

1. Quando o CEP tiver 8 dígitos válidos, chama `https://viacep.com.br/ws/{cep}/json/`.
2. Usa `AbortController` para cancelar consulta anterior e limpar no unmount.
3. Estados: `idle | loading | success | notFound | error`.
4. Resposta `{ "erro": true }` → `notFound`; falha de rede/HTTP → `error`.
5. Em sucesso: `setValue` de `street`, `district`, `city`, `uf` (e foco no campo número). Em `notFound`/`error`: mensagem acessível e campos liberados para preenchimento manual.

## 8. Tema, tokens e responsividade

- Tokens semânticos: `background`, `surface`, `surfaceAlt`, `text`, `textMuted`, `border`, `primary`, `primaryContrast`, `accent`, `danger`, `success`, `focusRing`. Dois objetos de tema (`lightTheme`, `darkTheme`) com o mesmo formato tipado (`DefaultTheme`).
- `ThemeProvider` próprio: lê `localStorage` (`STORAGE_KEYS.theme`) → fallback `prefers-color-scheme` → persiste ao alternar → aplica `data-theme` no `<html>`. Para evitar FOUC, `index.html` inclui script inline (antes da primeira renderização) que lê a chave de tema e define `data-theme` no `<html>` antes do React montar (T-07).
- Breakpoints (mobile-first): base ≤ 480; `tablet` ≥ 768; `desktop` ≥ 1024; conteúdo máximo ≈ 1120 px.
- Grid de cafés: 1 coluna (≤ 480), 2 (≥ 640), 3 (≥ 900), 4 (≥ 1120). Checkout em coluna única no mobile (resumo após formulário, ou resumo fixo ao final).
- Acessibilidade: landmarks (`header`, `main`), `button` real para ações, `label` visível por campo, `aria-live="polite"` para status do CEP e do carrinho, foco visível nos dois temas, `prefers-reduced-motion` respeitado.

## 9. Estratégia de testes

| Camada | Ferramenta | O que cobrir | Requisitos |
|--------|------------|--------------|------------|
| Unitário | Vitest | `formatBRL`, subtotal/total (funções puras com `catalog`), `cartReducer` (todas as ações, imutabilidade, limites, teto 99 por linha) | RF-03, RF-05, RF-10, RN-01..04, D-03 |
| Unitário | Vitest | `checkoutSchema` (válidos e inválidos) | RF-08, RF-09 |
| Hook | Vitest + RTL | `useLocalStorage` com JSON corrompido; `useCep` com `fetch` mockado (sucesso, não encontrado, falha) | RF-06, RF-08 |
| Integração | RTL + MemoryRouter | Adicionar ao carrinho, badge, checkout bloqueado, fluxo até sucesso, carrinho limpo | RF-02..05, RF-11..13 |
| Integração | RTL | Alternar tema e persistir | RF-14 |
| Manual | Navegador | Responsividade, contraste, teclado, refresh nas 4 rotas, deploy, compatibilidade (Chrome, Firefox, Safari, Edge), checagem básica de desempenho/imagens | RF-07, RF-15, RNF-01, RNF-03, RNF-06 |
| E2E (aprovado) | Playwright | Fluxo de compra completo (configurado na T-01; cenários expandidos depois) | extra aprovado |

Scripts: `dev`, `build`, `preview`, `lint`, `test`, `test:run`, `test:e2e`, `test:e2e:ui`.

## 10. Execução

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run lint
npm run test:run
```

## 11. Rastreabilidade

| Requisito | Onde é atendido |
|-----------|-----------------|
| RF-01..02 | `CoffeeCatalog`, `CoffeeCard`, `QuantityInput`, `data/coffees.ts` |
| RF-03..05 | `cartReducer`, `CartContext`, `CartBadge`, `CartItem` |
| RF-06 | `useLocalStorage`, `CartProvider` |
| RF-07 | `App.tsx`, `pages/NotFound` (ou equivalente), `vercel.json` |
| RF-08 | `DeliveryAddressForm`, `checkoutSchema`, `useCep` |
| RF-09..13 | `PaymentMethodSelector`, `CartSummary`, `utils/pricing`, `utils/order.ts`, `constants.ts`, `Checkout`, `Success` (inclui ETA D-10) |
| RF-14 | `ThemeContext`, `ThemeToggle`, `styles/themes`, script inline de tema em `index.html` |
| RF-15 | breakpoints e layouts por página |
| RF-16 | `assets/`, `Header`, favicon, seção "Branding com IA" no `README.md`, registro detalhado em `docs/AI_USAGE.md` |
| RNF-03 | imagens otimizadas com `width/height`, carregamento leve, revisão de re-render |
| RNF-06 | validação manual nas últimas versões de Chrome, Firefox, Safari e Edge |
