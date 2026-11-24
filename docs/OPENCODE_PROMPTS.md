# Prompts para o OpenCode — Coffee Delivery

Como usar: copie **um prompt por vez**, na ordem. Depois de cada um, rode o projeto, revise o diff, teste, faça o commit e só então siga. Se o OpenCode sair do escopo, use o **Prompt de correção** no final.

Pré-requisito: coloque `PRD_SPEC.md`, `TECH_SPEC.md` e `TASKS_SPEC.md` em `docs/` e `AGENTS.md` na raiz **antes** do Prompt 0.

---

## Prompt 0 — Alinhamento (sem código)

```
Você vai me ajudar no projeto final "Coffee Delivery" (React + TypeScript).
Leia AGENTS.md, docs/PRD_SPEC.md, docs/TECH_SPEC.md e docs/TASKS_SPEC.md por completo.

NÃO escreva código ainda. Responda apenas:
1. Resumo do produto em até 5 linhas.
2. Quais requisitos (RF/RN) você considera ambíguos ou conflitantes entre os 3 documentos.
3. Riscos técnicos que você enxerga (ex.: ViaCEP, persistência, rotas no deploy).
4. A próxima tarefa do TASKS_SPEC, com arquivos afetados e plano de testes.

Aguarde minha validação antes de implementar.
```

## Prompt 1 — T-01 Setup

```
Execute SOMENTE a tarefa T-01 do docs/TASKS_SPEC.md.
Crie o projeto Vite + React + TypeScript (strict) na pasta atual, inicialize Git se necessário e instale:
react-router-dom, styled-components, react-hook-form, zod, @hookform/resolvers,
e como dev: vitest, jsdom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, prettier, e os tipos necessários.
Crie as pastas da seção 2 do TECH_SPEC com um .gitkeep quando vazias.
Configure scripts: dev, build, preview, lint, test, test:run. Configure o Vitest com jsdom e setup do jest-dom.
Mantenha App.tsx mínimo. Não implemente nenhuma funcionalidade.
Ao final rode lint, test:run e build e mostre o resultado. Sugira o commit.
```

## Prompt 2 — T-02 e T-03 Tipos, catálogo e utilitários

```
Execute T-02 e T-03 do TASKS_SPEC.
1. Crie os tipos de domínio exatamente como na seção 3 do TECH_SPEC.
2. Crie src/data/coffees.ts com o catálogo tipado. Use os cafés do Figma (nome, descrição, tags, preço em centavos). Se eu ainda não tiver exportado as imagens, use um placeholder em src/assets/coffees/ e liste o que falta.
3. Crie utils/money.ts (formatBRL a partir de centavos) e utils/pricing.ts (DELIVERY_FEE_IN_CENTS = 350, calculateSubtotal, calculateTotal).
4. Escreva testes unitários: formatBRL (inclui 0, 350, 2970, 3320), subtotal e total, lista vazia.
Sem any. Rode lint/test/build e sugira o commit.
```

## Prompt 3 — T-04 e T-07 Tema

```
Execute T-04 e T-07 do TASKS_SPEC.
Crie tokens semânticos tipados e dois temas (light e dark) em src/styles, GlobalStyle com Baloo 2 e Roboto, breakpoints mobile-first.
Crie ThemeContext/ThemeProvider + useTheme: lê localStorage ('coffee-delivery:theme'), cai para prefers-color-scheme, persiste ao alternar e aplica data-theme no <html>. Crie o ThemeToggle acessível (button com aria-label dinâmico e aria-pressed).
Use styled-components ThemeProvider. Nenhuma cor hardcoded em componentes.
Teste: alterna tema, persiste, e segue a preferência do sistema quando não há valor salvo.
Rode lint/test/build e sugira o commit.
```

## Prompt 4 — T-06 Layout, Header e rotas

```
Execute T-06 do TASKS_SPEC.
Crie PageLayout, Header (logo placeholder por enquanto, chip de localização decorativo "Porto Alegre, RS" vindo de uma constante, ThemeToggle e botão de carrinho com link para /checkout) e as rotas "/", "/checkout", "/success" e "*" (NotFound) com React Router. Páginas ainda como esqueleto.
Header deve usar <header>, navegação por teclado e foco visível. Fiel ao layout do Figma (Navbar de 104px no desktop, conteúdo em até 1120px, margens de 160px no desktop).
Rode lint/test/build e sugira o commit.
```

## Prompt 5 — T-09 e T-10 Reducer e Context

