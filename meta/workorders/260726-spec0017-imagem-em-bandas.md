# spec0017 — Fase 3, layout em bandas: a imagem passa a preencher o espaço

**Data:** 2026-07-26 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** a Fase 3 entregou uma imagem **correta e mal distribuída**. O autor aprovou a direção do refinamento — bandas de largura total com cartões, em vez de duas colunas de altura livre. Esta spec reescreve o layout.

**O defeito que ela corrige, em números.** As duas colunas nunca podiam bater: no modo Build a esquerda tem cerca de sete linhas e a direita trinta, então a metade inferior esquerda fica vazia por construção. Não é um caso extremo — é o formato do conteúdo. Nenhum ajuste de proporção resolve, porque a razão entre os dois lados muda com a build.

**O que muda:**
1. **Bandas.** Cabeçalho · habilidade e vantagens · equipamentos · estatísticas. Cada faixa ocupa a largura toda e distribui seus cartões numa grade própria. Nenhuma seção depende da altura de outra.
2. **Cartões com borda** — a "caixas e formatação" que o pedido original descrevia e que a versão anterior não entregou. Magistral ganha borda dourada.
3. **Faixa de sinais vitais no cabeçalho** — HP, Determinação e o contador de Magistrais, que são a primeira coisa que a interface mostra e **não estavam na imagem em modo nenhum**.
4. **Cartão descrito como dados.** Cada cartão é uma lista de blocos (`label`, `head`, `xp`, `bullet`, `desc`) renderizada por um caminho só. Os três modos passam a ser uma questão de quais blocos entram.

**Validado por simulação antes de virar spec**, com o mesmo método da `spec0014`:

| | Build | Detalhado | Estatístico |
|---|---|---|---|
| Build cheia | 720 px | 1372 px | 1514 px |
| Build vazia | 244 px | 244 px | 386 px |
| Build parcial | 434 px | 696 px | 838 px |

As duas passadas devolvem **altura idêntica** nos três modos e nos três preenchimentos, e a passada de medição não pinta nada. Os números são de uma medição aproximada de texto — na tela vão diferir, mas a proporção é a que importa: a altura acompanha o conteúdo em vez de acompanhar o modo.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 6.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**
- As Partes 3 e 4 substituem **funções inteiras**. Cada uma dá a âncora de início e a de fim; substitua tudo entre as duas, **inclusive**.

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. A árvore deve estar **limpa** (a `spec0016` fechou com push). Se houver modificação pendente, **PARE e reporte**.
3. Confirme que a base está como o esperado:

```
grep -c "isSvgIcon" src/App.jsx              # deve ser 2 (spec0016 aplicada)
grep -c "checkLegendaryLimit" src/App.jsx    # deve ser >= 2 (ja importado)
```

Se `checkLegendaryLimit` não estiver importado no `App.jsx`, **PARE e reporte** — o cabeçalho novo depende dele.

---

## Parte 2 — `src/App.jsx`: constantes de layout

**Âncora** (do comentário até a última constante):

```
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
```

**Substituir por:**

```
// CONSTANTES DE LAYOUT — em unidades lógicas. A renderização sai em 2x (D4),
// então ajuste estes valores à vontade sem pensar em resolução.
const IMG_W          = 900   // largura lógica da imagem
const IMG_PAD        = 28    // margem interna
const IMG_HEADER_H   = 92    // faixa do cabeçalho (cabe o nome e os sinais vitais)
const IMG_GAP        = 14    // espaço entre cartões e entre bandas
const IMG_CARD_PAD   = 12    // respiro interno do cartão
const IMG_ICON_SMALL = 18    // ícones de linha
const IMG_ICON_CARD  = 26    // ícone dentro do cartão
const IMG_ICON_ULT   = 46    // ícone do supremo, no cabeçalho
const IMG_FOOTER_H   = 30    // faixa reservada para a assinatura
const IMG_SCALE      = 2     // fator de supersampling — 1 = borrado em tela retina
const IMG_FONT       = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
```

> `IMG_COL_SPLIT` deixa de existir: não há mais duas colunas para dividir.

---

## Parte 3 — `src/App.jsx`: substituir `makePainter` por inteiro

O pintor ganha três métodos — `card` (retângulo arredondado), `right` (texto alinhado à direita) — e a opção `dry` em `text`, que permite **medir uma linha durante a passada de desenho** sem duplicar a lógica de quebra. É o `dry` que torna possível alinhar cartões vizinhos pela altura do mais alto antes de desenhar qualquer um.

**Âncora de início:**

```
function makePainter(ctx, draw) {
```

**Âncora de fim:**

```
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
```

**Substituir tudo entre as duas, inclusive, por:**

