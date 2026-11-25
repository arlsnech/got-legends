# wo0042 — Fatia 1, WO C: protecao da build aberta (Desfazer e «Salvar como…») e a linha inteira clicavel no modal

**Data:** 2026-11-24 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de CODIGO (`src/App.jsx`) + registro (CHANGELOG, IDEAS).
**Config sugerida:** Sonnet, `/effort` alto (estado do `App`, fluxo de troca de build, 17 edicoes no mesmo arquivo).
**Pre-requisito:** `main` @ `1eac45d` = `origin/main`, arvore limpa (fora esta WO).
**Base:** `meta/specs/261117-entrada-de-builds-fatia1.md`, passo 3 de «Passos» (secao C). Mais o pedido do dono na nota `../261124-0856.txt`: a linha inteira do modal clicavel (Ed. 3–5). O outro pedido da nota (nome repetido ao salvar) vira ideia aguardando decisao (Ed. 19), nao codigo.
**Depende de:** `wo0041` (`1692ed4`).

> **Ancoras lidas em:** 2026-11-24, neste turno, de `src/App.jsx` sem `\r` (o arquivo e CRLF na arvore), recortadas por script — nao redigitadas. As de uma linha deram **1** ocorrencia; as de varias linhas (Ed. 2, 7, 8, 9, 11, 12, 13) foram recortadas do arquivo, do primeiro ao ultimo caractere.
> - Ed. 1 — `src/App.jsx`, o cabecalho da secao do `SaveDrawer`.
> - Ed. 2 — `src/App.jsx`, a funcao `Toast` inteira — ANCORA DE 21 LINHAS.
> - Ed. 3 — `src/App.jsx`, a abertura da linha no `rows.map` do `BuildListModal`.
> - Ed. 4 — `src/App.jsx`, o `onChange` do checkbox da linha.
> - Ed. 5 — `src/App.jsx`, o `<select` de «Manter as duas» / «Substituir».
> - Ed. 6 — `src/App.jsx`, a assinatura do `SaveDrawer`.
> - Ed. 7 — `src/App.jsx`, as duas linhas de gravacao dentro de `const save = () => {` da gaveta — ANCORA DE 2 LINHAS.
> - Ed. 8 — `src/App.jsx`, dentro de `const load = (entry) => {` da gaveta — ANCORA DE 5 LINHAS.
> - Ed. 9 — `src/App.jsx`, dentro de `const loadCode = () => {` da gaveta — ANCORA DE 4 LINHAS.
> - Ed. 10 — `src/App.jsx`, os `useState`/`useRef` do `App`, a ultima linha do bloco da WO B.
> - Ed. 11 — `src/App.jsx`, o `useEffect` do `__loadBuild` e a linha que vem depois dele — ANCORA DE 7 LINHAS.
> - Ed. 12 — `src/App.jsx`, `const showToast` no `App` — ANCORA DE 5 LINHAS.
> - Ed. 13 — `src/App.jsx`, dentro de `confirmImport` — ANCORA DE 4 LINHAS.
> - Ed. 14 — `src/App.jsx`, o comentario de `openExport` no `App`.
> - Ed. 15 — `src/App.jsx`, as props do `<SaveDrawer` no `return` do `App`.
> - Ed. 16 — `src/App.jsx`, o comentario da camada do arrasto no `return` do `App`.
> - Ed. 17 — `src/App.jsx`, a chamada do `<Toast` no `return`.
> - Ed. 18 — `meta/CHANGELOG.md`, em `[Não lançado]` → `### Adicionado`, o ultimo item.
> - Ed. 19 — `meta/IDEAS.md`, «💡 Ideias Ativas — Usuário», a ultima linha da entrada «Filtrar, ordenar e agrupar».
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo = CODE.** CHANGELOG e IDEAS vao aqui; a entrada de «Ultima Sessao», o log do dia e o fecho da Fatia 1 no STATUS, no `/wrap`.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

Passo 3, o ultimo, da spec da Fatia 1. Hoje abrir uma build — clique num salvo, «Carregar» codigo, «Importar e abrir» — troca a build aberta sem perguntar e sem volta: quem estava montando outra e nao salvou perde o trabalho com um clique. Esta WO poe uma porta unica no `App` (`requestOpen`) para as tres entradas: sem alteracao nao salva, troca direto e oferece «Desfazer» por ~8 s; com alteracao, pergunta antes («Salvar como…», «Abrir sem salvar», «Cancelar»). Alteracao = a build atual difere de um retrato tirado quando ela foi aberta, salva ou criada (C7, C8).