```
Execute T-09 e T-10 do TASKS_SPEC.
1. cartReducer puro e imutável com ADD_ITEM, INCREMENT, DECREMENT, REMOVE, CLEAR conforme seção 4 do TECH_SPEC (RN-01 e RN-02; máximo 99).
2. Testes do reducer: soma de repetidos sem duplicar linha, quantidade < 1 ignorada, DECREMENT não passa de 1, REMOVE, CLEAR, e prova de que o estado anterior não foi mutado.
3. useLocalStorage resiliente (try/catch, JSON inválido, storage indisponível) com teste.
4. CartProvider + useCart: hidratação lazy do localStorage ('coffee-delivery:cart') descartando itens com formato inválido ou coffeeId inexistente no catálogo; grava a cada mudança; expõe items, totalUnits, subtotal, add, increment, decrement, remove, clear.
Rode lint/test/build, explique o fluxo do estado em poucas linhas e sugira o commit.
```

## Prompt 6 — T-08 e T-11 Home e adicionar ao carrinho

```
Execute T-08 e T-11 do TASKS_SPEC.
Implemente Hero da Home, CoffeeCatalog, CoffeeCard e QuantityInput conforme o Figma (card 256px no desktop, tags, preço em BRL, controle − / + e botão de carrinho).
QuantityInput aceita só inteiros de 1 a 99; − e + com aria-label; não permite 0, negativo ou decimal digitado.
Ao clicar em adicionar, chama useCart().add e reseta a quantidade do card para 1. CartBadge no Header mostra a SOMA das unidades e some quando é 0 (aria-live="polite" com texto acessível, ex.: "3 itens no carrinho").
Grid responsivo: 1 coluna até 639px, 2 até 899px, 3 até 1119px, 4 a partir de 1120px.
Testes: adicionar o mesmo café duas vezes gera uma linha; badge soma unidades.
Rode lint/test/build e sugira o commit.
```

## Prompt 7 — T-12 Checkout: itens e resumo

```
Execute T-12 do TASKS_SPEC.
Na página Checkout, implemente a coluna "Cafés selecionados": CartItem (imagem, nome, controle de quantidade com − desabilitado em 1, botão Remover), CartSummary (total de itens, entrega, total) e EmptyCart com link para a Home. Valores via utils/pricing e formatBRL; nada de cálculo dentro do JSX.
O botão "Confirmar pedido" fica desabilitado/bloqueado com carrinho vazio (a lógica de envio vem na T-16).
Layout fiel ao Figma no desktop (duas colunas: endereço/pagamento à esquerda, itens à direita) e coluna única no mobile.
Testes: totais corretos para 2 itens (29,70 + 3,50 = 33,20), estado vazio, remover atualiza totais.
Rode lint/test/build e sugira o commit.
```

## Prompt 8 — T-13, T-14 e T-15 Formulário, CEP e pagamento

```
Execute T-13, T-14 e T-15 do TASKS_SPEC (faça nesta ordem, e me mostre o resultado ao fim de cada uma).
T-13: checkoutSchema (Zod) conforme seção 7 do TECH_SPEC e DeliveryAddressForm com react-hook-form + zodResolver. Campos: CEP, Rua, Número, Complemento (opcional), Bairro, Cidade, UF. Máscara de CEP. Cada campo com <label> associado, aria-invalid e aria-describedby ligando à mensagem de erro.
T-14: useCep com ViaCEP (https://viacep.com.br/ws/{cep}/json/), AbortController, estados idle/loading/success/notFound/error. Preenche rua, bairro, cidade e UF com setValue e foca em Número. CEP não encontrado ({"erro": true}) ou falha de rede mostram mensagem acessível (role="alert") e mantêm os campos editáveis. Testes com fetch mockado para os 4 cenários.
T-15: PaymentMethodSelector com crédito, débito e dinheiro (radio group acessível, nada pré-selecionado, setas do teclado funcionam), integrado ao formulário e ao schema.
Testes do schema: CEP válido/inválido, UF inválida, campo obrigatório vazio, complemento opcional.
Rode lint/test/build e sugira os commits (um por tarefa).
```

## Prompt 9 — T-16 e T-17 Confirmar pedido e sucesso

```
Execute T-16 e T-17 do TASKS_SPEC.
T-16: no submit válido, monte um Order (snapshot com nome e preço unitário de cada item no momento da compra, endereço, pagamento, subtotal, entrega, total, id e createdAt), salve em 'coffee-delivery:last-order', limpe o carrinho (clear) e navegue para /success. Com carrinho vazio ou formulário inválido, NÃO cria pedido e mostra feedback acessível (foco no primeiro campo inválido). Função de montagem do pedido em utils/order.ts, pura e testada.
T-17: página Success fiel ao Figma ("Uhu! Pedido confirmado", entrega em <endereço>, previsão "20 min - 30 min" como constante, pagamento na entrega + forma escolhida). Lê o last-order. Sem pedido válido, mostra estado vazio com link para a Home.
Testes de integração: fluxo feliz até o sucesso com carrinho zerado depois; bloqueio com carrinho vazio; bloqueio com formulário inválido; refresh em /success mantém o pedido.
Rode lint/test/build e sugira os commits.
```

