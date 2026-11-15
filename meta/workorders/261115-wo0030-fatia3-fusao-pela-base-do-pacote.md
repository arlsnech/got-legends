# wo0030 — Fatia 3 do kit v1.142.0: registra a fusao de CEREBRO e Instrucoes pela base do pacote

**Data:** 2026-11-15 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de DOC (registro). **Toca codigo do produto?** Nao. **Build:** dispensavel; a rede e o `git diff`.
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** `v2-planner` @ `cfca594`; `INSTRUCOES-DO-PROJETO.md` staged desde 2026-11-14; `logs/2026-11-15.md` nao versionado (fica para o `/wrap`).
**Base:** Carta 01 do KCM, inventario `../261115-fatia3-inventario.md`, decisoes do dono «D1a D2b D3a D4 manter D5 todos D6a» (DEC-035).
**Depende de:** `wo0029` aplicada.

> **Arquivos que o chat gravou no disco e esta WO versiona** (sha1sum medido ao gravar):
> - `meta/CEREBRO.md` — `1f3c87a0369ce2541ca91117e46d5b471384aa93`
> - `INSTRUCOES-DO-PROJETO.md` — `4469b44e356ab7d87e44071361a519d111c57193`
>
> **Ancoras lidas em:** 2026-11-15, neste turno, direto do disco, por script que copiou cada linha do arquivo (nao redigitada):
> - Edicao 1 — `meta/DECISIONS.md`, ultima linha do arquivo (fim da DEC-034).
> - Edicao 2 — `meta/CHANGELOG.md`, a linha da Fatia 2 dentro de `## [Não lançado]` (1 ocorrencia).
> - Edicao 3 — `meta/IDEAS.md`, o titulo `## 🔧 Correções de processo` (1 ocorrencia, linha inteira).
>
> **Ancora semantica:** se um trecho nao bater EXATAMENTE, **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga.
>
> **Canal dos meta neste ciclo:** CEREBRO e Instrucoes = CHAT (arquivo inteiro, ja gravado); DECISIONS, CHANGELOG, IDEAS = esta WO.
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

O kit v1.142.0 manda fundir CEREBRO e Instrucoes partindo do PACOTE e transplantando o que e do projeto. O chat
fez isso e gravou os dois arquivos; esta WO confere os hashes, registra a decisao (DEC-035), a entrada no
CHANGELOG e o feedback ao kit que a Carta 01 pediu, e commita o conjunto — incluindo as Instrucoes, staged desde ontem.

## Fora de escopo

- **Os demais arquivos do pacote v1.142.0** (skills, `_TEMPLATE.md` de WO, `CLAUDE.md`, `settings.json`, exclusoes, `template` de meta/). Proxima fatia. **A pasta `../261115-kcm-update-v1.142.0/` FICA na pasta-pai** — nao mova.
- **A correcao do texto da DEC-034** (P4 do handoff): a DEC-035 so aponta para ela.
- **O `STATUS.md`** e o log do dia: sao do `/wrap`.

## Edicao 0 — conferir os hashes

`sha1sum meta/CEREBRO.md INSTRUCOES-DO-PROJETO.md` deve dar exatamente os dois valores do cabecalho. Diferente = outro escritor mexeu depois do chat: **PARE e reporte**, nao commite por cima.

## Edicao 1 — `meta/DECISIONS.md` · DEC-035 no fim do arquivo

**Ancora** (ultima linha do arquivo):

```
- A Fatia 3 (merge dos 123 blocos do CEREBRO) escreve as âncoras contra o texto depois desta WO, não antes.
```

**Substituir por** (a ancora, uma linha em branco, e a entrada nova):

```
- A Fatia 3 (merge dos 123 blocos do CEREBRO) escreve as âncoras contra o texto depois desta WO, não antes.

---

## DEC-035 — Fatia 3 do kit v1.142.0: CEREBRO e Instruções fundidos partindo do pacote; autoria dos documentos registrada

**Data:** 2026-11-15 · **Origem:** Carta 01 do KCM (`261115-kcm-para-got-01-o-update-pela-base-do-pacote.md`), inventário `261115-fatia3-inventario.md` (pasta-pai) e as decisões D1–D6 do dono.

**Contexto.** As fusões v1.87, v1.90 e v1.138 partiram do CEREBRO vivo e enxertaram o pacote bloco a bloco. O merge só soma: a Fatia 3 planejava 50 blocos de um CEREBRO de 104 KB num vivo de 55 KB, e a fusão das Instruções perdeu a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)` — no turno seguinte, o chat rodou `git add`. O kit v1.142.0 passou a dizer de onde partir: do pacote.