## Inventario — o que muda e o que fica

- **Quem troca a build vindo de fora:** `window.__loadBuild` — 2 chamadas, ambas na gaveta (`load`, `loadCode`) — e o `setBuild(added[0].build)` do `confirmImport`. As tres passam a chamar `requestOpen`. O `window.__loadBuild` fica orfao e sai (Ed. 11).
- **Quem grava salvando a build aberta:** o `save()` da gaveta (Ed. 7) e o «Salvar como…» do modal novo — os dois por `saveCurrent`, a mesma regra que existia na gaveta (deduplica por nome). O `persist` da gaveta fica: ainda o usam o ✕ e o «Apagar tudo».
- **Quem muda a build por dentro da tela** (`onClassChange`, `onRandom`, os seletores): nao muda. Eles nao passam pela porta, e e isso que torna a build «alterada». **Nenhum `useEffect` do `App` chama `setBuild`** (medido: `grep -n "setBuild("` so acha manipuladores e o `__loadBuild` que sai), entao o retrato nao e desfeito por normalizacao depois de abrir — o risco que a spec listou.
- **Nao ha suite:** o build e a rede; a tela e do dono (roteiro no chat).

---

## Edicao 1 — `src/App.jsx` · o modal de alteracoes nao salvas

**Ancora** (o cabecalho da secao do `SaveDrawer`):

````
// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
````

**Substituir por:**

````
/**
 * Pergunta antes de trocar uma build com alterações não salvas (spec C3–C6).
 * O nome vem preenchido com o da build aberta; se ele já existir nos salvos,
 * o aviso diz, ANTES de confirmar, que salvar substitui a salva (C4).
 */
