# wo0037 — Fecha a Fatia 0: roteiro de tela do dono, curadoria do STATUS e a medicao de fim de linha

**Data:** 2026-11-17 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de DOC (registro). **Toca codigo do produto?** Nao. **Build:** dispensavel; a rede e o `git diff`.
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `main` @ `c0118f4` = `origin/main`, arvore limpa (fora esta WO).
**Base:** turno de 2026-11-17 15:27 — o dono relatou «roteiro: 1–7 ok» para o roteiro de tela da `wo0036`; os dois relatorios da `wo0036` na pasta-pai (`261117-1015-…-apply-wo0036.txt`, `261117-1017-…-wrap-wo0036.txt`).
**Depende de:** `wo0036` aplicada (`e452ce1`) e o `/wrap` dela (`c0118f4`).

> **Ancoras lidas em:** 2026-11-17, neste turno, do disco (`tr -d '\r'` e linha inteira):
> - Ed. 1 — `meta/STATUS.md`, «🔧 Em Progresso»: `- **Produto:** nada em curso. A última mudança foi a `wo0027`, em 2026-08-24.`
> - Ed. 2 — `meta/STATUS.md`, «✅ Funcionando»: a linha que comeca `- `SaveDrawer`: salvar/carregar/excluir builds`
> - Ed. 3 — `meta/STATUS.md`, «📋 Backlog»: a linha que comeca `- [ ] **Próxima frente, escolhida pelo dono em 2026-11-16`
> - Ed. 4 — `meta/STATUS.md`, «📋 Backlog»: `- [ ] **Conferencia visual da wo0036 pelo dono** (ver «Ultima Sessao» abaixo).`
> - Ed. 5 — `meta/STATUS.md`, ultima linha do arquivo (o «Pendente» da entrada da Fatia 0)
> - Ed. 6 — `logs/2026-11-17.md`, ultima linha do arquivo: `- Dono confere a tela; depois WO da Fatia 1.`
> - Ed. 7 — `meta/IDEAS.md`, o titulo `## 🔧 Correções de processo`
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo = CODE** (esta WO). O chat nao gravou nenhum outro arquivo no repositorio.
>
> **Proximo comando:** nenhum. Esta WO ja faz o papel do fecho (STATUS e log do dia): **nao rode `/wrap` depois dela**, senao o STATUS ganha uma segunda entrada para o mesmo turno.

---

## 1. Por que

O dono conferiu a Fatia 0 na tela e relatou tudo certo; fato relatado no chat so existe depois de gravado, e com a origem marcada. O `/wrap` da `wo0036` deixou para o chat a curadoria de «Em Progresso» (que ainda citava a `wo0027`, de agosto) e de «Funcionando». E o relatorio da `wo0036` afirmou que `src/` e `meta/` estao em LF, o que o log do dia registrou como aprendizado — e e falso: remedido pelo chat neste turno, ver Edicao 7.

## 2. Contexto factual

- **[relatado pelo dono]** 2026-11-17: roteiro de tela da `wo0036`, itens 1–7, todos certos — nome acompanha a build carregada (salvo e codigo), o Salvar seguinte nao sobrescreve outra build, importar o `261117-teste-importacao.json` mostra «✓ 1 importadas, 1 ignoradas» (e «✓ 1 imported, 1 ignored» em EN) sem chip duplicado, Exportar baixa o arquivo.
- **Nao testado na tela:** o erro de armazenamento cheio, o `.json` sem nenhuma build valida e a tela com id de item inexistente (o roteiro dizia isso na secao «o que NAO testa»).
- **[medido pelo chat, 2026-11-17]** `git ls-files --eol`: `src/App.jsx` → `i/lf w/crlf`; `meta/STATUS.md` → `i/lf w/lf`. `grep -c $'\r$'`: `src/App.jsx` 3.611, `src/logic.js` 1.581, `meta/DECISIONS.md` 1.243, `meta/IDEAS.md` 295, `meta/STATUS.md` 0, `logs/2026-11-17.md` 0.
- **[deduzido, nao conferido]** a contagem 0 do relatorio da `wo0036` veio do instrumento (o `grep` do Git Bash), nao do arquivo.

## Edicao 1 — `meta/STATUS.md` · «Em Progresso» volta a dizer o agora

**Ancora** (linha inteira):

```
- **Produto:** nada em curso. A última mudança foi a `wo0027`, em 2026-08-24.
```

**Substituir por:**

```
- **Produto:** entrada e saída de builds (DEC-038). Fatia 0 aplicada (`wo0036`) e conferida na tela pelo dono em 2026-11-17; a Fatia 1 é a próxima, começando por uma spec em `meta/specs/`.
```

