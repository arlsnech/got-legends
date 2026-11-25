# wo0043 — Salvar por cima so em silencio para a build aberta; com o nome de outra, pergunta

**Data:** 2026-11-25 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de CODIGO (`src/App.jsx`) + registro (CHANGELOG, DECISIONS, IDEAS).
**Config sugerida:** Sonnet, `/effort` medio a alto (10 edicoes num arquivo, regra de estado).
**Pre-requisito:** `main` @ `ac2375f` = `origin/main`, arvore limpa (fora esta WO).
**Base:** pedido do dono na nota `../261124-0856.txt` e a proposta registrada no IDEAS pela `wo0042`, aprovada pelo dono em 2026-11-25 («Nome repetido ao salvar: aprovo a proposta (silencioso para a build aberta, pergunta para outra). Escreva a WO.»). Vira a DEC-040 (Ed. 12).
**Depende de:** `wo0042` (`c23c079`): usa `saveCurrent`, `doOpen`, `freeName` e o `showToast` com acao.

> **Ancoras lidas em:** 2026-11-25, neste turno, de `src/App.jsx` sem `\r`, recortadas por script. As de uma linha deram **1** ocorrencia com `grep -cxF`; a de varias linhas (Ed. 2) foi recortada do arquivo.
> - Ed. 1 — `src/App.jsx`, o cabecalho da secao do `SaveDrawer`.
> - Ed. 2 — `src/App.jsx`, dentro de `const save = () => {` da gaveta — ANCORA DE 6 LINHAS.
> - Ed. 3 — `src/App.jsx`, os `useState`/`useRef` do `App`, a linha do `pendingOpen`.
> - Ed. 4 — `src/App.jsx`, dentro de `doOpen`, a linha do `prev`.
> - Ed. 5 — `src/App.jsx`, dentro de `doOpen`.
> - Ed. 6 — `src/App.jsx`, dentro do `run` do Desfazer.
> - Ed. 7 — `src/App.jsx`, dentro de `saveCurrent`.
> - Ed. 8 — `src/App.jsx`, o comentario de `resolvePending` no `App`.
> - Ed. 9 — `src/App.jsx`, as props do `<SaveDrawer` no `return` do `App`.
> - Ed. 10 — `src/App.jsx`, o comentario da camada do arrasto no `return` do `App`.
> - Ed. 11 — `meta/CHANGELOG.md`, em `[Não lançado]` → `### Adicionado`, o ultimo item.
> - Ed. 12 — `meta/DECISIONS.md`, ultima linha do arquivo.
> - Ed. 13 — `meta/IDEAS.md`, «💡 Ideias Ativas — Usuário», a linha de status da entrada «Salvar com um nome que já existe».
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo = CODE.** CHANGELOG, DECISIONS e IDEAS aqui; STATUS e log do dia no `/wrap`.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

O Salvar da gaveta deduplica por nome e, com um nome repetido, substituia a outra build sem aviso. O dono aprovou a regra: por cima, em silencio, so a build que esta aberta; com o nome de OUTRA build salva, perguntar «Substituir» × «Salvar como "Nome (2)"» × «Cancelar». O `App` passa a lembrar o nome com que a build aberta foi aberta ou salva (`openedNameRef`), e a gaveta respeita a resposta (`'saved' | 'asked' | 'failed'`).

## Inventario

- **Quem grava pelo Salvar da gaveta:** so `save()` → `onSave`. Passa a `requestSave`, que chama o mesmo `saveCurrent`.
- **Quem muda o «nome aberto»:** `doOpen` (abre), `saveCurrent` (salva) e o `run` do Desfazer (devolve) — as Ed. 4–7. O «Salvar como…» do modal de alteracoes nao salvas usa `saveCurrent` e por isso tambem atualiza o nome; ele ja avisava antes de confirmar (WO C) e nao muda.

---

## Edicao 1 — `src/App.jsx` · o modal do nome repetido

**Ancora** (o cabecalho da secao do `SaveDrawer`):

````
// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
````

**Substituir por:**

````
/**
 * Salvar com o nome de OUTRA build salva (pedido do dono, 2026-11-24; DEC-040):
 * pergunta antes de substituir e oferece o próximo nome livre. Salvar por cima
 * da build que está aberta não passa por aqui — é a atualização normal.
 */
function NameConflictModal({ name, altName, lang, onReplace, onSaveAs, onCancel }) {
  const tx = (pt, en) => (lang === 'en' ? en : pt)

  // Esc cancela sem gravar
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
            {tx('Nome já usado', 'Name already in use')}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.45 }}>
            {tx(`Já existe outra build salva com o nome "${name}".`,
                `Another saved build is already named "${name}".`)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onCancel} style={plainBtn()}>{tx('Cancelar', 'Cancel')}</button>
            <button onClick={onReplace} style={btnAction(T.red)}>
              {tx(`Substituir "${name}"`, `Replace "${name}"`)}
            </button>
            <button autoFocus onClick={onSaveAs} style={btnAction(T.accent)}>
              {tx(`Salvar como "${altName}"`, `Save as "${altName}"`)}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
