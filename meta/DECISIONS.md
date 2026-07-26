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

> **Emenda de 2026-07-22 — esta entrada esteve factualmente errada por quase um mês.** FIX-005 foi registrado como resolvido em 2026-06-24, mas a correção existia apenas dentro do `GUIA_CORRECOES_FASE3.md` e nunca foi aplicada ao `App.jsx`. O bug seguiu vivo e reapareceu em uso normal. A correção só entrou no código em 2026-07-22, pela spec0004. As três causas-raiz acima foram reconferidas nessa data e estavam exatas.
>
> Duas consequências da causa-raiz 1 que não constavam do registro original: com `classId` recebendo o valor de `lang`, (a) o rótulo nunca resolvia para `LABELS_EN` — **o export em inglês saía com rótulos em português**; e (b) o grupo de stats específico da classe era omitido por inteiro do texto, não impresso como `undefined`.
>
> **Lição maior, que motivou DEC-007:** um bug não está resolvido quando o conserto está escrito num documento. Está resolvido quando está no código, compilado e conferido. Nenhuma entrada de FIX deve ser criada com base em código que ainda não foi aplicado — se o código não entrou, o lugar é o `STATUS.md`, em «⏳ Pendente de Aplicação».

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

---

## FIX-006 — Props de item Magistral saíam abaixo do máximo na build aleatória

**Data:** 2026-07-22 · **Gravidade:** alta (valor errado gravado e propagado)

### Sintoma
Ao gerar build com o botão 🎲, itens Magistrais apareciam com props abaixo do máximo — por exemplo, Fustigador de Pedra ★ com `Dano de Contra-Ataque (10–20%)` em 11% e `Red. Recarga Habilidade (5–12%)` em 5%. No jogo, item Magistral sempre tem a prop no valor máximo, regra que o próprio `README.md` documenta.

### Causa raiz
`randomBuild()` chamava `randomInRange(p.mn, p.mx, p.u)` sem consultar `chosen.leg`, embora já usasse essa mesma flag duas linhas acima para controlar o limite de slots Magistrais. A trava de máximo nunca existiu na camada de lógica: ela só *parecia* funcionar porque `selectProp()` já usava `propDef.mx` como valor padrão, então quem montava a build à mão nunca via o problema.

### O que NÃO era a causa
O `App.jsx` estava correto o tempo todo. O `PropInput` recebe `locked={isLeg}` e renderiza o valor como texto travado, sem steppers. Ele travava fielmente — no valor errado que a lógica havia gravado. Um diagnóstico anterior culpou a UI por engano; ficou registrado aqui para não se repetir a suspeita.

### Alcance
Pior do que "o número aparece errado na tela": o valor fica gravado no estado do build, então viaja para o `.json` salvo e para o código Base64 de compartilhamento. Toda build gerada no 🎲 e salva antes desta correção carrega o valor errado no arquivo. A build de exemplo `O Samurai Contra-Ataca` foi conferida e está limpa — foi montada à mão.

### Correção
Quatro pontos em `src/logic.js`:
1. `isLegendarySlot(build, slotName)` — helper único, lê o item efetivo (preserva `leg` no amuleto com `classBinding`).
2. `randomBuild()` — usa `p.mx` quando `chosen.leg`.
3. `setPropValue()` — força `propDef.mx` em slot Magistral, antes do clamp comum. Defesa em profundidade; a UI hoje não alcança esse caminho.
4. `normalizeLegendaryProps(build)` chamado em `deserializeBuild()` — conserta na leitura o que já foi salvo errado. Cobre import de `.json` e código Base64, porque `decodeBuild` passa por `deserializeBuild`.

### Consequência aberta
O saneamento acontece **na leitura**. Um arquivo `.json` antigo no disco continua com o valor errado gravado até ser carregado e salvo de novo. Isso é intencional: a ferramenta não reescreve arquivos do usuário sozinha.

---

## DEC-011 — A extração retroativa vem antes da Fase 3

**Data:** 2026-07-23 · **Status:** aceita

### Contexto
Em 2026-07-22 reapareceram o `GUIA_CORRECOES_FASE3.md` — que continha a Fase 3 inteira e havia sido dado como perdido — e cinco arquivos de conversas antigas (~580 KB) anteriores à adoção do KCM. Com o guia recuperado, a Fase 3 passou a ser executável de imediato: o código do `generateBuildImage` está escrito.

### Decisão
Ainda assim, a Fase 3 **espera** a extração retroativa das conversas antigas.

O motivo é de requisito, não de organização. O prompt v7 registrado em `GOT_Build.md` mostra o autor perguntando explicitamente se os ícones das vantagens de classe entrariam na imagem gerada, e registrando preocupação de que tivessem sido esquecidos no layout proposto. Ou seja: as conversas contêm requisito da Fase 3 que o guia pode não ter absorvido. Construir 470 linhas de Canvas antes de ler isso é aceitar alta chance de refazer.

A extração deixou de ser um resgate de conteúdo perdido — o guia voltou — e virou levantamento de requisito.

### Método
Uma sessão por arquivo, do menor para o maior: `Joker` (15 KB) → `Alex` (61 KB) → `Origem` (197 KB) → `TOhno` (267 KB, provavelmente duas sessões). Cada sessão lê um arquivo, separa o que é pedido ainda aberto, ideia não implementada, decisão com motivo, e ruído; entrega UMA spec que anexa aos `meta/`; e só então o arquivo é apagado. `GOT_Build.md` já foi lido por inteiro em 2026-07-22.

### Alternativas consideradas
- **Fase 3 primeiro.** Fecharia o item mais visível do backlog, mas com risco de refação por requisito não lido.
- **Extração em uma sessão só.** Inviável: 580 KB não cabem numa janela junto com a produção de spec.

### Consequências
A Fase 3 fica adiada por várias sessões. Em troca, o backlog visível já está zerado pelas specs 0004–0006, então o adiamento não deixa nenhum defeito na tela.

---

## DEC-012 — Material legado passa a viver no repositório, fora do mount

**Data:** 2026-07-23 · **Status:** aceita

### Contexto
O `GUIA_CORRECOES_FASE3.md` se perdeu por viver apenas fora do repositório. O `meta/STATUS.md` chegou a registrar que ele "não será recuperado" e a orientar que o código de quatro correções fosse **reescrito do zero** — uma instrução ativa e errada, baseada num arquivo que existia. Ele reapareceu por acaso.

### Decisão
Todo material legado — os guias de aplicação e as cinco conversas antigas — passa a ser **versionado** em `meta/legacy/`, e o `.flatdropignore` o mantém **fora** do upload ao Projeto do Claude.

É exatamente para isso que os dois arquivos de ignore existem separados: o Git guarda para sempre; o flatdrop decide o que vale o peso da janela de contexto. São ~660 KB que só interessam quando a extração estiver em pauta, e podem ser reincluídos pontualmente com `!meta/legacy/<arquivo>`.

### Consequências
O material não se perde mais, e a pasta some da árvore de trabalho quando for apagada — porque o histórico já o guarda. O custo é um repositório maior; é texto, o Git lida bem.

**Regra que fica:** artefato do projeto que só existe fora do repositório é artefato em risco. Se importa, entra no Git; se pesa, sai do flatdrop. As duas coisas são independentes.

---

## FIX-007 — Props de item Magistral não eram sorteadas na build aleatória

**Data do registro:** 2026-07-23 · **Data da correção:** desconhecida (anterior à adoção do KCM) · **Gravidade:** alta

