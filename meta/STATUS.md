# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.
> **Reescrito em 2026-11-15** (curadoria do chat, DEC-035): de 444 para 83 linhas. As seções do topo que já não descreviam o presente e as entradas de «Última Sessão» de 2026-07-22 a 2026-11-14 foram **movidas sem edição** para `meta/STATUS-archive.md`; «📁 Arquivos Críticos» foi para o `CONTEXT.md`, por ser conhecimento estável. Nada foi apagado.

---

## Versão Atual

**[1.0.0]** — 2026-11-15 — primeira versão estável, com tag Git `v1.0.0`. Fecha F1–F3 do ROADMAP: planejador, exportação em texto e exportação em imagem (Fase 3, com painel de exportação reconstruído e custo do Supremo em pips). Na `main` desde 2026-11-16, que voltou a ser o branch de trabalho (DEC-036).

---

## ✅ Funcionando

- 4 classes jogáveis: Samurai, Caçadora, Ronin, Assassino
- Seleção de habilidade de classe com recarga calculada (CDR aplicado)
- Vantagens I, II, III por tier (1 por tier, comportamento rádio)
- 5 slots de gear: Katana, Longo Alcance, Amuleto, GW I, GW II
- Props P1/P2 com valores numéricos editáveis (steppers ▲▼ + input)
- Perks por slot com perk obrigatório travado (🔒) quando aplicável — tabela `REQUIRED_PERKS` (DEC-014)
- Munições exibidas conforme a classe ativa: quantidade da classe primária entre parênteses, linha exclusiva omitida para as demais (DEC-017)
- Amuletos magistrais com `classBinding` — props/perks de classe injetados em runtime
- Cálculo de stats em tempo real (`computeStats` via `useMemo`)
- CDR de Armas Fantasma calculado individualmente (GW1 ≠ GW2 ≠ global do amuleto)
- Painel de estatísticas com grupos e highlight de stats modificados
- `UltimateHeader` — ícone grande da habilidade suprema no topo da col direita
- `HpResolveBar` — barra de HP (só bônus acima de 100) + círculos de DET (só ativos)
- Layout 3 colunas e 2 colunas com scroll independente por coluna
- Modo compacto e expandido para ícones de gear
- Tema escuro / claro com `T` mutável (Object.assign no render do App)
- Ícones SVG de classe (com `T.iconFilter`) e gear (com `T.iconFilter`)
- Ícones PNG de técnicas/habilidades (sem filtro — cores originais)
- `BookmarkTab` (aba lateral) → abre `SaveDrawer`
- `SaveDrawer`: salvar/carregar/excluir builds, exportar/importar JSON, código Base64 — toda build que entra passa por `deserializeBuild` (forma mínima), carregar põe o nome da build no campo, e falha de gravação no navegador avisa em vez de mostrar ✓ (DEC-038)
- Build aleatória (🎲)
- Troca de classe preservando itens compatíveis e técnicas magistrais equivalentes
- `SettingsModal`: tema, modo de layout, modo de ícone de gear, código no export, créditos
- Exportação em texto (`generateBuildText`) nos níveis Build, Detalhado e Estatístico — bilíngue conforme `lang`, inclusive nas estatísticas; recargas reais; HP e DET sempre presentes; código Base64 opcional (interruptor nas Configurações)
- Exportação em imagem (`generateBuildImage`, Canvas puro, sem dependência): PNG em bandas nos mesmos três níveis, com barra de HP, pips de Determinação, contador de Magistrais e o comando do Supremo (`L1+R1`) no cabeçalho (DEC-026 a DEC-029)
- `ExportPanel`: controle segmentado de três níveis, escolhido uma vez, e dois botões Gerar (texto e imagem), com uma linha de descrição que reage ao nível e ao cursor (DEC-029)
- Painel de estatísticas e exportações com o mesmo formatador (DEC-033)

---

## 🔧 Em Progresso

- **Produto:** entrada e saída de builds (DEC-038). Fatia 0 (`wo0036`) e WO A da Fatia 1 (`wo0038`) aplicadas e conferidas na tela pelo dono; spec da Fatia 1 em `meta/specs/261117-entrada-de-builds-fatia1.md`. A WO B vem depois do template-update do kit.
- **Kit:** template-update v1.155.0 **fechado** (DEC-039) — Fatia 1 na `wo0039`, Fatia 2 na `wo0040`; os seis carimbos dizem v1.155.0. Falta só o dono colar as Instruções no painel (backlog).

