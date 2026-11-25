# wo0045 — Registra a entrada e saida de builds conferida na tela e cura o STATUS

**Data:** 2026-11-25 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de DOC (registro). **Toca codigo do produto?** Nao. **Build:** dispensavel; a rede e o `git diff`.
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `main` @ `b160e72` = `origin/main`, arvore limpa (fora esta WO).
**Base:** relatos do dono no chat: «roteiro: 1–15 ok» (WO B, 2026-11-24), «1–14 ok» (WO C), «1–9 ok» (WO D) e «1–10 ok, e o texto do item 7 coube no Discord» (Fatia 2, 2026-11-25). O STATUS deixado pelo `/wrap` da `wo0044` ainda dizia «sem conferencia de tela» para os quatro.
**Depende de:** `wo0044` e o `/wrap` dela (`b160e72`).

> **Ancoras lidas em:** 2026-11-25, neste turno, do disco sem `\r`, linha inteira, recortadas por script; cada uma com **1** ocorrencia:
> - Ed. 1 — `meta/STATUS.md`, «🔧 Em Progresso», a linha do produto.
> - Ed. 2 — `meta/STATUS.md`, «🔧 Em Progresso», a linha do kit.
> - Ed. 3 — `meta/STATUS.md`, «📋 Backlog».
> - Ed. 4 — `meta/STATUS.md`, «📋 Backlog».
> - Ed. 5 — `meta/STATUS.md`, «📋 Backlog».
> - Ed. 6 — `meta/STATUS.md`, «📋 Backlog».
> - Ed. 7 — `meta/STATUS.md`, ultima linha do arquivo (o «Pendente» da entrada da wo0044).
> - Ed. 8 — `logs/2026-11-25.md`, ultima linha do arquivo.
> - Ed. 9 — `meta/specs/261117-entrada-de-builds-fatia1.md`, a linha de status no topo.
> - Ed. 10 — `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md`, a linha de status no topo.
> - Ed. 11 — `meta/IDEAS.md`, o status da entrada «Importar build arrastando um `.json`».
> - Ed. 12 — `meta/IDEAS.md`, o status da entrada «Exportar só as builds escolhidas».
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga. Nas remocoes (Ed. 3–6), ja aplicada = a ancora nao esta mais no arquivo.
>
> **Canal dos meta neste ciclo = CODE** (esta WO). Ela ja faz o papel do fecho no STATUS e no log do dia.
>
> **Proximo comando:** nenhum. **Nao rode `/wrap` depois desta WO**, senao o STATUS ganha uma segunda entrada para o mesmo turno.

---

## 1. Por que

Fato relatado no chat so existe depois de gravado, e com a origem marcada. O dono conferiu na tela as WOs B, C e D e a Fatia 2 — o `/wrap` nao tinha como saber, e o STATUS seguiu dizendo o contrario. Esta WO grava os relatos, tira do backlog as quatro conferencias e o «colar as Instrucoes no painel» (feito: medido pelo chat pela sessao que abriu com o texto novo), e passa a analise e a spec a «Implementada».

## Edicao 1 — `meta/STATUS.md` · «Em Progresso»: a frente fechou

**Ancora** («🔧 Em Progresso», a linha do produto):

````
- **Produto:** entrada e saída de builds (DEC-038). Fatia 0 (`wo0036`) e WO A da Fatia 1 (`wo0038`) aplicadas e conferidas na tela pelo dono; WO B (`wo0041`, modal de lista, arrasto de `.json`, aviso de rodapé) aplicada em 2026-11-24 e **ainda sem conferência de tela**; WO C (`wo0042`, Desfazer, «Salvar como…» e linha inteira clicável no modal) aplicada em 2026-11-25 e **também sem conferência de tela** — com ela, a Fatia 1 está toda no código; a Fatia 2 (link `#b=`, `wo0044`, 2026-11-25) também está no código e **sem conferência de tela**. Spec da Fatia 1 em `meta/specs/261117-entrada-de-builds-fatia1.md`.
````

**Substituir por:**

````
- **Produto:** entrada e saída de builds (DEC-038) **concluída e conferida na tela pelo dono** — Fatia 0 (`wo0036`), Fatia 1 (`wo0038`, `wo0041`, `wo0042`), Fatia 2 (`wo0044`, o link `#b=`) e a regra do nome repetido ao salvar (`wo0043`, DEC-040). Nada em curso: próxima frente a escolher (ver backlog).
````

## Edicao 2 — `meta/STATUS.md` · «Em Progresso»: o painel ja tem as Instrucoes

**Ancora** («🔧 Em Progresso», a linha do kit):

````
- **Kit:** template-update v1.155.0 **fechado** (DEC-039) — Fatia 1 na `wo0039`, Fatia 2 na `wo0040`; os seis carimbos dizem v1.155.0. Falta só o dono colar as Instruções no painel (backlog).
````