> **Registro retroativo.** O conserto **já está no código** — foi conferido em `src/logic.js` nesta data. O que faltava era o registro. A fonte é o `meta/legacy/GOT_Build_-_Joker.md`, blocos 1 e 2, extraído e removido pela `spec0008`.

### Sintoma
Ao gerar build com o botão 🎲, itens Magistrais vinham **sem nenhuma propriedade P1/P2**. As vantagens (perks) eram sorteadas normalmente, e itens comuns recebiam props normalmente — só o Magistral saía vazio.

### Causa raiz
Os filtros de props em `randomBuild()` carregavam a condição `&& !chosen.leg`:

```js
const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1') && !chosen.leg);
const p2opts = effectiveItem.props.filter(p =>
  p.sl.includes('P2') && !chosen.leg && !(p1 && p.sk === p1.sk)
);
```

Para item Magistral, `chosen.leg === true` → `!chosen.leg` é `false` → o filtro devolve lista **vazia** → nenhuma prop é escolhida. Os perks nunca tiveram essa condição, por isso funcionavam.

### Correção
Remoção de `!chosen.leg` dos dois filtros em `src/logic.js`. A guarda `!(p1 && p.sk === p1.sk)`, que impede P1 e P2 compartilharem o mesmo `sk`, foi preservada — é regra válida do jogo. Nada foi tocado em `App.jsx` nem em `data.js`.

### Relação com o FIX-006 — leia os dois juntos
São **dois bugs distintos nas mesmas linhas**, em momentos diferentes:

| | FIX-007 (este) | FIX-006 |
|---|---|---|
| Sintoma | Magistral sem prop nenhuma | Magistral com prop **abaixo do máximo** |
| Causa | filtro `!chosen.leg` zerava a lista | `randomInRange` ignorava `chosen.leg` |
| Ordem | veio antes | só apareceu **depois** que o FIX-007 fez a prop existir |

O FIX-006 só podia ser observado depois do FIX-007: enquanto não havia prop nenhuma, não havia valor errado para reparar. Quem for mexer em `randomBuild` precisa manter as duas correções — elas se sobrepõem no mesmo trecho.

### Estado hoje
Conferido em `src/logic.js` (2026-07-23): os filtros estão limpos e o valor é travado em `p.mx` para item Magistral. As duas correções coexistem.

---

## DEC-013 — Troca de classe propaga a técnica Magistral equivalente, em vez de remover o Magistral excedente

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita, em vigor no código

> **Registro retroativo.** O comportamento **já está implementado** em `changeClass` (`src/logic.js`) e o `meta/STATUS.md` já o lista como funcionando. O que faltava era o **porquê** — e, principalmente, a alternativa que foi rejeitada. Fonte: `meta/legacy/GOT_Build_-_Joker.md`, blocos 3 a 6.

### Contexto
Técnica Magistral concede `+1 legSlots`. Com ela equipada, o jogador pode usar 2 itens Magistrais, e a UI então **trava** a técnica: desequipá-la deixaria o build inválido.

Ao trocar de classe, `changeClass` preserva os itens compatíveis mas zera as técnicas (são da classe antiga). Resultado antigo: nova classe, 0 técnicas, limite base 1, **2 Magistrais equipados** — estado inválido, e sem nada travado na tela, porque `canChangeTech` só protege técnica já selecionada.

### Alternativa rejeitada — remover o Magistral excedente
A primeira proposta foi contar os Magistrais preservados e esvaziar os que passassem de `BASE_LEG_SLOTS`. Funcionava e era pequena. **Foi recusada pelo autor:** trocar de classe passaria a destruir equipamento montado, em silêncio, para consertar um problema que é de técnica, não de item.

### Decisão
Ao trocar de classe, para cada tier: se a técnica selecionada na classe antiga concedia `legSlots`, a técnica equivalente da **nova** classe no **mesmo tier** já entra equipada. Técnica não-Magistral continua sendo desequipada, como sempre.

Consequências, na ordem em que importam: o build permanece válido sem perder item; a gestão do limite fica com o jogador, que é quem sabe o que quer manter; e o caso em que o jogador tem folga (2 técnicas Magistrais e só 2 itens) não é tratado como erro — ele simplesmente continua com folga.

### Identificação de "técnica Magistral"
Não há flag própria. A regra é `tech.fx.some(fx => fx.s === 'legSlots')` — a mesma que `countLegBonus` e `checkLegendaryLimit` já usavam. Deliberado: uma flag nova seria uma segunda fonte de verdade sobre o mesmo fato.

### Invariante de que esta decisão depende — **conferida em 2026-07-23**
A correspondência "mesmo tier na outra classe" só fecha porque as quatro classes têm técnica com `legSlots` **exatamente nos tiers I e III**:

| Classe | Tier I | Tier II | Tier III |
|---|---|---|---|
| Samurai | `leg_sam_i` | — | `leg_sam_iii` |
| Caçadora | `leg_hun_i` | — | `leg_hun_iii` |
| Ronin | `leg_ron_i` | — | `leg_ron_iii` |
| Assassino | `leg_ass_i` | — | `leg_ass_iii` |

Nenhum tier fica órfão, então o estado inválido não volta por esse caminho. **A guarda é essa tabela, não o código:** se `data.js` algum dia ganhar uma técnica `legSlots` num tier assimétrico entre classes, `newLegTech` vira `undefined`, nada é equipado e o build inválido reaparece — sem erro no console. Quem mexer nas técnicas de `data.js` precisa reler este quadro.

---

## FIX-008 — `resolveCharmClassBinding` injetava props do sub-tipo do amuleto de classe

**Data do registro:** 2026-07-23 · **Data da correção:** desconhecida (anterior à adoção do KCM) · **Gravidade:** alta (stats calculadas em cima de props que o item não deveria ter)

> **Registro retroativo.** O conserto **já está no código** — `src/logic.js` foi conferido nesta data e bate com a versão corrigida. Fonte: `meta/legacy/GOT_Build_-_Alex.md`, blocos 1 e 2, extraído e removido pela `spec0009`.

### Sintoma
Ao vincular um amuleto Magistral a uma classe, apareciam props que nada tinham a ver com a classe — um magistral de Furtividade vinculado à Caçadora ganhava props de ataque à distância (`rangedDamage`, `drawSpeed`). Alguns perks também duplicavam entre amuletos, com `ritmo_cresc` e `golpes_abenc` reaparecendo onde não deviam.

### Causa raiz
A função **deduzia** o que era "exclusivo da classe" em vez de saber: procurava o amuleto de classe correspondente em `GEAR`, e considerava exclusivo todo prop dele cujo `sk` não existisse no magistral base.

O raciocínio confunde duas coisas diferentes. Um prop pode faltar no magistral base por ser exclusivo da classe — ou simplesmente por ser do **sub-tipo** do amuleto de classe (`ranged`, `defense`, `utility`). O filtro não distinguia, então tudo que faltava era promovido a exclusivo. Havia ainda uma lista `baseUniversalPerks` escrita à mão para tapar o mesmo buraco do lado dos perks, e o `GEAR.find` tinha um `!g.by.includes('hunter')` como remendo para não pegar o amuleto errado — dois sinais de que a dedução não se sustentava.

