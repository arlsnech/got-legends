# spec0009 — Extração retroativa do `GOT_Build_-_Alex.md` e resíduos dos relatórios de sessão

**Data:** 2026-07-23 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** segunda sessão da extração retroativa (DEC-011). O `meta/legacy/GOT_Build_-_Alex.md` (61 KB, 5 blocos) foi lido por inteiro e cada pedido conferido contra o código de hoje. Como no Joker, **nada ficou por implementar** — mas o saldo aqui é bem maior: um bug de causa raiz, três decisões de arquitetura e **uma funcionalidade inteira em produção que não existe em nenhum `meta/`**. Junto vão três resíduos dos relatórios de sessão (`.txt`) que também não estavam registrados em lugar nenhum.

**O achado mais importante:** a formatação de munições por classe (`getPrimaryClass` + `formatAmmoForClass` em `App.jsx`) funciona há semanas e a busca por "munic" nos oito `meta/` retorna **zero**. Não está no STATUS, no CHANGELOG, no CONTEXT nem no GLOSSARY. Qualquer refactor de `App.jsx` a apagaria sem que nada acusasse a perda.

**Regras de execução:**
- Nenhum arquivo de código (`src/`) é tocado → **não precisa de `npm run build`**; a rede é o `git diff`.
- Nenhum `--force`, `rebase` ou `reset --hard`.
- A única remoção autorizada é a da Parte 9, e só depois de as Partes 2–8 estarem no `git diff`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
ls meta/legacy/
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. `meta/legacy/GOT_Build_-_Alex.md` existe? Se não, aplique tudo menos a Parte 9 e reporte a ausência.
3. Há algo modificado e não commitado? Liste.

---

## Parte 2 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-013):

```
Nenhum tier fica órfão, então o estado inválido não volta por esse caminho. **A guarda é essa tabela, não o código:** se `data.js` algum dia ganhar uma técnica `legSlots` num tier assimétrico entre classes, `newLegTech` vira `undefined`, nada é equipado e o build inválido reaparece — sem erro no console. Quem mexer nas técnicas de `data.js` precisa reler este quadro.
```

**Substituir por** (a âncora, seguida do conteúdo novo):

```
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
Duas pontas soltas, ambas conferidas em 2026-07-23 e agora no backlog do `STATUS.md`:

1. **Código morto.** `onLinkedClass` está declarado em `App.jsx` e nunca é usado; `setCharmLinkedClass` continua importado lá e exportado em `logic.js` sem nenhum consumidor.
2. **Nenhuma indicação visual do vínculo.** A proposta original substituía o `<select>` por um selo "Vinculado a: 🗡️ Samurai". Isso não foi feito — o bloco foi apagado e nada entrou no lugar. Hoje o jogador vê props e perks de classe surgirem no amuleto sem nada na tela explicando de onde vêm.

---

## DEC-016 — Deploy pelo Netlify porque `npm run deploy` quebra no Windows

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita, em vigor

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
```

---

## Parte 3 — `meta/CONTEXT.md`

**Âncora** (item 8 das «Armadilhas Conhecidas», último da lista):

```
8. **Técnica Magistral não tem flag própria** — é identificada por `tech.fx.some(fx => fx.s === 'legSlots')`, em `countLegBonus`, `checkLegendaryLimit` e `changeClass`. E ela existe **só nos tiers I e III**, nas quatro classes: é dessa simetria que `changeClass` depende para propagar a técnica ao trocar de classe. Acrescentar uma técnica `legSlots` num tier que só uma classe tenha quebra a troca de classe **em silêncio** — sem erro, apenas com um build acima do limite. Ver DEC-013.
```

**Substituir por:**

