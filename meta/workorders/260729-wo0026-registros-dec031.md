# wo0026 — Registros do kit v1.90: DEC-031, DEC-032, CHANGELOG, STATUS e IDEAS

**Data:** 2026-07-29 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca código do produto?** Não. **Build:** dispensável.
**Depende de:** `wo0024` e `wo0025` aplicadas (a DEC-032 descreve o que a wo0025 fez).

Inclui também a saída do `.claude/settings.local.json` do versionamento e a correção da linha «Versão Atual» do STATUS, que estava mentindo.

**Preserve o final de linha e o encoding de cada arquivo.**

---

## Edição 1 — tirar o `settings.local.json` do Git

Os arquivos inteiros `.gitignore` e `.flatdropignore` já foram entregues pelo chat e devem estar no disco. Se o arquivo já estiver **rastreado**, o `.gitignore` sozinho não basta:

```
git rm --cached .claude/settings.local.json
```

Se o `git rm --cached` responder que o arquivo não está rastreado, siga em frente — significa que ele nunca entrou no índice. **Não apague o arquivo do disco**: ele é a config local da máquina e o Claude Code continua precisando dele. Confirme com `git status` que o `.claude/settings.json` (o compartilhado) **continua versionado**.

## Edição 2 — `meta/DECISIONS.md`: DEC-031 e DEC-032 no fim do arquivo

**Âncora (última linha do arquivo, exata):**