### Correção
Duas tabelas explícitas em `data.js` — `CLASS_EXCLUSIVE_CHARM_PROPS` e `CLASS_EXCLUSIVE_CHARM_PERKS`, indexadas por `classId` — e `resolveCharmClassBinding` passou a **ler** delas em vez de deduzir. Os filtros por `sk`/`id` que sobraram servem só para não duplicar o que o magistral base já tem.

Detalhe deliberado: nas tabelas, todos os props exclusivos têm `sl:["P1","P2"]`, mesmo os que no amuleto de classe original só existem em P2 (`alvos_extr`, `raio_lam`, `raio_raj_ro`). No magistral vinculado a regra é que ficam disponíveis nos dois slots.

### Por que isso vale ficar registrado
É o caso concreto que originou a DEC-006 (`data.js` 100% explícito) e a armadilha 7 do `CONTEXT.md`. A moral é reaproveitável: **derivar dado de domínio por comparação estrutural é frágil** — a comparação acerta pelo motivo errado até o dia em que não acerta, e falha sem erro, produzindo números plausíveis.

---

## DEC-014 — Perk de desbloqueio obrigatório via tabela `REQUIRED_PERKS`

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita, em vigor no código

> **Registro retroativo.** O comportamento já está implementado e o `meta/STATUS.md` já o lista como funcionando ("perk obrigatório travado 🔒"). Faltava a estrutura e o porquê dela. Fonte: `GOT_Build_-_Alex.md`, blocos 1 e 3.

### Contexto
Algumas armas de longo alcance pertencem a uma classe e só podem ser usadas pelas outras através de um perk de desbloqueio — Versátil no Arco Longo, Desbloqueio do Ronin na Zarabatana, e assim por diante. Na ferramenta, nada obrigava o jogador a gastar o slot: dava para montar um Samurai com Arco Longo sem Versátil, um build impossível no jogo.

### Decisão
Uma tabela em `data.js`, **aninhada por classe**:

```js
export const REQUIRED_PERKS = {
  arco_longo:         { samurai: 'versatil', ronin: 'versatil', assassin: 'versatil' },
  arco_ricocheteador: { samurai: 'versatil', ronin: 'versatil', assassin: 'versatil' },
  zarabatana:         { ronin: 'desbloq_ron' },
  pacote_bombas:      { assassin: 'desbloq_ass' },
  remedio_proibido:   { assassin: 'desbloq_ass_rp', samurai: 'desbloq_sam_rp' },
};
```

**A forma `{ itemId: { classId: perkId } }` não é decorativa.** A alternativa natural — `{ classes: [...], perkId }` — foi descartada porque o `remedio_proibido` tem **dois perks de desbloqueio distintos**, um para Assassino e outro para Samurai. Uma lista de classes com um perk só não os diferencia.

### Alcance no código
Seis pontos, todos conferidos em 2026-07-23:

| Onde | O quê |
|---|---|
| `logic.js` · `getRequiredPerkId(itemId, classId)` | helper único; devolve `null` quando não há obrigatoriedade |
| `logic.js` · `selectItem` | pré-preenche `perk1` ao equipar o item |
| `logic.js` · `selectPerk` | ignora silenciosamente qualquer interação com `perk1` travado |
| `logic.js` · `changeClass` | troca o perk obrigatório ao mudar de classe, ou libera o slot |
| `logic.js` · `randomBuild` | o 🎲 respeita o perk obrigatório e sorteia só o `perk2` |
| `App.jsx` · `PerkRow` (`forcedPerkId`) | select desabilitado, borda em `T.leg`, selo 🔒 Obrigatório |

### Consequência aberta
A tabela é uma lista à mão e **não se valida sozinha contra `GEAR`**. Um item que ganhe perk de desbloqueio em `data.js` e não entre aqui simplesmente não trava nada — sem erro. Já há um caso assim; ver o backlog do `STATUS.md`.

---

## DEC-015 — O vínculo de classe do amuleto Magistral é automático, não escolhido

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita, em vigor no código

> **Registro retroativo.** Fonte: `GOT_Build_-_Alex.md`, blocos 1 e 3.

### Contexto
Amuleto Magistral com `classBinding` tinha, no card do slot, um `<select>` "Vincular à classe" com as quatro classes. Mas `linkedClass` já era mantido igual à classe ativa em dois lugares — `createEmptyBuild` inicializa com `classId`, `changeClass` atualiza para `newClassId`. O seletor não acrescentava capacidade: só permitia produzir um estado que o jogo não admite (build de Samurai com amuleto vinculado ao Ronin).

### Decisão
O seletor saiu. O vínculo segue a classe ativa, sempre, e o campo `linkedClass` **permanece no estado do build** — é ele que `getEffectiveCharm(itemId, linkedClass)` consome. Só a interface de escolha deixou de existir.

### O que ficou por fazer

1. ~~**Código morto.**~~ **Resolvido em 2026-07-25** (spec0012): `onLinkedClass` removido do `App.jsx`, `setCharmLinkedClass` removido do `logic.js`, import limpo. O campo `linkedClass` do estado **permanece** e continua alimentando `getEffectiveCharm` — como esta decisão previa.
2. **Nenhuma indicação visual do vínculo.** A proposta original substituía o `<select>` por um selo "Vinculado a: 🗡️ Samurai". Isso não foi feito — o bloco foi apagado e nada entrou no lugar. Hoje o jogador vê props e perks de classe surgirem no amuleto sem nada na tela explicando de onde vêm. Continua no `IDEAS.md`.

---

## DEC-016 — Deploy pelo Netlify porque `npm run deploy` quebra no Windows

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita

> **Registro retroativo.** Fonte: `GOT_Build_-_Alex.md`, blocos 4 e 5 — o único trecho do arquivo que não é sobre o produto, e o mais operacional de todos.

### Contexto
A primeira tentativa de publicar foi por GitHub Pages, com `npm run deploy` (`vite build && npx gh-pages -d dist`). O build passou; o `gh-pages` morreu:

```
Error: spawn ENAMETOOLONG
    at ChildProcess.spawn (node:internal/child_process:421:11)
    ...at Git.rm (gh-pages/lib/git.js:146:15)
```

Não é erro do projeto. O `gh-pages` monta um `git rm` com todos os arquivos do `dist/` na mesma linha de comando, e o Windows tem teto de comprimento para isso. Com `public/icons/` passando de 120 arquivos, o teto estoura.

A tentativa seguinte — apontar o GitHub Pages para a `main` — serviu `App.jsx` e `data.js` crus ao navegador e produziu **página em branco**, porque JSX não é o que o browser executa; quem produz HTML+JS é o `npm run build`.

### Decisão
O site vive no **Netlify**, publicado a partir do `dist/`. O Vercel fica como alternativa e o GitHub Pages como via manual (empurrar o conteúdo de `dist/` para a `gh-pages` à mão), não pelo script.

### O que fica em vigor
- O script `deploy` **continua no `package.json`** e continua quebrado neste ambiente. Ele está no `deny` do `.claude/settings.json` — mas o motivo registrado até hoje era "publica no site real", e o motivo é maior: **ele não funciona aqui.**
- Página em branco depois de publicar quase sempre significa que foi publicado código-fonte em vez do `dist/`.

---

## DEC-017 — Munições exibidas conforme a classe ativa

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita, em vigor no código

> **Registro retroativo — e o achado principal desta extração.** A funcionalidade está em produção e **não existia em nenhum `meta/`**: busca por "munic" nos oito arquivos de contexto retornava zero. Fonte: `GOT_Build_-_Alex.md`, blocos 1 e 3.

