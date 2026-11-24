# AGENTS.md — Diretrizes para o assistente de IA

## Contexto do projeto

**Coffee Delivery** é a SPA de e-commerce de cafeteria (projeto final da disciplina SPA). O usuário vê o catálogo, adiciona cafés ao carrinho, preenche o endereço (com consulta de CEP), escolhe o pagamento e confirma um pedido fictício. Não há backend, login nem pagamento real.

Referência visual: protótipo no Figma (Home, Checkout, Checkout preenchido, Sucesso). Link no `README.md`.

## Leia antes de qualquer código

1. `docs/PRD_SPEC.md` — requisitos (RF), regras (RN) e decisões (D).
2. `docs/TECH_SPEC.md` — arquitetura, tipos, reducer, rotas, testes.
3. `docs/TASKS_SPEC.md` — tarefa atual e critérios de pronto.

Se algo conflitar entre arquivos ou estiver ambíguo, **pare e pergunte** em vez de decidir sozinho.

## Stack

React + Vite + TypeScript (strict), React Router, Context API + `useReducer`, React Hook Form + Zod, styled-components, Vitest + React Testing Library, ESLint + Prettier.

## Como trabalhar

- **Uma tarefa pequena por vez**, na ordem do `TASKS_SPEC.md`. Nunca gere a aplicação inteira de uma só vez.
- Antes de codar: informe a tarefa, os arquivos que vai criar/alterar e o plano de testes. Aguarde validação quando a mudança for ampla.
- Depois de codar: rode `npm run lint`, `npm run test:run` e `npm run build`; reporte o resultado.
- Explique decisões em linguagem simples. O aluno precisa conseguir explicar o código oralmente.
- Ao terminar: atualizar o status no `TASKS_SPEC.md` e sugerir a mensagem de commit.

## Regras de código

- TypeScript `strict`; **proibido `any`** e `@ts-ignore` sem justificativa.
- Estado imutável: usar `map`, `filter`, `find`, `reduce` e spread; nunca `push`, `splice` ou atribuição direta no estado.
- Dinheiro sempre em **centavos (inteiros)**; formatar com `formatBRL` apenas na exibição.
- Taxa de entrega em uma única constante; nenhuma regra de negócio em `App.tsx` ou dentro de JSX.
- Componentes pequenos, reutilizáveis e tipados; regras em `utils/`, `reducers/` e `hooks/`.
- Cores só por tokens do tema (nada de hex solto em componentes); dark mode em **todos** os componentes.
- Acessibilidade obrigatória: `label` por campo, foco visível, `button`/`a` semânticos, erros com `role="alert"` ou `aria-live`, `aria-invalid` e `aria-describedby`.
- Acesso a `localStorage` sempre com `try/catch` e validação do conteúdo lido.
- Consulta de CEP com `AbortController` e tratamento de: carregando, não encontrado, falha de rede.
- Nomes de arquivos de componente em PascalCase; código e identificadores em inglês, textos de interface em português.

## Limites de escopo

- Não adicionar bibliotecas fora da stack sem pedir aprovação e registrar o motivo no `TECH_SPEC.md`.
- Não implementar extras (busca, cupom, histórico, E2E) antes do MVP completo e validado.
- Não alterar requisitos nos SPEC sem avisar; mudanças de escopo exigem atualização dos documentos.
- Nunca commitar `.env`, segredos ou `node_modules`.

## Commits

Conventional Commits, um commit por tarefa concluída: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`, `chore:`.
Exemplo: `feat(cart): adiciona cartReducer com testes (T-09)`.

## Testes

- Lógica pura (`utils`, `reducers`, `schemas`) sempre com teste unitário.
- Hooks com efeitos (`useCep`, `useLocalStorage`) com `fetch`/storage mockados.
- Fluxos críticos com testes de integração (RTL + MemoryRouter).
- Cada teste referencia o requisito (RF/RN) no nome ou comentário.

## Uso responsável de IA

Toda interação relevante com IA deve poder ser registrada em `docs/AI_USAGE.md` (prompt, objetivo, resposta resumida, decisão tomada, evidência). O aluno revisa, testa e entende cada alteração antes de aceitar.
