# spec0014 — Fase 3: `generateBuildImage`, e o encerramento de `meta/legacy/`

**Data:** 2026-07-25 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**O que esta spec faz:** implementa a Fase 3 seguindo o plano auditado (DEC-026), corrige dois defeitos silenciosos que a auditoria encontrou na Fase 2 (FIX-010), e remove o último arquivo de `meta/legacy/`, encerrando a pasta.

**A auditoria foi validada por simulação.** O layout foi rodado contra dados de teste com build cheia e descrições longas, e os números confirmam o defeito D2 com folga:

| Modo | Altura necessária | Altura fixa do guia | Resultado |
|---|---|---|---|
| Build | ~670 px | 560 px | cortava |
| **Detalhado** | **~1340 px** | **560 px** | **cortava ~58% do conteúdo** |
| Estatístico | ~1450 px | 820 px | cortava ~43% |
| Build vazia | ~170 px | 560 px | ~390 px de faixa morta |

Os números vêm de uma medição aproximada de texto, então na tela vão diferir — mas a ordem de grandeza fecha a questão: **o corte era o caso comum, não o extremo.**

A simulação também confirmou que as duas passadas devolvem **exatamente a mesma altura** nos três modos, e que a passada de medição não pinta nada.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 6. **Dois commits:** código e documentação.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- As remoções da Parte 12 só depois do resto estar no `git diff`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
ls meta/legacy/
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. `meta/legacy/` deve ter `GUIA_CORRECOES_FASE3.md` e `README.md`. Reporte se divergir.
3. Há algo modificado e não commitado? Liste.

---

## Parte 2 — `src/App.jsx`: corrigir a recarga das Armas Fantasma (FIX-010, parte 1)

`computeStats` grava as recargas em `res.gw1` e `res.gw2` — o `App.jsx` já lê assim na interface. O `generateBuildText` lê `gw1Cooldown` / `gw2Cooldown`, chaves que **não existem**: a comparação com `!= null` falha sempre e a recarga **nunca aparece no texto exportado**, em nenhum dos três modos, sem erro nenhum.

**Âncora:**

```
    // Recarga de GW
    let cdPart = ''
    if (slotName === 'gw1' && stats?.gw1Cooldown?.finalCd != null) {
      cdPart = ` [${stats.gw1Cooldown.finalCd}s]`
    } else if (slotName === 'gw2' && stats?.gw2Cooldown?.finalCd != null) {
      cdPart = ` [${stats.gw2Cooldown.finalCd}s]`
    }
```

**Substituir por:**

```
    // Recarga de GW — as chaves sao `stats.gw1` / `stats.gw2` (ver FIX-010).
    // `gw1Cooldown` / `gw2Cooldown` nao existem: liam undefined e a recarga
    // sumia do texto sem erro.
    let cdPart = ''
    if (slotName === 'gw1' && stats?.gw1?.finalCd != null) {
      cdPart = ` [${stats.gw1.finalCd}s]`
    } else if (slotName === 'gw2' && stats?.gw2?.finalCd != null) {
      cdPart = ` [${stats.gw2.finalCd}s]`
    }
```

---

## Parte 3 — `src/App.jsx`: corrigir o bloco do Supremo (FIX-010, parte 2)

Mesmo tipo de defeito. `computeUltimate` devolve `strikes` (Samurai e Assassino), `targets` (Caçadora) e `variants` (Ronin) — **não devolve `hits` nem `dPT`/`dEN`**. O resultado é que o texto exportado mostra só o nome e o custo do Supremo: a contagem de golpes e o bônus de dano nunca saem, e a Caçadora é a única classe que aparece completa, por acaso.

A correção usa `ultimateSummary`, que a Parte 4 acrescenta — declaração de função é içada, então a ordem no arquivo não importa.

**Âncora:**

```
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
```

**Substituir por:**

```
    // Habilidade Suprema — o resumo e montado por classe, porque as chaves
    // devolvidas por computeUltimate mudam entre elas. Ver FIX-010.
    if (stats.ultimate) {
      const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
      const uLine = ultimateSummary(stats.ultimate, L)
      lines.push('')
      lines.push(L ? `**Ultimate: ${uName}**` : `**Supremo: ${uName}**`)
      if (uLine) lines.push(`  ${uLine}`)
    }
```

---

## Parte 4 — `src/App.jsx`: inserir o bloco da Fase 3

**Âncora** (a linha de seção do `ExportPanel`):

```
// ─── ExportPanel — botões de copiar texto e gerar imagem ─────
```

**Substituir por** — o bloco inteiro abaixo, **seguido** da linha da âncora:

```jsx
// ─── Fase 3 — Geração de imagem via Canvas API ───────────────
// Canvas puro, sem dependência externa (DEC-021).
//
// ARQUITETURA — DUAS PASSADAS (DEC-026, defeitos D2 e D6)
// O mesmo `paintBuildImage` roda duas vezes: a primeira com `draw = false`,
// só medindo, e a segunda desenhando. A altura do canvas é então exatamente a
// do conteúdo — nem corta o modo Detalhado, nem sobra faixa vazia na build
// enxuta. É por isso que toda escrita passa pelo pintor: quem mede e quem
// desenha precisam ser o MESMO código, ou os dois divergem na primeira
// alteração de layout.
//
// CONSTANTES DE LAYOUT — em unidades lógicas. A renderização sai em 2x (D4),
// então ajuste estes valores à vontade sem pensar em resolução.
const IMG_W          = 900   // largura lógica da imagem
const IMG_PAD        = 28    // margem interna
const IMG_COL_SPLIT  = 0.42  // fração da largura ocupada pela coluna esquerda
const IMG_HEADER_H   = 78    // altura da faixa do cabeçalho
const IMG_ICON_SMALL = 18    // ícones de linha (habilidade, vantagem, gear)
const IMG_ICON_ULT   = 46    // ícone do supremo, no cabeçalho
const IMG_FOOTER_H   = 30    // faixa reservada para a assinatura
const IMG_SCALE      = 2     // fator de supersampling — 1 = borrado em tela retina
const IMG_FONT       = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

/**
 * Carrega uma imagem para uso no canvas.
 *
 * Resolve `null` em vez de rejeitar: um ícone ausente não pode derrubar a
 * geração inteira. Sem `crossOrigin` de propósito — os ícones são servidos
 * pela própria origem, e o atributo só criaria uma segunda entrada de cache
 * sem nenhum ganho (DEC-026, D7).
 *
 * @param {string|null} src
 * @returns {Promise<HTMLImageElement|null>}
 */
function loadImg(src) {
  if (!src) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/**
 * Item de um slot, já resolvido para desenho.
 *
 * Para `charm`, devolve o amuleto EFETIVO. Sem isto, as propriedades e
 * vantagens exclusivas de classe de um amuleto Magistral com `classBinding`
 * não são encontradas em `item.props` e somem da imagem sem erro nenhum,
 * enquanto continuam visíveis na tela (armadilha 7 / DEC-026, D1).
 *
 * @param {Object} build
 * @param {string} slotName
 * @returns {Object|null}
 */
function slotItemForImage(build, slotName) {
  const st = build.gear?.[slotName]
  if (!st?.itemId) return null
  return slotName === 'charm'
    ? getEffectiveCharm(st.itemId, st.linkedClass)
    : getItem(st.itemId)
}

/**
 * Resumo do Supremo em uma linha, montado por classe.
 *
 * As chaves devolvidas por `computeUltimate` mudam conforme a classe:
 * `strikes` no Samurai e no Assassino, `targets` na Caçadora, `variants` no
 * Ronin. Não existe `hits` nem `dPT` — ler essas duas devolve `undefined` em
 * silêncio, que foi exatamente o defeito corrigido pela FIX-010.
 *
 * @param {Object|null} ult - `stats.ultimate`
 * @param {boolean} L - true quando o idioma é EN
 * @returns {string|null}
 */
function ultimateSummary(ult, L) {
  if (!ult) return null
  const parts = []

  if (ult.classId === 'samurai' && ult.mode === 'rage300') {
    parts.push(L ? '2 strikes x 300% damage' : '2 golpes x 300% de dano')
  } else if (ult.strikes != null) {
    parts.push(`${L ? 'Strikes' : 'Golpes'}: ${ult.strikes}`)
  }
  if (ult.targets != null) parts.push(`${L ? 'Targets' : 'Alvos'}: ${ult.targets}`)

  // Ronin: o Sopro ativo é a variante escolhida (ou a única, quando só há uma)
  if (ult.classId === 'ronin' && ult.variants?.length) {
    const act = ult.variants.find(v => ult.variants.length === 1 || ult.activeBreath === v.id)
    if (act) parts.push(L ? (act.nEN || act.nPT) : act.nPT)
  }
  if (ult.dmgMult) parts.push(`x${ult.dmgMult} ${L ? 'damage' : 'de dano'}`)
  if (ult.ultDmgBonus > 0) {
    parts.push(`+${Math.round(ult.ultDmgBonus * 100)}% ${L ? 'ult. dmg' : 'dano do supremo'}`)
  }
  if (ult.cost != null) parts.push(`${L ? 'Cost' : 'Custo'}: ${ult.cost}★`)

  return parts.length ? parts.join('  ·  ') : null
}

/**
 * Carrega em paralelo todos os ícones que a build usa.
 * Devolve um mapa `{ chave: HTMLImageElement|null }`.
 *
 * @param {Object} build
 * @returns {Promise<Object>}
 */
async function loadBuildIcons(build) {
  const jobs = {
    cls:     loadImg(CLASS_ICON[build.classId]),
    supreme: loadImg(CLASS_TECH_FALLBACK[build.classId]),
  }
  if (build.abilityId) {
    jobs.ability = loadImg(getTechIconUrl(build.abilityId, build.classId))
  }
  for (const tier of ['I', 'II', 'III']) {
    const techId = build.techs?.[tier]
    if (techId) jobs[`tech_${tier}`] = loadImg(getTechIconUrl(techId, build.classId))
  }
  for (const slot of ['katana', 'ranged', 'charm', 'gw1', 'gw2']) {
    const item = slotItemForImage(build, slot)
    if (item) jobs[`gear_${slot}`] = loadImg(getGearIconUrl(item))
  }

  const keys    = Object.keys(jobs)
  const results = await Promise.all(keys.map(k => jobs[k]))
  const out     = {}
  keys.forEach((k, i) => { out[k] = results[i] })
  return out
}

/**
 * Pintor: a mesma interface serve para medir e para desenhar.
 *
 * Com `draw = false` nada é pintado, mas as alturas devolvidas são idênticas —
 * é o que permite calcular a altura final antes de criar o canvas definitivo.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} draw
 */
function makePainter(ctx, draw) {
  return {
    /**
     * Escreve um texto com quebra automática por palavra.
     * @returns {number} altura ocupada, em unidades lógicas
     */
    text(txt, x, y, { font, color, maxW = Infinity, lineH = 16 }) {
      if (txt == null || txt === '') return 0
      ctx.font = font
      let line = ''
      let dy   = 0
      const flush = () => {
        if (!line) return
        if (draw) { ctx.fillStyle = color; ctx.fillText(line, x, y + dy) }
        dy += lineH
        line = ''
      }
      for (const w of String(txt).split(' ')) {
        const test = line ? `${line} ${w}` : w
        if (ctx.measureText(test).width > maxW && line) { flush(); line = w }
        else line = test
      }
      flush()
      return dy
    },

    /** Largura de um texto numa dada fonte. Útil para posicionar em sequência. */
    width(txt, font) {
      ctx.font = font
      return ctx.measureText(String(txt)).width
    },

    /**
     * Desenha um ícone.
     *
     * `invert` aplica o filtro do tema — o canvas NÃO herda filtro CSS, então
     * sem isto o SVG de classe entra com a cor original e some no fundo
     * escuro (armadilha 15 / DEC-026, D3). E o filtro vale SÓ para os SVG de
     * classe: em PNG de técnica ele vira retângulo sólido (armadilha 3).
     */
    icon(img, x, yTop, size, invert = false) {
      if (!draw || !img) return
      if (invert && T.iconFilter) ctx.filter = T.iconFilter
      ctx.drawImage(img, x, yTop, size, size)
      if (invert && T.iconFilter) ctx.filter = 'none'
    },

    rect(x, y, w, h, color) {
      if (!draw) return
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    },

    divider(x1, y, x2, color) {
      if (!draw) return
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth   = 1
      ctx.globalAlpha = 0.35
      ctx.beginPath()
      ctx.moveTo(x1, y + 0.5)
      ctx.lineTo(x2, y + 0.5)
      ctx.stroke()
      ctx.restore()
    },

    centered(txt, cx, y, { font, color }) {
      if (!draw || !txt) return
      ctx.save()
      ctx.textAlign = 'center'
      ctx.font      = font
      ctx.fillStyle = color
      ctx.fillText(String(txt), cx, y)
      ctx.restore()
    },
  }
}

/**
 * Percorre o layout inteiro da imagem, medindo ou desenhando.
 *
 * Chamada duas vezes por geração — ver o comentário de arquitetura no topo.
 * O fundo e a assinatura ficam FORA daqui, porque dependem da altura final.
 *
 * @returns {number} altura total do conteúdo, já com a faixa do rodapé
 */
function paintBuildImage(ctx, draw, { build, stats, lang, buildName, mode, icons }) {
  const L    = lang === 'en'
  const cls  = getClass(build.classId)
  const pen  = makePainter(ctx, draw)
  const CLS  = T.cls[build.classId]
  const withDesc  = mode === 'detailed' || mode === 'stats'
  const withStats = mode === 'stats'

  const colX   = Math.round(IMG_W * IMG_COL_SPLIT)
  const leftX  = IMG_PAD
  const leftW  = colX - IMG_PAD * 2
  const rightX = colX + IMG_PAD
  const rightW = IMG_W - rightX - IMG_PAD

  // ── Cabeçalho ──────────────────────────────────────────────
  pen.rect(0, 0, IMG_W, IMG_HEADER_H, CLS + '22')
  pen.rect(0, IMG_HEADER_H - 1, IMG_W, 1, CLS + '55')

  // Ícone de classe: SVG, precisa do filtro do tema
  pen.icon(icons.cls, IMG_PAD, (IMG_HEADER_H - 28) / 2, 28, true)

  const clsName = L ? (cls.nEN || cls.nPT) : cls.nPT
  const title   = buildName?.trim() || clsName
  const sub     = buildName?.trim() ? clsName : ''
  pen.centered(title, IMG_W / 2, IMG_HEADER_H / 2 + (sub ? -2 : 5),
    { font: `800 19px ${IMG_FONT}`, color: T.text })
  if (sub) {
    pen.centered(`(${sub})`, IMG_W / 2, IMG_HEADER_H / 2 + 16,
      { font: `500 12px ${IMG_FONT}`, color: CLS })
  }

  // Supremo, à direita: PNG — NUNCA com filtro (armadilha 3)
  const ultX = IMG_W - IMG_PAD - IMG_ICON_ULT
  pen.icon(icons.supreme, ultX, 6, IMG_ICON_ULT, false)
  if (stats?.ultimate) {
    const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
    pen.centered(uName, ultX + IMG_ICON_ULT / 2, 6 + IMG_ICON_ULT + 13,
      { font: `600 10px ${IMG_FONT}`, color: CLS })
  }

  // ── Coluna esquerda: habilidade e vantagens de classe ──────
  let ly = IMG_HEADER_H + IMG_PAD

  pen.text(L ? 'CLASS ABILITY & PERKS' : 'HABILIDADE & VANTAGENS', leftX, ly,
    { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
  ly += 15
  pen.divider(leftX, ly, colX - IMG_PAD, T.border)
  ly += 14

  const textX = leftX + IMG_ICON_SMALL + 8
  const textW = leftW - IMG_ICON_SMALL - 8

  const abilityDef = cls.abilities.find(a => a.id === build.abilityId)
  if (abilityDef) {
    const aName = L ? (abilityDef.nEN || abilityDef.nPT) : abilityDef.nPT
    const aCd   = stats?.abilityCooldown?.finalCd ?? abilityDef.cd
    pen.icon(icons.ability, leftX, ly - IMG_ICON_SMALL + 4, IMG_ICON_SMALL, false)
    pen.text(aName, textX, ly, { font: `700 13px ${IMG_FONT}`, color: CLS, lineH: 17 })
    pen.text(`[${aCd}s]`, textX + pen.width(aName, `700 13px ${IMG_FONT}`) + 7, ly,
      { font: `400 11px ${IMG_FONT}`, color: T.muted, lineH: 0 })
    ly += 17
    if (withDesc) {
      const aDesc = L ? (abilityDef.dEN || abilityDef.dPT) : abilityDef.dPT
      ly += pen.text(aDesc, textX, ly, { font: `400 10px ${IMG_FONT}`, color: T.muted, maxW: textW, lineH: 14 })
    }
    ly += 10
  }

  for (const tier of ['I', 'II', 'III']) {
    const techId = build.techs?.[tier]
    if (!techId) continue
    const techDef = cls.techs.find(t => t.id === techId)
    if (!techDef) continue

    pen.text(L ? `Perk ${tier}` : `Vantagem ${tier}`, leftX, ly,
      { font: `600 9px ${IMG_FONT}`, color: T.dim, lineH: 12 })
    ly += 12

    const tName = L ? (techDef.nEN || techDef.nPT) : techDef.nPT
    pen.icon(icons[`tech_${tier}`], leftX, ly - IMG_ICON_SMALL + 4, IMG_ICON_SMALL, false)
    ly += pen.text(tName, textX, ly, { font: `600 12px ${IMG_FONT}`, color: T.text, maxW: textW, lineH: 16 })

    if (withDesc) {
      const tDesc = L ? (techDef.dEN || techDef.dPT) : techDef.dPT
      ly += pen.text(tDesc, textX, ly, { font: `400 10px ${IMG_FONT}`, color: T.muted, maxW: textW, lineH: 14 })
    }
    ly += 8
  }

  // ── Coluna direita: equipamentos ───────────────────────────
  const slotLabels = {
    katana: L ? 'Katana'          : 'Katana',
    ranged: L ? 'Ranged Weapon'   : 'Longo Alcance',
    charm:  L ? 'Charm'           : 'Amuleto',
    gw1:    L ? 'Ghost Weapon I'  : 'Arma Fantasma I',
    gw2:    L ? 'Ghost Weapon II' : 'Arma Fantasma II',
  }

  let ry = IMG_HEADER_H + IMG_PAD
  pen.text(L ? 'GEAR' : 'EQUIPAMENTOS', rightX, ry,
    { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
  ry += 15
  pen.divider(rightX, ry, IMG_W - IMG_PAD, T.border)
  ry += 14

  const gTextX = rightX + IMG_ICON_SMALL + 8
  const gTextW = rightW - IMG_ICON_SMALL - 8

  for (const slot of ['katana', 'ranged', 'charm', 'gw1', 'gw2']) {
    // Amuleto pelo item efetivo — ver slotItemForImage (D1)
    const item = slotItemForImage(build, slot)
    if (!item) continue
    const slotState = build.gear[slot]

    pen.text(slotLabels[slot], rightX, ry, { font: `600 9px ${IMG_FONT}`, color: T.dim, lineH: 12 })
    ry += 12

    const iName = (L ? (item.nEN || item.nPT) : item.nPT) + (item.leg ? ' ★' : '')
    pen.icon(icons[`gear_${slot}`], rightX, ry - IMG_ICON_SMALL + 4, IMG_ICON_SMALL, false)
    const nameFont = `700 13px ${IMG_FONT}`
    pen.text(iName, gTextX, ry, { font: nameFont, color: item.leg ? T.leg : T.text, maxW: gTextW, lineH: 17 })

    // Recarga da Arma Fantasma — as chaves são `stats.gw1` / `stats.gw2` (FIX-010)
    const gwCd = slot === 'gw1' ? stats?.gw1?.finalCd
               : slot === 'gw2' ? stats?.gw2?.finalCd
               : null
    if (gwCd != null) {
      pen.text(`[${gwCd}s]`, gTextX + pen.width(iName, nameFont) + 7, ry,
        { font: `400 11px ${IMG_FONT}`, color: T.muted, lineH: 0 })
    }
    ry += 17

    if (withDesc && item.leg && item.xp) {
      const xpText = L ? (item.xp.en || item.xp.pt) : item.xp.pt
      ry += pen.text(xpText, gTextX, ry,
        { font: `italic 400 10px ${IMG_FONT}`, color: T.leg, maxW: gTextW, lineH: 14 })
      ry += 2
    }

    for (const ps of ['p1', 'p2']) {
      const pState = slotState[ps]
      if (!pState?.propId) continue
      const propDef = item.props?.find(p => p.id === pState.propId)
      if (!propDef) continue
      const pName = L ? (propDef.nEN || propDef.nPT) : propDef.nPT
      const pVal  = formatStatValue(pState.value, propDef.u)
      ry += pen.text(`• ${pName}: ${pVal}`, gTextX, ry,
        { font: `400 11px ${IMG_FONT}`, color: T.text, maxW: gTextW, lineH: 15 })
      if (withDesc) {
        const pDesc = L ? (propDef.dEN || propDef.dPT) : propDef.dPT
        ry += pen.text(pDesc, gTextX + 10, ry,
          { font: `400 10px ${IMG_FONT}`, color: T.dim, maxW: gTextW - 10, lineH: 13 })
      }
    }

    for (const pk of ['perk1', 'perk2']) {
      const perkId = slotState[pk]
      if (!perkId) continue
      const perkDef = item.perks?.find(p => p.id === perkId)
      if (!perkDef) continue
      const pkName = L ? (perkDef.nEN || perkDef.nPT) : perkDef.nPT
      ry += pen.text(`• ${pkName}`, gTextX, ry,
        { font: `400 11px ${IMG_FONT}`, color: T.text, maxW: gTextW, lineH: 15 })
      if (withDesc) {
        const pkDesc = L ? (perkDef.dEN || perkDef.dPT) : perkDef.dPT
        ry += pen.text(pkDesc, gTextX + 10, ry,
          { font: `400 10px ${IMG_FONT}`, color: T.dim, maxW: gTextW - 10, lineH: 13 })
      }
    }
    ry += 10
  }

  // ── Faixa de estatísticas (somente modo Estatístico) ───────
  let y = Math.max(ly, ry) + 6

  if (withStats && stats) {
    pen.divider(IMG_PAD, y, IMG_W - IMG_PAD, T.border)
    y += 18

    const ultLine = ultimateSummary(stats.ultimate, L)
    if (ultLine) {
      const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
      pen.text(`${L ? 'Ultimate' : 'Supremo'}: ${uName}`, IMG_PAD, y,
        { font: `700 12px ${IMG_FONT}`, color: CLS, lineH: 16 })
      y += 16
      y += pen.text(ultLine, IMG_PAD, y,
        { font: `400 11px ${IMG_FONT}`, color: T.muted, maxW: IMG_W - IMG_PAD * 2, lineH: 15 })
      y += 8
    }

    pen.text(L ? 'STATISTICS' : 'ESTATÍSTICAS', IMG_PAD, y,
      { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
    y += 18

    // HP e Determinação SEMPRE, mesmo no valor base; o resto só se mudou (DEC-022)
    const rows = [
      { label: 'HP', value: String(stats.maxHP ?? 100) },
      { label: L ? 'Resolve' : 'Determinação', value: String(stats.maxResolve ?? 3) },
    ]
    for (const group of getStatGroups(stats, build.classId, lang)) {
      for (const s of group.stats) {
        if (s.key === 'maxHP' || s.key === 'maxResolve') continue
        if (!isStatChanged(s)) continue
        rows.push({ label: s.label, value: formatStatValue(s.value, s.unit) })
      }
    }

    const cols  = 3
    const colW  = (IMG_W - IMG_PAD * 2) / cols
    const lblFt = `400 11px ${IMG_FONT}`
    const valFt = `700 11px ${IMG_FONT}`
    rows.forEach((row, i) => {
      const cx = IMG_PAD + (i % cols) * colW
      const cy = y + Math.floor(i / cols) * 18
      pen.text(`${row.label}:`, cx, cy, { font: lblFt, color: T.muted, lineH: 0 })
      pen.text(row.value, cx + pen.width(`${row.label}: `, lblFt), cy,
        { font: valFt, color: T.green, lineH: 0 })
    })
    y += Math.ceil(rows.length / cols) * 18
  }

  return y + IMG_FOOTER_H
}

/**
 * Gera o PNG da build e dispara o download.
 *
 * Assíncrona porque precisa dos ícones carregados antes de desenhar.
 *
 * @param {Object}  args
 * @param {Object}  args.build
 * @param {Object}  args.stats     - saída de `computeStats`
 * @param {string}  args.lang      - 'pt' | 'en'
 * @param {string}  args.buildName
 * @param {string}  args.mode      - 'build' | 'detailed' | 'stats'
 * @returns {Promise<void>}
 */
async function generateBuildImage({ build, stats, lang, buildName, mode }) {
  const cls = getClass(build.classId)
  if (!cls) return

  const icons = await loadBuildIcons(build)
  const args  = { build, stats, lang, buildName, mode, icons }

  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')

  // 1ª passada — mede. O canvas ainda está no tamanho padrão; `measureText`
  // funciona igual, e nada é pintado.
  const totalH = Math.ceil(paintBuildImage(ctx, false, args))

  // 2ª passada — desenha no canvas definitivo. Mexer em width/height zera o
  // estado do contexto, então a escala é reaplicada depois (D4).
  canvas.width  = IMG_W * IMG_SCALE
  canvas.height = totalH * IMG_SCALE
  ctx.scale(IMG_SCALE, IMG_SCALE)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = T.bg
  ctx.fillRect(0, 0, IMG_W, totalH)

  paintBuildImage(ctx, true, args)

  // Assinatura: desenhada por último, na altura já conhecida (D6)
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font      = `400 9px ${IMG_FONT}`
  ctx.fillStyle = T.dim
  ctx.fillText('GoT Legends Build Planner • arlsnech', IMG_W / 2, totalH - 11)
  ctx.restore()

  // Download via blob — evita a string base64 gigante do toDataURL (D5).
  // A exportação é o único ponto que lança se o canvas estiver contaminado,
  // então é aqui que o try/catch precisa estar, e não no drawImage (D7).
  const safeName = (buildName || 'build').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
  await new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('toBlob devolveu null')); return }
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href     = url
        a.download = `${safeName}-${mode}.png`
        a.click()
        URL.revokeObjectURL(url)
        resolve()
      }, 'image/png')
    } catch (err) {
      reject(err)
    }
  })
}
// ─── ExportPanel — botões de copiar texto e gerar imagem ─────
```