### Contexto
No jogo, a mesma arma dá quantidades de munição diferentes conforme a classe. O `data.js` já guardava isso numa convenção de string, uma linha por munição:

```
Flecha Normal: 15
Flecha Flamejante: 2 (5)
Flecha Perfurante: (6)
```

O número **fora** dos parênteses é o das classes secundárias; o **entre** parênteses é o da classe primária da arma. Só o número entre parênteses significa munição que **apenas** a classe primária tem.

### Decisão
A convenção fica no dado e a interpretação é feita na exibição, por duas funções em `App.jsx`:

- **`getPrimaryClass(item)`** — `item.by[0]` quando há restrição de classe; `hunter` para item `ranged` com `by: null` (os arcos abertos são, na prática, arma de Caçadora); `null` nos demais.
- **`formatAmmoForClass(ammoStr, classId, item)`** — por linha: `X (Y)` mostra `Y` para a primária e `X` para as outras; `(Y)` mostra `Y` para a primária e **omite a linha inteira** para as outras; linha sem parênteses vale para todos.

Nenhuma mudança em `logic.js` nem no motor de stats — munição é informativa e não entra em `computeStats`.

### Alternativa considerada
Explodir a munição em campos por classe dentro de `data.js`. Rejeitada: multiplicaria o dado por quatro para representar uma diferença que quase sempre é de um número só, e a convenção `X (Y)` já vinha pronta do material de origem.

### Consequência aberta
A convenção é **implícita no dado** — é uma string, e nada valida seu formato. Uma linha escrita fora do padrão (parêntese em outro lugar, espaço a mais) não casa com nenhuma das duas expressões regulares e passa adiante inalterada, sem erro. Ver armadilha 9 no `CONTEXT.md`.

---

## DEC-018 — Regras canônicas de restrição de classe das armas de longo alcance

**Data do registro:** 2026-07-23 · **Status:** aceita · **Fonte:** `meta/legacy/GOT_Build_-_Origem.md`, blocos 21 e 27

### Por que isto existe
Foi o erro que mais voltou na origem do projeto. Marcar equipamento como "exclusivo desta classe" errado aconteceu pelo menos três vezes, e a causa foi identificada pelo autor: a planilha tem, na aba de Magistrais, quatro colunas por classe com marcações cruzadas — e essas colunas são **recomendação de build**, não permissão de uso. Ler aquilo como restrição de classe produz um `data.js` errado que parece plausível.

### A tabela canônica
Ditada pelo autor no bloco 27, contra o jogo. **É esta a referência; nada de reinferir da planilha.**

| Equipamento | Quem equipa |
|---|---|
| Arco Curto · Espírito Imponderável | qualquer classe, sem custo |
| Arco Longo · Arco Ricocheteador | qualquer classe — as não-Caçadoras gastam **Versátil** |
| Visão de Sugaru | qualquer classe, **sem custo** (ver abaixo) |
| Zarabatana · Picada Celestial | Assassino; **Ronin com perk de desbloqueio** |
| Pacote de Bombas | Ronin; **Assassino com perk** |
| Remédio Proibido | Ronin; **Assassino e Samurai com perk** |
| Katanas, Amuletos, AF I e AF II Magistrais | **todas** as classes |

Repare no par que não é simétrico: o Pacote de Bombas libera para o Assassino, mas a versão Magistral dele — o Remédio Proibido — libera para **Assassino e Samurai**. Não é erro de digitação.

### A Visão de Sugaru é o caso especial
Ela é um **Arco Longo**, e mesmo assim não exige Versátil. O motivo é de dado, não de mecânica: o pool dela é o do Arco Longo **menos** Disparo Arremessante, Certeiro, Olho de Águia e Versátil (bloco 21). Sem Versátil no pool, não há o que travar — e é assim no jogo. O Arco Ricocheteador, ao contrário, herda o pool do Arco Longo **inteiro**, e por isso exige Versátil.

**Consequência prática:** ausência de perk de desbloqueio no pool de um item não é omissão de dado. Antes de "consertar", cheque contra esta tabela.

---

## FIX-009 — Picada Celestial não travava o perk de desbloqueio para o Ronin

**Data:** 2026-07-23 · **Gravidade:** baixa (build inválido montável, sem corromper cálculo)

### Sintoma
O Ronin equipava a Picada Celestial e escolhia livremente as duas vantagens, sem gastar o Desbloqueio do Ronin. Build impossível no jogo. A Zarabatana, mesmo caso, travava corretamente — a diferença entre as duas era visível lado a lado.

### Causa raiz
`REQUIRED_PERKS` (`data.js`) não tinha entrada para `picada_celestial`. O perk `desbloq_ron_pc` estava no pool do item desde sempre; faltava só a linha da tabela. É exatamente a consequência aberta anotada na DEC-014: **a tabela é lista à mão e não se valida contra o `GEAR`**.

### Correção
Uma linha em `REQUIRED_PERKS`: `picada_celestial: { ronin: 'desbloq_ron_pc' }`. Nenhuma mudança em `logic.js` nem em `App.jsx` — os seis pontos de integração já existiam e passaram a cobrir o item sozinhos.

### Como foi encontrado
Não por relato de uso: apareceu na extração retroativa da spec0009, ao conferir `REQUIRED_PERKS` contra os pools de perk do `GEAR`. Ficou no backlog como "provável" até o bloco 27 do arquivo de origem confirmar a regra pela voz do autor. **A varredura que o achou vale repetir**: cruzar toda tabela de domínio escrita à mão contra o dado que ela indexa.

---

## DEC-019 — Os ranks S/A/B/C/D/E não entram na ferramenta

**Data do registro:** 2026-07-23 · **Status:** aceita, em vigor · **Fonte:** `GOT_Build_-_Origem.md`, bloco 15

As planilhas da comunidade trazem uma tier list por letra (S, A, B…) para os itens Magistrais, e uma versão antiga da ferramenta chegou a exibi-la ao lado do nome do item (`⭐ Espírito Imponderável [A]`).

**Foi removida.** Dois motivos, ambos do autor: a nota é **opinião de fã, não dado do jogo** — não aparece em lugar nenhum na tela do Tsushima; e o *Ghost of Yotei* usa um sistema de ranking por letra para outra coisa, então exibir letras aqui induz erro em quem joga os dois. A tier list continua existindo na planilha, que é onde uma opinião curada tem lugar.

**Regra que fica:** a ferramenta mostra o que o jogo mostra. Dado derivado da comunidade — tier list, recomendação de build, meta — fica fora, mesmo quando é bom.

---

## DEC-020 — A Flecha Perfurante é filtrada por classe, não por técnica

**Data do registro:** 2026-07-23 · **Status:** aceita, deliberadamente parcial · **Fonte:** `GOT_Build_-_Origem.md` bloco 13 e `GOT_Build_-_Alex.md` bloco 1

### O pedido original
No bloco 13 o autor foi específico: a Flecha Perfurante deveria aparecer **só para a Caçadora e só quando a técnica de Flecha Perfurante estivesse equipada**.

### O que foi implementado
Só a primeira metade. `formatAmmoForClass` (DEC-017) esconde a linha para quem não é a classe primária, mas não olha as técnicas do build: com a Caçadora, a Flecha Perfurante aparece sempre.

