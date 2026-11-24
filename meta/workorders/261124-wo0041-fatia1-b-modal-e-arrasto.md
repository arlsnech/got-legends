# wo0041 — Fatia 1, WO B: o modal da lista (importar e exportar escolhendo), o arrasto de .json e o aviso de rodape

**Data:** 2026-11-24 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de CODIGO (`src/App.jsx`) + registro (CHANGELOG, um item de backlog no STATUS).
**Config sugerida:** Sonnet, `/effort` alto (componente novo, estado no `App`, eventos de janela).
**Pre-requisito:** `main` @ `a5479bb` = `origin/main`, arvore limpa (fora esta WO).
**Base:** `meta/specs/261117-entrada-de-builds-fatia1.md` (aprovada em 2026-11-17), passo 2 de «Passos»: secoes A, B e D. DEC-038.
**Depende de:** `wo0038` (a lista de salvos no `App`, `779e3f9`) e o fecho do kit v1.155.0 (`6aafc82`).

> **Ancoras lidas em:** 2026-11-24, neste turno, de `src/App.jsx` sem `\r` (o arquivo e CRLF na arvore), recortadas por script — nao redigitadas. As de uma linha deram **1** ocorrencia com `grep -cxF`; as de varias linhas (Ed. 3, 4, 8, 9) foram recortadas do arquivo, do primeiro ao ultimo caractere do bloco.
> - Ed. 1 — `src/App.jsx`, o cabecalho da secao do `SaveDrawer`.
> - Ed. 2 — `src/App.jsx`, a assinatura do `SaveDrawer`.
> - Ed. 3 — `src/App.jsx`, o bloco `const exportAll = () => {` inteiro, dentro do `SaveDrawer` — ANCORA DE VARIAS LINHAS (13).
> - Ed. 4 — `src/App.jsx`, o bloco `const importFile = (e) => {` inteiro, dentro do `SaveDrawer` — ANCORA DE VARIAS LINHAS (26).
> - Ed. 5 — `src/App.jsx`, a primeira linha do `text=` do `<Tooltip>` do botao Exportar da gaveta.
> - Ed. 6 — `src/App.jsx`, a segunda linha do mesmo `text=`.
> - Ed. 7 — `src/App.jsx`, o `<button` do Exportar na gaveta.
> - Ed. 8 — `src/App.jsx`, os `useState` do `App`, as duas linhas do `useSavedBuilds`.
> - Ed. 9 — `src/App.jsx`, o `useEffect` do `window.__loadBuild` no `App` — ANCORA DE 5 LINHAS.
> - Ed. 10 — `src/App.jsx`, as props do `<SaveDrawer` no `return` do `App`.
> - Ed. 11 — `src/App.jsx`, o comentario dos estilos globais no fim do `return` do `App`.
> - Ed. 12 — `meta/CHANGELOG.md`, o titulo `## [Não lançado]`.
> - Ed. 13 — `meta/STATUS.md`, «📋 Backlog», o item do README.
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo = CODE.** CHANGELOG e o item de backlog vao aqui; a entrada de «Ultima Sessao» e o log do dia, no `/wrap`.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

Passo 2 da spec da Fatia 1. Hoje o «Importar» grava o arquivo inteiro sem escolha, o «Exportar» baixa tudo, e soltar um arquivo na pagina faz o navegador abri-lo NO LUGAR da ferramenta — a build aberta se perde (nao ha `dragover`/`drop` em `src/`, medido em 2026-11-17). Esta WO poe um modal de lista com selecao, o mesmo nos dois sentidos, liga o arrasto em qualquer ponto da tela a ele, e cria o aviso de rodape que fala pelo `App` quando a gaveta esta fechada. A protecao da build aberta (Desfazer, «Salvar como…») e a WO C: aqui, «Importar e abrir» troca direto, como o clique num salvo faz hoje.

## Inventario — o que muda e o que fica