---

## Parte 5 — `src/App.jsx`: ligar ao botão

**Âncora:**

```
  const handleGenImage = (mode) => { flash(`img-${mode}`) /* TODO Fase 3 */ }
```

**Substituir por:**

```
  const handleGenImage = (mode) => {
    generateBuildImage({ build, stats, lang, buildName, mode })
      .then(() => flash(`img-${mode}`))
      .catch(err => {
        // A exportacao e o unico ponto que lanca se o canvas estiver
        // contaminado — o drawImage nao lanca. Ver DEC-026, D7.
        console.error('Falha ao gerar a imagem da build:', err)
        flash(`img-${mode}`)
      })
  }
```

---

## Parte 6 — Build e conferência visual

Rode `npm run build`. Se falhar, **PARE**.

Depois suba o dev server. A lista abaixo é a do `ROADMAP.md`; **nenhum item é opcional.**

**Os que a auditoria existe para provar:**

1. **Build cheia no modo Detalhado** — cinco slots preenchidos, com Magistrais (que têm descrição). Gere o 🖼️ Detalhado: **nada cortado no pé da imagem**, e a assinatura aparece embaixo de tudo. É o caso que a altura fixa quebrava.
2. **Build vazia** — só a classe, sem gear nem técnicas. Gere o 🖼️ Build: a imagem sai **curta**, sem faixa enorme de espaço morto.
3. **Amuleto Magistral com `classBinding`** — equipe um, escolha uma propriedade **exclusiva da classe** (as que só aparecem depois de vincular) e gere o 🖼️ Detalhado. **A propriedade tem que estar na imagem, com o mesmo valor da tela.** Se sumir, o D1 não foi corrigido.
4. **Ícone de classe no cabeçalho** — visível nos **dois temas**. Se aparecer escuro sobre fundo escuro, o `ctx.filter` não pegou (D3).
5. **Ícones de técnica e de gear** — nítidos, **não** viraram retângulos sólidos. Se viraram, o filtro está sendo aplicado onde não devia (armadilha 3).

