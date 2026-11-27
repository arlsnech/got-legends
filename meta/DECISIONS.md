# DECISIONS.md — Registro de Decisões

> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> Duas naturezas: **DEC** (decisões de arquitetura/design) e **FIX** (bugs graves resolvidos, para não repetir).
> Não reescreva entradas antigas; se uma decisão for substituída, marque «SUPERADA por DEC-N» e adicione a nova.
> Arquiva-se por EVENTO, não por idade: decisão substituída ou evento fechado vai para `DECISIONS-archive.md`; FIX fica enquanto a lição valer. ~700 linhas é só alarme (CEREBRO, «Regras de higiene»).
> **Número de DEC ou FIX que não está aqui está no `DECISIONS-archive.md`**, com o mesmo número e o texto intacto — a numeração é uma só para os dois arquivos. Divisão de 2026-11-27: ver o cabeçalho do arquivo morto.

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

## DEC-008 — Template-update do KCM vale como sugestão quando colide com prática em vigor

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O `CEREBRO.md` e as Instruções que o kit gera são texto genérico de nicho, escritos sem conhecer esta obra. Duas linhas do template batiam de frente com o projeto: "nomes de arquivos, funções e variáveis em inglês" (o projeto usa IDs `snake_case` em PT-BR, espelhando `data.js`, e renomeá-los quebraria o mapeamento de ícones em silêncio) e "mensagens de commit no imperativo curto em PT-BR" (que o próprio CEREBRO contradiz na seção de commit, onde pede Conventional Commits).

### Decisão
Convenção genérica vinda de um template-update é **sugestão**, não ordem. O assistente não refatora o projeto para caber no template; adapta o CEREBRO e as Instruções para descreverem o que o projeto de fato faz, aponta a colisão, e registra o desvio aqui e em «Feedback para o Kit» no IDEAS. A regra ficou escrita no próprio `meta/CEREBRO.md`, na seção «Ao receber um template-update do KCM».

### Consequências
Atualizações futuras do kit são seguras de aplicar: o pior caso vira uma linha de feedback, não uma renomeação em massa. O custo é que o CEREBRO deste projeto diverge do template canônico — a divergência é intencional e está documentada.

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

---

## DEC-028 — O cabeçalho da imagem: sinais vitais em cor uniforme e o Supremo com informação

**Data:** 2026-07-26 · **Status:** aceita, em vigor

### Cor uniforme na barra e nos círculos — a diferença deliberada
A topbar da interface distingue base de bônus por cor: os três primeiros círculos de Determinação em dourado e os extras em verde; a barra de HP vermelha até 100 e dourada no excedente. **A imagem não repete isso.** Barra de uma cor, círculos todos iguais.

O motivo não é economia de código, é de leitura. Na tela, o jogador está montando: ele acabou de equipar algo e a cor diferente responde "foi isto que mudou". No print não há esse antes-e-depois — quem recebe a imagem vê um estado pronto, e uma cor diferente no meio da barra vira uma pergunta sem resposta. O número ao lado já diz o total.

**Regra que fica:** distinção visual que só faz sentido durante a edição não deve ser transportada para a exportação. As duas superfícies têm leitores diferentes.

### O Supremo saiu da borda e ganhou o que dizer
Antes o Supremo era um ícone encostado na borda direita com o nome embaixo, e a faixa de 92 px existia praticamente para acomodar isso. Agora o bloco começa perto do meio e ocupa a metade direita com três informações:

1. **O nome**, na cor da classe.
2. **A linha de números** — custo, golpes ou alvos com o bônus entre parênteses, multiplicador e percentual de dano.
3. **A modificação textual**, que é a novidade real.

A terceira escolhe a fonte por especificidade: a nota de modo (a Fúria a 300%), depois a variante ativa do Sopro do Ronin, e por último **a descrição base do Supremo — que existe em `data.js` e não aparecia em lugar nenhum**, nem na imagem nem no texto exportado. O `computeUltimate` nunca a repassou, e ninguém sentiu falta porque não havia onde ela coubesse.

Da descrição base é retirada a frase final de custo (`Custa 3 Determinação`), que já está na linha de números logo acima. A remoção é uma expressão ancorada no fim da string e cobre os dois idiomas — estreita de propósito, porque o dado é do projeto e não muda de forma.

### O comando de ativação fica pronto, mas desligado
Há um renderizador de teclas — caixinha desenhada com o glifo dentro — e ele lê `cls.ult.cmd`. **O campo não existe em `data.js`**, porque o comando do Supremo não está registrado em lugar nenhum do projeto e não seria honesto inventá-lo. Enquanto não existir, nada é desenhado.

