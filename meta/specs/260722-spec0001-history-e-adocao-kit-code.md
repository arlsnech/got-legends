# spec0001 — Renomeia HISTORICO → HISTORY e registra a adoção do kit KCM v1.73 / Claude Code

**Data:** 2026-07-22 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Escopo:** só `meta/`. Nenhum arquivo de código é tocado → **não precisa de build**; a rede é o `git diff`.

**Regras de execução:** localize cada âncora EXATAMENTE. Se UMA falhar, PARE e reporte qual — não aplique as outras pela metade, não chute lugar próximo. Não toque em nada fora das edições abaixo. Ao terminar: `git diff` → `git add` (incluindo ESTA spec) → `git commit` → `git push`.

---

## Edição 1 — Renomear o arquivo

Execute:

```
git mv meta/HISTORICO.md meta/HISTORY.md
```

Se o `git mv` falhar porque o arquivo não está rastreado, use `mv` simples e siga.

---

## Edição 2 — `meta/HISTORY.md` · título

**Âncora:**
```
# HISTORICO.md — Conhecimento Consolidado
```

**Substituir por:**
```
# HISTORY.md — Conhecimento Consolidado
```

---

## Edição 3 — `meta/CONTEXT.md` · convenção de commit

**Âncora:**
```
- **Commits:** imperativo curto em PT-BR (ex: `adiciona geração de imagem`).
```

**Substituir por:**
```
- **Commits:** Conventional Commits — `tipo(escopo): descricao` (`feat`, `fix`, `docs`, `refactor`, `chore`) — com a mensagem **SEM acento**, porque o CMD do Windows os corrompe. Ex.: `feat(export): adiciona geracao de imagem`. Ver DEC-010.
```

---

## Edição 4 — `meta/CONTEXT.md` · estrutura do projeto

**Âncora:**
```
├── package.json      — React 18 + Vite 5 + Tailwind
```

**Substituir por:**
```
├── meta/             — documentos de contexto (CEREBRO, CONTEXT, STATUS, DECISIONS,
│   │                   CHANGELOG, IDEAS, ROADMAP, GLOSSARY, HISTORY, LOG-TEMPLATE)
│   └── specs/        — specs de doc, aplicadas pelo Claude Code via /apply-spec
├── logs/             — logs de sessão (AAAA-MM-DD.md)
├── .claude/          — settings.json + skills /apply-spec e /wrap
├── CLAUDE.md         — guia raiz lido pelo Claude Code em todo turno
├── package.json      — React 18 + Vite 5 + Tailwind
```

---

## Edição 5 — `meta/STATUS.md` · separar «Quebrado» de «Pendente de Aplicação»

**Âncora:**
```
## ❌ Pendente de Aplicação (guias prontos, não aplicados ainda)
```

**Substituir por:**
```
## ❌ Quebrado / Com Problema

_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)

---

## ⏳ Pendente de Aplicação (guias prontos, não aplicados ainda)
```

---

## Edição 6 — `meta/STATUS.md` · última sessão

**Âncora (bloco inteiro, do `**2026-06-24**` até o fim do arquivo):**
```
**2026-06-24** — Sessão longa de desenvolvimento ativo. Construído do zero ao estado atual:
estrutura de 3 colunas, temas, drawer de saves, ícones SVG/PNG, Fase 2 (texto) completa.
Entregue guia completo da Fase 3 (imagem Canvas). Pendente: aplicar 4 correções do guia + Fase 3.
**Próximo passo:** o usuário aplica as correções do `GUIA_CORRECOES_FASE3.md` e confirma; então implementamos `generateBuildImage` completo em sessão dedicada.
```

**Substituir por:**
```
**2026-07-22** — Sessão de infraestrutura, sem mexer em código do produto. Recebido o template-update do KCM v1.73.0 e comparado item a item com os meta/ vivos. Adotados: `meta/CEREBRO.md` (adaptado a este projeto), Instruções do Projeto regeneradas, kit do Claude Code (`CLAUDE.md`, `.claude/settings.json`, skills `/apply-spec` e `/wrap`), `.flatdropignore` e união no `.gitignore`. `HISTORICO.md` renomeado para `HISTORY.md`. Registradas DEC-007 a DEC-010 e 9 itens de feedback ao kit.
**Próximo passo:** aplicar as 4 correções pendentes do guia da Fase 3 no `App.jsx` e implementar `generateBuildImage` — agora com o Claude Code, via spec, em sessão dedicada.

> Sessão anterior — **2026-06-27**: sessão de documentação (gerados os 10 arquivos do kit de contexto e o `GUIA_CORRECOES_FASE3.md`). Não alterou o `App.jsx`: verificado em 2026-07-22 que `src/App.jsx` é byte a byte idêntico a `src/v4/App.jsx` e não contém `generateBuildImage` nem `wrapperStyle` — ou seja, a Fase 3 e as 4 correções continuam de fato pendentes.
```

