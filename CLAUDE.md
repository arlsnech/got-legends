# GoT Legends Build Planner — guia para o Claude Code

> Arquivo-raiz lido pelo Claude Code em toda sessao. Mantenha CURTO (< 200 linhas — custa token em todo turno).
> Regra pratica: se remover uma linha e o Claude ainda acerta, ela nao pertence aqui. Procedural detalhado -> vira skill em `.claude/skills/`.
> O comportamento detalhado do assistente esta em `meta/CEREBRO.md`.

## Ritual de inicio
Leia `meta/CEREBRO.md` -> `meta/CONTEXT.md` -> `meta/STATUS.md` antes de agir. Confirme em uma frase o que entendeu.

## O que este projeto e
SPA React 18 + Vite 5, sem backend. Planejador de builds de Ghost of Tsushima: Legends, bilingue PT-BR/EN.
Quatro arquivos carregam tudo: `src/App.jsx` (UI inteira, ~2500 linhas), `src/data.js` (banco do jogo),
`src/logic.js` (motor de calculo), `src/icons.js` (mapa id -> icone). Detalhe em `meta/CONTEXT.md`.

## Build / validacao
- Build: `npm run build` — rode antes de commitar mudanca de codigo.
- Dev: `npm run dev` (localhost:5173) · Preview do build: `npm run preview`
- Deploy: `npm run deploy` (GitHub Pages) — **so sob pedido explicito**.
- **Nao ha suite de testes.** A rede e o build + conferencia visual: ao terminar, diga o que abrir e olhar na tela.
- Mudanca so em `meta/` NAO precisa de build; a rede e o `git diff`.

## Armadilhas que ja morderam (nao repita)
- `getStatGroups(stats, classId, lang)` — o `classId` e obrigatorio. Sem ele, stats voltam `undefined`.
- Nao envolva `<select>` com `<Tooltip>` — o span inline-block mata o `width: 100%`.
- Nao aplique filtro CSS em icone PNG de tecnica — eles ja tem cor propria; o filtro vira retangulo solido.
- `T` e objeto MUTAVEL de modulo. Nunca declare `const T = {...}` dentro de um componente filho.
- Amuleto magistral com `classBinding`: leia sempre por `getEffectiveCharm(itemId, linkedClass)`, nunca do `GEAR` direto.
- Lista completa em `meta/CONTEXT.md` > "Armadilhas Conhecidas".

## Convencoes
- IDs de dominio em `snake_case` PT-BR espelhando `data.js` (`ronin_breath`, `gw_kunai`). **Nao traduza para ingles.**
- Codigo em camelCase ingles; comentarios em PT-BR; secoes marcadas com `// --- Nome ---`.
- Commits em Conventional Commits (`feat(escopo): descricao`), mensagem **SEM acento**.
- Toda string de UI existe em PT-BR e EN. Nunca acrescente string monolingue.
- Edicoes nos meta/ sao **append-only** pelo Code (STATUS, DECISIONS); curadoria que reescreve vem do chat (arquivo inteiro OU spec).

## Specs (`meta/specs/`)
- Ache cada ancora EXATAMENTE; se nao achar, **PARE e reporte**. Nao mexa fora das edicoes nomeadas.
- `git diff` antes do commit.
- A spec e versionada: entra no `git add` junto com o efeito dela.
- Ao terminar de aplicar, feche o ciclo sozinho: `git add` -> `git commit` -> `git push`.

## Config (modelo x esforco)
- Spec com diff exato ja validado -> **Sonnet**, esforco proporcional (mecanico = baixo/medio).
- Tarefa com julgamento sem rede (refator no `App.jsx`, spec que delega decisao) -> **Opus**, esforco alto.
- Esforco proporcional a ambiguidade; `/effort low` para o trivial.