**Os demais:**

6. **Ampliar a imagem baixada a 200%** — texto nítido, não borrado (D4).
7. **Tema claro** — repita os três modos: texto legível, fundo claro, nada sumindo.
8. **EN** — rótulos, descrições e o nome do arquivo baixado.
9. **Arma Fantasma com recarga** — o `[Xs]` aparece na imagem **e** agora também no 📋 texto, nos três modos (FIX-010).
10. **Supremo no 📋 Estatístico** — com Samurai, a linha traz **Golpes** e o custo; com Caçadora, **Alvos**; com Ronin, o **Sopro ativo**. Antes só saía nome e custo.
11. **Modo Estatístico, imagem** — só as estatísticas modificadas, **mais HP e Determinação sempre**, mesmo sem bônus (DEC-022).
12. **Console limpo** e o arquivo baixado com nome `nome-da-build-detailed.png`.

Se todos passarem, faça o **commit de código**:

```
git add src/App.jsx
git commit -m "feat(export): implementa a geracao de imagem da build (fase 3)"
```

Não faça `push` ainda.

---

## Parte 7 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-026):

```
O layout em duas colunas com faixa de estatísticas ao pé também fica: é o que o autor pediu desde o primeiro prompt.
```

**Substituir por:**

```
O layout em duas colunas com faixa de estatísticas ao pé também fica: é o que o autor pediu desde o primeiro prompt.

### Desfecho — aplicada em 2026-07-25 pela spec0014
Os oito defeitos foram corrigidos e a arquitetura de duas passadas foi validada por simulação antes de virar código: as duas passadas devolvem altura idêntica nos três modos, e a passada de medição não pinta nada. O D2 se confirmou pior do que a auditoria supunha — o modo Detalhado de uma build cheia precisa de cerca de 1340 px contra os 560 fixos do guia.

O oitavo defeito não estava na lista original: apareceu ao comparar o código do guia com o `generateBuildText`, e revelou que **quem estava errado era o `generateBuildText`** (FIX-010).

---

## FIX-010 — Recarga das Armas Fantasma e resumo do Supremo sumiam do texto exportado

**Data:** 2026-07-25 · **Gravidade:** média (informação faltando no compartilhamento, sem erro)

### Sintoma
No texto gerado pelos três botões 📋, a recarga das Armas Fantasma **nunca aparecia**, e o bloco do Supremo mostrava só nome e custo — sem a contagem de golpes, sem o bônus de dano, e sem o Sopro ativo do Ronin. Na interface, as mesmas informações estavam corretas. Nenhum erro no console.

### Causa raiz
Três chaves inexistentes, lidas como `undefined` e engolidas por guardas `!= null`:

| Lido | Existe? | O que `computeStats` devolve |
|---|---|---|
| `stats.gw1Cooldown` / `gw2Cooldown` | não | `stats.gw1` / `stats.gw2` |
| `ult.hits` | não | `ult.strikes` (Samurai, Assassino) |
| `ult.dPT` / `ult.dEN` | não | nada — a descrição do Supremo não é campo de `computeUltimate` |

Por coincidência, `ult.targets` **existe**, então a Caçadora era a única classe que saía completa — o que ajudou o defeito a passar despercebido.

### Correção
As duas chaves de recarga passaram a apontar para `stats.gw1` / `stats.gw2`. O bloco do Supremo passou a usar `ultimateSummary(ult, L)`, que monta o resumo **por classe** — `strikes` para Samurai e Assassino, `targets` para Caçadora, variante ativa para Ronin, mais o bônus de dano e o custo. A mesma função alimenta a imagem da Fase 3, então texto e imagem não podem divergir.

### Como foi encontrado
Não por relato: apareceu ao auditar o código da Fase 3 do guia e **comparar as duas implementações**. O guia lia `stats.gw1` e o `generateBuildText` lia `stats.gw1Cooldown`; um dos dois tinha de estar errado, e `logic.js` decidiu a favor do guia.

**Regra que fica:** quando duas implementações do mesmo dado divergem, a divergência é o achado. Não escolha a mais recente nem a que parece mais cuidada — vá à fonte. É a terceira vez que uma chave errada some com informação em silêncio neste projeto (FIX-005, e agora as três desta entrada); **a exportação não tem quem reclame**, porque nada quebra: o texto sai bonito e incompleto.
```

