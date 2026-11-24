# PRD_SPEC — Coffee Delivery

> Product Requirements Document. Fonte da verdade do **o quê** o produto faz.
> Os IDs (RF-xx, RN-xx, RNF-xx, D-xx) são referenciados por `TECH_SPEC.md`, `TASKS_SPEC.md` e pelos testes.

## 1. Visão geral

**Problema:** clientes de uma cafeteria fictícia precisam consultar o cardápio, montar um pedido e confirmá-lo de forma simples, em qualquer dispositivo.

**Solução:** SPA de e-commerce (React + TypeScript) com catálogo, carrinho, checkout e confirmação de pedido fictício. Sem backend, sem autenticação, sem pagamento real.

**Objetivos**
1. Fluxo de compra completo: Home → Checkout → Sucesso.
2. Carrinho persistente e cálculos monetários consistentes.
3. Identidade visual própria (logo criada com IA), tema claro/escuro e responsividade.
4. Projeto documentado, testado e publicado.

**Público-alvo:** consumidores de café que compram pelo celular ou desktop.

**Referência visual:** protótipo Figma (Home, Checkout, Checkout preenchido, Sucesso).

## 2. Escopo

**Dentro do escopo:** catálogo, seletor de quantidade, carrinho, badge no header, checkout com endereço (ViaCEP) e pagamento, confirmação, tema light/dark, responsividade, logo/favicon, testes, deploy.

**Fora do escopo (MVP):** backend próprio, login, pagamento real, rastreio real de entrega, múltiplos endereços, estoque.

**Extras opcionais (só após o MVP 100%):** busca/filtro por tag, histórico de pedidos, cupom de desconto, E2E com Playwright, animações com `prefers-reduced-motion`.

## 3. Fluxos de usuário

1. **Compra:** Home → escolhe quantidade → "Adicionar" → badge atualiza → clica no carrinho → Checkout → revisa itens → preenche endereço (CEP preenche o restante) → escolhe pagamento → "Confirmar pedido" → Sucesso.
2. **Carrinho vazio:** Checkout sem itens mostra estado vazio com link para a Home.
3. **Acesso direto a /success sem pedido:** mostra estado vazio com link para a Home.
4. **Tema:** botão no Header alterna light/dark em qualquer tela.

## 4. Requisitos funcionais

| ID | Requisito | Critério de aceite verificável |
|----|-----------|--------------------------------|
| RF-01 | Exibir catálogo com imagem, nome, descrição, preço e tag(s) | Todos os cafés do arquivo de dados aparecem na Home com os 5 campos |
| RF-02 | Selecionar quantidade antes de adicionar | Valor inteiro entre 1 e 99; botões −/+ funcionam; não aceita 0, negativo ou decimal |
| RF-03 | Adicionar ao carrinho acumulando repetidos | Adicionar o mesmo café 2x resulta em 1 linha com quantidades somadas |
| RF-04 | Contador no Header | Badge = soma das quantidades; some quando o carrinho está vazio |
| RF-05 | Aumentar, diminuir e remover itens | Totais e badge atualizam imediatamente; remover exclui a linha |
| RF-06 | Persistir carrinho em localStorage | Após F5, itens e quantidades permanecem; dado corrompido não quebra a app |
| RF-07 | Navegar com React Router | Rotas `/`, `/checkout`, `/success` sem recarregar a página; refresh direto em qualquer rota funciona no deploy |
| RF-08 | Endereço com validação e consulta de CEP | CEP válido preenche rua, bairro, cidade e UF; número e complemento manuais; erros para CEP inválido, não encontrado e falha de rede |
| RF-09 | Escolher forma de pagamento | Crédito, débito ou dinheiro; nenhuma pré-selecionada; obrigatório |
| RF-10 | Subtotal, entrega e total | Valores conferem com RN-03 e são exibidos em BRL |
| RF-11 | Bloquear finalização inválida | Com carrinho vazio ou formulário inválido o pedido não é criado e há mensagem acessível |
| RF-12 | Confirmar pedido e mostrar resumo | Sucesso exibe endereço completo e forma de pagamento escolhidos |
| RF-13 | Limpar carrinho após confirmar | Carrinho zerado (e localStorage atualizado); Sucesso continua correto |
| RF-14 | Alternar light/dark | Todas as telas respeitam o tema; escolha persiste; sem escolha, segue o sistema |
| RF-15 | Responsividade | Fluxo completo utilizável em 320, 375/390, 768 e 1280/1440 px, sem rolagem horizontal |
| RF-16 | Logo original criada com IA | Logo no Header (versões para light e dark), favicon, seção "Branding com IA" documentada |