Não há dependência nova: os glifos do PlayStation (`△ ◯ ✕ ☐ R1 L2`) já são usados como **texto** nas descrições de `data.js`. A caixa é desenhada, o glifo é fonte.

Para ligar, basta acrescentar `cmd` ao `ult` da classe em `data.js` — por exemplo `cmd: "L1+R1"`. O valor precisa ser conferido no jogo, como todo dado deste projeto.

### Tipografia num lugar só
Todos os tamanhos de fonte da imagem passaram para `IMG_FS`. O pedido de "aumentar um pouco as letras" seria, antes, uma caçada por dezenove literais espalhados pelo desenho — e cada um esquecido produziria um desalinhamento sutil. `IMG_SCALE` subiu de 2 para 3 e `IMG_W` de 900 para 1000 pelo mesmo motivo: mais pixels por unidade lógica, e mais largura para o texto maior respirar.

---

## FIX-014 — A estrela significava Magistral e Determinação ao mesmo tempo

**Data:** 2026-07-26 · **Gravidade:** média (ambiguidade de leitura, em toda a ferramenta)

### Sintoma
O custo do Supremo aparecia como `3★`. Como ★ marca item Magistral em todo o resto — no selo do item, no `<select>`, no texto exportado, no cartão da imagem e no contador `★☆☆` —, `Custo 3★` sugeria alguma relação com Magistrais que não existe. O autor viu no print, com as duas leituras a poucos centímetros uma da outra.

### Causa raiz
Não era um símbolo mal escolhido num lugar: **a estrela era a unidade da estatística `maxResolve`**. `getStatGroups` declarava `unit: '★'`, e `formatStatValue` repetia a estrela para essa unidade. Daí a tabela de estatísticas mostrar *Determinação Máxima* `★★★★` logo abaixo de *Slots Magistrais*, e daí os três lugares que exibem o custo do Supremo terem herdado a estrela como se fosse o símbolo da Determinação.

A Determinação, na prática, **nunca teve símbolo próprio** — a topbar da interface sempre a desenhou como círculos, mas isso era desenho, não dado. O caractere só aparecia onde havia texto.

### Correção
A unidade virou `●`, que é o que a topbar já desenhava e o que o jogo mostra. Cinco pontos: a declaração em `logic.js`, os dois formatadores (`logic.js` e a cópia dentro do `StatsPanel`), e os três lugares que escrevem o custo do Supremo — painel da UI, texto exportado e cabeçalho da imagem. **A estrela ficou exclusiva de Magistral.**

### Por que passou tanto tempo
Porque as duas leituras raramente apareciam juntas. Foi o cabeçalho novo da imagem (DEC-028) que pôs `Custo 3★` a três centímetros de `★☆☆` e tornou a colisão visível de uma vez.

**Regra que fica:** símbolo é vocabulário, e vocabulário tem que ser único por significado. Antes de usar um caractere como unidade, procure onde mais ele já aparece na interface — a colisão não dói enquanto os dois usos vivem em telas diferentes, e dói de uma vez quando alguém os aproxima.

### De passagem
O contador de Magistrais no cabeçalho da imagem ganhou o rótulo **MAGISTRAIS** e um afastamento **medido** do número de HP — antes era um espaço fixo, que não sabia se o número tinha dois ou três dígitos. Com a Determinação em círculos, a estrela passou a ser a única coisa contada em estrelas, e nomear o contador fecha a leitura.

**Emenda de 2026-07-27:** o custo passou de `3 ●` para `●●●`. A primeira forma trocava o símbolo e mantinha o número; a segunda usa a mesma linguagem da topbar, onde a Determinação **disponível** já aparece como pips. `●●●` embaixo de `●●●●●` diz "gasta três dos cinco" sem ler número nenhum — e era isso que a estrela nunca deixou fazer.

---

## DEC-029 — Nível de detalhe e formato são escolhas separadas

**Data:** 2026-07-27 · **Status:** aceita, em vigor

### O problema
O painel de exportação tinha **seis botões em dois triplos** — Texto {Build, Detalhado, Estatístico} e Print {Build, Detalhado, Estatístico}. Mas Build, Detalhado e Estatístico **significam exatamente a mesma coisa nos dois formatos**; a DEC-022 define os três níveis sem mencionar meio. A interface obrigava a escolher o mesmo conceito duas vezes, em dois lugares, como se fossem coisas diferentes.

Não era excesso de botões: eram duas dimensões independentes — nível × formato — achatadas numa lista só.