```jsx
/**
 * Pintor: a mesma interface serve para medir e para desenhar.
 *
 * Com `draw = false` nada é pintado, mas as alturas devolvidas são idênticas —
 * é o que permite calcular a altura final antes de criar o canvas definitivo.
 * A opção `dry` de `text` permite medir uma linha durante a passada de desenho,
 * sem duplicar a lógica de quebra: medir e desenhar continuam sendo o MESMO
 * caminho de código, que é o que impede os dois de divergirem.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} draw
 */
function makePainter(ctx, draw) {
  return {
    /**
     * Escreve um texto com quebra automática por palavra.
     * @param {Object} o
     * @param {boolean} [o.dry] - só mede, não pinta, mesmo na passada de desenho
     * @returns {number} altura ocupada, em unidades lógicas
     */
    text(txt, x, y, { font, color, maxW = Infinity, lineH = 16, dry = false }) {
      if (txt == null || txt === '') return 0
      ctx.font = font
      let line = ''
      let dy   = 0
      const flush = () => {
        if (!line) return
        if (draw && !dry) { ctx.fillStyle = color; ctx.fillText(line, x, y + dy) }
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

    /** Largura de um texto numa dada fonte. */
    width(txt, font) {
      ctx.font = font
      return ctx.measureText(String(txt)).width
    },

    /**
     * Desenha um ícone.
     *
     * O filtro do tema vem do TIPO do arquivo, marcado no `loadImg`: SVG é
     * monocromático e precisa dele; PNG já vem colorido e com filtro viraria
     * retângulo sólido (armadilhas 3 e 15).
     */
    icon(img, x, yTop, size) {
      if (!draw || !img) return
      const invert = img.isSvgIcon && !!T.iconFilter
      if (invert) ctx.filter = T.iconFilter
      ctx.drawImage(img, x, yTop, size, size)
      if (invert) ctx.filter = 'none'
    },

    rect(x, y, w, h, color) {
      if (!draw) return
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    },

    /** Cartão: retângulo arredondado com preenchimento e borda. */
    card(x, y, w, h, fill, stroke) {
      if (!draw) return
      const r = 8
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.arcTo(x + w, y, x + w, y + r, r)
      ctx.lineTo(x + w, y + h - r)
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h)
      ctx.arcTo(x, y + h, x, y + h - r, r)
      ctx.lineTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      ctx.closePath()
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = stroke
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
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

    right(txt, rx, y, { font, color }) {
      if (!draw || !txt) return
      ctx.save()
      ctx.textAlign = 'right'
      ctx.font      = font
      ctx.fillStyle = color
      ctx.fillText(String(txt), rx, y)
      ctx.restore()
    },
  }
}
```

---

## Parte 4 — `src/App.jsx`: substituir `paintBuildImage` e acrescentar os montadores

**Âncora de início:**

```
/**
 * Percorre o layout inteiro da imagem, medindo ou desenhando.
```

**Âncora de fim:**

```
  return y + IMG_FOOTER_H
}
```

**Substituir tudo entre as duas, inclusive, por:**