---

## Edição 7 — `meta/DECISIONS.md` · cabeçalho

**Âncora:**
```
> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> Não reescreva entradas antigas; se uma decisão for substituída, marque «SUPERADA por DEC-N».
```

**Substituir por:**
```
> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> Duas naturezas: **DEC** (decisões de arquitetura/design) e **FIX** (bugs graves resolvidos, para não repetir).
> Não reescreva entradas antigas; se uma decisão for substituída, marque «SUPERADA por DEC-N» e adicione a nova.
> Quando passar de ~700 linhas, mova as mais antigas para `DECISIONS-archive.md`.
```

---

## Edição 8 — `meta/DECISIONS.md` · novas entradas

**Acrescente ao FINAL do arquivo** (depois da última linha de FIX-005), exatamente:

```

---

## DEC-007 — Adoção do kit KCM v1.73 e do fluxo chat ↔ Claude Code

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O projeto foi montado com uma geração anterior do Kit de Contexto: existiam os nove documentos de `meta/`, mas não havia `CEREBRO.md` (comportamento do assistente), nem os arquivos de arranque do Claude Code, nem `.flatdropignore`. O upload achatado para o Projeto do Claude subia 34 arquivos / ~717 KB / ~183 mil tokens estimados, incluindo cinco cópias quase idênticas do `App.jsx` (`src/v1..v4` + `src/App.jsx`).

### Decisão
Adotar o template-update do KCM v1.73.0 com adaptação, não com substituição: `meta/CEREBRO.md` entra reescrito nas seções que colidiam com a prática do projeto; as Instruções do Projeto são regeneradas a partir do template mas especializadas; o kit do Claude Code (`CLAUDE.md`, `.claude/settings.json`, skills `/apply-spec` e `/wrap`) é instalado na raiz e versionado; `.flatdropignore` passa a excluir `logs/`, `meta/specs/`, `src/v1..v3/` e `src/v4/App.jsx` do mount.

Passa a valer o método de duas raias: o **chat** cura e autora documentos; o **Claude Code** executa código e aplica deltas de doc por **spec** em `meta/specs/`, com âncora semântica e a regra "se não achar, PARA".

### Alternativas consideradas
- **Manter tudo no chat** — foi o modo até aqui; produziu os `GUIA_*.md`, que exigem aplicação manual do usuário e são justamente o gargalo que deixou a Fase 3 parada desde junho.
- **Adotar o template inteiro sem adaptar** — regrediria convenções já estabelecidas (ver DEC-008) e reescreveria documentos vivos com placeholders vazios.

### Consequências
O `App.jsx` monolítico (~2500 linhas) passa a poder ser editado por âncora pelo Code, sem o usuário costurar código à mão. Em troca, o projeto ganha quatro arquivos de infraestrutura para manter e uma disciplina nova (uma spec por delta, um canal por doc por ciclo). Specs viram artefato versionado.

---

## DEC-008 — Template-update do KCM vale como sugestão quando colide com prática em vigor

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O `CEREBRO.md` e as Instruções que o kit gera são texto genérico de nicho, escritos sem conhecer esta obra. Duas linhas do template batiam de frente com o projeto: "nomes de arquivos, funções e variáveis em inglês" (o projeto usa IDs `snake_case` em PT-BR, espelhando `data.js`, e renomeá-los quebraria o mapeamento de ícones em silêncio) e "mensagens de commit no imperativo curto em PT-BR" (que o próprio CEREBRO contradiz na seção de commit, onde pede Conventional Commits).

### Decisão
Convenção genérica vinda de um template-update é **sugestão**, não ordem. O assistente não refatora o projeto para caber no template; adapta o CEREBRO e as Instruções para descreverem o que o projeto de fato faz, aponta a colisão, e registra o desvio aqui e em «Feedback para o Kit» no IDEAS. A regra ficou escrita no próprio `meta/CEREBRO.md`, na seção «Ao receber um template-update do KCM».

### Consequências
Atualizações futuras do kit são seguras de aplicar: o pior caso vira uma linha de feedback, não uma renomeação em massa. O custo é que o CEREBRO deste projeto diverge do template canônico — a divergência é intencional e está documentada.

---

## DEC-009 — `HISTORICO.md` renomeado para `HISTORY.md`

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O arquivo nasceu como `meta/HISTORICO.md`, mas o kit o chama de `HISTORY.md` em todos os lugares onde ele é referenciado (tabela «Como manter os documentos» do CEREBRO, lista de arquivos das Instruções, manifesto de update). Manter os dois nomes obrigaria a traduzir mentalmente a cada leitura.

### Decisão
Renomear para `meta/HISTORY.md` e alinhar o título interno. Verificado antes: o nome antigo não era citado por nenhum outro documento de `meta/` — só pelo próprio título e pelos arquivos gerados pelo FlatDrop (`_MANIFEST.md`, `_TREE.md`), que são regenerados a cada upload. O custo do rename era, portanto, quase zero.

### Consequências
Os nomes de `meta/` passam a bater 1:1 com o vocabulário do kit. O `_MANIFEST.md` do próximo flatdrop refletirá o nome novo sozinho.

---

## DEC-010 — Commits em Conventional Commits, sem acento

**Data:** 2026-07-22 · **Status:** aceita · **Supera:** a convenção informal registrada no CONTEXT ("imperativo curto em PT-BR")

### Contexto
O `CONTEXT.md` registrava commits no imperativo curto em PT-BR, com o exemplo `adiciona geração de imagem` — acentuado. O ambiente de trabalho é Windows/CMD, que corrompe acentos em mensagem de commit, e o CEREBRO do kit pede Conventional Commits no bloco de fechamento.

### Decisão
`tipo(escopo): descricao`, tipos `feat` / `fix` / `docs` / `refactor` / `chore`, mensagem **sem acento**. Ex.: `feat(export): adiciona geracao de imagem`.

### Consequências
O histórico do repo fica legível por ferramenta e imune ao encoding do CMD. Commits antigos não são reescritos — a convenção vale daqui em diante.
```

