# wo0038 — Fatia 1, WO A: a lista de salvos sobe para o App, e os erros de `deserializeBuild` ganham codigo

**Data:** 2026-11-17 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de CODIGO (`src/App.jsx`, `src/logic.js`), **sem mudanca visivel**. Registro de documentos: o `/wrap`.
**Config sugerida:** Sonnet, `/effort` alto (toca `src/` e mexe no estado da gaveta).
**Pre-requisito:** `main` @ `e52d4e9` = `origin/main`, arvore limpa fora de `meta/specs/` (a spec, gravada pelo chat, que esta WO versiona).
**Base:** `meta/specs/261117-entrada-de-builds-fatia1.md`, aprovada pelo dono em 2026-11-17 («Aprovo a spec da Fatia 1 como está; escreva a WO A.»), passo 1 de «Passos». DEC-038.
**Depende de:** `wo0036` (`e452ce1`) e `wo0037` (`e52d4e9`).

> **Arquivos que o chat gravou no disco e esta WO versiona:**
> - `meta/specs/261117-entrada-de-builds-fatia1.md` — `2bcace58ec53d440942c15fc75e48822ab6cf7bd`
>
> **Edicao 0:** `sha1sum` no arquivo acima ANTES de tudo. Hash diferente → **PARE e reporte**.
>
> **Ancoras lidas em:** 2026-11-17, neste turno, do disco sem `\r`, recortadas por script (nao redigitadas). As de uma linha deram **1** ocorrencia com `grep -cxF`; a de varias linhas (Ed. 8) foi recortada do proprio arquivo, do `useState` dos salvos ate a linha antes do comentario `// Flash com posição fixa`.
> - Ed. 1 — `src/logic.js`, no comentario de `deserializeBuild` (o de `decodeBuild` tem `name?` e nao casa).
> - Ed. 2 — `src/logic.js`, dentro de `deserializeBuild`.
> - Ed. 3 — `src/logic.js`, dentro de `deserializeBuild`.
> - Ed. 4 — `src/logic.js`, dentro de `deserializeBuild`.
> - Ed. 5 — `src/logic.js`, no `catch` de `decodeBuild`.
> - Ed. 6 — `src/App.jsx`, o cabecalho da secao do `SaveDrawer`.
> - Ed. 7 — `src/App.jsx`, a assinatura do `SaveDrawer`.
> - Ed. 8 — `src/App.jsx`, o inicio do `SaveDrawer`, do `useState` dos salvos ate o fim de `persist` — ANCORA DE VARIAS LINHAS (27).
> - Ed. 9 — `src/App.jsx`, os `useState` do `App`.
> - Ed. 10 — `src/App.jsx`, as props do `<SaveDrawer` no `return` do `App`.
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo = CODE, pelo `/wrap`** (STATUS e log do dia). Esta WO nao toca CHANGELOG nem DECISIONS: nao ha mudanca visivel, e a decisao de subir o estado esta na spec, que ela versiona.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

A Fatia 1 precisa importar por arrasto com a gaveta FECHADA, e hoje a lista de salvos (`saves`), a leitura do `localStorage` e a gravacao vivem dentro do `SaveDrawer`. Esta WO tira esse estado da gaveta e o entrega pelo `App`, num hook (`useSavedBuilds`), sem mudar nada do que se ve. E da a `deserializeBuild` um codigo de erro estavel, que o modal da WO B vai traduzir para PT-BR e EN (D4 da analise). O aviso de rodape, que a spec punha aqui, passou para a WO B, onde e usado pela primeira vez.

## Inventario — de onde saiu a lista de edicoes

- **Quem le ou escreve a lista de salvos:** `grep -n "saves\|setSaves\|STORAGE_KEY" src/App.jsx` — tudo dentro do `SaveDrawer`: o `useState`, o `useEffect` de leitura, o `persist` e os usos de `saves` (save, remove, exportAll, importFile, o contador e o `saves.map` da lista). Os USOS ficam como estao: so a ORIGEM de `saves` muda (passa a vir por prop, com o mesmo nome). `setSaves` passa a existir so dentro do hook.
- **`return { ok: false` em `src/logic.js`:** **4** (tres em `deserializeBuild`, um em `decodeBuild`). Os quatro ganham `code`. O `if (!result.ok) return result;` de `decodeBuild` repassa o codigo de `deserializeBuild` sem mudanca.
- Se a sua contagem der outra, **PARE e reporte antes de editar**.

---

## Edicao 1 — `src/logic.js` · `deserializeBuild` documenta o codigo

**Ancora** (no comentario de `deserializeBuild` (o de `decodeBuild` tem `name?` e nao casa)):