### A decisão
Desdobrar as duas. O **nível de detalhe** vira um controle segmentado de três opções, escolhido uma vez; o **formato** vira duas ações, `🖼️ Imagem` e `📋 Texto`. Cinco controles no lugar de seis, e as seis combinações continuam todas alcançáveis.

### O que a pesquisa determinou do desenho
O autor pediu que as referências de UX fossem consultadas antes de desenhar. Quatro pontos vieram de lá e não da intuição:

1. **Um *switch* está fora.** Switch é para dois estados opostos. Três níveis não cabem — é o engano mais comum quando se pensa "switch" para um seletor de três.
2. **Controle segmentado é o padrão** para 2–5 opções mutuamente exclusivas, igualmente importantes, todas visíveis e em espaço apertado. Botões de rádio seriam a alternativa, mas pressupõem envio explícito e pedem mais altura do que a topbar tem.
3. **A ressalva que quase invalidou a escolha:** a literatura é consistente em dizer que a seleção de um segmentado precisa ter **efeito imediato e visível**, e desaconselha usá-lo para configurar uma ação futura — que é justamente o nosso caso.
4. **Segmentos de largura igual**, definida pelo rótulo mais longo, sem quebra e sem reticência. Rótulo à esquerda em vez de acima, exceção que a própria regra abre quando falta espaço vertical.

### A linha de descrição resolve duas coisas de uma vez
A ressalva do ponto 3 foi resolvida dando ao seletor um efeito imediato: uma **linha de descrição abaixo do controle, que muda no instante da escolha**. E ela também reage ao cursor — mostra o nível apontado e volta para o selecionado quando o cursor sai.

Isso substitui os balões de ajuda que existiam em cada um dos seis botões: **um mecanismo servindo às duas necessidades**, sem sobreposição e sem estado invisível. Os balões continuam onde ainda fazem sentido — nos dois botões de Gerar, que explicam o formato, não o conteúdo.

As três descrições falam **só do conteúdo**, nunca do meio. Mencionar imagem ou texto nelas recriaria em palavras a confusão que o desenho existe para desfazer.

A linha tem **altura fixa**. Sem isso, um texto de duas linhas empurraria a topbar a cada passada do cursor — o mesmo defeito do FIX-011 por outro caminho.

### O que ficou de fora, e por quê
Um botão de **Código** foi proposto e **recusado pelo autor**. O código Base64, o link direto para a ferramenta, o link curto e o QR Code são um terceiro formato com decisões próprias — onde vivem, se substituem o Base64, se dependem de encurtador. Tratar isso agora seria decidir de afogadilho a parte mais difícil. O interruptor do Base64 continua nas Configurações, e o assunto fica para uma fase futura.

### O comando de ativação
`cmd: "L1+R1"` entrou nos quatro Supremos de `data.js`, conferido no jogo pelo autor. As quatro classes usam o mesmo comando e ainda assim ele é escrito quatro vezes — DEC-006 em vigor: `data.js` é explícito. Uma constante compartilhada economizaria três linhas e criaria a dúvida "e se uma classe mudar?", que é o tipo de pergunta que dado explícito não tem.

---

## DEC-030 — `spec` passa a se chamar `WO`; `specs/` fica para specs de feature
**Data:** 2026-07-27 · **Status:** aceita

### Contexto
O template-update do KCM v1.87.0 trouxe uma separação que este projeto não fazia. O kit agora distingue **WO** (`meta/workorders/`, o texto exato de uma edição e a âncora onde ela entra — diz *como aplicar*) de **spec de feature** (`meta/specs/`, uma por feature — diz *o quê construir e quando está pronto*, com critérios de aceite verificáveis).

Pelo conteúdo, as vinte "specs" 0001–0020 deste projeto são **WOs**: nenhuma delas enuncia critério de aceite; todas enunciam âncora e texto. O nome `specs/` estava ocupado pelo artefato errado, e o artefato que o kit chama de spec **não existia aqui em nenhuma forma** — o que se aproximava dele eram os `GUIA_*.md`, justamente o formato que deixou a Fase 3 parada de junho a julho.

Foi a segunda vez que o kit passou por este projeto. Na primeira (DEC-007, DEC-008) a régua foi «convenção genérica que colide com prática em vigor é sugestão, não ordem». Esta decisão **não** é uma exceção a ela: aqui não há colisão de convenção, há um conceito novo que o projeto não tinha, e o nome que ele quer estava ocupado.