```jsx
/**
 * Mede ou desenha o conteúdo de um cartão, a partir da lista de blocos.
 *
 * O cartão é DESCRITO como dados (`blocks`) e renderizado por um caminho só.
 * É isso que faz a altura reservada ser sempre a altura usada, e é isso que
 * permite alinhar cartões vizinhos pela altura da linha antes de desenhar
 * qualquer um deles.
 *
 * Tipos de bloco:
 *   `label`  rótulo pequeno e apagado (tier, nome do slot)
 *   `head`   ícone + nome, com selo opcional à direita do nome
 *   `xp`     texto de sabor do Magistral, em itálico
 *   `bullet` item de lista (propriedade ou vantagem)
 *   `desc`   descrição recuada e apagada
 *
 * @returns {number} altura do conteúdo, sem o respiro do cartão
 */
function paintCardBlocks(pen, blocks, x, y, w, icons, C) {
  let dy = 0
  for (const b of blocks) {
    switch (b.k) {
      case 'label':
        pen.text(b.t, x, y + dy + 9, { font: `600 9px ${IMG_FONT}`, color: C.dim, lineH: 0 })
        dy += 15
        break

      case 'head': {
        const img  = b.icon ? icons[b.icon] : null
        const size = b.size || IMG_ICON_CARD
        const tx   = x + size + 8
        const font = `700 ${b.fs}px ${IMG_FONT}`
        const badgeFont = `400 11px ${IMG_FONT}`
        // O selo de recarga ocupa espaço na mesma linha do nome — descontar
        // antes de medir, senão o nome quebra por baixo dele.
        const badgeW = b.badge ? pen.width(` ${b.badge}`, badgeFont) : 0
        const tw     = w - size - 8 - badgeW
        const textH  = pen.text(b.t, tx, 0, { font, maxW: tw, lineH: b.fs + 5, dry: true })
        const rowH   = Math.max(size, textH)
        pen.icon(img, x, y + dy + (rowH - size) / 2, size)
        const base = y + dy + (rowH - textH) / 2 + b.fs
        pen.text(b.t, tx, base, { font, color: b.color, maxW: tw, lineH: b.fs + 5 })
        // Selo alinhado à DIREITA do cartão. A largura dele já foi descontada
        // de `tw`, então os dois nunca se encontram — inclusive quando o nome
        // quebra em duas linhas, caso em que colar o selo no fim do texto o
        // jogaria por cima da segunda linha.
        if (b.badge) {
          pen.right(b.badge, x + w, y + dy + rowH / 2 + 4,
            { font: badgeFont, color: C.muted })
        }
        dy += rowH + 4
        break
      }

      case 'xp':
        dy += pen.text(b.t, x, y + dy + 10,
          { font: `italic 400 10px ${IMG_FONT}`, color: C.leg, maxW: w, lineH: 14 })
        dy += 3
        break

      case 'bullet':
        dy += pen.text(`• ${b.t}`, x, y + dy + 11,
          { font: `400 11px ${IMG_FONT}`, color: C.text, maxW: w, lineH: 15 })
        break

      case 'desc':
        dy += pen.text(b.t, x + 10, y + dy + 10,
          { font: `400 10px ${IMG_FONT}`, color: C.dim, maxW: w - 10, lineH: 13 })
        dy += 2
        break
    }
  }
  return dy
}

/**
 * Desenha uma banda: título, divisor e uma grade de cartões.
 *
 * Todos os cartões de uma linha recebem a altura do mais alto — é o que dá o
 * alinhamento de grade e o que impede o "degrau" entre vizinhos.
 *
 * @param {Object} pen - pintor da passada corrente
 * @param {Object} mp  - pintor de medição (sempre `draw = false`)
 * @returns {number} o `y` logo abaixo da banda
 */
function paintBand(pen, mp, { title, cards, cols, x, y, w, icons, C }) {
  if (!cards.length) return y

  pen.text(title, x, y + 10, { font: `700 10px ${IMG_FONT}`, color: C.muted, lineH: 0 })
  y += 16
  pen.divider(x, y, x + w, C.border)
  y += IMG_GAP

  const colW   = (w - IMG_GAP * (cols - 1)) / cols
  const innerW = colW - IMG_CARD_PAD * 2

  // Mede todos antes de desenhar qualquer um — a altura da linha é a do mais
  // alto, e ela precisa ser conhecida antes de pintar a borda do primeiro.
  const heights = cards.map(c => paintCardBlocks(mp, c.blocks, 0, 0, innerW, icons, C))

  for (let i = 0; i < cards.length; i += cols) {
    const row  = cards.slice(i, i + cols)
    const rowH = Math.max(...heights.slice(i, i + cols)) + IMG_CARD_PAD * 2
    row.forEach((c, j) => {
      const cx = x + j * (colW + IMG_GAP)
      pen.card(cx, y, colW, rowH, C.card, c.accent || C.border)
      paintCardBlocks(pen, c.blocks, cx + IMG_CARD_PAD, y + IMG_CARD_PAD, innerW, icons, C)
    })
    y += rowH + IMG_GAP
  }
  return y
}

/**
 * Monta os cartões da banda de habilidade e vantagens.
 * São sempre quatro posições: a habilidade de classe e os três tiers.
 * Posição vazia vira cartão apagado, para a grade não perder o alinhamento.
 */
function abilityCards({ build, stats, cls, L, withDesc, C }) {
  const out = []

  const ab = cls.abilities.find(a => a.id === build.abilityId)
  if (ab) {
    const cd = stats?.abilityCooldown?.finalCd ?? ab.cd
    out.push({ accent: C.cls, blocks: [
      { k: 'label', t: L ? 'Class Ability' : 'Habilidade' },
      { k: 'head', t: L ? (ab.nEN || ab.nPT) : ab.nPT, icon: 'ability', fs: 12,
        color: C.cls, badge: `${cd}s` },
      ...(withDesc ? [{ k: 'desc', t: L ? (ab.dEN || ab.dPT) : ab.dPT }] : []),
    ]})
  } else {
    out.push({ blocks: [
      { k: 'label', t: L ? 'Class Ability' : 'Habilidade' },
      { k: 'head', t: '—', fs: 12, color: C.dim, size: 4 },
    ]})
  }

  for (const tier of ['I', 'II', 'III']) {
    const techId = build.techs?.[tier]
    const tech   = techId ? cls.techs.find(t => t.id === techId) : null
    const label  = L ? `Perk ${tier}` : `Vantagem ${tier}`
    if (!tech) {
      out.push({ blocks: [
        { k: 'label', t: label },
        { k: 'head', t: '—', fs: 12, color: C.dim, size: 4 },
      ]})
      continue
    }
    out.push({ blocks: [
      { k: 'label', t: label },
      { k: 'head', t: L ? (tech.nEN || tech.nPT) : tech.nPT, icon: `tech_${tier}`,
        fs: 12, color: C.text },
      ...(withDesc ? [{ k: 'desc', t: L ? (tech.dEN || tech.dPT) : tech.dPT }] : []),
    ]})
  }
  return out
}

/**
 * Monta os cartões de equipamento. Slot vazio não vira cartão — ao contrário
 * das vantagens, aqui a ausência não precisa de espaço reservado.
 */
function gearCards({ build, stats, L, withDesc, C }) {
  const labels = {
    katana: L ? 'Katana'          : 'Katana',
    ranged: L ? 'Ranged Weapon'   : 'Longo Alcance',
    charm:  L ? 'Charm'           : 'Amuleto',
    gw1:    L ? 'Ghost Weapon I'  : 'Arma Fantasma I',
    gw2:    L ? 'Ghost Weapon II' : 'Arma Fantasma II',
  }
  const out = []

  for (const slot of ['katana', 'ranged', 'charm', 'gw1', 'gw2']) {
    // Amuleto pelo item EFETIVO — sem isto as props de classe de um Magistral
    // com classBinding somem da imagem sem erro (armadilha 7).
    const item = slotItemForImage(build, slot)
    if (!item) continue
    const st = build.gear[slot]

    // Recarga: as chaves sao `stats.gw1` / `stats.gw2` (FIX-010)
    const cd = slot === 'gw1' ? stats?.gw1?.finalCd
             : slot === 'gw2' ? stats?.gw2?.finalCd
             : null

    const blocks = [
      { k: 'label', t: labels[slot] },
      { k: 'head', t: (L ? (item.nEN || item.nPT) : item.nPT) + (item.leg ? '  ★' : ''),
        icon: `gear_${slot}`, fs: 13, color: item.leg ? C.leg : C.text,
        badge: cd != null ? `${cd}s` : null },
    ]

    if (withDesc && item.leg && item.xp) {
      blocks.push({ k: 'xp', t: L ? (item.xp.en || item.xp.pt) : item.xp.pt })
    }

    for (const ps of ['p1', 'p2']) {
      const pState = st[ps]
      if (!pState?.propId) continue
      const def = item.props?.find(p => p.id === pState.propId)
      if (!def) continue
      blocks.push({ k: 'bullet',
        t: `${L ? (def.nEN || def.nPT) : def.nPT}: ${formatStatValue(pState.value, def.u)}` })
      if (withDesc) blocks.push({ k: 'desc', t: L ? (def.dEN || def.dPT) : def.dPT })
    }

    for (const pk of ['perk1', 'perk2']) {
      const perkId = st[pk]
      if (!perkId) continue
      const def = item.perks?.find(p => p.id === perkId)
      if (!def) continue
      blocks.push({ k: 'bullet', t: L ? (def.nEN || def.nPT) : def.nPT })
      if (withDesc) blocks.push({ k: 'desc', t: L ? (def.dEN || def.dPT) : def.dPT })
    }

    out.push({ accent: item.leg ? C.leg : null, blocks })
  }
  return out
}

/**
 * Percorre o layout inteiro da imagem, medindo ou desenhando.
 *
 * LAYOUT EM BANDAS (DEC-027). O desenho é uma pilha de faixas de largura
 * total — cabeçalho, habilidade e vantagens, equipamentos, estatísticas — e
 * cada faixa distribui seus cartões numa grade própria. Nenhuma seção depende
 * de ter a mesma altura que outra, que era o defeito do layout de duas
 * colunas: no modo Build a esquerda tinha um quarto da altura da direita.
 *
 * Chamada duas vezes por geração: mede, depois desenha. O fundo e a
 * assinatura ficam fora daqui, porque dependem da altura final.
 *
 * @returns {number} altura total do conteúdo, já com a faixa do rodapé
 */
function paintBuildImage(ctx, draw, { build, stats, lang, buildName, mode, icons }) {
  const L   = lang === 'en'
  const cls = getClass(build.classId)
  const pen = makePainter(ctx, draw)
  const mp  = makePainter(ctx, false)   // pintor de medição

  const C = {
    bg: T.bg, card: T.card, border: T.border, text: T.text,
    muted: T.muted, dim: T.dim, leg: T.leg, green: T.green,
    cls: T.cls[build.classId],
  }
  const withDesc  = mode === 'detailed' || mode === 'stats'
  const withStats = mode === 'stats'
  const innerW    = IMG_W - IMG_PAD * 2

  // ── Cabeçalho ──────────────────────────────────────────────
  pen.rect(0, 0, IMG_W, IMG_HEADER_H, C.cls + '22')
  pen.rect(0, IMG_HEADER_H - 1, IMG_W, 1, C.cls + '55')

  const clsIcon = 34
  pen.icon(icons.cls, IMG_PAD, (IMG_HEADER_H - clsIcon) / 2, clsIcon)

  const clsName = L ? (cls.nEN || cls.nPT) : cls.nPT
  const tx = IMG_PAD + clsIcon + 14
  pen.text(buildName?.trim() || clsName, tx, 44,
    { font: `800 20px ${IMG_FONT}`, color: C.text, lineH: 0 })

  // Faixa de sinais vitais: o que a interface mostra no topo e que a imagem
  // não trazia em modo nenhum — HP, Determinação e o contador de Magistrais.
  const leg  = checkLegendaryLimit(build)
  const bits = [
    buildName?.trim() ? clsName : null,
    `HP ${stats?.maxHP ?? 100}`,
    `${L ? 'Resolve' : 'Det.'} ${stats?.maxResolve ?? 3}`,
    `${'★'.repeat(leg.used)}${'☆'.repeat(Math.max(0, leg.limit - leg.used))} ${leg.used}/${leg.limit}`,
  ].filter(Boolean)
  pen.text(bits.join('   ·   '), tx, 66,
    { font: `500 11px ${IMG_FONT}`, color: C.muted, lineH: 0 })

  // Supremo, à direita. PNG — nunca com filtro (armadilha 3).
  const ultX = IMG_W - IMG_PAD - IMG_ICON_ULT
  pen.icon(icons.supreme, ultX, 8, IMG_ICON_ULT)
  if (stats?.ultimate) {
    const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
    pen.centered(uName, ultX + IMG_ICON_ULT / 2, 8 + IMG_ICON_ULT + 13,
      { font: `600 10px ${IMG_FONT}`, color: C.cls })
  }

  let y = IMG_HEADER_H + IMG_PAD

  // ── Banda 1 — habilidade e vantagens ───────────────────────
  y = paintBand(pen, mp, {
    title: L ? 'CLASS ABILITY & PERKS' : 'HABILIDADE & VANTAGENS',
    cards: abilityCards({ build, stats, cls, L, withDesc, C }),
    cols: 4, x: IMG_PAD, y, w: innerW, icons, C,
  })

  // ── Banda 2 — equipamentos ─────────────────────────────────
  y = paintBand(pen, mp, {
    title: L ? 'GEAR' : 'EQUIPAMENTOS',
    cards: gearCards({ build, stats, L, withDesc, C }),
    cols: 2, x: IMG_PAD, y: y + 4, w: innerW, icons, C,
  })

  // ── Banda 3 — estatísticas (somente modo Estatístico) ──────
  if (withStats && stats) {
    pen.text(L ? 'STATISTICS' : 'ESTATÍSTICAS', IMG_PAD, y + 14,
      { font: `700 10px ${IMG_FONT}`, color: C.muted, lineH: 0 })
    y += 20
    pen.divider(IMG_PAD, y, IMG_W - IMG_PAD, C.border)
    y += IMG_GAP

    const ultLine = ultimateSummary(stats.ultimate, L)
    const rows = [
      // HP e Determinação SEMPRE, mesmo no valor base (DEC-022). Aparecem
      // também na faixa do cabeçalho, de propósito: lá são sinais vitais em
      // todos os modos, aqui são linha da tabela.
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
    const colW  = innerW / cols
    const rowsH = Math.ceil(rows.length / cols) * 18
    const ultH  = ultLine ? 34 : 0
    pen.card(IMG_PAD, y, innerW, ultH + rowsH + IMG_CARD_PAD * 2, C.card, C.border)

    let cy = y + IMG_CARD_PAD
    if (ultLine) {
      const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
      pen.text(`${L ? 'Ultimate' : 'Supremo'}: ${uName}`, IMG_PAD + IMG_CARD_PAD, cy + 12,
        { font: `700 12px ${IMG_FONT}`, color: C.cls, lineH: 0 })
      pen.text(ultLine, IMG_PAD + IMG_CARD_PAD, cy + 28,
        { font: `400 11px ${IMG_FONT}`, color: C.muted, lineH: 0 })
      cy += ultH
    }

    const lblFt = `400 11px ${IMG_FONT}`
    const valFt = `700 11px ${IMG_FONT}`
    rows.forEach((row, i) => {
      const rx = IMG_PAD + IMG_CARD_PAD + (i % cols) * colW
      const ry = cy + Math.floor(i / cols) * 18 + 11
      pen.text(`${row.label}:`, rx, ry, { font: lblFt, color: C.muted, lineH: 0 })
      pen.text(row.value, rx + pen.width(`${row.label}: `, lblFt), ry,
        { font: valFt, color: C.green, lineH: 0 })
    })
    y += ultH + rowsH + IMG_CARD_PAD * 2
  } else {
    y -= IMG_GAP   // a última banda já somou um espaçamento que aqui sobra
  }

  return y + IMG_FOOTER_H
}
```