```
 * @returns {{ ok: boolean, build?: Object, error?: string }}
```

**Substituir por:**

```
 * @returns {{ ok: boolean, build?: Object, error?: string, code?: string }}
 *   code: 'not_got_legends' | 'bad_structure' | 'unknown_class' — estável, para a
 *   interface traduzir (análise 261116, D4); error segue em PT-BR, como antes.
```

## Edicao 2 — `src/logic.js` · codigo do jogo errado

**Ancora** (dentro de `deserializeBuild`):

```
    return { ok: false, error: 'Arquivo inválido ou de jogo diferente.' };
```

**Substituir por:**

```
    return { ok: false, error: 'Arquivo inválido ou de jogo diferente.', code: 'not_got_legends' };
```

## Edicao 3 — `src/logic.js` · codigo da estrutura

**Ancora** (dentro de `deserializeBuild`):

```
    return { ok: false, error: 'Estrutura de build inválida.' };
```

**Substituir por:**

```
    return { ok: false, error: 'Estrutura de build inválida.', code: 'bad_structure' };
```

## Edicao 4 — `src/logic.js` · codigo da classe

**Ancora** (dentro de `deserializeBuild`):

```
    return { ok: false, error: `Classe desconhecida: ${saved.build.classId}` };
```

**Substituir por:**

```
    return { ok: false, error: `Classe desconhecida: ${saved.build.classId}`, code: 'unknown_class' };
```

## Edicao 5 — `src/logic.js` · codigo do codigo corrompido

**Ancora** (no `catch` de `decodeBuild`):

```
    return { ok: false, error: 'Código inválido ou corrompido.' };
```

**Substituir por:**

```
    return { ok: false, error: 'Código inválido ou corrompido.', code: 'bad_code' };
```

## Edicao 6 — `src/App.jsx` · o hook `useSavedBuilds`

**Ancora** (o cabecalho da secao do `SaveDrawer`):

```
// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
```

**Substituir por:**

```
// ─── useSavedBuilds — a lista de builds salvas e o localStorage ──
// Mora no App, e não na gaveta: o arrasto de .json (Fatia 1, WO B) precisa
// gravar com a gaveta fechada (spec 261117, «Decisões de design»).
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

  const writeSaves = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      return false
    }
    setSaves(list)
    return true
  }

  return { saves, writeSaves }
}

// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
```

## Edicao 7 — `src/App.jsx` · a gaveta recebe a lista

**Ancora** (a assinatura do `SaveDrawer`):

```
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName }) {
```

**Substituir por:**

```
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName, saves, writeSaves }) {
```

## Edicao 8 — `src/App.jsx` · a gaveta deixa de ser dona da lista

**Ancora** (o inicio do `SaveDrawer`, do `useState` dos salvos ate o fim de `persist` — ANCORA DE VARIAS LINHAS (27)):

```
  const [saves, setSaves]         = useState([])
  const [shareCode, setShareCode] = useState('')
  // Flash: string quando mensagem ativa, null quando silencioso
  const [flash, setFlash]         = useState(null)
  const fileRef = useRef()
  const STORAGE_KEY = 'gotlegends_v1_builds'

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSaves(JSON.parse(raw))
    } catch {}
  }, [])

  const persist = (list) => {
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
  }
```

**Substituir por:**

```
  const [shareCode, setShareCode] = useState('')
  // Flash: string quando mensagem ativa, null quando silencioso
  const [flash, setFlash]         = useState(null)
  const fileRef = useRef()

  // A lista e a gravação são do App (useSavedBuilds); aqui fica só o aviso
  // quando o navegador recusa gravar (análise 261116, D6).
  const persist = (list) => {
    if (writeSaves(list)) return true
    showFlash(lang === 'en' ? '✗ Could not write to browser storage' : '✗ Não foi possível gravar no navegador')
    return false
  }
```

## Edicao 9 — `src/App.jsx` · o `App` usa o hook

**Ancora** (os `useState` do `App`):

```
  const [theme,            setTheme]            = useState('dark')
```

**Substituir por:**

```
  const [theme,            setTheme]            = useState('dark')
  // Builds salvas: do App, não da gaveta — o arrasto da WO B grava com ela fechada
  const { saves, writeSaves } = useSavedBuilds()
```

## Edicao 10 — `src/App.jsx` · a lista chega na gaveta

**Ancora** (as props do `<SaveDrawer` no `return` do `App`):

```
        setBuildName={setBuildName}
```

**Substituir por:**

```
        setBuildName={setBuildName}
        saves={saves}
        writeSaves={writeSaves}
```

---