function UnsavedModal({ incomingName, currentName, saves, lang, onSaveAndOpen, onOpen, onCancel }) {
  const [name, setName] = useState(currentName)
  const L = lang === 'en'
  const tx = (pt, en) => (L ? en : pt)
  const finalName = name.trim() || tx('Sem nome', 'Unnamed')
  const exists = saves.some(s => s.name === finalName)

  // Esc cancela sem trocar nada (C6)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <>
      <div onClick={onCancel} style={{
        position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.55)',
      }} />
      {/* Centralização por flexbox, sem transform (FIX-011, armadilha 17) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div role="dialog" aria-modal="true" style={{
          pointerEvents: 'auto',
          background: T.panel, border: `1px solid ${T.borderHov}`,
          borderRadius: 13, padding: '16px 18px', width: 400, maxWidth: '92vw',
          boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 6 }}>
            {tx('Alterações não salvas', 'Unsaved changes')}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, lineHeight: 1.45 }}>
            {tx(`A build aberta tem alterações que não foram salvas. Abrir "${incomingName}" assim mesmo?`,
                `The open build has unsaved changes. Open "${incomingName}" anyway?`)}
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>
            {tx('Salvar a build aberta como', 'Save the open build as')}
          </div>
          <input autoFocus value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSaveAndOpen(finalName) }}
            placeholder={tx('Nome...', 'Name...')}
            style={{
              width: '100%', background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontSize: 12, padding: '6px 8px',
            }} />
          {/* Altura fixa: o aviso aparece e some conforme o nome, sem empurrar os botões (armadilha 23) */}
          <div style={{ fontSize: 10, color: T.red, height: 16, lineHeight: '16px', marginTop: 4 }}>
            {exists ? tx(`isto substitui a build salva "${finalName}"`, `this replaces the saved build "${finalName}"`) : ''}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button onClick={onCancel} style={plainBtn()}>{tx('Cancelar', 'Cancel')}</button>
            <button onClick={onOpen} style={plainBtn()}>{tx('Abrir sem salvar', 'Open without saving')}</button>
            <button onClick={() => onSaveAndOpen(finalName)} style={btnAction(T.accent)}>
              {tx('Salvar como…', 'Save as…')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
````

## Edicao 2 — `src/App.jsx` · o aviso de rodape ganha o Desfazer

**Ancora** (a funcao `Toast` inteira — ANCORA DE 21 LINHAS):

````
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
````

**Substituir por:**

````
function Toast({ toast }) {
  if (!toast) return null
  const { msg, action } = toast
  const bad = msg.startsWith('✗')
  const col = bad ? T.red : T.green
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 18, zIndex: 1000,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    }}>
      {/* Só o aviso com ação (o Desfazer da WO C) recebe clique; o resto deixa passar */}
      <div role="status" aria-live="polite" style={{
        height: 34, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
        borderRadius: 8, fontSize: 12, fontWeight: 600,
        background: T.panel, color: col, border: `1px solid ${col}66`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        whiteSpace: 'nowrap', maxWidth: '92vw',
        pointerEvents: action ? 'auto' : 'none',
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</span>
        {action && (
          <button onClick={action.run} style={{
            background: 'none', border: 'none', padding: 0, flexShrink: 0,
            color: T.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>{action.label}</button>
        )}
      </div>
    </div>
  )
}
````

## Edicao 3 — `src/App.jsx` · a linha inteira do modal marca e desmarca

**Ancora** (a abertura da linha no `rows.map` do `BuildListModal`):

````
                <div key={r.key} style={{
````

**Substituir por:**

````
                // A linha inteira marca e desmarca (pedido do dono, 2026-11-24); o checkbox
                // e o select param a propagação, senão o clique contaria duas vezes.
                <div key={r.key} onClick={() => r.valid && patch(r.key, { checked: !r.checked })} style={{
                  cursor: r.valid ? 'pointer' : 'default',
````

## Edicao 4 — `src/App.jsx` · o checkbox nao conta duas vezes

**Ancora** (o `onChange` do checkbox da linha):

````
                    onChange={e => patch(r.key, { checked: e.target.checked })} />
````

**Substituir por:**

````
                    onClick={e => e.stopPropagation()}
                    onChange={e => patch(r.key, { checked: e.target.checked })} />
````

## Edicao 5 — `src/App.jsx` · o select nao marca a linha

**Ancora** (o `<select` de «Manter as duas» / «Substituir»):

````
                    <select value={r.mode} onChange={e => patch(r.key, { mode: e.target.value })}
````

**Substituir por:**

````
                    <select value={r.mode} onClick={e => e.stopPropagation()} onChange={e => patch(r.key, { mode: e.target.value })}
````

## Edicao 6 — `src/App.jsx` · a gaveta recebe as duas acoes

**Ancora** (a assinatura do `SaveDrawer`):

````
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName, saves, writeSaves, onImportFile, onRequestExport }) {
````

**Substituir por:**

````
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName, saves, writeSaves, onImportFile, onRequestExport, onOpenBuild, onSave }) {
````

## Edicao 7 — `src/App.jsx` · o Salvar da gaveta usa a regra do App

**Ancora** (as duas linhas de gravacao dentro de `const save = () => {` da gaveta — ANCORA DE 2 LINHAS):

````
    const entry = serializeBuild(build, name)
    if (!persist([entry, ...saves.filter(s => s.name !== name)])) return
````

**Substituir por:**

````
    // A gravação é do App (saveCurrent): ela também marca a build como salva,
    // que é o que a proteção da build aberta lê (WO C, spec C8).
    if (!onSave(name)) {
      showFlash(lang === 'en' ? '✗ Could not write to browser storage' : '✗ Não foi possível gravar no navegador')
      return
    }
````

## Edicao 8 — `src/App.jsx` · o clique num salvo passa pela porta do App

**Ancora** (dentro de `const load = (entry) => {` da gaveta — ANCORA DE 5 LINHAS):

````
      window.__loadBuild?.(r.build)
      // O nome acompanha a build: sem isto o campo guarda o nome da anterior, e o
      // próximo Salvar grava esta build por cima daquela (análise 261116, D1).
      setBuildName(entry.name || '')
      showFlash(lang === 'en' ? `✓ "${entry.name}" loaded` : `✓ "${entry.name}" carregado`)
````

**Substituir por:**

````
      // A troca, o nome junto (D1), o Desfazer e a pergunta de alteração não salva
      // são do App (requestOpen, WO C)
      onOpenBuild(r.build, entry.name || '')
````

## Edicao 9 — `src/App.jsx` · o Carregar codigo passa pela mesma porta

**Ancora** (dentro de `const loadCode = () => {` da gaveta — ANCORA DE 4 LINHAS):

````
      window.__loadBuild?.(r.build)
      setShareCode('')
      setBuildName(r.name || '')   // mesma razão do load() acima (D1)
      showFlash(lang === 'en' ? '✓ Build loaded!' : '✓ Build carregada!')
````

**Substituir por:**

````
      setShareCode('')
      onOpenBuild(r.build, r.name || '')   // mesma porta do load() acima (WO C)
````

## Edicao 10 — `src/App.jsx` · estado da protecao no App

**Ancora** (os `useState`/`useRef` do `App`, a ultima linha do bloco da WO B):

````
  const dropFileRef = useRef()
````

**Substituir por:**

````
  const dropFileRef = useRef()
  // Proteção da build aberta (WO C): o retrato da build de quando ela foi aberta,
  // salva ou criada, e a troca que espera a resposta do modal de alteração não salva
  const baselineRef = useRef(null)
  if (baselineRef.current === null) baselineRef.current = JSON.stringify(build)
  const [pendingOpen, setPendingOpen] = useState(null)   // { build, name } ou null
````

## Edicao 11 — `src/App.jsx` · sai o `window.__loadBuild`, que ficou orfao

**Ancora** (o `useEffect` do `__loadBuild` e a linha que vem depois dele — ANCORA DE 7 LINHAS):

````
  // Permite que o SaveDrawer dispare carregamentos de build
  useEffect(() => {
    window.__loadBuild = (b) => setBuild(b)
    return () => { delete window.__loadBuild }
  }, [])

  // ── Entrada e saída de builds (WO B, spec 261117) ─────────────
````

**Substituir por:**

````
  // ── Entrada e saída de builds (WO B, spec 261117) ─────────────
````

## Edicao 12 — `src/App.jsx` · o aviso aceita acao e duracao

**Ancora** (`const showToast` no `App` — ANCORA DE 5 LINHAS):

````
  const showToast = (msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }
````

**Substituir por:**

````
  const showToast = (msg, action = null, ms = 3500) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, action })
    toastTimer.current = setTimeout(() => setToast(null), ms)
  }
````

## Edicao 13 — `src/App.jsx` · «Importar e abrir» passa pela porta

**Ancora** (dentro de `confirmImport` — ANCORA DE 4 LINHAS):

````
      // A proteção da build aberta (Desfazer, «Salvar como…») chega na WO C
      setBuild(added[0].build)
      setBuildName(added[0].name)
      showToast(tl(`✓ "${added[0].name}" importada e aberta`, `✓ "${added[0].name}" imported and opened`))
````

**Substituir por:**

````
      // A mesma porta do clique num salvo: Desfazer, e «Salvar como…» se houver alteração (WO C)
      requestOpen(added[0].build, added[0].name)
````

## Edicao 14 — `src/App.jsx` · as funcoes da protecao

**Ancora** (o comentario de `openExport` no `App`):

````
  /** Abre o modal em modo exportar, com todos os salvos marcados (D1). */
````

**Substituir por:**

````
  // ── Proteção da build aberta (WO C, spec C1–C8) ───────────────

  /** A build aberta difere da última aberta, salva ou criada? Só a build conta, não o nome (C7). */
  const isDirty = () => JSON.stringify(build) !== baselineRef.current

  /** Troca a build aberta e oferece Desfazer por ~8 s, que volta a build E o nome (C1, C2, C5). */
  const doOpen = (next, name) => {
    const prev = { build, name: buildName, baseline: baselineRef.current }
    setBuild(next)
    setBuildName(name || '')
    baselineRef.current = JSON.stringify(next)
    const label = name || tl('Sem nome', 'Unnamed')
    showToast(tl(`Build "${label}" aberta`, `Build "${label}" opened`), {
      label: tl('Desfazer', 'Undo'),
      run: () => {
        setBuild(prev.build)
        setBuildName(prev.name)
        baselineRef.current = prev.baseline
        clearTimeout(toastTimer.current)
        setToast(null)
      },
    }, 8000)
  }

  /**
   * Porta única para abrir uma build que vem de fora da tela — clique num salvo,
   * «Carregar» código, «Importar e abrir». Só pergunta se houver alteração não salva (C3).
   */
  const requestOpen = (next, name) => {
    if (isDirty()) setPendingOpen({ build: next, name })
    else doOpen(next, name)
  }

  /**
   * Salva a build aberta com o nome dado. O Salvar da gaveta e o «Salvar como…»
   * do modal usam esta mesma regra — deduplica por nome — e ela marca a build
   * como salva, que é o que a proteção lê (C8).
   * @returns {boolean} false se o navegador recusar gravar
   */
  const saveCurrent = (name) => {
    const entry = serializeBuild(build, name)
    if (!writeSaves([entry, ...saves.filter(s => s.name !== name)])) return false
    baselineRef.current = JSON.stringify(build)
    return true
  }

  /** Resposta do modal de alterações não salvas: com nome, salva antes de abrir (C4); sem, só abre (C5). */
  const resolvePending = (saveName) => {
    const p = pendingOpen
    if (saveName !== undefined && !saveCurrent(saveName)) {
      showToast(tl('✗ Não foi possível gravar no navegador', '✗ Could not write to browser storage'))
      return
    }
    setPendingOpen(null)
    doOpen(p.build, p.name)
  }

  /** Abre o modal em modo exportar, com todos os salvos marcados (D1). */
````

## Edicao 15 — `src/App.jsx` · a gaveta recebe as acoes

**Ancora** (as props do `<SaveDrawer` no `return` do `App`):

````
        onRequestExport={openExport}
````

**Substituir por:**

````
        onRequestExport={openExport}
        onOpenBuild={requestOpen}
        onSave={saveCurrent}
````

## Edicao 16 — `src/App.jsx` · o modal no `return`

**Ancora** (o comentario da camada do arrasto no `return` do `App`):

````
      {/* Camada do arrasto e aviso de rodapé (WO B) */}
````

**Substituir por:**

````
      {/* Alterações não salvas antes de trocar a build (WO C) */}
      {pendingOpen && (
        <UnsavedModal
          incomingName={pendingOpen.name || tl('Sem nome', 'Unnamed')}
          currentName={buildName}
          saves={saves}
          lang={lang}
          onSaveAndOpen={(name) => resolvePending(name)}
          onOpen={() => resolvePending()}
          onCancel={() => setPendingOpen(null)}
        />
      )}

      {/* Camada do arrasto e aviso de rodapé (WO B) */}
````

## Edicao 17 — `src/App.jsx` · o aviso le o objeto

**Ancora** (a chamada do `<Toast` no `return`):

````
      <Toast msg={toast} />
````

**Substituir por:**

````
      <Toast toast={toast} />
````

## Edicao 18 — `meta/CHANGELOG.md` · o que o usuario ve

**Ancora** (em `[Não lançado]` → `### Adicionado`, o ultimo item):

````
- Aviso no rodapé da tela para o que acontece fora da gaveta.
````

**Substituir por:**

````
- Aviso no rodapé da tela para o que acontece fora da gaveta.
- **Proteção da build aberta** (spec, seção C): abrir uma build — clique num salvo, «Carregar» código, «Importar e abrir» — mostra «Desfazer» no rodapé por ~8 segundos, que devolve a build e o nome de antes. Se a build aberta tem alterações não salvas, a ferramenta pergunta antes: «Salvar como…» (com aviso se o nome já existe), «Abrir sem salvar» ou «Cancelar». Mudar só o nome não conta como alteração.
- **No modal da lista, a linha inteira marca e desmarca**, não só o quadradinho (pedido do dono).
````

## Edicao 19 — `meta/IDEAS.md` · o pedido do dono sobre nomes

**Ancora** («💡 Ideias Ativas — Usuário», a ultima linha da entrada «Filtrar, ordenar e agrupar»):

````
Ordenar por nome (alfabético), por data de criação ou de edição; agrupar por classe; filtrar por classe, por equipamento presente, por vantagem ativa ou outra regra. O dono pediu que o assistente pese e **barre se for desnecessário**, com critério, estudo e pesquisa de UX. A pergunta que decide é **a partir de quantas builds salvas** uma lista simples deixa de servir. Observação técnica: hoje o save guarda só `createdAt`; ordenar por edição pede um campo novo (`updatedAt`) e cuidado com os saves antigos, que não o têm. Vai para a mesma análise.
````

**Substituir por:**

````
Ordenar por nome (alfabético), por data de criação ou de edição; agrupar por classe; filtrar por classe, por equipamento presente, por vantagem ativa ou outra regra. O dono pediu que o assistente pese e **barre se for desnecessário**, com critério, estudo e pesquisa de UX. A pergunta que decide é **a partir de quantas builds salvas** uma lista simples deixa de servir. Observação técnica: hoje o save guarda só `createdAt`; ordenar por edição pede um campo novo (`updatedAt`) e cuidado com os saves antigos, que não o têm. Vai para a mesma análise.

### 2026-11 — Salvar com um nome que já existe: aviso ou renomear
**Status (2026-11-24):** proposta do assistente aguardando decisão do dono `[proposto pelo assistente]`.
`[relatado pelo dono, nota 261124-0856]` Hoje o «Salvar» da gaveta com um nome que já existe substitui a build salva sem aviso; o dono quer «um renomear automático ou pelo menos um aviso», como a importação já faz. Proposta: salvar por cima **em silêncio só quando o nome é o da build que foi aberta** (é a atualização normal de quem carregou, editou e salvou); com o nome de OUTRA build salva, perguntar «Substituir "X"» × «Salvar como "X (2)"» × «Cancelar». Renomear sempre quebraria a atualização; avisar sempre cobraria confirmação em todo salvar. Peça para a próxima WO, depois da decisão.
````

---

## Fora de escopo

- A regra de nome repetido ao salvar — aguarda decisao do dono (a Ed. 19 a registra).
- Undo/Redo de varios niveis (F5); o «Desfazer» aqui e de um nivel, so para a troca de build.
- Trocar o `window.confirm` do «Apagar tudo»; link e QR (Fatia 2 da DEC-038).

## Armadilhas desta WO

- **`src/App.jsx`, `meta/CHANGELOG.md` e `meta/IDEAS.md` em CRLF** (`git ls-files --eol`). Ancoras de varias linhas: compare sem `\r` e grave em CRLF — o script por cercas de quatro crases das ultimas WOs serve.
- **Ordem dentro do arquivo:** a ancora da Ed. 7 (gaveta) contem `const entry = serializeBuild(build, name)`, e a Ed. 14 insere no `App` uma linha igual. Aplique na ordem numerada: com a 14 antes, a ancora da 7 deixa de ser unica.
- **A Ed. 11 remove o `useEffect` do `__loadBuild`; as Ed. 8 e 9 removem os dois usos.** Aplique as tres: sobra de qualquer uma deixa codigo morto.

---

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `src/App.jsx`, `meta/CHANGELOG.md`, `meta/IDEAS.md` e esta WO. **Nao responde:** se a tela se comporta.
2. **Quem roda:** quem aplica. `npm run build` → **0 erros**. Erro → **PARE e reporte antes de commitar**. **Nao responde:** a tela.
3. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `tr -d '\r' < src/App.jsx | grep -c "__loadBuild"` → **0** (o `useEffect` e os dois usos sairam).
   - `tr -d '\r' < src/App.jsx | grep -c "^function UnsavedModal"` → **1**; `tr -d '\r' < src/App.jsx | grep -c "<UnsavedModal"` → **1**.
   - `tr -d '\r' < src/App.jsx | grep -c "onOpenBuild("` → **2** (`load` e `loadCode` da gaveta).
   - `tr -d '\r' < src/App.jsx | grep -c "persist(\[entry"` → **0** (o Salvar da gaveta passou a `onSave`).
   - `tr -d '\r' < src/App.jsx | grep -c "<Toast toast={toast} />"` → **1**.
   - `tr -d '\r' < meta/CHANGELOG.md | grep -c "^- \*\*Proteção da build aberta\*\*"` → **1**; `tr -d '\r' < meta/IDEAS.md | grep -c "^### 2026-11 — Salvar com um nome que já existe"` → **1**.
   Numeros medidos pelo chat numa copia do repositorio com as 19 edicoes aplicadas a partir do texto desta WO, onde o `vite build` passou (33 modulos).
   **Nao responde:** se a troca, o Desfazer e a pergunta acontecem na hora certa — passo 4.
4. **Quem roda:** o dono, na tela — roteiro entregue pelo chat no mesmo turno desta WO. Quem aplica nao faz conferencia visual.

## Relatorio de aplicacao

Os campos da skill `apply-wo` — a primeira linha diz o que entrou —, com a saida crua dos passos 1–3. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add src/App.jsx meta/CHANGELOG.md meta/IDEAS.md meta/workorders/261124-wo0042-fatia1-c-protecao-da-build.md
```

```
git commit -m "feat(saves): protege a build aberta com desfazer e salvar como antes de trocar" -m "WO C da Fatia 1 (spec 261117, secao C; DEC-038). Clique num salvo, carregar codigo e importar e abrir passam por uma porta unica no App: sem alteracao nao salva troca direto e oferece desfazer por 8 s; com alteracao pergunta antes (salvar como, abrir sem salvar, cancelar). O Salvar da gaveta usa a mesma regra do App. No modal da lista, a linha inteira marca e desmarca, pedido do dono. Sai o window.__loadBuild, orfao."
```

```
git push
```