```
- `.flatdropignore`: o corpo das WOs continua fora do mount (peso); as specs de feature **sobem**, porque são curtas e olham para a frente. E a linha passou de `meta/specs/` para `meta/workorders/*` — com `/*` a reinclusão por `!` volta a funcionar, o que a forma antiga impedia.
```

**Substituir por** (a âncora, seguida das duas entradas novas):

```
- `.flatdropignore`: o corpo das WOs continua fora do mount (peso); as specs de feature **sobem**, porque são curtas e olham para a frente. E a linha passou de `meta/specs/` para `meta/workorders/*` — com `/*` a reinclusão por `!` volta a funcionar, o que a forma antiga impedia.

---

## DEC-031 — Adoção do kit v1.90; o `.flatdropignore` passa a ter a regra dentro do bloco
**Data:** 2026-07-29 · **Status:** aceita

### Contexto
Terceiro template-update do KCM neste projeto (v1.73 → v1.87 → v1.90). Duas mudanças do pacote mereciam adoção e uma delas nos pegou errados.

O v1.90 formaliza o que a DEC-008 já praticava: **template genérico não é candidato a substituir arquivo vivo refinado** — `CLAUDE.md`, `.claude/*`, as skills e os `meta/` especializados caem por padrão em «o projeto tem, o template não cobre», e não voltam à pauta a cada update. A única exceção é formato descontinuado (`.claude/commands/` → `.claude/skills/`), e este repo já está migrado. Junto vem a exigência de **listar o mount e declarar versão/commit antes de comparar**: o pacote descreve o kit, não o repo.

A segunda é técnica e nos corrigiu. O `.flatdropignore` que este projeto escreveu em 2026-07-27 (DEC-030) deixou as regras **fora** do bloco `# >>> flatdrop-editor`, com só duas dentro. O editor do FlatDrop **reescreve o bloco inteiro a cada salvamento**: regra fora do bloco é invisível para ele, e comentário dentro do bloco desaparece. Pior, `INSTRUCOES-DO-PROJETO.md` acabou escrito **duas vezes**, uma fora e uma dentro — a duplicação silenciosa que o próprio v1.90 descreve na regra nova sobre artefato gerado que convive com edição humana.

### Decisão
- Todas as regras do `.flatdropignore` passam para **dentro** do bloco; explicação fica **acima** dele; **nada** depois do `# <<<`, porque vale a última regra que casa e o que vier depois vence o bloco em silêncio.
- Forma `pasta/*` (o conteúdo), nunca `pasta/` (a pasta), em toda linha de pasta — inclusive `logs/*` e os `src/v*/*`. É o que permite reincluir um arquivo com `!` depois.
- `meta/specs/` e `meta/analises/` seguem **fora** da lista, subindo ao mount. O motivo, agora emprestado do kit: análise «Em discussão» que o assistente não vê não é discutida, é reescrita do zero.
- **`.claude/settings.local.json` sai do Git e do mount.** São caminhos absolutos da máquina do autor e uma lista de permissões que o Claude Code acumula sozinho — config de ambiente, não conhecimento do projeto. O `.claude/settings.json` compartilhado continua versionado (DEC-016 intacta).
- Adotadas no CEREBRO, pela `wo0024`: a regra do template-update acima; o gatilho concreto de análise («mudar o formato de um artefato que outra pessoa vai ler ou editar pede análise, mesmo com diff pequeno»); a proibição de renomear pasta alheia por conta própria; os quatro modos de falha da releitura de mount; a regra de que a linha «Estado» só carrega dado lido no próprio turno; e a de que a cópia do assistente não é a fonte da verdade.

### Alternativas consideradas
- **Manter o `.flatdropignore` como estava.** Recusada: funciona hoje e quebra na primeira vez que alguém salvar pelo editor, com o sintoma aparecendo longe da causa — arquivo que devia sumir do mount continuando lá, ou o contrário.
- **Levar tudo para dentro do bloco, inclusive os comentários.** Impossível por construção: o editor reescreve o bloco e os comentários somem.
- **Apagar o `settings.local.json`.** Recusada: o Code precisa dele em disco. O que sobra é tirá-lo do índice, não do sistema de arquivos.

### Consequências
- O `.flatdropignore` ficou mais longo em explicação e mais curto em regra — que é a divisão certa, já que a explicação é a única parte que sobrevive ao editor.
- Quem clonar o repo numa máquina nova não herda as permissões locais do autor e vai reconstruí-las. É o comportamento correto para um arquivo `.local`.
- Terceira rodada seguida em que quatro feedbacks deste projeto não foram absorvidos pelo kit (ver IDEAS). Isso não bloqueia nada, mas já é padrão, não acaso.

---

## DEC-032 — `getAvailableProps` e `getAvailablePerks` passam a receber o item, não o `id`
**Data:** 2026-07-29 · **Status:** aceita · **Aplicada pela** `wo0025`

### Contexto
As duas funções de `logic.js` estavam sem consumidor desde a limpeza de 2026-07-25 e eram armadilha ativa (armadilha 14 do CONTEXT): resolviam o item por `id` via `getItem(itemId)` e, para amuleto magistral com `classBinding`, devolviam o item cru do `GEAR` — **sem** os props e perks de classe, e **sem erro**. Enquanto isso, o `App.jsx` reimplementava a mesma regra inline em dois lugares (`PropInput` e `PerkRow`), justamente para poder passar o item efetivo.

### O que foi medido
Antes de recomendar, foram lidos os dois pontos de chamada. **`PropInput` e `PerkRow` já recebem o item efetivo por prop** — o pai já resolveu o `classBinding`. A troca de assinatura, portanto, não exigia nada dos chamadores que eles já não tivessem: era um encaixe, não um refactor. Foi essa medição que decidiu entre as duas saídas.

### Decisão
Assinatura passa a `getAvailableProps(item, slot, otherPropId)` e `getAvailablePerks(item, otherPerkId)`; o `getItem()` interno sai. Os dois filtros inline do `App.jsx` viram chamadas. **Não se reintroduz sobrecarga que aceite `id`.**

### Alternativas consideradas
- **Remover as duas funções**, já que ninguém as usava. Era a saída de menor risco e foi recusada por dois motivos: a regra de bloqueio por `sk` (props de mesma `sk` não coexistem em P1 e P2) é conhecimento de domínio que ficaria só implícito no meio de um componente de 2.500 linhas; e a duplicação entre `logic.js` e `App.jsx` continuaria existindo — apenas com uma das cópias apagada, o que não é o mesmo que resolvida.
- **Deixar como estava e só documentar melhor a armadilha.** Recusada: comentário não impede ninguém de chamar. A assinatura impede.

### Consequências
- A armadilha 14 muda de natureza: deixa de ser «cuidado ao usar» e vira «o erro é impossível de escrever». O CONTEXT foi reescrito nesse sentido pela `wo0025`.
- Uma fonte de verdade a menos duplicada. Restam duas da mesma família no backlog: `selectTech`/`selectAbility` e o formatador de estatísticas.
- `App.jsx` perde cerca de dez linhas e recupera dois imports que a limpeza de julho havia removido por órfãos.
```

## Edição 3 — `meta/CHANGELOG.md`: bloco de infraestrutura e a mudança de código

> `### Adicionado` aparece três vezes no arquivo, então a âncora abaixo inclui a linha anterior e a linha em branco para ficar única. Copie o bloco inteiro, com a linha vazia no meio.