## 5. Regras de negócio

| ID | Regra | Decisão adotada |
|----|-------|-----------------|
| RN-01 | Quantidades | Adição exige ≥ 1. No carrinho, **diminuir em 1 não reduz abaixo de 1** (botão − desabilitado); remoção é feita pelo botão "Remover" (D-02) |
| RN-02 | Produto único | Uma linha por café; adicionar de novo soma a quantidade |
| RN-03 | Cálculo | `subtotal = Σ(preço × qtd)`; `total = subtotal + entrega`. Entrega fixa (D-01) |
| RN-04 | Dinheiro | Todos os valores em **centavos (inteiros)**; formatação BRL só na exibição |
| RN-05 | Pagamento | Apenas informativo; texto "pagamento na entrega" |
| RN-06 | Persistência | Carrinho em localStorage; pedido concluído é um **snapshot imutável** independente do carrinho |
| RN-07 | Endereço | Complemento opcional; CEP, rua, número, bairro, cidade e UF obrigatórios; ViaCEP obrigatório; campos preenchidos pela API continuam editáveis |
| RN-08 | Dados | Catálogo em arquivo local tipado |
| RN-09 | Estados vazios | Mensagens para carrinho vazio e para /success sem pedido |
| RN-10 | Navegação | Não confirmar com erros de validação ou itens inexistentes no catálogo |

## 6. Requisitos não funcionais

| ID | Requisito |
|----|-----------|
| RNF-01 | Acessibilidade: WCAG 2.2 AA como referência — labels associados, foco visível, navegação por teclado, erros anunciados (`aria-live`/`role="alert"`), contraste AA nos dois temas |
| RNF-02 | Responsividade mobile-first; alvos de toque ≥ 44 px |
| RNF-03 | Desempenho: imagens otimizadas e com `width/height`; carregamento inicial rápido; sem re-render desnecessário na lista |
| RNF-04 | Persistência resiliente: `try/catch` no JSON.parse e no acesso ao storage |
| RNF-05 | Qualidade: TypeScript `strict`, sem `any`, sem mutação de estado, ESLint sem erros, console limpo |
| RNF-06 | Compatibilidade: últimas versões de Chrome, Firefox, Safari e Edge |
| RNF-07 | Manutenibilidade: componentes reutilizáveis; regras de negócio fora dos componentes |

## 7. Marca, logo e temas

- Nome: *Coffee Delivery* ou marca autoral (definir em D-08).
- Logo gerada por IA (ferramenta, prompt, resultado e motivo da escolha documentados no README), com variantes para fundo claro e escuro, em SVG ou PNG nítido; legível em 32 px.
- Tipografia de referência: **Baloo 2** (títulos) e **Roboto** (texto). Paleta de referência: amarelo e roxo, adaptada nos dois temas via tokens semânticos.
- Verificar direitos de uso da imagem gerada.

## 8. Critérios de aceite gerais

- Checklist da seção 10 do enunciado (Notion) 100% marcado.
- `npm run build`, `npm run lint` e `npm test` passam.
- Aplicação publicada com as 3 rotas acessíveis por URL direta.
- Screenshots de Home, Checkout, Sucesso e Dark Mode mobile no README.
- Pelo menos 3 interações com IA registradas.

## 9. Decisões de produto

| ID | Decisão |
|----|---------|
| D-01 | Taxa de entrega fixa de **R$ 3,50** (350 centavos), definida em uma única constante (valor do Figma) |
| D-02 | Quantidade mínima no carrinho é 1; remover é ação explícita |
| D-03 | Quantidade máxima por operação: 99 |
| D-04 | Nenhuma forma de pagamento pré-selecionada |
| D-05 | Último pedido salvo em localStorage para sobreviver a refresh em /success |
| D-06 | `/checkout` com carrinho vazio mostra `EmptyCart`; `/success` sem pedido mostra estado vazio |
| D-07 | Tema inicial = preferência do sistema; depois, escolha salva |
| D-08 | Marca: _(definir: manter "Coffee Delivery" ou nome autoral)_ |
| D-09 | Chip de localização do Header é decorativo, com cidade em constante |
| D-10 | Previsão de entrega "20 min - 30 min" é texto fixo |
| D-11 | Filtro por tag fica fora do MVP; tags aparecem nos cards |