**Decisão.**
- `meta/CEREBRO.md` e `INSTRUCOES-DO-PROJETO.md` passam a ser o arquivo do pacote v1.142.0 com o transplante do que é deste projeto. CEREBRO: 11 trechos (convenções, «Build e validação deste projeto», DEC-026, DEC-030 em dois lugares, bloco DEC-008, override do commit, ciclo de vida da WO, kit instalado, 4 itens em «Técnicas específicas deste projeto»). Instruções: título, convenções, DEC-008, armadilhas comprimidas, commit, Git Bash.
- Linhas do pacote cortadas — e só estas: no CEREBRO, «nomes em inglês» e «commit em PT-BR no imperativo» (colisões DEC-008 #1 e #2) e o marcador de seção vazia de «Técnicas»; nas Instruções, as mesmas duas convenções, o título genérico e «sem WO, ENTREGUE o `git commit` pronto» (DEC-034).
- **D1:** a seção «Commit pronto ao final» do pacote fica, seguida da linha «Neste projeto a regra acima se inverte (DEC-034)».
- **D2 — autoria:** o chat autora inteiros CEREBRO, CONTEXT, Instruções, GLOSSARY e análises, e muda por WO CHANGELOG, DECISIONS, IDEAS e ROADMAP; o Code (`/wrap`) escreve o STATUS rolante, a sua seção do log do dia e o código, e acrescenta DEC/FIX quando a decisão nasce na execução. A reescrita de fundo do STATUS é curadoria do chat, pontual. Ajusta o padrão «Um dono por documento» do pacote, que permite mudar a divisão desde que escrita.
- **D3:** nas Instruções, 6 das 23 armadilhas, comprimidas; a lista completa segue no CONTEXT.
- **D4:** «Correspondência entre projetos» entra pela base — a Carta 01 é exatamente esse caso.
- **D6:** «Kit de arranque» fica com o texto do pacote e uma nota «Neste repo (DEC-007)».

**Alternativas.** Continuar enxertando no vivo (a «WO enxuta» de `261115-0728.txt`): descartada pela carta. Base do pacote sem transplante: apagaria o que o projeto aprendeu.

**Consequências.**
- `GIT_OPTIONAL_LOCKS` volta ao CEREBRO e às Instruções.
- Saíram do vivo, porque o pacote agora cobre: a reescrita da Fatia 2 de «Como o assistente entrega», a seção «Ao final de cada conversa… arquivos completos» (modo sem executor) e o corolário «as Instruções não são arquivo do repo», que era falso.
- Instruções em 6.778 caracteres (`LC_ALL=C.UTF-8 wc -m`), teto 6.900.
- No próximo template-update a base é de novo o pacote; o transplante se acha pelas marcas «Neste projeto», pelo número de DEC e pelas duas seções próprias.
- A premissa da DEC-034 sobre o «Commit pronto ao final» («revogado pelo kit») segue para correção à parte: o kit não o revogou, inverteu-o no modo Code.
```

## Edicao 2 — `meta/CHANGELOG.md` · entrada no bloco de infraestrutura

**Ancora:**

```
- **Template-update do KCM v1.138.0, Fatia 2** (DEC-034) — duas linhas revogadas pelo kit saíram do CEREBRO: a entrega «arquivo completo para baixar, nunca blocos para costurar» e o «commit pronto ao final» em três linhas para colar. Ambas descreviam um projeto sem executor e sem pasta vinculada. Cadência de `sessão` trocada por `turno`/`conversa` em 34 pontos de 8 arquivos; 186 ocorrências preservadas por serem relato histórico, texto do kit corrente ou ponteiro de skill.
```

**Substituir por:**

```
- **Template-update do KCM v1.138.0, Fatia 2** (DEC-034) — duas linhas revogadas pelo kit saíram do CEREBRO: a entrega «arquivo completo para baixar, nunca blocos para costurar» e o «commit pronto ao final» em três linhas para colar. Ambas descreviam um projeto sem executor e sem pasta vinculada. Cadência de `sessão` trocada por `turno`/`conversa` em 34 pontos de 8 arquivos; 186 ocorrências preservadas por serem relato histórico, texto do kit corrente ou ponteiro de skill.
- **Template-update do KCM v1.142.0, Fatia 3** (DEC-035) — CEREBRO e Instruções refeitos partindo do pacote, com o transplante do que é deste projeto; volta a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)`, perdida na fusão v1.138. Sem efeito no produto.
```

## Edicao 3 — `meta/IDEAS.md` · leva nova de feedback ao kit, antes das correcoes de processo

**Ancora** (linha inteira):

```
## 🔧 Correções de processo
```

**Substituir por** (a leva nova, o divisor, e a ancora):

