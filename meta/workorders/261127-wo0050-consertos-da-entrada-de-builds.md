# wo0050 — Conserta a entrada de builds (C1, C2, C5) e o logo no GitHub Pages

**Data:** 2026-11-27 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de CODIGO (`src/logic.js`, `src/App.jsx`, `src/icons.js`) + registro (`meta/STATUS.md`, `meta/DECISIONS.md`, `meta/CHANGELOG.md`, `logs/2026-11-27.md`). **Build:** SIM, `npm run build` antes do commit.
**Config sugerida:** Sonnet, `/effort` medio (o diff e exato e ja foi simulado).
**Pre-requisito:** `main` @ `e0dacba` = `origin/main`, arvore limpa (fora esta WO).
**Base:** respostas do dono em 2026-11-27 17:3x: janela do teste «Normal, sem saves lá»; C1 «Guardar cópia e seguir»; C2 «Prender à faixa»; C5 «Não pode». Relatorio `../261127-1645-…-apply-wo0049.txt` e as duas capturas `../Captura de tela 2026-11-27 1729*.png`, lidos pelo chat.
**Depende de:** `wo0049` (`e0dacba`).
**Revisada em 2026-11-28:** a primeira entrega foi recusada pelo `/apply-wo` (relatorio `../261127-2111-…-apply-wo0050.txt`) por nao trazer o campo «Ancoras lidas em». Esta versao traz o campo; o roteiro rodado no site sem o conserto reproduziu o C1 e o C2, e as Ed. 16, 17 e 19 registram isso.

> **Ancoras lidas em:** 2026-11-28, neste turno, do disco em `e0dacba` (arvore limpa fora esta WO), linhas inteiras comparadas sem `\r`, cada ancora com **1** ocorrencia como bloco contiguo. Por edicao, o arquivo e a primeira linha do trecho lido:
> - Ed. 1 — `src/logic.js`, 2 linha(s), contendo: ` * Serializa um build para JSON (para salvar/exportar).`
> - Ed. 2 — `src/logic.js`, 1 linha(s), contendo: ` * @returns {{ ok: boolean, build?: Object, error?: string, code?: string }}`
> - Ed. 3 — `src/logic.js`, 1 linha(s), contendo: `  return { ok: true, build: normalizeLegendaryProps(saved.build) };`
> - Ed. 4 — `src/logic.js`, 1 linha(s), contendo: `    return { ok: true, name: json.name, build: result.build };`
> - Ed. 5 — `src/logic.js`, 1 linha(s), contendo: ` * @returns {Promise<{ ok: boolean, build?: Object, name?: string, dropped?: number, er…`
> - Ed. 6 — `src/logic.js`, 1 linha(s), contendo: `      res = r.ok ? { ok: true, build: r.build, name: typeof payload.n === 'string' ? pa…`
> - Ed. 7 — `src/App.jsx`, 17 linha(s), contendo: `const STORAGE_KEY = 'gotlegends_v1_builds'`
> - Ed. 8 — `src/App.jsx`, 2 linha(s), contendo: `  return { saves, writeSaves }`
> - Ed. 9 — `src/App.jsx`, 1 linha(s), contendo: `  const { saves, writeSaves } = useSavedBuilds()`
> - Ed. 10 — `src/App.jsx`, 5 linha(s), contendo: `  const showToast = (msg, action = null, ms = 3500) => {`
> - Ed. 11 — `src/App.jsx`, 1 linha(s), contendo: `      onOpenBuild(r.build, entry.name || '')`
> - Ed. 12 — `src/App.jsx`, 5 linha(s), contendo: `    const note = !r.dropped ? ''`
> - Ed. 13 — `src/icons.js`, 3 linha(s), contendo: `// Se tiver PNG: '/icons/logo/tsushima_logo.png'`
> - Ed. 14 — `meta/STATUS.md`, 1 linha(s), contendo: `- [ ] **C1 — saves do navegador lidos sem validação (provável tela quebrada)** ʼ[hipóte…`
> - Ed. 15 — `meta/STATUS.md`, 3 linha(s), contendo: `- [ ] **C2 — valor de propriedade fora da faixa passa ao abrir uma build** ʼ[medido pel…`
> - Ed. 16 — `meta/STATUS.md`, 1 linha(s), contendo: `**Pendente:** conferir o C1 numa janela anônima; decidir o C2 (descartar ou prender à f…`
> - Ed. 17 — `meta/DECISIONS.md`, 1 linha(s), contendo: `- Uma build aberta por código com o nome de uma salva conta como «a build aberta»: salv…`
> - Ed. 18 — `meta/CHANGELOG.md`, 1 linha(s), contendo: `- **Os botões Texto e Imagem mostram ✗ quando falham.** Antes mostravam ✓ mesmo quando …`
> - Ed. 19 — `logs/2026-11-27.md`, 1 linha(s), contendo: `DECISIONS dividido; candidatos da ʼ/sondarʼ no backlog. Próximo: confirmar o C1 (saves …`
>
> **Simulada pelo chat** numa copia do repositorio em `e0dacba`: as 19 edicoes casaram em ordem, cada ancora com **1** ocorrencia (linhas inteiras, comparadas sem `\r`); `npm run build` verde (33 modulos); prova de vida no Node (13 de 13); build com `VITE_BASE_URL=/got-legends/` monta o logo com o caminho-base.
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. As ancoras de varias linhas sao um bloco contiguo. **Idempotencia pelos dois lados:** texto novo presente **e** ancora fora; nas Ed. 1, 16, 17, 18 e 19 o texto novo COMECA ou TERMINA pela ancora — ali confira que a ancora aparece **uma** vez, seguida (ou precedida) do texto novo.
>
> **Canal dos meta neste ciclo = CODE** (esta WO). **Ela faz o papel do fecho: NAO rode `/wrap` depois dela.**
>
> **Proximo comando:** nenhum. Depois do push, o dono faz o roteiro de tela (Ed. 19, no log).