### Por que isso está certo por enquanto
Não é esquecimento. Na conversa do Alex o próprio autor abriu a porta — *"se for muito complicado pode só deixar mesmo a flecha aparecendo para o caçador, pois já ajuda para o jogador saber quanto que teria sem ter que equipar a técnica"*. A versão simplificada informa o teto de munição sem obrigar o jogador a montar a build inteira para ver o número.

### O custo de completar
`formatAmmoForClass` hoje é função pura de `(ammoStr, classId, item)` e vive na camada de exibição. Condicionar por técnica exige passar o build (ou as técnicas) até ela e mapear qual técnica libera qual munição — dado que **não existe hoje** em `data.js`. Ou seja: não é ajuste de uma linha, é dado novo mais acoplamento novo. Está no `IDEAS.md` como melhoria, não como defeito.

---

## DEC-021 — A Fase 3 gera a imagem com Canvas API pura, sem dependência externa

**Data do registro:** 2026-07-24 · **Status:** aceita, ainda não executada · **Fonte:** `meta/legacy/GOT_Build_-_TOhno.md`, bloco 3

### A decisão
Ao planejar a exportação em imagem, o autor foi direto: *"api do canvas sem dependências externas"*. Isso **descarta** `html2canvas`, `dom-to-image`, `satori` e qualquer biblioteca de captura de DOM. A imagem é desenhada à mão no `<canvas>`, com o mesmo dado que o `generateBuildText` já usa.

### Por que isso importa mais do que parece
Capturar o DOM seria muito mais rápido de escrever — e produziria uma foto da tela, não um artefato próprio. O que o autor pediu é outra coisa: um **layout em colunas com caixas e formatação**, dimensionado para caber num post, não um recorte da interface. Um `html2canvas` entregaria a coisa errada com menos esforço, e é exatamente por isso que a restrição está registrada.

Efeito colateral bem-vindo: o `package.json` continua com duas dependências de runtime (React e ReactDOM) e nenhuma para a Fase 3.

### Consequência
`generateBuildImage` precisa carregar os ícones como `Image()` e esperá-los antes de desenhar — trabalho assíncrono que a versão em texto não tem. O esqueleto já escrito para isso está no `meta/legacy/GUIA_CORRECOES_FASE3.md` (~470 linhas); ver a nota operacional no fim do `ROADMAP.md`.

---

## DEC-022 — Os três modos de exportação e a regra do que cada um mostra

**Data do registro:** 2026-07-24 · **Status:** aceita, em vigor no texto e válida para a imagem · **Fonte:** `GOT_Build_-_TOhno.md`, blocos 1, 5 e 16

### Os três modos
São cumulativos, do mais enxuto ao mais completo — e **os três botões de imagem espelham exatamente os três de texto**, mesmo conteúdo, mesma regra:

| Modo | O que sai |
|---|---|
| **Build** | nomes apenas: habilidade, vantagens, equipamentos, propriedades com valor, perks. Sem descrição. |
| **Detalhado** | tudo do Build **mais** a descrição de cada item, e a recarga já calculada com as propriedades da build. |
| **Estatístico** | tudo do Detalhado **mais** o bloco de estatísticas ao final. |

### A regra que quase se perde num refactor
No bloco de estatísticas, **só aparecem as estatísticas modificadas pela build** — *exceto HP e Determinação, que aparecem sempre*, mesmo em seus valores base. O autor pediu isso explicitamente e repetiu depois: *"sobre aqueles estatísticos que só aparecem quando influenciados, HP e Determinação sempre deverão aparecer ok?!"*

Hoje isso vive como uma condição e um comentário dentro de `generateBuildText`. É uma regra de produto, não um detalhe de implementação: **vale igual para a imagem da Fase 3.**

### Código de compartilhamento
O Base64 vai na **última linha** do texto e é **opcional**, ligado por um interruptor no `SettingsModal`. A razão de ser opcional é de uso, não técnica: o código é longo e nem toda conversa comporta.

---

## DEC-023 — Os modos de 3 e 2 colunas têm estilos independentes, de propósito

**Data do registro:** 2026-07-24 · **Status:** aceita, em vigor · **Fonte:** `GOT_Build_-_TOhno.md`, blocos 11, 13 e 16

### Contexto
As duas disposições **não são a mesma tela em larguras diferentes**. O autor especificou comportamentos opostos para os mesmos elementos:

| | 3 colunas | 2 colunas |
|---|---|---|
| Habilidades de classe | uma embaixo da outra | **lado a lado**, sem quebra de linha no nome |
| Vantagens de classe | uma embaixo da outra, caixas de **largura uniforme** | **lado a lado**, em grade |

### Por que isto é uma decisão e não um detalhe
Levou três rodadas para ficar de pé, e todas as três falharam da mesma maneira: **arrumar um modo quebrava o outro**. Foi o próprio autor quem nomeou a causa — o estilo estava sendo aplicado sem distinguir o modo, quando os dois precisavam de tratamento separado. Daí o `layoutMode` chegar até o `TechRow`.

**Regra que fica:** mexeu no layout de um modo, confira o outro na mesma sessão. É o defeito de repetição mais provável deste arquivo, e a razão de a spec0006 ter um item de conferência só para isso.

---

## DEC-024 — Três recursos simplificados de propósito: não são regressão

**Data:** 2026-07-25 · **Status:** aceita · **Fonte:** respostas do autor às perguntas abertas desde a spec0010

A extração retroativa encontrou dois recursos que existiram e sumiram, e uma pergunta antiga sem desfecho. Os três foram levados ao autor em vez de reimplementados por suposição. As respostas:

### 1. Botões de 🎲 granulares (`Tudo` / `Classe` / `Gear`) — removidos por darem problema
Existiram na v1.1. **Foram tirados porque davam problema**, sobrando o 🎲 global. O autor registra que a versão simplificada **agradou os usuários**. Não é regressão: é simplificação que funcionou. A ideia de reintroduzir opções mais específicas — aleatório por equipamento, por propriedade, por valor — continua no `IDEAS.md` como possibilidade, **não** como conserto pendente.

### 2. Seletor "Só alteradas" no painel de estatísticas — removido, e sem utilidade na tela
Mesma origem: dava problema. A avaliação do autor é que o recurso era inútil, e ela se sustenta. **A utilidade de um filtro é proporcional à escassez de espaço**, e na tela não há escassez: a tabela rola de graça, e o destaque visual (`s.value !== s.base`) já responde "o que a minha build muda" sem esconder nada.

Mas o **conceito** não morreu — mudou de lugar. Na imagem da Fase 3 o espaço é fixo e caro, e ali a regra é obrigatória: só as estatísticas modificadas entram, com HP e Determinação sempre presentes (DEC-022). O filtro vive onde o espaço é escasso; some onde é abundante.

### 3. Modo Estatístico — **decisão adiada de propósito**, e há uma data para ela
O autor cogitou removê-lo nos prompts antigos e hoje também o percebe como pouco útil. Não foi removido nem confirmado, e o adiamento é deliberado: **a informação que decide chega na Fase 3.**

O raciocínio, para quem retomar: como **texto**, o modo é fraco — uma tabela colada em texto puro num Discord ou Reddit vira ruído, e é justamente esse formato que o autor experimentou. Como **imagem**, é o oposto: grade é exatamente o que imagem faz bem, e a tabela de estatísticas calculada é o diferencial declarado do projeto (`HISTORY.md`, seção 8 — a coisa que nenhum outro planejador faz). O mesmo conteúdo pode ser inútil num meio e ser o principal no outro.