> O bloco novo é maior porque traz quatro funções onde havia uma: `paintCardBlocks` (renderiza os blocos de um cartão), `paintBand` (título, divisor e grade), `abilityCards` e `gearCards` (montam os dados), e o `paintBuildImage` reescrito.

---

## Parte 5 — Nada mais em `src/`

`loadImg`, `slotItemForImage`, `ultimateSummary`, `loadBuildIcons` e `generateBuildImage` **não mudam**. Se o `git diff` mostrar qualquer uma delas alterada, **PARE**.

---

## Parte 6 — Build e conferência

Rode `npm run build`. Se falhar, **PARE**.

No dev server:

**O defeito que a spec existe para corrigir**
1. **Build cheia, 🖼️ Build** — a imagem é uma pilha de bandas, **sem coluna vazia** e sem área morta no pé. Era o defeito.
2. **Build vazia** (só a classe) — a imagem sai **curta**, com os quatro cartões de vantagem marcados `—` e sem a banda de equipamentos.
3. **Build parcial** (uma katana e uma vantagem) — altura intermediária, nada esticado.

**Grade e cartões**
4. Na banda de vantagens, os **quatro cartões da linha têm a mesma altura**, mesmo com descrições de tamanhos diferentes. Na de equipamentos, o mesmo para cada par.
5. **Magistral tem borda dourada**; item comum, borda neutra.
6. **Selo de recarga** (`[Xs]`) alinhado à direita do cartão, **sem encostar no nome**, inclusive quando o nome quebra em duas linhas. Confira com um item de nome longo.

