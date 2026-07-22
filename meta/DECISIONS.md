# DECISIONS.md — Registro de Decisões

> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> Duas naturezas: **DEC** (decisões de arquitetura/design) e **FIX** (bugs graves resolvidos, para não repetir).
> Não reescreva entradas antigas; se uma decisão for substituída, marque «SUPERADA por DEC-N» e adicione a nova.
> Quando passar de ~700 linhas, mova as mais antigas para `DECISIONS-archive.md`.

---

## DEC-001 — Arquitetura single-file (App.jsx monolítico)

**Data:** 2026-06-23 · **Status:** aceita

### Contexto
Projeto de médio porte com ~15 componentes React. A decisão de separar em arquivos surgiu cedo, mas o fluxo de trabalho é iterativo com um assistente de IA que precisa ler e editar os arquivos.

### Decisão
Manter **todos os componentes React em `App.jsx`**. Separar apenas o que tem papel claro e estável: `data.js` (banco de dados), `logic.js` (motor de cálculo), `icons.js` (mapeamento de ícones).

### Alternativas consideradas
- **Um arquivo por componente** — torna as edições cirúrgicas do assistente mais difíceis (precisa ler muitos arquivos por sessão); o projeto não tem testes que justifiquem o overhead.
- **Feature folders** — complexidade desnecessária para um SPA de página única sem roteamento.

### Consequências
App.jsx cresce (~2500 linhas). A compensação são comentários de seção (`// ─── Nome ───`) e busca por texto exato para navegar. O assistente encontra qualquer bloco via `Ctrl+F` por comentário ou nome de função.

---

## DEC-002 — T mutável para sistema de temas (sem React Context)

**Data:** 2026-06-23 · **Status:** aceita

### Contexto
O projeto precisa de dark/light theme. As opções avaliadas foram: React Context, CSS custom properties, prop-drilling e objeto global mutável.

### Decisão
`T` é um objeto mutável no topo do módulo. No início do render do `App`, antes de qualquer hook JSX, `Object.assign(T, THEME_ATUAL)` atualiza todos os valores sincronamente. Os componentes filhos leem `T.bg`, `T.accent` etc. diretamente — sem Context, sem props de tema.

### Alternativas consideradas
- **React Context** — exigiria `const T = useContext(ThemeCtx)` em cada um dos ~15 componentes; mais correto mas mais verboso para o fluxo atual.
- **CSS custom properties** — limpo, mas o código usa `T.cor + '25'` (concatenação de hex alpha) que não funciona com `var(--cor)`.
- **Prop-drilling** — impraticável para 15 componentes aninhados.

### Consequências
Funciona porque o React é single-thread e a atualização de T ocorre antes de qualquer JSX ser avaliado. **Risco:** se o projeto migrar para React concurrent mode com Suspense, pode haver race condition. Para o escopo atual, é seguro.

---

## DEC-003 — PNG para técnicas, SVG para gear/classe

**Data:** 2026-06-23 · **Status:** aceita

### Contexto
O jogo tem ícones de técnicas com bordas e símbolos dourados e preenchimento preto. Os ícones SVG disponíveis para técnicas, quando recebem `filter: brightness(0) invert(1)`, ficam completamente brancos — perdendo as cores originais e tornando-se indistinguíveis.

### Decisão
- **Técnicas e habilidades** → PNG (`/icons/techniques/*.png`). Sem filtro CSS. Cores originais preservadas.
- **Gear (katanas, arcos, amuletos, GWs) e classes** → SVG. Com `T.iconFilter` (`brightness(0) invert(1)` no escuro; `brightness(0)` no claro).

### Alternativas consideradas
- **SVG inline** — permitiria colorir paths individualmente, mas exige `@svgr/rollup` e refactoring significativo de todos os ícones.
- **Tudo PNG** — perde a vantagem de filtros CSS para adaptar ao tema.

### Consequências
`TECH_ICON` em `icons.js` usa extensão `.png`. `GEAR_ICON` usa `.svg`. A diferença é visível no código — nunca aplicar filtro em PNG de técnica.

---

## DEC-004 — Canvas API nativa para geração de imagem (sem html2canvas)

**Data:** 2026-06-24 · **Status:** aceita