- **Sai da gaveta:** `exportAll` (vira `downloadBuilds`, no modulo, chamado pelo modal) e a logica de `importFile` (vira `openImportFile` + `buildImportRows` + `mergeImport`). A gaveta continua com o botao, o `<input type="file">` e o `persist` — este ainda e usado por Salvar, ✕ e «Apagar tudo».
- **Validacao:** a mesma `deserializeBuild` da Fatia 0, agora por linha, com o `code` da `wo0038` traduzido no modal (`IMPORT_REASON`). Os tres codigos que `deserializeBuild` devolve: `not_got_legends`, `bad_structure`, `unknown_class` — `grep -c ", code: '" src/logic.js` → 4 (o quarto, `bad_code`, e do `decodeBuild`, que o modal nao usa).
- **Strings novas:** todas em PT-BR e EN, no mesmo ponto do codigo (`tx`/`tl` ou objeto `{ pt, en }`). Nenhuma monolingue.

---

## Edicao 1 — `src/App.jsx` · os componentes e funcoes da entrada e saida

**Ancora** (o cabecalho da secao do `SaveDrawer`):

````
// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
````

**Substituir por:**

````
// ─── Entrada e saída de builds (Fatia 1, WO B — spec 261117) ──
// O modal da lista serve aos dois sentidos (importar e exportar), o aviso de
// rodapé fala pelo App quando a gaveta está fechada, e o arrasto só abre o modal.

/** Motivo de recusa de uma linha do modal, pelo código de deserializeBuild (D4). */
const IMPORT_REASON = {
  not_got_legends: { pt: 'não é uma build do GoT Legends', en: 'not a GoT Legends build' },
  bad_structure:   { pt: 'estrutura incompleta',           en: 'incomplete structure' },
  unknown_class:   { pt: 'classe desconhecida',            en: 'unknown class' },
}

/** Botão de texto (Selecionar todas / Nenhuma). Função, para ler o T do tema ativo. */
const linkBtn = () => ({
  background: 'none', border: 'none', padding: 0, color: T.accent,
  cursor: 'pointer', fontSize: 11, fontWeight: 600,
})

/** Botão neutro lido na hora do render — o btnNeutral do módulo congela o tema da carga. */
const plainBtn = () => ({
  background: T.cardHov, border: `1px solid ${T.borderHov}`, color: T.text,
  borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
  fontWeight: 600, whiteSpace: 'nowrap',
})

/**
 * Lê o texto de um .json e devolve as entradas de build, ou null quando o
 * arquivo não é uma exportação desta ferramenta (spec A8).
 * Aceita a lista do Exportar ({ game, builds: [...] }) e a build solta (A10).
 * @param {string} text
 * @returns {Object[]|null}
 */
function readExportEntries(text) {
  let json
  try { json = JSON.parse(text) } catch { return null }
  if (!json || typeof json !== 'object') return null
  if (Array.isArray(json.builds)) return json.builds.length ? json.builds : null
  return json.game === 'got-legends' ? [json] : null
}

/**
 * Monta as linhas do modal de importação a partir das entradas do arquivo.
 * Cada linha diz se a build abre (validação da Fatia 0), se o nome já existe
 * nos salvos (A4) e se ela é idêntica à salva de mesmo nome (A5).
 * @param {Object[]} entries
 * @param {Object[]} saves
 * @param {string} lang
 * @returns {Object[]} { key, name, classId, build, valid, code, conflict, identical, checked, mode }
 */
function buildImportRows(entries, saves, lang) {
  return entries.map((entry, i) => {
    const r = deserializeBuild(entry)
    const name = (typeof entry?.name === 'string' && entry.name.trim())
      || (lang === 'en' ? 'Unnamed' : 'Sem nome')
    const same = r.ok ? saves.filter(s => s.name === name) : []
    const identical = same.some(s => JSON.stringify(s.build) === JSON.stringify(r.build))
    return {
      key: i, name,
      classId: r.ok ? r.build.classId : entry?.build?.classId,
      build: r.ok ? r.build : null,
      valid: r.ok, code: r.code,
      conflict: same.length > 0, identical,
      checked: r.ok && !identical, mode: 'both',
    }
  })
}

