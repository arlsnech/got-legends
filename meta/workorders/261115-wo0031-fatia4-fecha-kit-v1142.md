# wo0031 — Fatia 4 do kit v1.142.0: fecha o update, corrige a DEC-034 e versiona o STATUS reescrito

**Data:** 2026-11-15 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de DOC (registro). **Toca codigo do produto?** Nao. **Build:** dispensavel; a rede e o `git diff`.
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `v2-planner` @ `0125890`. Na arvore: os 10 arquivos abaixo, gravados pelo chat.
**Base:** inventario `../261115-fatia4-inventario.md` e decisoes do dono «A1-A6 sim, A7 na P5, B1 na P5, B2 manter»; P4 e P5 do handoff (DEC-034, STATUS).
**Depende de:** `wo0030` aplicada.

> **Arquivos que o chat gravou no disco e esta WO versiona** (sha1sum medido ao gravar):
> - `.claude/skills/apply-wo/SKILL.md` — `3ef507375cb477bb1c18ae7fa04c2f6bca865772`
> - `.claude/skills/wrap/SKILL.md` — `be621c085c3e692212184504258049ec1742667e`
> - `.claude/skills/sondar/SKILL.md` — `4ff10f4f76d5f6ecf547038253a1c68f893b93dc`
> - `meta/workorders/_TEMPLATE.md` — `d6c601ae18e7e02922228c2d16f0b4b398f9f0c1`
> - `CLAUDE.md` — `ceb3f9b5b8c1c90344b000626e9db99baeff95fb`
> - `.flatdropignore` — `597738181bff04217571000ee4ab64074e2adf83`
> - `meta/LOG-TEMPLATE.md` — `bf5f0e61e82614a4b271fa59eb35c78ccdd41969`
> - `meta/CONTEXT.md` — `7138b2ce33abe9df7d82440f313fa809cf0a75e7`
> - `meta/STATUS.md` — `382d751b20da7c5d15474d3d1b09de4983eca94d`
> - `meta/STATUS-archive.md` — `3c657c399740b25cdff7443c522f6d68f1e6c4c8`
>
> **Ancoras lidas em:** 2026-11-15, neste turno, direto do disco, por script que copiou cada linha (nao redigitada):
> - Edicao 1 — `meta/DECISIONS.md`, o paragrafo do Contexto da DEC-034 que comeca «A primeira (revogada em v1.106.0)» (1 ocorrencia).
> - Edicao 2 — `meta/IDEAS.md`, o titulo `## ✅ Concluídas` (1 ocorrencia, linha inteira).
> - Edicao 3 — `meta/IDEAS.md`, o ultimo bullet da leva de 2026-11-15 (1 ocorrencia).
> - Edicao 4 — `meta/CHANGELOG.md`, a linha da Fatia 3 dentro de `## [Não lançado]` (1 ocorrencia).
>
> **Ancora semantica:** se um trecho nao bater EXATAMENTE, **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo:** STATUS, STATUS-archive, CONTEXT, LOG-TEMPLATE, `CLAUDE.md`, skills, `_TEMPLATE.md`, `.flatdropignore` = CHAT (arquivo inteiro, ja gravado); DECISIONS, IDEAS e CHANGELOG = esta WO.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

Fecha o template-update v1.142.0 (os cinco carimbos passam a dizer v1.142.0) e adota as novidades A1–A6 do inventario. Junto, as duas pendencias do handoff: a premissa errada da DEC-034 (P4) e a reescrita do STATUS so com o presente (P5, com A7 e B1). O STATUS antigo nao foi apagado: as 254 linhas nao-vazias dele estao, sem edicao, no STATUS novo, no `meta/STATUS-archive.md` ou no CONTEXT (conferido pelo chat, linha a linha).

## Fora de escopo