### Decisão
- `meta/specs/` → `meta/workorders/`; a skill `/apply-spec` → `/apply-wo`; o método passa a se chamar «doc por WO».
- **Os vinte arquivos existentes não foram renomeados**, nem as menções a `spec0001`…`spec0020` nos documentos. São nomes próprios de artefatos passados: reescrevê-los faria o histórico mentir sobre o que se chamava o quê em cada data.
- **A numeração é contínua.** A primeira WO com o nome novo é a `wo0021`. A sequência é a do trabalho, não a do rótulo.
- `meta/specs/` volta a existir quando a primeira spec de feature for escrita, no molde de `meta/SPEC.md`. Não nasce vazia.
- Junto vieram, do mesmo template-update, três disciplinas novas: «Análise antes do compromisso» (`meta/analises/`), o «Bloco de fecho de turno» e o endurecimento da revisão de mount. Ver CEREBRO.

### Alternativas consideradas
- **Manter tudo como estava e registrar o desvio.** Custo zero, e a DEC-008 já licenciava. Recusada: o vocabulário do projeto e o do kit divergiriam para sempre, e cada template-update futuro reabriria a questão — que é exatamente o atrito que esta leva veio reduzir.
- **Renomear também os vinte arquivos e todas as menções históricas.** Recusada: ou o histórico passa a mentir, ou fica pela metade e inconsistente. O nome de um artefato é a data em que ele nasceu.
- **Manter o nome `spec` para o artefato de aplicação e batizar a spec de feature de outra coisa** (`meta/features/`). Recusada: preserva o mal-entendido que causou o problema, só que com mais um nome.

### Consequências
- O que era `spec` no vocabulário deste projeto agora é `WO` daqui para a frente, e continua sendo `spec` no que já foi escrito. A `wo0021` deixou isso registrado no `GLOSSARY.md` para que a leitura do histórico não confunda.
- Abre espaço para o artefato que faltava. A F4 (Polimento e Mobile) e a decisão pendente sobre compartilhamento por link são candidatas naturais à primeira **análise** e à primeira **spec de feature**.
- `.flatdropignore`: o corpo das WOs continua fora do mount (peso); as specs de feature **sobem**, porque são curtas e olham para a frente. E a linha passou de `meta/specs/` para `meta/workorders/*` — com `/*` a reinclusão por `!` volta a funcionar, o que a forma antiga impedia.

---

## DEC-032 — `getAvailableProps` e `getAvailablePerks` passam a receber o item, não o `id`
**Data:** 2026-07-29 · **Status:** aceita · **Aplicada pela** `wo0025`

### Contexto
As duas funções de `logic.js` estavam sem consumidor desde a limpeza de 2026-07-25 e eram armadilha ativa (armadilha 14 do CONTEXT): resolviam o item por `id` via `getItem(itemId)` e, para amuleto magistral com `classBinding`, devolviam o item cru do `GEAR` — **sem** os props e perks de classe, e **sem erro**. Enquanto isso, o `App.jsx` reimplementava a mesma regra inline em dois lugares (`PropInput` e `PerkRow`), justamente para poder passar o item efetivo.

### O que foi medido
Antes de recomendar, foram lidos os dois pontos de chamada. **`PropInput` e `PerkRow` já recebem o item efetivo por prop** — o pai já resolveu o `classBinding`. A troca de assinatura, portanto, não exigia nada dos chamadores que eles já não tivessem: era um encaixe, não um refactor. Foi essa medição que decidiu entre as duas saídas.

### Decisão
Assinatura passa a `getAvailableProps(item, slot, otherPropId)` e `getAvailablePerks(item, otherPerkId)`; o `getItem()` interno sai. Os dois filtros inline do `App.jsx` viram chamadas. **Não se reintroduz sobrecarga que aceite `id`.**

### Alternativas consideradas
- **Remover as duas funções**, já que ninguém as usava. Era a saída de menor risco e foi recusada por dois motivos: a regra de bloqueio por `sk` (props de mesma `sk` não coexistem em P1 e P2) é conhecimento de domínio que ficaria só implícito no meio de um componente de 2.500 linhas; e a duplicação entre `logic.js` e `App.jsx` continuaria existindo — apenas com uma das cópias apagada, o que não é o mesmo que resolvida.
- **Deixar como estava e só documentar melhor a armadilha.** Recusada: comentário não impede ninguém de chamar. A assinatura impede.

