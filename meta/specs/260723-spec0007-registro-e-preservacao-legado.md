# spec0007 — Preserva o legado recuperado no repositório e registra o que falta desta sessão

**Data:** 2026-07-23 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** a conversa que produziu as specs 0001–0006 está sendo encerrada. Três coisas ainda não estão no repositório e, se não entrarem, se perdem: (a) o `GUIA_CORRECOES_FASE3.md`, que **já se perdeu uma vez** e foi dado como irrecuperável; (b) as cinco conversas antigas que documentam a origem do projeto; (c) as decisões e o plano que esta sessão produziu.

> **Aviso ao executor:** esta spec foi escrita a partir de um mount anterior à aplicação da `spec0005`. Se o repositório estiver diferente do que ela assume, **PARE e reporte** em vez de forçar. Todas as edições de documento são **append ao final do arquivo**, justamente para não depender de âncoras que podem ter mudado.

**Regras de execução:**
- **Não delete nada.** Esta spec só move e acrescenta.
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Nenhum arquivo de código (`src/`) é tocado → não precisa de build; a rede é o `git diff`.

---

## Parte 1 — Levantamento

Rode e **reporte a saída antes de aplicar qualquer coisa**:

```
git branch --show-current
git log --oneline -8
git status
ls meta/specs/
```

Responda explicitamente:
1. Estamos na `v2-planner`? Se não, **PARE**.
2. A `spec0006` (`260722-spec0006-tres-correcoes-layout.md`) já foi aplicada? Se **não**, reporte isso com destaque — o usuário precisa saber que ela ficou pendente, mas **siga com esta spec assim mesmo**: registro e preservação não dependem dela.
3. Há algo modificado e não commitado? Liste.

---

## Parte 2 — Preservar o material recuperado

O `GUIA_CORRECOES_FASE3.md` e as cinco conversas antigas estão **fora do repositório**, na pasta de trabalho ou onde o usuário os deixou. Foi exatamente assim que o guia se perdeu da primeira vez.

### 2.1 — Criar a pasta

```
mkdir -p meta/legacy
```

### 2.2 — Mover o que existir

Procure os arquivos abaixo na raiz do projeto e em subpastas óbvias (`src/v4/`, `docs/`, a raiz). **Mova os que encontrar** para `meta/legacy/`; ignore em silêncio os que não existirem, e **reporte ao final a lista do que foi movido e do que não foi encontrado**.

| Arquivo | Observação |
|---|---|
| `GUIA_CORRECOES_FASE3.md` | 35 KB. Contém a Fase 3 completa (linhas 420–887). **É o mais importante desta parte.** |
| `GUIA_COMPLETO_v4.md` | 42 KB, normalmente em `src/v4/` |
| `GUIA_COMPLETO.md` | **byte a byte idêntico** ao anterior. Se ambos existirem, mova só um e reporte o descarte do duplicado — não apague o outro, deixe-o onde está para o usuário decidir. |
| `GOT_Build.md` | 40 KB — índice dos 7 prompts que originaram o projeto |
| `GOT_Build_-_Joker.md` | 15 KB |
| `GOT_Build_-_Alex.md` | 61 KB |
| `GOT_Build_-_Origem.md` | 197 KB |
| `GOT_Build_-_TOhno.md` | 267 KB |

Se algum deles não estiver acessível de dentro do repositório, **não o recrie e não invente conteúdo** — apenas registre no relatório que o usuário precisa colocá-lo em `meta/legacy/` à mão.

### 2.3 — Manter fora do mount

Acrescente ao **final** de `.flatdropignore`:

```

# Material legado recuperado em 2026-07-22/23 (DEC-012).
# Fica no Git para nunca mais se perder, mas fora do upload ao Projeto:
# sao ~660 KB que so interessam quando a extracao retroativa estiver em pauta.
# Para trabalhar um deles, reinclua pontualmente: !meta/legacy/<arquivo>
meta/legacy/
```

### 2.4 — README da pasta

Crie `meta/legacy/README.md`:

```markdown
# meta/legacy — material anterior ao fluxo de specs

Arquivos preservados aqui para **não se perderem de novo**. O `GUIA_CORRECOES_FASE3.md`
já foi dado como irrecuperável uma vez, e o `meta/STATUS.md` chegou a orientar que o
código dele fosse reescrito do zero. Reapareceu em 2026-07-22.

O `.flatdropignore` mantém esta pasta fora do upload ao Projeto do Claude — são ~660 KB
que só interessam quando a extração retroativa estiver em pauta. Para trabalhar um
arquivo específico, reinclua-o pontualmente com `!meta/legacy/<arquivo>`.

## O que é cada coisa

| Arquivo | O que é | Estado |
|---|---|---|
| `GUIA_CORRECOES_FASE3.md` | 4 correções + Fase 3 completa (Canvas, linhas 420–887) | correções 1–3 viraram a spec0006; a 4 virou a spec0004; **a Fase 3 ainda não foi usada** |
| `GUIA_COMPLETO_v4.md` | guia de aplicação anterior | não extraído |
| `GOT_Build.md` | índice dos 7 prompts que originaram a ferramenta | **lido por inteiro** em 2026-07-22 |
| `GOT_Build_-_Joker.md` | conversa antiga, 15 KB | não extraído — **primeiro alvo** |
| `GOT_Build_-_Alex.md` | conversa antiga, 61 KB | não extraído |
| `GOT_Build_-_Origem.md` | conversa antiga, 197 KB | não extraído |
| `GOT_Build_-_TOhno.md` | conversa antiga, 267 KB | não extraído — provavelmente exige 2 sessões |

## Como ler isto

**Não são fatos sobre o projeto.** São pedidos históricos: muitos já atendidos, alguns
contraditórios entre si, e com cronologia desconhecida — nem o autor sabe quais conversas
foram de fato usadas. Nada daqui entra nos `meta/` sem ser conferido contra o código de hoje.

O mesmo vale para os guias: são **fonte, não gabarito**. Todo bloco "ANTES" precisa bater
com o `App.jsx` atual antes de virar spec. Um bloco que não bate é um bloco a reescrever,
não a colar.
```

---

## Parte 3 — Registrar as decisões

### 3.1 — `meta/DECISIONS.md`

**Acrescente ao FINAL do arquivo**, exatamente:

```

---

## DEC-011 — A extração retroativa vem antes da Fase 3

**Data:** 2026-07-23 · **Status:** aceita

### Contexto
Em 2026-07-22 reapareceram o `GUIA_CORRECOES_FASE3.md` — que continha a Fase 3 inteira e havia sido dado como perdido — e cinco arquivos de conversas antigas (~580 KB) anteriores à adoção do KCM. Com o guia recuperado, a Fase 3 passou a ser executável de imediato: o código do `generateBuildImage` está escrito.

### Decisão
Ainda assim, a Fase 3 **espera** a extração retroativa das conversas antigas.

O motivo é de requisito, não de organização. O prompt v7 registrado em `GOT_Build.md` mostra o autor perguntando explicitamente se os ícones das vantagens de classe entrariam na imagem gerada, e registrando preocupação de que tivessem sido esquecidos no layout proposto. Ou seja: as conversas contêm requisito da Fase 3 que o guia pode não ter absorvido. Construir 470 linhas de Canvas antes de ler isso é aceitar alta chance de refazer.

A extração deixou de ser um resgate de conteúdo perdido — o guia voltou — e virou levantamento de requisito.

### Método
Uma sessão por arquivo, do menor para o maior: `Joker` (15 KB) → `Alex` (61 KB) → `Origem` (197 KB) → `TOhno` (267 KB, provavelmente duas sessões). Cada sessão lê um arquivo, separa o que é pedido ainda aberto, ideia não implementada, decisão com motivo, e ruído; entrega UMA spec que anexa aos `meta/`; e só então o arquivo é apagado. `GOT_Build.md` já foi lido por inteiro em 2026-07-22.

### Alternativas consideradas
- **Fase 3 primeiro.** Fecharia o item mais visível do backlog, mas com risco de refação por requisito não lido.
- **Extração em uma sessão só.** Inviável: 580 KB não cabem numa janela junto com a produção de spec.

### Consequências
A Fase 3 fica adiada por várias sessões. Em troca, o backlog visível já está zerado pelas specs 0004–0006, então o adiamento não deixa nenhum defeito na tela.

---

## DEC-012 — Material legado passa a viver no repositório, fora do mount

**Data:** 2026-07-23 · **Status:** aceita

### Contexto
O `GUIA_CORRECOES_FASE3.md` se perdeu por viver apenas fora do repositório. O `meta/STATUS.md` chegou a registrar que ele "não será recuperado" e a orientar que o código de quatro correções fosse **reescrito do zero** — uma instrução ativa e errada, baseada num arquivo que existia. Ele reapareceu por acaso.

### Decisão
Todo material legado — os guias de aplicação e as cinco conversas antigas — passa a ser **versionado** em `meta/legacy/`, e o `.flatdropignore` o mantém **fora** do upload ao Projeto do Claude.

É exatamente para isso que os dois arquivos de ignore existem separados: o Git guarda para sempre; o flatdrop decide o que vale o peso da janela de contexto. São ~660 KB que só interessam quando a extração estiver em pauta, e podem ser reincluídos pontualmente com `!meta/legacy/<arquivo>`.

### Consequências
O material não se perde mais, e a pasta some da árvore de trabalho quando for apagada — porque o histórico já o guarda. O custo é um repositório maior; é texto, o Git lida bem.

**Regra que fica:** artefato do projeto que só existe fora do repositório é artefato em risco. Se importa, entra no Git; se pesa, sai do flatdrop. As duas coisas são independentes.
```

### 3.2 — `meta/IDEAS.md`

**Acrescente ao FINAL do arquivo**, exatamente:

```

---

## 🗄️ Extração retroativa — fila de leitura

Cinco arquivos de conversas antigas foram recuperados em 2026-07-22 e preservados em `meta/legacy/` (DEC-012). Documentam a origem do projeto, antes do KCM. Contêm pedidos, bugs e ideias que **nunca foram registrados em lugar nenhum**. Ver DEC-011 para o método e o porquê da ordem.

| Arquivo | Tamanho | Estado |
|---|---|---|
| `GOT_Build.md` | 40 KB | ✅ lido por inteiro em 2026-07-22 |
| `GOT_Build_-_Joker.md` | 15 KB | ⏳ próximo |
| `GOT_Build_-_Alex.md` | 61 KB | ⏳ |
| `GOT_Build_-_Origem.md` | 197 KB | ⏳ |
| `GOT_Build_-_TOhno.md` | 267 KB | ⏳ — talvez 2 sessões |

**Critério:** não são fatos. São pedidos históricos, muitos já atendidos, alguns contraditórios entre si, com cronologia desconhecida. Nada entra nos `meta/` sem conferência contra o código atual.

### Já verificado no `GOT_Build.md` — **não reabrir**
Estes pedidos antigos já estão atendidos no código de hoje: estrela do Magistral no fim do nome · ícones dos amuletos (`defense-charm`, `assassin-charm`, `utility-charm`, `hunter-charm`, `benkeis-last-stand`, `shoguns-fortitude`, `lady-sanjos-surprise`) · `half-bow` renomeado para `shortbow` · círculos de Determinação só quando ativos.

### Pergunta antiga ainda em aberto
Nos prompts antigos o autor cogitou **remover o modo Estatístico** caso desse trabalho demais. Ele agora funciona (FIX-005 aplicado na spec0004), mas a pergunta nunca foi formalmente encerrada. Vale confirmar com o usuário em vez de assumir que a correção respondeu por ela.

---

## 📌 Feedback para o Kit de Contexto — leva de 2026-07-23

- O `_UPDATE-PROMPT.md` não trata o caso do `INSTRUCOES-DO-PROJETO.md` **não ser um arquivo do repo**. Neste projeto ele vive nas Instruções do Projeto do claude.ai; não há "vivo" no mount para comparar. O procedimento correto — pegar o template, especializar, respeitar o teto e entregar pronto para colar — deveria estar escrito, em vez de o assistente pedir que o usuário cole o texto atual só para poder comparar.
- Falta ao kit uma **classe de artefato para material legado**: guias de aplicação, conversas antigas, snapshots de versão. Não é log, não é doc de contexto, não é spec. Este projeto resolveu com `meta/legacy/` + `.flatdropignore` (DEC-012) e a solução parece generalizável: **versionado sempre, no mount só quando em pauta**.
- O kit não diz em lugar nenhum que **uma entrada de FIX não deve ser criada a partir de código ainda não aplicado**. Este projeto perdeu um mês com FIX-005 registrado como resolvido enquanto o conserto vivia só num guia. A regra deveria estar no CEREBRO, junto das regras de higiene.
```