---

## 1. Por que

- **C1:** salvos do navegador que nao sao uma lista (`null`, `{}`, texto quebrado) derrubam a tela ao abrir a gaveta: `saves.length`/`saves.map` sem guarda, sem `ErrorBoundary`. O teste do dono «abriu normal» porque a gaveta fechada nao renderiza (`if (!open) return null` em `SaveDrawer`).
- **C2/C5:** `deserializeBuild` aceita valor fora da faixa, `NaN`, texto e P2 com a mesma estatistica do P1. Conserto num lugar so (`clampPropValues`), que as quatro portas ja atravessam.
- **Logo:** `LOGO_URL` era o unico caminho de icone sem o caminho-base (DEC-037); 404 no GitHub Pages, visto nas capturas.


## Edicao 1 — `src/logic.js` · clampPropValues, antes de serializeBuild

**Ancora:**

````
/**
 * Serializa um build para JSON (para salvar/exportar).
````

**Substituir por:**

````
// Folga para comparar com os limites da faixa: valor gravado pelos steppers
// pode chegar com resíduo de ponto flutuante (0.12000000000000001) e não
// deve contar como ajuste.
const RANGE_EPS = 1e-9;

/**
 * Conserta, na leitura, as propriedades de uma build vinda de fora — salvo,
 * arquivo, código ou link (DEC-041). Número fora da faixa do item vira o mínimo
 * ou o máximo; o que não é número finito deixa a propriedade vazia; P2 com a
 * mesma estatística (`sk`) do P1 fica vazia, porque o jogo não permite e o
 * cálculo somaria as duas. Item ou propriedade que o data.js não tem não é
 * conferido aqui (C3/C4 do backlog). O item Magistral já chega no máximo por
 * normalizeLegendaryProps.
 * @param {Object} build  build com a forma mínima (hasBuildShape)
 * @returns {{ build: Object, fixed: number }}  fixed = propriedades ajustadas
 */
export function clampPropValues(build) {
  let fixed = 0;
  const gear = {};
  for (const [slotName, slot] of Object.entries(build.gear)) {
    gear[slotName] = slot;
    if (!slot.itemId) continue;
    // Amuleto com classBinding: as propriedades de classe só existem no item efetivo
    const item = slotName === 'charm'
      ? getEffectiveCharm(slot.itemId, slot.linkedClass)
      : getItem(slot.itemId);
    if (!item) continue;

    let next = slot;
    let p1Sk = null;
    for (const ps of ['p1', 'p2']) {
      const { propId, value } = next[ps];
      if (!propId) continue;
      const def = item.props.find(p => p.id === propId);
      if (!def) continue;
      let v = value;
      if (typeof v !== 'number' || !Number.isFinite(v)) v = null;
      else if (v < def.mn - RANGE_EPS) v = def.mn;
      else if (v > def.mx + RANGE_EPS) v = def.mx;
      if (v === null || (ps === 'p2' && def.sk === p1Sk)) {
        next = { ...next, [ps]: { propId: null, value: 0 } };
        fixed++;
        continue;
      }
      if (ps === 'p1') p1Sk = def.sk;
      if (v !== value) {
        next = { ...next, [ps]: { propId, value: v } };
        fixed++;
      }
    }
    gear[slotName] = next;
  }
  return fixed ? { build: { ...build, gear }, fixed } : { build, fixed: 0 };
}

