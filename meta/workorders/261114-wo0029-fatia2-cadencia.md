# wo0029 — Fatia 2 do kit v1.138.0: cadencia (sessao → turno/conversa) e as duas linhas revogadas

**Data:** 2026-11-14 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca codigo do produto?** Nao — `meta/`, `CLAUDE.md` e os dois arquivos de exclusao. **Build:** dispensavel; a rede e o `git diff`.
**Base:** commit `77b4416`, arvore limpa (conferido com `git log -3 --oneline` e `git status --short`).
**Depende de:** `wo0028` aplicada (skills do kit v1.138 instaladas).

> **Ancoras lidas em:** 2026-11-14, neste turno, direto do disco — `grep -n -i "sess"` em cada arquivo
> e `sed -n` nos trechos dos blocos 1 e 2. Cada ancora abaixo e a LINHA INTEIRA como ela esta no
> arquivo, nao um fragmento.
>
> **Canal dos meta neste ciclo = CODE.**
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

Duas linhas que o kit revogou continuam vivas aqui, e nenhuma comparacao de template as acharia,
porque nao sao algo que falta: sao algo que sobra.

- **v1.106.0, «nunca blocos soltos para colar a mao».** O CEREBRO se contradiz: a secao «Como o
  assistente entrega as atualizacoes dos documentos» diz que a entrega e por arquivo completo «nunca
  por blocos soltos para o usuario costurar a mao», enquanto a secao do Code, no mesmo arquivo, manda
  virar WO com texto exato e ancora. Este projeto tem executor no repositorio desde 22 de julho e
  pasta vinculada desde hoje — a regra foi escrita para um projeto que nao tem nenhum dos dois.
- **v1.104.0, «mostre o git diff e o bloco de commit».** O CEREBRO manda fechar a resposta com os tres
  comandos prontos para colar. As skills `/apply-wo` e `/wrap` ja rodam `add`/`commit`/`push` sozinhas
  desde a `wo0028`. O bloco que fica na conversa envelhece no instante em que o executor commita.
- **v1.106.0, «Ritual de inicio de sessao».** 42 ocorrencias de cadencia de sessao em 8 arquivos.

## Fora de escopo

- **O merge do `meta/CEREBRO.md` com os 123 blocos do pacote: Fatia 3.** Esta WO mexe so na cadencia e
  nas duas linhas revogadas. As ancoras da Fatia 3 serao escritas DEPOIS desta WO, contra o texto novo.
- **As 49 ocorrencias de relato historico** em `STATUS.md` (a partir da linha 97), `DECISIONS.md`,
  `IDEAS.md` e `HISTORY.md`: sao entradas datadas, fato medido. Reescrever falsifica o registro para
  consertar a regra.
- **As 131 ocorrencias em `meta/workorders/`**: WOs aplicadas, artefato que este projeto declara
  nao-reescrevivel.
- **As 6 ocorrencias nas skills e no `_TEMPLATE.md`**: sao texto do KIT em v1.138.0 — a versao corrente,
  logo nao revogada. «custa uma sessao», «uma sessao futura vai ler»: uso legitimo, medindo custo.
- **O rotulo `## 💬 Ultima Sessao` do `STATUS.md` (linha 97).** E PONTEIRO: a skill `/wrap` procura «o
  bloco da sessao anterior» por ele. Renomear ponteiro deixa orfao quem aponta — a mesma razao pela
  qual os arquivos `spec0001`–`spec0020` nao foram renomeados na DEC-030.
- As Instrucoes do Projeto (fora do repo): o chat entrega o texto inteiro na mesma rodada.

## Medicao previa

Contagem de `grep -o -i "sess" <arquivo> | wc -l` HOJE, antes de aplicar:

| Arquivo | Antes | Depois (esperado) |
|---|---|---|
| `meta/CEREBRO.md` | 19 | **0** |
| `meta/LOG-TEMPLATE.md` | 6 | **1** (a referencia ao ponteiro do STATUS) |
| `meta/CONTEXT.md` | 4 | **0** |
| `meta/GLOSSARY.md` | 2 | **0** |
| `.flatdropignore` | 2 | **0** |
| `CLAUDE.md` | 1 | **0** |
| `.gitignore` | 1 | **0** |
| `meta/STATUS.md` | 33 | **31** (so as duas diretivas saem) |

## Armadilhas desta WO

