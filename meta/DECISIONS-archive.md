# DECISIONS-archive.md — Arquivo morto do Registro de Decisões

> Entradas do `DECISIONS.md` cujo evento fechou ou cuja decisão foi substituída. **Arquivo morto não é lixo:** o «por que não» guardado aqui evita refazer o mesmo debate.
> As entradas foram **movidas sem edição** — o texto abaixo do divisor é o mesmo, linha por linha, que estava no `DECISIONS.md` até o commit `12eecef`. A numeração é uma só para os dois arquivos: DEC ou FIX citado em outro lugar e ausente do `DECISIONS.md` está aqui.
> Não se acrescenta entrada nova aqui: ela nasce no `DECISIONS.md` e só vem para cá quando o evento dela fechar.

## Divisão de 2026-11-27 (curadoria do chat)

Critério do CEREBRO («Regras de higiene»): arquiva-se por evento, não por tamanho, e FIX fica enquanto a lição valer. Saíram dez entradas; o `DECISIONS.md` passou de 1.293 para 1.052 linhas (`wc -l`). Ficaram no arquivo vivo todas as decisões em vigor no código ou no processo e todos os FIX cuja lição ainda vale — por isso ele segue acima do alarme de ~700 linhas.

- **FIX-001** — a lição («diga REMOVA o bloco X antes de adicionar Y») era do tempo em que o dono colava código à mão; com a WO e a âncora exata (DEC-007, DEC-030), a duplicação não tem por onde voltar.
- **DEC-007** — evento fechado: a adoção do kit v1.73.0. O fluxo de duas raias segue, descrito no CEREBRO; o vocabulário `spec` foi trocado pela DEC-030 e o método de fusão pela DEC-039. Citada no CEREBRO («Neste repo (DEC-007)») e no HISTORY.
- **DEC-009** — evento fechado: a troca de nome `HISTORICO.md` → `HISTORY.md`, feita em 2026-07-22.
- **DEC-011** — evento fechado: a extração retroativa terminou (spec0008 a spec0012) e a Fase 3 foi entregue na 1.0.0.
- **DEC-021** — repete a DEC-004 (Canvas nativo, sem dependência), que segue no arquivo vivo; o Status «ainda não executada» envelheceu com a entrega da Fase 3 (DEC-026 a DEC-028). Citada em `src/App.jsx`, no GLOSSARY, no ROADMAP, no IDEAS e na análise 261116.
- **DEC-025** — evento fechado: os guias legados foram absorvidos e removidos; não há mais guia legado no repositório. As cópias soltas em `notas-arquivadas\` estão no backlog do STATUS.
- **DEC-026** — evento fechado: a auditoria do guia da Fase 3 foi aplicada pela spec0014 («Desfecho»). As lições vivas estão nas armadilhas 15, 18 e 20 do CONTEXT e nos FIX-010 a FIX-013, que ficam no arquivo vivo. Citada no CEREBRO, no CONTEXT, no GLOSSARY, no ROADMAP, no STATUS e em `src/App.jsx`.
- **DEC-031** — evento fechado: a adoção do kit v1.90.0. A regra do bloco do `.flatdropignore` vive no próprio arquivo, e o `.flatdropignore` é hoje canal de reserva (o chat lê a pasta vinculada). Citada no `.flatdropignore`, no `.gitignore`, no CEREBRO e no CHANGELOG.
- **DEC-035** — evento fechado e repetido pela DEC-039: a fusão do kit v1.142.0 partindo do pacote. O método está no cabeçalho do CEREBRO e no `GUIA-DO-KIT.md`; a divisão de autoria (D2) está no CEREBRO, «Técnicas específicas deste projeto».
- **DEC-036** — evento fechado: a `main` alcançou a `v2-planner` em 2026-11-16 e a `v2-planner` foi apagada. O estado que fica (trabalho na `main`) é o do CONTEXT e da DEC-037.

---

## FIX-001 — Componentes declarados em duplicata (BookmarkTab, SaveDrawer, etc.)

**Data:** 2026-06-24

- **Sintoma:** `Identifier 'BookmarkTab' has already been declared` no Vite ao iniciar.
- **Causa raiz:** As instruções de Fase 1 pediram para adicionar os novos componentes antes de `// ─── App`, mas o usuário adicionou sem remover os que haviam sido entregues numa sessão anterior. Resultado: dois blocos de componentes no mesmo arquivo.
- **Solução:** Deletar linhas 1109–1724 do `App.jsx` (versão antiga de `BookmarkTab`, `SaveDrawer`, `ExportPanel`, `SettingsModal`). A versão correta (com `TrashIcon`, ícones e tema) começa na linha 1726.
- **Lição:** Ao entregar componentes novos como substituição de anteriores, especificar explicitamente "REMOVA o bloco X antes de adicionar Y". Virou armadilha no CONTEXT.

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

