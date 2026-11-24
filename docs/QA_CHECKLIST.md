# QA — Coffee Delivery

## 1. Análise de requisitos (riscos e ambiguidades)

| # | Achado | Impacto | Tratamento |
|---|--------|---------|------------|
| Q-01 | O link do Figma enviado na atividade (arquivo "Copy") é diferente do link do Notion; o arquivo copiado só tem Home, Checkout, Checkout preenchido e Sucesso. **Não aparece a página Style Guide** (paleta, tipografia) | Tokens podem ser inventados e divergir do protótipo | Abrir o arquivo original do Notion, extrair cores/tipografia do Style Guide e registrar no TECH_SPEC |
| Q-02 | No Figma, o filtro de tags (Tradicional, Especial, Com leite, Alcoólico, Gelado) está **oculto** na Home | Risco de implementar algo fora do MVP | D-11: tags só exibidas no card; filtro é extra |
| Q-03 | O Figma tem chip de localização ("City") no Header, mas nenhum RF o define | Ambiguidade | D-09: decorativo, constante |
| Q-04 | Não existe tela de carrinho separada: o ícone de carrinho leva ao Checkout, que lista os itens | Rota extra desnecessária | Rotas só `/`, `/checkout`, `/success` |
| Q-05 | RN-01 permite "remover ou impedir a redução" ao decrementar de 1 | Precisa de decisão documentada | D-02: mínimo 1 e botão Remover |
| Q-06 | RN-06 pede snapshot do pedido; um refresh em `/success` perderia o estado se ficasse só em memória | Página de sucesso vazia após F5 | D-05: persistir `last-order` |
| Q-07 | ViaCEP pode ficar indisponível ou limitar requisições durante a demonstração | Fluxo de checkout travado | Campos sempre editáveis; erro tratado; testes com mock |
| Q-08 | SPA publicada sem rewrite retorna 404 ao abrir `/checkout` direto | Reprovação no deploy | `vercel.json`/`_redirects` (T-21) e teste manual |
| Q-09 | Preços em float geram erros (ex.: 9,90 × 3) | Totais inconsistentes (RN-04) | Centavos inteiros |
| Q-10 | Carrinho guardando preço no storage pode ficar defasado | Totais errados após mudar catálogo | Guardar só `coffeeId` + `quantity` |
| Q-11 | Dark mode costuma ficar incompleto em formulários, erros, desabilitados e página de sucesso | Perda de pontos (15) | T-19 com checklist por tela |
| Q-12 | A rubrica premia **explicação oral** da arquitetura | Código gerado e não entendido | Prompt 15 após cada tarefa; ensaio na T-23 |
| Q-13 | Prazo e formato de apresentação não estão no enunciado ("informados pelo professor") | Planejamento | Confirmar data no Blackboard |

## 2. Matriz de testes por requisito

| Requisito | Teste automatizado | Teste manual |
|-----------|--------------------|--------------|
| RF-01 | Renderiza todos os cafés com 5 campos | Comparar com Figma |
| RF-02 | `QuantityInput`: 0, negativo, decimal, 99, 100 | Teclado e toque |
| RF-03 | Reducer: soma sem duplicar | Adicionar o mesmo café 3x |
| RF-04 | Badge soma unidades; some em 0 | Conferir no Header em todas as rotas |
| RF-05 | Reducer INC/DEC/REMOVE; totais | Remover o último item → estado vazio |
| RF-06 | `useLocalStorage`: válido, corrompido, indisponível | F5 com itens; editar o storage à mão |
| RF-07 | MemoryRouter: 3 rotas e NotFound | Abrir cada URL direto no deploy |
| RF-08 | Schema + `useCep` (sucesso, não encontrado, falha) | CEP real, CEP inexistente, offline |
| RF-09 | Schema exige pagamento | Setas do teclado no radio |
| RF-10 | 29,70 + 3,50 = 33,20 e outros casos | Conferir visualmente |
| RF-11 | Bloqueio com carrinho vazio e form inválido | Foco no 1º erro; leitor de tela |
| RF-12 | Sucesso mostra endereço e pagamento | Comparar com Figma |
| RF-13 | Carrinho `[]` após confirmar; sucesso intacto | Voltar à Home: badge zerado |
| RF-14 | Alternância + persistência + fallback do sistema | Em todas as telas e estados |
| RF-15 | — | 320 / 375 / 390 / 768 / 1280 / 1440 |
| RF-16 | Imagens com `alt` | Nitidez a 32 px; favicon na aba |

## 3. Casos de borda a exercitar

- [ ] Adicionar 99 de um café e tentar +1.
- [ ] Mesmo café em dois cliques com quantidades diferentes.
- [ ] `localStorage` com JSON inválido, array com item sem `quantity`, `coffeeId` inexistente, quantidade negativa ou string.
- [ ] Abrir `/success` sem pedido; abrir `/checkout` sem itens.
- [ ] Voltar do navegador depois de confirmar o pedido (carrinho deve continuar vazio).
- [ ] CEP com 7 dígitos, com letras, com hífen e sem hífen, `00000-000`.
- [ ] Digitar CEP válido, depois alterar para inválido (limpa/mantém campos? comportamento documentado).
- [ ] Trocar o CEP rapidamente (resposta antiga não pode sobrescrever a nova — `AbortController`).
- [ ] Rede offline durante a consulta.
- [ ] Duplo clique em "Confirmar pedido" (não criar dois pedidos).
- [ ] Trocar de tema durante o preenchimento do formulário (valores preservados).
- [ ] Nome longo de café e endereço longo (quebra de linha, sem overflow).

