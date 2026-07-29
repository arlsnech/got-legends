# wo0023 — Registros da adoção do kit v1.87: DEC-030, CHANGELOG, STATUS e IDEAS

**Data:** 2026-07-27 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca código do produto?** Não. **Build:** dispensável; a rede é o `git diff`.
**Depende de:** `wo0021` e `wo0022` aplicadas.

Fecha também três pendências de registro do `260727-HANDOFF-BRIEF.md`, seção 8: o aviso do `taskkill`, a regra «procure antes de inserir» e o item de backlog da duplicação do formatador de stats.

**Preserve o final de linha e o encoding de cada arquivo como já estão.**

---

## Edição 1 — `meta/DECISIONS.md`: nova DEC-030 no fim do arquivo

**Âncora (última linha do arquivo, exata):**

```
`cmd: "L1+R1"` entrou nos quatro Supremos de `data.js`, conferido no jogo pelo autor. As quatro classes usam o mesmo comando e ainda assim ele é escrito quatro vezes — DEC-006 em vigor: `data.js` é explícito. Uma constante compartilhada economizaria três linhas e criaria a dúvida "e se uma classe mudar?", que é o tipo de pergunta que dado explícito não tem.
```

**Substituir por** (a âncora, seguida da entrada nova):

```
`cmd: "L1+R1"` entrou nos quatro Supremos de `data.js`, conferido no jogo pelo autor. As quatro classes usam o mesmo comando e ainda assim ele é escrito quatro vezes — DEC-006 em vigor: `data.js` é explícito. Uma constante compartilhada economizaria três linhas e criaria a dúvida "e se uma classe mudar?", que é o tipo de pergunta que dado explícito não tem.

---

## DEC-030 — `spec` passa a se chamar `WO`; `specs/` fica para specs de feature
**Data:** 2026-07-27 · **Status:** aceita

### Contexto
O template-update do KCM v1.87.0 trouxe uma separação que este projeto não fazia. O kit agora distingue **WO** (`meta/workorders/`, o texto exato de uma edição e a âncora onde ela entra — diz *como aplicar*) de **spec de feature** (`meta/specs/`, uma por feature — diz *o quê construir e quando está pronto*, com critérios de aceite verificáveis).

Pelo conteúdo, as vinte "specs" 0001–0020 deste projeto são **WOs**: nenhuma delas enuncia critério de aceite; todas enunciam âncora e texto. O nome `specs/` estava ocupado pelo artefato errado, e o artefato que o kit chama de spec **não existia aqui em nenhuma forma** — o que se aproximava dele eram os `GUIA_*.md`, justamente o formato que deixou a Fase 3 parada de junho a julho.

Foi a segunda vez que o kit passou por este projeto. Na primeira (DEC-007, DEC-008) a régua foi «convenção genérica que colide com prática em vigor é sugestão, não ordem». Esta decisão **não** é uma exceção a ela: aqui não há colisão de convenção, há um conceito novo que o projeto não tinha, e o nome que ele quer estava ocupado.

### Decisão
- `meta/specs/` → `meta/workorders/`; a skill `/apply-spec` → `/apply-wo`; o método passa a se chamar «doc por WO».
- **Os vinte arquivos existentes não foram renomeados**, nem as menções a `spec0001`…`spec0020` nos documentos. São nomes próprios de artefatos passados: reescrevê-los faria o histórico mentir sobre o que se chamava o quê em cada data.
- **A numeração é contínua.** A primeira WO com o nome novo é a `wo0021`. A sequência é a do trabalho, não a do rótulo.
- `meta/specs/` volta a existir quando a primeira spec de feature for escrita, no molde de `meta/SPEC.md`. Não nasce vazia.
- Junto vieram, do mesmo template-update, três disciplinas novas: «Análise antes do compromisso» (`meta/analises/`), o «Bloco de fecho de turno» e o endurecimento da revisão de mount. Ver CEREBRO.

### Alternativas consideradas
- **Manter tudo como estava e registrar o desvio.** Custo zero, e a DEC-008 já licenciava. Recusada: o vocabulário do projeto e o do kit divergiriam para sempre, e cada template-update futuro reabriria a questão — que é exatamente o atrito que esta leva veio reduzir.
- **Renomear também os vinte arquivos e todas as menções históricas.** Recusada: ou o histórico passa a mentir, ou fica pela metade e inconsistente. O nome de um artefato é a data em que ele nasceu.
- **Manter o nome `spec` para o artefato de aplicação e batizar a spec de feature de outra coisa** (`meta/features/`). Recusada: preserva o mal-entendido que causou o problema, só que com mais um nome.

### Consequências
- O que era `spec` no vocabulário deste projeto agora é `WO` daqui para a frente, e continua sendo `spec` no que já foi escrito. A `wo0021` deixou isso registrado no `GLOSSARY.md` para que a leitura do histórico não confunda.
- Abre espaço para o artefato que faltava. A F4 (Polimento e Mobile) e a decisão pendente sobre compartilhamento por link são candidatas naturais à primeira **análise** e à primeira **spec de feature**.
- `.flatdropignore`: o corpo das WOs continua fora do mount (peso); as specs de feature **sobem**, porque são curtas e olham para a frente. E a linha passou de `meta/specs/` para `meta/workorders/*` — com `/*` a reinclusão por `!` volta a funcionar, o que a forma antiga impedia.
```

## Edição 2 — `meta/CHANGELOG.md`: bloco novo em [Não lançado]

**Âncora (três linhas consecutivas, exatas):**

```
## [Não lançado]

### Adicionado
```

**Substituir por:**

```
## [Não lançado]

### Infraestrutura de repositório
- **Template-update do KCM v1.87.0 comparado e fundido** — sem efeito no produto. `meta/specs/` passou a `meta/workorders/`, a skill `/apply-spec` passou a `/apply-wo`, e o nome `meta/specs/` ficou reservado para specs de feature (DEC-030). Os vinte arquivos existentes e as menções históricas a `spec0001`–`spec0020` foram preservados.
- **`meta/SPEC.md`** — molde novo da spec de feature: problema, critérios de aceite verificáveis, decisões de desenho, fora de escopo.
- **«Análise antes do compromisso»** — mudança não-trivial passa a começar por uma análise escrita em `meta/analises/` (a pasta nasce no primeiro uso), com recomendação única e ponto de decisão. Funil: análise → WO → DECISIONS.
- **«Bloco de fecho de turno»** — formato fixo de encerramento na raia de planejamento: Próximo · Estado · Arquivar/Manter · Config por raia · Handoff. Quem executa no Code fecha com relatório de trabalho, não com este formulário.
- **DEC-008 ganhou a lista de «colisões já julgadas — não reabrir»** — as seis linhas em que o template genérico colide com este projeto todo update e que já foram decididas passam a ser reportadas como «sem ação», em vez de reapresentadas como decisão.
- `CLAUDE.md`, `.flatdropignore` e `meta/LOG-TEMPLATE.md` atualizados para o vocabulário novo.

### Adicionado
```

## Edição 3 — `meta/STATUS.md`: item que faltava no backlog

**Âncora (uma linha, exata):**

```
- [ ] **Duplicação de `selectTech` / `selectAbility`** — o `App.jsx` reimplementa inline o toggle que essas duas funções de `logic.js` já fazem, com lógica idêntica. Ao contrário do caso acima, aqui não há motivo: as assinaturas servem. Trocar o inline pela chamada elimina uma fonte de verdade duplicada. Mudança de duas linhas, mas **não embutida na spec0012** por estar fora do escopo dela.
```

**Substituir por:**

```
- [ ] **Duplicação de `selectTech` / `selectAbility`** — o `App.jsx` reimplementa inline o toggle que essas duas funções de `logic.js` já fazem, com lógica idêntica. Ao contrário do caso acima, aqui não há motivo: as assinaturas servem. Trocar o inline pela chamada elimina uma fonte de verdade duplicada. Mudança de duas linhas, mas **não embutida na spec0012** por estar fora do escopo dela.
- [ ] **Duplicação do formatador de estatísticas** — o `if (s.unit === '●') return '●'.repeat(s.value)` do `StatsPanel` (`App.jsx`) é cópia do que já existe em `formatStatValue` (`logic.js`). Descoberta durante a `spec0019`, onde custou uma edição extra: os dois tiveram de ser corrigidos para a mesma coisa. Mesma família do item acima e deve ser resolvida junto.
```

## Edição 4 — `meta/STATUS.md`: entrada de sessão no fim do arquivo

**Âncora (última linha do arquivo, exata):**

```
**Próximo passo:** a limpeza acordada com o autor — o destino de `getAvailableProps`/`getAvailablePerks` (armadilha 14, sem consumidor), a duplicação de `selectTech`/`selectAbility` e a do formatador de stats entre `logic.js` e o `StatsPanel`, e as cópias soltas de `GUIA_COMPLETO*.md` fora do repositório.
```

**Substituir por:**

```
**Próximo passo:** a limpeza acordada com o autor — o destino de `getAvailableProps`/`getAvailablePerks` (armadilha 14, sem consumidor), a duplicação de `selectTech`/`selectAbility` e a do formatador de stats entre `logic.js` e o `StatsPanel`, e as cópias soltas de `GUIA_COMPLETO*.md` fora do repositório.

---

### 2026-07-27 — Segundo template-update do KCM (v1.87.0), sem tocar no produto

Sessão de infraestrutura. O pacote de dezoito arquivos genéricos foi comparado item a item com os vivos; nada foi sobrescrito por template vazio.

**Adotado:** a renomeação `spec` → **WO** com `meta/specs/` liberada para specs de feature (DEC-030); a disciplina de **análise antes do compromisso**; o **bloco de fecho de turno**; o endurecimento da revisão de mount e da exposição de premissas; as quatro cláusulas novas de refino das Instruções; o relatório de trabalho obrigatório no `/apply-wo`; e a forma `meta/workorders/*` no `.flatdropignore`, que devolve o funcionamento do `!`.

**Recusado, e agora registrado para não voltar à pauta:** as seis colisões recorrentes entre o template genérico e a prática deste projeto — IDs `snake_case` PT-BR, commits sem acento, `.gitignore` de stack, `settings.json` com os `npm run`, as skills na versão longa e a regra bilíngue. Estão nomeadas na DEC-008 sob «colisões já julgadas — não reabrir». Era a segunda vez que a mesma discussão se abria.

**Fechadas três pendências de registro** que vinham do handoff: o aviso do `taskkill`, a regra «procure antes de inserir» e o item de backlog do formatador de stats duplicado.

**Higiene levantada e ainda não feita:** o `DECISIONS.md` passou de 1.000 linhas (o limiar do CEREBRO é ~700) e o `STATUS.md` tem cerca de três quartos do corpo sob «Última Sessão», quando o arquivo deveria ser rolante. Curadoria de arquivo inteiro é trabalho do chat, não do Code.

**Próximo passo:** a limpeza acordada com o autor, começando pela decisão do item `getAvailableProps`/`getAvailablePerks` — que é o primeiro candidato natural a uma **análise** no formato novo.
```

## Edição 5 — `meta/IDEAS.md`: leva nova de feedback e duas correções de processo

**Âncora (três linhas consecutivas, exatas):**

```
## 🔧 Correções de processo

### 2026-07-26 — Hipótese de causa precisa vir com teste e com instrução de parada
```

**Substituir por:**

```
## 📌 Feedback para o Kit de Contexto — leva de 2026-07-27 (template-update v1.87.0)

- **O `IDEAS__template-update.md` continua sem a seção «Feedback para o Kit»** — mesmo feedback já registrado por este projeto em 2026-07-22 e não absorvido em catorze versões. O CEREBRO exige a seção em dois lugares (regra de higiene e tabela de gatilhos): o template está incompleto em relação ao comportamento que ele mesmo prescreve.
- **O `claude-settings__template-update.json` não é JSON válido.** Traz uma linha `// Adicione seu comando de build/teste ao allow…` **depois** do objeto. Aplicado como está, quebra qualquer parser estrito. A dica deveria vir no manifesto ou como campo do próprio JSON.
- **O `gitignore__template-update` continua só com lixo de SO** — sem `node_modules/` nem `dist/`. Feedback de 2026-07-22 não absorvido. Deveria vir marcado no manifesto como **aditivo**, não como substituto.
- **O `LOG-TEMPLATE__template-update.md` continua sem «Guias entregues»** e o `STATUS__template-update.md` continua sem «Pendente de Aplicação» — as duas de 2026-07-22, idem.
- **O `GLOSSARY__template-update.md` continua sem seção de glossário bilíngue de domínio** — idem.
- **O kit repete a pergunta já respondida.** Este projeto passou pelo update duas vezes e nas duas o assistente reapresentou as MESMAS colisões (IDs em PT-BR, commits sem acento, `.gitignore`) como decisão a tomar. Custa um turno do usuário para chegar à mesma resposta, e desgasta. **Sugestão para o kit:** o `_UPDATE-PROMPT.md` deveria mandar o assistente procurar no `DECISIONS.md` do projeto se a colisão já foi julgada e, havendo julgamento, reportá-la como «colisão conhecida, sem ação». Este projeto resolveu localmente com a lista «colisões já julgadas — não reabrir» dentro da DEC-008.
- **O `taskkill` do Claude Code é perigoso e ninguém avisa.** Em pelo menos duas sessões o executor encerrou o dev server com `taskkill /F /IM node.exe /T`, que mata **todo** processo Node da máquina — não só o Vite. Ninguém reclama porque o comando "funciona". **Sugestão para o kit:** o `CLAUDE.md` de arranque deveria trazer, no nicho Desenvolvimento, a regra de encerrar servidor por **porta ou PID**, nunca por nome de imagem. Aplicado localmente no `CLAUDE.md` deste repo em 2026-07-27.
- **O funil análise → WO → DECISIONS é boa adição, mas não diz onde a análise encontra o STATUS.** Uma análise em curso é trabalho em progresso; o kit não define se ela aparece no STATUS enquanto espera decisão. Aqui a leitura adotada é que sim: análise aberta é linha em «🔧 Em Progresso» até virar decisão.

---

## 🔧 Correções de processo

### 2026-07-27 — Procure antes de inserir

A `spec0019` criou uma entrada *Determinação* no `GLOSSARY.md` sem verificar que já havia outra três linhas abaixo. O executor seguiu a âncora — que é o comportamento certo — e reportou; as duas tiveram de ser consolidadas depois.

**Regra que fica:** antes de inserir uma entrada nova em qualquer doc (termo no GLOSSARY, item de backlog no STATUS, ideia no IDEAS, armadilha no CONTEXT), **procure o termo primeiro**. A âncora garante *onde* o texto entra, não que ele já não exista em outro lugar do arquivo. Quem escreve a WO é que tem de olhar; o executor, por desenho, não olha.

### 2026-07-26 — Hipótese de causa precisa vir com teste e com instrução de parada
```

---

## Fechamento

1. `git diff` — confira as cinco edições, em especial que a DEC-030 ficou no fim do `DECISIONS.md` e que o bloco `### Adicionado` do CHANGELOG continua logo abaixo do bloco novo.
2. `git add` (incluindo esta WO).
3. Commit e push:

```
git commit -m "docs(meta): registra a DEC-030, o feedback ao kit v1.87 e tres pendencias do handoff"
git push
```

## Relatório esperado

Quais âncoras bateram, quais não, e o hash do commit. Se qualquer âncora falhar, PARE e reporte — não aplique as outras pela metade.
