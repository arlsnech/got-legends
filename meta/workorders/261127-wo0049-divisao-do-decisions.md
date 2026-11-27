# wo0049 — Divide o DECISIONS e registra a /sondar das entradas de dado

**Data:** 2026-11-27 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de DOC (`meta/`, `logs/`, `CLAUDE.md`). **Toca codigo do produto?** Nao. **Build:** nao precisa (a rede e o `git diff`).
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `main` @ `12eecef` = `origin/main`; fora desta WO, a arvore so tem os quatro arquivos da Edicao 0.
**Base:** pedido do dono em 2026-11-27 15:44: «Frente: dividir o DECISIONS agora, e a /sondar ja rodei no Code». Relatorio lido inteiro pelo chat: `../261127-1533-code-got-legends-planner-explore-entradas-de-dados.txt`.
**Depende de:** `wo0048` (`12eecef`).

> **Ancoras lidas em:** 2026-11-27, neste turno, do disco, linha inteira, cada uma com **1** ocorrencia como linha completa:
> - Ed. 1 — `meta/STATUS.md` linha 69 (CRLF); Ed. 2 — linha 71 (CRLF); Ed. 3 — linha 203, a ultima (LF).
> - Ed. 4 — `meta/CHANGELOG.md` linha 15 (CRLF).
> - Ed. 5 — `CLAUDE.md` linha 12 (CRLF).
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia pelos dois lados:** o texto novo esta la **e** a ancora saiu (Ed. 1, 2, 5) ou aparece **uma** vez seguida do texto novo (Ed. 3, 4, que comecam pela propria ancora).
>
> **Canal dos meta neste ciclo = CODE** (esta WO), menos os quatro arquivos da Ed. 0, gravados inteiros pelo chat. **Ela faz o papel do fecho: NAO rode `/wrap` depois dela.**
>
> **Proximo comando:** nenhum.

---

## 1. Por que

O `DECISIONS.md` tinha 1.293 linhas contra o alarme de ~700. O chat leu o arquivo inteiro e moveu, **sem editar**, as dez entradas cujo evento fechou ou que repetiam outra (lista e motivo no cabecalho do `DECISIONS-archive.md`); o vivo ficou com 1.052, porque o resto esta em vigor. A `/sondar` das quatro entradas de dado devolveu sete candidatos: o backlog troca o item «fazer a `/sondar`» pelos candidatos. O C7 (numero velho de linhas) se resolve aqui.

## Edicao 0 — conferir os arquivos gravados pelo chat

Rode `sha1sum` e compare. **Hash diferente → PARE e reporte** (outro escritor mexeu depois do chat).

````
c2934d46db0e62cd84e061707131f7d813549a11  meta/DECISIONS.md
658c0788175b6f94b76b13c9ccfa22e58abea4b2  meta/DECISIONS-archive.md
0a4c0c8ab37918ea40eceea333a06cce18495a82  meta/CONTEXT.md
920eb3b2b70fe547ac597780ec00257b9cc04c6f  logs/2026-11-27.md
````

`meta/DECISIONS-archive.md` e `logs/2026-11-27.md` sao novos (LF). `meta/DECISIONS.md` segue em CRLF, `meta/CONTEXT.md` em LF, como estavam.

## Edicao 1 — `meta/STATUS.md` · o item do DECISIONS sai; entra o C1

**Ancora:**

````
- [ ] **`DECISIONS.md` com 1.293 linhas** `[medido pelo chat em 2026-11-26, wc -l]` (limiar ~700): mover as entradas antigas para `DECISIONS-archive.md`. Curadoria do chat.
````

**Substituir por:**