**Substituir por:**

````
- **Kit:** template-update v1.155.0 **fechado** (DEC-039) — Fatia 1 na `wo0039`, Fatia 2 na `wo0040`; os seis carimbos dizem v1.155.0. As Instruções novas estão no painel do Projeto `[medido pelo chat em 2026-11-24: a sessão abriu com o texto que começa em «## Ritual de início de turno», com a linha do GIT_OPTIONAL_LOCKS=0]`.
````

## Edicao 3 — `meta/STATUS.md` · sai a conferencia da WO C, feita

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **Conferir na tela a WO C (`wo0042`)** — roteiro do chat (Desfazer por ~8 s, modal de alteração não salva, linha inteira do modal da lista).
````

## Edicao 4 — `meta/STATUS.md` · sai a conferencia da WO D, feita

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **Conferir na tela a WO D (`wo0043`, DEC-040)** — salvar com o nome de outra build abre o modal; por cima da build aberta grava direto; Esc cancela; Desfazer devolve o nome aberto.
````

## Edicao 5 — `meta/STATUS.md` · sai a conferencia da Fatia 2, feita

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **Conferir na tela a Fatia 2 (`wo0044`, DEC-038)** — «Copiar link» → colar o link numa aba nova: abre a build, `#b=` some da barra; link com alteração não salva abre a pergunta; código Base64 antigo ainda carrega no campo; link/código lixo mostra «✗ Link ou código inválido»; texto exportado termina com `Link:`.
````