---

## Edição 9 — `meta/IDEAS.md` · feedback ao kit

**Acrescente ao FINAL do arquivo** (depois do último item da seção «📌 Feedback para o Kit de Contexto»), exatamente:

```
- *(2026-07-22)* O `_UPDATE-PROMPT.md` não diz o que fazer quando uma convenção genérica do CEREBRO/INSTRUCOES colide com uma prática já em vigor num projeto em andamento. Deveria dizer explicitamente: **é sugestão, não ordem** — adapte o CEREBRO ao projeto e gere Instruções personalizadas, nunca refatore o projeto para caber no template. (Virou DEC-008.)
- *(2026-07-22)* O prompt de update também não trata o caso de o `INSTRUCOES-DO-PROJETO.md` **não ser um arquivo do repo** — aqui ele vive nas Instruções do Projeto do claude.ai, então não há "vivo" no mount para comparar. O procedimento correto (pegar o template, especializar, respeitar o teto, entregar pronto para colar) deveria estar escrito.
- *(2026-07-22)* O `IDEAS__template-update.md` **não tem a seção «Feedback para o Kit»**, embora o CEREBRO a exija em dois lugares (regra de higiene e tabela de gatilhos). Template incompleto em relação ao próprio comportamento que prescreve.
- *(2026-07-22)* O `LOG-TEMPLATE__template-update.md` continua **sem o campo «Guias entregues»** — feedback já registrado por este projeto e não absorvido em v1.73.
- *(2026-07-22)* O `STATUS__template-update.md` continua **sem a rubrica «Pendente de Aplicação»** — idem. Sugestão concreta: manter `❌ Quebrado` e `⏳ Pendente de Aplicação` como seções distintas, foi o que este projeto adotou.
- *(2026-07-22)* O `GLOSSARY__template-update.md` não prevê seção de **glossário bilíngue de domínio** (aqui: Magistral↔Legendary, Determinação↔Resolve). Em produto multilíngue isso é estrutural, não acessório.
- *(2026-07-22)* O `gitignore__template-update` só cobre lixo de SO/editor e **não traz `node_modules/` nem `dist/`**. Aplicado ao pé da letra por cima de um `.gitignore` de stack, seria regressão grave. Deveria vir marcado no manifesto como **aditivo**, não como substituto.
- *(2026-07-22)* O `CEREBRO__template-update.md` **se contradiz**: a seção «Convenções» pede commits "no imperativo curto em PT-BR" e a seção «Commit pronto ao final» pede Conventional Commits sem acento.
- *(2026-07-22)* Falta ao kit uma classe de artefato para **"guia de aplicação"** (os `GUIA_*.md` deste projeto): não é log, não é doc de contexto, não é spec. O parente próximo é `meta/specs/`, mas o kit não faz essa ponte — e é justamente o formato que deixou a Fase 3 parada desde junho esperando aplicação manual.
```

