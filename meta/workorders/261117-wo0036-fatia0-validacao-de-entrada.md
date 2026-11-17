# wo0036 — Fatia 0 da entrada de builds: um validador para todas as portas, e o nome acompanha a build carregada

**Data:** 2026-11-17 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** mista — CODIGO (`src/logic.js`, `src/App.jsx`) + registro (CHANGELOG, DECISIONS, IDEAS, ROADMAP).
**Config sugerida:** Sonnet, `/effort` alto (toca `src/`).
**Pre-requisito:** `main` @ `ed49a0e`, arvore limpa fora de `meta/analises/` (dois arquivos novos, gravados pelo chat, que esta WO versiona).
**Base:** `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md`, aprovada como esta pelo dono em 2026-11-17 («Aprovo o pacote da análise de entrada e saída como está; escreva a WO da Fatia 0.») — vira a DEC-038 na Edicao 12.
**Depende de:** `wo0035` aplicada (`ed49a0e`).

> **Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido pelo chat ao grava-los):
> - `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md` — `b4826564e02953701f3eab1ed6a3bf488998667f`
> - `meta/analises/_TEMPLATE.md` — `34bf231057d93f82c024cb073b16958de276788c` (copia LF do `analises._TEMPLATE__template-update.md` do pacote v1.142.0)
> - esta WO — sem hash (ela nao pode conter o proprio).
>
> **Edicao 0:** rode `sha1sum` nos dois arquivos acima ANTES de tudo. Hash diferente = outro escritor mexeu depois do chat: **PARE e reporte**.
>
> **Ancoras lidas em:** 2026-11-17, neste turno, do disco, com `grep -cxF` sobre o arquivo sem `\r` — cada ancora abaixo e uma LINHA INTEIRA e deu **1** ocorrencia:
> - Ed. 1 — `src/logic.js`: `// ─── SAVE / LOAD ─────────────────────────────────────────────`
> - Ed. 2 — `src/logic.js`: `  if (!saved.build || !saved.build.classId) {`
> - Ed. 3a/3b — `src/App.jsx` (`persist` no `SaveDrawer`): `    setSaves(list)` e `    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))` (quatro espacos)
> - Ed. 4 — `src/App.jsx` (`save`): `    persist([entry, ...saves.filter(s => s.name !== name)])`
> - Ed. 5 — `src/App.jsx` (`load`): a linha `showFlash(...)` com `` `✓ "${entry.name}" carregado` ``
> - Ed. 6 — `src/App.jsx` (`clearAll`): `      persist([])`
> - Ed. 7 — `src/App.jsx` (`exportAll`): `    a.href = URL.createObjectURL(blob)` e `    a.click()`
> - Ed. 8 — `src/App.jsx` (`importFile`): `        const valid = incoming.filter(b => b.build?.classId)`, a linha `persist([...valid, ...` e a linha `showFlash(` com `'builds importados'`
> - Ed. 9 — `src/App.jsx` (`loadCode`): `      showFlash(lang === 'en' ? '✓ Build loaded!' : '✓ Build carregada!')`
> - Ed. 10 — `meta/CHANGELOG.md`, em `[Não lançado]` → `### Corrigido`: a linha que comeca `- Os ícones usavam caminho absoluto`
> - Ed. 11 — `meta/DECISIONS.md`, ultima linha do arquivo: `- Se o passo de deploy falhar com 403: Settings → Actions → General → Workflow permissions.`
> - Ed. 12a–12g — `meta/IDEAS.md`: os quatro titulos `### 2026-0x — …` citados, a linha `- _(nenhuma ainda — seção adotada do template v1.142.0 em 2026-11-15)_` e a linha `- **Barra de HP mostrando os 100 HP base** — …`
> - Ed. 13a/13b — `meta/ROADMAP.md`: `- URL compartilhável com build encodada na query string (`?b=eyJ...`)` e `- QR Code de link compartilhável`
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo = CODE** (esta WO e o registro de CHANGELOG, DECISIONS, IDEAS e ROADMAP). STATUS e log do dia: o `/wrap` que vem depois.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