````
- [ ] **C1 — saves do navegador lidos sem validação (provável tela quebrada)** `[hipótese do Code, /sondar de 2026-11-27, pela leitura do código; não reproduzida no navegador]`: `useSavedBuilds` faz `setSaves(JSON.parse(raw))` sem conferir que é uma lista de builds. Um valor como `null`, `{}` ou `[null]` na chave `gotlegends_v1_builds` faria `saves.length`/`saves.map` lançar erro no render, e não há `ErrorBoundary`: a tela inteira cairia. Conferir antes de consertar, **numa janela anônima** (o teste troca os saves).
````

## Edicao 2 — `meta/STATUS.md` · o item da /sondar vira os candidatos C2–C6

**Ancora:**

````
- [ ] **Passada de defeitos e segurança por funcionalidade** (pedido do dono, 2026-11-16): uma `/sondar` por área, no Code. Ponto de partida medido em 2026-11-16: nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` em `src/`; as três entradas de dado externo passam por `JSON.parse` — os saves no `localStorage` (`App.jsx`), o arquivo importado (`App.jsx`) e o código Base64 (`logic.js`). Desde a 1.1.0 há uma quarta: o link `#b=` (`decodeBuildLink`, `logic.js`).
````

**Substituir por:**

````
- [ ] **C2 — valor de propriedade fora da faixa passa ao abrir uma build** `[medido pelo Code, fuzz em Node, /sondar de 2026-11-27]`: em item não Magistral, `deserializeBuild` aceita `'abc'` (o dano vira `NaN`), `1e9`, `-500` e `'5'` (texto). Decisão do dono: descartar a propriedade com aviso, ou prender o valor à faixa mínima–máxima do item.
- [ ] **C3/C4 — só o link limpa id que não existe** `[medido pelo Code, /sondar de 2026-11-27]`: `dropUnknownIds` roda só em `decodeBuildLink`; o salvo e o `.json` importado não passam por ele. E ele não confere `ronin_breath`, `perk1`/`perk2`, `propId` nem `linkedClass`.
- [ ] **C5 — a mesma estatística em P1 e P2 do mesmo item é aceita na entrada** `[medido pelo Code, fuzz, /sondar de 2026-11-27]` (o dano dobra); o gerador 🎲 impede isso. Confirmar com o dono se o jogo permite.
- [ ] **C6 — o «~530 caracteres» do link não tem comando que o reproduza** `[medido pelo Code: build vazia dá 222]`. Não é defeito: falta o script que mede o link de N builds aleatórias.
- A passada de defeitos e segurança por área (pedido do dono, 2026-11-16) teve a primeira área feita: as quatro entradas de dado (`/sondar` de 2026-11-27). Sem achado: o prefixo `1.` não colide com o Base64 antigo, lixo no link sempre dá `bad_code` sem exceção, o link e o código do README abrem. Outras áreas, quando o dono pedir.
````

## Edicao 3 — `meta/STATUS.md` · entrada do chat em «Ultima Sessao»

**Ancora** (ultima linha do arquivo, em LF; fica igual, a entrada nova vem DEPOIS):

````
**Pendente:** escolher a próxima frente (backlog). Nada pendente de aplicação.
````

**Substituir por:**

````
**Pendente:** escolher a próxima frente (backlog). Nada pendente de aplicação.

### 2026-11-27 — Chat: o DECISIONS dividido e a /sondar das entradas de dado (wo0049)

- **`meta/DECISIONS.md` dividido** (curadoria do chat, critério por evento do CEREBRO): dez entradas foram movidas sem edição para `meta/DECISIONS-archive.md`, que diz o motivo de cada uma; o vivo passou de 1.293 para 1.052 linhas `[medido pelo chat, wc -l]`. Ficou acima do alarme de ~700 porque o resto está em vigor. **Fecha o item do backlog.**
- **`/sondar` das quatro entradas de dado** rodada pelo dono no Code `[relatório 261127-1533, pasta-pai]`: o backlog troca o item da passada pelos candidatos C1–C6. O C7 (número velho de linhas no `CLAUDE.md` e no CONTEXT) foi resolvido nesta WO.

