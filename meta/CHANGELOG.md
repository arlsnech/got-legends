# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

---

## [Não lançado]

### Infraestrutura de repositório
- **A `main` voltou a ser o branch de trabalho** (DEC-036): alcançou a `v2-planner` por avanço rápido, e a `v2-planner` foi aposentada.
- **O GitHub Pages volta a ser publicado, agora por workflow** (DEC-037): `.github/workflows/deploy-gh-pages.yml` monta a `main` em Linux a cada push e empurra o `dist/` para a `gh-pages`. Estava parado desde 2026-04-21.
- **Kit de contexto v1.155.0, Fatia 1** (DEC-039) — a skill `/apply-wo` grava relatório também quando recusa, abre o relatório dizendo o que entrou (`NADA FOI APLICADO` ou `APLICADO ATÉ…`) e delimita âncora e texto novo pela cerca de quatro crases; `/wrap` e `/sondar` com o carimbo novo; o molde de WO passa às cercas de quatro crases; o `.claude/settings.json` ganha oito permissões de leitura e conferência (`git show`, `git ls-files`, `git cat-file`, `date`, `sha1sum`, `wc`, `grep`, `head`); `meta/GUIA-DO-KIT.md` entra inteiro. As linhas deste projeto nas skills ficaram. Sem efeito no produto.
- **Kit de contexto v1.155.0, Fatia 2 — fechamento** (DEC-039) — `meta/CEREBRO.md` e `INSTRUCOES-DO-PROJETO.md` refeitos **partindo do pacote**, com o transplante do que é deste projeto (inventário aprovado pelo dono em 2026-11-24): «Técnicas específicas» recebe o bloco da DEC-008 e duas regras que só existiam no painel antigo («Procure antes de inserir»; «entrada nova usa o vocabulário novo»); a seção «Ambiente (sistema operacional)» volta, com o Git Bash no Code. As quatro seções que o kit passou ao `GUIA-DO-KIT.md` saem do CEREBRO. «Build e validação» passa do CEREBRO ao `meta/CONTEXT.md`; `meta/SETUP.md` novo, com o ambiente e o que já deu errado. Os seis carimbos dizem v1.155.0. Sem efeito no produto.

### Corrigido
- Os ícones usavam caminho absoluto (`/icons/...`) e sumiriam em qualquer site servido fora da raiz, como o GitHub Pages (`/got-legends/`). Agora seguem o caminho-base do build (DEC-037).
- **Carregar uma build salva, ou colar um código, agora põe o nome dela no campo de nome.** Antes o campo guardava o nome da build anterior, e o Salvar seguinte gravava a build carregada por cima daquela, sem aviso (DEC-038).
- **Build sem equipamentos ou sem técnicas é recusada ao abrir**, com o aviso de erro, em vez de derrubar a tela (DEC-038).
- **Importar `.json` valida cada build antes de gravar:** as inválidas ficam de fora e o aviso diz quantas; arquivo sem nenhuma válida não muda os salvos (DEC-038).
- **Se o navegador não deixar gravar** (armazenamento cheio ou bloqueado), Salvar, Importar e Apagar tudo mostram o erro em vez de ✓, e a lista na tela continua igual à gravada (DEC-038).

---

## [1.0.0] — 2026-11-15

> Primeira versão estável. Fecha as fases F1–F3 do ROADMAP: planejador, exportação em texto e exportação em imagem. Tag Git `v1.0.0` no commit desta versão, na `v2-planner`; a `main` e o site publicado ainda não a têm.

