# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

---

## [Não lançado]

### Adicionado
- Fase 3 — `generateBuildImage` via Canvas API: código completo entregue em guia, pendente de aplicação em `App.jsx`.
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

### Bug conhecido (registrado, não corrigido)
- Props de item Magistral não ficam travadas no máximo — visível na build aleatória. Diagnóstico completo em `meta/STATUS.md`

### Pendente de aplicação (código precisa ser reescrito — guia original perdido)
- `Tooltip` com prop `wrapperStyle` para controle de layout
- `TechRow` independente por modo (3-col full-width uniforme; 2-col side-by-side em grid)
- Contador de Magistrais com nome completo e maior espaçamento
- `generateBuildText` stats: fix de `classId` + `fmtStatTxt` + filtro `value === base`

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