- **Toda ancora aqui e a linha inteira.** Fragmento curto como «da sessao» aparece em varios lugares;
  a linha inteira e unica. Se bater em mais de um lugar, PARE — significa que o arquivo mudou.
- **Nao rode `sed` global em nenhum arquivo.** As substituicoes diferem por contexto: a mesma palavra
  vira «turno» num lugar, «conversa» noutro e «log do dia» num terceiro. Global acerta a contagem e
  erra o sentido.
- **A Edicao 1 troca dois blocos inteiros, nao palavras.** Confira pelo `git diff` que o que entrou tem
  a forma esperada, nao so que a contagem fechou.

---

## Edicao 1 — `meta/CEREBRO.md` · as duas linhas revogadas

### 1a — a entrega deixa de ser «baixar e substituir»

**Ancora** (paragrafo da secao «Como o assistente entrega as atualizacoes dos documentos»):

```
As mudanças nos documentos que decorrem do trabalho do assistente são registradas pelo PRÓPRIO assistente — quando ele faz algo, ele mesmo atualiza os docs afetados. O que o usuário quer acrescentar por conta (ele sabe onde e o quê) é decisão dele. Em ambos os casos, a entrega é por ARQUIVO COMPLETO, nunca por blocos soltos para o usuário costurar à mão.
```

**Substituir por:**

```
As mudanças nos documentos que decorrem do trabalho do assistente são registradas pelo PRÓPRIO assistente — quando ele faz algo, ele mesmo atualiza os docs afetados. O que o usuário quer acrescentar por conta (ele sabe onde e o quê) é decisão dele.

**Como a entrega chega ao disco depende do canal.** Este projeto tem pasta vinculada e executor no repositório, então há dois caminhos, e escolher errado é o desperdício:
- **Arquivo inteiro** — para reescrita de fundo, mudança de voz, ou arquivo novo/pequeno. O assistente escreve direto no repositório pela pasta vinculada; o usuário não baixa nem costura nada.
- **WO** em `meta/workorders/` — para delta estruturado em documento grande. O assistente escreve a WO no repositório, com texto exato e âncora semântica, e o Claude Code posiciona com `/apply-wo`.

Um canal por doc por ciclo. Quando NÃO há pasta vinculada nem executor — outro projeto, outra máquina —, aí sim vale o modo antigo: arquivo inteiro para o usuário baixar e substituir, nunca pedaços para ele costurar à mão. Aqui esse modo é a exceção, não a regra.
```

### 1b — o que o assistente entrega

**Ancora** (uma linha):

```
- Entrega o arquivo INTEIRO já atualizado (não um trecho, não «adicione esta linha»). O usuário só substitui o antigo pelo novo.
```

**Substituir por:**

```
- Entrega a mudança já aplicável: arquivo inteiro escrito no repositório, ou WO com texto exato e âncora. Nunca «adicione esta linha» solto na conversa, que é trabalho empurrado para o usuário.
```

### 1c — o que o usuario faz

**Ancora** (uma linha):

```
- APLICA de forma simples: baixa os arquivos completos e substitui os antigos na pasta (e sobe no Git/Projeto, se usar). Sem editar nada à mão.
```

**Substituir por:**

```
- APLICA de forma simples: roda `/apply-wo <arquivo>` quando a entrega é WO, ou confere o `git diff` quando o assistente escreveu direto no repositório. Sem editar nada à mão.
```

### 1d — a nota sobre arquivos somente-leitura

**Ancora** (a linha de citacao inteira):

```
> Sobre os arquivos: os documentos já no Projeto chegam ao assistente como somente-leitura (ele lê, não salva por cima). Isso NÃO o impede de entregar versões novas — ele cria cada arquivo atualizado como arquivo novo para baixar. Sem ferramenta de download, entrega o conteúdo completo de cada arquivo no chat, um por bloco. Princípio único: arquivo inteiro, conjunto consistente, nunca pedaços para costurar.
```

**Substituir por:**

```
> Sobre os arquivos: com pasta vinculada, o assistente lê e escreve no repositório direto, e o `git diff` é a rede. Sem pasta vinculada, os documentos chegam como somente-leitura e ele entrega cada arquivo atualizado como arquivo novo para baixar; sem ferramenta de download, entrega o conteúdo completo no chat, um por bloco. Princípio único em qualquer canal: conjunto consistente, e nada que obrigue o usuário a montar o arquivo à mão.
```