A analise aprovada achou, lendo o codigo, que a premissa «toda build que entra passa por `deserializeBuild`» era falsa: a importacao de `.json` so confere `build.classId`. Achou tambem que **carregar uma build salva (ou um codigo) nao troca o nome no campo**, e o `save()` deduplica por nome — o Salvar seguinte grava a build carregada **por cima de outra**, sem aviso (D1). E mediu que o validador aceita build sem `gear` ou sem `techs`, que derruba `computeStats` dentro do `useMemo` do `App` (D3). Esta WO conserta isso antes de qualquer porta nova (arrasto, link) existir, porque toda porta nova herdaria os tres defeitos. De carona, dois de uma linha: `persist` grava sem `try` (D6) e o export nao libera o `createObjectURL` (D5).

## Inventario — de onde saiu a lista de edicoes de codigo

- **Portas de entrada de build:** `grep -n "deserializeBuild\|decodeBuild\|JSON.parse" src/App.jsx src/logic.js` — **4** pontos de dado externo: `load` (usa `deserializeBuild`), `loadCode` (`decodeBuild` → `deserializeBuild`), `importFile` (**nao** usa) e a leitura do `localStorage` no `useEffect` do `SaveDrawer` (so popula a lista; quem abre e o `load`). Esta WO poe o `importFile` no validador e endurece o validador.
- **Onde a build carregada entra no `App`:** `window.__loadBuild?.(…)` — **2** chamadas, ambas no `SaveDrawer` (`load`, `loadCode`). As duas ganham `setBuildName`.
- **Chamadas de `persist(`:** **4** (`save`, `remove`, `clearAll`, `importFile`). As tres que mostram ✓ depois passam a checar o retorno; `remove` nao mostra aviso e fica como esta.
- Se a sua contagem der outro numero em qualquer dos tres itens, **PARE e reporte antes de editar**.

---

## Edicao 1 — `src/logic.js` · a forma minima de um build

**Ancora** (linha inteira, o cabecalho da secao):

```
// ─── SAVE / LOAD ─────────────────────────────────────────────
```

**Substituir por:**

```
// ─── SAVE / LOAD ─────────────────────────────────────────────

// Os cinco slots que createEmptyBuild cria. O cálculo e a tela leem cada um,
// e o p1/p2 dele, sem checar se existem (análise 261116, M3).
const BUILD_GEAR_SLOTS = ['katana', 'ranged', 'charm', 'gw1', 'gw2'];

/** Objeto comum: não nulo e não array. */
function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Confere a forma mínima de um build vindo de fora (salvo, arquivo, código).
 * Sem ela, computeStats lança dentro do useMemo do App e a tela inteira cai.
 * NÃO confere se os ids existem em data.js: id desconhecido não quebra o
 * cálculo (medido em 2026-11-16) e o aviso dele é trabalho da Fatia 2 (link).
 * @param {Object} build
 * @returns {boolean}
 */
function hasBuildShape(build) {
  if (!isPlainObject(build.techs) || !isPlainObject(build.gear)) return false;
  return BUILD_GEAR_SLOTS.every(name => {
    const slot = build.gear[name];
    return isPlainObject(slot) && isPlainObject(slot.p1) && isPlainObject(slot.p2);
  });
}
```

## Edicao 2 — `src/logic.js` · `deserializeBuild` exige a forma

**Ancora** (linha inteira, dentro de `deserializeBuild`):

```
  if (!saved.build || !saved.build.classId) {
```

**Substituir por:**

```
  if (!saved.build || !saved.build.classId || !hasBuildShape(saved.build)) {
```

## Edicao 3a — `src/App.jsx` · `persist` grava antes de mostrar

**Ancora** (linha inteira, dentro de `const persist = (list) => {`, quatro espacos):

```
    setSaves(list)
```

**Substituir por:**

```
    // Grava primeiro e só então mostra: cota cheia ou armazenamento bloqueado
    // lançam aqui, e a lista na tela não pode dizer «salvo» se o navegador não
    // gravou (análise 261116, D6). Devolve false para quem chamou não mostrar ✓.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      showFlash(lang === 'en' ? '✗ Could not write to browser storage' : '✗ Não foi possível gravar no navegador')
      return false
    }
    setSaves(list)
    return true
```

## Edicao 3b — `src/App.jsx` · remove a gravacao antiga (segunda metade da 3a)

**Remover a linha inteira** — a de **quatro** espacos, logo abaixo do `return true` que a 3a inseriu. A de seis espacos, dentro do `try`, fica:

```
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
```