---

## Parte 8 — `meta/ROADMAP.md`

### 8.1 — Fechar a F3

**Âncora:**

```
## 🟡 F3 — Exportação de Imagem *(próxima / em curso)*
```

**Substituir por:**

```
## 🟢 F3 — Exportação de Imagem *(concluída em 2026-07-25)*
```

### 8.2 — Tirar da F4 o que a F3 absorveu

**Âncora:**

```
- Altura dinâmica do canvas na geração de imagem
```

**Substituir por:**

```
- ~~Altura dinâmica do canvas na geração de imagem~~ — **feito na F3** (DEC-026, D2): sem isso o modo Detalhado cortava mais da metade do conteúdo, então virou requisito e não polimento
```

---

## Parte 9 — `meta/GLOSSARY.md`

**Âncora:**

```
- **`generateBuildImage`** — contrapartida em imagem dos mesmos três modos, **ainda não implementada** (Fase 3). Canvas API pura, sem dependência externa; esqueleto no `meta/legacy/GUIA_CORRECOES_FASE3.md`. Ver DEC-021.
```

**Substituir por:**

```
- **`generateBuildImage({ build, stats, lang, buildName, mode })`** — contrapartida em imagem dos três modos de exportação. Canvas puro, sem dependência externa (DEC-021), renderizado em 2x. Assíncrona: espera os ícones. Ver DEC-026.
- **`paintBuildImage(ctx, draw, args)`** — o layout da imagem, percorrido **duas vezes**: com `draw = false` mede, com `draw = true` desenha. É o que permite a altura exata. Quem mexer no layout mexe nos dois — é o mesmo código, de propósito.
- **`ultimateSummary(ult, L)`** — resumo do Supremo em uma linha, montado por classe. Usado pelo texto **e** pela imagem, para que não divirjam. Ver FIX-010.
```