### 1e — «Commit pronto ao final» morre

**Ancora** (titulo e paragrafo, com a linha em branco entre eles):

```
### Commit pronto ao final (se você versiona com Git)

Quando a entrega inclui arquivos que vão para um repositório Git/GitHub (código ou documentos), o assistente fecha a resposta com o bloco de commit pronto para copiar e colar, na convenção Conventional Commits (`tipo(escopo): descrição` — feat, fix, docs, refactor, chore), em TRÊS linhas separadas: `git add` listando os arquivos alterados (pode usar `git add .` quando o conjunto é pequeno e a árvore é conhecida/limpa), `git commit` com a mensagem completa, e `git push` — prontas para colar uma a uma e conferir entre elas.
```

**Substituir por:**

```
### Commit — quem roda, e o que o chat entrega

Este projeto tem executor no repositório: quem commita é quem aplica. As skills `/apply-wo` e `/wrap` fecham o ciclo sozinhas com `git add` → `git commit` → `git push`, sem segundo pedido. O assistente no chat NÃO fecha a resposta com os três comandos para o usuário colar — colar à mão o que o executor já roda é trabalho duplicado, e o bloco que fica na conversa envelhece no instante em que o executor commita.

O que o chat entrega é a **mensagem** do commit, dentro da WO, em Conventional Commits (`tipo(escopo): descrição` — feat, fix, docs, refactor, chore) e SEM acento, que o CMD do Windows corrompe. Para mudança trivial basta o título; para várias mudanças de naturezas diferentes, o assistente pode sugerir mais de um commit.

Quando NÃO há executor — outro projeto, outra máquina —, aí sim o assistente volta a entregar os três comandos em linhas separadas, prontos para colar um a um.
```

### 1f — a nota de sintaxe que sobrou

**Ancora** (a linha de citacao inteira):

```
> Se o seu sistema operacional estiver definido acima, cada comando já vem na sintaxe certa do seu shell (ex.: no CMD do Windows, comando numa linha só, `-m` repetido para parágrafos e mensagem SEM acentos, que o CMD corrompe). Para mudanças triviais, basta o título; para várias mudanças de naturezas diferentes, o assistente pode sugerir mais de um commit.
```

**Substituir por:**

```
> Quando o assistente precisar mesmo escrever um comando para o usuário rodar, ele vem na sintaxe do shell declarado acima (no CMD do Windows: comando numa linha só, `-m` repetido para parágrafos, mensagem SEM acento).
```

## Edicao 2 — `meta/CEREBRO.md` · cadencia, 18 linhas

Cada ancora e a linha inteira. Substitua uma a uma, na ordem.