````

## Edicao 2 — `src/App.jsx` · o Salvar da gaveta respeita a resposta do App

**Ancora** (dentro de `const save = () => {` da gaveta — ANCORA DE 6 LINHAS):

````
    // A gravação é do App (saveCurrent): ela também marca a build como salva,
    // que é o que a proteção da build aberta lê (WO C, spec C8).
    if (!onSave(name)) {
      showFlash(lang === 'en' ? '✗ Could not write to browser storage' : '✗ Não foi possível gravar no navegador')
      return
    }
````

**Substituir por:**

````
    // A gravação e a regra do nome repetido são do App (requestSave, DEC-040): por cima,
    // em silêncio, só a build aberta; outra com o mesmo nome, o App pergunta e avisa.
    const result = onSave(name)
    if (result === 'asked') return
    if (result === 'failed') {
      showFlash(lang === 'en' ? '✗ Could not write to browser storage' : '✗ Não foi possível gravar no navegador')
      return
    }
````

## Edicao 3 — `src/App.jsx` · estado do nome da build aberta

**Ancora** (os `useState`/`useRef` do `App`, a linha do `pendingOpen`):

````
  const [pendingOpen, setPendingOpen] = useState(null)   // { build, name } ou null
````

**Substituir por:**

````
  const [pendingOpen, setPendingOpen] = useState(null)   // { build, name } ou null
  // Nome com que a build aberta foi aberta ou salva pela última vez: salvar por cima
  // dele é atualizar; por cima de outro nome, pergunta (DEC-040)
  const openedNameRef = useRef(null)
  const [nameConflict, setNameConflict] = useState(null)   // { name, alt } ou null
````

## Edicao 4 — `src/App.jsx` · o Desfazer guarda o nome aberto

**Ancora** (dentro de `doOpen`, a linha do `prev`):

````
    const prev = { build, name: buildName, baseline: baselineRef.current }
````

**Substituir por:**

````
    const prev = { build, name: buildName, baseline: baselineRef.current, opened: openedNameRef.current }
````

## Edicao 5 — `src/App.jsx` · abrir define o nome aberto

**Ancora** (dentro de `doOpen`):

````
    baselineRef.current = JSON.stringify(next)
````

**Substituir por:**

````
    baselineRef.current = JSON.stringify(next)
    openedNameRef.current = name || null
````

## Edicao 6 — `src/App.jsx` · desfazer devolve o nome aberto

**Ancora** (dentro do `run` do Desfazer):

````
        baselineRef.current = prev.baseline
````

**Substituir por:**

````
        baselineRef.current = prev.baseline
        openedNameRef.current = prev.opened
````

## Edicao 7 — `src/App.jsx` · salvar define o nome aberto

**Ancora** (dentro de `saveCurrent`):

````
    baselineRef.current = JSON.stringify(build)
````

**Substituir por:**

````
    baselineRef.current = JSON.stringify(build)
    openedNameRef.current = name
````

## Edicao 8 — `src/App.jsx` · as funcoes da regra

**Ancora** (o comentario de `resolvePending` no `App`):

````
  /** Resposta do modal de alterações não salvas: com nome, salva antes de abrir (C4); sem, só abre (C5). */
````

**Substituir por:**

````
  /**
   * O Salvar da gaveta (DEC-040). Por cima, em silêncio, só a build que está
   * aberta — quem carregou, editou e salvou está atualizando. Com o nome de
   * OUTRA build salva, pergunta («Substituir» × «Salvar como "Nome (2)"»).
   * @returns {'saved'|'asked'|'failed'}
   */
  const requestSave = (name) => {
    const taken = saves.some(s => s.name === name)
    if (taken && name !== openedNameRef.current) {
      setNameConflict({ name, alt: freeName(name, new Set(saves.map(s => s.name))) })
      return 'asked'
    }
    return saveCurrent(name) ? 'saved' : 'failed'
  }

  /** Resposta do modal de nome repetido: grava com o nome escolhido e o põe no campo. */
  const resolveConflict = (finalName) => {
    setNameConflict(null)
    if (!saveCurrent(finalName)) {
      showToast(tl('✗ Não foi possível gravar no navegador', '✗ Could not write to browser storage'))
      return
    }
    setBuildName(finalName)
    showToast(tl(`✓ "${finalName}" salvo`, `✓ "${finalName}" saved`))
  }

  /** Resposta do modal de alterações não salvas: com nome, salva antes de abrir (C4); sem, só abre (C5). */
````

## Edicao 9 — `src/App.jsx` · a gaveta usa a regra

**Ancora** (as props do `<SaveDrawer` no `return` do `App`):

````
        onSave={saveCurrent}
````

**Substituir por:**

````
        onSave={requestSave}
````

## Edicao 10 — `src/App.jsx` · o modal no `return`

**Ancora** (o comentario da camada do arrasto no `return` do `App`):

````
      {/* Camada do arrasto e aviso de rodapé (WO B) */}
````

**Substituir por:**