### Consequências
- A armadilha 14 muda de natureza: deixa de ser «cuidado ao usar» e vira «o erro é impossível de escrever». O CONTEXT foi reescrito nesse sentido pela `wo0025`.
- Uma fonte de verdade a menos duplicada. Restam duas da mesma família no backlog: `selectTech`/`selectAbility` e o formatador de estatísticas.
- `App.jsx` perde cerca de dez linhas e recupera dois imports que a limpeza de julho havia removido por órfãos.

---

## DEC-033 — Painel e exportação passam a usar o mesmo formatador de estatísticas
**Data:** 2026-08-24 · **Status:** aceita · **Aplicada pela** `wo0027`

### Contexto
O `StatsPanel` do `App.jsx` tinha um `fmtStat` local e um `changed` local, duplicando `formatStatValue` e `isStatChanged` de `logic.js` — as duas funções já importadas no mesmo arquivo e já usadas pelas rotinas de exportação de texto e de imagem. Também havia três toggles inline reimplementando `selectTech` e `selectAbility`.

**O achado não foi a duplicação, foi a divergência.** O `fmtStat` delegava o ramo de porcentagem ao helper local `pct`, que arredonda para inteiro (`Math.round(v * 100)`), enquanto `formatStatValue` mantém duas casas (`Math.round(v * 10000) / 100`). Para um valor de `0.125`, o painel diria `+13%` e a imagem exportada diria `+12.5%` — a mesma build mostrando dois números.

Medição feita antes de decidir: não existe no `data.js` atual nenhum valor com três ou mais casas decimais, então **hoje as duas implementações produzem a mesma string em todos os casos**. A divergência é latente. Ela viraria bug silencioso no primeiro valor fracionário que o jogo trouxer, e o sintoma — painel e exportação discordando — é dos caros de diagnosticar, porque as duas telas parecem corretas isoladamente.

### Decisão
O `StatsPanel` passa a chamar `formatStatValue` e `isStatChanged` como o resto do arquivo já fazia. `fmtStat` e `changed` saem. Os helpers locais `pct` e `pts` saem junto, por ficarem órfãos: `pts` era cópia fiel do ramo correspondente, e `pct` era a implementação **menos** precisa das duas — retirá-la é o ponto, não um efeito colateral. Os três toggles inline viram chamadas a `selectTech`/`selectAbility`.

### Alternativas consideradas
- **Só trocar os toggles e deixar o formatador.** Recusada: eram os dois itens da mesma família no backlog, e o do formatador é o que escondia a divergência.
- **Manter `pct` e alinhar `formatStatValue` ao arredondamento inteiro.** Recusada: perderia precisão na exportação para resolver uma duplicação. A regra é convergir para a implementação melhor, não para a mais antiga.
- **Deixar `pct`/`pts` no arquivo para uso futuro.** Recusada: é como nasceram os oito imports órfãos limpos em 2026-07-25.

### Consequências
- O painel e as duas exportações passam a ter uma fonte de verdade só para formatação de estatística. A próxima correção de formato entra em um lugar, não em dois — que foi o custo real cobrado na `spec0019`.
- Fecha o último par de duplicações mapeadas no backlog. A família aberta pela `spec0012` está encerrada.
- Registrado como aplicação da regra de processo «quando duas implementações divergem, a divergência é o achado»: a duplicação era conhecida desde julho, mas o que estava anotado era «é cópia» — e não era.

---

## DEC-034 — O chat deixa de entregar bloco de commit e arquivo-para-baixar
**Data:** 2026-11-14 · **Status:** aceita · **Aplicada pela** `wo0029`

### Contexto
O template-update v1.138.0 trouxe uma seção que a comparação de arquivos não produz: **linhas revogadas** — texto que o kit apagou de propósito e que continua vivo nos projetos, invisível ao merge porque não é algo que falte, é algo que sobra. Duas delas estavam aqui, e as duas descreviam um projeto que este deixou de ser.

A primeira (revogada em v1.106.0) mandava entregar sempre por arquivo completo, «nunca por blocos soltos para o usuário costurar à mão», e descrevia o usuário baixando arquivos e substituindo na pasta. A segunda (v1.104.0) mandava o assistente fechar a resposta com `add`/`commit`/`push` em três linhas, prontas para colar uma a uma.

> **Correção da premissa (2026-11-15, DEC-035):** a linha que o kit revogou em v1.104.0 é a do **executor** — «Mostre o git diff e o bloco de commit», numa skill de fecho ou de aplicação —, e essa saiu da `/wrap` na `wo0028`. A seção «Commit pronto ao final» do CEREBRO **não** foi revogada: o kit a mantém para projeto sem executor e a **inverte** no modo Code. A decisão desta DEC segue valendo — neste projeto o chat não entrega bloco de commit —, mas pelo motivo certo, a inversão do modo Code, e não uma revogação. Desde a Fatia 3, o CEREBRO traz a seção do kit seguida da linha «Neste projeto a regra acima se inverte (DEC-034)».