Então: **nada é removido agora.** Quando a Fase 3 entregar a versão em imagem, o autor compara as duas lado a lado e decide — inclusive a hipótese de manter só o botão de imagem do modo Estatístico. Custo de manter até lá: zero, porque o código já existe e funciona desde a FIX-005.

### O que os três têm em comum
Nenhum foi encontrado como defeito; todos vieram da pergunta *"o que a ferramenta já teve e não tem mais?"*. **Recurso ausente não é recurso perdido.** A extração registrou os três como "possível regressão" e fez certo em não os reimplementar — a resposta do autor mudou a classificação de dois deles em uma frase, e uma reimplementação teria trazido de volta os problemas que os tiraram.

---

## DEC-025 — Guia legado não vive no repositório: é estudado, absorvido e removido

**Data:** 2026-07-25 · **Status:** aceita · **Fonte:** diretriz do autor + comparação dos dois guias

### A diretriz
Guias de aplicação antigos **não são estrutura do projeto**. Usá-los como estão é ruim de duas maneiras — um estava superado (regressão) e o outro tem defeitos (ver DEC-026). O destino correto de um guia é: estudar, levar o conteúdo para `meta/`, `meta/specs/` e para os scripts, e então **remover**. O Git preserva o corpo; os `meta/` preservam o sentido.

Isso completa a DEC-012, que resolveu *não perder* o material legado. Esta resolve o que fazer **depois** de ele ter servido: material legado é insumo, não acervo.

### A comparação — qual guia era o mais recente
| | `GUIA_COMPLETO_v4.md` | `GUIA_CORRECOES_FASE3.md` |
|---|---|---|
| Origem | rodada **v8** do `TOhno` | rodada **v10**, a última |
| Correções | 6 (barra de HP, largura da coluna, TechRow, habilidades sem quebra, espaçamento) | 4 — **as que consertaram os defeitos das 6 anteriores** |
| Fase 2 | código completo | só a correção dos `undefined` |
| Fase 3 | **esqueleto** | **código completo, ~470 linhas** |

O segundo é o mais novo em todos os eixos: suas quatro correções são o *follow-up* das seis do primeiro, e onde um tem esqueleto o outro tem implementação. **Codar a Fase 3 a partir do `GUIA_COMPLETO_v4.md` teria sido regressão dupla** — esqueleto no lugar de código, e correções antigas no lugar das novas.

### O que sobreviveu do guia superado
Uma coisa só, e não é código: a localização das larguras de coluna (`gridTemplateColumns`, no bloco `ÁREA DE 3/2 COLUNAS`), conferida em 2026-07-25 como ainda exata. Foi para o `CONTEXT.md`, junto da armadilha 13, que é sobre os mesmos dois modos.

Todo o resto já estava aplicado no código e registrado nos `meta/` — as seis correções, a Fase 2 inteira, e o esqueleto da Fase 3 que o guia mais novo substitui.

### `GOT_Build.md` — verificação que dispensou uma sessão
A spec0012 recomendou re-extraí-lo com o método da DEC-011, sob a suspeita de que a leitura de 2026-07-22 tivesse sido rasa. **A suspeita foi verificada e é falsa.** Os sete prompts do arquivo foram comparados um a um com os do `GOT_Build_-_TOhno.md`: são **os mesmos prompts, sem as respostas** — o arquivo é a exportação "só prompts" da mesma conversa, e ainda por cima sem o bloco de relatório de erro. É **subconjunto estrito** de um arquivo já extraído por inteiro pela spec0011, com mais contexto.

Não havia o que extrair. A verificação custou minutos; a re-extração teria custado uma sessão.

**Regra que fica:** antes de agendar uma releitura de material legado, **compare-o com o que já foi lido.** Arquivos exportados da mesma origem se repetem, e a suspeita de leitura rasa é barata de testar e cara de assumir.

---

## DEC-026 — O código da Fase 3 no guia é ponto de partida, não entrega

**Data:** 2026-07-25 · **Status:** aceita, orienta a execução da Fase 3

### Por que esta decisão existe
O `GUIA_CORRECOES_FASE3.md` traz ~470 linhas prontas de `generateBuildImage`. A tentação é aplicá-las e declarar a fase feita. **A auditoria linha a linha encontrou sete defeitos** — e os dois piores não quebram nada visivelmente: produzem uma imagem plausível e errada, que é a pior falha possível num recurso cujo propósito é ser compartilhado publicamente.

A decisão: o guia entra como **rascunho de referência**. A arquitetura de desenho é refeita, e cada defeito abaixo é corrigido antes de a fase ser considerada pronta.

### Os sete defeitos

**D1 — O amuleto é lido do `GEAR` cru.** No laço de desenho dos equipamentos, o código faz `getItem(slotState.itemId)` para os cinco slots, inclusive `charm`, e depois procura as propriedades escolhidas em `item.props`. Para um amuleto Magistral com `classBinding`, as props e perks exclusivos de classe **não existem** no item cru: a busca falha, o `if (!propDef) continue` engole, e a imagem sai **sem as propriedades de classe** — as mesmas que o usuário está vendo na tela naquele instante. É a armadilha 7 acontecendo dentro do recurso novo. **Correção:** usar `getEffectiveCharm(itemId, linkedClass)` para o slot `charm`, como o `App.jsx` já faz.

**D2 — Altura fixa, e calibrada ao contrário.** `IMG_H = mode === 'stats' ? 820 : 560`. Não há medição do conteúdo. O modo **Detalhado** desenha a descrição de cada propriedade e de cada vantagem com quebra de linha — até vinte parágrafos na coluna direita — e recebe a altura **menor** das duas. Ou seja: o modo mais alto do sistema é o que tem menos espaço, e o corte não é caso extremo, é o caso comum. O próprio guia admite ("o canvas pode ficar maior que o conteúdo... no futuro pode-se calcular dinamicamente") e o `ROADMAP.md` já tinha "altura dinâmica" empurrado para a F4. **Correção:** duas passadas — medir e depois desenhar (ver arquitetura abaixo). Isso deixa de ser item de F4 e vira requisito de F3.

**D3 — Ícone de classe fica invisível.** Na tela, os SVG de classe são branqueados por CSS (`iconFilter: 'brightness(0) invert(1)'`). **`ctx.drawImage` não herda filtro CSS.** O ícone entra no canvas com a cor original — escura — sobre o fundo `#07080f`. **Correção:** aplicar `ctx.filter` antes de desenhar o SVG de classe e zerar (`ctx.filter = 'none'`) logo depois. E aqui vale a armadilha 3 sem nenhuma alteração: **filtro em PNG de técnica vira retângulo sólido** — a mesma regra que existe na UI passa a existir dentro do canvas.

**D4 — Sem `devicePixelRatio`.** O canvas é 900 px e o texto varia de 9 a 18 px. Numa tela retina, ou em qualquer visualizador que amplie, o resultado sai borrado — num recurso cujo único propósito é ser postado e ampliado. **Correção:** desenhar em escala 2x (`canvas.width = IMG_W * 2`, `ctx.scale(2, 2)`) e manter todas as coordenadas do layout em unidades lógicas.

**D5 — `toDataURL` em vez de `toBlob`.** Um PNG de 1800×1600 vira uma string base64 de vários megabytes, atribuída ao `href` de uma âncora. **Correção:** `canvas.toBlob()` + `URL.createObjectURL()`, com `URL.revokeObjectURL()` depois do clique.