/**
 * Serializa um build para JSON (para salvar/exportar).
````

## Edicao 2 — `src/logic.js` · deserializeBuild devolve fixed (doc)

**Ancora:**

````
 * @returns {{ ok: boolean, build?: Object, error?: string, code?: string }}
````

**Substituir por:**

````
 * @returns {{ ok: boolean, build?: Object, fixed?: number, error?: string, code?: string }}
 *   fixed: propriedades ajustadas por clampPropValues (DEC-041), para quem abre avisar.
````

## Edicao 3 — `src/logic.js` · deserializeBuild passa por clampPropValues

**Ancora:**

````
  return { ok: true, build: normalizeLegendaryProps(saved.build) };
````

**Substituir por:**

````
  const { build, fixed } = clampPropValues(normalizeLegendaryProps(saved.build));
  return { ok: true, build, fixed };
````

## Edicao 4 — `src/logic.js` · decodeBuild repassa fixed

**Ancora:**

````
    return { ok: true, name: json.name, build: result.build };
````

**Substituir por:**

````
    return { ok: true, name: json.name, build: result.build, fixed: result.fixed };
````

## Edicao 5 — `src/logic.js` · decodeBuildLink devolve fixed (doc)

**Ancora:**

````
 * @returns {Promise<{ ok: boolean, build?: Object, name?: string, dropped?: number, error?: string, code?: string }>}
````

**Substituir por:**

````
 * @returns {Promise<{ ok: boolean, build?: Object, name?: string, dropped?: number, fixed?: number, error?: string, code?: string }>}
````

## Edicao 6 — `src/logic.js` · decodeBuildLink repassa fixed (link novo)

**Ancora:**

````
      res = r.ok ? { ok: true, build: r.build, name: typeof payload.n === 'string' ? payload.n : '' } : r;
````

**Substituir por:**

````
      res = r.ok ? { ok: true, build: r.build, name: typeof payload.n === 'string' ? payload.n : '', fixed: r.fixed } : r;
````

## Edicao 7 — `src/App.jsx` · useSavedBuilds le com validacao e guarda copia

**Ancora:**

````
const STORAGE_KEY = 'gotlegends_v1_builds'

/**
 * Lista de builds salvas e a gravação dela no localStorage.
 * @returns {{ saves: Object[], writeSaves: (list: Object[]) => boolean }}
 *   writeSaves grava primeiro e só então atualiza a lista; devolve false se o
 *   navegador recusar (cota cheia, armazenamento bloqueado). Quem chama avisa.
 */
function useSavedBuilds() {
  const [saves, setSaves] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSaves(JSON.parse(raw))
    } catch {}
  }, [])
````

**Substituir por:**

````
const STORAGE_KEY = 'gotlegends_v1_builds'
// Cópia do conteúdo ilegível, para não perder nada quando o próximo Salvar
// gravar a lista nova por cima (DEC-041).
const STORAGE_BACKUP_KEY = 'gotlegends_v1_builds_backup'

/**
 * Lê a lista de salvos gravada. A gaveta e o modal usam `saves.length` e
 * `saves.map` sem conferir: um valor que não seja lista (`null`, `{}`, texto
 * quebrado) derrubava a tela ao abrir a gaveta (C1 da /sondar de 2026-11-27).
 * Entrada que não é objeto sai da lista; build inválida segue listada e é
 * recusada ao abrir, como antes (deserializeBuild).
 * @param {string} raw  o texto do localStorage
 * @returns {Object[]|null}  null se o texto não é JSON de uma lista
 */
function readSaves(raw) {
  let parsed
  try { parsed = JSON.parse(raw) } catch { return null }
  if (!Array.isArray(parsed)) return null
  return parsed.filter(s => s !== null && typeof s === 'object' && !Array.isArray(s))
}

/**
 * Lista de builds salvas e a gravação dela no localStorage.
 * @returns {{ saves: Object[], writeSaves: (list: Object[]) => boolean, corrupt: boolean }}
 *   writeSaves grava primeiro e só então atualiza a lista; devolve false se o
 *   navegador recusar (cota cheia, armazenamento bloqueado). Quem chama avisa.
 *   corrupt: o gravado era ilegível; a lista começa vazia e uma cópia foi para
 *   STORAGE_BACKUP_KEY. Quem chama avisa.
 */