### Contexto
O projeto precisa gerar imagens PNG das builds para compartilhamento. Duas opções: `html2canvas` (captura DOM) ou Canvas API nativa.

### Decisão
Canvas API nativa — sem dependências externas. A função `generateBuildImage` desenha programaticamente todos os elementos (header, colunas, ícones, texto) num `HTMLCanvasElement` offscreen.

### Alternativas consideradas
- **html2canvas** — mais fácil de implementar; mas adiciona ~300KB de bundle, tem bugs com `position: fixed`, não captura elementos fora da viewport, e o resultado é pixel-perfect da UI (não ideal para compartilhamento).
- **API de terceiro (ex: Bannerbear)** — requer backend e conta paga.

### Consequências
A função é assíncrona (carregamento de imagens via `Promise.all`). SVGs de gear precisam de `crossOrigin: 'anonymous'` para evitar `SecurityError` no canvas. Ícones que falham ao carregar são tratados silenciosamente (null) — o layout continua sem eles.

---

## DEC-005 — `icons.js` como arquivo separado

**Data:** 2026-06-23 · **Status:** aceita

### Contexto
O mapeamento de IDs de itens para URLs de ícones é extenso (~80 entradas) e cresce conforme novos ícones são adicionados. Mantê-lo em `App.jsx` aumentaria o arquivo desnecessariamente.

### Decisão
`src/icons.js` — arquivo dedicado ao mapeamento. Exporta `GEAR_ICON`, `TECH_ICON`, `CLASS_ICON`, `CLASS_TECH_FALLBACK`, `LOGO_URL`, `getGearIconUrl()`, `getTechIconUrl()`.

### Consequências
Adições de ícone = editar só `icons.js`. A única armadilha: os IDs em `icons.js` devem ser idênticos aos `item.id` de `data.js`. Para debugar discrepâncias, adicionar `console.log(item?.id)` temporariamente em `GearSlotCard`.

---

## DEC-006 — data.js 100% explícito (sem herança entre itens)

**Data:** 2026-06-23 · **Status:** aceita

### Contexto
Itens magistrais têm props e perks similares aos itens normais equivalentes. A tentação de criar um padrão "inherit from base" para evitar repetição.

### Decisão
Cada item magistral tem seus `props` e `perks` escritos **explicitamente e completos**. Zero herança implícita no array `GEAR`.

### Alternativas consideradas
- **Herança (`...BASE_PROPS`)** — reduz repetição mas esconde a estrutura real; bugs sutis quando uma base muda e o magistral não deveria herdar a mudança.

### Consequências
`data.js` é mais longo, mas cada item é uma fonte de verdade completa. Auditorias de dados são diretas.

---

## FIX-001 — Componentes declarados em duplicata (BookmarkTab, SaveDrawer, etc.)

**Data:** 2026-06-24

- **Sintoma:** `Identifier 'BookmarkTab' has already been declared` no Vite ao iniciar.
- **Causa raiz:** As instruções de Fase 1 pediram para adicionar os novos componentes antes de `// ─── App`, mas o usuário adicionou sem remover os que haviam sido entregues numa sessão anterior. Resultado: dois blocos de componentes no mesmo arquivo.
- **Solução:** Deletar linhas 1109–1724 do `App.jsx` (versão antiga de `BookmarkTab`, `SaveDrawer`, `ExportPanel`, `SettingsModal`). A versão correta (com `TrashIcon`, ícones e tema) começa na linha 1726.
- **Lição:** Ao entregar componentes novos como substituição de anteriores, especificar explicitamente "REMOVA o bloco X antes de adicionar Y". Virou armadilha no CONTEXT.

---

## FIX-002 — `<select>` encolhia ao selecionar vantagem (PerkRow)

**Data:** 2026-06-24

- **Sintoma:** O `<select>` de vantagem ficava com largura do texto quando uma opção era selecionada.
- **Causa raiz:** O `<Tooltip>` envolve filhos em `<span display:inline-block>`. O `width: '100%'` do `<select>` aplica-se ao span (que encolhe para o conteúdo), não ao container pai.
- **Solução:** Remover `<Tooltip>` como wrapper do `<select>` em `PerkRow`. Adicionar `display: 'block'` explícito ao select. A descrição da vantagem já aparece abaixo como texto estático.
- **Lição:** Nunca envolver `<select>` ou qualquer elemento que dependa de `width: 100%` com o componente `Tooltip`. Documentado nas armadilhas do CONTEXT.