## DEC-009 — `HISTORICO.md` renomeado para `HISTORY.md`

**Data:** 2026-07-22 · **Status:** aceita

### Contexto
O arquivo nasceu como `meta/HISTORICO.md`, mas o kit o chama de `HISTORY.md` em todos os lugares onde ele é referenciado (tabela «Como manter os documentos» do CEREBRO, lista de arquivos das Instruções, manifesto de update). Manter os dois nomes obrigaria a traduzir mentalmente a cada leitura.

### Decisão
Renomear para `meta/HISTORY.md` e alinhar o título interno. Verificado antes: o nome antigo não era citado por nenhum outro documento de `meta/` — só pelo próprio título e pelos arquivos gerados pelo FlatDrop (`_MANIFEST.md`, `_TREE.md`), que são regenerados a cada upload. O custo do rename era, portanto, quase zero.

### Consequências
Os nomes de `meta/` passam a bater 1:1 com o vocabulário do kit. O `_MANIFEST.md` do próximo flatdrop refletirá o nome novo sozinho.

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

## DEC-021 — A Fase 3 gera a imagem com Canvas API pura, sem dependência externa

**Data do registro:** 2026-07-24 · **Status:** aceita, ainda não executada · **Fonte:** `meta/legacy/GOT_Build_-_TOhno.md`, bloco 3

### A decisão
Ao planejar a exportação em imagem, o autor foi direto: *"api do canvas sem dependências externas"*. Isso **descarta** `html2canvas`, `dom-to-image`, `satori` e qualquer biblioteca de captura de DOM. A imagem é desenhada à mão no `<canvas>`, com o mesmo dado que o `generateBuildText` já usa.

### Por que isso importa mais do que parece
Capturar o DOM seria muito mais rápido de escrever — e produziria uma foto da tela, não um artefato próprio. O que o autor pediu é outra coisa: um **layout em colunas com caixas e formatação**, dimensionado para caber num post, não um recorte da interface. Um `html2canvas` entregaria a coisa errada com menos esforço, e é exatamente por isso que a restrição está registrada.

Efeito colateral bem-vindo: o `package.json` continua com duas dependências de runtime (React e ReactDOM) e nenhuma para a Fase 3.

### Consequência
`generateBuildImage` precisa carregar os ícones como `Image()` e esperá-los antes de desenhar — trabalho assíncrono que a versão em texto não tem. O esqueleto já escrito para isso está no `meta/legacy/GUIA_CORRECOES_FASE3.md` (~470 linhas); ver a nota operacional no fim do `ROADMAP.md`.

---

## DEC-025 — Guia legado não vive no repositório: é estudado, absorvido e removido

**Data:** 2026-07-25 · **Status:** aceita · **Fonte:** diretriz do autor + comparação dos dois guias

### A diretriz
Guias de aplicação antigos **não são estrutura do projeto**. Usá-los como estão é ruim de duas maneiras — um estava superado (regressão) e o outro tem defeitos (ver DEC-026). O destino correto de um guia é: estudar, levar o conteúdo para `meta/`, `meta/specs/` e para os scripts, e então **remover**. O Git preserva o corpo; os `meta/` preservam o sentido.

Isso completa a DEC-012, que resolveu *não perder* o material legado. Esta resolve o que fazer **depois** de ele ter servido: material legado é insumo, não acervo.

### A comparação — qual guia era o mais recente
| | `GUIA_COMPLETO_v4.md` | `GUIA_CORRECOES_FASE3.md` |
|---|---|---|
| Origem | rodada **v8** do `TOhno` | rodada **v10**, a última |
| Correções | 6 (barra de HP, largura da coluna, TechRow, habilidades sem quebra, espaçamento) | 4 — **as que consertaram os defeitos das 6 anteriores** |
| Fase 2 | código completo | só a correção dos `undefined` |
| Fase 3 | **esqueleto** | **código completo, ~470 linhas** |

O segundo é o mais novo em todos os eixos: suas quatro correções são o *follow-up* das seis do primeiro, e onde um tem esqueleto o outro tem implementação. **Codar a Fase 3 a partir do `GUIA_COMPLETO_v4.md` teria sido regressão dupla** — esqueleto no lugar de código, e correções antigas no lugar das novas.

### O que sobreviveu do guia superado
Uma coisa só, e não é código: a localização das larguras de coluna (`gridTemplateColumns`, no bloco `ÁREA DE 3/2 COLUNAS`), conferida em 2026-07-25 como ainda exata. Foi para o `CONTEXT.md`, junto da armadilha 13, que é sobre os mesmos dois modos.

Todo o resto já estava aplicado no código e registrado nos `meta/` — as seis correções, a Fase 2 inteira, e o esqueleto da Fase 3 que o guia mais novo substitui.