**Cabeçalho**
7. A faixa mostra **HP, Determinação e o contador de Magistrais** (`★★ 2/2`), e eles batem com o topo da interface.
8. Com nome de build salvo, o nome aparece grande e a classe entra na faixa de baixo; **sem nome**, a classe aparece grande e não se repete embaixo.

**Não-regressão**
9. Os cinco ícones de equipamento aparecem nos **dois temas** (FIX-012 não pode regredir).
10. Ícones de técnica e do supremo **continuam dourados**, não viraram retângulo sólido (armadilha 3).
11. **Amuleto Magistral com `classBinding`**: as propriedades de classe aparecem na imagem (armadilha 7).
12. **Modo Estatístico**: HP e Determinação na tabela mesmo sem bônus, e só as demais que mudaram (DEC-022).
13. **PT e EN**, e a imagem ampliada a 200% continua nítida.

Se todos passarem:

```
git add src/App.jsx
git commit -m "feat(export): redesenha a imagem da build em bandas com cartoes"
```

Não faça `push` ainda.

---

## Parte 7 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim do FIX-013):

```
O defeito não apareceu na simulação de altura da `spec0014` porque **as duas passadas concordavam**: a sobreposição é colisão dentro de uma linha, não erro de altura acumulada. Medir bem a altura não diz nada sobre colisão dentro da faixa medida.
```