- **Mover o pacote e a Carta 01 para `notas-arquivadas\`:** o chat ja moveu, depois de gravar.
- **O `.flatdropignore` NAO ganhou regra para o `STATUS-archive.md`**: o bloco e do editor do FlatDrop, e o arquivo so pesa no canal de reserva. Fica como opcao do dono.
- **O texto da DEC-034 nao e reescrito:** ganha uma nota de correcao logo abaixo do paragrafo da premissa. Entrada antiga nao se reescreve (cabecalho do DECISIONS).

## Edicao 0 — conferir os hashes

`sha1sum` em cada um dos 10 arquivos do cabecalho deve dar exatamente o valor listado. Diferente = outro escritor mexeu depois do chat: **PARE e reporte**.

## Edicao 1 — `meta/DECISIONS.md` · nota de correcao na DEC-034

**Ancora** (linha inteira):

```
A primeira (revogada em v1.106.0) mandava entregar sempre por arquivo completo, «nunca por blocos soltos para o usuário costurar à mão», e descrevia o usuário baixando arquivos e substituindo na pasta. A segunda (v1.104.0) mandava o assistente fechar a resposta com `add`/`commit`/`push` em três linhas, prontas para colar uma a uma.
```

**Substituir por** (a ancora, uma linha em branco, e a nota):

```
A primeira (revogada em v1.106.0) mandava entregar sempre por arquivo completo, «nunca por blocos soltos para o usuário costurar à mão», e descrevia o usuário baixando arquivos e substituindo na pasta. A segunda (v1.104.0) mandava o assistente fechar a resposta com `add`/`commit`/`push` em três linhas, prontas para colar uma a uma.

> **Correção da premissa (2026-11-15, DEC-035):** a linha que o kit revogou em v1.104.0 é a do **executor** — «Mostre o git diff e o bloco de commit», numa skill de fecho ou de aplicação —, e essa saiu da `/wrap` na `wo0028`. A seção «Commit pronto ao final» do CEREBRO **não** foi revogada: o kit a mantém para projeto sem executor e a **inverte** no modo Code. A decisão desta DEC segue valendo — neste projeto o chat não entrega bloco de commit —, mas pelo motivo certo, a inversão do modo Code, e não uma revogação. Desde a Fatia 3, o CEREBRO traz a seção do kit seguida da linha «Neste projeto a regra acima se inverte (DEC-034)».
```

## Edicao 2 — `meta/IDEAS.md` · secao «🛌 Adiadas» antes das Concluidas

**Ancora:**

```
## ✅ Concluídas
```

**Substituir por:**

```
## 🛌 Adiadas

> Decisão consciente de não fazer agora. Cada item com **o gatilho que a traz de volta** («quando o terceiro caso aparecer», «se o build passar de X»): ideia adiada sem gatilho é ideia perdida.

- _(nenhuma ainda — seção adotada do template v1.142.0 em 2026-11-15)_

---

## ✅ Concluídas
```

## Edicao 3 — `meta/IDEAS.md` · quatro itens na leva de 2026-11-15

**Ancora** (linha inteira):

```
- **O pacote não diz que «Fatia» de CEREBRO e Instruções não fecha o merge.** As skills, o `_TEMPLATE.md` de WO e os demais `template` do v1.142.0 ainda pedem comparação (os cinco carimbos devem dizer v1.142.0), então a pasta do pacote não pode ir para o arquivo morto ao fim da fusão dos dois `fusao`.
```

**Substituir por:**

```
- **O pacote não diz que «Fatia» de CEREBRO e Instruções não fecha o merge.** As skills, o `_TEMPLATE.md` de WO e os demais `template` do v1.142.0 ainda pedem comparação (os cinco carimbos devem dizer v1.142.0), então a pasta do pacote não pode ir para o arquivo morto ao fim da fusão dos dois `fusao`.
- **Desvio registrado — forma do feedback (B2 da Fatia 4):** o template põe uma seção «Feedback para o Kit» única no fim do IDEAS, com a nota «Fim do IDEAS»; aqui são levas datadas, uma por template-update, e «🔧 Correções de processo» por último. Mantido: as levas são relato datado, e reorganizá-las reescreveria o registro.
- **A `/wrap` do kit ainda usa «sessão» como cadência** — «o bloco da sessão anterior», «uma sessão futura vai ler». A revogação v1.106.0 trocou essa cadência por turno/conversa; a skill, que é lida antes de trabalhar, ficou para trás.
- **Comparar o pacote anterior com o novo barateou a Fatia 4.** O `diff` v1.138 × v1.142 mostrou que, fora o CEREBRO, mudaram 4 carimbos e um parágrafo; o resto do trabalho era dívida da v1.138, que comparara 4 de 21 arquivos. Sugestão: o `_UPDATE-PROMPT` mandar guardar o pacote anterior até o seguinte chegar, e começar por esse diff.
- **O `.flatdropignore` deste repo citava os marcadores do editor num comentário** (o de abertura e o de fecho do bloco) desde a v1.90; o aviso só chegou ao template depois. Aviso sobre algo que o próprio kit ensinou a escrever podia vir como correção obrigatória no manifesto, não só como comentário novo no template.
```

## Edicao 4 — `meta/CHANGELOG.md` · entrada no bloco de infraestrutura

**Ancora:**

```
- **Template-update do KCM v1.142.0, Fatia 3** (DEC-035) — CEREBRO e Instruções refeitos partindo do pacote, com o transplante do que é deste projeto; volta a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)`, perdida na fusão v1.138. Sem efeito no produto.
```