Nenhuma das duas sobrevive ao que o projeto tem hoje. O `/apply-wo` existe desde 22 de julho e roda o commit sozinho; a pasta vinculada existe desde hoje e deixa o chat escrever direto no repositório. Pior: o CEREBRO **se contradizia**, com a linha revogada a quinze seções de distância da substituta — a seção do Code manda virar WO com texto exato e âncora, que é exatamente o «bloco solto» que a outra proíbe.

### Decisão
As duas seções do CEREBRO foram reescritas em torno do canal, não do formato: com pasta vinculada e executor, a entrega é arquivo escrito no repositório ou WO aplicada pelo Code, e quem commita é quem aplica. O modo antigo — baixar, substituir, colar os três comandos — fica registrado como o que vale **quando não há executor nem pasta vinculada**, que é a situação de outro projeto, não desta.

Junto, a cadência de `sessão` foi trocada por `turno` ou `conversa` em 34 pontos de 8 arquivos, pela mesma revogação de v1.106.0: o ritual roda a cada turno, não uma vez por fio.

### O que NÃO mudou, e por quê
- **49 ocorrências de relato histórico** (STATUS a partir de «Última Sessão», DECISIONS, IDEAS, HISTORY): entradas datadas são fato medido. Reescrever falsifica o registro para consertar a regra.
- **131 ocorrências em `meta/workorders/`**: WO aplicada não se reescreve (DEC-030).
- **6 ocorrências nas skills e no `_TEMPLATE.md`**: texto do kit em v1.138.0, a versão corrente — não revogado. «custa uma sessão» mede custo, não prescreve cadência.
- **O rótulo `## 💬 Última Sessão` do STATUS**: é ponteiro. A skill `/wrap` procura o bloco da conversa anterior por ele, e ponteiro renomeado deixa órfão quem aponta — a mesma razão que preservou os nomes `spec0001`–`spec0020` na DEC-030.

### Consequências
- O CEREBRO deixa de se contradizer sobre a forma da entrega. Era a contradição mais cara do arquivo, porque as duas metades estavam certas para projetos diferentes e nenhuma dizia qual era este.
- Fica registrado o método que achou isso: varrer pelo FATO, não pela frase. Nenhuma das duas linhas estava escrita com as palavras da tabela de revogação do kit — a busca por string acharia zero.
- A Fatia 3 (merge dos 123 blocos do CEREBRO) escreve as âncoras contra o texto depois desta WO, não antes.

---

## DEC-037 — O GitHub Pages passa a ser publicado por workflow, e os ícones seguem o caminho-base

**Data:** 2026-11-16 · **Status:** aceita · **Aplicada pela** `wo0034` · **Substitui em parte** a DEC-016 (a via manual do GitHub Pages)

### Contexto
Depois da DEC-036, o push da `main` publicou a 1.0.0 no Netlify, na Vercel e no Cloudflare Pages, que montam a `main` sozinhos. O GitHub Pages — o link do README — seguiu na versão de 2026-04-21: ele serve a branch `gh-pages`, publicada à mão, porque o `npm run deploy` quebra no Windows (DEC-016). A leitura do código mostrou um segundo problema, que a primeira publicação automática teria exposto: `src/icons.js` monta todo caminho de ícone a partir de `/icons/...`, absoluto. No GitHub Pages o site vive em `/got-legends/`, e esses caminhos apontariam para `arlsnech.github.io/icons/...`, que não existe — o app abriria sem nenhum ícone. A `gh-pages` de abril nem tem a pasta `icons/` (medido com `git ls-tree origin/gh-pages`): era de antes dos ícones.

### Decisão
- O workflow `.github/workflows/deploy-gh-pages.yml` monta a `main` a cada push, no runner Linux do GitHub, com `VITE_BASE_URL=/got-legends/`, e empurra o `dist/` para a `gh-pages` com `peaceiris/actions-gh-pages@v4`. A fonte do Pages nas configurações do repositório não muda.
- `src/icons.js` prefixa os quatro caminhos-base com `import.meta.env.BASE_URL`, que é `/` nos hosts de raiz e `/got-legends/` no GitHub Pages.