### `GOT_Build.md` — verificação que dispensou uma sessão
A spec0012 recomendou re-extraí-lo com o método da DEC-011, sob a suspeita de que a leitura de 2026-07-22 tivesse sido rasa. **A suspeita foi verificada e é falsa.** Os sete prompts do arquivo foram comparados um a um com os do `GOT_Build_-_TOhno.md`: são **os mesmos prompts, sem as respostas** — o arquivo é a exportação "só prompts" da mesma conversa, e ainda por cima sem o bloco de relatório de erro. É **subconjunto estrito** de um arquivo já extraído por inteiro pela spec0011, com mais contexto.

Não havia o que extrair. A verificação custou minutos; a re-extração teria custado uma sessão.

**Regra que fica:** antes de agendar uma releitura de material legado, **compare-o com o que já foi lido.** Arquivos exportados da mesma origem se repetem, e a suspeita de leitura rasa é barata de testar e cara de assumir.

---

## DEC-026 — O código da Fase 3 no guia é ponto de partida, não entrega

**Data:** 2026-07-25 · **Status:** aceita, orienta a execução da Fase 3

### Por que esta decisão existe
O `GUIA_CORRECOES_FASE3.md` traz ~470 linhas prontas de `generateBuildImage`. A tentação é aplicá-las e declarar a fase feita. **A auditoria linha a linha encontrou sete defeitos** — e os dois piores não quebram nada visivelmente: produzem uma imagem plausível e errada, que é a pior falha possível num recurso cujo propósito é ser compartilhado publicamente.

A decisão: o guia entra como **rascunho de referência**. A arquitetura de desenho é refeita, e cada defeito abaixo é corrigido antes de a fase ser considerada pronta.

### Os sete defeitos

**D1 — O amuleto é lido do `GEAR` cru.** No laço de desenho dos equipamentos, o código faz `getItem(slotState.itemId)` para os cinco slots, inclusive `charm`, e depois procura as propriedades escolhidas em `item.props`. Para um amuleto Magistral com `classBinding`, as props e perks exclusivos de classe **não existem** no item cru: a busca falha, o `if (!propDef) continue` engole, e a imagem sai **sem as propriedades de classe** — as mesmas que o usuário está vendo na tela naquele instante. É a armadilha 7 acontecendo dentro do recurso novo. **Correção:** usar `getEffectiveCharm(itemId, linkedClass)` para o slot `charm`, como o `App.jsx` já faz.

**D2 — Altura fixa, e calibrada ao contrário.** `IMG_H = mode === 'stats' ? 820 : 560`. Não há medição do conteúdo. O modo **Detalhado** desenha a descrição de cada propriedade e de cada vantagem com quebra de linha — até vinte parágrafos na coluna direita — e recebe a altura **menor** das duas. Ou seja: o modo mais alto do sistema é o que tem menos espaço, e o corte não é caso extremo, é o caso comum. O próprio guia admite ("o canvas pode ficar maior que o conteúdo... no futuro pode-se calcular dinamicamente") e o `ROADMAP.md` já tinha "altura dinâmica" empurrado para a F4. **Correção:** duas passadas — medir e depois desenhar (ver arquitetura abaixo). Isso deixa de ser item de F4 e vira requisito de F3.

**D3 — Ícone de classe fica invisível.** Na tela, os SVG de classe são branqueados por CSS (`iconFilter: 'brightness(0) invert(1)'`). **`ctx.drawImage` não herda filtro CSS.** O ícone entra no canvas com a cor original — escura — sobre o fundo `#07080f`. **Correção:** aplicar `ctx.filter` antes de desenhar o SVG de classe e zerar (`ctx.filter = 'none'`) logo depois. E aqui vale a armadilha 3 sem nenhuma alteração: **filtro em PNG de técnica vira retângulo sólido** — a mesma regra que existe na UI passa a existir dentro do canvas.

**D4 — Sem `devicePixelRatio`.** O canvas é 900 px e o texto varia de 9 a 18 px. Numa tela retina, ou em qualquer visualizador que amplie, o resultado sai borrado — num recurso cujo único propósito é ser postado e ampliado. **Correção:** desenhar em escala 2x (`canvas.width = IMG_W * 2`, `ctx.scale(2, 2)`) e manter todas as coordenadas do layout em unidades lógicas.

**D5 — `toDataURL` em vez de `toBlob`.** Um PNG de 1800×1600 vira uma string base64 de vários megabytes, atribuída ao `href` de uma âncora. **Correção:** `canvas.toBlob()` + `URL.createObjectURL()`, com `URL.revokeObjectURL()` depois do clique.