> 3a e 3b sao as duas metades da mesma operacao. Ordem obrigatoria: 3a, depois 3b. Depois das duas, `persist` tem um `setItem` so (o do `try`) e um `setSaves(list)` so (depois do `catch`).

## Edicao 4 — `src/App.jsx` · `save` nao mostra ✓ se nao gravou

**Ancora** (linha inteira):

```
    persist([entry, ...saves.filter(s => s.name !== name)])
```

**Substituir por:**

```
    if (!persist([entry, ...saves.filter(s => s.name !== name)])) return
```

## Edicao 5 — `src/App.jsx` · `load` leva o nome junto (D1)

**Ancora** (linha inteira, dentro de `const load = (entry) => {`):

```
      showFlash(lang === 'en' ? `✓ "${entry.name}" loaded` : `✓ "${entry.name}" carregado`)
```

**Substituir por:**

```
      // O nome acompanha a build: sem isto o campo guarda o nome da anterior, e o
      // próximo Salvar grava esta build por cima daquela (análise 261116, D1).
      setBuildName(entry.name || '')
      showFlash(lang === 'en' ? `✓ "${entry.name}" loaded` : `✓ "${entry.name}" carregado`)
```

## Edicao 6 — `src/App.jsx` · `clearAll` nao mostra sucesso se nao gravou

**Ancora** (linha inteira, seis espacos, dentro de `clearAll`):

```
      persist([])
```

**Substituir por:**

```
      if (!persist([])) return
```

## Edicao 7a — `src/App.jsx` · `exportAll` guarda a URL do blob (D5)

**Ancora** (linha inteira, dentro de `exportAll`):

```
    a.href = URL.createObjectURL(blob)
```

**Substituir por:**

```
    const url = URL.createObjectURL(blob)
    a.href = url
```

## Edicao 7b — `src/App.jsx` · e a libera depois do clique

**Ancora** (linha inteira, dentro de `exportAll`, quatro espacos — o `a.click()` do `generateBuildImage` tem oito e nao casa):

```
    a.click()
```

**Substituir por:**

```
    a.click()
    URL.revokeObjectURL(url)   // mesmo padrão do generateBuildImage (análise 261116, D5)
```

## Edicao 8a — `src/App.jsx` · `importFile` passa pelo validador (D2)

**Ancora** (linha inteira, dentro de `importFile`):

```
        const valid = incoming.filter(b => b.build?.classId)
```

**Substituir por:**

```
        // A mesma validação do clique num salvo: o que não abriria não entra no
        // localStorage, onde só falharia depois, ao clicar (análise 261116, D2).
        const valid = incoming.filter(b => deserializeBuild(b).ok)
        const skipped = incoming.length - valid.length
        if (!valid.length) {
          showFlash(lang === 'en' ? '✗ No valid build in the file' : '✗ Nenhuma build válida no arquivo')
          return
        }
```

## Edicao 8b — `src/App.jsx` · `importFile` nao mostra ✓ se nao gravou

**Ancora** (linha inteira):

```
        persist([...valid, ...saves.filter(s => !valid.find(v => v.id === s.id))])
```

**Substituir por:**

```
        if (!persist([...valid, ...saves.filter(s => !valid.find(v => v.id === s.id))])) return
```

## Edicao 8c — `src/App.jsx` · o aviso diz quantas ficaram de fora

**Ancora** (linha inteira):

```
        showFlash(`${valid.length} ${lang === 'en' ? 'builds imported' : 'builds importados'}`)
```

**Substituir por:**

```
        showFlash(skipped
          ? (lang === 'en' ? `✓ ${valid.length} imported, ${skipped} ignored` : `✓ ${valid.length} importadas, ${skipped} ignoradas`)
          : (lang === 'en' ? `✓ ${valid.length} builds imported` : `✓ ${valid.length} builds importadas`))
```

> Duas mudancas de texto deliberadas nesta linha: o «✓» na frente, como os outros avisos de sucesso da gaveta, e «importados» → «importadas», porque «build» e feminino em toda a interface («Build carregada», «Builds Salvas»).

## Edicao 9 — `src/App.jsx` · `loadCode` leva o nome junto (D1)

**Ancora** (linha inteira, dentro de `const loadCode = () => {`):

```
      showFlash(lang === 'en' ? '✓ Build loaded!' : '✓ Build carregada!')
```

