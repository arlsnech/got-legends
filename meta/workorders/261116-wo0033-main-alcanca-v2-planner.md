# wo0033 — Leva a main ate a v2-planner (avanco rapido) e aposenta a v2-planner

**Data:** 2026-11-16 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** mista — WO de DOC + operacao de branch. **Toca codigo do produto?** Nao. **Build:** dispensavel (a arvore da `main` passa a ser a da `v2-planner`, que compilou na `wo0032`).
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** HEAD em `v2-planner` @ `b59c60e`, arvore limpa, `origin/v2-planner` = `b59c60e`; `main` = `origin/main` = `8a99244`, ancestral de `v2-planner` (`git merge-base --is-ancestor main v2-planner` sai 0), `git rev-list --count v2-planner..main` = **0**.
**Base:** decisao do dono em 2026-11-16: «Pode publicar» e «Main; aposenta a v2» (DEC-036).
**Depende de:** `wo0032` aplicada.

> **Ancoras lidas em:** 2026-11-16, neste turno, direto do disco, por script que copiou cada linha (nao redigitada):
> - Edicao 1 — `meta/DECISIONS.md`, ultima linha do arquivo (fim da DEC-035).
> - Edicao 2 — `meta/STATUS.md`, a linha de «Versão Atual» que comeca `**[1.0.0]** — 2026-11-15`.
> - Edicao 3 — `meta/STATUS.md`, o item de backlog que comeca `- [ ] **`main` × `v2-planner`:**`.
> - Edicao 4 — `meta/CHANGELOG.md`, a linha `_Nada ainda._` sob `## [Não lançado]` (1 ocorrencia).
>
> **Ancora semantica:** se um trecho nao bater EXATAMENTE, **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo:** CODE (esta WO). O chat nao gravou arquivo nenhum.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

A `main` esta parada desde 2026-07-22 e e ancestral direta da `v2-planner`: alcanca-la e um avanco rapido, sem conflito possivel. Com a 1.0.0 etiquetada, o dono decidiu trabalhar na `main` e aposentar a `v2-planner` (DEC-036).

## Fora de escopo

- **GitHub Pages / branch `gh-pages`.** Nao toque.
- **`npm run deploy`.** Nao rode. Se o Netlify publicar sozinho a partir do push da `main`, e esperado e autorizado.
- **Apagar a tag `v1.0.0` ou qualquer outra ref.** So a `v2-planner` sai.

## Ordem de execucao — importa

As edicoes de doc entram **primeiro, na `v2-planner`**, e so depois a `main` avanca. Assim o commit desta WO ja esta na `main`, e nenhum commit fica so na branch que vai ser apagada.

## Edicao 1 — `meta/DECISIONS.md` · DEC-036 no fim do arquivo

**Ancora** (ultima linha do arquivo):

```
- A premissa da DEC-034 sobre o «Commit pronto ao final» («revogado pelo kit») segue para correção à parte: o kit não o revogou, inverteu-o no modo Code.
```

**Substituir por** (a ancora, uma linha em branco, e a entrada nova):

```
- A premissa da DEC-034 sobre o «Commit pronto ao final» («revogado pelo kit») segue para correção à parte: o kit não o revogou, inverteu-o no modo Code.

---

## DEC-036 — A `main` volta a ser o branch de trabalho; a `v2-planner` é aposentada

**Data:** 2026-11-16 · **Status:** aceita · **Aplicada pela** `wo0033`

### Contexto
A `v2-planner` nasceu em 2026-07-22 a partir da `main`, para abrigar o estado atual da ferramenta sem mexer na `main` nem no site publicado. Desde então a `main` ficou parada em `8a99244`. Em 2026-11-16 ela estava 49 commits atrás e sem nenhum commit próprio — ancestral direta da `v2-planner` (medido com `git merge-base --is-ancestor` e `git rev-list --count` nos dois sentidos). A versão 1.0.0, etiquetada em 2026-11-15 (`v1.0.0`, `180f586`), tirou o motivo de manter os dois.

### Decisão
- A `main` alcança a `v2-planner` por **avanço rápido** (`git merge --ff-only`): nenhum commit novo, nenhuma reescrita de histórico.
- O trabalho passa a ser na `main`. A `v2-planner` é apagada no remoto e no local; a tag `v1.0.0` e o histórico inteiro continuam no Git.
- O push da `main` pode publicar a 1.0.0, caso o Netlify esteja ligado a ela — autorizado pelo dono.

### Alternativas consideradas
- **Seguir na `v2-planner` e avançar a `main` só a cada versão** — descartada: com um autor só e sem revisão, dois branches só multiplicam a pergunta «onde está o estado?».
- **Merge com commit** — desnecessário: a `main` não tinha nada próprio.

### Consequências
- Os relatos datados que citam a `v2-planner` (STATUS-archive, logs, DECISIONS, relatórios na pasta-pai, a entrada da 1.0.0 no CHANGELOG) ficam como estão: eram verdade quando escritos.
- O link do README aponta para o GitHub Pages (branch `gh-pages`, último deploy manual em 2026-04-21), que não muda com isto. Publicar lá continua sendo um passo à parte.
```