## Edicao 2 — `meta/STATUS.md` · «Funcionando» registra a Fatia 0

**Ancora** (linha inteira):

```
- `SaveDrawer`: salvar/carregar/excluir builds, exportar/importar JSON, código Base64
```

**Substituir por:**

```
- `SaveDrawer`: salvar/carregar/excluir builds, exportar/importar JSON, código Base64 — toda build que entra passa por `deserializeBuild` (forma mínima), carregar põe o nome da build no campo, e falha de gravação no navegador avisa em vez de mostrar ✓ (DEC-038)
```

## Edicao 3 — `meta/STATUS.md` · sai o item da analise, ja decidida

**Remover a linha inteira** (a analise virou a DEC-038; as Fatias 1 e 2 ja tem itens proprios no backlog):

```
- [ ] **Próxima frente, escolhida pelo dono em 2026-11-16: a análise de ENTRADA e SAÍDA de builds** — a primeira em `meta/analises/` (a pasta nasce com ela, junto com o `_TEMPLATE.md` do kit). Escopo: as vias de entrada (arrastar `.json` para a tela, código Base64, URL na query string, link curto, QR) e a gestão dos saves que elas pedem (importar escolhendo quais builds, exportar escolhendo quais, e filtrar/ordenar/agrupar a lista). Ideias e decisões preliminares do dono no `IDEAS.md`, sob «💡 Ideias Ativas — Usuário».
```

## Edicao 4 — `meta/STATUS.md` · sai a conferencia visual, feita

**Remover a linha inteira:**

```
- [ ] **Conferencia visual da wo0036 pelo dono** (ver «Ultima Sessao» abaixo).
```

## Edicao 5 — `meta/STATUS.md` · entrada do chat em «💬 Última Sessão»

**Ancora** (ultima linha do arquivo):

```
**Pendente:** o dono conferir na tela — carregar uma salva e ver o nome no campo; importar um `.json` com uma build quebrada (o aviso diz quantas ficaram de fora) e outro sem nenhuma valida (salvos intactos). Saves muito antigos nao foram conferidos contra a nova forma minima. As secoes «Em Progresso» e «Funcionando» do STATUS nao foram reescritas (curadoria do chat).
```

**Substituir por:**

```
**Pendente:** o dono conferir na tela — carregar uma salva e ver o nome no campo; importar um `.json` com uma build quebrada (o aviso diz quantas ficaram de fora) e outro sem nenhuma valida (salvos intactos). Saves muito antigos nao foram conferidos contra a nova forma minima. As secoes «Em Progresso» e «Funcionando» do STATUS nao foram reescritas (curadoria do chat).

### 2026-11-17 — Chat: a Fatia 0 conferida na tela (wo0037)

- **Roteiro de tela da `wo0036`, itens 1–7: todos certos** — `[relatado pelo dono]`. O nome acompanha a build carregada (salvo e código), o Salvar seguinte não sobrescreve outra build, a importação do arquivo de teste mostrou «✓ 1 importadas, 1 ignoradas» (e o equivalente em EN) sem chip duplicado, e o Exportar segue baixando. **Fecha o «Pendente» da entrada acima**, menos três casos que o roteiro declarou não testar: armazenamento cheio, `.json` sem nenhuma build válida e id de item inexistente na tela.
- «Em Progresso» e «Funcionando» atualizados (curadoria do chat).
- **Correção de registro:** o relatório da `wo0036` disse que `src/` e `meta/` estão em LF; estão em CRLF (`git ls-files --eol`, medido pelo chat). Ver IDEAS, «🔧 Correções de processo».

**Pendente:** a spec da Fatia 1 (próxima conversa ou próximo turno).
```

## Edicao 6 — `logs/2026-11-17.md` · secao do chat

**Ancora** (ultima linha do arquivo):

```
- Dono confere a tela; depois WO da Fatia 1.
```

**Substituir por:**

```
- Dono confere a tela; depois WO da Fatia 1.

## Chat — Fatia 0 conferida (wo0037)
- Roteiro de tela da wo0036, itens 1–7: todos certos `[relatado pelo dono]`. Não testados: armazenamento cheio, `.json` sem nenhuma válida, id inexistente na tela.
- **Correção do aprendizado acima:** os arquivos NÃO estão em LF. `git ls-files --eol src/App.jsx` → `w/crlf`, e `grep -c $'\r$'` conta 3.611 linhas com CR em `App.jsx` (medido pelo chat). Só `meta/STATUS.md` e este log, regravados pelo Code, estão em LF. Registro em IDEAS, «🔧 Correções de processo».
- STATUS: «Em Progresso» e «Funcionando» atualizados; saíram do backlog o item da análise (decidida) e a conferência visual (feita).
- Próximo: spec da Fatia 1 em `meta/specs/`.
```