### Alternativas consideradas
- **`actions/deploy-pages` (o deploy oficial)** — exigiria trocar a fonte do Pages para «GitHub Actions» nas configurações, um passo manual a mais, sem ganho aqui.
- **Aposentar o GitHub Pages e apontar o README para o Netlify** — fica como plano B. Se o workflow não funcionar, a `gh-pages` pode virar uma página de aviso que redireciona para o Netlify.

### Consequências
- Quatro hosts com a mesma `main`. Três servem na raiz, e o GitHub Pages em `/got-legends/`.
- O `npm run deploy` do `package.json` continua quebrado no Windows e não é mais necessário.
- Se o passo de deploy falhar com 403: Settings → Actions → General → Workflow permissions.

---

## DEC-038 — Entrada e saída de builds: um validador para todas as portas, e o pacote em três fatias

**Data:** 2026-11-17 · **Status:** aceita · **Aplicada pelas** `wo0036` (Fatia 0), `wo0038`, `wo0041` e `wo0042` (Fatia 1) e `wo0044` (Fatia 2) · **Análise:** `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md`

### Contexto
O dono escolheu a entrada e saída de builds como próxima frente e pediu análise com pesquisa de UX. A leitura do código derrubou a premissa de que toda build que entra passa por `deserializeBuild`: a importação de `.json` só conferia `build.classId`. Achou também perda de dado no uso comum — carregar uma build não trocava o nome no campo, e o Salvar seguinte gravava por cima de outra — e mediu que o validador aceitava build sem `gear` ou sem `techs`, que o cálculo não aguenta. Medido também: o código Base64 atual tem ~1.480 caracteres por build; só o `build`, comprimido, ~530.

### Decisão
Pacote da análise aprovado pelo dono como está, em 2026-11-17:
- **Fatia 0 (`wo0036`):** um validador para todas as portas — `deserializeBuild`, agora exigindo a forma mínima (os cinco slots, cada um com `p1`/`p2`, e `techs`), usado também pela importação; o nome acompanha a build carregada; gravação no `localStorage` com erro avisado; `revokeObjectURL` no export.
- **Fatia 1:** um componente de lista com seleção, o mesmo para importar (pelo botão e arrastando o arquivo em qualquer ponto da tela) e para exportar só as escolhidas. Importar não abre nada por padrão; «Importar e abrir» só com uma marcada. A build aberta é protegida por Desfazer, e o modal «Salvar como…» só aparece quando ela tem alteração não salva.
- **Fatia 2:** link com a build comprimida (deflate-raw nativo + base64url, com prefixo de versão) no fragmento `#b=`; o código antigo continua aceito na leitura; o texto exportado anexa o link no lugar do código.
- **Barrados:** link curto e filtros/agrupamento dos salvos. **Adiados com gatilho:** QR e busca por nome (`IDEAS.md`, «🛌 Adiadas»).

### Alternativas consideradas
Todas na análise, eixo por eixo (E1 a E9), com o motivo de cada descarte. As de mais peso: codificação por índice de `data.js` (a menor, mas corrompe links antigos em silêncio a cada reordenação), query string em vez de fragmento (vai ao servidor e aos logs sem ganho num site estático) e confirmação antes de toda troca de build (fadiga de confirmação, contra a pesquisa).

### Consequências
- Build salva sem algum dos cinco slots, ou sem `p1`/`p2`, deixa de abrir: mostra «✗ Erro ao carregar» em vez de derrubar a tela. A ferramenta não gera essa forma (`createEmptyBuild` cria todos; conferido em 800 builds de `randomBuild`); saves de versões muito antigas **não foram conferidos**.
- Id que não existe em `data.js` continua passando: não quebra o cálculo, e o aviso dele é trabalho da Fatia 2.
- As mensagens de erro de `deserializeBuild` continuam só em PT-BR e não são exibidas. Quando a Fatia 1 as mostrar no modal, viram código + texto bilíngue (D4 da análise).

---

## DEC-039 — Template-update do kit v1.155.0, em duas fatias; decisões do dono sobre o que o pacote não cobre

**Data:** 2026-11-23 · **Status:** aceita · **Aplicada pelas** `wo0039` (Fatia 1) e `wo0040` (Fatia 2, 2026-11-24)

### Contexto
O dono descompactou o pacote v1.155.0 em 2026-11-20. Antes de comparar: versão do pacote igual à anunciada; projeto em `main` @ `46c4d0d`; as quatro superfícies existem; sem `.claude/commands/`. Linhas revogadas: 13 ocorrências varridas (1 do texto literal, a DEC-034 relatando a correção; 12 de «sessão»), 0 corrigidas, 13 justificadas — relato, contraste, o ponteiro `## 💬 Última Sessão`, o rodapé `Claude-Session` e cinco no texto que o próprio pacote mantém nas skills. Carimbo de modos coerente, sem sobra. As três correções obrigatórias do `settings.json` já estavam feitas. Comparado o pacote v1.142.0 com o v1.155.0: nove arquivos sem nenhuma mudança; o grosso do delta é o CEREBRO, que passa quatro seções para o `GUIA-DO-KIT.md`.