---

## ❌ Quebrado / Com Problema

_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)

---

## ⏳ Pendente de Aplicação

_Nada._

---

## 📋 Backlog (curto prazo — acionáveis no próximo turno)

- [ ] **`DECISIONS.md` com 1.173 linhas** (limiar ~700): mover as entradas antigas para `DECISIONS-archive.md`. Curadoria do chat.
- [ ] **Cópias soltas de `GUIA_COMPLETO*.md`** em `notas-arquivadas\` (pasta-pai): as duas têm o mesmo md5 (`7fa3bda4…`) que `meta/legacy/GUIA_COMPLETO_v4.md` no Git, antes de `c232da3` — que a tirou da árvore. O conteúdo está salvo no histórico; apagar ou manter é decisão do dono.
- [ ] **O botão Texto mostra ✓ mesmo quando a cópia falha** (`handleCopyText`, `App.jsx`: o `.catch` também chama `flash('txt')`). Quando falha, o que se cola é o texto anterior, sem aviso. Achado em 2026-11-16.
- [ ] **Passada de defeitos e segurança por funcionalidade** (pedido do dono, 2026-11-16): uma `/sondar` por área, no Code. Ponto de partida medido em 2026-11-16: nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` em `src/`; as três entradas de dado externo passam por `JSON.parse` — os saves no `localStorage` (`App.jsx`), o arquivo importado (`App.jsx`) e o código Base64 (`logic.js`).

- [ ] **Fatia 1 da DEC-038** (proxima WO): componente de lista com selecao para importar (botao e arrastar `.json`) e exportar so as escolhidas; Desfazer na build aberta; modal «Salvar como…» so com alteracao nao salva. Mensagens de erro de `deserializeBuild` viram codigo + texto bilingue.
- [ ] **Fatia 2 da DEC-038:** link com a build comprimida no fragmento `#b=`, codigo antigo aceito na leitura, aviso de id desconhecido em `data.js`.
- [ ] **Colar as Instruções no painel do Projeto — agora:** o `INSTRUCOES-DO-PROJETO.md` fundido em 2026-11-24 (`wo0040`, 6.840 caracteres de texto). O painel está anterior ao `9326145` e não tem a linha `Git só leitura (GIT_OPTIONAL_LOCKS=0)` (DEC-039). Do dono.
- [ ] **README desatualizado:** manda abrir `localhost:5173/got-legends/` (o caminho-base local hoje é `/`), e a árvore de «Estrutura do Projeto» fala em `App.jsx` de ~1.2k linhas e não cita o `icons.js`. Achado em 2026-11-23.

---

## 💬 Última Sessão

### 2026-11-15 — Kit v1.142.0, Fatia 3 (wo0030): CEREBRO e Instruções fundidos pela base do pacote

Fecha o «Pendente: Fatia 3» da entrada acima (o carimbo v1.73.0 do CEREBRO não vale mais: agora é v1.142.0). `meta/CEREBRO.md` e `INSTRUCOES-DO-PROJETO.md` foram gravados pelo chat a partir do pacote, com o transplante do que é deste projeto (DEC-035); a wo0030 conferiu os hashes e registrou DECISIONS, CHANGELOG e IDEAS. Commit `9326145`, empurrado. `GIT_OPTIONAL_LOCKS=0` voltou às regras. Instruções em 6.778 caracteres (teto 6.900).

**Pendente:** demais arquivos do pacote v1.142.0 (skills, `_TEMPLATE.md` de WO, `CLAUDE.md`, `settings.json`, exclusões, `template` de meta/) — próxima fatia; a pasta `../261115-kcm-update-v1.142.0/` fica onde está. Texto da DEC-034 a corrigir (o kit inverteu o «Commit pronto ao final» no modo Code, não o revogou). Reescrita de fundo do STATUS (curadoria do chat).

### 2026-11-15 — Kit v1.142.0, Fatia 4 (wo0031): fecha o update

Os cinco carimbos dizem v1.142.0; skills, `_TEMPLATE.md`, `CLAUDE.md`, `.flatdropignore`, `LOG-TEMPLATE`, CONTEXT e o STATUS reescrito (83 linhas; histórico em `meta/STATUS-archive.md`) foram gravados pelo chat e versionados pela wo0031, que também registrou a correção da DEC-034, «🛌 Adiadas» no IDEAS e a entrada do CHANGELOG. Commit `26b8080`, empurrado. O template-update v1.142.0 está fechado.