**Substituir por:**

```
O defeito não apareceu na simulação de altura da `spec0014` porque **as duas passadas concordavam**: a sobreposição é colisão dentro de uma linha, não erro de altura acumulada. Medir bem a altura não diz nada sobre colisão dentro da faixa medida.

---

## DEC-027 — A imagem da build é organizada em bandas, não em colunas

**Data:** 2026-07-26 · **Status:** aceita, em vigor · **Substitui** a disposição descrita no pedido original

### O problema
A primeira versão da Fase 3 dispôs o conteúdo em duas colunas de altura livre: habilidade e vantagens à esquerda, equipamentos à direita. **As duas nunca podiam bater.** No modo Build a esquerda tem cerca de sete linhas e a direita trinta — cinco equipamentos com quatro itens cada. A metade inferior esquerda fica vazia por construção, e nenhum ajuste de proporção resolve, porque a razão entre os dois lados muda a cada build.

Isso contrariava o pedido em dois pontos escritos: *"podendo preencher bem o espaço da imagem"* e *"com caixas e formatação, e não só o texto bruto um atrás do outro"*.

### A decisão
O desenho passa a ser uma pilha de **bandas de largura total** — cabeçalho, habilidade e vantagens, equipamentos, estatísticas —, e cada banda distribui seus cartões numa grade própria: quatro colunas para as vantagens, duas para os equipamentos. **Nenhuma seção depende de ter a mesma altura que outra**, que era a origem do problema.

Dentro de uma linha da grade, todos os cartões recebem a altura do mais alto. É o que dá o alinhamento e o que evita o degrau entre vizinhos.

### A alternativa rejeitada — três colunas
O pedido original descrevia três colunas: *"Habilidades e vantagens em uma coluna, equipamentos em outra, e estatísticas em outra"*. Aquilo vinha da tela, onde cada coluna rola por conta própria e altura desigual não custa nada. **Numa imagem de altura fixa, custa** — e três colunas desiguais seria pior que duas, não melhor.

O autor foi consultado e escolheu as bandas, com uma observação que vale registrar: *"não precisa seguir meu pedido original, pois foi justamente o que pedi, que você pesquisasse e refinasse, não que aceitasse cegamente o que cogitei"*.

### O cartão como dados
Cada cartão é descrito como uma lista de blocos — `label`, `head`, `xp`, `bullet`, `desc` — e renderizado por `paintCardBlocks`, num caminho só. Duas consequências: os três modos viram uma questão de **quais blocos entram**, e a altura reservada é sempre a altura usada, porque medir e desenhar percorrem o mesmo código.

### O cabeçalho ganhou os sinais vitais
HP, Determinação e o contador de Magistrais são a primeira coisa que a interface mostra e **não apareciam na imagem em modo nenhum** — no Estatístico, HP e Determinação estavam no meio da lista. Agora estão na faixa do cabeçalho, nos três modos.

Eles **continuam também na tabela** do modo Estatístico, de propósito: a DEC-022 exige que apareçam ali mesmo no valor base, e a duplicação custa duas linhas. Se algum dia incomodar, tirar da tabela é uma linha — mas aí a DEC-022 precisa ser reescrita junto.

### Validação
Simulado antes de virar código, com o método da `spec0014`: as duas passadas devolvem altura idêntica nos três modos e em três preenchimentos (cheio, vazio, parcial), e a passada de medição não pinta nada. A altura passou a acompanhar o conteúdo em vez do modo — build vazia sai com 244 px onde a versão anterior reservava o mesmo de uma build cheia.
```

