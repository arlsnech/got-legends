# wo0034 — Publica o GitHub Pages por workflow e corrige o caminho-base dos icones

**Data:** 2026-11-16 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** mista — codigo (`src/icons.js`) + CI + registro. **Toca codigo do produto?** SIM, quatro linhas. **Build:** obrigatorio, duas vezes (passos 1 e 2).
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `main` @ `e159546`, arvore com so os dois arquivos abaixo e esta WO.
**Base:** pedido do dono em 2026-11-16 (workflow do GitHub Actions) e achado do chat ao ler `src/icons.js` (DEC-037).
**Depende de:** `wo0033` aplicada.

> **Arquivos que o chat gravou no disco e esta WO versiona** (sha1sum medido ao gravar):
> - `.github/workflows/deploy-gh-pages.yml` — `e8a6a45fde9a8f660af3483d27f1d22081f5a610` (novo)
> - `meta/CONTEXT.md` — `e323841f57aaec0e7ec0b6a0789b1f845c96c79a` (linha «Deploy»)
>
> **Ancoras lidas em:** 2026-11-16, neste turno, direto do disco, por script que copiou cada trecho (nao redigitado):
> - Edicao 1 — `src/icons.js`, linhas 8–11 (os quatro `const` de caminho-base, sob `// ─── BASE PATHS ───`).
> - Edicao 2 — `meta/DECISIONS.md`, ultima linha do arquivo (fim da DEC-036).
> - Edicao 3 — `meta/CHANGELOG.md`, o item da DEC-036 sob `## [Não lançado]`.
> - Edicao 4 — `meta/STATUS.md`, o ultimo item do backlog («Cópias soltas de `GUIA_COMPLETO*.md`»).
> - Edicao 5 — `meta/IDEAS.md`, a linha de descricao sob `### 2026-06 — Exportar build como link QR Code`.
>
> **Ancora semantica:** se um trecho nao bater EXATAMENTE, **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo:** CONTEXT = CHAT (ja gravado); DECISIONS, CHANGELOG, STATUS, IDEAS = esta WO.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

O GitHub Pages parou em 2026-04-21 porque e publicado a mao, e o `npm run deploy` quebra no Windows (DEC-016). O workflow resolve isso montando em Linux. Mas, sozinho, ele publicaria um app sem icones: `src/icons.js` usa caminhos absolutos (`/icons/...`), e o GitHub Pages serve em `/got-legends/`. As duas coisas entram juntas (DEC-037).

## Fora de escopo

- `src/v2/icons.js` e os demais snapshots em `src/v1..v4`: congelados, nao importados.
- A correcao do ✓ falso do botao Texto: so entra no backlog (Edicao 4).
- Configuracoes do repositorio no GitHub: a fonte do Pages continua a branch `gh-pages`.

## Edicao 0 — conferir os hashes

`sha1sum .github/workflows/deploy-gh-pages.yml meta/CONTEXT.md` → os dois valores do cabecalho. Diferente: **PARE e reporte**.

## Edicao 1 — `src/icons.js` · caminho-base pelo `BASE_URL`

**Ancora** (as quatro linhas, inteiras):

```
const G  = '/icons/gear/'          // gear: katanas, arcos, amuletos
const GW = '/icons/ghost_weapons/' // ghost weapons
const T  = '/icons/techniques/'    // técnicas e habilidades (PNG)
const CL = '/icons/class/'         // classes (SVG)
```

**Substituir por:**

```
// Prefixo do caminho-base do site: '/' na raiz (Netlify, Vercel, Cloudflare Pages) e
// '/got-legends/' no GitHub Pages (VITE_BASE_URL, ver vite.config.js e DEC-037). Caminho
// absoluto fixo ('/icons/...') quebrava todo icone de site servido fora da raiz.
const BASE = import.meta.env.BASE_URL
const G  = `${BASE}icons/gear/`          // gear: katanas, arcos, amuletos
const GW = `${BASE}icons/ghost_weapons/` // ghost weapons
const T  = `${BASE}icons/techniques/`    // técnicas e habilidades (PNG)
const CL = `${BASE}icons/class/`         // classes (SVG)
```

## Edicao 2 — `meta/DECISIONS.md` · DEC-037 no fim do arquivo

**Ancora** (ultima linha do arquivo):

```
- O link do README aponta para o GitHub Pages (branch `gh-pages`, último deploy manual em 2026-04-21), que não muda com isto. Publicar lá continua sendo um passo à parte.
```

**Substituir por** (a ancora, uma linha em branco, e a entrada nova):

```
- O link do README aponta para o GitHub Pages (branch `gh-pages`, último deploy manual em 2026-04-21), que não muda com isto. Publicar lá continua sendo um passo à parte.

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
```

## Edicao 3 — `meta/CHANGELOG.md` · Nao lancado

**Ancora:**

```
- **A `main` voltou a ser o branch de trabalho** (DEC-036): alcançou a `v2-planner` por avanço rápido, e a `v2-planner` foi aposentada.
```

**Substituir por:**

```
- **A `main` voltou a ser o branch de trabalho** (DEC-036): alcançou a `v2-planner` por avanço rápido, e a `v2-planner` foi aposentada.
- **O GitHub Pages volta a ser publicado, agora por workflow** (DEC-037): `.github/workflows/deploy-gh-pages.yml` monta a `main` em Linux a cada push e empurra o `dist/` para a `gh-pages`. Estava parado desde 2026-04-21.

### Corrigido
- Os ícones usavam caminho absoluto (`/icons/...`) e sumiriam em qualquer site servido fora da raiz, como o GitHub Pages (`/got-legends/`). Agora seguem o caminho-base do build (DEC-037).
```