function useSavedBuilds() {
  const [saves, setSaves] = useState([])
  const [corrupt, setCorrupt] = useState(false)

  useEffect(() => {
    let raw = null
    try { raw = localStorage.getItem(STORAGE_KEY) } catch { return }
    if (!raw) return
    const list = readSaves(raw)
    if (list) {
      setSaves(list)
      return
    }
    try { localStorage.setItem(STORAGE_BACKUP_KEY, raw) } catch {}
    setCorrupt(true)
  }, [])
````

## Edicao 8 — `src/App.jsx` · useSavedBuilds devolve corrupt; fixedNote

**Ancora:**

````
  return { saves, writeSaves }
}
````

**Substituir por:**

````
  return { saves, writeSaves, corrupt }
}

/**
 * Aviso de propriedades ajustadas ao abrir uma build (DEC-041), para o rodapé.
 * @param {number} fixed  contagem de clampPropValues
 * @param {string} lang
 * @returns {string}  vazio quando nada mudou
 */
function fixedNote(fixed, lang) {
  if (!fixed) return ''
  const en = lang === 'en'
  if (fixed === 1) {
    return en ? '1 property was out of the item\'s range and was adjusted'
      : '1 propriedade estava fora da faixa do item e foi ajustada'
  }
  return en ? `${fixed} properties were out of the item's range and were adjusted`
    : `${fixed} propriedades estavam fora da faixa do item e foram ajustadas`
}
````

## Edicao 9 — `src/App.jsx` · App recebe corrupt

**Ancora:**

````
  const { saves, writeSaves } = useSavedBuilds()
````

**Substituir por:**

````
  const { saves, writeSaves, corrupt } = useSavedBuilds()
````

## Edicao 10 — `src/App.jsx` · aviso dos salvos ilegiveis, depois de showToast

**Ancora:**

````
  const showToast = (msg, action = null, ms = 3500) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, action })
    toastTimer.current = setTimeout(() => setToast(null), ms)
  }
````

**Substituir por:**

````
  const showToast = (msg, action = null, ms = 3500) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, action })
    toastTimer.current = setTimeout(() => setToast(null), ms)
  }

  // Salvos ilegíveis (DEC-041): a lista começa vazia, e o aviso diz onde ficou a cópia
  useEffect(() => {
    if (!corrupt) return
    showToast(tl(
      `✗ Os salvos deste navegador estavam ilegíveis. Uma cópia ficou em ${STORAGE_BACKUP_KEY}`,
      `✗ The saved builds in this browser were unreadable. A copy was kept in ${STORAGE_BACKUP_KEY}`,
    ), null, 10000)
  }, [corrupt])
````

## Edicao 11 — `src/App.jsx` · abrir um salvo avisa o ajuste

**Ancora:**

````
      onOpenBuild(r.build, entry.name || '')
````

**Substituir por:**

````
      onOpenBuild(r.build, entry.name || '', fixedNote(r.fixed, lang))
````

## Edicao 12 — `src/App.jsx` · abrir link ou codigo avisa o ajuste

**Ancora:**

````
    const note = !r.dropped ? ''
      : r.dropped === 1
        ? tl('1 item desta build não existe mais e ficou vazio', '1 item of this build no longer exists and was cleared')
        : tl(`${r.dropped} itens desta build não existem mais e ficaram vazios`, `${r.dropped} items of this build no longer exist and were cleared`)
    requestOpen(r.build, r.name || '', note)
````

**Substituir por:**

````
    const droppedNote = !r.dropped ? ''
      : r.dropped === 1
        ? tl('1 item desta build não existe mais e ficou vazio', '1 item of this build no longer exists and was cleared')
        : tl(`${r.dropped} itens desta build não existem mais e ficaram vazios`, `${r.dropped} items of this build no longer exist and were cleared`)
    const note = [droppedNote, fixedNote(r.fixed, lang)].filter(Boolean).join(' · ')
    requestOpen(r.build, r.name || '', note)
````

## Edicao 13 — `src/icons.js` · logo segue o caminho-base

**Ancora:**

````
// Se tiver PNG: '/icons/logo/tsushima_logo.png'
// Se tiver SVG: '/icons/logo/tsushima_logo.svg'
export const LOGO_URL = '/icons/logo/tsushima_logo.png'
````