---

## FIX-003 — TechRow com largura variável em 3-col (Tooltip inline-block)

**Data:** 2026-06-24

- **Sintoma:** Botões de vantagem de classe tinham larguras diferentes conforme tamanho do nome; alguns ficavam lado a lado em 3-col.
- **Causa raiz:** Mesmo problema do FIX-002 — `Tooltip` renderiza `<span display:inline-block>`. O button com `width: '100%'` herdava a largura do span (tamanho do conteúdo), não da coluna.
- **Solução:** Adicionar prop `wrapperStyle` ao `Tooltip`. Em `TechRow`, passar `wrapperStyle={{ display: 'block', width: '100%' }}` quando `layoutMode === 'three-col'`. O container dos tiers usa `display: grid` em 2-col para manter side-by-side. Código entregue no `GUIA_CORRECOES_FASE3.md`.
- **Lição:** O `Tooltip` é um wrapper invasivo para layout. Qualquer componente que precise de block layout deve passar `wrapperStyle` ou não usar `Tooltip` como wrapper.

---

## FIX-004 — 4º círculo de Determinação sempre visível (base sem bônus)

**Data:** 2026-06-24

- **Sintoma:** `HpResolveBar` mostrava 4 círculos (3 amarelos + 1 escuro) mesmo sem técnicas que aumentam DET.
- **Causa raiz:** `const maxCircles = 4` hardcoded renderizava sempre 4 círculos; o 4º ficava com estilo "vazio" (fundo T.dim).
- **Solução:** `const totalCircles = resolve` — exatamente quantos círculos existem. Sem círculo vazio extra.
- **Lição:** Valores de exibição devem ser derivados do estado real, não de constantes hardcoded de "máximo possível".

---

## FIX-005 — `generateBuildText` retornava `undefined` nas stats

**Data:** 2026-06-24

- **Sintoma:** Modo Estatístico gerava linhas como `Dano Corpo a Corpo: undefined`.
- **Causa raiz 1:** `getStatGroups(stats, lang)` — faltava o argumento `classId`. Assinatura real: `getStatGroups(stats, classId, lang)`.
- **Causa raiz 2:** `stat.formatted` não existe na estrutura retornada. Os campos disponíveis são `value`, `unit`, `label`, `base`.
- **Causa raiz 3:** Filtro `if (!stat.value || stat.value === 0)` incorreto para valores de base não-zero.
- **Solução:** Corrigir chamada para `getStatGroups(stats, build.classId, lang)`, adicionar `fmtStatTxt(s)` local, mudar filtro para `stat.value === stat.base`. Código entregue no `GUIA_CORRECOES_FASE3.md`.
- **Lição:** Sempre verificar a assinatura de funções de `logic.js` antes de usar — elas têm parâmetros específicos que o assistente pode errar ao referenciar de memória.

---

## DEC-007 — Adoção do kit KCM v1.73 e do fluxo chat ↔ Claude Code

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O projeto foi montado com uma geração anterior do Kit de Contexto: existiam os nove documentos de `meta/`, mas não havia `CEREBRO.md` (comportamento do assistente), nem os arquivos de arranque do Claude Code, nem `.flatdropignore`. O upload achatado para o Projeto do Claude subia 34 arquivos / ~717 KB / ~183 mil tokens estimados, incluindo cinco cópias quase idênticas do `App.jsx` (`src/v1..v4` + `src/App.jsx`).

### Decisão
Adotar o template-update do KCM v1.73.0 com adaptação, não com substituição: `meta/CEREBRO.md` entra reescrito nas seções que colidiam com a prática do projeto; as Instruções do Projeto são regeneradas a partir do template mas especializadas; o kit do Claude Code (`CLAUDE.md`, `.claude/settings.json`, skills `/apply-spec` e `/wrap`) é instalado na raiz e versionado; `.flatdropignore` passa a excluir `logs/`, `meta/specs/`, `src/v1..v3/` e `src/v4/App.jsx` do mount.

