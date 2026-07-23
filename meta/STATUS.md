# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log da sessão.

---

## Versão Atual

**[1.0.0-beta]** — 2026-06-24 — Planejador funcional completo com exportação de texto (Fase 2). Geração de imagem em guia, pendente de aplicação.

---

## ✅ Funcionando

- 4 classes jogáveis: Samurai, Caçadora, Ronin, Assassino
- Seleção de habilidade de classe com recarga calculada (CDR aplicado)
- Vantagens I, II, III por tier (1 por tier, comportamento rádio)
- 5 slots de gear: Katana, Longo Alcance, Amuleto, GW I, GW II
- Props P1/P2 com valores numéricos editáveis (steppers ▲▼ + input)
- Perks por slot com perk obrigatório travado (🔒) quando aplicável
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
- **Fase 2** — `generateBuildText` funcional para modos `build`, `detailed`, `stats`
  - Texto bilíngue conforme `lang` ativo — **inclusive nas estatísticas** (corrigido em 2026-07-22)
  - Cooldowns calculados (recarga real, não base)
  - HP e DET sempre presentes nas estatísticas
  - Demais stats com valor formatado, filtradas pelo que o build alterou, e com o grupo específico da classe presente (FIX-005)
  - Código Base64 opcional (toggle nas configurações)
- `ExportPanel` com 2 grupos visuais: `📋 Texto` e `🖼️ Print` × 3 modos

---

## 🔧 Em Progresso

- **Fase 3 — `generateBuildImage`**: código completo entregue no guia `GUIA_CORRECOES_FASE3.md`, ainda não aplicado ao `App.jsx`. Próximo passo: inserir antes de `ExportPanel` e conectar ao `handleGenImage`.

---

## ❌ Quebrado / Com Problema

_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)

---

## ⏳ Pendente de Aplicação (guias prontos, não aplicados ainda)

> ✅ **O `GUIA_CORRECOES_FASE3.md` foi encontrado** (2026-07-22, fora do repositório — o aviso anterior, de que teria se perdido, estava errado). São 35 KB contendo o ANTES/DEPOIS das três correções restantes **e** o código completo da Fase 3 (`generateBuildImage` via Canvas, ~470 linhas), além do trecho da FIX-005 que a spec0004 já aplicou por outro caminho.
>
> **Não aplique o guia à mão.** Ele continua sendo o formato que deixou este trabalho parado desde junho (DEC-007). O caminho é ler o guia como fonte e converter cada correção em spec, conferindo cada bloco ANTES contra o `App.jsx` de hoje — o arquivo mudou desde que o guia foi escrito, e um bloco que não bate mais é um bloco que precisa ser reescrito, não colado.

Os três itens que continuam pendentes — todos de layout, nenhum de cálculo:

- **Tooltip `wrapperStyle` prop**: assinatura e span do Tooltip precisam aceitar `wrapperStyle`
- **TechRow independente por modo**: 3-col → full-width uniforme; 2-col → side-by-side em grid
- **Contador de Magistrais**: texto completo ("Legendary Slots" / "Magistrais"), padding maior, estrelas maiores

> O quarto item — o fix das estatísticas de `generateBuildText` — **saiu desta lista em 2026-07-22**: foi de fato aplicado pela spec0004. Ver FIX-005.

---

## 📋 Backlog (curto prazo — acionáveis na próxima sessão)

- [ ] Aplicar as 4 correções pendentes do `GUIA_CORRECOES_FASE3.md`
- [ ] Implementar `generateBuildImage` (Fase 3)
- [ ] Verificar IDs reais de amuletos em `data.js` vs entradas em `icons.js` (alguns podem não bater)
- [ ] Verificar IDs de técnicas do Assassino (comentados em `icons.js` como pendentes)
- [ ] Adicionar técnicas do Assassino faltantes em `TECH_ICON` (sumica_toxico, supergolpe, etc.)

---

## 📁 Arquivos Críticos (não mexer sem contexto)

- `src/data.js` — banco de dados do jogo; IDs de itens são a chave de tudo; magistrais 100% explícitos
- `src/logic.js` — `computeStats`, `getStatGroups`, `checkLegendaryLimit`, `changeClass`; assinaturas exatas importam
- `src/App.jsx` — componente monolítico; ordem dos componentes importa para depuração
- `src/icons.js` — mapeamento ID → URL; IDs devem ser idênticos aos de `data.js`

---

## 💬 Última Sessão

**2026-07-22** — Sessão de infraestrutura, sem mexer em código do produto. Recebido o template-update do KCM v1.73.0 e comparado item a item com os meta/ vivos. Adotados: `meta/CEREBRO.md` (adaptado a este projeto), Instruções do Projeto regeneradas, kit do Claude Code (`CLAUDE.md`, `.claude/settings.json`, skills `/apply-spec` e `/wrap`), `.flatdropignore` e união no `.gitignore`. `HISTORICO.md` renomeado para `HISTORY.md`. Registradas DEC-007 a DEC-010 e 9 itens de feedback ao kit.
**Próximo passo:** aplicar as 4 correções pendentes do guia da Fase 3 no `App.jsx` e implementar `generateBuildImage` — agora com o Claude Code, via spec, em sessão dedicada.

> Sessão anterior — **2026-06-27**: sessão de documentação (gerados os 10 arquivos do kit de contexto e o `GUIA_CORRECOES_FASE3.md`). Não alterou o `App.jsx`: verificado em 2026-07-22 que `src/App.jsx` é byte a byte idêntico a `src/v4/App.jsx` e não contém `generateBuildImage` nem `wrapperStyle` — ou seja, a Fase 3 e as 4 correções continuam de fato pendentes.