**Substituir por:**

````
// Segue o caminho-base, como os outros ícones (DEC-037): fixo em '/icons/...',
// o logo da aba da gaveta dava 404 no GitHub Pages (visto em 2026-11-27).
export const LOGO_URL = `${BASE}icons/logo/tsushima_logo.png`
````

## Edicao 14 — `meta/STATUS.md` · backlog: C1 sai; entra a conferencia de tela

**Ancora:**

````
- [ ] **C1 — saves do navegador lidos sem validação (provável tela quebrada)** `[hipótese do Code, /sondar de 2026-11-27, pela leitura do código; não reproduzida no navegador]`: `useSavedBuilds` faz `setSaves(JSON.parse(raw))` sem conferir que é uma lista de builds. Um valor como `null`, `{}` ou `[null]` na chave `gotlegends_v1_builds` faria `saves.length`/`saves.map` lançar erro no render, e não há `ErrorBoundary`: a tela inteira cairia. Conferir antes de consertar, **numa janela anônima** (o teste troca os saves).
````

**Substituir por:**

````
- [ ] **Conferência de tela da `wo0050`** (C1, C2, C5 e o logo no GitHub Pages, DEC-041): roteiro em `logs/2026-11-27.md`, «Roteiro de tela da wo0050». Só depois do deploy do push.
````

## Edicao 15 — `meta/STATUS.md` · backlog: C2 e C5 saem; C3/C4 fica

**Ancora:**

````
- [ ] **C2 — valor de propriedade fora da faixa passa ao abrir uma build** `[medido pelo Code, fuzz em Node, /sondar de 2026-11-27]`: em item não Magistral, `deserializeBuild` aceita `'abc'` (o dano vira `NaN`), `1e9`, `-500` e `'5'` (texto). Decisão do dono: descartar a propriedade com aviso, ou prender o valor à faixa mínima–máxima do item.
- [ ] **C3/C4 — só o link limpa id que não existe** `[medido pelo Code, /sondar de 2026-11-27]`: `dropUnknownIds` roda só em `decodeBuildLink`; o salvo e o `.json` importado não passam por ele. E ele não confere `ronin_breath`, `perk1`/`perk2`, `propId` nem `linkedClass`.
- [ ] **C5 — a mesma estatística em P1 e P2 do mesmo item é aceita na entrada** `[medido pelo Code, fuzz, /sondar de 2026-11-27]` (o dano dobra); o gerador 🎲 impede isso. Confirmar com o dono se o jogo permite.
````

**Substituir por:**

````
- [ ] **C3/C4 — só o link limpa id que não existe** `[medido pelo Code, /sondar de 2026-11-27]`: `dropUnknownIds` roda só em `decodeBuildLink`; o salvo e o `.json` importado não passam por ele. E ele não confere `ronin_breath`, `perk1`/`perk2`, `propId` nem `linkedClass`.
````

## Edicao 16 — `meta/STATUS.md` · Ultima Sessao: entrada da wo0050

**Ancora:**

````
**Pendente:** conferir o C1 numa janela anônima; decidir o C2 (descartar ou prender à faixa) e responder o C5.
````

**Substituir por:**

````
**Pendente:** conferir o C1 numa janela anônima; decidir o C2 (descartar ou prender à faixa) e responder o C5.

### 2026-11-27 — C1, C2 e C5 consertados na entrada; logo no GitHub Pages (wo0050, DEC-041)

- **Teste do C1 pelo dono:** «abriu normal» `[relatado pelo dono, com duas capturas]`. Não refuta o C1: a gaveta não renderiza fechada (`if (!open) return null` no `SaveDrawer`), e o roteiro do chat não mandou abri-la — falha do roteiro. As capturas mostram a janela normal, não a anônima; o dono confirmou que não havia saves no `arlsnech.github.io` nesse navegador `[relatado pelo dono]`. Em 2026-11-28 o roteiro rodou no site ainda sem o conserto (a primeira tentativa de aplicar a `wo0050` foi recusada pelo `/apply-wo`) e reproduziu o C1 — tela branca ao abrir a gaveta — e o C2 — +100000000000% no dano `[capturas do dono]`.
- **Decisões do dono** `[relatado pelo dono, 2026-11-27]`: C1 guarda cópia do ilegível e segue; C2 prende o valor à faixa (o que não é número fica vazio); C5 — o jogo não permite, o P2 repetido sai. Registradas na DEC-041.
- **Achado das capturas:** o logo da aba da gaveta dava 404 no GitHub Pages — `LOGO_URL` era o único caminho de ícone sem o caminho-base da DEC-037.
- `src/logic.js` (`clampPropValues`, chamado por `deserializeBuild`), `src/App.jsx` (`readSaves`, cópia em `gotlegends_v1_builds_backup`, avisos ao abrir) e `src/icons.js` (`LOGO_URL`).