**Âncora (três linhas, exata):**

```
- `CLAUDE.md`, `.flatdropignore` e `meta/LOG-TEMPLATE.md` atualizados para o vocabulário novo.

### Adicionado
```

**Substituir por:**

```
- `CLAUDE.md`, `.flatdropignore` e `meta/LOG-TEMPLATE.md` atualizados para o vocabulário novo.
- **Template-update do KCM v1.90.0 comparado e fundido** (DEC-031) — sem efeito no produto. O CEREBRO ganhou: o template genérico deixa de ser candidato a substituir arquivo vivo refinado; a exigência de declarar versão/commit antes de comparar; o gatilho concreto de análise para mudança de formato de artefato; os quatro modos de falha da releitura de mount; e a regra de que a linha «Estado» só carrega dado lido no próprio turno.
- **`.flatdropignore` reorganizado** — regra dentro do bloco `flatdrop-editor`, explicação acima dele, nada depois do `# <<<`, e forma `pasta/*` em toda linha de pasta. Corrige a duplicação silenciosa de `INSTRUCOES-DO-PROJETO.md`, que estava escrito dentro e fora do bloco.
- **`.claude/settings.local.json` saiu do versionamento e do mount** — config de máquina (caminhos absolutos, permissões acumuladas pelo Code), não conhecimento do projeto. O `.claude/settings.json` compartilhado segue versionado.

### Modificado
- **`getAvailableProps` e `getAvailablePerks` passam a receber o item resolvido** em vez do `id` (DEC-032). Elimina a armadilha 14 pela assinatura — o erro deixa de ser possível de escrever — e substitui os dois filtros inline do `App.jsx` por chamadas às funções. Sem mudança visível de comportamento.

### Adicionado
```

## Edição 4 — `meta/STATUS.md`: a linha «Versão Atual» está desatualizada

**Âncora (uma linha, exata):**

```
**[1.0.0-beta]** — 2026-06-24 — Planejador funcional completo com exportação de texto (Fase 2). Geração de imagem em guia, pendente de aplicação.
```

**Substituir por:**

```
**[1.0.0-beta]** — 2026-06-24 — última versão etiquetada. O `[Não lançado]` do CHANGELOG já acumula a **Fase 3 inteira** (exportação em imagem nos três modos, painel de exportação, pips de Determinação) e a leva de infraestrutura dos template-updates v1.87 e v1.90. A próxima etiqueta deve sair antes que a distância entre esta linha e o CHANGELOG volte a crescer.
```

## Edição 5 — `meta/STATUS.md`: fechar o item de backlog resolvido

O `getAvailableProps`/`getAvailablePerks` foi decidido e aplicado — pela regra de higiene, item resolvido **sai** do STATUS.

**Âncora (uma linha, exata):**

```
- [ ] **Decidir o destino de `getAvailableProps` e `getAvailablePerks` em `logic.js`** — não têm consumidor e, como estão, são armadilha: resolvem o item por `id` e por isso devolvem lista errada para amuleto com `classBinding` (armadilha 14). Duas saídas: **remover** as duas, já que ninguém as usa, ou **trocar a assinatura** para receber o item já resolvido e então usá-las no `App.jsx` no lugar do filtro inline. Não decidir também é uma escolha — mas aí a armadilha fica.
```

**Substituir por** (linha vazia — o item sai inteiro):

```
```

> Ou seja: apague a linha da âncora, deixando as vizinhas intactas e sem linha em branco sobrando no meio da lista. O desfecho está na DEC-032 e no CHANGELOG.

## Edição 6 — `meta/STATUS.md`: entrada de sessão no fim do arquivo

**Âncora (última linha do arquivo, exata):**

```
**Próximo passo:** a limpeza acordada com o autor, começando pela decisão do item `getAvailableProps`/`getAvailablePerks` — que é o primeiro candidato natural a uma **análise** no formato novo.
```

**Substituir por:**

```
**Próximo passo:** a limpeza acordada com o autor, começando pela decisão do item `getAvailableProps`/`getAvailablePerks` — que é o primeiro candidato natural a uma **análise** no formato novo.

---

### 2026-07-29 — Kit v1.90 e a primeira das pendências de limpeza fechada