**Substituir por:**

```
      setBuildName(r.name || '')   // mesma razão do load() acima (D1)
      showFlash(lang === 'en' ? '✓ Build loaded!' : '✓ Build carregada!')
```

## Edicao 10 — `meta/CHANGELOG.md` · quatro correcoes em `[Não lançado]`

**Ancora** (linha inteira, em `[Não lançado]` → `### Corrigido`):

```
- Os ícones usavam caminho absoluto (`/icons/...`) e sumiriam em qualquer site servido fora da raiz, como o GitHub Pages (`/got-legends/`). Agora seguem o caminho-base do build (DEC-037).
```

**Substituir por:**

```
- Os ícones usavam caminho absoluto (`/icons/...`) e sumiriam em qualquer site servido fora da raiz, como o GitHub Pages (`/got-legends/`). Agora seguem o caminho-base do build (DEC-037).
- **Carregar uma build salva, ou colar um código, agora põe o nome dela no campo de nome.** Antes o campo guardava o nome da build anterior, e o Salvar seguinte gravava a build carregada por cima daquela, sem aviso (DEC-038).
- **Build sem equipamentos ou sem técnicas é recusada ao abrir**, com o aviso de erro, em vez de derrubar a tela (DEC-038).
- **Importar `.json` valida cada build antes de gravar:** as inválidas ficam de fora e o aviso diz quantas; arquivo sem nenhuma válida não muda os salvos (DEC-038).
- **Se o navegador não deixar gravar** (armazenamento cheio ou bloqueado), Salvar, Importar e Apagar tudo mostram o erro em vez de ✓, e a lista na tela continua igual à gravada (DEC-038).
```

## Edicao 11 — `meta/DECISIONS.md` · DEC-038

**Ancora** (ultima linha do arquivo):

```
- Se o passo de deploy falhar com 403: Settings → Actions → General → Workflow permissions.
```

**Substituir por:**

```
- Se o passo de deploy falhar com 403: Settings → Actions → General → Workflow permissions.

---

## DEC-038 — Entrada e saída de builds: um validador para todas as portas, e o pacote em três fatias

**Data:** 2026-11-17 · **Status:** aceita · **Aplicada em parte pela** `wo0036` (Fatia 0) · **Análise:** `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md`

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
```

## Edicao 12a — `meta/IDEAS.md` · URL: status

**Ancora** (linha inteira):

```
### 2026-06 — URL compartilhável com build encodada
```

**Substituir por:**