---

## Parte 10 — `meta/CHANGELOG.md`

**Âncora:**

```
### Adicionado
- Fase 3 — `generateBuildImage` via Canvas API: código completo entregue em guia, pendente de aplicação em `App.jsx`.
```

**Substituir por:**

```
### Adicionado
- **Fase 3 — exportação em imagem.** Os três botões 🖼️ (Build, Detalhado, Estatístico) geram um PNG da build e disparam o download. Canvas puro, sem dependência externa; altura calculada a partir do conteúdo e renderização em 2x. Layout em duas colunas — habilidade e vantagens à esquerda, equipamentos à direita — com faixa de estatísticas no modo Estatístico, ícones do jogo em cada linha e as cores da classe ativa.
```

**Âncora** (primeira linha da subseção «### Corrigido»):

```
- Picada Celestial não obrigava o Ronin a gastar o perk de desbloqueio, ao contrário da Zarabatana (FIX-009)
```

**Substituir por:**

```
- No texto exportado, a recarga das Armas Fantasma não aparecia e o Supremo saía sem a contagem de golpes nem o bônus de dano (FIX-010)
- Picada Celestial não obrigava o Ronin a gastar o perk de desbloqueio, ao contrário da Zarabatana (FIX-009)
```

---

## Parte 11 — `meta/STATUS.md`

### 11.1 — Fechar o item do backlog

**Âncora:**

```
- [ ] Implementar `generateBuildImage` (Fase 3)
```

**Substituir por:**

```
- [x] ~~Implementar `generateBuildImage` (Fase 3)~~ — **feito em 2026-07-25** (spec0014), com os oito defeitos da DEC-026 corrigidos.
```

### 11.2 — Registrar a sessão

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo: Fase 3.** O rascunho já está no mount; nada a mexer no `.flatdropignore`.
```

**Substituir por:**

```
**Próximo passo: Fase 3.** O rascunho já está no mount; nada a mexer no `.flatdropignore`.

---

**2026-07-25 (3) — Fase 3 entregue. `meta/legacy/` encerrada.**

`generateBuildImage` implementada a partir do plano auditado, e não do guia. Os sete defeitos catalogados na DEC-026 foram corrigidos, e **um oitavo apareceu durante a escrita** — o mais interessante do lote, porque não estava no código novo.

**A arquitetura foi validada antes de virar código.** O layout foi simulado com build cheia e descrições longas: as duas passadas devolvem altura idêntica nos três modos, a passada de medição não pinta nada, e o D2 se mostrou pior do que a auditoria supunha. Com cinco slots preenchidos, o modo **Detalhado** precisa de cerca de **1340 px** contra os **560 fixos** do guia — cortaria quase 60% do conteúdo. A build vazia precisa de ~170 px contra os mesmos 560, ou seja quase 400 px de faixa morta. O corte era a regra, não a exceção.

**FIX-010 — o oitavo defeito, e ele estava na Fase 2.** Ao comparar o código do guia com o `generateBuildText`, os dois liam a recarga das Armas Fantasma de chaves diferentes. `logic.js` decidiu a favor do guia: as chaves são `stats.gw1` / `stats.gw2`, e o `generateBuildText` lia `gw1Cooldown` / `gw2Cooldown` — que não existem. **A recarga nunca apareceu em nenhum texto exportado.** Puxando o fio, o bloco do Supremo tinha o mesmo problema: lia `ult.hits` e `ult.dPT`, que também não existem, então saía só nome e custo. A Caçadora era a única classe completa, por acaso — `ult.targets` existe.

Terceira vez que uma chave errada some com informação em silêncio aqui (FIX-005 foi a primeira). O padrão é sempre o mesmo: **a exportação não tem quem reclame**, porque nada quebra — o texto sai bonito e incompleto.

**`meta/legacy/` encerrada.** O `GUIA_CORRECOES_FASE3.md` era o último arquivo e cumpriu o papel de rascunho: a auditoria dele rendeu sete defeitos catalogados, o oitavo veio da comparação com o código, e o que estava certo foi aproveitado. Pela DEC-025, sai. A pasta e seu `README.md` saem junto — o que aconteceu ali está na DEC-011, na DEC-012, na DEC-025 e na seção 9 do `HISTORY.md`, e o corpo dos arquivos segue no Git.

**Próximo passo — e agora há uma escolha real.** A F4 (polimento e mobile) é a fase seguinte no `ROADMAP.md`. Mas há uma decisão marcada para agora: com a imagem funcionando, dá para comparar os dois formatos do modo Estatístico lado a lado e decidir o destino dele (DEC-024). Vale fazer isso antes de abrir a F4 — é a informação que estava faltando, e ela chegou.
```

---

## Parte 12 — Encerrar `meta/legacy/`

**Só depois de as Partes 7 a 11 aparecerem no `git diff`, e do commit de código da Parte 6.**

```
git rm meta/legacy/GUIA_CORRECOES_FASE3.md
git rm meta/legacy/README.md
```

Os dois seguem recuperáveis pelo histórico. A pasta deixa de existir.

---

## Parte 13 — `.flatdropignore`

> **Verifique o final de linha do arquivo e preserve o que encontrar.**

A linha do `README.md` de `legacy/` passa a apontar para um arquivo inexistente.

**Âncora** (o bloco inteiro):

```
# >>> flatdrop-editor
logs/
INSTRUCOES-DO-PROJETO.md
meta/legacy/README.md
# <<<
```

**Substituir por:**

```
# >>> flatdrop-editor
logs/
INSTRUCOES-DO-PROJETO.md
# <<<
```

Se o editor gráfico do FlatDrop for aberto depois disto, ele reescreve o bloco a partir das caixas marcadas — nesse caso, desmarque `meta/legacy/README.md` lá em vez de editar à mão.

---

## Parte 14 — `logs/2026-07-25.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 3 — Fase 3: `generateBuildImage`

### Objetivo da sessão
Implementar a Fase 3 seguindo o plano auditado da DEC-026 e encerrar `meta/legacy/`.

### Feito
- Escrito `generateBuildImage` com arquitetura de duas passadas, mais `paintBuildImage`, `makePainter`, `loadBuildIcons`, `slotItemForImage`, `ultimateSummary` e `loadImg`.
- **Arquitetura validada por simulação antes de virar código**: altura idêntica nas duas passadas nos três modos; passada de medição sem pintura; números do D2 confirmados (Detalhado ~1340 px contra 560 fixos).
- Conferidas contra `logic.js` as chaves do Supremo por classe (`strikes`, `targets`, `variants`) e as de recarga (`stats.gw1` / `gw2`).
- **FIX-010** — dois defeitos silenciosos encontrados no `generateBuildText` e corrigidos.
- Entregue a `spec0014`.

### Specs entregues / aplicadas
- `260725-spec0014-fase3-geracao-de-imagem.md` — implementa a Fase 3, corrige o FIX-010, fecha a F3 no ROADMAP, atualiza GLOSSARY, CHANGELOG e STATUS, e remove `meta/legacy/`.

### Decisões
- Nenhuma nova. A DEC-026 ganhou o desfecho.

### Bugs
- **FIX-010** — recarga das Armas Fantasma e resumo do Supremo sumiam do texto exportado. Três chaves inexistentes lidas como `undefined` e engolidas por guardas `!= null`.

### Aprendizados / armadilhas
- **Divergência entre duas implementações do mesmo dado é o achado.** Guia e `generateBuildText` liam a recarga de chaves diferentes; ir à fonte (`logic.js`) decidiu, e revelou um bug em produção.
- **A exportação não tem quem reclame.** Terceira vez que uma chave errada some com informação em silêncio: nada quebra, o texto sai bonito e incompleto. Vale conferir campo a campo contra a UI toda vez que a exportação mudar.
- **Simular layout antes de escrever compensa.** A medição aproximada mostrou que o D2 cortava quase 60% do conteúdo — números que transformaram "altura conservadora" em "requisito da fase".
- **Medir e desenhar precisam ser o mesmo código.** Duas funções separadas divergiriam na primeira alteração de layout; daí o pintor com o interruptor `draw`.

### Onde parei
Fase 3 entregue e `meta/legacy/` encerrada. F1, F2 e F3 concluídas.

### Próximos passos
1. **Decidir o destino do modo Estatístico** (DEC-024) — agora dá para comparar texto e imagem lado a lado. Era a informação que faltava.
2. F4 — polimento e mobile.
3. Backlog: destino de `getAvailableProps` / `getAvailablePerks`, duplicação de `selectTech` / `selectAbility`, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 15 — Fechamento

Rode `git diff`. O commit de código da Parte 6 já deve estar feito; agora o de documentação:

```
git add meta/DECISIONS.md meta/ROADMAP.md meta/GLOSSARY.md meta/CHANGELOG.md meta/STATUS.md .flatdropignore logs/2026-07-25.md meta/specs/260725-spec0014-fase3-geracao-de-imagem.md
git commit -m "docs(meta): registra a fase 3 entregue e o FIX-010"
git push
```

As remoções entram pelos `git rm` da Parte 12.