## Edicao 4 — `meta/STATUS.md` · dois itens novos no backlog

**Ancora:**

```
- [ ] **Cópias soltas de `GUIA_COMPLETO*.md`** em `notas-arquivadas\` (pasta-pai): as duas têm o mesmo md5 (`7fa3bda4…`) que `meta/legacy/GUIA_COMPLETO_v4.md` no Git, antes de `c232da3` — que a tirou da árvore. O conteúdo está salvo no histórico; apagar ou manter é decisão do dono.
```

**Substituir por:**

```
- [ ] **Cópias soltas de `GUIA_COMPLETO*.md`** em `notas-arquivadas\` (pasta-pai): as duas têm o mesmo md5 (`7fa3bda4…`) que `meta/legacy/GUIA_COMPLETO_v4.md` no Git, antes de `c232da3` — que a tirou da árvore. O conteúdo está salvo no histórico; apagar ou manter é decisão do dono.
- [ ] **O botão Texto mostra ✓ mesmo quando a cópia falha** (`handleCopyText`, `App.jsx`: o `.catch` também chama `flash('txt')`). Quando falha, o que se cola é o texto anterior, sem aviso. Achado em 2026-11-16.
- [ ] **Passada de defeitos e segurança por funcionalidade** (pedido do dono, 2026-11-16): uma `/sondar` por área, no Code. Ponto de partida medido em 2026-11-16: nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` em `src/`; as três entradas de dado externo passam por `JSON.parse` — os saves no `localStorage` (`App.jsx`), o arquivo importado (`App.jsx`) e o código Base64 (`logic.js`).
```

## Edicao 5 — `meta/IDEAS.md` · ideia do dono: arrastar `.json` para importar

**Ancora:**

```
Gerar um QR Code da URL compartilhável direto na ferramenta para facilitar compartilhamento mobile.
```

**Substituir por:**

```
Gerar um QR Code da URL compartilhável direto na ferramenta para facilitar compartilhamento mobile.

### 2026-11 — Importar build arrastando um `.json` para a tela
Soltar o arquivo em qualquer ponto da ferramenta, com o painel lateral aberto ou não, carrega a build quando o arquivo for compatível — o mesmo caminho do «Importar JSON» do painel de saves. Vai para a análise de compartilhamento por link como mais uma via de ENTRADA de build: todas passam pela mesma validação (`deserializeBuild`). Lacunas a decidir lá: arquivo com várias builds (o export do painel é uma lista), substituir a build aberta com ou sem confirmação, e o aviso bilíngue de arquivo incompatível.
```

## Armadilhas desta WO

- **Git Bash converte `/got-legends/` em caminho do Windows** (`C:/Program Files/Git/got-legends/`) quando o valor comeca com `/`. No passo 1, o `MSYS_NO_PATHCONV=1` e obrigatorio — sem ele o teste passa por motivo errado ou falha por motivo errado. No runner do GitHub (Linux) isso nao existe.
- Nao suba servidor de preview para testar (A9: encerrar por nome mata todo Node). O passo 1 confere pelo bundle.
- `dist/` e ignorado pelo Git: os builds de teste nao entram no commit.

## Depois de aplicar — conferencia antes do commit

Cada passo traz **quem roda**, **como chega la** e **qual pergunta ele NAO responde**.

1. **O build do GitHub Pages leva o prefixo.** Quem roda: quem aplica. Como: `MSYS_NO_PATHCONV=1 VITE_BASE_URL=/got-legends/ npm run build` → sem erro; depois `grep -l "/got-legends/" dist/assets/*.js` → **pelo menos 1 arquivo**, e `grep -c "/got-legends/" dist/index.html` → **pelo menos 1**.
   **Nao responde:** se os icones carregam de fato no GitHub Pages — isso o dono ve no site, depois do deploy.
2. **O build da raiz continua igual.** Quem roda: quem aplica. Como: `npm run build` (sem a variavel) → sem erro; `grep -l "/got-legends/" dist/assets/*.js` → **nenhum arquivo**.
   **Nao responde:** se Netlify, Vercel e Cloudflare seguem bons — o proximo deploy deles dira; o caminho para eles e o mesmo de antes (`/icons/...`).
3. **Registros.** Quem roda: quem aplica. Como: `grep -c "^## DEC-037" meta/DECISIONS.md` → **1**; `grep -c "^### Corrigido" meta/CHANGELOG.md` → um a MAIS do que antes (rode antes e depois); `grep -c "Passada de defeitos e segurança" meta/STATUS.md` → **1**; `grep -c "arrastando um" meta/IDEAS.md` → **1**.
   **Nao responde:** o merito do texto.

## Commit — mensagem SEM acento

A propria WO entra no `git add`.

```
git add .github/workflows/deploy-gh-pages.yml src/icons.js meta/CONTEXT.md meta/DECISIONS.md meta/CHANGELOG.md meta/STATUS.md meta/IDEAS.md meta/workorders/261116-wo0034-github-pages-workflow.md
git commit -m "ci(pages): publica o GitHub Pages por workflow e corrige o caminho-base dos icones"
git push
```

O push dispara o workflow pela primeira vez. **Nao espere por ele no relatorio** — ao menos que haja `gh` autenticado; nesse caso, `gh run list --workflow deploy-gh-pages.yml -L 1` e diga o estado.

## Relatorio de aplicacao

Os campos que a skill `apply-wo` pede, com a saida crua dos passos 0 a 3.