| # | Ancora (linha inteira) | Substituir por |
|---|---|---|
| 1 | `## Ritual de início de sessão` | `## Ritual de início de turno` |
| 2 | `4. Lê última entrada do `CHANGELOG.md` — vê o que mudou desde a sessão anterior.` | `4. Lê última entrada do `CHANGELOG.md` — vê o que mudou desde o turno anterior.` |
| 3 | `| `LOG-TEMPLATE.md` | Referência fixa | Modelo do log de sessão. Referência fixa — nunca substituído pelo conteúdo preenchido. |` | `| `LOG-TEMPLATE.md` | Referência fixa | Modelo do log do dia. Referência fixa — nunca substituído pelo conteúdo preenchido. |` |
| 4 | `| `GLOSSARY.md` | Estável | OPCIONAL — termos próprios do projeto. Use quando há jargão que se repete entre sessões. |` | `| `GLOSSARY.md` | Estável | OPCIONAL — termos próprios do projeto. Use quando há jargão que se repete entre conversas. |` |
| 5 | `| `logs/AAAA-MM-DD.md` | Histórico | Ao final de cada sessão (formato em LOG-TEMPLATE). |` | `| `logs/AAAA-MM-DD.md` | Histórico | Ao fechar o trabalho do dia; o `/wrap` cria o arquivo se não existir (formato em LOG-TEMPLATE). |` |
| 6 | `- STATUS é só o agora: item resolvido sai do STATUS e vai para o CHANGELOG (e para o log da sessão). Médio/longo prazo vive no ROADMAP, não no STATUS.` | `- STATUS é só o agora: item resolvido sai do STATUS e vai para o CHANGELOG (e para o log do dia). Médio/longo prazo vive no ROADMAP, não no STATUS.` |
| 7 | `- Registra o que decorre do próprio trabalho: se a sessão mexeu em STATUS, decisões, ideias, etc., o assistente entrega esses arquivos atualizados — não espera o usuário pedir.` | `- Registra o que decorre do próprio trabalho: se o turno mexeu em STATUS, decisões, ideias, etc., o assistente entrega esses arquivos atualizados — não espera o usuário pedir.` |
| 8 | `- **Corte o que não se aplica.** Princípio, gatilho ou regra que este projeto nunca usou em N sessões é peso morto — proponha remover, dizendo o que sai.` | `- **Corte o que não se aplica.** Princípio, gatilho ou regra que este projeto nunca usou em N conversas é peso morto — proponha remover, dizendo o que sai.` |
| 9 | (a linha que comeca `- **É dever do assistente, não pedido do usuário.**`) — trocar so o trecho `ao fim da primeira sessão de trabalho real` | `ao fim do primeiro turno de trabalho real` |
| 10 | `5. **Handoff** — por último, só quando houver arquivo trocando de mão: arquivo por arquivo, onde cada um vai. Handoff de sessão completo: o artefato se chama `AAMMDD-HANDOFF-BRIEF.md`.` | `5. **Handoff** — por último, só quando houver arquivo trocando de mão: arquivo por arquivo, onde cada um vai. Handoff de conversa completa: o artefato se chama `AAMMDD-HANDOFF-BRIEF.md`.` |
| 11 | (a linha que comeca `**Este formato é ponto de partida, não jaula.**`) — trocar so o trecho `não só ao encerrar a sessão` | `não só ao encerrar a conversa` |
| 12 | `| Início de sessão | Lê CEREBRO.md → CONTEXT.md → STATUS.md → última entrada do CHANGELOG. |` | `| Início de turno | Lê CEREBRO.md → CONTEXT.md → STATUS.md → última entrada do CHANGELOG. |` |
| 13 | `| Fim de sessão | Entrega os arquivos completos afetados: STATUS.md + CHANGELOG.md (se fechou algo) + log da sessão. |` | `| Fim de conversa | Entrega os arquivos completos afetados: STATUS.md + CHANGELOG.md (se fechou algo) + log do dia. |` |
| 14 | `## Ao final de cada sessão, o assistente entrega (como arquivos completos)` | `## Ao final de cada conversa, o assistente entrega (como arquivos completos)` |
| 15 | `4. IDEAS.md — completo, com as ideias da sessão capturadas e reclassificadas` | `4. IDEAS.md — completo, com as ideias da conversa capturadas e reclassificadas` |
| 16 | `7. logs/AAAA-MM-DD.md — log da sessão preenchido (formato em LOG-TEMPLATE.md)` | `7. logs/AAAA-MM-DD.md — log do dia preenchido (formato em LOG-TEMPLATE.md)` |
| 17 | `## Recomendação de configuração (fim de sessão)` | `## Recomendação de configuração (fim de turno)` |
| 18 | (a linha que comeca `No fim de cada sessão, junto do resumo`) — trocar so o trecho `No fim de cada sessão` | `No fim de cada turno` |

Nos itens 9, 11 e 18 a ancora e a linha inteira; o que muda e so o trecho citado. Se o trecho aparecer
mais de uma vez na linha, PARE e reporte.

## Edicao 3 — `CLAUDE.md` · 1 linha

**Ancora:**

```
> Arquivo-raiz lido pelo Claude Code em toda sessao. Mantenha CURTO (< 200 linhas — custa token em todo turno).
```

**Substituir por:**

```
> Arquivo-raiz lido pelo Claude Code em todo turno. Mantenha CURTO (< 200 linhas — custa token a cada leitura).
```

## Edicao 4 — `meta/LOG-TEMPLATE.md` · 5 linhas (a sexta fica)