**D6 — Rodapé em posição absoluta.** A assinatura é desenhada em `IMG_H - 10`. Com altura fixa e conteúdo transbordando, ela cai **por cima** do conteúdo. Resolve-se junto com o D2: o rodapé passa a ser o último elemento medido.

**D7 — O diagnóstico de CORS do guia está errado, e importa.** A nota técnica afirma que, sem headers CORS, "o `drawImage` lança `SecurityError`" e "os ícones ficam `null`, silencioso pelo `onError`". Nenhuma das duas coisas é verdade: `drawImage` não lança por contaminação — quem lança é a **exportação** (`toDataURL` / `toBlob`) —, e `onerror` não captura isso, porque a imagem carregou normalmente. O efeito real de um problema de origem seria **a exportação inteira falhar no último passo**, não uma degradação suave. Como os ícones são servidos pelo próprio Vite (mesma origem), o `crossOrigin = 'anonymous'` é desnecessário. **Correção:** remover o `crossOrigin` e envolver a exportação em `try/catch` com mensagem clara, em vez de confiar numa degradação que não existe.

### Arquitetura decidida — medir, depois desenhar
As duas passadas usam **o mesmo código de layout**, com um interruptor: na primeira, as funções de escrita apenas acumulam altura; na segunda, escrevem de fato. É o que torna o D2 e o D6 solucionáveis sem manter duas cópias do layout, que divergiriam.

A altura final é `max(altura da coluna esquerda, altura da coluna direita) + header + rodapé`, e o canvas é criado só depois disso.

### O que continua valendo do guia — não jogue fora
A auditoria confirmou como corretos: a assinatura `getStatGroups(stats, classId, lang)`; as chaves `stats.maxHP` e `stats.maxResolve`; a escolha de `formatStatValue(valor, unidade)` para as propriedades (`0.12 → "+12%"`); todas as chaves de paleta lidas de `T`, inclusive `T.cls`; o carregamento em paralelo dos ícones com `Promise.all`; a resolução de `null` no `onerror` para que um ícone ausente não derrube o desenho; e a lista de ícones por elemento, incluindo os das vantagens de classe, que era a preocupação registrada no `ROADMAP.md`.

O layout em duas colunas com faixa de estatísticas ao pé também fica: é o que o autor pediu desde o primeiro prompt.

### Desfecho — aplicada em 2026-07-25 pela spec0014
Os oito defeitos foram corrigidos e a arquitetura de duas passadas foi validada por simulação antes de virar código: as duas passadas devolvem altura idêntica nos três modos, e a passada de medição não pinta nada. O D2 se confirmou pior do que a auditoria supunha — o modo Detalhado de uma build cheia precisa de cerca de 1340 px contra os 560 fixos do guia.

O oitavo defeito não estava na lista original: apareceu ao comparar o código do guia com o `generateBuildText`, e revelou que **quem estava errado era o `generateBuildText`** (FIX-010).

---

## FIX-010 — Recarga das Armas Fantasma e resumo do Supremo sumiam do texto exportado

**Data:** 2026-07-25 · **Gravidade:** média (informação faltando no compartilhamento, sem erro)

### Sintoma
No texto gerado pelos três botões 📋, a recarga das Armas Fantasma **nunca aparecia**, e o bloco do Supremo mostrava só nome e custo — sem a contagem de golpes, sem o bônus de dano, e sem o Sopro ativo do Ronin. Na interface, as mesmas informações estavam corretas. Nenhum erro no console.

### Causa raiz
Três chaves inexistentes, lidas como `undefined` e engolidas por guardas `!= null`:

| Lido | Existe? | O que `computeStats` devolve |
|---|---|---|
| `stats.gw1Cooldown` / `gw2Cooldown` | não | `stats.gw1` / `stats.gw2` |
| `ult.hits` | não | `ult.strikes` (Samurai, Assassino) |
| `ult.dPT` / `ult.dEN` | não | nada — a descrição do Supremo não é campo de `computeUltimate` |

Por coincidência, `ult.targets` **existe**, então a Caçadora era a única classe que saía completa — o que ajudou o defeito a passar despercebido.

### Correção
As duas chaves de recarga passaram a apontar para `stats.gw1` / `stats.gw2`. O bloco do Supremo passou a usar `ultimateSummary(ult, L)`, que monta o resumo **por classe** — `strikes` para Samurai e Assassino, `targets` para Caçadora, variante ativa para Ronin, mais o bônus de dano e o custo. A mesma função alimenta a imagem da Fase 3, então texto e imagem não podem divergir.

### Como foi encontrado
Não por relato: apareceu ao auditar o código da Fase 3 do guia e **comparar as duas implementações**. O guia lia `stats.gw1` e o `generateBuildText` lia `stats.gw1Cooldown`; um dos dois tinha de estar errado, e `logic.js` decidiu a favor do guia.

**Regra que fica:** quando duas implementações do mesmo dado divergem, a divergência é o achado. Não escolha a mais recente nem a que parece mais cuidada — vá à fonte. É a terceira vez que uma chave errada some com informação em silêncio neste projeto (FIX-005, e agora as três desta entrada); **a exportação não tem quem reclame**, porque nada quebra: o texto sai bonito e incompleto.

---

## FIX-011 — Barra de rolagem fantasma no modal de configurações

**Data:** 2026-07-25 · **Gravidade:** baixa (incômodo visual), **causa alta** (afeta qualquer filho posicionado)

### Sintoma
Passar o cursor sobre uma opção do modal fazia surgir um retângulo cinza no pé da janela; o conteúdo se deslocava, e voltava ao tirar o cursor. Entrar e sair repetidamente deixava a janela "tremendo".

### Causa raiz
O retângulo era uma **barra de rolagem horizontal**, e a causa não estava no `Tooltip`.

`position: fixed` normalmente se posiciona pela janela do navegador e não entra no `overflow` de ancestral nenhum. **Mas um ancestral com `transform` vira o bloco-contenedor dos descendentes fixos.** O modal se centralizava com `transform: translate(-50%, -50%)`, então o tooltip — que é `fixed` — passou a contar como conteúdo do modal para efeito de rolagem. Com 360 px de largura e um tooltip de 260 px posicionado por coordenadas de janela, o transbordo horizontal era garantido, e a barra que o navegador cria para ele ocupa altura.

O mesmo mecanismo desalinhava o tooltip: `getBoundingClientRect` devolve coordenadas relativas à **janela**, e elas passaram a ser lidas como relativas ao **modal**.

### Correção
Centralização por flexbox, num envelope `position: fixed; inset: 0` com `pointerEvents: none`, e o modal como filho com `pointerEvents: auto`. Sem `transform`, o tooltip volta a se posicionar pela janela, não entra no overflow e aparece no lugar certo. `overflowX: hidden` ficou como rede.

### Por que vale registrar
Duas propriedades inofensivas — `transform` para centralizar e `position: fixed` para flutuar — produzem juntas um terceiro comportamento que nenhuma das duas anuncia. Virou a armadilha 16.

---

## FIX-012 — Ícones de equipamento invisíveis na imagem: filtro de tema não aplicado

**Data:** 2026-07-26 · **Gravidade:** média (imagem incompleta, sem erro)

> **Esta entrada foi diagnosticada errado na primeira tentativa.** A seção final registra o erro, porque ele ensina mais que o conserto.

### Sintoma
Na imagem gerada em tema claro, Katana e Longo Alcance apareciam com ícone; Amuleto e as duas Armas Fantasma, não. Na interface, todos apareciam. Nenhum erro no console.