## Edicao 6 — `meta/STATUS.md` · sai o colar das Instrucoes, feito

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **Colar as Instruções no painel do Projeto — agora:** o `INSTRUCOES-DO-PROJETO.md` fundido em 2026-11-24 (`wo0040`, 6.840 caracteres de texto). O painel está anterior ao `9326145` e não tem a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)` (DEC-039). Do dono.
````

## Edicao 7 — `meta/STATUS.md` · entrada do chat em «💬 Última Sessão»

**Ancora** (ultima linha do arquivo (o «Pendente» da entrada da wo0044)):

````
**Pendente:** conferência de tela pelo dono. Não conferido: propriedade/vantagem de item que existe (fora de escopo); o ✓ falso do Texto segue no backlog.
````

**Substituir por:**

````
**Pendente:** conferência de tela pelo dono. Não conferido: propriedade/vantagem de item que existe (fora de escopo); o ✓ falso do Texto segue no backlog.

### 2026-11-25 — Chat: entrada e saída de builds conferida na tela (wo0045)

Fatos que só existiam no chat, com a origem:
- **WO B (`wo0041`):** roteiro 1–15 ok — `[relatado pelo dono, 2026-11-24]`.
- **WO C (`wo0042`):** roteiro 1–14 ok — `[relatado pelo dono, 2026-11-25]`.
- **WO D (`wo0043`, DEC-040):** roteiro 1–9 ok — `[relatado pelo dono, 2026-11-25]`.
- **Fatia 2 (`wo0044`):** roteiro 1–10 ok, incluindo Safari e o site publicado; o texto exportado no nível Estatístico, com o link, **coube no limite de 2.000 caracteres do Discord** — `[relatado pelo dono, 2026-11-25]`. Era o item da tabela de Riscos da análise que o chat não conseguira medir.
- **Instruções no painel:** coladas `[medido pelo chat em 2026-11-24, pela sessão aberta com o texto novo]`. Sai do backlog.
- A análise `261116` e a spec da Fatia 1 passam a «Implementada». Sem mudança de código.

**Pendente:** escolher a próxima frente (backlog) e decidir se a entrada e saída de builds fecha a versão 1.1.0.
````

## Edicao 8 — `logs/2026-11-25.md` · secao do chat

**Ancora** (ultima linha do arquivo):

````
`main` = `origin/main` em `dcd5f77` (mais o commit deste wrap). Falta a conferência de tela pelo dono (WO B, C, D e Fatia 2).
````

**Substituir por:**

````
`main` = `origin/main` em `dcd5f77` (mais o commit deste wrap). Falta a conferência de tela pelo dono (WO B, C, D e Fatia 2).

## Chat — entrada e saída de builds conferida (wo0045)
- Roteiros de tela das WOs B, C, D e da Fatia 2: todos ok `[relatado pelo dono]`; o texto do Estatístico com o link coube no Discord.
- Instruções novas no painel do Projeto `[medido pelo chat em 2026-11-24]`.
- STATUS: «Em Progresso» e backlog atualizados; análise 261116 e spec da Fatia 1 → «Implementada».
````

## Edicao 9 — `meta/specs/261117-entrada-de-builds-fatia1.md` · status: implementada

**Ancora** (a linha de status no topo):

````
> **Status:** Aprovada pelo dono em 2026-11-17, como está. WO A = `wo0038`. Único ajuste depois da aprovação: o aviso de rodapé passou da WO A para a WO B, onde é usado pela primeira vez (na WO A seria código sem uso, impossível de conferir na tela).
````

**Substituir por:**

````
> **Status:** Implementada e conferida na tela pelo dono (2026-11-25) — WO A `wo0038`, WO B `wo0041`, WO C `wo0042`. Aprovada em 2026-11-17, como está. WO A = `wo0038`. Único ajuste depois da aprovação: o aviso de rodapé passou da WO A para a WO B, onde é usado pela primeira vez (na WO A seria código sem uso, impossível de conferir na tela).
````

## Edicao 10 — `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md` · status: implementada

**Ancora** (a linha de status no topo):

````
> **Status:** Decidida — em 2026-11-17 o dono aprovou o pacote como está (DEC-038). A Fatia 0 é a `wo0036`.
````

**Substituir por:**

````
> **Status:** Implementada — pacote aprovado pelo dono em 2026-11-17 (DEC-038): Fatia 0 `wo0036`, Fatia 1 `wo0038`/`wo0041`/`wo0042`, Fatia 2 `wo0044`; tudo conferido na tela pelo dono até 2026-11-25.
````

## Edicao 11 — `meta/IDEAS.md` · arrastar `.json`: implementada

**Ancora** (o status da entrada «Importar build arrastando um `.json`»):

````
**Status (2026-11-17):** aprovada na DEC-038, Fatia 1. Importar não abre nada por padrão — responde à pergunta em aberto do dono abaixo. A frase «todas passam pela mesma validação» era premissa e era falsa para o arquivo (análise, M1); a Fatia 0 a tornou verdadeira.
````

**Substituir por:**

````
**Status (2026-11-25):** implementada (`wo0041`, `wo0042`) e conferida na tela pelo dono. aprovada na DEC-038, Fatia 1. Importar não abre nada por padrão — responde à pergunta em aberto do dono abaixo. A frase «todas passam pela mesma validação» era premissa e era falsa para o arquivo (análise, M1); a Fatia 0 a tornou verdadeira.
````

## Edicao 12 — `meta/IDEAS.md` · exportar escolhidas: implementada

**Ancora** (o status da entrada «Exportar só as builds escolhidas»):

````
**Status (2026-11-17):** aprovada na DEC-038, Fatia 1 — o mesmo componente de lista da importação.
````

**Substituir por:**

````
**Status (2026-11-25):** implementada (`wo0041`) e conferida na tela pelo dono — o mesmo componente de lista da importação.
````

---

## Armadilhas desta WO

- **Fim de linha:** `meta/STATUS.md`, `logs/2026-11-25.md` e `meta/IDEAS.md` em CRLF; a spec e a analise em LF (`git ls-files --eol`, medido em 2026-11-25 — o STATUS voltou a CRLF desde a `wo0039`). Compare sem `\r` e preserve o fim de linha de cada arquivo.

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `meta/STATUS.md`, `logs/2026-11-25.md`, a spec, a analise, `meta/IDEAS.md` e esta WO. **Nao responde:** se o texto relata certo o que o dono disse.
2. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
   - `tr -d '\r' < meta/STATUS.md | grep -c "^- \[ \] \*\*Conferir na tela"` → **0**; `tr -d '\r' < meta/STATUS.md | grep -c "^- \[ \] \*\*Colar as Instruções"` → **0**
   - `tr -d '\r' < meta/STATUS.md | grep -c "^### 2026-11-25 — Chat: entrada e saída de builds conferida"` → **1**; `tr -d '\r' < meta/STATUS.md | grep -c "relatado pelo dono, 2026-11-2"` → **4**
   - `tr -d '\r' < logs/2026-11-25.md | grep -c "^## Chat — entrada e saída de builds conferida"` → **1**
   - `grep -c "^> \*\*Status:\*\* Implementada" meta/specs/261117-entrada-de-builds-fatia1.md meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md` → **1** e **1**
   - `tr -d '\r' < meta/IDEAS.md | grep -c "^\*\*Status (2026-11-25):\*\* implementada ("` → **2**
   Numeros medidos pelo chat numa copia com as 12 edicoes aplicadas a partir do texto desta WO.

## Relatorio de aplicacao

Os campos da skill `apply-wo` — a primeira linha diz o que entrou —, com a saida crua dos passos 1–2. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add meta/STATUS.md logs/2026-11-25.md meta/specs/261117-entrada-de-builds-fatia1.md meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md meta/IDEAS.md meta/workorders/261125-wo0045-registra-conferencias.md
```

```
git commit -m "docs(meta): registra a entrada e saida de builds conferida na tela pelo dono" -m "Roteiros das WOs B, C, D e da Fatia 2 ok, relatados pelo dono; o texto com o link coube no Discord. STATUS: Em Progresso e backlog curados, Instrucoes ja no painel. Analise 261116 e spec da Fatia 1 passam a Implementada."
```

```
git push
```
