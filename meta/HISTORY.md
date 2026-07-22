# HISTORY.md — Conhecimento Consolidado

> Lido sob demanda — não no início da sessão. Guarda análises, discussões e decisões
> técnicas densas que aconteceram ao longo do desenvolvimento e que não cabem no CONTEXT enxuto.

---

## 1. Evolução do sistema de layout (3-col vs 2-col)

**Problema original:** o projeto começava com um layout de 2 colunas (esquerda larga com técnicas + gear + saves; direita com stats). O usuário sentiu que era necessário rolar muito para configurar a build — as seções estavam muito espaçadas verticalmente.

**Iteração 1 (fracassada):** foi proposto um "top-bar" com o SavePanel + seletores de classe. O usuário apontou que a barra de código Base64 ocupava muito espaço e que a lista de builds salvas empurrava o conteúdo.

**Solução final adotada:**
- Classe movida permanentemente para o **header fixo** (sempre visível)
- SavePanel transformado em **SaveDrawer** (overlay lateral) acessado pela **BookmarkTab** (aba estilo marcador de livro)
- Layout de **3 colunas com scroll independente** como padrão: técnicas (300px) | gear (1fr) | stats (340px)
- Layout de **2 colunas** como alternativa: técnicas+gear (1fr) | stats (360px)
- Sub-header fixo com HP/DET + magistrais + botões de export

**Configuração das colunas** (para ajuste futuro):
```jsx
// No return do App, buscar: gridTemplateColumns: layoutMode === 'three-col'
gridTemplateColumns: layoutMode === 'three-col'
  ? '300px 1fr 340px'  // esquerda | centro | direita
  : '1fr 360px',       // esquerda+centro | direita
```

---

## 2. Evolução do componente TechniquesPanel

**Problema:** Habilidades de classe e vantagens (TechRow) se comportavam de forma inconsistente dependendo do modo de layout e do tamanho do nome.

**Causa raiz descoberta:** O componente `<Tooltip>` renderiza um `<span style={{ display: 'inline-block' }}>`. Elementos `inline-block` fluem horizontalmente — botões dentro dele herdam a largura do span (tamanho do conteúdo), não do container pai. Isso causava:
- Botões com largura variada por tamanho do nome
- Botões curtos ficando lado a lado em 3-col

**Solução estrutural adotada:**
1. `Tooltip` recebe prop `wrapperStyle` que é espalhada no span: `<span style={{ display: 'inline-block', ...wrapperStyle }}>`
2. `TechRow` passa `wrapperStyle={{ display: 'block', width: '100%' }}` em 3-col
3. O container dos tiers usa `display: grid` com `minmax(140px, 1fr)` em 2-col

**Diferença por modo:**
| Elemento | 3-col | 2-col |
|---|---|---|
| Habilidades | `flex-direction: column` | `grid minmax(160px, 1fr)` |
| Vantagens | `flex-direction: column` + `wrapperStyle: block 100%` | `grid minmax(140px, 1fr)` |

---

## 3. Estratégia de ícones SVG/PNG

**Contexto:** o usuário forneceu dois conjuntos de ícones — SVGs para gear/classe e PNGs para técnicas. Os PNGs preservam as cores originais do jogo (ouro com preto). Os SVGs são brancos/neutros e aceitam filtros CSS.

**Decisão final (DEC-003):**
- SVGs de classe e gear → `filter: T.iconFilter` (inverte para branco no dark, preto no light)
- PNGs de técnicas → sem filtro; opacidade reduzida quando inativo (`opacity: 0.38`)

**Fallback de ícones:**
- Se o arquivo não existe → `onError` esconde a `<img>` → a bolinha fallback (span circulat) aparece via `display: none → inline-block`
- Técnicas sem mapeamento em `TECH_ICON` → `CLASS_TECH_FALLBACK[classId]` (ícone da habilidade suprema da classe)

**Filtros por tema:**
```js
THEME_DARK.iconFilter    = 'brightness(0) invert(1)'      // SVG → branco
THEME_DARK.iconFilterDim = 'brightness(0) invert(1) opacity(0.45)'
THEME_LIGHT.iconFilter   = 'brightness(0)'                 // SVG → preto
THEME_LIGHT.iconFilterDim = 'brightness(0) opacity(0.4)'
```