## 4. Checklist por dispositivo e tema

Repetir para **Home, Checkout (vazio, preenchido, com erros) e Sucesso**:

| Verificação | 320 | 375/390 | 768 | 1280/1440 | Light | Dark |
|-------------|-----|---------|-----|-----------|-------|------|
| Sem rolagem horizontal | [ ] | [ ] | [ ] | [ ] | — | — |
| Layout fiel ao Figma (colunas) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Alvos de toque ≥ 44 px | [ ] | [ ] | [ ] | — | — | — |
| Contraste AA (texto, borda, foco, erro, desabilitado) | — | — | — | — | [ ] | [ ] |
| Imagens sem deformação | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## 5. Acessibilidade (WCAG 2.2 AA)

- [ ] Navegação completa só com teclado (Tab, Shift+Tab, Enter, Espaço, setas no radio).
- [ ] Foco visível em todos os elementos interativos nos dois temas.
- [ ] Todo input tem `label` visível associado.
- [ ] Erros com `aria-invalid`, `aria-describedby` e `role="alert"`; foco vai ao primeiro erro.
- [ ] Status de CEP e contador do carrinho anunciados (`aria-live="polite"`).
- [ ] Botões só com ícone têm `aria-label`.
- [ ] Hierarquia de títulos coerente (um `h1` por página).
- [ ] Imagens com `alt` útil (decorativas com `alt=""`).
- [ ] Lighthouse: Acessibilidade ≥ 90 e Best Practices sem erros críticos.

## 6. Entrega (checklist final do enunciado)

- [ ] Projeto inicia e compila sem erros.
- [ ] Catálogo mostra imagem, nome, descrição, preço e quantidade.
- [ ] Mesmo café não duplica linha.
- [ ] Badge soma todas as unidades.
- [ ] Incrementar, decrementar e remover atualizam valores.
- [ ] Carrinho persiste após refresh; estado vazio adequado.
- [ ] CEP consulta API e preenche rua, bairro, cidade e UF; erros tratados; número manual; complemento opcional.
- [ ] Pagamento obrigatório e sem transação real.
- [ ] Subtotal, entrega e total corretos e formatados.
- [ ] Pedido inválido ou carrinho vazio não confirma.
- [ ] Sucesso mostra dados corretos.
- [ ] Logo criada com IA presente, nítida e documentada.
- [ ] Light/dark em todas as telas e persistente.
- [ ] Home, Checkout e Sucesso funcionam em desktop, tablet e celular.
- [ ] Componentes reutilizáveis, tipos, hooks e reducer sem mutação.
- [ ] PRD_SPEC, TECH_SPEC, TASKS_SPEC, AGENTS e README no GitHub.
- [ ] Uso de IA documentado com ≥ 3 evidências.
- [ ] Testes, evidências visuais e link de publicação disponíveis.
- [ ] Repositório público sem `node_modules`, `.env` ou segredos.
- [ ] Capturas: Home, Checkout, Sucesso e Dark Mode mobile + breve demonstração do fluxo.

## 7. Roteiro de explicação oral (prepare respostas)

1. Como o dado flui: componente → `useCart` → dispatch → reducer → contexto → persistência.
2. Por que `useReducer` e não vários `useState`? Por que o reducer é função pura?
3. Por que o carrinho guarda só `coffeeId` e `quantity`?
4. Por que centavos? O que aconteceria com `0.1 + 0.2`?
5. Como o snapshot do `Order` difere do carrinho e por que isso importa?
6. Como o Zod e o React Hook Form se conectam? Onde ficam as mensagens de erro?
7. Como o `useCep` evita respostas fora de ordem?
8. Como o tema é decidido ao abrir a aplicação (storage → sistema)?
9. Por que o deploy precisa de rewrite para a SPA?
10. Onde e como a IA foi usada, e o que você recusou ou corrigiu?

## 8. Autoavaliação pela rubrica (100 pts)

| Critério | Pts | Evidência a ter pronta |
|----------|-----|------------------------|
| Fluxo completo | 25 | Vídeo/demonstração do fluxo + testes de integração |
| Arquitetura React/TS | 20 | Reducer testado, contextos, hooks, sem `any` |
| Interface, Figma, logo, identidade | 15 | Comparação lado a lado com o Figma + seção Branding |
| Dark mode, mobile, a11y | 15 | Screenshots + checklist da seção 4 e 5 |
| Documentos SPEC | 15 | 4 arquivos atualizados e consistentes entre si |
| Testes, Git, deploy, README, IA | 10 | `test:run` verde, commits semânticos, URL pública, `AI_USAGE.md` |