**Pendente:** conferência de tela pelo dono (backlog).
````

## Edicao 17 — `meta/DECISIONS.md` · DEC-041 no fim

**Ancora:**

````
- Uma build aberta por código com o nome de uma salva conta como «a build aberta»: salvar por cima é direto.
````

**Substituir por:**

````
- Uma build aberta por código com o nome de uma salva conta como «a build aberta»: salvar por cima é direto.

---

## DEC-041 — A build que entra é consertada na leitura: faixa da propriedade, P2 repetido e salvos ilegíveis

**Data:** 2026-11-27 · **Status:** aceita · **Aplicada pela** `wo0050`

### Contexto
A `/sondar` das quatro entradas de dado (2026-11-27) devolveu, entre outros, três candidatos que mexem no que a pessoa vê. **C1:** os salvos do navegador eram lidos com `setSaves(JSON.parse(raw))`, sem conferir que eram uma lista; a gaveta e o modal usam `saves.length` e `saves.map`, e não há `ErrorBoundary`. **C2:** em item não Magistral, `deserializeBuild` aceitava valor de propriedade fora da faixa, `NaN` e texto — no fuzz, `'abc'` virou `NaN` no dano. **C5:** a mesma estatística em P1 e P2 do mesmo item passava na entrada, e o dano dobrava; o gerador 🎲 já impedia.

O teste do C1 pelo dono «abriu normal» `[relatado pelo dono]` porque a gaveta não é renderizada fechada (`if (!open) return null`): a tela cairia ao abri-la, não ao carregar a página. O C1 ficou confirmado pela leitura do código e, em 2026-11-28, na tela: com o site ainda sem o conserto (a `wo0050` tinha sido recusada pelo `/apply-wo`), abrir a gaveta deu tela branca e `TypeError: Cannot read properties of null (reading 'length')` no console `[captura do dono]`. O link de teste do C2 abriu, no mesmo site, com Dano Corpo a Corpo em +100000000000% `[captura do dono]`.

### Decisão
Escolhas do dono em 2026-11-27 `[relatado pelo dono]`:
- **C1 — guardar cópia e seguir.** `readSaves` aceita só uma lista JSON e tira dela o que não é objeto. Se o gravado não é uma lista, a lista começa vazia, o texto vai para `gotlegends_v1_builds_backup` e um aviso diz isso. O próximo Salvar grava por cima do ilegível, mas a cópia fica.
- **C2 — prender à faixa.** `clampPropValues`, chamado por `deserializeBuild`: número fora da faixa vira o mínimo ou o máximo do item (com folga de `1e-9` para resíduo de ponto flutuante); o que não é número finito deixa a propriedade vazia.
- **C5 — o jogo não permite** a mesma estatística (`sk`) em P1 e P2: o P2 repetido fica vazio.
- Como tudo passa por `deserializeBuild`, as quatro portas — salvo, `.json`, código antigo e link — recebem o conserto. Abrir um salvo e abrir um link ou código avisam no rodapé quantas propriedades foram ajustadas.

### Alternativas consideradas
- **C1, só ignorar** o gravado ilegível: o primeiro Salvar apagaria o conteúdo sem deixar cópia.
- **C2, descartar com aviso** em vez de prender: perderia uma propriedade que só precisava voltar à faixa.

### Consequências
- A importação de `.json` também ajusta, mas **sem aviso**: o modal lista as builds, não as abre. «Importar e abrir» também não avisa.
- Medido na simulação `[medido pelo chat, Node]`: 800 builds de `randomBuild` passam sem nenhum ajuste; as 420 propriedades de classe dos amuletos com `classBinding`, no máximo, também; o link de exemplo do README abre com 0 ajustes.
- Item ou propriedade que o `data.js` não tem continua fora deste conserto (C3/C4 do backlog).
````

## Edicao 18 — `meta/CHANGELOG.md` · Corrigido do [Nao lancado]

**Ancora:**

````
- **Os botões Texto e Imagem mostram ✗ quando falham.** Antes mostravam ✓ mesmo quando a cópia ou a geração da imagem falhava, e quem colava levava o texto anterior sem saber.
````

