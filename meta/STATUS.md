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
  - Texto bilíngue conforme `lang` ativo
  - Cooldowns calculados (recarga real, não base)
  - HP e DET sempre presentes nas estatísticas
  - Código Base64 opcional (toggle nas configurações)
- `ExportPanel` com 2 grupos visuais: `📋 Texto` e `🖼️ Print` × 3 modos

---

## 🔧 Em Progresso

- **Fase 3 — `generateBuildImage`**: código completo entregue no guia `GUIA_CORRECOES_FASE3.md`, ainda não aplicado ao `App.jsx`. Próximo passo: inserir antes de `ExportPanel` e conectar ao `handleGenImage`.

---

## ❌ Quebrado / Com Problema

### Props de item Magistral não ficam travadas no máximo

**Sintoma:** ao gerar uma build aleatória (🎲), itens Magistrais aparecem com props em valores **abaixo do máximo**. No jogo — e conforme o próprio `README.md` («Props travadas no valor máximo, selecionáveis mas não editáveis») — item Magistral sempre tem a prop no valor máximo.

**Causa raiz:** a trava nunca foi implementada. O comportamento correto só *parecia* funcionar porque o valor inicial já era o máximo e ninguém o alterava. Três pontos:

| Onde | O que faz hoje | O que deveria fazer |
|---|---|---|
| `logic.js` › `randomBuild()`, ~L1005 e ~L1013 | `randomInRange(p.mn, p.mx, p.u)` sem olhar `chosen.leg` | se o item é `leg`, usar `p.mx` direto |
| `logic.js` › `setPropValue()`, ~L797 | clampa em `[mn, mx]` para qualquer item — deixa **baixar** a prop de um Magistral pelos steppers ▲▼ | se o item é `leg`, ignorar a alteração e manter `mx` |
| `App.jsx` › card de gear | usa `isLeg` só para cor e tag «MAGISTRAL» | renderizar o valor como texto travado, sem input nem steppers |

Note que `logic.js` › `selectProp()` (~L761) já acerta por outro caminho: o padrão dele é `propDef.mx` para todo item, Magistral ou não.

**Correção proposta (ainda não aplicada):** um helper único — `isLegendarySlot(build, slotName)` — consultado nos três pontos. Mudança pequena e cirúrgica; merece spec própria, com build e conferência visual depois.

**Descoberto em:** 2026-07-22, por leitura do código a partir de um relato de memória do usuário. Nunca havia sido registrado — a ferramenta é anterior à adoção do KCM.

---

## ⏳ Pendente de Aplicação (guias prontos, não aplicados ainda)

> ⚠️ **O `GUIA_CORRECOES_FASE3.md` não existe mais** — não está na pasta local nem no repositório, e não será recuperado (confirmado pelo usuário em 2026-07-22). O código destes quatro itens **precisa ser reescrito do zero**. Não perca tempo procurando o arquivo. Daqui em diante correção de código sai por spec aplicada pelo Claude Code, não por guia para colar à mão — foi justamente esse formato que deixou a Fase 3 parada desde junho (DEC-007).

Os quatro itens que continuam pendentes:

- **Tooltip `wrapperStyle` prop**: assinatura e span do Tooltip precisam aceitar `wrapperStyle`
- **TechRow independente por modo**: 3-col → full-width uniforme; 2-col → side-by-side em grid
- **Contador de Magistrais**: texto completo ("Legendary Slots" / "Magistrais"), padding maior, estrelas maiores
- **`generateBuildText` stats fix**: `getStatGroups(stats, build.classId, lang)` + `fmtStatTxt()` + filtro `value === base`

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
