# wo0048 — Registra a 1.1.0 conferida na tela e fecha a conversa

**Data:** 2026-11-26 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de DOC (`meta/STATUS.md`, `meta/IDEAS.md`, `logs/2026-11-26.md`). **Toca codigo do produto?** Nao. **Build:** nao precisa (so `meta/` e `logs/`; a rede e o `git diff`).
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `main` @ `2b59959` = `origin/main`, arvore limpa (fora esta WO).
**Base:** relato do dono em 2026-11-26 09:50: «wo0046 e wo0047 aplicadas e wrap feito; relatórios na pasta-pai; roteiro: 1–6 ok. Feche a conversa com o handoff.» Relatorios lidos inteiros pelo chat: `261126-0922-…-apply-wo0046.txt`, `261126-0944-…-apply-wo0047.txt`, `261126-0952-…-wrap-wo0047.txt`.
**Depende de:** `wo0047` e o `/wrap` dela (`2b59959`).

> **Ancoras lidas em:** 2026-11-26, neste turno, do disco sem `\r`, linha inteira, cada uma com **1** ocorrencia no arquivo:
> - Ed. 1 e Ed. 2 — `meta/STATUS.md`, as linhas 69 e 71 do backlog.
> - Ed. 3 — `meta/STATUS.md`, o «**Pendente:**» da ultima entrada de «Ultima Sessao» (linha 190, a ultima do arquivo).
> - Ed. 4 — `meta/IDEAS.md`, o titulo `### 2026-11-17 — Fim de linha se mede com o Git, não com o shell`.
> - Ed. 5 — `logs/2026-11-26.md`, a ultima linha (`- Escolher a próxima frente do backlog.`).
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao **e confira tambem o lado da ancora** (Ed. 2, 3 e 5 comecam pela propria ancora: «texto novo contido» sozinho nao prova nada — foi o engano da Ed. 11 da `wo0047`; ver «Armadilhas»).
>
> **Canal dos meta neste ciclo = CODE** (esta WO). **Ela faz o papel do fecho: NAO rode `/wrap` depois dela.**
>
> **Proximo comando:** nenhum. A conversa seguinte abre pelo `261126-HANDOFF-BRIEF.md` da pasta-pai.

---

## 1. Por que

Tres fatos so existiam no chat: o roteiro de tela 1–6 da `wo0047` deu certo, a tag e o link do README foram vistos no GitHub, e o chat achou um defeito proprio na `wo0047` (o marcador `CHECKS` sem preencher). Sem registro, nao existem para a proxima conversa. A WO tambem atualiza uma contagem velha do backlog e poe nele as duas perguntas que o brief de 2026-11-16 deixou abertas e nenhum arquivo guardou.

## Edicao 1 — `meta/STATUS.md` · contagem do DECISIONS no backlog

**Ancora:**

````
- [ ] **`DECISIONS.md` com 1.173 linhas** (limiar ~700): mover as entradas antigas para `DECISIONS-archive.md`. Curadoria do chat.
````

**Substituir por:**

````
- [ ] **`DECISIONS.md` com 1.293 linhas** `[medido pelo chat em 2026-11-26, wc -l]` (limiar ~700): mover as entradas antigas para `DECISIONS-archive.md`. Curadoria do chat.
````

## Edicao 2 — `meta/STATUS.md` · duas perguntas abertas entram no backlog

**Ancora** (o item da `/sondar`; ganha uma frase no fim, e as duas linhas novas entram DEPOIS dele):

````
- [ ] **Passada de defeitos e segurança por funcionalidade** (pedido do dono, 2026-11-16): uma `/sondar` por área, no Code. Ponto de partida medido em 2026-11-16: nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` em `src/`; as três entradas de dado externo passam por `JSON.parse` — os saves no `localStorage` (`App.jsx`), o arquivo importado (`App.jsx`) e o código Base64 (`logic.js`).
````

**Substituir por:**

````
- [ ] **Passada de defeitos e segurança por funcionalidade** (pedido do dono, 2026-11-16): uma `/sondar` por área, no Code. Ponto de partida medido em 2026-11-16: nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` em `src/`; as três entradas de dado externo passam por `JSON.parse` — os saves no `localStorage` (`App.jsx`), o arquivo importado (`App.jsx`) e o código Base64 (`logic.js`). Desde a 1.1.0 há uma quarta: o link `#b=` (`decodeBuildLink`, `logic.js`).
- [ ] **«💬 Última Sessão» voltou a crescer:** 18 entradas desde a reescrita de 2026-11-15 (contando a desta WO) `[medido pelo chat em 2026-11-26]`, contra o «rolante» do cabeçalho. Decidir: a `/wrap` passa a substituir a entrada anterior em vez de acrescentar, ou o chat enxuga a cada N entradas (movendo para `STATUS-archive.md`). Pergunta aberta desde o brief de 2026-11-16, só agora registrada.
- [ ] **`npm run deploy` no `package.json`:** quebra no Windows (DEC-016) e deixou de ser necessário com o workflow do GitHub Pages (DEC-037); segue no `deny` do `.claude/settings.json`. Remover o script ou mantê-lo — decisão do dono. Aberta desde o brief de 2026-11-16.
````