---

## Edição 10 — `meta/CHANGELOG.md` · registrar a leva de infraestrutura

**Âncora:**
```
## [Não lançado]

### Adicionado
- Fase 3 — `generateBuildImage` via Canvas API: código completo entregue em guia, pendente de aplicação em `App.jsx`.
```

**Substituir por:**
```
## [Não lançado]

### Adicionado
- Fase 3 — `generateBuildImage` via Canvas API: código completo entregue em guia, pendente de aplicação em `App.jsx`.
- **Infraestrutura de contexto (KCM v1.73.0)** — sem efeito no produto:
  - `meta/CEREBRO.md` — comportamento do assistente, adaptado a este projeto (DEC-007, DEC-008)
  - `CLAUDE.md` na raiz — guia do Claude Code com build, armadilhas e convenções
  - `.claude/settings.json` + skills `/apply-spec` e `/wrap`
  - `.flatdropignore` — tira `logs/`, `meta/specs/`, `src/v1..v3/` e `src/v4/App.jsx` do upload ao Projeto
  - `meta/specs/` — deltas de documento aplicados pelo Claude Code por âncora

### Modificado
- `meta/HISTORICO.md` renomeado para `meta/HISTORY.md` (DEC-009)
- Convenção de commit: Conventional Commits, mensagem sem acento (DEC-010)
- `.gitignore` — acrescidos `*.swp`, `.vscode/`, `.idea/` e a cláusula que proíbe ignorar `.claude/`, `meta/` e `logs/`
- `meta/STATUS.md` — `❌ Quebrado` e `⏳ Pendente de Aplicação` viram seções distintas
- `meta/LOG-TEMPLATE.md` — acrescentado o campo «Specs entregues / aplicadas»
```

---

## Edição 11 — `meta/GLOSSARY.md` · termos novos

**Âncora:**
```
- **`GUIA_COMPLETO.md`** — arquivo de guia anterior com correções de layout e HpResolveBar
```

**Substituir por:**
```
- **`GUIA_COMPLETO.md`** — arquivo de guia anterior com correções de layout e HpResolveBar
- **spec** — arquivo em `meta/specs/` com o texto exato de uma alteração de documento e a âncora onde ela entra. O chat autora, o Claude Code posiciona. Nome: `AAMMDD-specNNNN-desc.md`. É artefato versionado; não se apaga depois de aplicada.
- **`/apply-spec`** — comando do Claude Code que aplica uma spec (âncora exata, ou PARA e reporta).
- **`/wrap`** — comando do Claude Code que fecha a sessão: append em STATUS/DECISIONS, build, `git diff`, commit e push.
- **`.flatdropignore`** — lista do que NÃO sobe ao Projeto do Claude no achatamento (continua tudo no Git).
- **KCM** — Kit de Contexto Universal, o gerador dos documentos de `meta/`. Um **template-update** do KCM traz arquivos genéricos do nicho, propositalmente vazios do específico desta obra.
- **CEREBRO.md** — documento que define COMO o assistente age (≠ CONTEXT.md, que define O QUE o projeto é).
```

---

## Fechamento

```
git add meta/ CLAUDE.md .claude/ .gitignore .flatdropignore
git commit -m "docs(meta): adota kit KCM v1.73 e fluxo Claude Code" -m "Renomeia HISTORICO.md para HISTORY.md, separa Quebrado de Pendente de Aplicacao no STATUS, registra DEC-007 a DEC-010 e 9 itens de feedback ao kit."
git push
```