### 3.3 — `meta/STATUS.md`

**Acrescente ao FINAL do arquivo**, exatamente:

```

---

**2026-07-23 — encerramento da sessão de infraestrutura.**

A conversa que produziu as specs 0001–0007 foi encerrada por peso de contexto. O que ela fechou: adoção do kit KCM v1.73 com adaptação (DEC-007, DEC-008), instalação do fluxo chat ↔ Claude Code, criação da branch `v2-planner` com o estado real da ferramenta em segurança, FIX-006 (props de Magistral) e FIX-005 (estatísticas `undefined`, diagnosticado em junho e aplicado só agora).

Recuperado nesta sessão: o `GUIA_CORRECOES_FASE3.md`, dado como perdido, e cinco conversas antigas. Ambos agora versionados em `meta/legacy/` (DEC-012).

**Próximo passo, em ordem:**
1. Aplicar a `spec0006` se ainda estiver pendente — fecha as três correções de layout, todas visíveis na tela. Conferir com atenção o item 6 do roteiro dela: os modos 3-col e 2-col precisam ficar certos **ao mesmo tempo**; o defeito histórico é consertar um e quebrar o outro.
2. Extração retroativa, começando por `meta/legacy/GOT_Build_-_Joker.md` (DEC-011).
3. Fase 3 (`generateBuildImage`), depois da extração e informada por ela.

Há um `HANDOFF-BRIEF.md` gerado para arrancar a próxima conversa. Ele é atalho, não memória — **este arquivo e os demais `meta/` continuam sendo a fonte de verdade.**
```

---

## Parte 4 — Fechamento

```
git add meta/ .flatdropignore
git status
```

Confira o staged e **reporte a lista**. Deve conter `meta/legacy/` com os arquivos movidos, o `meta/legacy/README.md`, os três documentos editados, esta spec e o `.flatdropignore`. **Não deve haver nada de `src/`, `node_modules/` ou `dist/`.**

Se algum arquivo do legado aparecer como *rename* em vez de arquivo novo, está correto — o Git detecta a movimentação.

```
git commit -m "docs(meta): preserva legado recuperado e registra o plano de extracao" -m "Move os guias e as cinco conversas antigas para meta/legacy, versionadas e fora do flatdrop (DEC-012). Registra DEC-011: a extracao retroativa vem antes da Fase 3, porque as conversas contem requisito da imagem que o guia pode nao ter absorvido. Acrescenta a fila de leitura ao IDEAS e o fechamento da sessao ao STATUS."
git push
```

---

## Parte 5 — Relatório final

Reporte, em lista:

1. **Se a `spec0006` estava aplicada ou não** — com destaque, é a pendência que o usuário mais precisa saber.
2. **Quais arquivos de legado foram movidos** e quais não foram encontrados (para o usuário colocá-los à mão em `meta/legacy/`).
3. O SHA do commit e a confirmação do push.
4. `git status` final — a árvore deve estar limpa, exceto pelo que a `spec0006` deixaria pendente se ela não tiver rodado.
5. Confirmação de que a `main` e a `gh-pages` **não** foram tocadas.

**Permanece em `v2-planner`.**