### Infraestrutura de repositório
- **Template-update do KCM v1.87.0 comparado e fundido** — sem efeito no produto. `meta/specs/` passou a `meta/workorders/`, a skill `/apply-spec` passou a `/apply-wo`, e o nome `meta/specs/` ficou reservado para specs de feature (DEC-030). Os vinte arquivos existentes e as menções históricas a `spec0001`–`spec0020` foram preservados.
- **`meta/SPEC.md`** — molde novo da spec de feature: problema, critérios de aceite verificáveis, decisões de desenho, fora de escopo.
- **Template-update do KCM v1.138.0, Fatia 1** — `.claude/settings.json` ganhou `Write` e `additionalDirectories` (sem eles o Code não gravava os relatórios na pasta-pai nem criava o log do dia); `apply-wo` e `wrap` fundidas com as do kit; skill `/sondar` instalada; `meta/workorders/_TEMPLATE.md` criado.
- **Template-update do KCM v1.138.0, Fatia 2** (DEC-034) — duas linhas revogadas pelo kit saíram do CEREBRO: a entrega «arquivo completo para baixar, nunca blocos para costurar» e o «commit pronto ao final» em três linhas para colar. Ambas descreviam um projeto sem executor e sem pasta vinculada. Cadência de `sessão` trocada por `turno`/`conversa` em 34 pontos de 8 arquivos; 186 ocorrências preservadas por serem relato histórico, texto do kit corrente ou ponteiro de skill.
- **Template-update do KCM v1.142.0, Fatia 3** (DEC-035) — CEREBRO e Instruções refeitos partindo do pacote, com o transplante do que é deste projeto; volta a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)`, perdida na fusão v1.138. Sem efeito no produto.
- **Template-update do KCM v1.142.0, Fatia 4 — fechamento** — carimbos v1.142.0 nas três skills e no molde de WO; `/apply-wo` grava o relatório também quando PARA; `/wrap` acrescenta ao log do dia que já existe e termina com o Próximo comando; `CLAUDE.md` ganhou «Quando eu pedir medição», «Push e relatório» e «Relatório em arquivo»; `.flatdropignore` deixou de citar os marcadores do editor num comentário; `IDEAS` ganhou «🛌 Adiadas»; `LOG-TEMPLATE` registra por gatilho de evento. `STATUS.md` reescrito só com o presente (o histórico foi para `meta/STATUS-archive.md`, sem edição; «Arquivos Críticos» foi para o CONTEXT). Corrigida a premissa da DEC-034. Sem efeito no produto.
- **«Análise antes do compromisso»** — mudança não-trivial passa a começar por uma análise escrita em `meta/analises/` (a pasta nasce no primeiro uso), com recomendação única e ponto de decisão. Funil: análise → WO → DECISIONS.
- **«Bloco de fecho de turno»** — formato fixo de encerramento na raia de planejamento: Próximo · Estado · Arquivar/Manter · Config por raia · Handoff. Quem executa no Code fecha com relatório de trabalho, não com este formulário.
- **DEC-008 ganhou a lista de «colisões já julgadas — não reabrir»** — as seis linhas em que o template genérico colide com este projeto todo update e que já foram decididas passam a ser reportadas como «sem ação», em vez de reapresentadas como decisão.
- `CLAUDE.md`, `.flatdropignore` e `meta/LOG-TEMPLATE.md` atualizados para o vocabulário novo.
- **Template-update do KCM v1.90.0 comparado e fundido** (DEC-031) — sem efeito no produto. O CEREBRO ganhou: o template genérico deixa de ser candidato a substituir arquivo vivo refinado; a exigência de declarar versão/commit antes de comparar; o gatilho concreto de análise para mudança de formato de artefato; os quatro modos de falha da releitura de mount; e a regra de que a linha «Estado» só carrega dado lido no próprio turno.
- **`.flatdropignore` reorganizado** — regra dentro do bloco `flatdrop-editor`, explicação acima dele, nada depois do `# <<<`, e forma `pasta/*` em toda linha de pasta. Corrige a duplicação silenciosa de `INSTRUCOES-DO-PROJETO.md`, que estava escrito dentro e fora do bloco.
- **`.claude/settings.local.json` saiu do versionamento e do mount** — config de máquina (caminhos absolutos, permissões acumuladas pelo Code), não conhecimento do projeto. O `.claude/settings.json` compartilhado segue versionado.

