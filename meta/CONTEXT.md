# CONTEXT.md — GoT Legends Build Planner

> Arquivo **estável**. O assistente lê no início de cada sessão para se ambientar.
> Muda só em alteração estrutural (stack, arquitetura, escopo, nova armadilha descoberta).

---

## Visão Geral

Planejador de builds para **Ghost of Tsushima: Legends** — modo cooperativo do jogo. Permite montar e calcular builds completas para as 4 classes do jogo (Samurai, Caçadora/Hunter, Ronin, Assassino/Assassin), escolhendo habilidade de classe, 3 camadas de vantagens, e 5 slots de equipamento (Katana, Longo Alcance, Amuleto, Arma Fantasma I/II), com cálculo de estatísticas em tempo real, exportação de texto formatado e geração de imagem PNG. Suporte bilíngue PT-BR/EN nativo.

**Usuário-alvo:** jogadores de GoT: Legends brasileiros que querem planejar e compartilhar builds.  
**Problema que resolve:** não existe ferramenta em PT-BR completa para o jogo.  
**O que é sucesso:** usuário consegue montar, calcular, salvar e compartilhar qualquer build sem sair da página.

---

## Stack Tecnológica

- **Linguagem:** JavaScript (JSX), sem TypeScript
- **Framework:** React 18.3
- **Build tool:** Vite 5.4
- **CSS:** Tailwind CSS (usado minimamente; estilização via inline styles com objeto `T`)
- **Persistência:** `localStorage` (key `gotlegends_v1_builds`)
- **Deploy:** Netlify (primário) e Vercel (alternativo); GitHub Pages via `gh-pages`
- **Sem backend, sem banco, sem autenticação**

---

## Estrutura do Projeto

```
projeto/
├── src/
│   ├── App.jsx       — UI completa (~2539 linhas). Todos os componentes em um arquivo só.
│   ├── data.js       — Banco de dados do jogo (~1051 linhas). Classes, gear, perks, props.
│   ├── logic.js      — Motor de cálculo e estado (~1499 linhas). computeStats, serialização, labels.
│   ├── icons.js      — Mapeamento item_id → URL de ícone. Separado do App para fácil manutenção.
│   ├── index.css     — Apenas @tailwind directives + reset mínimo.
│   └── main.jsx      — Entrypoint React (ReactDOM.createRoot).
├── public/
│   └── icons/
│       ├── class/         — SVGs das 4 classes (class_samurai.svg etc.)
│       ├── gear/          — SVGs de katanas, arcos, amuletos, GWs
│       ├── ghost_weapons/ — SVGs de armas fantasma (gw_kunai.svg etc.)
│       ├── techniques/    — PNGs das técnicas e habilidades (*-selected.png)
│       └── logo/          — Logo do jogo (tsushima_logo.png)
├── meta/             — documentos de contexto (CEREBRO, CONTEXT, STATUS, DECISIONS,
│   │                   CHANGELOG, IDEAS, ROADMAP, GLOSSARY, HISTORY, LOG-TEMPLATE)
│   └── specs/        — specs de doc, aplicadas pelo Claude Code via /apply-spec
├── logs/             — logs de sessão (AAAA-MM-DD.md)
├── .claude/          — settings.json + skills /apply-spec e /wrap
├── CLAUDE.md         — guia raiz lido pelo Claude Code em todo turno
├── package.json      — React 18 + Vite 5 + Tailwind
├── vite.config.js    — base controlado por VITE_BASE_URL
├── netlify.toml      — redirect SPA
└── vercel.json       — rewrite SPA
```

---

## Convenções de Código

- **Nomes:** variáveis e funções em camelCase; IDs de itens em snake_case (espelho de `data.js`).
- **Comentários:** PT-BR. Blocos de seção com `// ─── Nome ───`.
- **Estilo:** sem linter ativo — manter consistência com o código existente.
- **Commits:** Conventional Commits — `tipo(escopo): descricao` (`feat`, `fix`, `docs`, `refactor`, `chore`) — com a mensagem **SEM acento**, porque o CMD do Windows os corrompe. Ex.: `feat(export): adiciona geracao de imagem`. Ver DEC-010.
- **Idioma do produto:** PT-BR default com toggle para EN. Todo texto de UI existe em ambos.

---

## Como o sistema de tema funciona (CRÍTICO)

`T` é um objeto **mutável** no topo do módulo (`const T = { ...THEME_DARK }`). No início de cada render do `App`, **antes de qualquer hook**, acontece:

```js
Object.assign(T, theme === 'dark' ? THEME_DARK : THEME_LIGHT)
```

Isso garante que todos os componentes filhos — que leem `T.bg`, `T.text`, etc. diretamente — recebam sempre os valores corretos do tema ativo. Como o React é single-thread e a atualização é síncrona, o pattern funciona sem Context nem prop-drilling.

**Consequência:** nunca declare `const T = { ... }` dentro de um componente filho — leia sempre o `T` do módulo.

---

## Como o cálculo de stats funciona (CRÍTICO)

```
build (estado imutável) → computeStats(build) → stats object
```

- `build` contém: `classId`, `abilityId`, `ronin_breath`, `techs: {I, II, III}`, `gear: {katana, ranged, charm, gw1, gw2}`.
- Cada slot de gear tem: `itemId`, `p1: {propId, value}`, `p2: {propId, value}`, `perk1`, `perk2`.
- `computeStats` lê `CLASSES` e `GEAR` de `data.js` e acumula modificadores, retornando um objeto `stats` com todos os valores calculados.
- `stats` é recalculado a cada render via `useMemo(() => computeStats(build), [build])`.
- Para amuletos magistrais: `resolveCharmClassBinding(item, linkedClass)` injeta props/perks exclusivos da classe vinculada antes do cálculo.

