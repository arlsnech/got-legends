# GoT Legends Build Planner — Guia Completo de Correções + Fases 2 e 3

---

## Índice

1. [Diagnóstico de cada problema](#1-diagnóstico)
2. [CORREÇÃO 1 — Barra de HP](#correção-1--barra-de-hp)
3. [CORREÇÃO 2 — Largura da coluna de técnicas (3 colunas)](#correção-2--largura-da-coluna-de-técnicas)
4. [CORREÇÃO 3 — Como localizar e ajustar larguras de coluna sozinho](#correção-3--como-localizar-larguras-de-coluna)
5. [CORREÇÃO 4 — Técnicas lado a lado em 3 colunas (bug do Tooltip inline)](#correção-4--técnicas-lado-a-lado-em-3-colunas)
6. [CORREÇÃO 5 — Habilidades sem quebra de linha no modo 2 colunas](#correção-5--habilidades-sem-quebra-de-linha)
7. [CORREÇÃO 6 — Espaçamento entre HP/DET e contador de Magistrais](#correção-6--espaçamento-entre-hpdet-e-magistrais)
8. [Fase 2 — Geração de Texto (Build / Detalhado / Estatístico)](#fase-2--geração-de-texto)
9. [Fase 3 — Geração de Imagem via Canvas API](#fase-3--geração-de-imagem)

---

## 1. Diagnóstico

| Problema relatado | Causa raiz identificada |
|---|---|
| Barra de HP com borda visível e "cheia" no base | `border: 1px solid T.dim` sempre renderizado; `basePct` começa em 80% (100/125) |
| Número de HP "bagunça" ao empilhar bônus | Container sem largura fixa — barra e número competem por espaço |
| Barra de HP pequena visualmente | `width: 80, height: 7` — pequenos demais |
| Técnicas ficam lado a lado no modo 3 colunas | `<Tooltip>` renderiza `<span display:inline-block>` — elementos inline-block fluem um do lado do outro |
| Habilidades com quebra de linha no modo 2 colunas | `gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))'` é muito estreito para textos longos |
| Coluna esquerda estreita (texto quebra) | `255px` fixo — pouco para nomes de vantagens longos |
| Contador de magistrais muito próximo do HP/DET | `gap: 10` no sub-header — sem separação visual real |

---

## CORREÇÃO 1 — Barra de HP

### O que muda

- A barra **não aparece** quando HP = 100 (base sem bônus)
- A barra **só cresce** quando há bônus acima de 100
- Container de **largura fixa** — o número nunca pula de posição
- Animação suave ao selecionar técnicas que aumentam HP

### Onde localizar

No `App.jsx`, busque pela string:

```
// ─── HpResolveBar — barra de HP e círculos de Determinação ──
```

É a função `HpResolveBar` que começa logo abaixo (linha ~116 no seu arquivo atual).

### ANTES (bloco completo a remover)

```jsx
// ─── HpResolveBar — barra de HP e círculos de Determinação ──
// Layout vertical: círculos acima, barra de HP abaixo (como no jogo)
// A barra de HP NÃO tem fundo escuro — só a porção preenchida é visível,
// exatamente como os círculos de determinação.
function HpResolveBar({ stats, lang }) {
  if (!stats) return null
  const hp      = stats.maxHP     ?? 100
  const resolve = stats.maxResolve ?? 3

  // ── HP ──────────────────────────────────────────────────────
  // Base 100 HP: porção vermelha
  // Bônus acima de 100 (ex: técnica Defensor): porção dourada
  // A barra SÓ renderiza o preenchimento — sem track escuro de fundo
  const MAX_HP   = 125   // 100 base + 25 máx possível
  const basePct  = (Math.min(hp, 100) / MAX_HP) * 100
  const bonusPct = (Math.max(0, hp - 100) / MAX_HP) * 100
  const hasBonus = hp > 100

  // ── DETERMINAÇÃO ────────────────────────────────────────────
  // Mostra SOMENTE os círculos ativos (sem vazio extra)
  // 1–3 = dourado (base), 4+ = verde (bônus de técnica)
  const BASE_RESOLVE  = 3
  const totalCircles  = resolve  // exatamente os que existem

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>

      {/* Linha 1 — Círculos de Determinação (acima) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          fontSize: 9, color: T.muted, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 24,
        }}>
          {lang === 'en' ? 'RES' : 'DET'}
        </span>
        {Array.from({ length: totalCircles }).map((_, i) => {
          const isBonus = i >= BASE_RESOLVE
          return (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: isBonus ? T.green : T.accent,
              border: `2px solid ${isBonus ? T.green : T.accent}cc`,
              boxShadow: `0 0 6px ${isBonus ? T.green : T.accent}99`,
              flexShrink: 0,
            }} />
          )
        })}
      </div>

      {/* Linha 2 — Barra de HP (abaixo) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          fontSize: 9, color: T.muted, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 24,
        }}>
          HP
        </span>

        {/* Barra sem fundo — só o preenchimento */}
        <div style={{
          width: 80, height: 7,
          borderRadius: 4, overflow: 'visible',
          display: 'flex', position: 'relative',
          // Borda sutil para delimitar o espaço mesmo quando HP = 100 base
          border: `1px solid ${T.dim}`,
        }}>
          {/* Porção vermelha (HP base até 100) */}
          <div style={{
            width: `${basePct}%`, height: '100%',
            background: 'linear-gradient(90deg, #901818, #c0392b)',
            borderRadius: bonusPct > 0 ? '3px 0 0 3px' : 3,
            flexShrink: 0,
            transition: 'width 0.3s ease',
          }} />
          {/* Porção dourada (HP bônus acima de 100) */}
          {bonusPct > 0 && (
            <div style={{
              width: `${bonusPct}%`, height: '100%',
              background: `linear-gradient(90deg, ${T.leg}, ${T.accent})`,
              borderRadius: '0 3px 3px 0',
              flexShrink: 0,
              transition: 'width 0.3s ease',
            }} />
          )}
        </div>

        {/* Valor numérico de HP */}
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: hasBonus ? T.leg : T.text,
          minWidth: 28,
        }}>
          {hp}
        </span>
      </div>
    </div>
  )
}
```

### DEPOIS (substituir pelo bloco abaixo)

```jsx
// ─── HpResolveBar — barra de HP e círculos de Determinação ──
// Layout vertical: círculos acima, barra de HP abaixo (como no jogo)
//
// DESIGN:
//   • Determinação: mostra SOMENTE os círculos existentes (3 base + extras)
//   • HP: barra invisível em HP base (100). Só aparece e cresce quando
//     alguma técnica/vantagem aumenta o HP acima de 100.
//   • A barra tem largura FIXA (HP_BAR_WIDTH). O número fica sempre
//     logo à direita — nunca pula de posição.
//
// Para ajustar o tamanho só da barra de HP (independente dos círculos),
// altere HP_BAR_WIDTH (largura em px) e HP_BAR_HEIGHT (altura em px).
// Os círculos de DET têm seus próprios controles DET_CIRCLE_SIZE.

const HP_BAR_WIDTH   = 110  // px — largura total da barra de HP
const HP_BAR_HEIGHT  = 9    // px — altura da barra de HP
const DET_CIRCLE_SIZE = 12  // px — diâmetro dos círculos de Determinação

function HpResolveBar({ stats, lang }) {
  if (!stats) return null

  const hp      = stats.maxHP     ?? 100
  const resolve = stats.maxResolve ?? 3

  // ── HP — representa SOMENTE o bônus acima da base ───────────
  // Bônus máx possível = 25 (técnica Defensor nível máx)
  const BASE_HP_VAL = 100
  const MAX_BONUS   = 25
  const hpBonus     = Math.max(0, hp - BASE_HP_VAL)
  const bonusPct    = Math.min(100, (hpBonus / MAX_BONUS) * 100)
  const hasBonus    = hpBonus > 0

  // ── DETERMINAÇÃO — mostra SOMENTE os círculos ativos ────────
  // 1–3 = dourado (base), 4+ = verde (bônus de técnica)
  const BASE_RESOLVE_VAL = 3
  const totalCircles = resolve

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>

      {/* ── Linha 1: Círculos de Determinação (acima) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          fontSize: 9, color: T.muted, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          minWidth: 24, flexShrink: 0,
        }}>
          {lang === 'en' ? 'RES' : 'DET'}
        </span>
        {Array.from({ length: totalCircles }).map((_, i) => {
          const isBonus = i >= BASE_RESOLVE_VAL
          return (
            <div key={i} style={{
              width:  DET_CIRCLE_SIZE,
              height: DET_CIRCLE_SIZE,
              borderRadius: '50%',
              background:  isBonus ? T.green  : T.accent,
              border:      `2px solid ${isBonus ? T.green : T.accent}cc`,
              boxShadow:   `0 0 6px ${isBonus ? T.green : T.accent}99`,
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }} />
          )
        })}
      </div>

      {/* ── Linha 2: Barra de HP (abaixo) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          fontSize: 9, color: T.muted, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          minWidth: 24, flexShrink: 0,
        }}>
          HP
        </span>

        {/*
          Container de largura FIXA (HP_BAR_WIDTH).
          Quando não há bônus: sem borda, sem fill — invisível.
          Quando há bônus: borda dourada aparece e barra cresce da esquerda.
          O número à direita nunca muda de posição.
        */}
        <div style={{
          width:        HP_BAR_WIDTH,
          height:       HP_BAR_HEIGHT,
          borderRadius: HP_BAR_HEIGHT / 2,
          overflow:     'hidden',
          flexShrink:   0,
          // Borda só aparece quando há bônus de HP
          border:       hasBonus
            ? `1px solid ${T.leg}55`
            : '1px solid transparent',
          background:   'transparent',
          transition:   'border-color 0.3s ease',
        }}>
          {/* Preenchimento — só existe quando há bônus */}
          {hasBonus && (
            <div style={{
              width:        `${bonusPct}%`,
              height:       '100%',
              background:   `linear-gradient(90deg, #c0392b, ${T.accent})`,
              borderRadius: HP_BAR_HEIGHT / 2,
              transition:   'width 0.35s ease',
            }} />
          )}
        </div>

        {/* Valor numérico — sempre visível, cor dourada quando há bônus */}
        <span style={{
          fontSize:   11,
          fontWeight: 700,
          color:      hasBonus ? T.leg : T.muted,
          flexShrink: 0,
          transition: 'color 0.2s ease',
        }}>
          {hp}
        </span>
      </div>
    </div>
  )
}
```

> **Como ajustar tamanhos depois sozinho:**
> As três constantes estão logo acima da função, fáceis de encontrar:
> - `HP_BAR_WIDTH = 110` → largura da barra (experimente 90–150)
> - `HP_BAR_HEIGHT = 9` → altura/espessura (experimente 7–14)
> - `DET_CIRCLE_SIZE = 12` → diâmetro dos círculos (experimente 10–16)
> 
> São **completamente independentes** — mudar um não afeta o outro.

---

## CORREÇÃO 2 — Largura da coluna de técnicas

### Onde localizar

No `return` do `App`, busque por:

```
{/* ══ ÁREA DE 3/2 COLUNAS ══════════════════════════════════ */}
```

Logo abaixo há o `gridTemplateColumns`:

```jsx
<div style={{
  flex: 1,
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: layoutMode === 'three-col'
    ? '255px 1fr 340px'   // ← AQUI: largura da col esquerda e direita
    : '1fr 360px',
  gap: 0,
}}>
```

### ANTES

```jsx
  gridTemplateColumns: layoutMode === 'three-col'
    ? '255px 1fr 340px'
    : '1fr 360px',
```

### DEPOIS

```jsx
  gridTemplateColumns: layoutMode === 'three-col'
    ? '300px 1fr 340px'   // 300px: col técnicas | 1fr: col equipamentos | 340px: col stats
    : '1fr 360px',
```

> **Para ajustar larguras depois sozinho:**
> Os números no `gridTemplateColumns` controlam diretamente as colunas:
> - **Primeiro valor** (`300px`) → largura da coluna de técnicas/habilidades (col esquerda)
> - **Segundo valor** (`1fr`) → coluna central de equipamentos (ocupa o espaço restante, não mude)
> - **Terceiro valor** (`340px`) → largura da coluna de estatísticas (col direita)
> 
> Regra prática: se nomes ainda quebrarem, aumente o primeiro valor de 10 em 10 até ficar bom.

---

## CORREÇÃO 3 — Como localizar larguras de coluna

Para referência futura rápida, as larguras estão em **uma única linha** no `return` do `App`:

```
gridTemplateColumns: layoutMode === 'three-col'
  ? '300px 1fr 340px'
  : '1fr 360px',
```

Para encontrá-la rapidamente no VS Code:
1. `Ctrl + F` (buscar no arquivo)
2. Pesquise: `gridTemplateColumns`
3. O resultado relevante estará dentro do bloco com comentário `ÁREA DE 3/2 COLUNAS`

---

## CORREÇÃO 4 — Técnicas lado a lado em 3 colunas

### Diagnóstico técnico

O componente `Tooltip` renderiza um `<span style={{ display: 'inline-block' }}>` ao redor de seus filhos. Elementos `inline-block` fluem horizontalmente — por isso botões de técnica com nomes curtos acabam ficando lado a lado.

**Solução:** envolver cada `TechRow` em um `<div>` de nível de bloco, forçando quebra de linha entre cada técnica.

### Onde localizar

Dentro de `TechniquesPanel`, localize o componente `TechRow`. O trecho atual é:

```jsx
const TechRow = ({ tech, selected, onToggle, blocked }) => {
  ...
  return (
    <Tooltip text={...}>
      <button
        onClick={onToggle}
        style={{
          display: 'block', width: '100%', textAlign: 'left',
          ...
          marginBottom: 4,
          ...
        }}>
```

### ANTES (trecho do return do TechRow)

```jsx
    return (
      <Tooltip text={isBlocked
        ? (lang === 'en' ? 'Unequip a Legendary item first' : 'Desequipe um item Magistral primeiro')
        : desc}>
        <button
          onClick={onToggle}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            background: isAct ? T.cls[build.classId] + '25' : 'transparent',
            border: `1px solid ${isAct ? T.cls[build.classId] : T.border}`,
            borderRadius: 7, padding: '7px 10px', marginBottom: 4,
            cursor: isBlocked ? 'not-allowed' : 'pointer', color: T.text,
            transition: 'all 0.15s',
          }}>
```

### DEPOIS

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

**E o fechamento do TechRow muda de:**
```jsx
        </button>
      </Tooltip>
    )
```
**Para:**
```jsx
          </button>
        </Tooltip>
      </div>
    )
```

---

## CORREÇÃO 5 — Habilidades sem quebra de linha no modo 2 colunas

### Onde localizar

Dentro de `TechniquesPanel`, após a linha `<SectionTitle>{tierLabel.ability}</SectionTitle>`, está o grid das abilities:

```jsx
<div style={layoutMode === 'two-col' ? {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
  ...
} : {}}>
{cls.abilities.map(a => {
  ...
  return (
    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, ... }}>
      <button ...>
        ...
        <Tooltip text={lang === 'en' ? (a.dEN || a.dPT) : a.dPT}>
          <span style={{ fontSize: 12, fontWeight: isAct ? 700 : 400 }}>
            {lang === 'en' ? (a.nEN || a.nPT) : a.nPT}
            <span style={{ fontSize: 10, color: T.muted, marginLeft: 6 }}>{a.cd}s</span>
          </span>
        </Tooltip>
```

### ANTES (bloco completo do grid das abilities)

```jsx
      <div style={layoutMode === 'two-col' ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 4,
        marginBottom: 4,
      } : {}}>
      {cls.abilities.map(a => {
        const isAct    = build.abilityId === a.id
        const iconUrl  = getTechIconUrl(a.id, build.classId)
        return (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: layoutMode === 'two-col' ? 0 : 4,
          }}>
            <button
              onClick={() => handleAbility(a.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, flex: 1,
                textAlign: 'left', padding: '7px 10px',
                background: isAct ? T.cls[build.classId] + '25' : 'transparent',
                border: `1px solid ${isAct ? T.cls[build.classId] : T.border}`,
                borderRadius: 7, cursor: 'pointer', color: T.text,
              }}>
              {/* Ícone da habilidade PNG (sem filtro) */}
              {iconUrl ? (
                <img src={iconUrl} width={18} height={18}
                  style={{
                    flexShrink: 0, objectFit: 'contain',
                    opacity: isAct ? 1 : 0.38,
                  }}
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'inline-block'
                  }}
                  alt=""
                />
              ) : null}
              <span style={{
                display: 'none',
                width: 12, height: 12, borderRadius: '50%', border: '2px solid',
                borderColor: isAct ? T.cls[build.classId] : T.dim,
                background: isAct ? T.cls[build.classId] : 'transparent',
                flexShrink: 0,
              }} />
              <Tooltip text={lang === 'en' ? (a.dEN || a.dPT) : a.dPT}>
                <span style={{ fontSize: 12, fontWeight: isAct ? 700 : 400 }}>
                  {lang === 'en' ? (a.nEN || a.nPT) : a.nPT}
                  <span style={{ fontSize: 10, color: T.muted, marginLeft: 6 }}>{a.cd}s</span>
                </span>
              </Tooltip>
            </button>
          </div>
        )
      })}
      </div>  {/* fecha o grid/wrapper das abilities */}