### Causa raiz
Os ícones **estavam sendo desenhados** — na cor errada para o tema. É a armadilha 15 em ação: `ctx.drawImage` não herda filtro CSS, e `paintBuildImage` chamava `pen.icon(..., false)` para os cinco slots de equipamento, enquanto a interface aplica `filter: T.iconFilter` nos dois tamanhos do ícone de gear.

O que fazia o sintoma variar de slot para slot era a cor nativa de cada arquivo:

| Origem | Cor nativa | Sem filtro |
|---|---|---|
| `icons/gear/*.svg` (Katana, Longo Alcance, Amuleto) | sem `fill` → preto | somem no tema **escuro** |
| `icons/ghost_weapons/*.svg` (as duas Armas Fantasma) | `fill="#fff"` → branco | somem no tema **claro** |

O filtro do tema resolve os dois casos de uma vez porque começa por `brightness(0)`: zera qualquer cor de origem para preto, e no tema escuro inverte para branco. Preto ou branco na origem, o resultado é o mesmo.

### Correção
O filtro deixou de ser um parâmetro em cada chamada e passou a ser **derivado da extensão do arquivo**, marcada no `loadImg`. A separação é perfeita no projeto: `GEAR_ICON` e `CLASS_ICON` são 100% `.svg` e levam filtro; `TECH_ICON` e `CLASS_TECH_FALLBACK` são 100% `.png` e não podem levar (armadilha 3). Os cinco pontos de chamada perderam o argumento e passaram a acertar sozinhos.

Trocar os cinco `false` por `true` também resolveria hoje — e deixaria a decisão copiada em cinco lugares, esperando o próximo ícone acrescentado com o valor errado.

### O diagnóstico errado, e o que ele ensina
A primeira hipótese, escrita na `spec0015`, foi que os SVG não tinham dimensão intrínseca e por isso não pintavam. A spec exigia **diagnosticar antes de corrigir**, o executor rodou o teste, ele contradisse a hipótese, e a execução parou ali — sem aplicar nada.

O que induziu ao erro foi a leitura de um padrão: nas capturas em tema claro, dois ícones apareciam e três não. "Alguns sim, outros não" parece diferença **entre arquivos**, e daí a hipótese sobre o conteúdo dos arquivos. Era diferença **entre a cor de cada arquivo e o fundo** — a mesma coisa vista do outro lado.

Três coisas valem ficar:
1. **A resposta já estava no repositório.** A armadilha 15 descreve exatamente este defeito e foi escrita neste mesmo projeto três specs antes. Diagnosticar sem reler as armadilhas foi o erro de método.
2. **Um sintoma que varia entre itens não implica causa nos itens.** Pode ser uma causa única interagindo com uma propriedade que varia — aqui, um filtro ausente encontrando cores de origem diferentes.
3. **O portão de diagnóstico pagou por si.** Sem ele, a correção errada teria entrado, não teria consertado nada, e ainda teria acrescentado código inútil ao `loadImg`. Vale repetir o padrão sempre que a causa for hipótese e não observação: descreva o teste, descreva como interpretar cada resultado, e mande parar quando contradisser.

---

## FIX-013 — Rótulos sobrescritos pelo ícone e pelo nome na imagem gerada

**Data:** 2026-07-25 · **Gravidade:** baixa (legibilidade)

### Sintoma
Na imagem, *Vantagem I/II/III* e os rótulos de slot apareciam por baixo do ícone e do nome da linha seguinte.

### Causa raiz
Aritmética de linha de base. `fillText` posiciona pela **base**, e o ícone era desenhado a partir de `y − 18 + 4`, ou seja 14 px **acima** da base da própria linha. Com avanço de 12 px depois do rótulo, o topo do ícone caía 2 px acima da base do rótulo e o topo das maiúsculas do nome caía exatamente sobre ela.

### Correção
Avanço de 20 px depois dos rótulos e de 18 px depois dos divisores de seção — o mínimo para o ícone limpar a linha anterior é 18.

### Nota
O defeito não apareceu na simulação de altura da `spec0014` porque **as duas passadas concordavam**: a sobreposição é colisão dentro de uma linha, não erro de altura acumulada. Medir bem a altura não diz nada sobre colisão dentro da faixa medida.

---

## DEC-027 — A imagem da build é organizada em bandas, não em colunas

**Data:** 2026-07-26 · **Status:** aceita, em vigor · **Substitui** a disposição descrita no pedido original

### O problema
A primeira versão da Fase 3 dispôs o conteúdo em duas colunas de altura livre: habilidade e vantagens à esquerda, equipamentos à direita. **As duas nunca podiam bater.** No modo Build a esquerda tem cerca de sete linhas e a direita trinta — cinco equipamentos com quatro itens cada. A metade inferior esquerda fica vazia por construção, e nenhum ajuste de proporção resolve, porque a razão entre os dois lados muda a cada build.

Isso contrariava o pedido em dois pontos escritos: *"podendo preencher bem o espaço da imagem"* e *"com caixas e formatação, e não só o texto bruto um atrás do outro"*.

### A decisão
O desenho passa a ser uma pilha de **bandas de largura total** — cabeçalho, habilidade e vantagens, equipamentos, estatísticas —, e cada banda distribui seus cartões numa grade própria: quatro colunas para as vantagens, duas para os equipamentos. **Nenhuma seção depende de ter a mesma altura que outra**, que era a origem do problema.

Dentro de uma linha da grade, todos os cartões recebem a altura do mais alto. É o que dá o alinhamento e o que evita o degrau entre vizinhos.

### A alternativa rejeitada — três colunas
O pedido original descrevia três colunas: *"Habilidades e vantagens em uma coluna, equipamentos em outra, e estatísticas em outra"*. Aquilo vinha da tela, onde cada coluna rola por conta própria e altura desigual não custa nada. **Numa imagem de altura fixa, custa** — e três colunas desiguais seria pior que duas, não melhor.

O autor foi consultado e escolheu as bandas, com uma observação que vale registrar: *"não precisa seguir meu pedido original, pois foi justamente o que pedi, que você pesquisasse e refinasse, não que aceitasse cegamente o que cogitei"*.

### O cartão como dados
Cada cartão é descrito como uma lista de blocos — `label`, `head`, `xp`, `bullet`, `desc` — e renderizado por `paintCardBlocks`, num caminho só. Duas consequências: os três modos viram uma questão de **quais blocos entram**, e a altura reservada é sempre a altura usada, porque medir e desenhar percorrem o mesmo código.

### O cabeçalho ganhou os sinais vitais
HP, Determinação e o contador de Magistrais são a primeira coisa que a interface mostra e **não apareciam na imagem em modo nenhum** — no Estatístico, HP e Determinação estavam no meio da lista. Agora estão na faixa do cabeçalho, nos três modos.

Eles **continuam também na tabela** do modo Estatístico, de propósito: a DEC-022 exige que apareçam ali mesmo no valor base, e a duplicação custa duas linhas. Se algum dia incomodar, tirar da tabela é uma linha — mas aí a DEC-022 precisa ser reescrita junto.

### Validação
Simulado antes de virar código, com o método da `spec0014`: as duas passadas devolvem altura idêntica nos três modos e em três preenchimentos (cheio, vazio, parcial), e a passada de medição não pinta nada. A altura passou a acompanhar o conteúdo em vez do modo — build vazia sai com 244 px onde a versão anterior reservava o mesmo de uma build cheia.