---

## Como as ícones funcionam (CRÍTICO)

Dois tipos de ícones com lógica diferente:

| Tipo | Formato | Filtro CSS | Origem |
|---|---|---|---|
| Classe (header) | SVG branco | `T.iconFilter` (inverte por tema) | `CLASS_ICON[classId]` |
| Gear / GW | SVG branco | `T.iconFilter` | `getGearIconUrl(item)` via `GEAR_ICON` |
| Técnicas / Habilidades | PNG colorido (ouro/preto) | **Nenhum** — cores originais | `getTechIconUrl(techId, classId)` via `TECH_ICON` |
| Logo (BookmarkTab) | PNG | `T.iconFilter` | `LOGO_URL` |

Ícones PNG de técnicas **não recebem filtro** — preservam as cores douradas originais do jogo. Errar esse ponto transforma os ícones em retângulos brancos ou pretos sólidos.

---

## Arquitetura — pontos-chave

- **Single-file components** — todo o JSX em `App.jsx`; separação só para dados (data.js), lógica (logic.js) e ícones (icons.js). Ver DEC-001.
- **T mutável para temas** — sem Context, sem prop drilling. Ver DEC-002.
- **PNG para técnicas, SVG para gear** — decisão de qualidade visual. Ver DEC-003.
- **Canvas API sem dependências** — geração de imagem pura. Ver DEC-004.
- **data.js 100% explícito** — magistrais têm props/perks escritos diretamente, sem herança. Ver DEC-006.

---

## Armadilhas Conhecidas (o que NÃO fazer)

1. **Não envolver `<select>` com `<Tooltip>`** — o span `inline-block` do Tooltip quebra o `width: 100%` do select, fazendo-o encolher para o tamanho do texto. Use a descrição abaixo do select ou o prop `wrapperStyle` do Tooltip. Ver FIX-002.

2. **Não chamar `getStatGroups(stats, lang)`** — a assinatura correta é `getStatGroups(stats, classId, lang)`. Sem `classId`, grupos de classe incorretos são incluídos e alguns stats retornam `undefined`. Ver FIX-004.

3. **Não aplicar filtro CSS em ícones PNG de técnicas** — eles já têm suas cores. `filter: brightness(0) invert(1)` os transforma em círculos brancos sólidos.

4. **Não declarar `const T = {...}` dentro de componentes filhos** — `T` é o objeto global mutável. Filhos devem ler `T.xxx` diretamente.

5. **`TechRow` dentro de `<Tooltip>` sem `wrapperStyle: {display: block}`** — o span inline-block faz botões de técnica fluírem lado a lado. Ver FIX-003.

6. **`stat.formatted` não existe** — o objeto retornado por `getStatGroups` tem `value` e `unit`, mas não `formatted`. Formatar manualmente com a função `fmtStatTxt`.

7. **Amuletos magistrais com `classBinding: true`** — as props e perks de classe são injetados em runtime por `resolveCharmClassBinding`. Nunca leia as props do item direto do `GEAR` — sempre use `getEffectiveCharm(itemId, linkedClass)`.

8. **Técnica Magistral não tem flag própria** — é identificada por `tech.fx.some(fx => fx.s === 'legSlots')`, em `countLegBonus`, `checkLegendaryLimit` e `changeClass`. E ela existe **só nos tiers I e III**, nas quatro classes: é dessa simetria que `changeClass` depende para propagar a técnica ao trocar de classe. Acrescentar uma técnica `legSlots` num tier que só uma classe tenha quebra a troca de classe **em silêncio** — sem erro, apenas com um build acima do limite. Ver DEC-013.

9. **A string de munição tem formato significativo** — `"Flecha Flamejante: 2 (5)"` não é texto livre: o número entre parênteses é a quantidade da classe primária da arma, e `"Flecha Perfurante: (6)"` (sem número externo) some da tela para as outras classes. Quem editar `ammo` em `data.js` precisa manter o padrão `Label: X (Y)` — `formatAmmoForClass` casa por regex e **deixa passar sem erro** a linha que não casar, exibindo-a crua para todas as classes. Ver DEC-017.

10. **`REQUIRED_PERKS` é uma lista à mão** — o perk de desbloqueio obrigatório só trava se o item estiver nessa tabela de `data.js`. Item que ganhe perk de desbloqueio no `GEAR` e não entre aqui não trava nada, e nada acusa. Ver DEC-014 e FIX-009, que foi exatamente esse caso.

11. **Restrição de classe não se infere da planilha** — a aba de Magistrais tem colunas por classe que são **recomendação de build**, não permissão de uso. Lê-las como restrição já produziu `data.js` errado três vezes na origem do projeto. A tabela canônica está na DEC-018 e é a única referência. Corolário: item sem perk de desbloqueio no pool pode estar certo (a Visão de Sugaru é assim de propósito) — cheque a DEC-018 antes de "consertar".

12. **CDR de Arma Fantasma não empilha entre as armas** — propriedade de redução de recarga numa AF vale **só para aquela AF**; a mesma propriedade no Amuleto vale para as duas. Em qualquer dos casos o número é exibido **separado por arma**, nunca somado num total. Errar isso foi o defeito mais repetido da fase de origem.

---

## Contexto de Produto

- **Usuário-alvo:** jogador BR de GoT: Legends, nível intermediário a avançado
- **Dor que resolve:** falta de ferramenta completa em PT-BR; planilhas manuais são lentas e não calculam
- **O que é sucesso:** build montada em <2 min e compartilhada com um código ou imagem
- **O que o projeto deliberadamente NÃO é:** guia de jogo, wiki, tracker de progresso, gerenciador de conta