Passa a valer o método de duas raias: o **chat** cura e autora documentos; o **Claude Code** executa código e aplica deltas de doc por **spec** em `meta/specs/`, com âncora semântica e a regra "se não achar, PARA".

### Alternativas consideradas
- **Manter tudo no chat** — foi o modo até aqui; produziu os `GUIA_*.md`, que exigem aplicação manual do usuário e são justamente o gargalo que deixou a Fase 3 parada desde junho.
- **Adotar o template inteiro sem adaptar** — regrediria convenções já estabelecidas (ver DEC-008) e reescreveria documentos vivos com placeholders vazios.

### Consequências
O `App.jsx` monolítico (~2500 linhas) passa a poder ser editado por âncora pelo Code, sem o usuário costurar código à mão. Em troca, o projeto ganha quatro arquivos de infraestrutura para manter e uma disciplina nova (uma spec por delta, um canal por doc por ciclo). Specs viram artefato versionado.

---

## DEC-008 — Template-update do KCM vale como sugestão quando colide com prática em vigor

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O `CEREBRO.md` e as Instruções que o kit gera são texto genérico de nicho, escritos sem conhecer esta obra. Duas linhas do template batiam de frente com o projeto: "nomes de arquivos, funções e variáveis em inglês" (o projeto usa IDs `snake_case` em PT-BR, espelhando `data.js`, e renomeá-los quebraria o mapeamento de ícones em silêncio) e "mensagens de commit no imperativo curto em PT-BR" (que o próprio CEREBRO contradiz na seção de commit, onde pede Conventional Commits).

### Decisão
Convenção genérica vinda de um template-update é **sugestão**, não ordem. O assistente não refatora o projeto para caber no template; adapta o CEREBRO e as Instruções para descreverem o que o projeto de fato faz, aponta a colisão, e registra o desvio aqui e em «Feedback para o Kit» no IDEAS. A regra ficou escrita no próprio `meta/CEREBRO.md`, na seção «Ao receber um template-update do KCM».

### Consequências
Atualizações futuras do kit são seguras de aplicar: o pior caso vira uma linha de feedback, não uma renomeação em massa. O custo é que o CEREBRO deste projeto diverge do template canônico — a divergência é intencional e está documentada.

---

## DEC-009 — `HISTORICO.md` renomeado para `HISTORY.md`

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O arquivo nasceu como `meta/HISTORICO.md`, mas o kit o chama de `HISTORY.md` em todos os lugares onde ele é referenciado (tabela «Como manter os documentos» do CEREBRO, lista de arquivos das Instruções, manifesto de update). Manter os dois nomes obrigaria a traduzir mentalmente a cada leitura.

### Decisão
Renomear para `meta/HISTORY.md` e alinhar o título interno. Verificado antes: o nome antigo não era citado por nenhum outro documento de `meta/` — só pelo próprio título e pelos arquivos gerados pelo FlatDrop (`_MANIFEST.md`, `_TREE.md`), que são regenerados a cada upload. O custo do rename era, portanto, quase zero.

### Consequências
Os nomes de `meta/` passam a bater 1:1 com o vocabulário do kit. O `_MANIFEST.md` do próximo flatdrop refletirá o nome novo sozinho.

---

## DEC-010 — Commits em Conventional Commits, sem acento

**Data:** 2026-07-22 · **Status:** aceita · **Supera:** a convenção informal registrada no CONTEXT ("imperativo curto em PT-BR")

### Contexto
O `CONTEXT.md` registrava commits no imperativo curto em PT-BR, com o exemplo `adiciona geração de imagem` — acentuado. O ambiente de trabalho é Windows/CMD, que corrompe acentos em mensagem de commit, e o CEREBRO do kit pede Conventional Commits no bloco de fechamento.

### Decisão
`tipo(escopo): descricao`, tipos `feat` / `fix` / `docs` / `refactor` / `chore`, mensagem **sem acento**. Ex.: `feat(export): adiciona geracao de imagem`.

### Consequências
O histórico do repo fica legível por ferramenta e imune ao encoding do CMD. Commits antigos não são reescritos — a convenção vale daqui em diante.