```

### DEPOIS

```jsx
      {/*
        Grid de habilidades de classe:
        • three-col → empilhado (1 por linha, width:100%), sem grid
        • two-col   → lado a lado com colunas de tamanho fixo (minmax 160px)
                      para que nomes longos não quebrem linha
      */}
      <div style={layoutMode === 'two-col' ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 4,
        marginBottom: 4,
      } : {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        marginBottom: 4,
      }}>
      {cls.abilities.map(a => {
        const isAct   = build.abilityId === a.id
        const iconUrl = getTechIconUrl(a.id, build.classId)
        return (
          <button
            key={a.id}
            onClick={() => handleAbility(a.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', textAlign: 'left', padding: '7px 10px',
              background: isAct ? T.cls[build.classId] + '25' : 'transparent',
              border: `1px solid ${isAct ? T.cls[build.classId] : T.border}`,
              borderRadius: 7, cursor: 'pointer', color: T.text,
              minWidth: 0,  // permite flex-shrink funcionar corretamente
            }}>
            {/* Ícone da habilidade PNG */}
            {iconUrl ? (
              <img src={iconUrl} width={18} height={18}
                style={{ flexShrink: 0, objectFit: 'contain', opacity: isAct ? 1 : 0.38 }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'inline-block'
                }}
                alt=""
              />
            ) : null}
            {/* Bolinha fallback */}
            <span style={{
              display: 'none',
              width: 12, height: 12, borderRadius: '50%', border: '2px solid',
              borderColor: isAct ? T.cls[build.classId] : T.dim,
              background: isAct ? T.cls[build.classId] : 'transparent',
              flexShrink: 0,
            }} />
            {/*
              whiteSpace: 'nowrap' garante que o nome não quebra linha.
              O Tooltip só aparece no hover, então não ocupa espaço visual.
              overflow: 'hidden' + textOverflow: 'ellipsis' garante que
              nomes muito longos são cortados com "..." em vez de quebrar.
            */}
            <Tooltip text={lang === 'en' ? (a.dEN || a.dPT) : a.dPT}>
              <span style={{
                fontSize: 12, fontWeight: isAct ? 700 : 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              }}>
                {lang === 'en' ? (a.nEN || a.nPT) : a.nPT}
                <span style={{ fontSize: 10, color: T.muted, marginLeft: 6 }}>{a.cd}s</span>
              </span>
            </Tooltip>
          </button>
        )
      })}
      </div>