| # | Ancora (linha inteira) | Substituir por |
|---|---|---|
| 1 | `# LOG-TEMPLATE.md — Formato do Log de Sessão` | `# LOG-TEMPLATE.md — Formato do Log do Dia` |
| 2 | `> Ao final de cada sessão, o assistente entrega um arquivo novo `logs/AAAA-MM-DD.md` preenchido neste formato.` | `> Ao fechar o trabalho do dia, o arquivo `logs/AAAA-MM-DD.md` é preenchido neste formato. O `/wrap` o CRIA se ainda não existir — não regenerar é uma coisa, não criar é outra.` |
| 3 | (a linha que comeca `> Os logs vivem em `logs/` **no Git**`) — trocar so o trecho `o detalhe de uma sessão antiga` | `o detalhe de um dia antigo` |
| 4 | `## Objetivo da sessão` | `## Objetivo do dia` |
| 5 | `- [Ações concretas para a próxima sessão, em ordem de prioridade.]` | `- [Ações concretas para o próximo turno, em ordem de prioridade.]` |

**NAO toque** na linha `[Estado exato ao encerrar + próximo passo óbvio. Alimenta o «Última Sessão» do
STATUS.]` — «Ultima Sessao» e o rotulo que a skill `/wrap` procura no `STATUS.md`. Ponteiro renomeado
deixa orfao quem aponta.

## Edicao 5 — `meta/CONTEXT.md` · 4 linhas

| # | Ancora (linha inteira) | Substituir por |
|---|---|---|
| 1 | `> Arquivo **estável**. O assistente lê no início de cada sessão para se ambientar.` | `> Arquivo **estável**. O assistente lê no início de cada turno para se ambientar.` |
| 2 | `├── logs/             — logs de sessão (AAAA-MM-DD.md)` | `├── logs/             — log do dia (AAAA-MM-DD.md)` |
| 3 | (armadilha 13) — trocar so o trecho `Mexeu num, confira o outro **na mesma sessão**.` | `Mexeu num, confira o outro **no mesmo turno**.` |
| 4 | `Valores conferidos em 2026-07-25. Alterar a coluna de técnicas mexe com a armadilha 13 — confira **os dois modos** na mesma sessão.` | `Valores conferidos em 2026-07-25. Alterar a coluna de técnicas mexe com a armadilha 13 — confira **os dois modos** no mesmo turno.` |

## Edicao 6 — `meta/GLOSSARY.md` · 2 linhas e um termo novo

**Ancora 6a:**

```
> Termos próprios que se repetem entre sessões e que um recém-chegado não entenderia.
```

**Substituir por:**

```
> Termos próprios que se repetem entre conversas e que um recém-chegado não entenderia.
```

**Ancora 6b** (uma linha):

```
- **`/wrap`** — comando do Claude Code que fecha a sessão: append em STATUS/DECISIONS, build, `git diff`, commit e push.
```

**Substituir por** (a linha atualizada ao comportamento da skill v1.138, mais o termo novo):

```
- **`/wrap`** — comando do Claude Code que fecha a tarefa: confere o relatório anterior contra o git, append em STATUS/DECISIONS, build quando houve código, escreve o log do dia, commit e push.
- **`/sondar`** — comando do Claude Code que faz uma passada exploratória e devolve **candidatos a checagem, nunca veredito**: não conclui, não escreve no material, e todo achado vem com o comando que o reproduz. O relatório traz uma seção «o que olhei e NÃO achei nada», que é o que deixa a passada seguinte pular aquilo. Instalado pela `wo0028`.
```

> Antes de inserir o termo `/sondar`, busque `sondar` no arquivo inteiro: se ja existir, PARE e
> reporte, em vez de criar a segunda entrada. Foi assim que o GLOSSARY ficou com duas «Determinação».

## Edicao 7 — `meta/STATUS.md` · 2 linhas (as outras 31 ficam)

| # | Ancora (linha inteira) | Substituir por |
|---|---|---|
| 1 | `> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log da sessão.` | `> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.` |
| 2 | `## 📋 Backlog (curto prazo — acionáveis na próxima sessão)` | `## 📋 Backlog (curto prazo — acionáveis no próximo turno)` |

**NAO toque** em nada a partir de `## 💬 Última Sessão`: e ponteiro da skill `/wrap` e, abaixo dele,
relato datado.

## Edicao 8 — `.flatdropignore` · 2 linhas

| # | Ancora (linha inteira) | Substituir por |
|---|---|---|
| 1 | `# logs/* — o "agora" fica no meta/STATUS.md; o diario de sessao nao precisa ir ao mount.` | `# logs/* — o "agora" fica no meta/STATUS.md; o log do dia nao precisa ir ao mount.` |
| 2 | `#   esta sendo construido: e exatamente o que o assistente precisa ler no inicio da sessao.` | `#   esta sendo construido: e exatamente o que o assistente precisa ler no inicio do turno.` |