## Prompt 10 — T-05 Branding (aplicar a logo)

```
Execute a parte de código da T-05 do TASKS_SPEC.
Eu já gerei a logo com IA e coloquei os arquivos em src/assets/ (logo-light e logo-dark) e public/ (favicon). Aplique-os:
- Header troca a logo conforme o tema atual, com alt descritivo, width/height definidos e altura legível em mobile.
- <link rel="icon"> e <title> no index.html.
- Verifique que não há imagem quebrada em nenhuma rota.
Não gere imagens. Rode lint/test/build e sugira o commit.
```

## Prompt 11 — T-18 e T-19 Responsividade, dark mode e a11y

```
Execute T-18 e T-19 do TASKS_SPEC.
Revise TODAS as páginas e componentes em 320, 375, 390, 768, 1280 e 1440 px e nos dois temas:
- sem rolagem horizontal, sem texto sobreposto, sem imagem deformada;
- alvos de toque >= 44px;
- checkout em coluna única no mobile;
- contraste AA em light e dark (texto, bordas, foco, erros, estados desabilitados);
- foco visível, ordem de tabulação lógica, labels, aria-live;
- prefers-reduced-motion respeitado se houver animações.
Liste cada problema encontrado ANTES de corrigir, corrija em mudanças pequenas e mostre o antes/depois. Nada de refatorações fora do escopo.
Rode lint/test/build e sugira o commit.
```

## Prompt 12 — T-20 Testes de integração

```
Execute T-20 do TASKS_SPEC.
Revise a cobertura atual contra a tabela de testes da seção 9 do TECH_SPEC e a matriz do QA_CHECKLIST.md. Liste os requisitos RF/RN sem teste e escreva os que faltam, priorizando: fluxo de compra completo, persistência do carrinho após "refresh" (remontar o provider), tema persistido, JSON corrompido no storage.
Cada teste deve citar o RF/RN no nome. Não altere código de produção, exceto para corrigir bugs reais encontrados (me avise antes).
Rode test:run com cobertura e mostre o resumo.
```

## Prompt 13 — T-21 Deploy

```
Execute T-21 do TASKS_SPEC.
Adicione vercel.json com rewrite de qualquer rota para /index.html (ou public/_redirects se for Netlify). Rode build e preview local e confirme que abrir /checkout e /success diretamente funciona. Liste o passo a passo para publicar e conferir variáveis (não deve haver nenhuma).
```

## Prompt 14 — T-22 README e AI_USAGE (rascunho)

```
Execute T-22 do TASKS_SPEC.
Gere README.md com: objetivo, stack, instalação e scripts, estrutura de pastas, decisões técnicas (reducer, Context, persistência, ViaCEP, tema), seção "Branding com IA" (deixe campos <PREENCHER> para ferramenta, prompt e resultado), link do Figma, link do deploy (<PREENCHER>), seção de screenshots com os nomes de arquivo esperados em docs/screenshots/ (home-desktop, home-mobile, checkout, success, dark-mobile) e uma seção de evidências de uso de IA apontando para docs/AI_USAGE.md.
Crie docs/AI_USAGE.md com o modelo de registro (data, prompt, objetivo, resposta resumida, decisão, evidência) e 3 entradas vazias.
Não invente evidências nem screenshots.
```

## Prompt 15 — Revisão do passo (use após CADA tarefa)

```
Revise o que acabou de ser feito na tarefa <T-xx> como um revisor crítico:
1. Atende todos os critérios de pronto e requisitos listados no TASKS_SPEC?
2. Há mutação de estado, any, valor monetário em float ou regra de negócio dentro de JSX?
3. Algum caso de borda ficou sem teste?
4. O que eu preciso saber para explicar este código oralmente (3 pontos)?
Aponte problemas; só corrija se eu pedir.
```

## Prompt de correção (quando sair do escopo)

```
Você alterou arquivos além da tarefa <T-xx>. Reverta (git restore) tudo que não pertence a ela, mantenha apenas o escopo da tarefa e me explique o que foi desfeito. Releia o AGENTS.md: uma tarefa pequena por vez, sem extras.
```

## Prompt final — Auditoria geral

```
Faça uma auditoria final do projeto contra docs/PRD_SPEC.md e a seção 10 (checklist de validação) do enunciado:
- Para cada RF-01..RF-16 e RN-01..RN-10: atendido / parcial / não atendido, com o arquivo e o teste que comprovam.
- Itens do repositório: PRD_SPEC, TECH_SPEC, TASKS_SPEC, AGENTS, README, AI_USAGE, testes, vercel.json.
- Console do navegador limpo, build sem warnings, lint sem erros.
Entregue em tabela. Não corrija nada, apenas reporte.
```
