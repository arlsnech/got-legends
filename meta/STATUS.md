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
- `SaveDrawer`: salvar/carregar/excluir builds, exportar/importar JSON, código Base64
- Build aleatória (🎲)
- Troca de classe preservando itens compatíveis e técnicas magistrais equivalentes
- `SettingsModal`: tema, modo de layout, modo de ícone de gear, código no export, créditos
- Exportação em texto (`generateBuildText`) nos níveis Build, Detalhado e Estatístico — bilíngue conforme `lang`, inclusive nas estatísticas; recargas reais; HP e DET sempre presentes; código Base64 opcional (interruptor nas Configurações)
- Exportação em imagem (`generateBuildImage`, Canvas puro, sem dependência): PNG em bandas nos mesmos três níveis, com barra de HP, pips de Determinação, contador de Magistrais e o comando do Supremo (`L1+R1`) no cabeçalho (DEC-026 a DEC-029)
- `ExportPanel`: controle segmentado de três níveis, escolhido uma vez, e dois botões Gerar (texto e imagem), com uma linha de descrição que reage ao nível e ao cursor (DEC-029)
- Painel de estatísticas e exportações com o mesmo formatador (DEC-033)

---

## 🔧 Em Progresso

- **Produto:** nada em curso. A última mudança foi a `wo0027`, em 2026-08-24.

---

## ❌ Quebrado / Com Problema

_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)

---

## ⏳ Pendente de Aplicação

_Nada._

---

## 📋 Backlog (curto prazo — acionáveis no próximo turno)

- [ ] **Escolher a próxima frente do produto:** abrir a F4 (Polimento e Mobile) ou a análise dos quatro caminhos de compartilhamento por link (Base64 × URL × link curto × QR), parada desde 2026-07-27. A segunda é candidata à primeira análise em `meta/analises/`.
- [ ] **`DECISIONS.md` com 1.173 linhas** (limiar ~700): mover as entradas antigas para `DECISIONS-archive.md`. Curadoria do chat.
- [ ] **Cópias soltas de `GUIA_COMPLETO*.md`** em `notas-arquivadas\` (pasta-pai): as duas têm o mesmo md5 (`7fa3bda4…`) que `meta/legacy/GUIA_COMPLETO_v4.md` no Git, antes de `c232da3` — que a tirou da árvore. O conteúdo está salvo no histórico; apagar ou manter é decisão do dono.
- [ ] **O botão Texto mostra ✓ mesmo quando a cópia falha** (`handleCopyText`, `App.jsx`: o `.catch` também chama `flash('txt')`). Quando falha, o que se cola é o texto anterior, sem aviso. Achado em 2026-11-16.
- [ ] **Passada de defeitos e segurança por funcionalidade** (pedido do dono, 2026-11-16): uma `/sondar` por área, no Code. Ponto de partida medido em 2026-11-16: nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` em `src/`; as três entradas de dado externo passam por `JSON.parse` — os saves no `localStorage` (`App.jsx`), o arquivo importado (`App.jsx`) e o código Base64 (`logic.js`).

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