```
8. **Técnica Magistral não tem flag própria** — é identificada por `tech.fx.some(fx => fx.s === 'legSlots')`, em `countLegBonus`, `checkLegendaryLimit` e `changeClass`. E ela existe **só nos tiers I e III**, nas quatro classes: é dessa simetria que `changeClass` depende para propagar a técnica ao trocar de classe. Acrescentar uma técnica `legSlots` num tier que só uma classe tenha quebra a troca de classe **em silêncio** — sem erro, apenas com um build acima do limite. Ver DEC-013.

9. **A string de munição tem formato significativo** — `"Flecha Flamejante: 2 (5)"` não é texto livre: o número entre parênteses é a quantidade da classe primária da arma, e `"Flecha Perfurante: (6)"` (sem número externo) some da tela para as outras classes. Quem editar `ammo` em `data.js` precisa manter o padrão `Label: X (Y)` — `formatAmmoForClass` casa por regex e **deixa passar sem erro** a linha que não casar, exibindo-a crua para todas as classes. Ver DEC-017.

10. **`REQUIRED_PERKS` é uma lista à mão** — o perk de desbloqueio obrigatório só trava se o item estiver nessa tabela de `data.js`. Item que ganhe perk de desbloqueio no `GEAR` e não entre aqui não trava nada, e nada acusa. Ver DEC-014.
```

---

## Parte 4 — `meta/GLOSSARY.md`

### 4.1 — Corrigir a linha do `npm run deploy`

**Âncora:**

```
- **`npm run deploy`** — faz build e publica no GitHub Pages via `gh-pages`
```

**Substituir por:**

```
- **`npm run deploy`** — faz build e chama `gh-pages -d dist`. **Quebra neste ambiente** com `ENAMETOOLONG` (limite de linha de comando do Windows); está no `deny` do `.claude/settings.json`. O site é publicado pelo Netlify a partir do `dist/`. Ver DEC-016.
```

### 4.2 — Termos novos

**Âncora** (na seção «Arquiteturas / módulos»):

```
- **`getEffectiveCharm(itemId, linkedClass)`** — retorna o item de amuleto com props/perks de classe já injetados. Nunca ler amuleto magistral com `classBinding` direto do `GEAR`.
```

**Substituir por:**

```
- **`getEffectiveCharm(itemId, linkedClass)`** — retorna o item de amuleto com props/perks de classe já injetados. Nunca ler amuleto magistral com `classBinding` direto do `GEAR`.
- **`CLASS_EXCLUSIVE_CHARM_PROPS` / `_PERKS`** — tabelas de `data.js`, indexadas por `classId`, com o que um amuleto Magistral vinculado ganha da classe. São a fonte de verdade: `resolveCharmClassBinding` lê delas, não deduz por comparação. Ver FIX-008.
- **Perk de desbloqueio** — perk que uma classe não-primária precisa gastar para usar uma arma de outra classe (Versátil no Arco Longo, Desbloqueio do Ronin na Zarabatana). Fica travado no slot Vantagem I com o selo 🔒. Definido em `REQUIRED_PERKS` (`data.js`). Ver DEC-014.
- **Classe primária (de uma arma)** — a classe "dona" do equipamento, que recebe a quantidade de munição entre parênteses. Calculada por `getPrimaryClass(item)`: `item.by[0]`, ou `hunter` para arma de longo alcance sem restrição. Ver DEC-017.
```

---

## Parte 5 — `meta/STATUS.md`

### 5.1 — Registrar a funcionalidade de munições

**Âncora** (na seção «✅ Funcionando»):

```
- Perks por slot com perk obrigatório travado (🔒) quando aplicável
```

**Substituir por:**

```
- Perks por slot com perk obrigatório travado (🔒) quando aplicável — tabela `REQUIRED_PERKS` (DEC-014)
- Munições exibidas conforme a classe ativa: quantidade da classe primária entre parênteses, linha exclusiva omitida para as demais (DEC-017)
```

### 5.2 — Backlog

**Âncora** (a seção inteira, do título ao último item):

```
## 📋 Backlog (curto prazo — acionáveis na próxima sessão)

- [ ] Aplicar as 4 correções pendentes do `GUIA_CORRECOES_FASE3.md`
- [ ] Implementar `generateBuildImage` (Fase 3)
- [ ] Verificar IDs reais de amuletos em `data.js` vs entradas em `icons.js` (alguns podem não bater)
- [ ] Verificar IDs de técnicas do Assassino (comentados em `icons.js` como pendentes)
- [ ] Adicionar técnicas do Assassino faltantes em `TECH_ICON` (sumica_toxico, supergolpe, etc.)
```