**D6 — Rodapé em posição absoluta.** A assinatura é desenhada em `IMG_H - 10`. Com altura fixa e conteúdo transbordando, ela cai **por cima** do conteúdo. Resolve-se junto com o D2: o rodapé passa a ser o último elemento medido.

**D7 — O diagnóstico de CORS do guia está errado, e importa.** A nota técnica afirma que, sem headers CORS, "o `drawImage` lança `SecurityError`" e "os ícones ficam `null`, silencioso pelo `onError`". Nenhuma das duas coisas é verdade: `drawImage` não lança por contaminação — quem lança é a **exportação** (`toDataURL` / `toBlob`) —, e `onerror` não captura isso, porque a imagem carregou normalmente. O efeito real de um problema de origem seria **a exportação inteira falhar no último passo**, não uma degradação suave. Como os ícones são servidos pelo próprio Vite (mesma origem), o `crossOrigin = 'anonymous'` é desnecessário. **Correção:** remover o `crossOrigin` e envolver a exportação em `try/catch` com mensagem clara, em vez de confiar numa degradação que não existe.

### Arquitetura decidida — medir, depois desenhar
As duas passadas usam **o mesmo código de layout**, com um interruptor: na primeira, as funções de escrita apenas acumulam altura; na segunda, escrevem de fato. É o que torna o D2 e o D6 solucionáveis sem manter duas cópias do layout, que divergiriam.

A altura final é `max(altura da coluna esquerda, altura da coluna direita) + header + rodapé`, e o canvas é criado só depois disso.

### O que continua valendo do guia — não jogue fora
A auditoria confirmou como corretos: a assinatura `getStatGroups(stats, classId, lang)`; as chaves `stats.maxHP` e `stats.maxResolve`; a escolha de `formatStatValue(valor, unidade)` para as propriedades (`0.12 → "+12%"`); todas as chaves de paleta lidas de `T`, inclusive `T.cls`; o carregamento em paralelo dos ícones com `Promise.all`; a resolução de `null` no `onerror` para que um ícone ausente não derrube o desenho; e a lista de ícones por elemento, incluindo os das vantagens de classe, que era a preocupação registrada no `ROADMAP.md`.

O layout em duas colunas com faixa de estatísticas ao pé também fica: é o que o autor pediu desde o primeiro prompt.

### Desfecho — aplicada em 2026-07-25 pela spec0014
Os oito defeitos foram corrigidos e a arquitetura de duas passadas foi validada por simulação antes de virar código: as duas passadas devolvem altura idêntica nos três modos, e a passada de medição não pinta nada. O D2 se confirmou pior do que a auditoria supunha — o modo Detalhado de uma build cheia precisa de cerca de 1340 px contra os 560 fixos do guia.

O oitavo defeito não estava na lista original: apareceu ao comparar o código do guia com o `generateBuildText`, e revelou que **quem estava errado era o `generateBuildText`** (FIX-010).

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

---

## DEC-036 — A `main` volta a ser o branch de trabalho; a `v2-planner` é aposentada

**Data:** 2026-11-16 · **Status:** aceita · **Aplicada pela** `wo0033`

### Contexto
A `v2-planner` nasceu em 2026-07-22 a partir da `main`, para abrigar o estado atual da ferramenta sem mexer na `main` nem no site publicado. Desde então a `main` ficou parada em `8a99244`. Em 2026-11-16 ela estava 49 commits atrás e sem nenhum commit próprio — ancestral direta da `v2-planner` (medido com `git merge-base --is-ancestor` e `git rev-list --count` nos dois sentidos). A versão 1.0.0, etiquetada em 2026-11-15 (`v1.0.0`, `180f586`), tirou o motivo de manter os dois.

### Decisão
- A `main` alcança a `v2-planner` por **avanço rápido** (`git merge --ff-only`): nenhum commit novo, nenhuma reescrita de histórico.
- O trabalho passa a ser na `main`. A `v2-planner` é apagada no remoto e no local; a tag `v1.0.0` e o histórico inteiro continuam no Git.
- O push da `main` pode publicar a 1.0.0, caso o Netlify esteja ligado a ela — autorizado pelo dono.

### Alternativas consideradas
- **Seguir na `v2-planner` e avançar a `main` só a cada versão** — descartada: com um autor só e sem revisão, dois branches só multiplicam a pergunta «onde está o estado?».
- **Merge com commit** — desnecessário: a `main` não tinha nada próprio.

### Consequências
- Os relatos datados que citam a `v2-planner` (STATUS-archive, logs, DECISIONS, relatórios na pasta-pai, a entrada da 1.0.0 no CHANGELOG) ficam como estão: eram verdade quando escritos.
- O link do README aponta para o GitHub Pages (branch `gh-pages`, último deploy manual em 2026-04-21), que não muda com isto. Publicar lá continua sendo um passo à parte.