```

> **Nota:** removi o `<div>` wrapper extra dentro do map — o `<button>` em si já é o elemento do grid/flex, mais limpo e sem o div redundante.

---

## CORREÇÃO 6 — Espaçamento entre HP/DET e Magistrais

### Onde localizar

No `return` do App, busque por:

```
{/* ══ SUB-HEADER: HP+Resolve | Magistrais | Export ══ */}
```

### ANTES (bloco do sub-header)

```jsx
      {/* ══ SUB-HEADER: HP+Resolve | Magistrais | Export ══ */}
      <div style={{
        flexShrink: 0,
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        padding: '4px 16px 4px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        minHeight: 46,
      }}>

        {/* HP + Determinação (layout vertical, como no jogo) */}
        <HpResolveBar stats={stats} lang={lang} />

        <div style={{ width: 1, height: 24, background: T.border, flexShrink: 0 }} />

        {/* Contador de magistrais */}
        <div style={{ flexShrink: 0, fontSize: 11, color: T.muted }}>
          <span style={{ letterSpacing: 1 }}>
            {'★'.repeat(legInfo.used)}{'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
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

        <div style={{ width: 1, height: 24, background: T.border, flexShrink: 0 }} />

        {/* Botões de exportação — empurrados para a direita */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <ExportPanel
            build={build}
            stats={stats}
            lang={lang}
            buildName={buildName}
            includeShareCode={includeShareCode}
          />
        </div>
      </div>
```

### DEPOIS

```jsx
      {/* ══ SUB-HEADER: HP+Resolve | Magistrais | Export ══ */}
      {/*
        Cada "grupo" (HP/DET, Magistrais, Botões) ocupa seu próprio espaço fixo.
        O HP/DET tem largura reservada pelo HP_BAR_WIDTH + constantes.
        O contador de magistrais não se move quando a barra de HP cresce.
        Os botões de export ficam sempre à direita.
      */}
      <div style={{
        flexShrink: 0,
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        padding: '5px 16px 5px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: 0,           // gap 0 — espaçamento controlado por padding/margin nos filhos
        flexWrap: 'nowrap',
        minHeight: 50,
      }}>

        {/* Grupo 1: HP + Determinação */}
        <div style={{ flexShrink: 0, paddingRight: 20 }}>
          <HpResolveBar stats={stats} lang={lang} />
        </div>

        {/* Separador visual */}
        <div style={{ width: 1, height: 28, background: T.border, flexShrink: 0 }} />

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

        {/* Separador visual */}
        <div style={{ width: 1, height: 28, background: T.border, flexShrink: 0 }} />

        {/* Grupo 3: Botões de exportação — ocupa o restante, alinhados à direita */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', paddingLeft: 14 }}>
          <ExportPanel
            build={build}
            stats={stats}
            lang={lang}
            buildName={buildName}
            includeShareCode={includeShareCode}
          />
        </div>
      </div>
```

---

## Resumo das 6 correções

| # | Localizar por (busca no arquivo) | O que muda |
|---|---|---|
| 1 | `// ─── HpResolveBar` | Barra sem borda base + constantes independentes |
| 2 | `gridTemplateColumns: layoutMode === 'three-col'` | `255px` → `300px` |
| 3 | (referência) | Como ajustar colunas sozinho |
| 4 | `const TechRow = ({ tech, selected` → `return (` | Envolve em `<div>` de bloco |
| 5 | `<div style={layoutMode === 'two-col' ? {` (abilities) | Grid maior + `whiteSpace: nowrap` |
| 6 | `{/* ══ SUB-HEADER: HP+Resolve` | `gap: 0` + padding independente por grupo |

---

---

# Fase 2 — Geração de Texto

## Recap do que cada botão produz

| Botão | Conteúdo | Idioma |
|---|---|---|
| 📋 Build | Resumo compacto sem descrições | Conforme `lang` atual |
| 📋 Detalhado | Build completa com descrições | Conforme `lang` atual |
| 📋 Estatístico | Detalhado + stats calculadas (só modificadas; HP e DET sempre) | Conforme `lang` atual |

## Estrutura do texto gerado

```
**[Nome da build — se tiver] (Classe)**

Habilidade de Classe: Nome [Xs recarga calculada]
  Descrição (somente no Detalhado e Estatístico)

Vantagem I: Nome
  Descrição (somente no Detalhado e Estatístico)
Vantagem II: Nome
  Descrição (somente no Detalhado e Estatístico)
Vantagem III: Nome
  Descrição (somente no Detalhado e Estatístico)

─────────────────────────────
Katana: Nome ★ (se magistral)
  • Propriedade I: Nome +XX% (descrição no Detalhado)
  • Propriedade II: Nome +XX% (descrição no Detalhado)
  • Vantagem I: Nome (descrição no Detalhado)
  • Vantagem II: Nome (descrição no Detalhado)

Longo Alcance: Nome ★ [Xs recarga]
  • ...

Amuleto: Nome ★
  • ...

Arma Fantasma I: Nome [Xs recarga calculada]
  • ...

Arma Fantasma II: Nome [Xs recarga calculada]
  • ...

─────────────────────────────
[Somente no Estatístico:]
Habilidade Suprema: Nome
  Descrição
  Golpes: X / Alvos: X / Custo: X Det.

ESTATÍSTICAS:
  HP: 115
  Dano CaC: +25%
  ... (somente stats modificadas; HP e DET sempre aparecem)

─────────────────────────────
[Se opção ativada nas configurações:]
Código: eyJ2ZXJzaW9uIjoi...
```

## Onde implementar (ExportPanel)

A função `handleCopyText(mode)` no `ExportPanel` é o único lugar a modificar. Atualmente tem apenas `flash()` como placeholder.

### Código completo da Fase 2

**Localizar em `ExportPanel`:**
```jsx
  const handleCopyText = (mode) => { flash(`txt-${mode}`) /* TODO Fase 2 */ }
```

**Substituir por:**

```jsx
  const handleCopyText = (mode) => {
    const text = generateBuildText({ build, stats, lang, buildName, mode, includeShareCode })
    navigator.clipboard.writeText(text)
      .then(() => flash(`txt-${mode}`))
      .catch(() => flash(`txt-${mode}`))  // copia mesmo se clipboard falhou silenciosamente
  }
```

### Nova função `generateBuildText` (adicionar em `App.jsx` antes do `ExportPanel`)

```jsx
// ─── Gerador de texto de exportação ─────────────────────────────
// mode: 'build' | 'detailed' | 'stats'
// Retorna uma string formatada em Markdown plain-text (funciona em Discord, Reddit, etc.)
function generateBuildText({ build, stats, lang, buildName, mode, includeShareCode }) {
  const L = lang === 'en'
  const cls = getClass(build.classId)
  if (!cls) return ''

  const clsName = L ? (cls.nEN || cls.nPT) : cls.nPT
  const withDesc = mode === 'detailed' || mode === 'stats'
  const withStats = mode === 'stats'
  const lines = []

  // ── Título ────────────────────────────────────────────────────
  const titleName = buildName?.trim()
  if (titleName) {
    lines.push(`**${titleName} (${clsName})**`)
  } else {
    lines.push(`**${clsName}**`)
  }
  lines.push('')

  // ── Habilidade de Classe ───────────────────────────────────────
  const abilityDef = cls.abilities.find(a => a.id === build.abilityId)
  if (abilityDef) {
    const aName = L ? (abilityDef.nEN || abilityDef.nPT) : abilityDef.nPT
    const aDesc = L ? (abilityDef.dEN || abilityDef.dPT) : abilityDef.dPT
    const aCd   = stats?.abilityCooldown?.finalCd ?? abilityDef.cd
    const cdLabel = L ? 'Class Ability' : 'Habilidade de Classe'
    lines.push(`${cdLabel}: **${aName}** [${aCd}s]`)
    if (withDesc && aDesc) lines.push(`  ${aDesc}`)
    lines.push('')
  }

  // ── Vantagens de Classe (Técnicas I, II, III) ─────────────────
  const tierKeys = ['I', 'II', 'III']
  for (const tier of tierKeys) {
    const techId = build.techs[tier]
    if (!techId) continue
    const techDef = cls.techs.find(t => t.id === techId)
    if (!techDef) continue
    const tName = L ? (techDef.nEN || techDef.nPT) : techDef.nPT
    const tDesc = L ? (techDef.dEN || techDef.dPT) : techDef.dPT
    const perkLabel = L ? `Perk ${tier}` : `Vantagem ${tier}`
    lines.push(`${perkLabel}: **${tName}**`)
    if (withDesc && tDesc) lines.push(`  ${tDesc}`)
  }
  lines.push('')
  lines.push('─────────────────────────')

  // ── Equipamentos ─────────────────────────────────────────────
  const slotLabels = {
    katana: L ? 'Katana' : 'Katana',
    ranged: L ? 'Ranged Weapon' : 'Longo Alcance',
    charm:  L ? 'Charm' : 'Amuleto',
    gw1:    L ? 'Ghost Weapon I' : 'Arma Fantasma I',
    gw2:    L ? 'Ghost Weapon II' : 'Arma Fantasma II',
  }

  for (const slotName of ['katana', 'ranged', 'charm', 'gw1', 'gw2']) {
    const slotState = build.gear[slotName]
    if (!slotState?.itemId) continue

    const item = getItem(slotState.itemId)
    if (!item) continue

    const itemName = L ? (item.nEN || item.nPT) : item.nPT
    const isLeg = !!item.leg
    const legMark = isLeg ? ' ★' : ''
    const slotLabel = slotLabels[slotName]

    // Recarga de GW
    let cdPart = ''
    if (slotName === 'gw1' && stats?.gw1Cooldown?.finalCd != null) {
      cdPart = ` [${stats.gw1Cooldown.finalCd}s]`
    } else if (slotName === 'gw2' && stats?.gw2Cooldown?.finalCd != null) {
      cdPart = ` [${stats.gw2Cooldown.finalCd}s]`
    }

    lines.push('')
    lines.push(`**${slotLabel}: ${itemName}${legMark}**${cdPart}`)

    // Descrição magistral (somente detalhado/stats)
    if (withDesc && isLeg && item.xp) {
      const xpText = L ? (item.xp.en || item.xp.pt) : item.xp.pt
      if (xpText) lines.push(`  _${xpText}_`)
    }

    // Propriedades
    for (const ps of ['p1', 'p2']) {
      const pState = slotState[ps]
      if (!pState?.propId) continue
      const propDef = item.props.find(p => p.id === pState.propId)
      if (!propDef) continue
      const pName = L ? (propDef.nEN || propDef.nPT) : propDef.nPT
      const pVal  = formatStatValue(pState.value, propDef.u)
      const pDesc = withDesc ? (L ? (propDef.dEN || propDef.dPT) : propDef.dPT) : null
      lines.push(`  • ${pName}: ${pVal}${pDesc ? ` — ${pDesc}` : ''}`)
    }

    // Vantagens
    for (const pk of ['perk1', 'perk2']) {
      const perkId = slotState[pk]
      if (!perkId) continue
      const perkDef = item.perks.find(p => p.id === perkId)
      if (!perkDef) continue
      const pkName = L ? (perkDef.nEN || perkDef.nPT) : perkDef.nPT
      const pkDesc = withDesc ? (L ? (perkDef.dEN || perkDef.dPT) : perkDef.dPT) : null
      lines.push(`  • ${pkName}${pkDesc ? ` — ${pkDesc}` : ''}`)
    }
  }

  // ── Estatísticas (somente modo 'stats') ────────────────────
  if (withStats && stats) {
    lines.push('')
    lines.push('─────────────────────────')

    // Habilidade Suprema
    if (stats.ultimate) {
      const ult = stats.ultimate
      const uName = L ? (ult.nEN || ult.nPT) : ult.nPT
      const uDesc = L ? (ult.dEN || ult.dPT) : ult.dPT
      lines.push('')
      lines.push(L ? `**Ultimate: ${uName}**` : `**Supremo: ${uName}**`)
      if (uDesc) lines.push(`  ${uDesc}`)
      if (ult.hits != null) lines.push(`  ${L ? 'Hits' : 'Golpes'}: ${ult.hits}`)
      if (ult.targets != null) lines.push(`  ${L ? 'Targets' : 'Alvos'}: ${ult.targets}`)
      if (ult.cost != null) lines.push(`  ${L ? 'Cost' : 'Custo'}: ${ult.cost} ${L ? 'Resolve' : 'Det.'}`)
    }

    lines.push('')
    lines.push(L ? '**Statistics:**' : '**Estatísticas:**')

    // HP e DET sempre aparecem (conforme solicitado)
    const hp = stats.maxHP ?? 100
    const resolve = stats.maxResolve ?? 3
    lines.push(`  HP: ${hp}`)
    lines.push(`  ${L ? 'Resolve' : 'Determinação'}: ${resolve}`)

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
  }

  // ── Código de compartilhamento (opcional) ─────────────────
  if (includeShareCode) {
    lines.push('')
    lines.push('─────────────────────────')
    const code = encodeBuild(build, buildName || 'Build')
    lines.push(L ? `Share Code: \`${code}\`` : `Código: \`${code}\``)
  }

  return lines.join('\n')
}
```

---

# Fase 3 — Geração de Imagem

## Design da imagem gerada

A imagem é gerada via **Canvas API** (sem dependências externas). Cada modo (`build`, `detailed`, `stats`) gera um PNG com layout diferente mas sempre na cor da classe ativa.

### Layout do canvas

```
┌────────────────────────────────────────────────────────┐
│  [ícone classe 32px]  NOME DA BUILD  [ícone supremo]  │  ← Header
│                       (Classe)                         │
├──────────────────────┬─────────────────────────────────┤
│  HABILIDADE          │  EQUIPAMENTOS                   │
│  [ícone] Nome [Xs]   │  [ícone] Katana: Nome ★        │
│  Vantagem I          │    • Prop I: valor              │
│  Vantagem II         │    • Perk I                     │
│  Vantagem III        │  [ícone] Longo Alcance: ...     │
├──────────────────────┴─────────────────────────────────┤  (somente stats)
│  ESTATÍSTICAS                                          │
│  HP: 115    Determinação: 3    Dano CaC: +25%  ...    │
└────────────────────────────────────────────────────────┘
```

Os **ícones são incluídos** na imagem:
- Canto superior esquerdo → ícone da classe (SVG carregado como `Image`)
- Canto superior direito → ícone da habilidade suprema (PNG)
- Cada equipamento → ícone do item à esquerda do nome

### Pontos de atenção

- SVGs de classe precisam ser convertidos para `blob:` URL ou `data:` URL para carregamento no Canvas (restrição CORS)
- PNGs de técnicas são carregados normalmente
- A paleta de cores da imagem usa os mesmos valores de `T` do tema ativo (dark/light)
- O download é disparado via `a.click()` com `href = canvas.toDataURL('image/png')`

### Onde implementar

**Localizar em `ExportPanel`:**
```jsx
  const handleGenImage = (mode) => { flash(`img-${mode}`) /* TODO Fase 3 */ }
