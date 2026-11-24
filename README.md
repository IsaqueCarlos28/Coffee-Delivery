# Coffee Delivery

Aplicação SPA de e-commerce de cafeteria desenvolvida para a disciplina de SPA. O usuário navega pelo catálogo, adiciona cafés ao carrinho, preenche endereço com consulta de CEP, escolhe a forma de pagamento e confirma um pedido fictício.

## Objetivo

Implementar o fluxo completo de compra de cafés com React + TypeScript, seguindo o protótipo do Figma, com foco em estado previsível, acessibilidade, persistência local e documentação técnica.

## Stack

- **React 19 + Vite + TypeScript** (strict)
- **React Router** (rotas SPA)
- **Context API + useReducer** (estado do carrinho)
- **React Hook Form + Zod** (formulário e validação)
- **styled-components** (estilização com tema light/dark)
- **Vitest + React Testing Library** (testes)
- **ESLint + Prettier** (qualidade de código)

## Instalação e scripts

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview local do build
npm run preview

# Lint
npm run lint

# Testes
npm run test
npm run test:run

# Cobertura
npm run test:run -- --coverage

# E2E (Playwright)
npm run test:e2e
npm run test:e2e:ui
```

## Estrutura de pastas

```text
.
├── docs/                    # PRD, TECH, TASKS, QA, AI_USAGE, screenshots
├── public/                  # favicon e assets públicos
├── src/
│   ├── assets/              # logos e imagens do catálogo
│   ├── components/          # componentes reutilizáveis (UI)
│   ├── constants/           # constante exportada em constants.ts
│   ├── contexts/            # CartContext, ThemeContext
│   ├── data/                # catálogo tipado de cafés
│   ├── hooks/               # useCart, useTheme, useLocalStorage, useCep
│   ├── pages/               # Home, Checkout, Success, NotFound
│   ├── reducers/            # cartReducer puro
│   ├── schemas/             # checkoutSchema (Zod)
│   ├── styles/              # temas, GlobalStyle, breakpoints
│   ├── tests/               # testes de integração/hook/componente
│   ├── types/               # tipos de domínio
│   └── utils/               # money, pricing, order
├── vercel.json              # rewrite SPA para deploy
└── README.md
```

## Decisões técnicas

- **Reducer (`cartReducer`)**: ações puras e imutáveis (`ADD_ITEM`, `INCREMENT`, `DECREMENT`, `REMOVE`, `CLEAR`), com teto de 99 unidades por linha e validação de payload.
- **Context API**: `CartProvider` expõe estado e ações do carrinho; `ThemeProvider` controla tema light/dark. Hooks (`useCart`, `useTheme`) encapsulam acesso ao contexto.
- **Persistência**: `localStorage` com `try/catch` e validação do conteúdo lido. Carrinho persiste em `coffee-delivery:cart`; último pedido em `coffee-delivery:last-order`; tema em `coffee-delivery:theme`.
- **ViaCEP**: `useCep` consulta `https://viacep.com.br/ws/{cep}/json/` com `AbortController`, trata `loading/notFound/error` e mantém campos editáveis.
- **Tema**: tokens semânticos light/dark, `data-theme` no `<html>`, persistência em `localStorage` e fallback para `prefers-color-scheme`. Script inline no `index.html` evita FOUC.
- **Dinheiro**: valores em centavos inteiros; `formatBRL` usado apenas na exibição.

## Branding com IA

- **Ferramenta:** <PREENCHER>
- **Prompt usado:** <PREENCHER>
- **Resultado escolhido:** <PREENCHER>
- **Ajustes manuais:** <PREENCHER>
- **Arquivos:** `src/assets/logo-light.svg`, `src/assets/logo-dark.svg`, `public/favicon.svg`, `public/favicon.ico`

> Registro detalhado do processo em [`docs/AI_USAGE.md`](./docs/AI_USAGE.md).

## Figma

- Protótipo: <PREENCHER_LINK_FIGMA>

## Deploy

- URL pública: <PREENCHER_LINK_DEPLOY>

## Screenshots

Salvar as capturas em `docs/screenshots/` com os nomes abaixo:

| Arquivo | Descrição |
|---|---|
| `docs/screenshots/home-desktop.png` | Home (desktop) |
| `docs/screenshots/home-mobile.png` | Home (mobile) |
| `docs/screenshots/checkout.png` | Checkout |
| `docs/screenshots/success.png` | Sucesso |
| `docs/screenshots/dark-mobile.png` | Dark mode (mobile) |

```md
![Home desktop](./docs/screenshots/home-desktop.png)
![Home mobile](./docs/screenshots/home-mobile.png)
![Checkout](./docs/screenshots/checkout.png)
![Sucesso](./docs/screenshots/success.png)
![Dark mobile](./docs/screenshots/dark-mobile.png)
```

## Evidências de uso de IA

O uso de IA neste projeto está documentado em [`docs/AI_USAGE.md`](./docs/AI_USAGE.md), com registro de prompts, objetivo, resposta resumida, decisão e evidência (mínimo 3 interações, incluindo a geração da logo).

## Documentação

- [`docs/PRD_SPEC.md`](./docs/PRD_SPEC.md)
- [`docs/TECH_SPEC.md`](./docs/TECH_SPEC.md)
- [`docs/TASKS_SPEC.md`](./docs/TASKS_SPEC.md)
- [`docs/QA_CHECKLIST.md`](./docs/QA_CHECKLIST.md)
- [`AGENTS.md`](./AGENTS.md)

## Autor

<PREENCHER_NOME>