**spec0002 aplicada em 2026-07-22.** As três âncoras de documento foram encontradas exatamente e substituídas (bug dos magistrais no `❌ Quebrado`, nota sobre o guia perdido, seções novas no CHANGELOG); o commit de doc `8a99244` foi para a `main` sem nenhum arquivo de código junto. `Builds/O Samurai Contra-Ataca.json` restaurado do remoto com `git checkout --`. **O `npm run build` passou** (33 módulos, 282 kB / 81,6 kB gzip, 2,1 s) antes de qualquer commit de código. Branch `v2-planner` criada a partir da `main` e publicada, com dois commits: `68883d3` (snapshots `src/v1..v4` + `GUIA_COMPLETO_v4.md`) e `e6db5be` (`src/App.jsx` evoluído, `src/icons.js`, 127 ícones em `public/icons/`, `logs/2026-06-27.md`, `INSTRUCOES-DO-PROJETO.md`). `gh-pages` não foi tocada. **Ficou pendente:** o `.flatdropignore` modificado continua sem commit — a spec não o incluiu em nenhuma das levas; os `src/v1..v4` e o `GUIA_COMPLETO_v4.md` seguem na árvore de trabalho, à espera da extração retroativa antes da limpeza; e a correção do bug dos magistrais continua só diagnosticada, sem código.

**spec0004 aplicada em 2026-07-22.** As duas âncoras de código no `App.jsx` (import de `isStatChanged`, bloco de estatísticas de `generateBuildText`) e as quatro âncoras de documento (`STATUS.md` ×2, `DECISIONS.md`, `CHANGELOG.md`) foram encontradas exatamente e substituídas. `npm run build` passou (33 módulos, 282,79 kB / 81,86 kB gzip, 2,69 s) antes do commit de código. Conferência visual feita com dev server + browser automation, build Samurai (Katana Pétrea com Ganho de Det. C/C, Amuleto Magistral "Último Suspiro" vinculado à classe, Vantagem Magistral, Arma Fantasma Kunai), export em modo Estatístico:
1. Nenhuma linha `undefined` — OK
2. Percentuais com sinal e `%` (`Ganho Det. C/C: +25%`, `Raio da Lâmina Explosiva: +100%`) — OK
3. Pontos não testados neste build (nenhuma prop `pts` selecionada), mas `formatStatValue` para `pts` foi conferido no código e é o mesmo já usado no painel
4. `Slots Magistrais`: ausente do texto com só o amuleto magistral equipado (valor 1 = base); apareceu como `Slots Magistrais: 2` só depois de equipar a Vantagem Magistral — OK
5. Grupo da classe: com Katana + Amuleto Magistral vinculado ao Samurai e prop `Raio da Lâmina Explosiva`, a linha `Raio da Lâmina Explosiva: +100%` apareceu no texto (antes não aparecia) — OK
6. Export em EN: rótulos saíram em inglês (`Legendary Slots`, `Explosive Blade Radius`, `Melee Resolve Gain` etc.) — OK
7. Não-regressão: modos `Build` e `Detailed` inalterados (sem bloco de estatísticas, como esperado); `HP` e `Resolve/Determinação` presentes em PT e EN no modo Estatístico — OK
8. Painel lateral: nenhuma mudança de comportamento — os mesmos valores que apareceram no texto já apareciam no painel antes da spec — OK
Commit de código `1f1f470` (`fix(export): corrige estatisticas undefined no texto exportado`) enviado à `v2-planner`.
**Próximo passo:** dos itens pendentes de layout (Tooltip `wrapperStyle`, TechRow por modo, Contador de Magistrais) ou a Fase 3 (`generateBuildImage`), todos precisam de código reescrito do zero — nenhum guia sobrevive. Escolher um, escrever a spec correspondente e aplicar via `/apply-spec`.

**spec0005 aplicada em 2026-07-22.** As cinco âncoras (`src/index.css` ×1, `src/App.jsx` ×4, `STATUS.md` ×1, `CHANGELOG.md` ×1) foram encontradas exatamente e substituídas. `npm run build` passou (33 módulos, 282,98 kB / 81,93 kB gzip, 3,87 s) antes do commit de código. Conferência visual feita com dev server + browser automation, item comum (Katana Pétrea, propriedade Dano Corpo a Corpo):
1. Nenhuma seta nativa visível no campo, em nenhum estado — OK
2. Número centrado, sem folga assimétrica à direita — OK
3. Botões `−` à esquerda e `+` à direita, mesmo tamanho, legíveis — OK
4. `+` no valor 12 (máximo da faixa 5–12%) manteve 12; `−` desceu para 11 — parada nos limites OK
5. Digitação de `8` + Tab confirmou o novo valor — OK
6. Campo focado em 11, roda do mouse não alterou o valor (ficou em 11) — bug silencioso corrigido, OK
7. Item Magistral (`Mão de Yoshitsune`): habilidade segue como caixa âmbar de texto, sem campo e sem botões — OK, nada mudou
8. Tema claro: `−` e `+` continuam legíveis — OK
9. Layout 2 colunas: a linha da propriedade não quebrou nem estourou — OK
Commit de código `a278783` (`fix(ui): remove spinners nativos e adota - e + nos botoes de passo`) enviado à `v2-planner`.
**Próximo passo:** escolher entre os itens pendentes de layout (Tooltip `wrapperStyle`, TechRow por modo, Contador de Magistrais) ou a Fase 3 (`generateBuildImage`) como próxima spec.