### Modificado
- **`getAvailableProps` e `getAvailablePerks` passam a receber o item resolvido** em vez do `id` (DEC-032). Elimina a armadilha 14 pela assinatura — o erro deixa de ser possível de escrever — e substitui os dois filtros inline do `App.jsx` por chamadas às funções. Sem mudança visível de comportamento.
- **Painel de estatísticas e exportações passam a usar o mesmo formatador** (DEC-033). O `StatsPanel` deixa de ter `fmtStat` e `changed` próprios e chama `formatStatValue` e `isStatChanged`, como o resto do `App.jsx` já fazia; os helpers locais `pct` e `pts` saem por ficarem órfãos. Fecha uma divergência de arredondamento que ainda não aparecia na tela: `pct` truncava a porcentagem para inteiro e `formatStatValue` mantém duas casas.
- **Os três toggles inline de técnica e habilidade viram chamadas a `selectTech`/`selectAbility`** (DEC-033). Sem mudança de comportamento.

### Adicionado
- **Fase 3 — exportação em imagem.** Os três botões 🖼️ (Build, Detalhado, Estatístico) geram um PNG da build e disparam o download. Canvas puro, sem dependência externa; altura calculada a partir do conteúdo e renderização em 2x. Layout em duas colunas — habilidade e vantagens à esquerda, equipamentos à direita — com faixa de estatísticas no modo Estatístico, ícones do jogo em cada linha e as cores da classe ativa.

### Modificado
- **O painel de exportação separou nível de detalhe de formato.** Eram seis botões em dois triplos, e Build/Detalhado/Estatístico significam a mesma coisa nos dois — agora o nível é escolhido uma vez num controle segmentado, com uma linha de descrição que muda ao selecionar e ao passar o cursor, e o formato virou dois botões: 🖼️ Imagem e 📋 Texto (DEC-029)
- O custo do Supremo passou a ser mostrado como pips (`●●●`) em vez de número mais símbolo, na mesma linguagem dos círculos de Determinação da topbar
- Os quatro Supremos ganharam o comando de ativação (`L1+R1`), que aparece como teclas desenhadas no cabeçalho da imagem
- No cabeçalho da imagem, o contador de Magistrais ganhou o rótulo **MAGISTRAIS** e um afastamento medido do número de HP, que antes era fixo e não sabia se o número tinha dois ou três dígitos
- **O cabeçalho da imagem passou a mostrar barra de HP e círculos de Determinação de verdade**, como a topbar da ferramenta — em cor uniforme, sem a distinção base/bônus que só faz sentido enquanto se monta. O Supremo saiu da borda para perto do centro e ganhou custo, golpes ou alvos com o bônus, multiplicadores e a **descrição da habilidade**, que existia no dado e nunca tinha sido exibida (DEC-028)
- **Letras e ícones maiores na imagem gerada**, e resolução de renderização aumentada (DEC-028)
- **A imagem da build foi redesenhada em bandas.** O layout de duas colunas deixava metade da imagem vazia — as duas nunca podiam ter a mesma altura. Agora são faixas de largura total com cartões em grade: habilidade e vantagens em quatro colunas, equipamentos em duas, estatísticas ao pé. Magistral ganha borda dourada, e o cabeçalho passou a mostrar HP, Determinação e o contador de Magistrais nos três modos (DEC-027)
- No modo 2 Colunas, os nomes das vantagens de classe não quebram mais em duas linhas: a célula da grade passou de 190 px e o nome ganhou `nowrap`. O comentário anterior afirmava que 140 px já evitavam a quebra — não evitavam.

### Removido
- Código morto do vínculo de classe (`onLinkedClass` no `App.jsx`, `setCharmLinkedClass` no `logic.js`) e nove imports órfãos — resíduo da remoção do seletor de classe vinculada (DEC-015). Sem efeito visível no produto.
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

### Infraestrutura de repositório
- Pasta local ligada ao remoto `arlsnech/got-legends` (SSH, alias `github-gametools`); histórico preservado, nada reescrito
- Branch `v2-planner` criada a partir da `main` para abrigar o estado atual da ferramenta — a `main` e o site publicado seguem intactos
- `src/v1..v4` e `GUIA_COMPLETO_v4.md` preservados em commit próprio antes da limpeza futura