/** Nome livre na lista: «Nome (2)», «Nome (3)»… (spec A4). */
function freeName(name, taken) {
  if (!taken.has(name)) return name
  let n = 2
  while (taken.has(`${name} (${n})`)) n++
  return `${name} (${n})`
}

/**
 * Aplica a importação: as linhas marcadas entram no topo dos salvos, cada uma
 * com id novo (spec, «Decisões de design»). «Substituir» tira a salva de mesmo
 * nome; «Manter as duas» dá à importada o próximo nome livre.
 * @param {Object[]} rows
 * @param {Object[]} saves
 * @returns {{ list: Object[], added: Object[] }}
 */
function mergeImport(rows, saves) {
  const chosen = rows.filter(r => r.checked && r.valid)
  const replaced = new Set(chosen.filter(r => r.conflict && r.mode === 'replace').map(r => r.name))
  const kept = saves.filter(s => !replaced.has(s.name))
  const taken = new Set(kept.map(s => s.name))
  const added = chosen.map(r => {
    const name = freeName(r.name, taken)
    taken.add(name)
    return serializeBuild(r.build, name)
  })
  return { list: [...added, ...kept], added }
}

/**
 * Baixa as builds escolhidas num .json. Com uma só, o arquivo leva o nome
 * dela; com várias, o nome de sempre (spec D2).
 * @param {Object[]} entries
 */
function downloadBuilds(entries) {
  const one = entries.length === 1
  const safe = one ? entries[0].name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase() : 'builds'
  const blob = new Blob(
    [JSON.stringify({ version: '1.0', game: 'got-legends', builds: entries }, null, 2)],
    { type: 'application/json' }
  )
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = `got-legends-${safe}.json`
  a.click()
  URL.revokeObjectURL(url)   // mesmo padrão do generateBuildImage (análise 261116, D5)
}

/**
 * Aviso de rodapé do App: fala pelo que acontece fora da gaveta (arrasto,
 * modal). Altura fixa para não empurrar nada (armadilha 23); centrado por
 * flexbox, sem transform (armadilha 17).
 */
function Toast({ msg }) {
  if (!msg) return null
  const bad = msg.startsWith('✗')
  const col = bad ? T.red : T.green
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 18, zIndex: 1000,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    }}>
      <div role="status" aria-live="polite" style={{
        height: 34, display: 'flex', alignItems: 'center', padding: '0 16px',
        borderRadius: 8, fontSize: 12, fontWeight: 600,
        background: T.panel, color: col, border: `1px solid ${col}66`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        whiteSpace: 'nowrap', maxWidth: '92vw', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {msg}
      </div>
    </div>
  )
}

/** Camada do arrasto: cobre a tela enquanto há arquivo sobre a janela (spec B1). */
function DropOverlay({ show, lang }) {
  if (!show) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 950,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)', pointerEvents: 'none',
    }}>
      <div style={{
        padding: '22px 30px', borderRadius: 14, border: `2px dashed ${T.accent}`,
        background: T.panel, color: T.text, fontSize: 15, fontWeight: 700,
      }}>
        ⬆ {lang === 'en' ? 'Drop the .json to import' : 'Solte o .json para importar'}
      </div>
    </div>
  )
}

/**
 * Modal da lista de builds, nos dois sentidos (spec 261117, seções A e D).
 * mode 'import': linhas do arquivo, com validade, conflito de nome e cópia idêntica.
 * mode 'export': os salvos, todos marcados.
 * As caixas são estado do próprio modal; quem abre passa as linhas iniciais.
 */