## Edicao 2 — `meta/STATUS.md` · Versao Atual

**Ancora:**

```
**[1.0.0]** — 2026-11-15 — primeira versão estável, com tag Git `v1.0.0` na `v2-planner`. Fecha F1–F3 do ROADMAP: planejador, exportação em texto e exportação em imagem (Fase 3, com painel de exportação reconstruído e custo do Supremo em pips). A `main` e o site publicado ainda não têm esta versão (ver backlog).
```

**Substituir por:**

```
**[1.0.0]** — 2026-11-15 — primeira versão estável, com tag Git `v1.0.0`. Fecha F1–F3 do ROADMAP: planejador, exportação em texto e exportação em imagem (Fase 3, com painel de exportação reconstruído e custo do Supremo em pips). Na `main` desde 2026-11-16, que voltou a ser o branch de trabalho (DEC-036).
```

## Edicao 3 — `meta/STATUS.md` · o item de backlog sai (decidido)

**Ancora** (linha inteira; remova-a, e nada mais):

```
- [ ] **`main` × `v2-planner`:** a `main` está 45 commits atrás e parada desde 2026-07-22 (medido em 2026-11-15). Decidir se é de propósito.
```

**Substituir por:** *(nada — a linha sai)*

## Edicao 4 — `meta/CHANGELOG.md` · Nao lancado ganha a entrada

**Ancora:**

```
_Nada ainda._
```

**Substituir por:**

```
### Infraestrutura de repositório
- **A `main` voltou a ser o branch de trabalho** (DEC-036): alcançou a `v2-planner` por avanço rápido, e a `v2-planner` foi aposentada.
```

## Conferencia das edicoes — antes do commit

Cada passo traz **quem roda**, **como chega la** e **qual pergunta ele NAO responde**.

1. Quem roda: quem aplica. Como: `grep -c "^## DEC-036" meta/DECISIONS.md` → **1**; `grep -c "v2-planner" meta/STATUS.md` → **1** (antes eram 3: saem a linha de versao e o item de backlog; fica a da entrada da `wo0032` em «💬 Última Sessão», que e relato); `grep -c "_Nada ainda._" meta/CHANGELOG.md` → **0**.
   **Nao responde:** o merito do texto.

## Commit na v2-planner — mensagem SEM acento

```
git add meta/DECISIONS.md meta/STATUS.md meta/CHANGELOG.md meta/workorders/261116-wo0033-main-alcanca-v2-planner.md
git commit -m "docs(meta): registra a main como branch de trabalho e aposenta a v2-planner (DEC-036)"
git push
```

## Operacao de branch — depois do push acima

Rode um comando por vez e confira a saida. **Qualquer saida diferente da esperada: PARE e reporte, nao improvise.**

```
git fetch origin
git checkout main
git merge --ff-only v2-planner
git push origin main
```

- O `merge` tem de dizer **Fast-forward**. Se recusar («Not possible to fast-forward»), a `main` ganhou commit proprio depois desta WO ter sido escrita: PARE.
- Depois do push: `git rev-parse main origin/main v2-planner` → os tres hashes **iguais**.

So entao aposente a `v2-planner`:

```
git branch -d v2-planner
git push origin --delete v2-planner
```

- Use `-d`, nunca `-D`: o `-d` recusa apagar branch com commit que nao esta na `main`, e essa recusa e a rede de seguranca. Se recusar: PARE.
- Conferencia final: `git branch -a` → so `main`, `remotes/origin/main`, `remotes/origin/HEAD -> origin/main` e `remotes/origin/gh-pages`; `git tag -l` → `v1.0.0`; `git status` → em `main`, limpo, «up to date with origin/main».
  **Nao responde:** se o Netlify publicou. Isso o dono confere no painel do Netlify.

**Permissoes:** `git checkout`, `git merge`, `git fetch` e `git branch` nao estao no `allow` do `.claude/settings.json`; o Code vai pedir aprovacao em cada um. Esperado.

## Relatorio de aplicacao

Os campos que a skill `apply-wo` pede, com a saida crua do passo de conferencia, do `merge` (a linha do Fast-forward), do `rev-parse` e da conferencia final. O `/wrap` seguinte ja roda na `main`.