## Edicao 7 — `meta/IDEAS.md` · correcao de processo nova, no topo da secao

**Ancora** (linha inteira):

```
## 🔧 Correções de processo
```

**Substituir por:**

```
## 🔧 Correções de processo

### 2026-11-17 — Fim de linha se mede com o Git, não com o shell

A `wo0036` avisou que `src/` e `meta/` estão em CRLF na árvore de trabalho. O relatório de aplicação disse que não («crlf=0 por wc/grep»), e o log do dia gravou isso como aprendizado. Remedido pelo chat no mesmo dia, com dois instrumentos que concordam: `git ls-files --eol src/App.jsx` → `i/lf w/crlf`, e `grep -c $'\r$'` → 3.611 linhas com CR em `App.jsx`, 1.581 em `logic.js`, 1.243 em `DECISIONS.md`. Só `STATUS.md` e o log do dia, regravados pelo Code, estão em LF. A causa da leitura errada não foi apurada (suspeita, não conferida: o `grep` do Git Bash não vê o `\r` como o do Linux). Sem dano: as âncoras de uma linha casam nos dois casos — e foi por isso que a WO as usou.

**Regra que fica:** fim de linha se mede com `git ls-files --eol <arquivo>`, que lê os bytes pelo próprio Git e não depende do shell. Contagem de `\r` que contradiz o `git ls-files --eol` acusa o instrumento, não o arquivo — e quem aplica relata a divergência como suspeita, não como correção da WO.
```

---

## Fora de escopo

- O numero de linhas do `DECISIONS.md` no backlog («1.173») esta defasado; a divisao dele e curadoria a parte, e o numero sai quando ela for feita.
- Nenhuma mudanca de codigo.

## Armadilhas desta WO

- **`meta/STATUS.md` e `logs/2026-11-17.md` estao em LF; `meta/IDEAS.md` esta em CRLF** (medido com `git ls-files --eol` / `grep -c $'\r$'`). Toda ancora e de uma linha so; preserve o fim de linha de cada arquivo.
- As Edicoes 3 e 4 REMOVEM linhas: a idempotencia delas e «a ancora nao esta mais no arquivo».

---

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git diff --stat` mostra **exatamente** `meta/STATUS.md`, `logs/2026-11-17.md`, `meta/IDEAS.md` (mais esta WO como `??`). **Nao responde:** se o texto relata certo o que o dono disse.
2. **Quem roda:** quem aplica. Contagens (unidade: LINHAS; `tr -d '\r'` antes):
   - `tr -d '\r' < meta/STATUS.md | grep -c "^- \[ \] \*\*Próxima frente, escolhida"` → **0**
   - `tr -d '\r' < meta/STATUS.md | grep -c "^- \[ \] \*\*Conferencia visual da wo0036"` → **0**
   - `tr -d '\r' < meta/STATUS.md | grep -c "^### 2026-11-17 — Chat: a Fatia 0 conferida"` → **1**
   - `tr -d '\r' < meta/STATUS.md | grep -c "^- \*\*Produto:\*\* nada em curso"` → **0**
   - `tr -d '\r' < logs/2026-11-17.md | grep -c "^## Chat — Fatia 0 conferida"` → **1**
   - `tr -d '\r' < meta/IDEAS.md | grep -c "^### 2026-11-17 — Fim de linha se mede com o Git"` → **1**
3. **Quem roda:** quem aplica. `git ls-files --eol meta/IDEAS.md meta/STATUS.md logs/2026-11-17.md` → `w/crlf`, `w/lf`, `w/lf` — o fim de linha de cada arquivo nao mudou com a edicao. **Nao responde:** nada sobre o conteudo.

## Relatorio de aplicacao

Os campos da skill `apply-wo`, com a saida crua dos passos 1–3. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add meta/STATUS.md logs/2026-11-17.md meta/IDEAS.md meta/workorders/261117-wo0037-fecha-fatia0.md
```

```
git commit -m "docs(meta): registra a Fatia 0 conferida na tela e corrige a medicao de fim de linha" -m "Roteiro de tela da wo0036 1-7 ok, relatado pelo dono. STATUS: Em Progresso e Funcionando atualizados, saem do backlog a analise decidida e a conferencia feita. O relatorio da wo0036 disse LF; git ls-files --eol mostra CRLF em src/ e meta/IDEAS e DECISIONS. Correcao de processo no IDEAS."
```

```
git push
```