## Edicao 3 — `meta/STATUS.md` · entrada do chat em «Ultima Sessao»

**Ancora** (o «Pendente» da entrada da `wo0047`, ultima linha do arquivo; fica igual, a entrada nova vem DEPOIS):

````
**Pendente:** o dono conferir na tela — tema claro (▲▼, Exportar, Importar, Copiar link) e o ✗ do Texto com a área de transferência negada. O tema claro estava «não conferido na tela» no backlog e segue assim até essa conferência.
````

**Substituir por:**

````
**Pendente:** o dono conferir na tela — tema claro (▲▼, Exportar, Importar, Copiar link) e o ✗ do Texto com a área de transferência negada. O tema claro estava «não conferido na tela» no backlog e segue assim até essa conferência.

### 2026-11-26 — Chat: a 1.1.0 conferida na tela e a transferência de conversa (wo0048)

Fatos que só existiam no chat, com a origem:
- **Roteiro de tela da `wo0047`, itens 1–6: todos certos** — `[relatado pelo dono, 2026-11-26]`. No tema claro, «Exportar», «Importar» e «Copiar link» da gaveta e os −/+ das propriedades ficam claros, e voltam a escuros ao trocar o tema sem recarregar; «📋 Texto» mostra ✓ na cópia e ✗ na falha; o link do README abre «O Samurai Contra-Ataca» no site; a tag `v1.1.0` aparece no GitHub. **Fecha o «Pendente» da entrada acima.** Não testado: a falha da Imagem (difícil de provocar).
- **Tag `v1.1.0` no remoto** também `[medido por instrumento]`: `git ls-remote --tags origin v1.1.0` no relatório da `wo0046` (objeto `d399f1e`, apontando para `3cfe99e`).
- **Defeito do chat na `wo0047`:** o passo 3 da conferência saiu com o marcador `CHECKS` do gerador no lugar das contagens; o Code relatou e seguiu (o build e o `git diff --stat` cobriram). Regra em IDEAS, «🔧 Correções de processo».
- **Backlog:** contagem do `DECISIONS.md` atualizada; entram as duas perguntas abertas desde o brief de 2026-11-16 (`Última Sessão` crescendo e `npm run deploy`).
- **Transferência:** a conversa fecha aqui; a próxima abre pelo `261126-HANDOFF-BRIEF.md` da pasta-pai.

**Pendente:** escolher a próxima frente (backlog). Nada pendente de aplicação.
````

## Edicao 4 — `meta/IDEAS.md` · correcao de processo nova, no topo da secao

**Ancora** (o titulo da entrada mais nova de «🔧 Correções de processo»; fica igual, a entrada nova vem ANTES):

````
### 2026-11-17 — Fim de linha se mede com o Git, não com o shell
````

**Substituir por:**

````
### 2026-11-26 — Marcador do gerador que sobra na WO, e idempotência por prefixo

**O marcador.** O chat monta as WOs com um gerador que troca marcadores (`CHECKS` e outros) pelo texto final. Na `wo0047`, o do passo 3 da conferência não foi trocado e a WO saiu com a palavra `CHECKS` sozinha, sem contagens. A simulação não pegou porque lê só os blocos de âncora e texto novo, não a WO inteira. Sem dano: o Code relatou e conferiu pelo build e pelo `git diff --stat`.
**Regra que fica:** antes de entregar uma WO gerada, procure no texto final os marcadores do gerador (`grep -nE '\b[A-Z_]{4,}\b'` e olhar o que não é sigla conhecida). Faz parte da simulação, não de uma releitura opcional.

**A idempotência por prefixo.** A Ed. 11 da `wo0047` trocava `…/got-legends/` por `…/`: o texto novo era prefixo da âncora, e o script do Code concluiu «já aplicada» porque achou o texto novo no arquivo. Aplicou à mão.
**Regra que fica:** idempotência se confere pelos dois lados — o texto novo está lá **e** a âncora saiu. Quem escreve a WO avisa quando o texto novo contém a âncora ou é prefixo dela (a `wo0048` avisa).

### 2026-11-17 — Fim de linha se mede com o Git, não com o shell
````

## Edicao 5 — `logs/2026-11-26.md` · secao do chat no log do dia

**Ancora** (a ultima linha do arquivo; fica igual, a secao nova vem DEPOIS):

````
- Escolher a próxima frente do backlog.
````

**Substituir por:**

````
- Escolher a próxima frente do backlog.

---