```

**Substituir por:**
```jsx
  const handleGenImage = (mode) => {
    generateBuildImage({ build, stats, lang, buildName, mode })
      .then(() => flash(`img-${mode}`))
      .catch(err => { console.error('Canvas error:', err); flash(`img-${mode}`) })
  }
```

A função `generateBuildImage` será implementada na Fase 3 completa. Ela é assíncrona porque precisa aguardar o carregamento das imagens dos ícones antes de desenhar.

### Estrutura da função `generateBuildImage` (esqueleto)

```jsx
// ─── Gerador de imagem via Canvas API ────────────────────────────
async function generateBuildImage({ build, stats, lang, buildName, mode }) {
  // 1. Definir dimensões
  const W    = 900
  const H    = mode === 'stats' ? 720 : 460
  const PAD  = 28
  const CLS  = T.cls[build.classId]

  // 2. Criar canvas
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // 3. Fundo
  ctx.fillStyle = T.bg
  ctx.fillRect(0, 0, W, H)

  // 4. Carregar ícones necessários (Promise.all)
  const iconUrls = collectIconUrls(build, mode)  // retorna { classIcon, supremeIcon, gearIcons: {...} }
  const icons    = await loadImages(iconUrls)

  // 5. Desenhar header (classe + nome + ícone supremo)
  drawHeader(ctx, { build, stats, lang, buildName, icons, CLS, W, PAD })

  // 6. Desenhar colunas
  if (mode === 'stats') {
    drawTwoColumns(ctx, { build, stats, lang, icons, CLS, W, H, PAD })
    drawStatsSection(ctx, { stats, lang, W, H, PAD })
  } else {
    drawTwoColumns(ctx, { build, stats, lang, icons, CLS, W, H, PAD })
  }

  // 7. Download
  const a    = document.createElement('a')
  a.href     = canvas.toDataURL('image/png')
  a.download = `${buildName || 'build'}-${mode}.png`
  a.click()
}
```

A implementação detalhada de `drawHeader`, `drawTwoColumns`, `drawStatsSection` etc. será entregue na sessão de Fase 3, após as correções acima estarem aplicadas e funcionando.

---

## Resposta à pergunta sobre ícones no print

> "para a parte do print, eu gostaria de adicionar os ícones respectivos de cada coisa que tivermos para acompanhar os textos em seus quadros"

**Sim, entendi e é viável.** No Canvas, carregamos cada ícone como `HTMLImageElement` antes de desenhar. Cada linha de texto que tem um ícone associado desenha `ctx.drawImage(icon, x, y, size, size)` à esquerda do texto. O fluxo é:

1. Coletar todas as URLs de ícones necessárias para a build atual
2. `Promise.all(urls.map(loadImage))` — carrega tudo antes de desenhar
3. Para cada seção (habilidade, vantagem, equipamento, técnica), desenha ícone + texto lado a lado

A qualidade é perfeita porque os PNGs são escalados via `ctx.drawImage` com interpolação suave.

---

*Guia gerado em: sessão de desenvolvimento GoT Legends Build Planner*