> As duas estao FORA do bloco `# >>> flatdrop-editor`, que e onde moram as regras. Sao comentario:
> trocar o texto nao muda nenhuma regra de exclusao. Nao mexa no bloco.

## Edicao 9 — `.gitignore` · 1 linha

**Ancora:**

```
# Logs de ferramenta (NAO confundir com logs/ de sessao, que sao versionados)
```

**Substituir por:**

```
# Logs de ferramenta (NAO confundir com logs/ do dia, que sao versionados)
```

## Edicao 10 — `meta/DECISIONS.md` · DEC-034 no fim do arquivo

**Ancora** (ultima linha do arquivo):

```
- Registrado como aplicação da regra de processo «quando duas implementações divergem, a divergência é o achado»: a duplicação era conhecida desde julho, mas o que estava anotado era «é cópia» — e não era.
```

**Substituir por** (a ancora, seguida da entrada nova):

```
- Registrado como aplicação da regra de processo «quando duas implementações divergem, a divergência é o achado»: a duplicação era conhecida desde julho, mas o que estava anotado era «é cópia» — e não era.

---

## DEC-034 — O chat deixa de entregar bloco de commit e arquivo-para-baixar
**Data:** 2026-11-14 · **Status:** aceita · **Aplicada pela** `wo0029`

### Contexto
O template-update v1.138.0 trouxe uma seção que a comparação de arquivos não produz: **linhas revogadas** — texto que o kit apagou de propósito e que continua vivo nos projetos, invisível ao merge porque não é algo que falte, é algo que sobra. Duas delas estavam aqui, e as duas descreviam um projeto que este deixou de ser.

A primeira (revogada em v1.106.0) mandava entregar sempre por arquivo completo, «nunca por blocos soltos para o usuário costurar à mão», e descrevia o usuário baixando arquivos e substituindo na pasta. A segunda (v1.104.0) mandava o assistente fechar a resposta com `add`/`commit`/`push` em três linhas, prontas para colar uma a uma.

Nenhuma das duas sobrevive ao que o projeto tem hoje. O `/apply-wo` existe desde 22 de julho e roda o commit sozinho; a pasta vinculada existe desde hoje e deixa o chat escrever direto no repositório. Pior: o CEREBRO **se contradizia**, com a linha revogada a quinze seções de distância da substituta — a seção do Code manda virar WO com texto exato e âncora, que é exatamente o «bloco solto» que a outra proíbe.

### Decisão
As duas seções do CEREBRO foram reescritas em torno do canal, não do formato: com pasta vinculada e executor, a entrega é arquivo escrito no repositório ou WO aplicada pelo Code, e quem commita é quem aplica. O modo antigo — baixar, substituir, colar os três comandos — fica registrado como o que vale **quando não há executor nem pasta vinculada**, que é a situação de outro projeto, não desta.

Junto, a cadência de `sessão` foi trocada por `turno` ou `conversa` em 34 pontos de 8 arquivos, pela mesma revogação de v1.106.0: o ritual roda a cada turno, não uma vez por fio.

### O que NÃO mudou, e por quê
- **49 ocorrências de relato histórico** (STATUS a partir de «Última Sessão», DECISIONS, IDEAS, HISTORY): entradas datadas são fato medido. Reescrever falsifica o registro para consertar a regra.
- **131 ocorrências em `meta/workorders/`**: WO aplicada não se reescreve (DEC-030).
- **6 ocorrências nas skills e no `_TEMPLATE.md`**: texto do kit em v1.138.0, a versão corrente — não revogado. «custa uma sessão» mede custo, não prescreve cadência.
- **O rótulo `## 💬 Última Sessão` do STATUS**: é ponteiro. A skill `/wrap` procura o bloco da conversa anterior por ele, e ponteiro renomeado deixa órfão quem aponta — a mesma razão que preservou os nomes `spec0001`–`spec0020` na DEC-030.