```
### 2026-06 — URL compartilhável com build encodada
**Status (2026-11-17):** aprovada na DEC-038, Fatia 2 — no fragmento (`#b=`), não na query string, e comprimida.
```

## Edicao 12b — `meta/IDEAS.md` · QR: status

**Ancora** (linha inteira):

```
### 2026-06 — Exportar build como link QR Code
```

**Substituir por:**

```
### 2026-06 — Exportar build como link QR Code
**Status (2026-11-17):** adiada com gatilho (DEC-038; ver «🛌 Adiadas»).
```

## Edicao 12c — `meta/IDEAS.md` · arrastar `.json`: status

**Ancora** (linha inteira):

```
### 2026-11 — Importar build arrastando um `.json` para a tela
```

**Substituir por:**

```
### 2026-11 — Importar build arrastando um `.json` para a tela
**Status (2026-11-17):** aprovada na DEC-038, Fatia 1. Importar não abre nada por padrão — responde à pergunta em aberto do dono abaixo. A frase «todas passam pela mesma validação» era premissa e era falsa para o arquivo (análise, M1); a Fatia 0 a tornou verdadeira.
```

## Edicao 12d — `meta/IDEAS.md` · exportar escolhidas: status

**Ancora** (linha inteira):

```
### 2026-11 — Exportar só as builds escolhidas
```

**Substituir por:**

```
### 2026-11 — Exportar só as builds escolhidas
**Status (2026-11-17):** aprovada na DEC-038, Fatia 1 — o mesmo componente de lista da importação.
```

## Edicao 12e — `meta/IDEAS.md` · filtrar/ordenar/agrupar: status

**Ancora** (linha inteira):

```
### 2026-11 — Filtrar, ordenar e agrupar as builds salvas
```

**Substituir por:**

```
### 2026-11 — Filtrar, ordenar e agrupar as builds salvas
**Status (2026-11-17):** barrada em parte na DEC-038. Filtros e agrupamento: «🚫 Descartadas». Ordenar por edição **já é a ordem atual** — o `createdAt` é regravado a cada Salvar, então o `updatedAt` não é necessário. Busca por nome: «🛌 Adiadas».
```

## Edicao 12f — `meta/IDEAS.md` · «🛌 Adiadas» ganha os dois primeiros itens

**Ancora** (linha inteira):

```
- _(nenhuma ainda — seção adotada do template v1.142.0 em 2026-11-15)_
```

**Substituir por:**

```
- **QR Code do link** («Exportar build como link QR Code», 2026-06) — **gatilho:** o link da Fatia 2 no ar **e** alguém pedir para passar build do PC para o celular. Precisa de biblioteca: não há API nativa de QR. DEC-038.
- **Busca por nome nos salvos** (de «Filtrar, ordenar e agrupar», 2026-11) — **gatilho:** relato de uma lista de salvos em que não se acha mais a build. Um campo só, visível a partir de ~12 salvos (estimativa: o que cabe na gaveta sem rolar). DEC-038.
```

## Edicao 12g — `meta/IDEAS.md` · «🚫 Descartadas» ganha dois itens

**Ancora** (linha inteira, ultimo item da secao):

```
- **Barra de HP mostrando os 100 HP base** — descartado; ficava com aspecto de "barra cheia pré-preenchida" o tempo todo. Só bônus é mostrado.
```

**Substituir por:**

```
- **Barra de HP mostrando os 100 HP base** — descartado; ficava com aspecto de "barra cheia pré-preenchida" o tempo todo. Só bônus é mostrado.
- **Link curto para a build** — barrado na DEC-038: exige serviço externo num projeto sem backend, o link passaria a depender da vida de um terceiro, e a build iria para um servidor alheio. Com a compressão (~530 caracteres), o ganho não paga.
- **Filtros por classe, equipamento e vantagem, e agrupamento dos salvos** — barrados na DEC-038: resolvem problema de catálogo, não de uma lista pessoal; a cor e o ícone da classe já agrupam; cada controle custa altura numa gaveta de 300 px.
```

## Edicao 13a — `meta/ROADMAP.md` · F4: a URL decidida

**Ancora** (linha inteira, em F4):

```
- URL compartilhável com build encodada na query string (`?b=eyJ...`)
```

**Substituir por:**

```
- URL compartilhável com a build comprimida no fragmento (`#b=`) — **aprovada na DEC-038 (Fatia 2)**; a query string (`?b=`) foi descartada na análise de 2026-11-16
```

## Edicao 13b — `meta/ROADMAP.md` · F5: QR adiado

**Ancora** (linha inteira, em F5):

```
- QR Code de link compartilhável
```

**Substituir por:**

```
- QR Code de link compartilhável — **adiado com gatilho** (DEC-038; `IDEAS.md`, «🛌 Adiadas»)
```

---

## Fora de escopo

- **O ✓ falso do botão Texto** (`handleCopyText`: o `.catch` tambem chama `flash('txt')`) — esta no backlog do STATUS, e outro defeito; nao entra aqui.
- Aviso de id desconhecido em `data.js` (Fatia 2), mensagens de erro bilingues de `deserializeBuild` (Fatia 1), modal, arrasto, link.
- `remove` (o ✕ do chip) continua chamando `persist` sem checar o retorno: nao mostra aviso de sucesso, entao nao ha ✓ falso a evitar.
- STATUS e log do dia: do `/wrap`.

## Armadilhas desta WO

- **`src/*.jsx`, `src/*.js` e `meta/*.md` estao em CRLF na arvore de trabalho** (`git ls-files --eol`: `i/lf w/crlf`). Toda ancora desta WO e de **uma linha so**, para o fim de linha nao morder; o texto novo de varias linhas entra no lugar dela. Use a ferramenta de edicao, nao `sed` com `\n`.
- **Indentacao distingue ancoras quase iguais:** `    localStorage.setItem(…)` (4 espacos, a que a 3b remove) × `      localStorage.setItem(…)` (6, a que a 3a insere); `    a.click()` (4, `exportAll`) × `        a.click()` (8, `generateBuildImage`). Case a linha INTEIRA.
- **`showFlash` e declarado depois de `persist`** no `SaveDrawer`. Nao e erro: `persist` so roda depois do corpo do componente ter executado. Nao mova as funcoes.

---

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git diff --stat` mostra **exatamente** `src/logic.js`, `src/App.jsx`, `meta/CHANGELOG.md`, `meta/DECISIONS.md`, `meta/IDEAS.md`, `meta/ROADMAP.md` — mais os tres arquivos novos (as duas analises e esta WO) em `git status`. **Nao responde:** se a mudanca esta certa.
2. **Quem roda:** quem aplica. `npm run build` → **0 erros**. Se acusar erro, **PARE e reporte antes de commitar**. **Nao responde:** se a tela se comporta como deve.
3. **Quem roda:** quem aplica. Contagens (unidade: LINHAS; `tr -d '\r'` antes, por causa do CRLF):
   - `tr -d '\r' < src/logic.js | grep -c "hasBuildShape"` → **2** (a definicao `function hasBuildShape(build) {` e a chamada em `deserializeBuild`).
   - `tr -d '\r' < src/App.jsx | grep -c "^    localStorage.setItem"` → **0** (a de 4 espacos saiu) e `tr -d '\r' < src/App.jsx | grep -c "^      localStorage.setItem(STORAGE_KEY"` → **1**.
   - `tr -d '\r' < src/App.jsx | grep -c "URL.revokeObjectURL"` → **2** (era 1).
   - `tr -d '\r' < src/App.jsx | grep -c "setBuildName(entry.name\|setBuildName(r.name"` → **2**.
   - `tr -d '\r' < src/App.jsx | grep -c "if (!persist("` → **3**.
   - `tr -d '\r' < meta/DECISIONS.md | grep -c "^## DEC-038"` → **1**; `tr -d '\r' < meta/IDEAS.md | grep -c "^\*\*Status (2026-11-17):\*\*"` → **5**.
   **Nao responde:** se o texto esta no lugar certo dentro da funcao — isso e o passo 4.
4. **Quem roda:** quem aplica. Prova de vida do validador, no Node do Git Bash, na raiz do repo (`node` 22 importa ESM de `.js` sem `"type": "module"`, com aviso — **nao testado no Windows**; se o import falhar por isso, relate e siga, o passo 5 cobre):
   ```
   node -e "import('./src/logic.js').then(L=>{const ok=L.deserializeBuild({game:'got-legends',build:L.createEmptyBuild('ronin')}).ok;const b=L.createEmptyBuild('ronin');delete b.gear;const no=L.deserializeBuild({game:'got-legends',build:b}).ok;let r=0;for(let i=0;i<200;i++)if(!L.deserializeBuild({game:'got-legends',build:L.randomBuild(L.createEmptyBuild('samurai'))}).ok)r++;console.log('vazia',ok,'sem_gear',no,'aleatorias_recusadas',r)})"
   ```
   Esperado: `vazia true sem_gear false aleatorias_recusadas 0`. Relate a linha crua. **Chega no ramo?** Sim: chama `deserializeBuild`, que chama `hasBuildShape`. **Prova de vida:** `sem_gear` precisa dar `false` — antes desta WO dava `true` (medido pelo chat em 2026-11-16).
5. **Quem roda:** o dono, na tela — roteiro entregue pelo chat no mesmo turno desta WO. Quem aplica nao faz conferencia visual.

## Relatorio de aplicacao

Os campos da skill `apply-wo`, com a saida crua dos passos 1–4. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add src/logic.js src/App.jsx meta/CHANGELOG.md meta/DECISIONS.md meta/IDEAS.md meta/ROADMAP.md meta/analises/_TEMPLATE.md meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md meta/workorders/261117-wo0036-fatia0-validacao-de-entrada.md
```

```
git commit -m "fix(saves): valida toda build que entra e leva o nome junto ao carregar" -m "Fatia 0 da analise de entrada e saida de builds (DEC-038). deserializeBuild exige os cinco slots com p1/p2 e techs; importar .json passa por ele; carregar salvo ou codigo atualiza o nome, que antes fazia o Salvar seguinte sobrescrever outra build; persist avisa quando o navegador nao grava; exportAll libera o objectURL. Versiona a analise e o molde de meta/analises/."
```

```
git push
```