**Substituir por:**

````
- **Os botões Texto e Imagem mostram ✗ quando falham.** Antes mostravam ✓ mesmo quando a cópia ou a geração da imagem falhava, e quem colava levava o texto anterior sem saber.
- **Salvos ilegíveis no navegador não derrubam mais a tela ao abrir a gaveta** (DEC-041). A lista começa vazia, uma cópia do conteúdo fica em `gotlegends_v1_builds_backup` e um aviso diz isso.
- **Valor de propriedade fora da faixa, ao abrir uma build, volta à faixa do item** (DEC-041); o que não é número fica vazio, e a mesma estatística em P1 e P2 do mesmo item deixa o P2 vazio. Abrir um salvo, um código ou um link avisa quantas propriedades foram ajustadas.
- **O logo da aba da gaveta aparece no GitHub Pages.** Era o único ícone sem o caminho-base (DEC-037) e dava 404.
````

## Edicao 19 — `logs/2026-11-27.md` · log: roteiro de tela da wo0050

**Ancora:**

````
DECISIONS dividido; candidatos da `/sondar` no backlog. Próximo: confirmar o C1 (saves inválidos derrubam a tela?) numa janela anônima e decidir o C2.
````

**Substituir por:**

````
DECISIONS dividido; candidatos da `/sondar` no backlog. Próximo: confirmar o C1 (saves inválidos derrubam a tela?) numa janela anônima e decidir o C2.

---

## Raia do chat (wo0050, consertos da entrada de builds)

### Feito
- `wo0049` aplicada (`e0dacba`). Teste do C1 «abriu normal» lido nas duas capturas do dono: a gaveta não renderiza fechada, então o teste não chegou ao defeito (falha do roteiro do chat, que não mandou abrir a gaveta). As capturas mostraram também o 404 do logo no GitHub Pages.
- Decisões do dono para C1, C2 e C5 (DEC-041); `wo0050` escrita e simulada numa cópia (13 edições de código casaram, build verde, prova de vida no Node).

### Aprendizados / armadilhas
- **Roteiro de teste precisa levar até o ponto onde o código roda.** Componente que retorna `null` fechado não executa o render que quebraria; «abriu normal» sem abrir a gaveta não diz nada sobre o C1.
- **Captura de tela é evidência de mais de uma coisa:** pedida para o C1, mostrou que a janela não era anônima e um 404 que ninguém procurava.
- **WO sem o campo «Âncoras lidas em» é recusada pelo `/apply-wo`** — e foi: a primeira entrega da `wo0050` saiu sem ele (a `wo0049` tinha). O dono não leu o relatório de recusa, rodou o roteiro no site velho e relatou «2–7 ok»; as capturas mostravam o contrário (tela branca, `TypeError`, +100000000000%). Duas defesas: o gerador de WO do chat põe o campo sempre; e o roteiro de tela começa conferindo que o commit da WO está no GitHub.

### Roteiro de tela da wo0050 (dono, depois do deploy do push)
Fazer no `arlsnech.github.io/got-legends/`, na mesma janela do teste de 2026-11-27 (ali a chave ainda guarda `null`). **Antes de tudo:** confira no GitHub (aba Commits da `main`) que o commit `fix(builds): valida os salvos e prende as propriedades a faixa ao abrir uma build` está lá, e na aba Actions que o workflow dele terminou verde. Sem isso, o roteiro roda no código velho.
1. Recarregar (F5). **Certo:** aviso no rodapé, por ~10 s, «✗ Os salvos deste navegador estavam ilegíveis. Uma cópia ficou em gotlegends_v1_builds_backup». O console não mostra mais o 404 de `tsushima_logo.png`, e a aba lateral mostra o logo.
2. Clicar na aba lateral. **Certo:** a gaveta abre, vazia, sem tela branca.
3. Salvar uma build qualquer pela gaveta e recarregar. **Certo:** a build está na lista e o aviso do passo 1 não volta.
4. No console: `localStorage.getItem('gotlegends_v1_builds_backup')`. **Certo:** `'null'`.
5. Abrir `https://arlsnech.github.io/got-legends/#b=1.vVHBqoMwEPyVx5xDUaEXrz15f3dZ46LBGEMSW0rJv5e0TbGU947mNJkddmaZGwxq_LIP_HOqINChvkFq8r7pUcPTvDpSEKBOaRWuiTWr1gJuMcq0nWMKY-YCy9GnDU1mmg16wSgwMLkkmyiQoYRU4Pnh-KRay8ExQcCWaWzdYh_jnszSSgmBM-mVUZdFflHAVv-Li0NxTDJ2U5lzpU_1TubIDNxvE71UHzGeXF76Zfw9_ttQjuTmvfwEtDIT96dU8KbeVMml3PHq4VLt5hZjvAM` (uma Katana Pétrea com Dano Corpo a Corpo em 1e9 no P1 e repetido no P2). **Certo:** rodapé «Build "Teste C2" aberta — 2 propriedades estavam fora da faixa do item e foram ajustadas»; na Katana, P1 = 12% e P2 vazio.
6. Trocar para EN e repetir o 5. **Certo:** «… — 2 properties were out of the item's range and were adjusted».
7. Regressão: abrir uma build salva normal e o link de exemplo do README. **Certo:** abrem sem nota de ajuste.
````