---

## Parte 8 — `meta/GLOSSARY.md`

**Âncora:**

```
- **`paintBuildImage(ctx, draw, args)`** — o layout da imagem, percorrido **duas vezes**: com `draw = false` mede, com `draw = true` desenha. É o que permite a altura exata. Quem mexer no layout mexe nos dois — é o mesmo código, de propósito.
```

**Substituir por:**

```
- **`paintBuildImage(ctx, draw, args)`** — o layout da imagem, percorrido **duas vezes**: com `draw = false` mede, com `draw = true` desenha. É o que permite a altura exata. Quem mexer no layout mexe nos dois — é o mesmo código, de propósito.
- **Banda** — faixa de largura total da imagem gerada (cabeçalho, vantagens, equipamentos, estatísticas). Cada uma distribui seus cartões numa grade própria e independe da altura das outras. Ver DEC-027.
- **Bloco de cartão** — unidade de conteúdo dentro de um cartão da imagem: `label`, `head`, `xp`, `bullet` ou `desc`. O cartão é descrito como uma lista de blocos e renderizado por `paintCardBlocks`; os três modos de exportação diferem só nos blocos que entram.
- **`paintBand(pen, mp, opts)`** — desenha uma banda: título, divisor e a grade de cartões. Recebe **dois** pintores: o da passada corrente e um de medição, porque a altura da linha precisa ser conhecida antes de pintar a borda do primeiro cartão.
```

---

## Parte 9 — `meta/CHANGELOG.md`