**Substituir por:**

```
- **Template-update do KCM v1.142.0, Fatia 3** (DEC-035) — CEREBRO e Instruções refeitos partindo do pacote, com o transplante do que é deste projeto; volta a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)`, perdida na fusão v1.138. Sem efeito no produto.
- **Template-update do KCM v1.142.0, Fatia 4 — fechamento** — carimbos v1.142.0 nas três skills e no molde de WO; `/apply-wo` grava o relatório também quando PARA; `/wrap` acrescenta ao log do dia que já existe e termina com o Próximo comando; `CLAUDE.md` ganhou «Quando eu pedir medição», «Push e relatório» e «Relatório em arquivo»; `.flatdropignore` deixou de citar os marcadores do editor num comentário; `IDEAS` ganhou «🛌 Adiadas»; `LOG-TEMPLATE` registra por gatilho de evento. `STATUS.md` reescrito só com o presente (o histórico foi para `meta/STATUS-archive.md`, sem edição; «Arquivos Críticos» foi para o CONTEXT). Corrigida a premissa da DEC-034. Sem efeito no produto.
```

## Armadilhas desta WO

- A Edicao 2 insere ACIMA da ancora, e o `---` que ja existe antes de `## ✅ Concluídas` fica: o resultado tem um `---` antes de «🛌 Adiadas» e outro antes de «✅ Concluídas».
- O STATUS novo cita a `wo0031` em «Em Progresso» e em «Pendente de Aplicacao». **O `/wrap` desta WO tira as duas linhas** (aplicada = saiu dali) e acrescenta a entrada do dia em «💬 Última Sessão», sem renomear o titulo.

## Depois de aplicar — conferencia antes do commit

Cada passo traz **quem roda**, **como chega la** e **qual pergunta ele NAO responde**.

1. **Os cinco carimbos.** Quem roda: quem aplica. Como: `grep -c "Kit de Contexto Universal v1.142.0" meta/CEREBRO.md .claude/skills/*/SKILL.md meta/workorders/_TEMPLATE.md` → **1** em cada um dos 5; e `grep -c "v1.138.0" .claude/skills/*/SKILL.md meta/workorders/_TEMPLATE.md` → **0** em cada.
   **Nao responde:** se o resto do texto das skills esta certo — isso e o `git diff`.
2. **Um bloco do editor so.** Quem roda: quem aplica. Como: `grep -c "flatdrop-editor" .flatdropignore` → **1**; `grep -c "^# <<<" .flatdropignore` → **1**.
   **Nao responde:** se o editor do FlatDrop le o arquivo certo — so o proximo salvamento dele dira.
3. **STATUS e o arquivo morto.** Quem roda: quem aplica. Como: `wc -l meta/STATUS.md meta/STATUS-archive.md` → **83** e **442**; `grep -c "## 💬 Última Sessão" meta/STATUS.md` → **1**; `grep -c "^## 📁 Arquivos Críticos" meta/CONTEXT.md meta/STATUS.md` → **1** e **0**.
   **Nao responde:** se o STATUS diz a verdade — isso e do dono.
4. **Entradas novas, uma de cada.** Quem roda: quem aplica. Como: `grep -c "Correção da premissa (2026-11-15" meta/DECISIONS.md` → **1**; `grep -c "^## 🛌 Adiadas" meta/IDEAS.md` → **1**; `grep -c "Fatia 4 — fechamento" meta/CHANGELOG.md` → **1**; `grep -c "Desvio registrado — forma do feedback" meta/IDEAS.md` → **1**.
   **Nao responde:** o merito do texto.

## Relatorio de aplicacao

Os campos que a skill `apply-wo` pede, com a saida crua dos passos 0 a 4.

## Commit — mensagem SEM acento

A propria WO entra no `git add`.

```
git add .claude/skills CLAUDE.md .flatdropignore meta/LOG-TEMPLATE.md meta/CONTEXT.md meta/STATUS.md meta/STATUS-archive.md meta/workorders/_TEMPLATE.md meta/DECISIONS.md meta/IDEAS.md meta/CHANGELOG.md meta/workorders/261115-wo0031-fatia4-fecha-kit-v1142.md
git commit -m "docs(meta): fecha o kit v1.142 (fatia 4), corrige a DEC-034 e reescreve o STATUS so com o presente"
git push
```