**Substituir por:**

```
## 📋 Backlog (curto prazo — acionáveis na próxima sessão)

> O item "aplicar as 4 correções pendentes do `GUIA_CORRECOES_FASE3.md`" **saiu daqui em 2026-07-23**: as três de layout foram aplicadas pela spec0006 e a quarta pela spec0004. Estava contradizendo a seção «⏳ Pendente de Aplicação», que já dizia que não havia pendência.

- [ ] Implementar `generateBuildImage` (Fase 3)
- [ ] **`picada_celestial` fora de `REQUIRED_PERKS`** — o item carrega o perk `desbloq_ron_pc` ("Desbloqueio do Ronin") no próprio pool e está disponível ao Ronin (`by:["assassin","ronin"]`), mas a tabela não tem entrada para ele: o Ronin equipa a Picada Celestial sem o perk travar, ao contrário do que acontece na Zarabatana. Inconsistência interna do `data.js`, verificada em 2026-07-23. Correção provável: uma linha `picada_celestial: { ronin: 'desbloq_ron_pc' }`. Ver DEC-014.
- [ ] **Limpar o código morto do vínculo de classe** — `onLinkedClass` declarado e nunca usado em `App.jsx`; `setCharmLinkedClass` importado lá e exportado em `logic.js` sem consumidor. Resíduo da remoção do seletor (DEC-015). Cuidado: o campo `linkedClass` do estado **fica** — quem some é só a função de troca.
- [ ] Verificar se `visao_sugaru` (Visão de Sugaru, arco longo Magistral) deveria ter perk de desbloqueio — ao contrário do `arco_ricocheteador`, que reusa `PERKS_ARCO_LONGO` e por isso tem `versatil`, o pool do Sugaru não traz nenhum perk de desbloqueio. Pode ser fiel ao jogo ou pode ser omissão de dado; **conferir no jogo antes de mexer.**
- [ ] Verificar IDs reais de amuletos em `data.js` vs entradas em `icons.js` (alguns podem não bater)
- [ ] Verificar IDs de técnicas do Assassino (comentados em `icons.js` como pendentes)
- [ ] Adicionar técnicas do Assassino faltantes em `TECH_ICON` (sumica_toxico, supergolpe, etc.)
- [ ] Apagar as duas cópias soltas de `GUIA_COMPLETO*.md` que ficaram **fora do repositório** (`got-legends/GUIA_COMPLETO.md` e `got-legends/notas-arquivadas/GUIA_COMPLETO_v4.md`). São byte-idênticas — md5 conferido em 2026-07-23 — à versionada em `meta/legacy/GUIA_COMPLETO_v4.md`. Pela DEC-012, cópia fora do repo é cópia em risco, e estas três divergirem seria pior do que não existirem.
```

### 5.3 — Última sessão

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo:** extração 2/4 — `meta/legacy/GOT_Build_-_Alex.md` (61 KB). A linha dele já saiu do `.flatdropignore` nesta spec; basta regerar o pacote FlatDrop antes de abrir a próxima conversa.
```

**Substituir por:**

```
**Próximo passo:** extração 2/4 — `meta/legacy/GOT_Build_-_Alex.md` (61 KB). A linha dele já saiu do `.flatdropignore` nesta spec; basta regerar o pacote FlatDrop antes de abrir a próxima conversa.

---

**2026-07-23 — extração retroativa 2/4: `GOT_Build_-_Alex.md`.**

Arquivo lido por inteiro (5 blocos, 61 KB) e conferido contra o código de hoje. Como no Joker, **nenhum pedido ficou aberto**. O saldo, porém, foi bem maior:

- **DEC-017 — munições por classe.** O achado principal: a funcionalidade está em produção (`getPrimaryClass` + `formatAmmoForClass` no `App.jsx`) e a busca por "munic" nos oito `meta/` retornava **zero**. Uma funcionalidade inteira que um refactor apagaria sem que nada acusasse.
- **FIX-008** — `resolveCharmClassBinding` deduzia os props "exclusivos de classe" por comparação com o amuleto de classe, e por isso injetava props do **sub-tipo** (ranged) em magistrais que não os tinham. Corrigido com tabelas explícitas em `data.js`. É o caso concreto que originou a DEC-006.
- **DEC-014** — estrutura e razão da tabela `REQUIRED_PERKS` (perk de desbloqueio travado 🔒). O formato aninhado por classe existe porque o `remedio_proibido` tem dois perks de desbloqueio diferentes.
- **DEC-015** — o vínculo de classe do amuleto Magistral é automático; o seletor foi removido. Deixou código morto e a tela sem nenhuma indicação do vínculo.
- **DEC-016** — o motivo real de o site viver no Netlify: `npm run deploy` quebra neste ambiente com `ENAMETOOLONG` (limite de linha de comando do Windows com 120+ ícones no `dist/`). O `deny` no `.claude/settings.json` registrava só "publica no site real".

Conferido de passagem e **em ordem**: `REQUIRED_PERKS` aponta para perks que existem (`versatil`, `desbloq_ron`, `desbloq_ass`, `desbloq_ass_rp`, `desbloq_sam_rp`); `getPrimaryClass` bate com o `by` real de todos os itens de longo alcance; as seis integrações de `getRequiredPerkId` estão todas no lugar.

Três achados novos foram para o backlog: `picada_celestial` fora de `REQUIRED_PERKS`, o código morto do vínculo e a dúvida do `visao_sugaru`.

**Também absorvido nesta sessão:** os dez relatórios de sessão em `.txt` do mount foram lidos e conferidos. Tudo neles já estava registrado, **menos** três coisas, agora no backlog e no IDEAS: as cópias soltas de `GUIA_COMPLETO*.md` fora do repo, a decisão em aberto sobre versionar o `.claude/launch.json`, e o registro de que os nomes do legado foram normalizados (espaço → underscore) ao serem movidos. Com isso os `.txt` podem ser arquivados.

Sem mudança de código nesta sessão — `npm run build` não foi necessário. `meta/legacy/GOT_Build_-_Alex.md` removido da árvore; segue no histórico do Git.

**Próximo passo:** extração 3/4 — `meta/legacy/GOT_Build_-_Origem.md` (197 KB). A linha dele já saiu do `.flatdropignore` nesta spec.
```

---

## Parte 6 — `meta/CHANGELOG.md`

A funcionalidade de munições por classe é da mesma leva do perk obrigatório, que já está registrado em `[0.1.0]`. Entra ao lado dele, sem inventar data.

**Âncora** (na seção `## [0.1.0] — 2026-06-23`, subseção «Adicionado»):

```
- Perks com perk obrigatório travado (🔒) para itens com restrição de classe
```

**Substituir por:**

```
- Perks com perk obrigatório travado (🔒) para itens com restrição de classe
- Munições exibidas conforme a classe ativa: a classe primária da arma vê a quantidade entre parênteses; munição exclusiva dela some para as demais *(registrado retroativamente em 2026-07-23 — DEC-017; a data desta linha é a da versão, não a do registro)*
```

---

## Parte 7 — `meta/IDEAS.md`

### 7.1 — Fila de leitura

**Âncora:**

```
| `GOT_Build_-_Alex.md` | 61 KB | ⏳ próximo |
| `GOT_Build_-_Origem.md` | 197 KB | ⏳ |
```

**Substituir por:**

```
| `GOT_Build_-_Alex.md` | 61 KB | ✅ extraído em 2026-07-23 (spec0009) — arquivo removido |
| `GOT_Build_-_Origem.md` | 197 KB | ⏳ próximo |
```

### 7.2 — O que o Alex rendeu

**Âncora** (fim da seção acrescentada pela spec0008):