**Pendente:** conferir o C1 numa janela anônima; decidir o C2 (descartar ou prender à faixa) e responder o C5.
````

## Edicao 4 — `meta/CHANGELOG.md` · Documentacao do [Nao lancado]

**Ancora** (fica igual; a linha nova vem DEPOIS):

````
- README: endereço local (`localhost:5173/`), estrutura do projeto, o sistema de saves e o link da build de exemplo.
````

**Substituir por:**

````
- README: endereço local (`localhost:5173/`), estrutura do projeto, o sistema de saves e o link da build de exemplo.
- `meta/DECISIONS.md` dividido: dez entradas de evento fechado foram para `meta/DECISIONS-archive.md`, sem edição. A numeração DEC/FIX é uma só para os dois arquivos.
````

## Edicao 5 — `CLAUDE.md` · tamanho do App.jsx (C7)

**Ancora:**

````
Quatro arquivos carregam tudo: `src/App.jsx` (UI inteira, ~2500 linhas), `src/data.js` (banco do jogo),
````

**Substituir por:**

````
Quatro arquivos carregam tudo: `src/App.jsx` (UI inteira, o maior arquivo), `src/data.js` (banco do jogo),
````

---

## Armadilhas desta WO

- **Fim de linha (medido com `git ls-files --eol` e por linha):** `meta/STATUS.md` e **misto** — Ed. 1 e 2 em CRLF (linhas 69 e 71), Ed. 3 em LF (a ultima). `meta/CHANGELOG.md` e `CLAUDE.md` em CRLF. Grave cada trecho no fim de linha da propria ancora. Nao normalize nenhum arquivo.
- **Ed. 3:** o STATUS tem duas linhas que comecam por `**Pendente:** escolher a próxima frente (backlog)` (186 e 203). A ancora e a linha 203 INTEIRA; a 186 continua com « e decidir se…» e nao casa como linha completa.
- **Ed. 2:** a ultima linha nova nao tem `- [ ]` de proposito: e registro do que a passada ja fez, nao tarefa.
- **Ed. 0:** os quatro arquivos ja estao no disco. Nao os reescreva nem «arrume» o fim de linha deles: o hash e o do byte gravado.

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `meta/DECISIONS.md`, `meta/DECISIONS-archive.md`, `meta/CONTEXT.md`, `logs/2026-11-27.md`, `meta/STATUS.md`, `meta/CHANGELOG.md`, `CLAUDE.md` e esta WO. Nada em `src/`.
2. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `meta/STATUS.md`: `grep -c "1.293 linhas\` \`\[medido pelo chat em 2026-11-26"` → **0**; `grep -c "^- \[ \] \*\*C[1-6]"` → **5** (C1, C2, C3/C4, C5, C6); `grep -c "Passada de defeitos e segurança por funcionalidade"` → **0**; `grep -c "^### 2026-11-27 — Chat: o DECISIONS dividido"` → **1**; `tail -1` → `**Pendente:** conferir o C1 numa janela anônima; decidir o C2 (descartar ou prender à faixa) e responder o C5.`
   - `meta/CHANGELOG.md`: `grep -c "DECISIONS-archive.md\`, sem edição"` → **1**.
   - `CLAUDE.md`: `grep -c "~2500 linhas"` → **0**; `grep -c "UI inteira, o maior arquivo"` → **1**.
   - `meta/DECISIONS.md` + `meta/DECISIONS-archive.md`: `grep -c "^## \(DEC\|FIX\)-"` → **44** e **10** (eram 54 juntos).
3. **Quem roda:** quem aplica. `git -c core.autocrlf=true diff --stat` → nada em `src/`. **Nao responde:** se o texto ficou bom de ler.

## Commit

````
docs(meta): divide o DECISIONS e registra a sondagem das entradas de dados
````

Depois do commit: `git push`. Relatorio em `../AAMMDD-HHMM-code-got-legends-planner-apply-wo0049.txt`.
