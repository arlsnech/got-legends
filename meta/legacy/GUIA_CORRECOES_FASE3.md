# GoT Legends Build Planner — Guia de Correções + Fase 3

---

## Índice

1. [Diagnóstico dos problemas](#1-diagnóstico)
2. [CORREÇÃO 1 — Tooltip com suporte a wrapperStyle](#correção-1--tooltip-com-suporte-a-wrapperstyle)
3. [CORREÇÃO 2 — TechRow full-width em 3 colunas + side-by-side em 2 colunas](#correção-2--techrow-independente-por-modo)
4. [CORREÇÃO 3 — Contador de Magistrais: nome completo + mais espaço](#correção-3--contador-de-magistrais)
5. [CORREÇÃO 4 — generateBuildText: stats sem undefined](#correção-4--generatebuildtext-stats-corrigido)
6. [Fase 3 — Geração de Imagem via Canvas API](#fase-3--geração-de-imagem)

---

## 1. Diagnóstico

| Problema | Causa raiz |
|---|---|
| TechRow varia de tamanho por nome (3-col) | `Tooltip` renderiza `<span display:inline-block>` que encolhe para o conteúdo. O `width:100%` do button aplica-se ao span, não à coluna. |
| TechRow (vantagens) ficam empilhadas em 2-col | O wrapper `<div display:block width:100%>` forçou tudo full-width, impedindo o grid 2-col. |
| Magistrais abreviado e próximo do HP | Texto curto `Leg.`/`Mag.` e padding insuficiente |
| Stats com `undefined` e `stat.formatted` | `getStatGroups(stats, lang)` faltava `classId`; `stat.formatted` não existe na estrutura — precisa de `fmtStatTxt(s)` |

---

## CORREÇÃO 1 — Tooltip com suporte a `wrapperStyle`

### Por que é necessária

O `Tooltip` envolve seus filhos num `<span display:inline-block>`. Esse span encolhe para o tamanho do conteúdo interno. Quando o button filho tem `width: '100%'`, ele herda a largura do span, que é a largura do próprio botão — um ciclo que mantém o botão no tamanho do texto.

A solução é deixar quem usa o Tooltip escolher o estilo do wrapper quando necessário.

### Onde localizar

Busque no arquivo:
```
// ─── Tooltip (com detecção de borda) ────────────────────
```

### ANTES (apenas a linha do `<span>` dentro do return do Tooltip)

```jsx
  return (
    <span style={{ display: 'inline-block', cursor: 'help' }}
      onMouseEnter={show}
      onMouseLeave={() => setVis(false)}>
```

### DEPOIS

```jsx
  return (
    <span
      style={{ display: 'inline-block', cursor: 'help', ...wrapperStyle }}
      onMouseEnter={show}
      onMouseLeave={() => setVis(false)}>
```

### E na assinatura da função do Tooltip

**ANTES:**
```jsx
function Tooltip({ text, children }) {
```

**DEPOIS:**
```jsx
function Tooltip({ text, children, wrapperStyle }) {
```

> Nada mais muda no Tooltip. Usos existentes sem `wrapperStyle` continuam idênticos.

---

## CORREÇÃO 2 — TechRow independente por modo

### Objetivo

- **3 colunas**: cada botão de vantagem ocupa **100% da largura da coluna** (mesmo tamanho, como as habilidades)
- **2 colunas**: os botões de vantagem ficam **lado a lado** em grid (comportamento antigo que funcionava)

### Parte A — Passar `layoutMode` para TechRow

O `TechRow` já recebe `tech, selected, onToggle, blocked`. Precisamos adicionar `layoutMode`.

**LOCALIZAR** a definição de `TechRow` dentro de `TechniquesPanel`:
```jsx
  const TechRow = ({ tech, selected, onToggle, blocked }) => {
```

**SUBSTITUIR POR:**
```jsx
  const TechRow = ({ tech, selected, onToggle, blocked, layoutMode: rowLayoutMode }) => {
```

> Usamos `rowLayoutMode` para não colidir com o `layoutMode` do escopo externo.

### Parte B — Wrapper do TechRow por modo

Ainda dentro de `TechRow`, **LOCALIZAR** o `return (` inteiro:

```jsx
    return (
      // div de bloco garante que cada TechRow ocupa linha inteira
      // independente de qualquer ancestor inline-block (ex: Tooltip)
      <div style={{ display: 'block', width: '100%', marginBottom: 4 }}>
        <Tooltip text={isBlocked
          ? (lang === 'en' ? 'Unequip a Legendary item first' : 'Desequipe um item Magistral primeiro')
          : desc}>
          <button
            onClick={onToggle}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: isAct ? T.cls[build.classId] + '25' : 'transparent',
              border: `1px solid ${isAct ? T.cls[build.classId] : T.border}`,
              borderRadius: 7, padding: '7px 10px',
              // marginBottom removido daqui — está no div pai acima
              cursor: isBlocked ? 'not-allowed' : 'pointer', color: T.text,
              transition: 'all 0.15s',
            }}>
```

**SUBSTITUIR POR:**
```jsx
    /*
      wrapperStyle do Tooltip:
      - three-col: bloco 100% — botão ocupa toda a coluna (uniforme)
      - two-col:   inline-block auto — botões fluem lado a lado no grid
    */
    const tooltipWrapperStyle = rowLayoutMode === 'two-col'
      ? { display: 'inline-block', width: '100%' }
      : { display: 'block', width: '100%' }

    return (
      <div style={{ marginBottom: 4 }}>
        <Tooltip
          wrapperStyle={tooltipWrapperStyle}
          text={isBlocked
            ? (lang === 'en' ? 'Unequip a Legendary item first' : 'Desequipe um item Magistral primeiro')
            : desc}>
          <button
            onClick={onToggle}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: isAct ? T.cls[build.classId] + '25' : 'transparent',
              border: `1px solid ${isAct ? T.cls[build.classId] : T.border}`,
              borderRadius: 7, padding: '7px 10px',
              cursor: isBlocked ? 'not-allowed' : 'pointer', color: T.text,
              transition: 'all 0.15s',
            }}>
```

### Parte C — Container dos tiers: grid em 2-col

**LOCALIZAR** (dentro do `.map(tier => ...)` em TechniquesPanel), a chamada ao `TechRow`:

```jsx
            {techs.map(t => (
              <TechRow
                key={t.id}
                tech={t}
                selected={build.techs[tier]}
                onToggle={() => { ... }}
                blocked={...}
              />
            ))}
```

**SUBSTITUIR POR:**
```jsx
            {/*
              Grid container dos TechRows:
              - two-col: grid side-by-side (minmax 140px para evitar quebra de nome)
              - three-col: flex-column (um embaixo do outro, full-width)
            */}
            <div style={layoutMode === 'two-col' ? {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 4,
            } : {
              display: 'flex',
              flexDirection: 'column',
            }}>
              {techs.map(t => (
                <TechRow
                  key={t.id}
                  tech={t}
                  selected={build.techs[tier]}
                  layoutMode={layoutMode}
                  onToggle={() => {
                    const incoming = build.techs[tier] === t.id ? null : t.id
                    if (!canChangeTech(tier, incoming)) return
                    setBuild(prev => ({
                      ...prev,
                      techs: { ...prev.techs, [tier]: prev.techs[tier] === t.id ? null : t.id },
                    }))
                  }}
                  blocked={!canChangeTech(tier, build.techs[tier] === t.id ? null : t.id)}
                />
              ))}
            </div>
```

> **Nota importante:** verifique se a chamada original ao `onToggle` e `blocked` dentro do seu arquivo já usa uma sintaxe diferente (arrow function inline vs definida antes). Se sim, mantenha a sua versão — só adicione o wrapper `<div>` e o `layoutMode={layoutMode}` na prop do TechRow.

### Resultado esperado

| Elemento | 3 colunas | 2 colunas |
|---|---|---|
| Habilidades de classe | Uma por linha, 100% largura (não muda) | Lado a lado, nowrap (não muda) |
| Vantagens de classe | Uma por linha, **100% largura uniforme** ✅ | Lado a lado em grid ✅ |

---

## CORREÇÃO 3 — Contador de Magistrais

### Onde localizar

No `return` do App, busque:
```
{/* Grupo 2: Contador de magistrais
```

### ANTES

```jsx
        {/* Grupo 2: Contador de magistrais — com padding generoso em ambos os lados */}
        <div style={{
          flexShrink: 0,
          paddingLeft: 20, paddingRight: 20,
          fontSize: 11, color: T.muted,
        }}>
          <span style={{ letterSpacing: 1 }}>
            {'★'.repeat(legInfo.used)}
            {'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
          </span>
          {' '}
          <span style={{
            fontSize: 10,
            color: legInfo.used >= legInfo.limit ? T.leg : T.muted,
            fontWeight: legInfo.used >= legInfo.limit ? 700 : 400,
          }}>
            {lang === 'en'
              ? `${legInfo.used}/${legInfo.limit} Leg.`
              : `${legInfo.used}/${legInfo.limit} Mag.`}
          </span>
        </div>
```

### DEPOIS

```jsx
        {/* Grupo 2: Contador de magistrais */}
        <div style={{
          flexShrink: 0,
          paddingLeft: 32, paddingRight: 32,  // mais espaço para separar do HP
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          {/* Estrelas */}
          <span style={{ fontSize: 14, letterSpacing: 3, color: T.leg, lineHeight: 1 }}>
            {'★'.repeat(legInfo.used)}
            <span style={{ color: T.dim }}>
              {'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
            </span>
          </span>
          {/* Texto completo */}
          <span style={{
            fontSize: 10,
            color: legInfo.used >= legInfo.limit ? T.leg : T.muted,
            fontWeight: legInfo.used >= legInfo.limit ? 700 : 500,
            whiteSpace: 'nowrap',
          }}>
            {legInfo.used}/{legInfo.limit}{' '}
            {lang === 'en' ? 'Legendary Slots' : 'Magistrais'}
          </span>
        </div>
```

---

## CORREÇÃO 4 — `generateBuildText`: stats sem undefined

### Diagnóstico dos bugs

**Bug 1:** `getStatGroups(stats, lang)` — faltava o argumento `classId`. A assinatura real é `getStatGroups(stats, classId, lang)`.

**Bug 2:** `stat.formatted` não existe na estrutura retornada por `getStatGroups`. Os stats têm `value`, `unit`, `label` e `base`. Precisamos formatar manualmente.

**Bug 3:** `if (!stat.value || stat.value === 0)` é uma condição errada. Para stats com `base !== 0`, um valor igual ao base (ex.: HP=100) passaria pelo filtro. O correto é `stat.value === stat.base`.

### Onde localizar

Busque no arquivo:
```
// ─── Gerador de texto de exportação ─────────────────────────────
```

É a função `generateBuildText`. Localize o bloco `if (withStats && stats) {` — está perto do fim da função.

### ANTES (bloco completo das estatísticas dentro de generateBuildText)

```jsx
  // Demais stats — somente as modificadas (valor !== 0)
  const groups = getStatGroups(stats, lang)
  for (const group of groups) {
    for (const stat of group.stats) {
      // HP e DET já foram adicionados acima
      if (stat.key === 'maxHP' || stat.key === 'maxResolve') continue
      // Só mostra se foi modificada (valor diferente de 0 ou base)
      if (!stat.value || stat.value === 0) continue
      lines.push(`  ${stat.label}: ${stat.formatted}`)
    }
  }
```

### DEPOIS

```jsx
  // Formata um stat para texto puro (equivalente ao fmtStat do StatsPanel)
  const fmtStatTxt = (s) => {
    if (s.unit === '★') return '★'.repeat(s.value)
    if (s.unit === '%') return s.value > 0 ? `+${Math.round(s.value * 100)}%` : `${Math.round(s.value * 100)}%`
    if (s.unit === 'pts' || s.unit === 's') return s.value > 0 ? `+${s.value}${s.unit}` : `${s.value}${s.unit}`
    return String(s.value)
  }

  // Demais stats — somente as modificadas (value !== base)
  // classId é necessário para getStatGroups filtrar grupos de classe irrelevantes
  const groups = getStatGroups(stats, build.classId, lang)
  for (const group of groups) {
    if (!group.stats) continue
    for (const stat of group.stats) {
      // HP e DET já foram adicionados explicitamente acima
      if (stat.key === 'maxHP' || stat.key === 'maxResolve') continue
      // Só mostra stats que foram alteradas pela build (value diferente do base)
      if (stat.value === stat.base) continue
      lines.push(`  ${stat.label}: ${fmtStatTxt(stat)}`)
    }
  }
```

### Resultado esperado no texto gerado

```
**Estatísticas:**
  HP: 100
  Determinação: 5
  Dano Corpo a Corpo: +25%
  Dano Atordoante C/C: +6%
  Janela de Aparo Perfeito: +12%
  Dano de Contra-Ataque: +15%
  Dano de Fogo: +10%
  Raio de Explosão: +16%
  Red. Recarga Habilidade: +6%
  Furtividade: +11pts
```

### Sobre manter ou remover o modo Estatístico

A feature funciona e é viável. O único bug era código incorreto, não limitação da ferramenta. **Recomendo manter os botões.** Com a correção acima, os `undefined` somem e os valores aparecem corretamente formatados.

---

## Resumo das 4 correções

| # | Localizar por | Ação |
|---|---|---|
| 1 | `function Tooltip({ text, children })` | Adiciona `wrapperStyle` na assinatura e no `<span style>` |
| 2a | `const TechRow = ({ tech, selected, onToggle, blocked })` | Adiciona `layoutMode: rowLayoutMode` |
| 2b | `return (` dentro de TechRow | Substitui wrapper por `<div>` + Tooltip com `wrapperStyle` condicional |
| 2c | `{techs.map(t => (<TechRow` | Envolve em `<div>` com grid em 2-col / flex-col em 3-col |
| 3 | `{/* Grupo 2: Contador de magistrais` | Padding maior, stars maiores, texto completo |
| 4 | `const groups = getStatGroups(stats, lang)` | Adiciona `build.classId`, remove `stat.formatted`, corrige filtro |

---

---

# Fase 3 — Geração de Imagem via Canvas API

## Resposta sobre ícones nas vantagens de classe

Sim, **incluo os ícones das vantagens de classe** (técnicas I, II, III) na imagem. O planejamento anterior não os mencionou explicitamente mas eles sempre estiveram no escopo — são acessados via `getTechIconUrl(techId, classId)`, exatamente como nas colunas da UI.

## Ícones incluídos na imagem

| Elemento | Ícone | Origem |
|---|---|---|
| Classe no header | SVG de classe | `CLASS_ICON[classId]` |
| Habilidade suprema | PNG supremo | `CLASS_TECH_FALLBACK[classId]` |
| Habilidade de classe | PNG da habilidade | `getTechIconUrl(abilityId, classId)` |
| Vantagem I/II/III | PNG da vantagem | `getTechIconUrl(techId, classId)` |
| Katana / Longo Alcance / Amuleto / GW1 / GW2 | SVG do item | `getGearIconUrl(item)` |

## Layout da imagem por modo

```
┌──────────────────────────────────────────────────────────────────────┐
│ [icon_classe 28px]  NOME DA BUILD            [icon_supremo 48px]    │  ← Header
│                     (Classe)                  Nome Supremo          │
├─────────────────────────────────┬────────────────────────────────────┤
│  HABILIDADE & VANTAGENS         │  EQUIPAMENTOS                      │
│  [icon] Habilidade [Xs]         │  [icon] Katana: Nome ★             │
│  [icon] Vantagem I              │    • Prop I: +15%                  │
│  [icon] Vantagem II             │    • Prop II: +12%                 │
│  [icon] Vantagem III            │    • Perk I                        │
│                                 │    • Perk II                       │
│                                 │  [icon] Longo Alcance: Nome        │
│                                 │    • ...                           │
│                                 │  ... (outros slots)                │
├─────────────────────────────────┴────────────────────────────────────┤
│  (somente modo 'stats')                                              │
│  ESTATÍSTICAS                                                        │
│  HP: 100   Determinação: 5   Dano C/C: +25%   Furtividade: +11pts   │
└──────────────────────────────────────────────────────────────────────┘
```

## Código completo da Fase 3

Adicione **imediatamente antes** da função `ExportPanel` (busque `// ─── ExportPanel`):

```jsx
// ─── Gerador de imagem via Canvas API ────────────────────────────────
// Sem dependências externas. Gera um PNG e dispara download automático.
//
// CONSTANTES DE LAYOUT DA IMAGEM — ajuste aqui para personalizar:
const IMG_W          = 900   // largura total em px
const IMG_PAD        = 28    // padding interno (todos os lados)
const IMG_COL_SPLIT  = 0.42  // % da largura para a coluna esquerda (0.42 = 42%)
const IMG_HEADER_H   = 72    // altura do header em px
const IMG_ICON_SMALL = 18    // tamanho dos ícones de linha (habilidade, gear)
const IMG_ICON_ULT   = 48    // tamanho do ícone supremo no header
const IMG_FONT       = 'system-ui, -apple-system, sans-serif'

// Paleta de cores por tema (copiada de T, mas estática para o canvas)
function getCanvasPalette() {
  return {
    bg:     T.bg,
    panel:  T.panel,
    card:   T.card,
    border: T.border,
    text:   T.text,
    muted:  T.muted,
    dim:    T.dim,
    accent: T.accent,
    leg:    T.leg,
    green:  T.green,
    red:    T.red,
    cls:    { ...T.cls },
  }
}

// Carrega uma imagem (PNG ou SVG) e retorna HTMLImageElement
// Retorna null silenciosamente se falhar (ícone ausente não quebra o canvas)
function loadImg(src) {
  if (!src) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)   // falhou → null, continua sem o ícone
    img.src = src
  })
}

// Desenha um ícone centralizado verticalmente numa linha de texto
function drawIcon(ctx, img, x, y, size) {
  if (!img) return
  ctx.drawImage(img, x, y - size / 2, size, size)
}

// Desenha texto com wrapping opcional, retorna a altura ocupada
function drawText(ctx, text, x, y, maxW, opts = {}) {
  const { fontSize = 13, color = '#dde0ef', fontWeight = 'normal', lineH = 18 } = opts
  ctx.font = `${fontWeight} ${fontSize}px ${IMG_FONT}`
  ctx.fillStyle = color
  // Mede se cabe em uma linha
  if (ctx.measureText(text).width <= maxW) {
    ctx.fillText(text, x, y)
    return lineH
  }
  // Quebra por palavras
  const words = text.split(' ')
  let line = ''
  let dy = 0
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + dy)
      dy += lineH
      line = w
    } else {
      line = test
    }
  }
  if (line) { ctx.fillText(line, x, y + dy); dy += lineH }
  return dy
}

// Linha divisória
function drawDivider(ctx, x1, y, x2, color) {
  ctx.strokeStyle = color
  ctx.lineWidth   = 1
  ctx.globalAlpha = 0.3
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke()
  ctx.globalAlpha = 1
}

// Retorna todos os ícones necessários para o build como { key: Promise<img> }
async function loadBuildIcons(build, mode) {
  const cls    = getClass(build.classId)
  const loads  = {}

  // Classe
  loads['cls']     = loadImg(CLASS_ICON[build.classId])
  // Supremo
  loads['supreme'] = loadImg(CLASS_TECH_FALLBACK[build.classId])
  // Habilidade de classe
  if (build.abilityId) loads['ability'] = loadImg(getTechIconUrl(build.abilityId, build.classId))
  // Técnicas I, II, III
  for (const tier of ['I','II','III']) {
    if (build.techs?.[tier]) {
      loads[`tech_${tier}`] = loadImg(getTechIconUrl(build.techs[tier], build.classId))
    }
  }
  // Gear
  for (const slot of ['katana','ranged','charm','gw1','gw2']) {
    const slotState = build.gear?.[slot]
    if (slotState?.itemId) {
      const item = getItem(slotState.itemId)
      if (item) loads[`gear_${slot}`] = loadImg(getGearIconUrl(item))
    }
  }

  // Resolve todas as promises em paralelo
  const keys    = Object.keys(loads)
  const results = await Promise.all(keys.map(k => loads[k]))
  const icons   = {}
  keys.forEach((k, i) => { icons[k] = results[i] })
  return icons
}

// Função principal — gera e baixa a imagem
async function generateBuildImage({ build, stats, lang, buildName, mode }) {
  const L   = lang === 'en'
  const cls = getClass(build.classId)
  if (!cls) return

  const P   = getCanvasPalette()
  const CLS = P.cls[build.classId]

  // Determina altura total dinamicamente
  // (calculada de forma conservadora; o canvas pode ficar maior que o conteúdo)
  const withStats = mode === 'stats'
  const IMG_H = withStats ? 820 : 560

  // ── Criar canvas ────────────────────────────────────────────
  const canvas = document.createElement('canvas')
  canvas.width  = IMG_W
  canvas.height = IMG_H
  const ctx = canvas.getContext('2d')

  // ── Carregar ícones ─────────────────────────────────────────
  const icons = await loadBuildIcons(build, mode)

  // ── Helpers de coordenadas ──────────────────────────────────
  const PAD    = IMG_PAD
  const colX   = Math.round(IMG_W * IMG_COL_SPLIT)  // x onde começa coluna direita
  const leftW  = colX - PAD * 2                     // largura útil col esquerda
  const rightW = IMG_W - colX - PAD                 // largura útil col direita

  // ── Fundo ───────────────────────────────────────────────────
  ctx.fillStyle = P.bg
  ctx.fillRect(0, 0, IMG_W, IMG_H)

  // ── Header ──────────────────────────────────────────────────
  // Fundo do header com cor da classe
  ctx.fillStyle = CLS + '22'
  ctx.fillRect(0, 0, IMG_W, IMG_HEADER_H)
  // Borda inferior do header
  ctx.fillStyle = CLS + '55'
  ctx.fillRect(0, IMG_HEADER_H - 1, IMG_W, 1)

  // Ícone da classe (esquerda)
  drawIcon(ctx, icons.cls, PAD, IMG_HEADER_H / 2, 28)

  // Nome da build + classe (centro)
  const clsName   = L ? (cls.nEN || cls.nPT) : cls.nPT
  const titleName = buildName?.trim()
  const title     = titleName ? `${titleName}` : clsName
  const subtitle  = titleName ? clsName : ''

  ctx.font      = `800 18px ${IMG_FONT}`
  ctx.fillStyle = P.text
  ctx.textAlign = 'center'
  ctx.fillText(title, IMG_W / 2, IMG_HEADER_H / 2 - (subtitle ? 8 : 0))

  if (subtitle) {
    ctx.font      = `500 12px ${IMG_FONT}`
    ctx.fillStyle = CLS
    ctx.fillText(`(${subtitle})`, IMG_W / 2, IMG_HEADER_H / 2 + 12)
  }
  ctx.textAlign = 'left'

  // Ícone supremo (direita do header)
  if (icons.supreme) {
    const sx = IMG_W - PAD - IMG_ICON_ULT
    const sy = (IMG_HEADER_H - IMG_ICON_ULT) / 2
    ctx.drawImage(icons.supreme, sx, sy, IMG_ICON_ULT, IMG_ICON_ULT)
    // Nome da habilidade suprema abaixo do ícone (pequeno)
    if (stats?.ultimate) {
      const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
      ctx.font      = `600 10px ${IMG_FONT}`
      ctx.fillStyle = CLS
      ctx.textAlign = 'center'
      ctx.fillText(uName, sx + IMG_ICON_ULT / 2, sy + IMG_ICON_ULT + 12)
      ctx.textAlign = 'left'
    }
  }

  // ── Corpo: duas colunas ─────────────────────────────────────
  let leftY  = IMG_HEADER_H + PAD
  let rightY = IMG_HEADER_H + PAD

  // ── COLUNA ESQUERDA: Habilidade + Vantagens ─────────────────

  // Título da seção
  ctx.font      = `700 10px ${IMG_FONT}`
  ctx.fillStyle = P.muted
  ctx.fillText(L ? 'CLASS ABILITY & PERKS' : 'HABILIDADE & VANTAGENS', PAD, leftY)
  leftY += 16
  drawDivider(ctx, PAD, leftY, colX - PAD, P.border)
  leftY += 8

  // Habilidade de classe
  const abilityDef = cls.abilities.find(a => a.id === build.abilityId)
  if (abilityDef) {
    const aName = L ? (abilityDef.nEN || abilityDef.nPT) : abilityDef.nPT
    const aCd   = stats?.abilityCooldown?.finalCd ?? abilityDef.cd

    drawIcon(ctx, icons.ability, PAD, leftY + IMG_ICON_SMALL / 2, IMG_ICON_SMALL)
    ctx.font      = `700 13px ${IMG_FONT}`
    ctx.fillStyle = CLS
    ctx.fillText(aName, PAD + IMG_ICON_SMALL + 6, leftY)

    ctx.font      = `400 11px ${IMG_FONT}`
    ctx.fillStyle = P.muted
    ctx.fillText(`[${aCd}s]`, PAD + IMG_ICON_SMALL + 6 + ctx.measureText(aName).width + 6, leftY)

    // Descrição (somente detailed e stats)
    if (mode !== 'build' && abilityDef.dPT) {
      const desc = L ? (abilityDef.dEN || abilityDef.dPT) : abilityDef.dPT
      leftY += 18
      ctx.font      = `400 10px ${IMG_FONT}`
      ctx.fillStyle = P.muted
      const dh = drawText(ctx, desc, PAD + IMG_ICON_SMALL + 6, leftY, leftW - IMG_ICON_SMALL - 6, { fontSize: 10, color: P.muted, lineH: 14 })
      leftY += dh
    } else {
      leftY += 20
    }
  }

  leftY += 6

  // Vantagens I, II, III
  const tierIcons = { I: icons.tech_I, II: icons.tech_II, III: icons.tech_III }
  const tierNums  = { I: 'I', II: 'II', III: 'III' }
  for (const tier of ['I','II','III']) {
    const techId = build.techs?.[tier]
    if (!techId) continue
    const techDef = cls.techs.find(t => t.id === techId)
    if (!techDef) continue

    const tName = L ? (techDef.nEN || techDef.nPT) : techDef.nPT
    const tDesc = L ? (techDef.dEN || techDef.dPT) : techDef.dPT
    const label = L ? `Perk ${tier}` : `Vantagem ${tier}`

    // Label do tier (pequeno)
    ctx.font      = `600 9px ${IMG_FONT}`
    ctx.fillStyle = P.muted
    ctx.fillText(label, PAD, leftY)
    leftY += 13

    // Ícone + nome
    drawIcon(ctx, tierIcons[tier], PAD, leftY + IMG_ICON_SMALL / 2, IMG_ICON_SMALL)
    ctx.font      = `600 12px ${IMG_FONT}`
    ctx.fillStyle = P.text
    ctx.fillText(tName, PAD + IMG_ICON_SMALL + 6, leftY)
    leftY += 16

    // Descrição
    if (mode !== 'build' && tDesc) {
      ctx.font      = `400 10px ${IMG_FONT}`
      ctx.fillStyle = P.muted
      const dh = drawText(ctx, tDesc, PAD + IMG_ICON_SMALL + 6, leftY, leftW - IMG_ICON_SMALL - 6, { fontSize: 10, color: P.muted, lineH: 14 })
      leftY += dh + 4
    } else {
      leftY += 4
    }
  }

  // ── COLUNA DIREITA: Equipamentos ────────────────────────────
  const slotLabels = {
    katana: L ? 'Katana' : 'Katana',
    ranged: L ? 'Ranged Weapon' : 'Longo Alcance',
    charm:  L ? 'Charm' : 'Amuleto',
    gw1:    L ? 'Ghost Weapon I' : 'Arma Fantasma I',
    gw2:    L ? 'Ghost Weapon II' : 'Arma Fantasma II',
  }

  ctx.font      = `700 10px ${IMG_FONT}`
  ctx.fillStyle = P.muted
  ctx.fillText(L ? 'GEAR' : 'EQUIPAMENTOS', colX + PAD, rightY)
  rightY += 16
  drawDivider(ctx, colX + PAD, rightY, IMG_W - PAD, P.border)
  rightY += 8

  for (const slot of ['katana','ranged','charm','gw1','gw2']) {
    const slotState = build.gear?.[slot]
    if (!slotState?.itemId) continue
    const item = getItem(slotState.itemId)
    if (!item) continue

    const iName  = L ? (item.nEN || item.nPT) : item.nPT
    const isLeg  = !!item.leg
    const gIcon  = icons[`gear_${slot}`]
    const slotLb = slotLabels[slot]

    // Slot label (pequeno)
    ctx.font      = `600 9px ${IMG_FONT}`
    ctx.fillStyle = P.muted
    ctx.fillText(slotLb, colX + PAD, rightY)
    rightY += 13

    // Ícone + nome do item
    drawIcon(ctx, gIcon, colX + PAD, rightY + IMG_ICON_SMALL / 2, IMG_ICON_SMALL)
    ctx.font      = `700 13px ${IMG_FONT}`
    ctx.fillStyle = isLeg ? P.leg : P.text
    ctx.fillText(iName + (isLeg ? ' ★' : ''), colX + PAD + IMG_ICON_SMALL + 6, rightY)
    rightY += 18

    // GW cooldown
    if ((slot === 'gw1' && stats?.gw1?.finalCd) || (slot === 'gw2' && stats?.gw2?.finalCd)) {
      const cd  = slot === 'gw1' ? stats.gw1.finalCd : stats.gw2.finalCd
      ctx.font      = `400 10px ${IMG_FONT}`
      ctx.fillStyle = P.muted
      ctx.fillText(`[${cd}s]`, colX + PAD + IMG_ICON_SMALL + 6, rightY)
      rightY += 14
    }

    // Descrição magistral
    if (mode !== 'build' && isLeg && item.xp) {
      const xpText = L ? (item.xp.en || item.xp.pt) : item.xp.pt
      if (xpText) {
        ctx.font      = `400 italic 10px ${IMG_FONT}`
        ctx.fillStyle = P.leg
        const dh = drawText(ctx, xpText, colX + PAD + 8, rightY, rightW - 8, { fontSize: 10, color: P.leg, lineH: 14 })
        rightY += dh + 2
      }
    }

    // Propriedades
    for (const ps of ['p1','p2']) {
      const pState = slotState[ps]
      if (!pState?.propId) continue
      const propDef = item.props?.find(p => p.id === pState.propId)
      if (!propDef) continue
      const pName = L ? (propDef.nEN || propDef.nPT) : propDef.nPT
      const pVal  = formatStatValue ? formatStatValue(pState.value, propDef.u) : pState.value
      ctx.font      = `400 11px ${IMG_FONT}`
      ctx.fillStyle = P.muted
      ctx.fillText(`• ${pName}: ${pVal}`, colX + PAD + 8, rightY)
      rightY += 15

      // Descrição da prop (detailed/stats)
      if (mode !== 'build' && propDef.dPT) {
        const pd = L ? (propDef.dEN || propDef.dPT) : propDef.dPT
        ctx.font      = `400 10px ${IMG_FONT}`
        ctx.fillStyle = P.dim
        const dh = drawText(ctx, pd, colX + PAD + 16, rightY, rightW - 16, { fontSize: 10, color: P.dim, lineH: 13 })
        rightY += dh + 1
      }
    }

    // Vantagens (perks)
    for (const pk of ['perk1','perk2']) {
      const perkId = slotState[pk]
      if (!perkId) continue
      const perkDef = item.perks?.find(p => p.id === perkId)
      if (!perkDef) continue
      const pkName = L ? (perkDef.nEN || perkDef.nPT) : perkDef.nPT
      ctx.font      = `400 11px ${IMG_FONT}`
      ctx.fillStyle = P.muted
      ctx.fillText(`• ${pkName}`, colX + PAD + 8, rightY)
      rightY += 15

      if (mode !== 'build' && perkDef.dPT) {
        const pd = L ? (perkDef.dEN || perkDef.dPT) : perkDef.dPT
        ctx.font      = `400 10px ${IMG_FONT}`
        ctx.fillStyle = P.dim
        const dh = drawText(ctx, pd, colX + PAD + 16, rightY, rightW - 16, { fontSize: 10, color: P.dim, lineH: 13 })
        rightY += dh + 1
      }
    }

    rightY += 8  // espaço entre slots
  }

  // ── Linha divisória entre corpo e estatísticas ───────────────
  const bodyBottom = Math.max(leftY, rightY) + PAD
  drawDivider(ctx, PAD, bodyBottom, IMG_W - PAD, P.border)

  // ── ESTATÍSTICAS (somente modo 'stats') ─────────────────────
  if (withStats && stats) {
    let statsY = bodyBottom + PAD

    ctx.font      = `700 10px ${IMG_FONT}`
    ctx.fillStyle = P.muted
    ctx.fillText(L ? 'STATISTICS' : 'ESTATÍSTICAS', PAD, statsY)
    statsY += 16

    const fmtStatTxt = (s) => {
      if (s.unit === '★') return '★'.repeat(s.value)
      if (s.unit === '%') return s.value > 0 ? `+${Math.round(s.value * 100)}%` : `${Math.round(s.value * 100)}%`
      if (s.unit === 'pts' || s.unit === 's') return s.value > 0 ? `+${s.value}${s.unit}` : `${s.value}${s.unit}`
      return String(s.value)
    }

    // HP e DET sempre
    const statItems = [
      { label: 'HP', value: String(stats.maxHP ?? 100) },
      { label: L ? 'Resolve' : 'Determinação', value: String(stats.maxResolve ?? 3) },
    ]

    const groups = getStatGroups(stats, build.classId, lang)
    for (const group of groups) {
      if (!group.stats) continue
      for (const s of group.stats) {
        if (s.key === 'maxHP' || s.key === 'maxResolve') continue
        if (s.value === s.base) continue
        statItems.push({ label: s.label, value: fmtStatTxt(s) })
      }
    }

    // Desenha em grid (3 colunas para aproveitar a largura)
    const statCols   = 3
    const statColW   = (IMG_W - PAD * 2) / statCols
    let   statCol    = 0

    for (const { label, value } of statItems) {
      const sx = PAD + statCol * statColW
      ctx.font      = `400 11px ${IMG_FONT}`
      ctx.fillStyle = P.muted
      ctx.fillText(label + ':', sx, statsY)

      ctx.font      = `700 11px ${IMG_FONT}`
      ctx.fillStyle = P.green
      ctx.fillText(value, sx + ctx.measureText(label + ': ').width + 2, statsY)

      statCol++
      if (statCol >= statCols) { statCol = 0; statsY += 18 }
    }
  }

  // ── Recalcular altura final e redesenhar fundo ───────────────
  // (o canvas pode ter sido gerado maior que o necessário — apenas ignoramos o espaço extra)

  // ── Assinatura discreta no rodapé ───────────────────────────
  const footerY = IMG_H - 10
  ctx.font      = `400 9px ${IMG_FONT}`
  ctx.fillStyle = P.dim
  ctx.textAlign = 'center'
  ctx.fillText('GoT Legends Build Planner • arlsnech', IMG_W / 2, footerY)
  ctx.textAlign = 'left'

  // ── Download ─────────────────────────────────────────────────
  const safeName = (buildName || 'build').replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()
  const a        = document.createElement('a')
  a.href         = canvas.toDataURL('image/png')
  a.download     = `${safeName}-${mode}.png`
  a.click()
}
```

## Conectar ao ExportPanel

**LOCALIZAR** em `ExportPanel`:
```jsx
  const handleGenImage = (mode) => { flash(`img-${mode}`) /* TODO Fase 3 */ }
```

**SUBSTITUIR POR:**
```jsx
  const handleGenImage = (mode) => {
    generateBuildImage({ build, stats, lang, buildName, mode })
      .then(() => flash(`img-${mode}`))
      .catch(err => {
        console.error('Canvas generation error:', err)
        flash(`img-${mode}`)
      })
  }
```

## Notas técnicas

**`formatStatValue`**: Na função `generateBuildImage`, usamos `formatStatValue ? formatStatValue(...) : pState.value`. Se essa função não estiver acessível no escopo global do App.jsx, substitua por:
```jsx
const pVal = pState.value > 0 ? `+${Math.round(pState.value * 100)}%` : pState.value
```
Ou adapte conforme a lógica de formatação de propriedades que você já tem.

**Ícones SVG no Canvas**: SVGs de equipamentos são carregados via `<img crossOrigin="anonymous">`. Se o servidor de desenvolvimento não servir os SVGs com headers CORS adequados, o `drawImage` lança `SecurityError`. Nesse caso, os ícones de gear ficam `null` (silencioso pelo `onError`) e o layout continua sem eles.

**Altura do canvas**: `IMG_H` é conservador (560 ou 820px). Se uma build tiver muitas propriedades com descrição longa, o conteúdo pode ultrapassar. Para builds típicas é suficiente. No futuro pode-se calcular dinamicamente.

---

*Guia atualizado — GoT Legends Build Planner*