```
**Calibração do critério, para os próximos arquivos:** o valor do Joker não foi encontrar código faltando — foi encontrar **código sem registro**. Dois consertos em vigor há semanas não existiam em nenhum `meta/`, e um deles estava a um passo de ser lido como já coberto pelo FIX-006. Ler o arquivo perguntando "isso está no código?" acha pouco; perguntar "isso está *registrado*?" acha o que interessa.
```

**Substituir por:**

```
**Calibração do critério, para os próximos arquivos:** o valor do Joker não foi encontrar código faltando — foi encontrar **código sem registro**. Dois consertos em vigor há semanas não existiam em nenhum `meta/`, e um deles estava a um passo de ser lido como já coberto pelo FIX-006. Ler o arquivo perguntando "isso está no código?" acha pouco; perguntar "isso está *registrado*?" acha o que interessa.

### Já extraído do `GOT_Build_-_Alex.md` (2026-07-23) — **não reabrir**
Os cinco pedidos do arquivo estão todos no código. Viraram FIX-008, DEC-014, DEC-015, DEC-016 e DEC-017. Se reaparecerem em outro arquivo antigo, são ruído: correção do `classBinding` injetando props de sub-tipo · perk de desbloqueio obrigatório (Versátil, Zarabatana, Pacote de Bombas, Remédio Proibido) · remoção do seletor de classe vinculada · munições por classe · o `ENAMETOOLONG` do `gh-pages`.

**O critério aguentou o arquivo maior, e uma pergunta nova apareceu:** *"isso está registrado?"* pegou o FIX-008 e as decisões, mas quem pegou as munições foi *"o que este código faz que nenhum `meta/` menciona?"*. São perguntas diferentes — a primeira parte do arquivo antigo, a segunda parte do código. Para o `Origem` (197 KB) e o `TOhno` (267 KB), vale rodar as duas.
```

### 7.3 — Ideias novas

**Âncora** (último item da seção «🤖 Ideias Ativas — Assistente»):

```
### 2026-06-24 — PWA / Offline
```

**Substituir por** (as duas ideias novas entram **antes** dessa linha, mantendo-a no fim):

```
### 2026-07-23 — Selo "Vinculado a: <classe>" no amuleto Magistral
Quando o seletor de classe vinculada foi removido (DEC-015), nada entrou no lugar. O jogador vê props e perks de classe aparecerem no amuleto sem nada na tela dizendo de onde vêm. A proposta original era um selo estático com o emoji e o nome da classe ativa — display puro, sem lógica, já que `linkedClass` sempre acompanha `classId`. Baixo custo, e fecha uma pergunta silenciosa da interface.

### 2026-07-23 — Versionar o `.claude/launch.json`
O Claude Code precisou criá-lo para subir o dev server nas conferências visuais das specs 0003 e 0004, e o apagou nas duas vezes por não estar no `.gitignore` nem previsto em spec. Versioná-lo tornaria a conferência visual barata e repetível — hoje ela custa um arquivo recriado a cada sessão. A recomendação partiu do próprio Code, duas vezes; nunca foi decidida.

### 2026-06-24 — PWA / Offline
```

---

## Parte 8 — `.flatdropignore`

> Arquivo com quebras de linha **CRLF**. Preserve-as. Se preferir, a edição pode ser feita pela GUI do FlatDrop — o efeito é o mesmo.

Dentro do bloco `# >>> flatdrop-editor`, **remova a linha**:

```
meta/legacy/GOT_Build_-_Origem.md
```

Com ela fora, o `GOT_Build_-_Origem.md` sobe no próximo pacote, que é a matéria-prima da extração 3/4. **Não mexa nas outras linhas** — `GOT_Build.md`, `GOT_Build_-_TOhno.md`, os dois `GUIA_*` e o `README.md` ficam como estão.

---

## Parte 9 — Remover o arquivo extraído

**Só depois de as Partes 2 a 8 aparecerem no `git diff`.**

```
git rm meta/legacy/GOT_Build_-_Alex.md
```

---

## Parte 10 — `logs/2026-07-23.md`

**Anexe** o conteúdo abaixo ao final do arquivo (ele já existe, com duas sessões), precedido de uma linha `---`:

```markdown
## Sessão 3 — Extração retroativa 2/4: `GOT_Build_-_Alex.md`

### Objetivo da sessão
Ler os relatórios de sessão em `.txt` e confirmar se podem ser arquivados; em seguida executar a extração 2/4.

### Feito
- Lidos os dez `.txt` do mount (relatórios de `/apply-spec` das specs 0001–0008, o `/wrap` da 0004 e uma amostra do bug de `undefined` no export). Cada fato conferido contra os `meta/`.
- Lido por inteiro `meta/legacy/GOT_Build_-_Alex.md` (5 blocos, 61 KB).
- Conferidos contra o código atual: `resolveCharmClassBinding`, `CLASS_EXCLUSIVE_CHARM_PROPS/PERKS`, `REQUIRED_PERKS` e as seis integrações de `getRequiredPerkId`, `getPrimaryClass`/`formatAmmoForClass`, e a ausência do seletor de classe vinculada.
- Validado que todos os perks citados em `REQUIRED_PERKS` existem em `data.js` e que `getPrimaryClass` bate com o `by` real de cada arma de longo alcance.
- Entregue a `spec0009`.

### Specs entregues / aplicadas
- `260723-spec0009-extracao-alex.md` — registra FIX-008 e DEC-014 a DEC-017, acrescenta as armadilhas 9 e 10 ao CONTEXT, quatro termos ao GLOSSARY, a funcionalidade de munições ao STATUS e ao CHANGELOG, quatro itens ao backlog, duas ideias ao IDEAS; corrige a linha do `npm run deploy` no GLOSSARY e o item obsoleto do backlog; libera o `Origem` no `.flatdropignore` e remove o arquivo extraído.

### Decisões
- **DEC-014** — `REQUIRED_PERKS` aninhado por classe, e por quê.
- **DEC-015** — vínculo de classe automático; seletor removido.
- **DEC-016** — Netlify porque o `gh-pages` quebra no Windows (`ENAMETOOLONG`).
- **DEC-017** — munições por classe. Achado principal: funcionalidade em produção sem nenhum registro.

### Bugs
- **FIX-008** — `resolveCharmClassBinding` injetava props do sub-tipo do amuleto de classe. Registro retroativo; conserto já em vigor.
- Achado novo, ainda aberto: `picada_celestial` fora de `REQUIRED_PERKS` — foi para o backlog.

### Aprendizados / armadilhas
- **A string de munição tem gramática.** `"Label: X (Y)"` é dado estruturado disfarçado de texto; linha fora do padrão passa sem erro. Virou armadilha 9.
- **`REQUIRED_PERKS` não se valida contra o `GEAR`.** Item novo com perk de desbloqueio que não entre na tabela não trava nada. Virou armadilha 10.
- **Derivar dado de domínio por comparação estrutural é frágil** — a lição do FIX-008, e a origem da DEC-006.
- **Duas perguntas, não uma.** "Isso está registrado?" pega o que o arquivo antigo conta; "o que o código faz que nenhum `meta/` menciona?" pega o que ninguém contou. As munições só apareceram pela segunda.

### Onde parei
`spec0009` entregue. Os `.txt` liberados para arquivamento, com os três resíduos deles registrados. Nenhuma mudança de código.

### Próximos passos
1. Extração 3/4 — `GOT_Build_-_Origem.md` (197 KB).
2. Extração 4/4 — `GOT_Build_-_TOhno.md` (267 KB), provavelmente em duas sessões.
3. Fase 3 (`generateBuildImage`), depois da extração e informada por ela.
```

---

## Parte 11 — Fechamento

Rode `git diff`. Nenhum arquivo de `src/` deve aparecer — se aparecer, **PARE**.

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/GLOSSARY.md meta/STATUS.md meta/CHANGELOG.md meta/IDEAS.md .flatdropignore logs/2026-07-23.md meta/specs/260723-spec0009-extracao-alex.md
git commit -m "docs(meta): extrai o legado do Alex e registra FIX-008 e DEC-014 a DEC-017"
git push
```