**Estrutura de pastas de ícones:**
```
public/icons/
  class/           SVGs das 4 classes
  gear/            SVGs de katanas, arcos, amuletos, GWs (todos aqui, sem subpasta GW)
  techniques/      PNGs de técnicas e habilidades (*-selected.png)
  logo/            Logo PNG do jogo
```

---

## 4. HpResolveBar — evolução do design

**Requisito do usuário:** replicar a interface do jogo — círculos de Determinação acima, barra de HP abaixo.

**Iterações:**
1. **V1 (errada):** `maxCircles = 4` hardcoded → sempre mostrava 4 círculos, o 4º ficava escuro mesmo sem bônus (FIX-004).
2. **V2 (parcialmente errada):** barra de HP com `border: 1px solid T.dim` sempre visível + `basePct` calculado incluindo HP base → a barra aparecia "80% cheia" desde o início.
3. **V3 (final):** Barra só renderiza quando `hp > 100` (só bônus). Container com `width: HP_BAR_WIDTH` fixo. Número sempre à direita, sem pular. Círculos = `resolve` exatamente.

**Constantes configuráveis:**
```js
const HP_BAR_WIDTH   = 110   // largura da barra
const HP_BAR_HEIGHT  = 9     // altura/espessura
const DET_CIRCLE_SIZE = 12   // diâmetro dos círculos
```
São **completamente independentes** — alterar uma não afeta a outra.

---

## 5. generateBuildText — análise dos bugs de stats

**Modo Estatístico** retornava `undefined` em todos os valores de stat. Três causas simultâneas:

| Bug | Código errado | Código correto |
|---|---|---|
| Assinatura errada | `getStatGroups(stats, lang)` | `getStatGroups(stats, build.classId, lang)` |
| Campo inexistente | `stat.formatted` | Não existe — usar `fmtStatTxt(s)` |
| Filtro incorreto | `if (!stat.value \|\| stat.value === 0)` | `if (stat.value === stat.base)` |

**`fmtStatTxt` — função de formatação para texto:**
```js
const fmtStatTxt = (s) => {
  if (s.unit === '★') return '★'.repeat(s.value)
  if (s.unit === '%') return s.value > 0 ? `+${Math.round(s.value * 100)}%` : `${Math.round(s.value * 100)}%`
  if (s.unit === 'pts' || s.unit === 's') return s.value > 0 ? `+${s.value}${s.unit}` : `${s.value}${s.unit}`
  return String(s.value)
}
```

---

## 6. Fase 3 — Canvas API: considerações técnicas

**Carregamento de ícones no canvas:**
- SVGs de gear exigem `img.crossOrigin = 'anonymous'`; se o servidor não servir headers CORS, `ctx.drawImage` lança `SecurityError`
- Ícones que falham ao carregar retornam `null` silenciosamente — o layout continua sem o ícone
- Todos os ícones são carregados em paralelo via `Promise.all` antes de qualquer `drawImage`

**Alturas do canvas:**
- `build` e `detailed`: 560px (conservador)
- `stats`: 820px (acomoda seção extra de estatísticas)
- Para builds com muitas descrições longas, pode ultrapassar → F4 prevê cálculo dinâmico

**Download do PNG:**
```js
const a    = document.createElement('a')
a.href     = canvas.toDataURL('image/png')
a.download = `${safeName}-${mode}.png`
a.click()
```

**Constantes de layout da imagem** (configuráveis no topo da função):
```js
const IMG_W         = 900    // largura total
const IMG_PAD       = 28     // padding interno
const IMG_COL_SPLIT = 0.42   // % da largura para coluna esquerda
const IMG_HEADER_H  = 72     // altura do header
const IMG_ICON_SMALL = 18    // ícones de linha
const IMG_ICON_ULT  = 48     // ícone supremo no header
```

---

## 7. Sistema de saves — estrutura do localStorage

**Chave:** `gotlegends_v1_builds`

**Formato:**
```json
[
  {
    "version": "1.0",
    "game": "got-legends",
    "id": "abc123",
    "name": "Nome da Build",
    "createdAt": "2026-06-24T12:00:00.000Z",
    "build": { "classId": "samurai", ... }
  }
]
```

**Exportação JSON (arquivo):**
```json
{
  "version": "1.0",
  "game": "got-legends",
  "builds": [ ...array de entries acima... ]
}
```

**Código Base64:** `encodeBuild(build, name)` → base64 do JSON serializado via `serializeBuild`. `decodeBuild(code)` → decodifica e valida estrutura.