### Corrigido
- No texto exportado, a recarga das Armas Fantasma não aparecia e o Supremo saía sem a contagem de golpes nem o bônus de dano (FIX-010)
- **A Determinação usava o mesmo símbolo dos itens Magistrais.** O custo do Supremo saía como `3★` e a estatística *Determinação Máxima* como `★★★★`, a poucos centímetros do contador de Magistrais `★☆☆`. A Determinação passou a usar `●`, que é o que a topbar já desenhava; a estrela ficou exclusiva de Magistral (FIX-014)
- No Ronin, a variante ativa do Sopro sumia do texto exportado quando `activeBreath` não batia com nenhuma das opções, em vez de cair na variante base
- Barra de rolagem fantasma no modal de configurações: um retângulo cinza surgia ao passar o cursor sobre as opções e deslocava o conteúdo (FIX-011)
- Na imagem gerada, os ícones de equipamento saíam na cor original em vez da cor do tema — os de gear sumiam no tema escuro e os de Arma Fantasma no tema claro (FIX-012)
- Na imagem gerada, os rótulos de tier e de slot saíam por baixo do ícone e do nome da linha seguinte (FIX-013)
- Picada Celestial não obrigava o Ronin a gastar o perk de desbloqueio, ao contrário da Zarabatana (FIX-009)
- Props de item Magistral saíam abaixo do máximo na build aleatória (FIX-006). Builds salvos ou compartilhados com o valor errado são saneados ao carregar
- Estatísticas do texto exportado saíam como `undefined` (FIX-005 — diagnosticado em junho, aplicado só agora). Junto com isso: os rótulos das estatísticas passam a respeitar o idioma EN, e o grupo de estatísticas específico da classe volta a aparecer no texto
- Roda do mouse sobre o campo de valor focado alterava a propriedade em silêncio

### Modificado (interface)
- Vantagens de classe: caixas com largura uniforme no modo 3 colunas e lado a lado no modo 2 colunas, agora de forma independente entre os modos — corrige um defeito em que ajustar um dos layouts quebrava o outro
- Contador de Magistrais: nome por extenso ("Magistrais" / "Legendary Slots"), afastado da barra de HP, estrelas maiores com vazias em tom apagado
- `Tooltip` passa a aceitar `wrapperStyle`, permitindo que quem o usa controle a largura do wrapper (usos existentes ficam idênticos)
- Campo de valor das propriedades migrado de `type="number"` para `type="text"` + `inputmode="decimal"`, conforme a orientação do GOV.UK Design System; as setas do teclado (↑ ↓) passam a ser tratadas pelo próprio componente
- Campo de valor das propriedades: as setinhas nativas do `type="number"` foram escondidas — eram redundantes com os botões de passo e reservavam uma faixa que descentrava o número
- Botões de passo passam de ▼ ▲ para **−** e **+**, seguindo a recomendação da Nielsen Norman Group para steppers horizontais (▲▼ são a convenção de steppers verticais; ◀▶ sugeririam navegar entre itens, não alterar um valor)

### Removido do registro
- A lista «Pendente de aplicação (código precisa ser reescrito — guia original perdido)», que vinha de junho, saiu ao fechar esta versão. Os quatro itens dela entraram de fato e estão acima: `wrapperStyle` no `Tooltip`, `TechRow` por modo e contador de Magistrais por extenso (spec0006, em «Modificado (interface)»), e as estatísticas do texto exportado (FIX-005, em «Corrigido»).

---

## [1.0.0-beta] — 2026-06-24

### Adicionado
- **Fase 2 — Exportação de texto** (`generateBuildText`): modos `build`, `detailed` e `stats`
  - Texto bilíngue (PT-BR/EN) conforme idioma ativo
  - Cooldown da habilidade já calculado (CDR aplicado)
  - Recarga de GWs no nome do slot
  - Descrições magistrais em itálico no modo Detalhado/Estatístico
  - HP e DET sempre presentes nas estatísticas
  - Código Base64 opcional ao final (toggle nas configurações)