### Consequências
- O CEREBRO deixa de se contradizer sobre a forma da entrega. Era a contradição mais cara do arquivo, porque as duas metades estavam certas para projetos diferentes e nenhuma dizia qual era este.
- Fica registrado o método que achou isso: varrer pelo FATO, não pela frase. Nenhuma das duas linhas estava escrita com as palavras da tabela de revogação do kit — a busca por string acharia zero.
- A Fatia 3 (merge dos 123 blocos do CEREBRO) escreve as âncoras contra o texto depois desta WO, não antes.
```

## Edicao 11 — `meta/CHANGELOG.md` · entrada no bloco de infraestrutura

**Ancora** (uma linha, a PRIMEIRA ocorrencia, dentro de `## [Não lançado]`):

```
- **`meta/SPEC.md`** — molde novo da spec de feature: problema, critérios de aceite verificáveis, decisões de desenho, fora de escopo.
```

**Substituir por:**

```
- **`meta/SPEC.md`** — molde novo da spec de feature: problema, critérios de aceite verificáveis, decisões de desenho, fora de escopo.
- **Template-update do KCM v1.138.0, Fatia 1** — `.claude/settings.json` ganhou `Write` e `additionalDirectories` (sem eles o Code não gravava os relatórios na pasta-pai nem criava o log do dia); `apply-wo` e `wrap` fundidas com as do kit; skill `/sondar` instalada; `meta/workorders/_TEMPLATE.md` criado.
- **Template-update do KCM v1.138.0, Fatia 2** (DEC-034) — duas linhas revogadas pelo kit saíram do CEREBRO: a entrega «arquivo completo para baixar, nunca blocos para costurar» e o «commit pronto ao final» em três linhas para colar. Ambas descreviam um projeto sem executor e sem pasta vinculada. Cadência de `sessão` trocada por `turno`/`conversa` em 34 pontos de 8 arquivos; 186 ocorrências preservadas por serem relato histórico, texto do kit corrente ou ponteiro de skill.
```

---

## Depois de aplicar — conferencia antes do commit

Cada passo traz **quem roda**, **como chega la** e **qual pergunta ele NAO responde**.

1. **A contagem fechou, arquivo por arquivo.**
   Quem roda: quem aplica. Como: `for f in meta/CEREBRO.md meta/LOG-TEMPLATE.md meta/CONTEXT.md meta/GLOSSARY.md .flatdropignore CLAUDE.md .gitignore meta/STATUS.md; do echo "$(grep -o -i sess "$f" | wc -l) $f"; done`
   Esperado: `0 CEREBRO`, `1 LOG-TEMPLATE`, `0 CONTEXT`, `0 GLOSSARY`, `0 .flatdropignore`, `0 CLAUDE.md`, `0 .gitignore`, `31 STATUS`.
   **Nao responde:** se o SENTIDO ficou certo — contagem zero com a palavra errada no lugar errado fecha igual. Para isso serve o passo 2.
2. **Os dois blocos novos tem a forma esperada.**
   Quem roda: quem aplica. Como: `git diff meta/CEREBRO.md` e ler as Edicoes 1a a 1f.
   **Nao responde:** se o texto novo esta correto quanto ao merito — isso e do dono.
3. **As linhas revogadas sumiram.**
   Quem roda: quem aplica. Como: `grep -rc "costurar à mão\|Commit pronto ao final\|prontas para colar uma a uma" meta/CEREBRO.md` → **0**.
   **Nao responde:** as ocorrencias em `meta/workorders/` e `meta/DECISIONS.md`, que sao relato e FICAM.
4. **Nenhum ponteiro foi renomeado.**
   Quem roda: quem aplica. Como: `grep -c "## 💬 Última Sessão" meta/STATUS.md` → **1**, e `grep -c "Última Sessão" meta/LOG-TEMPLATE.md` → **1**.
   **Nao responde:** se a skill `/wrap` de fato acha o bloco — so a proxima execucao dela dira.
5. **Nao ha termo duplicado no GLOSSARY.**
   Quem roda: quem aplica. Como: `grep -c "sondar" meta/GLOSSARY.md` → **1**.
   **Nao responde:** nada.

## Relatorio de aplicacao

Os oito campos que a skill `apply-wo` pede, com a **saida crua** do passo 1 (a lista inteira de oito
contagens, nao «bate»).

## Commit — blocos separados, mensagem SEM acento

A propria WO entra no `git add`.

```
git add meta/ CLAUDE.md .gitignore .flatdropignore
git commit -m "docs(meta): retira as linhas revogadas pelo kit v1.138 e troca a cadencia de sessao"
git push
```