```
## 📌 Feedback para o Kit de Contexto — leva de 2026-11-15 (template-update v1.142.0, fusão pela base do pacote)

- **Custo da fusão pela base do pacote (pedido da Carta 01):** 2 turnos de chat — inventário num, gravação e WO noutro — e 1 WO (wo0030). Inventário: 93 linhas, ~8.800 caracteres, 11 trechos transplantados no CEREBRO e 2 linhas do pacote cortadas, ambas colisões já julgadas. O que barateou: comparar linha a linha por similaridade (vivo × pacote, limiar 0,6) em vez de ler os 104 KB — 149 das 259 linhas vivas saíram idênticas e não pediram juízo.
- **O que ela deixou passar, até aqui:** a lista de candidatos que veio na carta e no handoff estava meio errada — `taskkill` por PID, `LC_ALL=C.UTF-8 wc -m` e as 23 armadilhas não moravam no CEREBRO (`CLAUDE.md`, o próprio pacote e o CONTEXT). «Pista, não inventário» se confirmou. O resto só a aplicação e o uso dirão.
- **As Instruções do pacote com `Code sim` ainda mandam «sem WO, ENTREGUE o `git commit` pronto».** O CEREBRO do mesmo pacote inverte a regra no modo Code, e a tabela de revogação (v1.104.0) tira o bloco de commit do executor. Num projeto com executor, a linha das Instruções é a única regra do pacote que o transplante teve de cortar por mérito, não por colisão local.
- **O marcador `_(vazio — …)_` de «Técnicas específicas» conta como linha do pacote cortada** no inventário de corte. O manifesto podia dizer que marcador de seção vazia sai ao entrar o primeiro item e não entra na contagem.
- **O pacote não diz que «Fatia» de CEREBRO e Instruções não fecha o merge.** As skills, o `_TEMPLATE.md` de WO e os demais `template` do v1.142.0 ainda pedem comparação (os cinco carimbos devem dizer v1.142.0), então a pasta do pacote não pode ir para o arquivo morto ao fim da fusão dos dois `fusao`.

---

## 🔧 Correções de processo
```

## Armadilhas desta WO

- A Edicao 3 insere ACIMA da ancora; o `---` que ja existe antes da ancora fica, e passa a separar a leva de 07-27 da nova. Resultado esperado: dois `---` com a leva nova entre eles.
- O texto das Edicoes 1–3 tem acento: e conteudo dos meta/, nao mensagem de commit.

## Depois de aplicar — conferencia antes do commit

Cada passo traz **quem roda**, **como chega la** e **qual pergunta ele NAO responde**.

1. **Carimbo do kit no CEREBRO.** Quem roda: quem aplica. Como: `grep -c "Gerado pelo Kit de Contexto Universal v1.142.0" meta/CEREBRO.md` → **1**.
   **Nao responde:** os outros quatro carimbos (skills e `_TEMPLATE.md`), que sao da proxima fatia e hoje dizem v1.138.0.
2. **A linha perdida voltou.** Quem roda: quem aplica. Como: `grep -c GIT_OPTIONAL_LOCKS meta/CEREBRO.md INSTRUCOES-DO-PROJETO.md` → **1** e **1**.
   **Nao responde:** se o chat obedece a regra — so o uso dira.
3. **Instrucoes no teto.** Quem roda: quem aplica. Como: `LC_ALL=C.UTF-8 wc -m INSTRUCOES-DO-PROJETO.md` → **6778** (arvore de trabalho, LF).
   **Nao responde:** se o texto colado no painel do claude.ai e este — isso e do dono.
4. **Marcador do modo Code presente.** Quem roda: quem aplica. Como: `grep -c "^## Ao final da conversa, o assistente REGISTRA o que falta" meta/CEREBRO.md` → **1**.
   **Nao responde:** nada alem disso.
5. **Entradas novas, uma de cada.** Quem roda: quem aplica. Como: `grep -c "^## DEC-035" meta/DECISIONS.md` → **1**; `grep -c "Fatia 3\*\* (DEC-035)" meta/CHANGELOG.md` → **1**; `grep -c "leva de 2026-11-15" meta/IDEAS.md` → **1**.
   **Nao responde:** se o merito do texto esta certo — isso e do dono.
6. **Ponteiro intacto.** Quem roda: quem aplica. Como: `grep -c "## 💬 Última Sessão" meta/STATUS.md` → **1**.
   **Nao responde:** se a `/wrap` acha o bloco — a proxima execucao dela dira.

## Relatorio de aplicacao

Os campos que a skill `apply-wo` pede, com a saida crua dos passos 0 a 6.

## Commit — mensagem SEM acento

A propria WO entra no `git add`. `logs/2026-11-15.md` NAO entra aqui: e do `/wrap`.

```
git add INSTRUCOES-DO-PROJETO.md meta/CEREBRO.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/workorders/261115-wo0030-fatia3-fusao-pela-base-do-pacote.md
git commit -m "docs(meta): funde CEREBRO e Instrucoes do kit v1.142 partindo do pacote (fatia 3)"
git push
```