**Infraestrutura (DEC-031).** Terceiro template-update comparado. Adotadas cinco disciplinas no CEREBRO, das quais duas se aplicam ao próprio assistente: os quatro modos de falha da releitura de mount, e a regra de que a linha «Estado» do fecho de turno só carrega dado lido naquele turno — «não verificado nesta rodada» passa a ser resposta legítima. O `.flatdropignore` foi reorganizado (regra dentro do bloco, explicação acima, nada depois do `# <<<`) e o `.claude/settings.local.json` saiu do Git e do mount.

**Código (DEC-032).** `getAvailableProps` e `getAvailablePerks` passaram a receber o item resolvido; os dois filtros inline do `App.jsx` viraram chamadas. A armadilha 14 deixou de ser advertência e virou impossibilidade. A decisão foi tomada na conversa, sem análise escrita — corretamente: o CEREBRO diz que mudança pequena não pede cerimônia, e a medição que a decidiu (os dois chamadores já tinham o item efetivo em mãos) coube em dois parágrafos.

**Backlog restante da mesma família:** `selectTech`/`selectAbility` reimplementados inline e o formatador de estatísticas duplicado entre `logic.js` e o `StatsPanel`. Devem ser resolvidos juntos.

**Higiene ainda não feita, agora com um ano de atraso próprio:** o `DECISIONS.md` passou de 1.100 linhas e este `STATUS.md` segue com a maior parte do corpo sob entradas de sessão antigas. Continua sendo curadoria de arquivo inteiro, e continua sendo trabalho do chat.

**Próximo passo:** fechar as duas duplicações restantes do backlog, ou abrir a F4.
```

## Edição 7 — `meta/IDEAS.md`: leva de feedback ao kit

**Âncora (uma linha, exata):**

```
## 📌 Feedback para o Kit de Contexto — leva de 2026-07-27 (template-update v1.87.0)
```

**Substituir por** (a leva nova, depois a âncora original):

```
## 📌 Feedback para o Kit de Contexto — leva de 2026-07-29 (template-update v1.90.0)

- **O `.flatdropignore` do v1.90 é a melhor peça de documentação que o kit já mandou para cá** — e nos corrigiu. Explicar que o editor reescreve o bloco inteiro, que comentário dentro do bloco some, e que nada pode vir depois do `# <<<` porque vale a última regra que casa: as três coisas eram invisíveis para quem escreveu o arquivo em 2026-07-27, e as três estavam erradas aqui. Feedback positivo, registrado com o mesmo peso das reclamações.
- **Terceira rodada consecutiva sem absorver quatro feedbacks deste projeto:** `IDEAS` sem seção «Feedback para o Kit» (registrado em 22/07 e 27/07), `LOG-TEMPLATE` sem campo de guias/WOs entregues, `STATUS` sem «Pendente de Aplicação», `GLOSSARY` sem seção de vocabulário bilíngue de domínio. Não bloqueiam nada; a observação é que já viraram padrão.
- **O kit ainda não diz onde a análise em curso aparece no STATUS.** O funil análise → WO → DECISIONS está bem descrito, mas uma análise «Em discussão» é trabalho em progresso e o kit não define se ela ganha linha em «Em Progresso». A leitura adotada aqui é que sim.
- **O `claude-settings__template-update.json` continua não sendo JSON válido** — a linha `//` depois do objeto, já reportada em 27/07.
- **Sugestão nascida do uso:** o kit não menciona `.claude/settings.local.json` em lugar nenhum, nem no template do `.gitignore`. É um arquivo que o Claude Code cria sozinho, enche de caminhos absolutos e permissões acumuladas, e que ninguém decide versionar — simplesmente acontece. O `gitignore__template-update` do nicho Desenvolvimento deveria trazê-lo por padrão.

---

## 📌 Feedback para o Kit de Contexto — leva de 2026-07-27 (template-update v1.87.0)
```

---

## Fechamento

1. `git status` — confirme que `.claude/settings.local.json` aparece como removido do índice **e continua no disco**.
2. `git diff` — confira em especial a Edição 5 (a linha do backlog apagada sem deixar buraco na lista) e que, no CHANGELOG, o `### Adicionado` da Fase 3 continua logo abaixo do novo `### Modificado`.
3. `git add -A` (incluindo esta WO), commit e push:

```
git commit -m "docs(meta): registra DEC-031 e DEC-032 e tira o settings.local do versionamento"
git push
```

## Relatório esperado
Âncoras que bateram, se o `git rm --cached` encontrou o arquivo rastreado ou não, e o hash do commit.