## Raia do chat (wo0048, fecho da conversa)

### Feito
- `wo0046` (versão 1.1.0, tag `v1.1.0`) e `wo0047` (✗ em Texto e Imagem, tema claro, README) escritas, simuladas em sequência numa cópia (5 e 17 edições casaram; build verde, 33 módulos) e aplicadas pelo Code em `3cfe99e` e `9b8a42e`.
- Roteiro de tela 1–6 da `wo0047` certo `[relatado pelo dono]`; registrado no STATUS por esta WO.
- Brief de transferência `261126-HANDOFF-BRIEF.md` gravado na pasta-pai; o de 2026-11-16 e os relatórios absorvidos movidos para `notas-arquivadas\`.

### WOs entregues / aplicadas
- `261126-wo0048-fecho-da-conversa.md` — esta; faz o papel do fecho, sem `/wrap` depois.

### Aprendizados / armadilhas
- Marcador do gerador (`CHECKS`) sobrou na `wo0047`: a simulação passa a procurar marcadores no texto final. Idempotência se confere pelos dois lados. Ambos em IDEAS, «🔧 Correções de processo».

### Onde parei
Versão 1.1.0 cortada, conferida e publicada. Nada em curso, nada pendente de aplicação. Próxima frente a escolher no backlog do STATUS.
````

---

## Armadilhas desta WO

- **Fim de linha (medido com `git ls-files --eol`):** `meta/IDEAS.md` em CRLF; `logs/2026-11-26.md` em LF; `meta/STATUS.md` **misto** — 184 linhas em CRLF e a ultima entrada, acrescentada pelo `/wrap`, em LF. Grave cada trecho novo no fim de linha da linha-ancora: Ed. 1 e 2 em CRLF, Ed. 3 em LF, Ed. 4 em CRLF, Ed. 5 em LF. Nao normalize o STATUS.
- **Ed. 2, 3 e 5:** o texto novo COMECA pela ancora inteira (na Ed. 2, a ancora e prefixo da primeira linha nova). Procurar «texto novo contido» nao basta: confira que a linha nova inteira esta la e que a ancora sozinha, como linha completa, nao esta mais (Ed. 2) ou aparece **uma** vez seguida da linha nova (Ed. 3 e 5). Na Ed. 1 so a contagem muda no meio da linha: confira que `1.173` saiu.
- **Ed. 4:** a ancora e titulo `###`; o texto novo termina repetindo esse titulo — ele tem de continuar com **1** ocorrencia.

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `meta/STATUS.md`, `meta/IDEAS.md`, `logs/2026-11-26.md` e esta WO. **Nao responde:** se o texto ficou bom de ler.
2. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `meta/STATUS.md`: `grep -c "1.173 linhas"` → **0**; `grep -c "1.293 linhas"` → **1**; `grep -c "^### 2026-11-26 — Chat: a 1.1.0 conferida"` → **1**; `grep -c "^- \[ \] \*\*«💬 Última Sessão» voltou a crescer"` → **1**; `grep -c "^- \[ \] \*\*\`npm run deploy\`"` → **1**; `tail -1` → `**Pendente:** escolher a próxima frente (backlog). Nada pendente de aplicação.`
   - `meta/IDEAS.md`: `grep -c "^### 2026-11-26 — Marcador do gerador"` → **1**; `grep -c "^### 2026-11-17 — Fim de linha se mede com o Git"` → **1**
   - `logs/2026-11-26.md`: `grep -c "^## Raia do chat (wo0048"` → **1**; `grep -c "^- Escolher a próxima frente do backlog\.$"` → **1**
   - Fim de linha: `git ls-files --eol meta/IDEAS.md logs/2026-11-26.md meta/STATUS.md` → `w/crlf`, `w/lf`, `w/mixed` (os mesmos de antes).
3. **Quem roda:** quem aplica. `git -c core.autocrlf=true diff --stat` → tres arquivos de `meta/`/`logs/` mais a WO; no STATUS, **2** remocoes (a linha da contagem velha, Ed. 1, e a da `/sondar`, Ed. 2, que voltam reescritas); no IDEAS e no log, **0** remocoes. Nada em `src/`.

## Relatorio de aplicacao

Os campos da skill `apply-wo` — a primeira linha diz o que entrou —, com a saida crua dos passos 1–3. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add meta/STATUS.md meta/IDEAS.md logs/2026-11-26.md meta/workorders/261126-wo0048-fecho-da-conversa.md
```

```
git commit -m "docs(meta): registra a versao 1.1.0 conferida na tela e fecha a conversa" -m "Roteiro 1-6 da wo0047 ok, relatado pelo dono; backlog com a contagem do DECISIONS e duas perguntas abertas; correcao de processo do marcador CHECKS e da idempotencia por prefixo; secao do chat no log do dia."
```

```
git push
```