---

## Armadilhas desta WO

- **Fim de linha (medido com `git ls-files --eol` e por linha):** `src/*.js*`, `meta/DECISIONS.md` e `meta/CHANGELOG.md` em CRLF; `logs/2026-11-27.md` em LF; `meta/STATUS.md` **misto** — Ed. 14 e 15 em CRLF, Ed. 16 (ultima linha) em LF. Grave cada trecho no fim de linha da propria ancora; nao normalize nenhum arquivo.
- **Ed. 10:** o `useEffect` do aviso fica DEPOIS de `showToast` e usa `tl` e `STORAGE_BACKUP_KEY` (constante de modulo, da Ed. 7). Nao mova para perto do `useSavedBuilds()` da Ed. 9.
- **Ed. 12:** a variavel `note` continua existindo (agora junta os dois avisos); `requestOpen(r.build, r.name || '', note)` nao muda.
- **Ed. 13:** `BASE` ja esta definido no topo de `src/icons.js`. A linha nova usa crase (template string), nao aspas.
- **Ed. 19:** o link do passo 5 e longo e tem `-` e `_`; copie o bloco inteiro, sem quebrar a linha.
- **Nao rode o servidor de desenvolvimento** para conferir: a conferencia de tela e do dono, no site publicado.

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `npm run build` → **0 erros**, 33 modulos.
2. **Quem roda:** quem aplica. Prova de vida, na raiz do repo:
   `node -e "import('./src/logic.js').then(async L=>{const b=L.createEmptyBuild('samurai');b.gear.katana={...b.gear.katana,itemId:'katana_petrea',p1:{propId:'dano_cc',value:1e9},p2:{propId:'dano_cc',value:0.05}};const r=L.deserializeBuild({game:'got-legends',build:b});const k=await L.decodeBuildLink(await L.encodeBuildLink(b,'T'));console.log(r.fixed,r.build.gear.katana.p1.value,r.build.gear.katana.p2.propId,k.fixed)})"`
   → `2 0.12 null 2`
3. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `src/logic.js`: `grep -c "^export function clampPropValues"` → **1**; `grep -c "clampPropValues(normalizeLegendaryProps"` → **1**
   - `src/App.jsx`: `grep -c "^function readSaves"` → **1**; `grep -c "^function fixedNote"` → **1**; `grep -c "fixedNote(r.fixed, lang)"` → **2**; `grep -c "if (raw) setSaves(JSON.parse(raw))"` → **0**
   - `src/icons.js`: `grep -c "'/icons/logo/tsushima_logo.png'"` → **0**
   - `meta/DECISIONS.md`: `grep -c "^## DEC-041"` → **1**; `meta/STATUS.md`: `grep -c "^- \[ \] \*\*C[125] —"` → **0**, `grep -c "^- \[ \] \*\*C3/C4"` → **1**, `tail -1` → `**Pendente:** conferência de tela pelo dono (backlog).`
4. **Quem roda:** quem aplica. `git status --short` → os sete arquivos e esta WO. **Nao responde:** se a tela ficou certa — isso e o roteiro do dono.

## Commit

````
fix(builds): valida os salvos e prende as propriedades a faixa ao abrir uma build
````

Corpo sugerido (um `-m` por linha): `C1: salvos ilegiveis viram lista vazia com copia em gotlegends_v1_builds_backup` · `C2 e C5: clampPropValues em deserializeBuild` · `logo segue o caminho-base no GitHub Pages` · `DEC-041`. Depois: `git push`. Relatorio em `../AAMMDD-HHMM-code-got-legends-planner-apply-wo0050.txt`.