````
      {/* Nome repetido ao salvar pela gaveta (DEC-040) */}
      {nameConflict && (
        <NameConflictModal
          name={nameConflict.name}
          altName={nameConflict.alt}
          lang={lang}
          onReplace={() => resolveConflict(nameConflict.name)}
          onSaveAs={() => resolveConflict(nameConflict.alt)}
          onCancel={() => setNameConflict(null)}
        />
      )}

      {/* Camada do arrasto e aviso de rodapé (WO B) */}
````

## Edicao 11 — `meta/CHANGELOG.md` · o que o usuario ve

**Ancora** (em `[Não lançado]` → `### Adicionado`, o ultimo item):

````
- **No modal da lista, a linha inteira marca e desmarca**, não só o quadradinho (pedido do dono).
````

**Substituir por:**

````
- **No modal da lista, a linha inteira marca e desmarca**, não só o quadradinho (pedido do dono).
- **Salvar com o nome de outra build já salva pergunta antes** (DEC-040): «Substituir "X"» ou «Salvar como "X (2)"». Salvar por cima da build que está aberta continua direto, como atualização. Antes, o Salvar com nome repetido substituía a outra build sem aviso.
````

## Edicao 12 — `meta/DECISIONS.md` · DEC-040

**Ancora** (ultima linha do arquivo):

````
- As Instruções coladas no painel do Projeto estão anteriores ao `9326145` (a fusão de 2026-11-15): o painel não tem a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)`. A Fatia 2 entrega o arquivo novo, e o dono cola no painel.
````

**Substituir por:**

````
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
````

## Edicao 13 — `meta/IDEAS.md` · a ideia foi decidida

**Ancora** («💡 Ideias Ativas — Usuário», a linha de status da entrada «Salvar com um nome que já existe»):

````
**Status (2026-11-24):** proposta do assistente aguardando decisão do dono `[proposto pelo assistente]`.
````

**Substituir por:**

````
**Status (2026-11-25):** aprovada pelo dono como proposta e implementada na `wo0043` (DEC-040).
````

---

## Fora de escopo

- Renomear um salvo pela gaveta; o `window.confirm` do «Apagar tudo»; a Fatia 2 da DEC-038.

## Armadilhas desta WO

- **CRLF:** `src/App.jsx`, `meta/CHANGELOG.md`, `meta/DECISIONS.md` e `meta/IDEAS.md` em CRLF na arvore. Compare sem `\r` e grave em CRLF — o script por cercas de quatro crases das ultimas WOs serve.
- **A Ed. 7 ancora em `    baselineRef.current = JSON.stringify(build)`** — linha inteira, quatro espacos. A linha do `if (baselineRef.current === null)` tem o mesmo trecho no meio e NAO casa como linha inteira.

---

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `src/App.jsx`, `meta/CHANGELOG.md`, `meta/DECISIONS.md`, `meta/IDEAS.md` e esta WO. **Nao responde:** a tela.
2. **Quem roda:** quem aplica. `npm run build` → **0 erros**. Erro → **PARE e reporte antes de commitar**.
3. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `tr -d '\r' < src/App.jsx | grep -c "^function NameConflictModal"` → **1**; `tr -d '\r' < src/App.jsx | grep -c "<NameConflictModal"` → **1**.
   - `tr -d '\r' < src/App.jsx | grep -c "openedNameRef.current"` → **5** (o `prev` e a atribuicao em `doOpen`, o Desfazer, `saveCurrent` e a comparacao em `requestSave`).
   - `tr -d '\r' < src/App.jsx | grep -c "onSave={requestSave}"` → **1**; `tr -d '\r' < src/App.jsx | grep -c "if (result === 'asked') return"` → **1**.
   - `tr -d '\r' < meta/DECISIONS.md | grep -c "^## DEC-040"` → **1**; `tr -d '\r' < meta/IDEAS.md | grep -c "^\*\*Status (2026-11-25):\*\* aprovada pelo dono como proposta"` → **1**; `tr -d '\r' < meta/CHANGELOG.md | grep -c "^- \*\*Salvar com o nome de outra build já salva"` → **1**.
   Numeros medidos pelo chat numa copia do repositorio com as 13 edicoes aplicadas a partir do texto desta WO, onde o `vite build` passou (33 modulos).
4. **Quem roda:** o dono, na tela — roteiro entregue pelo chat no mesmo turno desta WO.

## Relatorio de aplicacao

Os campos da skill `apply-wo` — a primeira linha diz o que entrou —, com a saida crua dos passos 1–3. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add src/App.jsx meta/CHANGELOG.md meta/DECISIONS.md meta/IDEAS.md meta/workorders/261125-wo0043-salvar-nome-repetido.md
```

```
git commit -m "feat(saves): pergunta antes de salvar com o nome de outra build" -m "DEC-040, pedido do dono. O Salvar da gaveta grava direto quando o nome e novo ou e o da build aberta; com o nome de outra build salva, abre um modal com substituir ou salvar como Nome (2). O App lembra o nome com que a build foi aberta ou salva, e o desfazer da troca o devolve."
```

```
git push
```