## Fora de escopo

- Qualquer mudanca de tela: modal, arrasto, aviso de rodape, Desfazer (WOs B e C).
- Traduzir os codigos de erro para texto — a WO B faz, onde o texto aparece.
- Mudar o que a gaveta faz com `saves` (salvar, remover, importar, exportar seguem identicos).

## Armadilhas desta WO

- **`src/App.jsx` e `src/logic.js` estao em CRLF na arvore de trabalho** (`git ls-files --eol`: `w/crlf`, medido em 2026-11-17). A Edicao 8 tem ancora de VARIAS linhas: compare sem o `\r` e preserve o CRLF ao gravar — o mesmo script por blocos da `wo0037` serve.
- **A ordem dos hooks no `App`:** a Edicao 9 poe `useSavedBuilds()` logo depois dos `useState`, antes do `Object.assign(T, …)` e de qualquer `useMemo`. Hook nao pode ficar dentro de `if` nem depois de `return`.
- **`showFlash` continua declarado depois de `persist`** no `SaveDrawer`. Nao e erro: `persist` so roda depois do corpo do componente ter executado.

---

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git diff --stat` mostra **exatamente** `src/App.jsx` e `src/logic.js`, mais `meta/specs/` e esta WO como `??`. **Nao responde:** se a gaveta se comporta igual.
2. **Quem roda:** quem aplica. `npm run build` → **0 erros**. Erro → **PARE e reporte antes de commitar**. **Nao responde:** a tela.
3. **Quem roda:** quem aplica. Contagens (unidade: LINHAS; `tr -d '\r'` antes):
   - `tr -d '\r' < src/App.jsx | grep -c "^const STORAGE_KEY"` → **1** e `tr -d '\r' < src/App.jsx | grep -c "^  const STORAGE_KEY"` → **0** (a chave saiu da gaveta e virou do modulo).
   - `tr -d '\r' < src/App.jsx | grep -c "localStorage.getItem"` → **1** (so a leitura do hook).
   - `tr -d '\r' < src/App.jsx | grep -c "setSaves"` → **3** (todas dentro de `useSavedBuilds`).
   - `tr -d '\r' < src/App.jsx | grep -c "useSavedBuilds"` → **4** (cabecalho da secao, a funcao, o comentario do `persist` da gaveta e a chamada no `App`).
   - `tr -d '\r' < src/App.jsx | grep -c "writeSaves"` → **8**.
   - `tr -d '\r' < src/logic.js | grep -c ", code: '"` → **4**.
   Numeros medidos pelo chat numa copia do repositorio com as 10 edicoes aplicadas a partir do texto desta WO.
   **Nao responde:** se a lista chega certa na gaveta — passo 5.
4. **Quem roda:** quem aplica. Prova de vida dos codigos, no Node do Git Bash, na raiz do repo (o `node -e "import('./src/logic.js')…"` funcionou na `wo0036`):
   ```
   node -e "import('./src/logic.js').then(L=>{const D=x=>L.deserializeBuild(x).code;const e=L.createEmptyBuild('ronin');const g=structuredClone(e);delete g.gear;console.log(D({game:'outro',build:e}),D({game:'got-legends',build:g}),D({game:'got-legends',build:{...e,classId:'nada'}}),L.decodeBuild('@@@').code,L.deserializeBuild({game:'got-legends',build:e}).ok)})"
   ```
   Esperado: `not_got_legends bad_structure unknown_class bad_code true`. Relate a linha crua. **Chega no ramo?** Sim: os tres `return` de `deserializeBuild` e o `catch` de `decodeBuild`. **Prova de vida:** antes desta WO, a mesma linha imprime `undefined undefined undefined undefined true`.
5. **Quem roda:** o dono, na tela — roteiro entregue pelo chat no mesmo turno desta WO. Quem aplica nao faz conferencia visual.

## Relatorio de aplicacao

Os campos da skill `apply-wo`, com a saida crua dos passos 1–4. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add src/App.jsx src/logic.js meta/specs/261117-entrada-de-builds-fatia1.md meta/workorders/261117-wo0038-fatia1-a-saves-no-app.md
```

```
git commit -m "refactor(saves): leva a lista de salvos para o App e da codigo aos erros de deserializeBuild" -m "WO A da Fatia 1 (spec 261117, DEC-038). A lista de builds salvas e a gravacao no localStorage saem do SaveDrawer para o hook useSavedBuilds no App, para o arrasto de .json gravar com a gaveta fechada. deserializeBuild e decodeBuild devolvem code estavel para a interface traduzir. Sem mudanca visivel. Versiona a spec."
```

```
git push
```