- `ExportPanel` com dois grupos visuais rotulados: `📋 Texto` e `🖼️ Print` (3 modos cada), em linha única
- `UltimateHeader` — ícone grande da habilidade suprema no topo da coluna de estatísticas, tamanho configurável via constante `ULTIMATE_ICON_SIZE`
- `HpResolveBar` com layout vertical (DET acima, HP abaixo): barra aparece apenas quando HP > 100 (base), constantes independentes `HP_BAR_WIDTH`, `HP_BAR_HEIGHT`, `DET_CIRCLE_SIZE`
- Ícones SVG de classe nos botões do header com `T.iconFilter` (adapta ao tema)
- Ícones PNG de técnicas/habilidades em `TechniquesPanel` (sem filtro — cores originais)
- Ícones SVG de gear nos cards de equipamento (modo compacto e expandido)
- Logo PNG na `BookmarkTab`
- Modo de ícone de gear: compacto (ícone pequeno ao lado do nome) e expandido (ícone grande no card)
- `TrashIcon` SVG inline (substitui emoji 🗑️ que parecia botão de fechar)
- Tema claro com paleta revisada para contraste adequado + `T.iconFilter`/`T.iconFilterDim`
- `generateBuildImage` — esqueleto da Fase 3 documentado, pronto para implementar

### Modificado
- `SavePanel` removido; substituído por `SaveDrawer` (overlay lateral) + `BookmarkTab` (aba de livro fixa)
- Classe movida para o header fixo (sempre visível em todos os layouts)
- Layout 3 colunas (padrão): técnicas esquerda | gear centro | stats direita — scroll independente
- Layout 2 colunas: técnicas + gear esquerda | stats direita
- Habilidades de classe no modo 2-col: grid lado a lado com `whiteSpace: nowrap`
- Sub-header reorganizado: HP/DET | separador | Magistrais | separador | Export (à direita)
- `PerkRow`: `<select>` sem `<Tooltip>` como wrapper — largura sempre 100%
- Seletor de item: ⭐ movido para o final do nome (não mais no início)
- `TechRow`: removidos ✨ e ⭐ do display de texto (ícones PNG substituem)
- `SettingsModal`: adicionadas seções Tema, Estilo de Ícone de Gear, crédito a `swiezdo`
- Colunas da grid: técnicas 300px (era 255px) para evitar quebra de nomes longos

### Corrigido
- FIX-001: componentes duplicados (`BookmarkTab` etc.) causando erro de compilação Vite
- FIX-002: `<select>` de vantagem encolhia ao selecionar (Tooltip inline-block)
- FIX-004: 4º círculo de Determinação sempre visível mesmo sem bônus
- Cor de texto `T.muted` no tema escuro: era `#5a5c76` (baixo contraste) → `#6a6c88`

---

## [0.1.0] — 2026-06-23

### Adicionado
- Planejador base completo: 4 classes, habilidades, vantagens I/II/III, 5 slots de gear
- Motor de cálculo de stats em tempo real (`computeStats` em `logic.js`)
- Propriedades P1/P2 editáveis com steppers e validação de range
- Perks com perk obrigatório travado (🔒) para itens com restrição de classe
- Munições exibidas conforme a classe ativa: a classe primária da arma vê a quantidade entre parênteses; munição exclusiva dela some para as demais *(registrado retroativamente em 2026-07-23 — DEC-017; a data desta linha é a da versão, não a do registro)*
- CDR de GW calculado individualmente por arma
- Slots magistrais com limite dinâmico (base 1 + bônus de técnica Magistral)
- Troca de classe preservando itens compatíveis e técnicas magistrais equivalentes
- Build aleatória (🎲)
- `StatsPanel` com grupos filtrados por classe e highlight de stats modificados
- Sistema de saves via `localStorage`: salvar, carregar, excluir, exportar JSON, importar JSON
- Código de compartilhamento Base64 (`encodeBuild`/`decodeBuild`)
- Suporte bilíngue PT-BR/EN em toda a interface
- Toggle de idioma (🇧🇷 PT / 🇺🇸 EN) em tempo real
- Tema escuro (padrão)
- Layout responsivo (2 colunas acima de 360px)
- `UltimateCard` com variantes do Sopro de Izanami (Ronin) selecionáveis
- Amuletos magistrais com `classBinding` e props/perks de classe em runtime
- Formatação de munição por classe (quantidade primária vs secundária)
- `icons.js` com mapeamento completo de ícones SVG/PNG