function BuildListModal({ mode, initialRows, lang, onCancel, onImport, onExport }) {
  const [rows, setRows] = useState(initialRows)
  const L = lang === 'en'
  const tx = (pt, en) => (L ? en : pt)
  const isImport = mode === 'import'

  // Esc fecha sem gravar (A9)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const patch = (key, p) => setRows(rs => rs.map(r => (r.key === key ? { ...r, ...p } : r)))
  const setAll = (checked) => setRows(rs => rs.map(r => (r.valid ? { ...r, checked } : r)))
  const chosen = rows.filter(r => r.valid && r.checked)
  const n = chosen.length

  return (
    <>
      <div onClick={onCancel} style={{
        position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.55)',
      }} />
      {/* Centralização por flexbox, sem transform — o mesmo motivo do SettingsModal (FIX-011, armadilha 17) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div role="dialog" aria-modal="true" style={{
          pointerEvents: 'auto',
          background: T.panel, border: `1px solid ${T.borderHov}`,
          borderRadius: 13, padding: '16px 18px',
          width: 440, maxWidth: '92vw', maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 8 }}>
            {isImport ? tx('Importar builds', 'Import builds') : tx('Exportar builds', 'Export builds')}
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <button onClick={() => setAll(true)} style={linkBtn()}>{tx('Selecionar todas', 'Select all')}</button>
            <button onClick={() => setAll(false)} style={linkBtn()}>{tx('Nenhuma', 'None')}</button>
          </div>

          {/* A lista rola por dentro (E3): o modal não passa de 80% da altura */}
          <div style={{
            flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
            display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 2,
          }}>
            {rows.map(r => {
              const col = (r.classId && T.cls[r.classId]) || T.muted
              const note = !r.valid
                ? (IMPORT_REASON[r.code]?.[L ? 'en' : 'pt'] ?? tx('não abre', 'cannot be opened'))
                : r.identical ? tx('já está nos salvos', 'already saved')
                : r.conflict ? tx('já existe uma build com este nome', 'a build with this name already exists')
                : ''
              return (
                <div key={r.key} style={{
                  display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
                  padding: '5px 8px', borderRadius: 7,
                  border: `1px solid ${T.border}`, background: T.card,
                  opacity: r.valid ? 1 : 0.5,
                }}>
                  <input type="checkbox" checked={r.checked} disabled={!r.valid}
                    onChange={e => patch(r.key, { checked: e.target.checked })} />
                  {CLASS_ICON[r.classId] && (
                    <img src={CLASS_ICON[r.classId]} width={12} height={12} alt=""
                      style={{ filter: T.iconFilter, opacity: 0.7, flexShrink: 0 }}
                      onError={e => { e.target.style.display = 'none' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: col,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{r.name}</div>
                    {/* Linha de motivo com altura fixa: o texto muda e a lista não pula (armadilha 23) */}
                    <div style={{
                      fontSize: 10, color: T.muted, height: 13, lineHeight: '13px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{note}</div>
                  </div>
                  {isImport && r.valid && r.conflict && r.checked && (
                    <select value={r.mode} onChange={e => patch(r.key, { mode: e.target.value })}
                      style={{
                        fontSize: 10, background: T.card, color: T.text,
                        border: `1px solid ${T.borderHov}`, borderRadius: 5, padding: '2px 4px',
                      }}>
                      <option value="both">{tx('Manter as duas', 'Keep both')}</option>
                      <option value="replace">{tx('Substituir', 'Replace')}</option>
                    </select>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button onClick={onCancel} style={plainBtn()}>{tx('Cancelar', 'Cancel')}</button>
            {isImport && n === 1 && (
              <button onClick={() => onImport(rows, true)} style={btnAction('#2475ad')}>
                {tx('Importar e abrir', 'Import and open')}
              </button>
            )}
            <button disabled={!n}
              onClick={() => (isImport ? onImport(rows, false) : onExport(chosen))}
              style={{ ...btnAction(T.accent), opacity: n ? 1 : 0.4, cursor: n ? 'pointer' : 'default' }}>
              {isImport
                ? tx(`Importar ${n} para os salvos`, `Import ${n} to saved`)
                : tx(`Exportar ${n}`, `Export ${n}`)}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
````

## Edicao 2 — `src/App.jsx` · a gaveta recebe as duas acoes

**Ancora** (a assinatura do `SaveDrawer`):

````
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName, saves, writeSaves }) {
````

**Substituir por:**

````
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName, saves, writeSaves, onImportFile, onRequestExport }) {
````

## Edicao 3 — `src/App.jsx` · sai o `exportAll` da gaveta

**Ancora** (o bloco `const exportAll = () => {` inteiro, dentro do `SaveDrawer` — ANCORA DE VARIAS LINHAS (13)):

````
  const exportAll = () => {
    if (!saves.length) return
    const blob = new Blob(
      [JSON.stringify({ version: '1.0', game: 'got-legends', builds: saves }, null, 2)],
      { type: 'application/json' }
    )
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    a.download = 'got-legends-builds.json'
    a.click()
    URL.revokeObjectURL(url)   // mesmo padrão do generateBuildImage (análise 261116, D5)
  }
````

**Substituir por:**

````
  // Exportar abre o modal da lista no App (WO B): quem escolhe quais builds é ele
````

## Edicao 4 — `src/App.jsx` · o `importFile` so entrega o arquivo

**Ancora** (o bloco `const importFile = (e) => {` inteiro, dentro do `SaveDrawer` — ANCORA DE VARIAS LINHAS (26)):

````
  const importFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result)
        const incoming = json.builds ?? [json]
        // A mesma validação do clique num salvo: o que não abriria não entra no
        // localStorage, onde só falharia depois, ao clicar (análise 261116, D2).
        const valid = incoming.filter(b => deserializeBuild(b).ok)
        const skipped = incoming.length - valid.length
        if (!valid.length) {
          showFlash(lang === 'en' ? '✗ No valid build in the file' : '✗ Nenhuma build válida no arquivo')
          return
        }
        if (!persist([...valid, ...saves.filter(s => !valid.find(v => v.id === s.id))])) return
        showFlash(skipped
          ? (lang === 'en' ? `✓ ${valid.length} imported, ${skipped} ignored` : `✓ ${valid.length} importadas, ${skipped} ignoradas`)
          : (lang === 'en' ? `✓ ${valid.length} builds imported` : `✓ ${valid.length} builds importadas`))
      } catch {
        showFlash(lang === 'en' ? '✗ Invalid file' : '✗ Arquivo inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }
````

**Substituir por:**

````
  // Importar passa pelo modal da lista, que é do App (WO B): o arrasto abre o
  // mesmo modal com a gaveta fechada. Aqui só se entrega o arquivo escolhido.
  const importFile = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (file) onImportFile(file)
  }
````

## Edicao 5 — `src/App.jsx` · tooltip do Exportar

**Ancora** (a primeira linha do `text=` do `<Tooltip>` do botao Exportar da gaveta):

````
              ? 'Export all saved builds to a .json file'
````

**Substituir por:**

````
              ? 'Choose which saved builds to export to a .json file'
````

## Edicao 6 — `src/App.jsx` · tooltip do Exportar, PT

**Ancora** (a segunda linha do mesmo `text=`):

````
              : 'Exportar todas as builds salvas para .json'}>
````

**Substituir por:**

````
              : 'Escolher quais builds salvas exportar para .json'}>
````

## Edicao 7 — `src/App.jsx` · o botao Exportar abre o modal

**Ancora** (o `<button` do Exportar na gaveta):

````
              <button onClick={exportAll}
````

**Substituir por:**

````
              <button onClick={onRequestExport}
````

## Edicao 8 — `src/App.jsx` · estado do App

**Ancora** (os `useState` do `App`, as duas linhas do `useSavedBuilds`):

````
  // Builds salvas: do App, não da gaveta — o arrasto da WO B grava com ela fechada
  const { saves, writeSaves } = useSavedBuilds()
````

**Substituir por:**

````
  // Builds salvas: do App, não da gaveta — o arrasto da WO B grava com ela fechada
  const { saves, writeSaves } = useSavedBuilds()
  // Entrada e saída de builds (WO B): modal da lista, aviso de rodapé e arrasto
  const [listModal, setListModal] = useState(null)   // { mode, rows, id } ou null
  const [toast,     setToast]     = useState(null)
  const [dragging,  setDragging]  = useState(false)
  const toastTimer  = useRef()
  const dropFileRef = useRef()
````

## Edicao 9 — `src/App.jsx` · funcoes e arrasto no App

**Ancora** (o `useEffect` do `window.__loadBuild` no `App` — ANCORA DE 5 LINHAS):

````
  // Permite que o SaveDrawer dispare carregamentos de build
  useEffect(() => {
    window.__loadBuild = (b) => setBuild(b)
    return () => { delete window.__loadBuild }
  }, [])
````

**Substituir por:**

````
  // Permite que o SaveDrawer dispare carregamentos de build
  useEffect(() => {
    window.__loadBuild = (b) => setBuild(b)
    return () => { delete window.__loadBuild }
  }, [])

  // ── Entrada e saída de builds (WO B, spec 261117) ─────────────
  const tl = (pt, en) => (lang === 'en' ? en : pt)

  /** Aviso de rodapé por alguns segundos; um aviso novo substitui o anterior. */
  const showToast = (msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  /** Lê o arquivo escolhido ou solto e abre o modal; arquivo estranho só avisa (A8). */
  const openImportFile = (file) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const entries = readExportEntries(String(ev.target.result))
      if (!entries) {
        showToast(tl('✗ Este arquivo não é uma exportação do GoT Legends Planner',
                     '✗ This file is not a GoT Legends Planner export'))
        return
      }
      setListModal({ mode: 'import', rows: buildImportRows(entries, saves, lang), id: Date.now() })
    }
    reader.readAsText(file)
  }

  /** Grava as linhas marcadas; com «Importar e abrir», abre a única marcada (A6, A7). */
  const confirmImport = (rows, open) => {
    const { list, added } = mergeImport(rows, saves)
    if (!writeSaves(list)) {
      showToast(tl('✗ Não foi possível gravar no navegador', '✗ Could not write to browser storage'))
      return
    }
    setListModal(null)
    if (open && added.length === 1) {
      // A proteção da build aberta (Desfazer, «Salvar como…») chega na WO C
      setBuild(added[0].build)
      setBuildName(added[0].name)
      showToast(tl(`✓ "${added[0].name}" importada e aberta`, `✓ "${added[0].name}" imported and opened`))
    } else {
      showToast(tl(`✓ ${added.length} importadas`, `✓ ${added.length} imported`))
    }
  }

  /** Abre o modal em modo exportar, com todos os salvos marcados (D1). */
  const openExport = () => {
    if (!saves.length) return
    setListModal({
      mode: 'export', id: Date.now(),
      rows: saves.map((s, i) => ({
        key: i, name: s.name, classId: s.build?.classId, entry: s,
        valid: true, checked: true, conflict: false, identical: false, mode: 'both',
      })),
    })
  }

  const confirmExport = (chosen) => {
    downloadBuilds(chosen.map(r => r.entry))
    setListModal(null)
  }

  /** Arquivos soltos na janela: um .json só abre o modal (B2–B4). */
  dropFileRef.current = (files) => {
    if (files.length !== 1) {
      showToast(tl('✗ Solte um arquivo por vez', '✗ Drop one file at a time'))
      return
    }
    if (!files[0].name.toLowerCase().endsWith('.json')) {
      showToast(tl('✗ Só arquivos .json podem ser importados', '✗ Only .json files can be imported'))
      return
    }
    openImportFile(files[0])
  }

  // Arrasto de arquivo para qualquer ponto da tela (B1–B6). Sem isto o navegador
  // abre o arquivo NO LUGAR da ferramenta, e a build aberta se perde.
  // O contador resolve o dragleave que dispara ao passar de um filho para outro;
  // o dragstart marca o arrasto que nasceu na própria página (texto, imagem),
  // que não é importação. O handler de soltar vem por ref, para ler os salvos atuais.
  useEffect(() => {
    let depth = 0
    let internal = false
    const isFile = (e) => !internal && [...(e.dataTransfer?.types ?? [])].includes('Files')
    const onStart = () => { internal = true }
    const onEnd   = () => { internal = false }
    const onEnter = (e) => { if (!isFile(e)) return; depth++; setDragging(true) }
    const onOver  = (e) => { if (isFile(e)) e.preventDefault() }
    const onLeave = (e) => {
      if (!isFile(e)) return
      depth = Math.max(0, depth - 1)
      if (!depth) setDragging(false)
    }
    const onDrop = (e) => {
      if (!isFile(e)) return
      e.preventDefault()
      depth = 0
      setDragging(false)
      dropFileRef.current?.(e.dataTransfer.files)
    }
    const on = [['dragstart', onStart], ['dragend', onEnd], ['dragenter', onEnter],
                ['dragover', onOver], ['dragleave', onLeave], ['drop', onDrop]]
    on.forEach(([ev, fn]) => window.addEventListener(ev, fn))
    return () => on.forEach(([ev, fn]) => window.removeEventListener(ev, fn))
  }, [])
````

## Edicao 10 — `src/App.jsx` · a gaveta recebe as acoes

**Ancora** (as props do `<SaveDrawer` no `return` do `App`):

````
        writeSaves={writeSaves}
````

**Substituir por:**

````
        writeSaves={writeSaves}
        onImportFile={openImportFile}
        onRequestExport={openExport}
````

## Edicao 11 — `src/App.jsx` · modal, camada e aviso no `return`

**Ancora** (o comentario dos estilos globais no fim do `return` do `App`):

````
      {/* Estilos globais */}
````

**Substituir por:**

````
      {/* Modal da lista de builds — importar e exportar (WO B) */}
      {listModal && (
        <BuildListModal
          key={listModal.id}
          mode={listModal.mode}
          initialRows={listModal.rows}
          lang={lang}
          onCancel={() => setListModal(null)}
          onImport={confirmImport}
          onExport={confirmExport}
        />
      )}

      {/* Camada do arrasto e aviso de rodapé (WO B) */}
      <DropOverlay show={dragging} lang={lang} />
      <Toast msg={toast} />

      {/* Estilos globais */}
````

## Edicao 12 — `meta/CHANGELOG.md` · o que o usuario ve

**Ancora** (o titulo `## [Não lançado]`):

````
## [Não lançado]
````

**Substituir por:**

````
## [Não lançado]

### Adicionado
- **Importar escolhendo quais builds** (DEC-038, spec `meta/specs/261117-entrada-de-builds-fatia1.md`): o «⬆ Importar» abre uma lista com as builds do arquivo, todas marcadas; as que não abrem aparecem desmarcadas, com o motivo; nome repetido oferece «Manter as duas» (a importada vira «Nome (2)») ou «Substituir»; uma build idêntica a uma salva vem desmarcada. «Importar N para os salvos» não troca a build aberta; com uma marcada, «Importar e abrir».
- **Arrastar um `.json` para qualquer ponto da tela** abre a mesma lista, com a gaveta aberta ou fechada. Antes, soltar um arquivo na página fazia o navegador abri-lo no lugar da ferramenta.
- **Exportar escolhendo quais builds**: o «⬇ Exportar» abre a mesma lista; com uma build só, o arquivo leva o nome dela.
- Aviso no rodapé da tela para o que acontece fora da gaveta.
````

## Edicao 13 — `meta/STATUS.md` · backlog: o `btnNeutral` congelado

**Ancora** («📋 Backlog», o item do README):

````
- [ ] **README desatualizado:** manda abrir `localhost:5173/got-legends/` (o caminho-base local hoje é `/`), e a árvore de «Estrutura do Projeto» fala em `App.jsx` de ~1.2k linhas e não cita o `icons.js`. Achado em 2026-11-23.
````

**Substituir por:**

````
- [ ] **README desatualizado:** manda abrir `localhost:5173/got-legends/` (o caminho-base local hoje é `/`), e a árvore de «Estrutura do Projeto» fala em `App.jsx` de ~1.2k linhas e não cita o `icons.js`. Achado em 2026-11-23.
- [ ] **Botões neutros não acompanham o tema claro:** `btnNeutral` (e `btnSmall`) são objetos de módulo, montados com o `T` da carga (tema escuro), e não mudam com o tema — os botões «Exportar», «Importar» e «Copiar» da gaveta ficam escuros no tema claro. Os componentes da WO B usam um estilo lido no render (`plainBtn`). Achado em 2026-11-24, lendo o código; **não conferido na tela**.
````

---

## Fora de escopo

- Protecao da build aberta — instantaneo, Desfazer, «Salvar como…» (WO C).
- O `btnNeutral` congelado: vai ao backlog (Ed. 13), nao se conserta aqui.
- Trocar o `window.confirm` do «Apagar tudo»; link e QR (Fatia 2).

## Armadilhas desta WO

- **`src/App.jsx` e `meta/CHANGELOG.md` em CRLF; `meta/STATUS.md` em LF** (`git ls-files --eol`). Ed. 3, 4, 8 e 9 tem ancora de varias linhas: compare sem `\r` e grave em CRLF — o script por cercas de quatro crases da `wo0040` serve.
- **Ordem:** a Ed. 7 troca o unico `onClick={exportAll}`, e a Ed. 3 remove a definicao: aplique as duas, senao o build quebra por nome indefinido.
- **Os hooks novos do `App` (Ed. 8) ficam junto dos outros `useState`, antes do `Object.assign(T, …)`.** O `useEffect` do arrasto (Ed. 9) fica logo depois do `__loadBuild`, fora de qualquer `if`.

---

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `src/App.jsx`, `meta/CHANGELOG.md`, `meta/STATUS.md` e esta WO. **Nao responde:** se a tela se comporta.
2. **Quem roda:** quem aplica. `npm run build` → **0 erros**. Erro → **PARE e reporte antes de commitar**. **Nao responde:** a tela.
3. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `tr -d '\r' < src/App.jsx | grep -c "^function BuildListModal\|^function Toast\|^function DropOverlay\|^function readExportEntries\|^function buildImportRows\|^function mergeImport\|^function downloadBuilds\|^function freeName"` → **8** (uma linha por funcao nova).
   - `tr -d '\r' < src/App.jsx | grep -c "exportAll"` → **0** (a definicao e o `onClick` sairam).
   - `tr -d '\r' < src/App.jsx | grep -c "onImportFile(file)"` → **1**; `tr -d '\r' < src/App.jsx | grep -c "<BuildListModal"` → **1**; `tr -d '\r' < src/App.jsx | grep -c "<Toast msg={toast} />"` → **1**.
   - `tr -d '\r' < meta/CHANGELOG.md | sed -n '/^## \[Não lançado\]/,/^## \[1.0.0\]/p' | grep -c "^### Adicionado"` → **1**; `grep -c "^- \[ \] \*\*Botões neutros não acompanham" meta/STATUS.md` → **1**.
   Numeros medidos pelo chat numa copia do repositorio com as 13 edicoes aplicadas a partir do texto desta WO, onde o `vite build` passou (33 modulos) e as funcoes puras do modal rodaram no Node: arquivo nao-JSON e de outro jogo → `null`; build sem `gear` → `bad_structure`; copia identica → desmarcada; nome repetido → «Nome (2)» em «Manter as duas» e a antiga sai em «Substituir»; toda importada com `id` novo.
   **Nao responde:** se cada funcao faz o que a spec pede — passo 4.
4. **Quem roda:** o dono, na tela — roteiro entregue pelo chat no mesmo turno desta WO, com o arquivo de teste `../261124-teste-fatia1-wob.json` (20 builds) na pasta-pai. Quem aplica nao faz conferencia visual.

## Relatorio de aplicacao

Os campos da skill `apply-wo` — a primeira linha diz o que entrou —, com a saida crua dos passos 1–3. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add src/App.jsx meta/CHANGELOG.md meta/STATUS.md meta/workorders/261124-wo0041-fatia1-b-modal-e-arrasto.md
```

```
git commit -m "feat(saves): importar e exportar escolhendo as builds, e arrastar .json para a tela" -m "WO B da Fatia 1 (spec 261117, DEC-038). Modal de lista com selecao para importar (validade, nome repetido com manter as duas ou substituir, copia identica desmarcada, importar e abrir) e para exportar. Arrastar um .json em qualquer ponto da tela abre o mesmo modal; antes o navegador abria o arquivo no lugar da ferramenta. Aviso de rodape no App."
```

```
git push
```