### Decisão
- **Fatia 1 (`wo0039`):** skills, molde de WO, `settings.json` e `GUIA-DO-KIT.md` gravados pelo chat direto no disco — o `/apply-wo` novo instalado ANTES de aplicar qualquer WO, como o dono pediu — e versionados pela WO. Skills: o vivo mais as linhas que o kit mudou; as linhas deste projeto ficam. Molde de WO: o vivo era idêntico ao pacote v1.142.0, então foi substituído.
- **Fatia 2:** fusão do CEREBRO e das Instruções partindo do pacote, com inventário aprovado pelo dono antes de gravar. Junto: a seção «Build e validação» do CONTEXT e o `meta/SETUP.md`.
- **Decisões do dono, 2026-11-23** `[relatado pelo dono]`:
  - **Sistema operacional:** o pacote veio sem a seção «Ambiente (sistema operacional)» e sem a linha do Windows nas Instruções porque o dono **esqueceu de marcar o sistema no gerador**. Fica Windows, com o Git Bash no Code: transplante na Fatia 2.
  - **Build e validação:** sai do CEREBRO («Build e validação deste projeto») e vai para o CONTEXT, que é onde o pacote declara a rede; o CEREBRO recebe a seção «A rede deste projeto» do pacote.
  - **`meta/SETUP.md`:** adotado.
  - **LICENSE:** sem licença por enquanto.

### Alternativas consideradas
- **Aplicar a Fatia 1 por WO com a skill velha** — descartado: a WO de migração seria aplicada pelas regras que o pacote veio corrigir (o dono pediu as skills antes).
- **Substituir as skills inteiras pelas do pacote** — descartado: apagaria o build, o portão de diagnóstico, «não apague a WO», o teto de 6.900 e a cláusula de curadoria, que são deste projeto (colisão 5 da DEC-008).

### Consequências
- Até a Fatia 2, as quatro seções que o pacote passou para o GUIA existem nos DOIS arquivos: o GUIA (do kit, v1.155.0) e o CEREBRO vivo (v1.142.0). Vale o GUIA; a Fatia 2 as tira do CEREBRO.
- Cinco dos seis carimbos dizem v1.155.0; o do CEREBRO sobe na Fatia 2. A pasta do pacote fica na pasta-pai até lá.
- As Instruções coladas no painel do Projeto estão anteriores ao `9326145` (a fusão de 2026-11-15): o painel não tem a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)`. A Fatia 2 entrega o arquivo novo, e o dono cola no painel.

---

## DEC-040 — Salvar por cima só em silêncio para a build que está aberta

**Data:** 2026-11-25 · **Status:** aceita · **Aplicada pela** `wo0043`

### Contexto
O «Salvar» da gaveta deduplica por nome: salvar com um nome que já existe substituía a outra build sem aviso. O dono pediu, em 2026-11-24 (nota `261124-0856`), «um renomear automático ou pelo menos um aviso», como a importação já fazia (DEC-038, A4). Mas salvar por cima do próprio nome é o uso normal de quem abre uma build, edita e salva.

### Decisão
Aprovada pelo dono em 2026-11-25 `[relatado pelo dono]`:
- Salvar com um nome que **não** existe, ou com o nome com que a build aberta foi **aberta ou salva pela última vez**, grava direto.
- Salvar com o nome de **outra** build salva abre um modal: «Substituir "X"» × «Salvar como "X (2)"» (o próximo nome livre, a mesma regra da importação) × «Cancelar».
- O «nome aberto» é lembrado pelo `App` ao abrir (salvo, código, importar e abrir) e ao salvar, e o «Desfazer» da troca também o devolve.

### Alternativas consideradas
- **Renomear sempre** — descartado: quebraria a atualização de quem carregou e editou.
- **Avisar sempre** — descartado: cobraria uma confirmação em todo salvar, o uso mais comum da gaveta.

### Consequências
- O «Salvar como…» do modal de alterações não salvas (WO C) não muda: ele já avisa, antes de confirmar, quando o nome existe.
- Uma build aberta por código com o nome de uma salva conta como «a build aberta»: salvar por cima é direto.