**Âncora** (a subseção «### Modificado» do «[Não lançado]»):

```
### Modificado
- No modo 2 Colunas, os nomes das vantagens de classe não quebram mais em duas linhas: a célula da grade passou de 190 px e o nome ganhou `nowrap`. O comentário anterior afirmava que 140 px já evitavam a quebra — não evitavam.
```

**Substituir por:**

```
### Modificado
- **A imagem da build foi redesenhada em bandas.** O layout de duas colunas deixava metade da imagem vazia — as duas nunca podiam ter a mesma altura. Agora são faixas de largura total com cartões em grade: habilidade e vantagens em quatro colunas, equipamentos em duas, estatísticas ao pé. Magistral ganha borda dourada, e o cabeçalho passou a mostrar HP, Determinação e o contador de Magistrais nos três modos (DEC-027)
- No modo 2 Colunas, os nomes das vantagens de classe não quebram mais em duas linhas: a célula da grade passou de 190 px e o nome ganhou `nowrap`. O comentário anterior afirmava que 140 px já evitavam a quebra — não evitavam.
```

---

## Parte 10 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
**Em aberto:** o refinamento de layout da imagem. O diagnóstico é que a imagem **não preenche o espaço** — no modo Build a coluna esquerda termina com metade da altura da direita — e que falta a "caixas e formatação" do pedido original. A direção foi apresentada ao autor com duas opções e aguarda escolha; ver o item no `IDEAS.md`.
```

**Substituir por:**

```
**Em aberto:** o refinamento de layout da imagem. O diagnóstico é que a imagem **não preenche o espaço** — no modo Build a coluna esquerda termina com metade da altura da direita — e que falta a "caixas e formatação" do pedido original. A direção foi apresentada ao autor com duas opções e aguarda escolha; ver o item no `IDEAS.md`.

---

**2026-07-26 — imagem redesenhada em bandas (DEC-027).**

O autor escolheu as bandas em vez das três colunas do pedido original, com a observação de que o pedido de refinamento existia justamente para não ser seguido cegamente.

O layout de duas colunas tinha um defeito estrutural, não de ajuste: no modo Build a esquerda tem ~7 linhas e a direita ~30, então a metade inferior esquerda ficava vazia **por construção**, e nenhuma proporção resolveria, porque a razão entre os lados muda a cada build. Agora são faixas de largura total, cada uma com sua grade: quatro colunas para as vantagens, duas para os equipamentos, estatísticas ao pé.

Três ganhos além da distribuição:
- **Cartões com borda**, a "caixas e formatação" que o pedido descrevia e a primeira versão não entregou. Magistral com borda dourada.
- **Sinais vitais no cabeçalho** — HP, Determinação e o contador de Magistrais, que não estavam na imagem em modo nenhum e são a primeira coisa que a interface mostra.
- **Cartão descrito como dados.** Uma lista de blocos renderizada por um caminho só; os três modos passam a ser uma questão de quais blocos entram, em vez de três trechos de desenho parecidos.

Validado por simulação antes de virar spec, com o método da `spec0014`: altura idêntica nas duas passadas nos três modos e em três preenchimentos. A altura passou a acompanhar o **conteúdo** em vez do modo — build vazia sai com 244 px onde antes se reservava o mesmo de uma cheia.

**Próximo passo: F4 — polimento e mobile.** A F3 está fechada, e com ela a última pendência de desenho da exportação.
```

---

## Parte 11 — `meta/IDEAS.md`

### 11.1 — Fechar a proposta

**Âncora:**

```
### 2026-07-25 — Refinar o layout da imagem gerada *(proposta, aguardando direção do autor)*
```

**Substituir por:**

```
### 2026-07-25 — Refinar o layout da imagem gerada *(aprovado e aplicado em 2026-07-26 — DEC-027)*
```

### 11.2 — Recuperar o feedback ao kit que se perdeu

A Parte 9.2 da `spec0016` não foi aplicada: a âncora já não existia, porque a seção tinha sido respondida numa sessão anterior. O item é bom demais para se perder por um endereço errado.

**Âncora** (título da seção de correções de processo):

```
## 🔧 Correções de processo — 2026-07-25
```

**Substituir por:**

```
## 🔧 Correções de processo

### 2026-07-26 — Hipótese de causa precisa vir com teste e com instrução de parada
A `spec0015` diagnosticou o FIX-012 a partir de capturas de tela e chegou à causa errada. O que impediu o estrago foi um portão escrito na própria spec: *rode este teste, interprete assim, e **pare** se contradisser*. O executor rodou, o resultado contradisse, ele parou e trouxe a causa real — sem aplicar código inútil.

**Regra que fica, e que vale para o kit:** quando a causa de um defeito é **hipótese** e não observação — porque quem escreveu a spec não pôde rodar o sistema —, a spec não deve mandar corrigir. Deve mandar **diagnosticar**, dizer o que cada resultado significa, e mandar parar na divergência. O custo é um passo a mais; o benefício é não gravar uma causa errada nos `meta/`, que é um estrago que sobrevive ao commit.

Nota complementar: a resposta certa já estava no `CONTEXT.md` deste projeto, na armadilha 15, escrita três specs antes. **Reler as armadilhas antes de formular uma hipótese** pertence ao ritual de diagnóstico, não ao de escrita.

*(Este item foi perdido uma vez: a `spec0016` o endereçou a uma âncora que já não existia, e o executor registrou a falha em vez de forçar um lugar próximo — que é o comportamento certo. Recuperado pela `spec0017`.)*

### Leva de 2026-07-25
```

---

## Parte 12 — `meta/ROADMAP.md`

**Âncora:**

```
## 🟢 F3 — Exportação de Imagem *(concluída em 2026-07-25)*
```

**Substituir por:**

```
## 🟢 F3 — Exportação de Imagem *(concluída em 2026-07-25; layout redesenhado em 2026-07-26, DEC-027)*
```

---

## Parte 13 — `logs/2026-07-26.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 2 — Redesenho da imagem em bandas

### Objetivo da sessão
Aplicar a direção de layout aprovada pelo autor: bandas de largura total com cartões, no lugar das duas colunas de altura livre.

### Feito
- Reescritos `makePainter` (com `card`, `right` e a opção `dry` em `text`) e `paintBuildImage`.
- Acrescentados `paintCardBlocks`, `paintBand`, `abilityCards` e `gearCards`.
- Cabeçalho ganhou a faixa de sinais vitais (HP, Determinação, contador de Magistrais).
- **Simulado antes de virar spec**: altura idêntica nas duas passadas, nos três modos e em três preenchimentos (cheio, vazio, parcial).
- Recuperado o item de feedback ao kit que a `spec0016` não conseguiu endereçar.

### Specs entregues / aplicadas
- `260726-spec0017-imagem-em-bandas.md` — redesenho do layout; DEC-027; termos novos no GLOSSARY; CHANGELOG, STATUS, ROADMAP e IDEAS atualizados.

### Decisões
- **DEC-027** — bandas em vez de colunas. A alternativa de três colunas, que era o pedido original, foi rejeitada com o motivo registrado: veio da tela, onde altura desigual não custa nada.

### Bugs
- Nenhum novo.

### Aprendizados / armadilhas
- **Duas colunas de altura livre nunca batem** quando o conteúdo dos dois lados tem formatos diferentes. Não é problema de proporção — a razão muda a cada build. Banda resolve porque nenhuma seção depende da altura de outra.
- **`dry` no pintor evita a duplicação que a arquitetura de duas passadas convida.** Medir uma linha durante a passada de desenho é necessário para alinhar cartões vizinhos; fazer isso com uma segunda função de medida teria criado a divergência que a DEC-026 existe para evitar.
- **Descrever o cartão como dados encolheu os três modos a uma diferença de lista.** Antes, cada modo era um caminho de desenho parecido com os outros.

### Onde parei
F3 fechada, com o layout redesenhado.

### Próximos passos
1. F4 — polimento e mobile.
2. Backlog: destino de `getAvailableProps` / `getAvailablePerks`, duplicação de `selectTech` / `selectAbility`, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 14 — Fechamento

Rode `git diff`. O commit de código da Parte 6 já deve estar feito; agora o de documentação:

```
git add meta/DECISIONS.md meta/GLOSSARY.md meta/CHANGELOG.md meta/STATUS.md meta/IDEAS.md meta/ROADMAP.md logs/2026-07-26.md meta/specs/260726-spec0017-imagem-em-bandas.md
git commit -m "docs(meta): registra a DEC-027 e o redesenho da imagem em bandas"
git push
```