**Pendente:** nada. O pacote `261115-kcm-update-v1.142.0` já está em `notas-arquivadas\` (conferido por `ls`). Sem pendência de código.

### 2026-11-15 — Versão 1.0.0 (wo0032): etiqueta

CHANGELOG: `[Não lançado]` esvaziado e `[1.0.0] — 2026-11-15` aberto sem reorganizar as subseções; a lista de junho «Pendente de aplicação» saiu (`Removido do registro`). Commit `180f586` na `v2-planner`, tag anotada `v1.0.0` nele, ambos empurrados. Build verde.

**Pendente:** a `main` e o site publicado não têm a 1.0.0 (ver backlog). Arrumar os títulos repetidos dentro da 1.0.0 do CHANGELOG é curadoria do chat.

### 2026-11-16 — `main` alcança a `v2-planner` (wo0033, DEC-036)

A `main` avançou por fast-forward até `1690156` (49 commits, nenhum próprio dela) e foi empurrada; a `v2-planner` foi apagada local e remotamente (`branch -d`, sem `-D`). A tag `v1.0.0` e o `gh-pages` seguem. O trabalho agora é na `main`. DEC-036 registrada; item de backlog «`main` × `v2-planner`» fechado.

**Fecha o «Pendente» da entrada da wo0032:** a `main` já tem a 1.0.0. **Pendente:** o site (GitHub Pages, `gh-pages`) segue no deploy de 2026-04-21 — publicar é passo à parte e só sob pedido; conferir no painel do Netlify se o push da `main` publicou. Títulos repetidos na 1.0.0 do CHANGELOG continuam sendo curadoria do chat.

### 2026-11-16 — GitHub Pages por workflow (wo0034, DEC-037)

`.github/workflows/deploy-gh-pages.yml` monta a `main` em Linux a cada push, com `VITE_BASE_URL=/got-legends/`, e empurra o `dist/` para a `gh-pages`; `src/icons.js` prefixa os quatro caminhos-base com `import.meta.env.BASE_URL`. Commit `e99edf8`, empurrado. A primeira execução do workflow terminou `completed success` (19s, medido com `gh run list`).

**Fecha o «Pendente» da entrada da wo0033** (site do GitHub Pages parado desde 2026-04-21): o deploy foi feito, falta só a conferência visual. **Pendente:** o dono abrir o site do GitHub Pages e ver se os ícones carregam; depois, `npm run dev` para confirmar que a raiz segue igual.

### 2026-11-16 — Chat: confirmações do dono e transferência de conversa (wo0035)

Fatos que só existiam no chat, registrados com a origem:
- **GitHub Pages:** workflow verde e ícones carregando em `arlsnech.github.io/got-legends/` — `[relatado pelo dono]`; o verde também `[medido por instrumento]` pelo Code (`gh run list`: success, 19s, run 43879422833). **Fecha o «Pendente» da entrada acima.**
- **Netlify publicou a 1.0.0** depois do push da `main` — `[relatado pelo dono]`. Vercel (`got-legends.vercel.app`) e Cloudflare Pages (`got-legends.pages.dev`) mostravam a interface nova às 10:24 — `[medido em captura de tela do dono]`.
- **Texto do Estatístico funciona:** numa aba só, 🎲 → Imagem → Texto → Salvar saiu completo — `[relatado pelo dono]`, com o texto colado como evidência. O primeiro relato de «texto vazio» veio de abas diferentes: o JSON salvo junto estava vazio também, e Texto, Imagem e Salvar leem a mesma `build` (`App.jsx`).
- **Próxima frente escolhida:** a análise de entrada e saída de builds (backlog). Nenhum código mudou neste turno.

**Pendente:** abrir a análise na conversa nova (ver `../AAMMDD-HANDOFF-BRIEF.md` mais recente na pasta-pai).

### 2026-11-17 — Fatia 0 da entrada de builds (wo0036, DEC-038)

`deserializeBuild` agora exige a forma minima (cinco slots com `p1`/`p2`, e `techs`) e a importacao de `.json` passa por ele; carregar salvo ou codigo poe o nome no campo (antes o Salvar seguinte sobrescrevia outra build); `persist` grava em `try` e avisa se o navegador nao gravar; `exportAll` libera o `objectURL`. Commit `e452ce1`, empurrado. Build verde; prova de vida no Node: `vazia true sem_gear false aleatorias_recusadas 0`. A analise e o molde de `meta/analises/` entraram no mesmo commit.

**Pendente:** o dono conferir na tela — carregar uma salva e ver o nome no campo; importar um `.json` com uma build quebrada (o aviso diz quantas ficaram de fora) e outro sem nenhuma valida (salvos intactos). Saves muito antigos nao foram conferidos contra a nova forma minima. As secoes «Em Progresso» e «Funcionando» do STATUS nao foram reescritas (curadoria do chat).

### 2026-11-17 — Chat: a Fatia 0 conferida na tela (wo0037)

- **Roteiro de tela da `wo0036`, itens 1–7: todos certos** — `[relatado pelo dono]`. O nome acompanha a build carregada (salvo e código), o Salvar seguinte não sobrescreve outra build, a importação do arquivo de teste mostrou «✓ 1 importadas, 1 ignoradas» (e o equivalente em EN) sem chip duplicado, e o Exportar segue baixando. **Fecha o «Pendente» da entrada acima**, menos três casos que o roteiro declarou não testar: armazenamento cheio, `.json` sem nenhuma build válida e id de item inexistente na tela.
- «Em Progresso» e «Funcionando» atualizados (curadoria do chat).
- **Correção de registro:** o relatório da `wo0036` disse que `src/` e `meta/` estão em LF; estão em CRLF (`git ls-files --eol`, medido pelo chat). Ver IDEAS, «🔧 Correções de processo».

**Pendente:** a spec da Fatia 1 (próxima conversa ou próximo turno).

### 2026-11-17 — Fatia 1, WO A: a lista de salvos sobe para o App (wo0038, DEC-038)

`useSavedBuilds` (em `src/App.jsx`) passa a ser dono de `saves` e da gravação no `localStorage`; o `SaveDrawer` recebe `saves` e `writeSaves` por prop e só mostra o aviso quando a gravação falha. `deserializeBuild` e `decodeBuild` devolvem `code` estável (`not_got_legends`, `bad_structure`, `unknown_class`, `bad_code`) para a WO B traduzir. A spec `meta/specs/261117-entrada-de-builds-fatia1.md` entrou versionada. Commit `779e3f9`, empurrado. Build verde; prova de vida no Node: `not_got_legends bad_structure unknown_class bad_code true`. Sem mudança visível.

**Pendente:** conferência de tela pelo dono (roteiro do chat): abrir a gaveta, salvar, remover, exportar e importar seguem iguais, e a contagem de salvos persiste após recarregar. Depois, a WO B (modal e arrasto).

### 2026-11-23 — Kit v1.155.0, Fatia 1 (wo0039, DEC-039)

Skills (`apply-wo`, `wrap`, `sondar`), molde de WO, `settings.json` e `meta/GUIA-DO-KIT.md` — gravados pelo chat antes da WO — foram versionados; `sha1sum` dos seis conferido contra a WO. CHANGELOG, DECISIONS (DEC-039), IDEAS e STATUS («Em Progresso», backlog) atualizados. Cinco dos seis carimbos dizem v1.155.0 (o do CEREBRO sobe na Fatia 2). Commit `05b4a2a`, empurrado. Sem código, sem build.

**Pendente:** Fatia 2 do kit (CEREBRO, Instruções, CONTEXT «Build e validação», `meta/SETUP.md`); depois, a WO B da Fatia 1 do produto.

### 2026-11-24 — Kit v1.155.0, Fatia 2 (wo0040, DEC-039): o update fecha

`meta/CEREBRO.md` e `INSTRUCOES-DO-PROJETO.md` foram fundidos pelo chat a partir do pacote, com o transplante aprovado pelo dono; «Build e validação» passou ao `meta/CONTEXT.md` e `meta/SETUP.md` entrou. A wo0040 conferiu os quatro `sha1sum` e registrou CHANGELOG, DECISIONS (DEC-039 «Aplicada pelas wo0039 e wo0040»), STATUS, IDEAS e uma linha da `/wrap` (medir o teto das Instruções com `tr -d '\r'`). Os seis carimbos dizem v1.155.0. Instruções em 6.840 caracteres (teto 6.900). Commit `6aafc82`, empurrado. Sem código, sem build.

**Fecha o «Pendente» da entrada da wo0039** (Fatia 2 do kit). **Pendente:** o dono colar as Instruções no painel (backlog); depois, a WO B da Fatia 1 do produto. O chat move a pasta do pacote depois de conferir o commit.
