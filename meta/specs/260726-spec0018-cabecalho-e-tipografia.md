# spec0018 — Cabeçalho da imagem: sinais vitais reais, Supremo com informação, tipografia e ícones maiores

**Data:** 2026-07-26 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** com o layout em bandas de pé, o autor pediu quatro coisas — letras maiores, imagem mais nítida, ícones maiores, e um cabeçalho que use o espaço de verdade: barra de HP e círculos de Determinação como na interface (mas em cor uniforme), e o Supremo puxado para o centro com informação ao lado.

**O que o cabeçalho ganha, e por que sobrava espaço.** A faixa atual gasta 92 px para mostrar um ícone, um nome e uma linha de texto com HP e Determinação. Enquanto isso, a **descrição do Supremo existe em `data.js` e não aparece em lugar nenhum da imagem** — nem do texto, aliás. E as modificações que a build causa no Supremo (a Fúria a 300%, o Sopro ativo do Ronin, o dano dobrado do Assassino com Ofuscado) só saíam como números soltos.

**Uma pergunta em aberto, que não bloqueia:** o comando de ativação do Supremo. O mecanismo para desenhá-lo está pronto nesta spec — teclas desenhadas com os glifos `△ ◯ ✕ ☐ R1 L2` que o `data.js` já usa como texto, sem depender de imagem nova. Falta só o dado: `cls.ult.cmd`. Enquanto o campo não existir, **nada é desenhado e nada quebra**. Ver a Parte 9.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 6.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**
- As Partes 3, 4 e 5 substituem blocos inteiros, cada uma com âncora de início e de fim. Substitua tudo entre as duas, **inclusive**.

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. A árvore deve estar limpa, **exceto** por `meta/specs/260725-spec0015-correcoes-modal-e-imagem.md`, que está *untracked* desde a sessão da `spec0016`. **Ele entra no commit de documentação desta spec** (Parte 12) — spec é artefato versionado, e essa ficou de fora por acidente.
3. Se houver qualquer outra modificação pendente, **PARE e reporte**.

---

## Parte 2 — `src/App.jsx`: constantes, tipografia e sinais vitais

Três mudanças de fundo aqui:

- **`IMG_FS`** — todos os tamanhos de fonte num objeto só. Espalhá-los pelo desenho foi o que tornou este pedido um trabalho de garimpo; agora aumentar a imagem inteira é mexer num lugar.
- **`IMG_SCALE` de 2 para 3** e **`IMG_W` de 900 para 1000**. Mais pixels por unidade lógica e mais largura para o texto maior respirar.
- **Constantes da barra de HP e dos círculos**, com o motivo da cor única no comentário.

**Âncora de início:**

```
// CONSTANTES DE LAYOUT — em unidades lógicas. A renderização sai em 2x (D4),
```

**Âncora de fim:**

```
const IMG_FONT       = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
```

**Substituir tudo entre as duas, inclusive, por:**

```jsx
// CONSTANTES DE LAYOUT — em unidades lógicas. A renderização sai em 3x
// (IMG_SCALE), então ajuste estes valores sem pensar em resolução.
const IMG_W          = 1000  // largura lógica da imagem
const IMG_PAD        = 30    // margem interna
const IMG_HEADER_H   = 118   // faixa do cabeçalho (identidade + supremo)
const IMG_GAP        = 14    // espaço entre cartões e entre bandas
const IMG_CARD_PAD   = 13    // respiro interno do cartão
const IMG_ICON_CARD  = 34    // ícone dentro do cartão
const IMG_ICON_CLS   = 38    // ícone de classe, no cabeçalho
const IMG_ICON_ULT   = 56    // ícone do supremo, no cabeçalho
const IMG_FOOTER_H   = 32    // faixa reservada para a assinatura
const IMG_SCALE      = 3     // supersampling — 1 = borrado em tela retina
const IMG_FONT       = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

// TIPOGRAFIA — num lugar só, de propósito. Aumentar a imagem inteira é mexer
// aqui; espalhar tamanhos pelo desenho foi o que tornou o ajuste anterior um
// trabalho de garimpo.
const IMG_FS = {
  title:   22,  // nome da build
  cls:     11,  // classe, sob o nome
  ult:     16,  // nome do supremo
  ultInfo: 12,  // custo, golpes, bônus
  ultNote: 11,  // modificação textual do supremo
  band:    11,  // título da banda
  label:   10,  // rótulo do cartão (tier / slot)
  head:    14,  // nome no cartão de vantagem
  headGear:15,  // nome no cartão de equipamento
  badge:   12,  // selo de recarga
  bullet:  13,  // propriedade / vantagem
  desc:    11,  // descrição
  xp:      11,  // texto de sabor do Magistral
  stat:    12,  // linha da tabela de estatísticas
  vital:    9,  // rótulos HP / DET
}

// SINAIS VITAIS — a barra de HP e os círculos de Determinação espelham a
// topbar da interface, com uma diferença deliberada: aqui a cor é UNIFORME.
// Na tela, dourado e verde distinguem base de bônus porque o usuário está
// montando e precisa ver o efeito do que acabou de equipar. No print não há
// interação para explicar a distinção, e ela viraria ruído — o número ao
// lado já diz o total. Ver DEC-028.
const IMG_HP_BASE_W  = 104   // largura da barra em HP base (100)
const IMG_HP_BONUS_W = 0.9   // px por ponto de HP acima da base
const IMG_HP_H       = 9     // altura da barra
const IMG_DET_R      = 6     // raio dos círculos de Determinação
const IMG_DET_GAP    = 7     // espaço entre círculos
```

> `IMG_ICON_SMALL` deixa de existir — nada o usava desde o layout em bandas.

---

## Parte 3 — `src/App.jsx`: três métodos novos no pintor

`keycap` (tecla de comando), `hpBar` (barra de cor única) e `detDots` (círculos). Nenhum deles mede: sinal vital tem altura fixa e vive dentro do cabeçalho, que também tem.

**Âncora de início:**

```
function makePainter(ctx, draw) {
```

**Âncora de fim:**

```
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

**Substituir tudo entre as duas, inclusive, por:**

```jsx
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

    /**
     * "Tecla": glifo de comando dentro de uma caixinha arredondada.
     * Não depende de imagem — os glifos (△ ◯ ✕ ☐ R1 L2) já são usados como
     * texto nas descrições de `data.js`.
     * @returns {number} largura ocupada
     */
    keycap(txt, x, y, { fs = 11, color, border }) {
      ctx.font = `700 ${fs}px ${IMG_FONT}`
      const padX = 7
      const w = ctx.measureText(String(txt)).width + padX * 2
      const h = fs + 9
      if (draw) {
        const r = 4
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
        ctx.strokeStyle = border
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = color
        ctx.font = `700 ${fs}px ${IMG_FONT}`
        ctx.fillText(String(txt), x + padX, y + h - 6)
        ctx.restore()
      }
      return w
    },

    /**
     * Barra de HP. COR ÚNICA de propósito: no print não há interação para
     * explicar por que um pedaço teria cor diferente do outro, e a distinção
     * base/bônus da interface viraria ruído. Ver DEC-028.
     */
    hpBar(x, y, w, h, color) {
      if (!draw) return
      const r = h / 2
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
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    },

    /** Círculos de Determinação, todos da mesma cor (ver DEC-028). */
    detDots(x, yCenter, count, color) {
      if (!draw) return
      ctx.save()
      ctx.fillStyle = color
      for (let i = 0; i < count; i++) {
        ctx.beginPath()
        ctx.arc(x + IMG_DET_R + i * (IMG_DET_R * 2 + IMG_DET_GAP), yCenter, IMG_DET_R, 0, Math.PI * 2)
        ctx.fill()
      }
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

## Parte 4 — `src/App.jsx`: o cabeçalho vira função própria

Três funções novas, inseridas **imediatamente antes** de `paintCardBlocks`.

**Âncora** (a primeira linha do bloco de documentação de `paintCardBlocks`):

```
/**
 * Mede ou desenha o conteúdo de um cartão, a partir da lista de blocos.
```

**Substituir por** — o bloco abaixo, **seguido** da linha da âncora:

```jsx
/**
 * Monta as linhas de informação do Supremo para o cabeçalho.
 *
 * `stats` é a linha compacta de números; `note` é a modificação textual — a
 * frase que muda conforme a build, e que não aparecia em lugar nenhum da
 * imagem. A ordem de escolha vai da mais específica para a mais genérica:
 * nota de modo (Fúria a 300%), variante ativa (Sopro do Ronin) e, na falta
 * das duas, a descrição base do supremo, que vive em `data.js` e até agora
 * nunca foi exibida.
 *
 * @param {Object|null} ult - `stats.ultimate`
 * @param {Object|null} cls - a classe, para chegar à descrição base
 * @param {boolean} L - true quando o idioma é EN
 * @returns {{ stats: string, note: string|null }}
 */
function ultimateHeaderLines(ult, cls, L) {
  const bits = []
  if (ult?.cost != null) bits.push(`${L ? 'Cost' : 'Custo'} ${ult.cost}★`)

  if (ult?.mode === 'rage300') {
    bits.push(`${L ? 'Strikes' : 'Golpes'} ${ult.strikes} × ${ult.dmgPct}%`)
  } else if (ult?.strikes != null) {
    bits.push(`${L ? 'Strikes' : 'Golpes'} ${ult.strikes}` +
      (ult.strikeBonus ? ` (+${ult.strikeBonus})` : ''))
  }
  if (ult?.targets != null) {
    bits.push(`${L ? 'Targets' : 'Alvos'} ${ult.targets}` +
      (ult.targetBonus ? ` (+${ult.targetBonus})` : ''))
  }
  if (ult?.dmgMult) bits.push(`×${ult.dmgMult} ${L ? 'dmg' : 'dano'}`)
  if (ult?.ultDmgBonus > 0) {
    bits.push(`+${Math.round(ult.ultDmgBonus * 100)}% ${L ? 'dmg' : 'dano'}`)
  }

  let note = null
  if (ult?.notePT || ult?.noteEN) {
    note = L ? (ult.noteEN || ult.notePT) : ult.notePT
  } else if (ult?.classId === 'ronin' && ult.variants?.length) {
    // A variante ativa, ou a base quando nenhuma técnica de tier III a troca.
    const act = ult.variants.find(v => v.id === ult.activeBreath) || ult.variants[0]
    note = `${L ? (act.nEN || act.nPT) : act.nPT} — ${L ? (act.dEN || act.dPT) : act.dPT}`
  }
  if (!note && cls?.ult) {
    // A descrição base termina repetindo o custo, que já está na linha de
    // números logo acima. A âncora de fim de string cobre os dois idiomas.
    note = (L ? (cls.ult.dEN || cls.ult.dPT) : cls.ult.dPT)
      .replace(/\s*(Custa|Costs?)\s+\d+\s+(Determinação|Resolve)\.?\s*$/i, '')
  }

  return { stats: bits.join('   ·   '), note }
}

/**
 * Desenha um comando de controle como sequência de teclas.
 *
 * Não há imagem de botão no projeto, e não faz falta: os glifos do PlayStation
 * (△ ◯ ✕ ☐ R1 L2) já são usados como TEXTO nas descrições de `data.js`. A
 * caixinha é desenhada e o glifo é fonte — zero dependência nova.
 *
 * O comando de cada supremo é opcional e vem de `cls.ult.cmd` (ex.: `'L1+R1'`).
 * Quando o campo não existe, nada é desenhado.
 *
 * @returns {number} largura ocupada
 */
function paintCommand(pen, cmd, x, y, C) {
  if (!cmd) return 0
  const parts = String(cmd).split('+').map(s => s.trim()).filter(Boolean)
  let cx = x
  parts.forEach((p, i) => {
    cx += pen.keycap(p, cx, y, { fs: IMG_FS.ultInfo, color: C.text, border: C.border })
    if (i < parts.length - 1) {
      pen.text('+', cx + 4, y + IMG_FS.ultInfo + 3,
        { font: `600 ${IMG_FS.ultInfo}px ${IMG_FONT}`, color: C.muted, lineH: 0 })
      cx += 14
    }
  })
  return cx - x
}

/**
 * Cabeçalho da imagem: identidade à esquerda, Supremo puxado para o centro.
 *
 * O layout anterior gastava a faixa inteira com um nome e um ícone, e jogava
 * HP e Determinação numa linha de texto. Aqui a esquerda repete os sinais
 * vitais da interface — barra e círculos de verdade — e a direita passa a
 * carregar o que o Supremo tem a dizer: números, comando e a modificação
 * textual que a build causou nele. Ver DEC-028.
 *
 * @returns {void}
 */
function paintHeader(pen, { build, stats, cls, L, buildName, icons, C }) {
  pen.rect(0, 0, IMG_W, IMG_HEADER_H, C.cls + '22')
  pen.rect(0, IMG_HEADER_H - 1, IMG_W, 1, C.cls + '55')

  // ── Esquerda: classe, nome e sinais vitais ─────────────────
  pen.icon(icons.cls, IMG_PAD, (IMG_HEADER_H - IMG_ICON_CLS) / 2, IMG_ICON_CLS)

  const clsName = L ? (cls.nEN || cls.nPT) : cls.nPT
  const named   = !!buildName?.trim()
  const tx      = IMG_PAD + IMG_ICON_CLS + 14

  pen.text(named ? buildName.trim() : clsName, tx, 40,
    { font: `800 ${IMG_FS.title}px ${IMG_FONT}`, color: C.text, lineH: 0 })
  if (named) {
    pen.text(clsName.toUpperCase(), tx, 56,
      { font: `700 ${IMG_FS.cls}px ${IMG_FONT}`, color: C.cls, lineH: 0 })
  }

  const leg     = checkLegendaryLimit(build)
  const hp      = stats?.maxHP ?? 100
  const resolve = stats?.maxResolve ?? 3
  const vitalFt = `700 ${IMG_FS.vital}px ${IMG_FONT}`
  const labelW  = 26

  // Determinação — círculos, todos da mesma cor (ver DEC-028)
  const detY = named ? 74 : 68
  pen.text(L ? 'RES' : 'DET', tx, detY + 3, { font: vitalFt, color: C.muted, lineH: 0 })
  pen.detDots(tx + labelW, detY, resolve, C.accent)

  // HP — barra de cor única, mais o número à direita
  const hpY = detY + 20
  pen.text('HP', tx, hpY + 3, { font: vitalFt, color: C.muted, lineH: 0 })
  const barW = IMG_HP_BASE_W + Math.max(0, hp - 100) * IMG_HP_BONUS_W
  pen.hpBar(tx + labelW, hpY - IMG_HP_H / 2, barW, IMG_HP_H, C.hp)
  pen.text(String(hp), tx + labelW + barW + 9, hpY + 4,
    { font: `700 ${IMG_FS.ultInfo}px ${IMG_FONT}`, color: C.text, lineH: 0 })

  // Contador de Magistrais, ao lado do HP
  const legX = tx + labelW + barW + 9 + 34
  pen.text(`${'★'.repeat(leg.used)}${'☆'.repeat(Math.max(0, leg.limit - leg.used))}`,
    legX, hpY + 4, { font: `400 ${IMG_FS.ultInfo}px ${IMG_FONT}`, color: C.leg, lineH: 0 })

  // ── Direita: o Supremo ─────────────────────────────────────
  // Puxado para o centro: o bloco começa um pouco depois da metade e usa toda
  // a faixa que sobrava à direita.
  const ux = Math.round(IMG_W * 0.46)
  pen.icon(icons.supreme, ux, (IMG_HEADER_H - IMG_ICON_ULT) / 2, IMG_ICON_ULT)

  const utx = ux + IMG_ICON_ULT + 14
  const utw = IMG_W - IMG_PAD - utx
  const ult = stats?.ultimate

  const uName = ult ? (L ? (ult.nEN || ult.nPT) : ult.nPT)
                    : (L ? (cls.ult?.nEN || cls.ult?.nPT) : cls.ult?.nPT)
  pen.text(uName, utx, 38,
    { font: `700 ${IMG_FS.ult}px ${IMG_FONT}`, color: C.cls, maxW: utw, lineH: 0 })

  const info = ultimateHeaderLines(ult, cls, L)
  let infoX  = utx
  const cmdW = paintCommand(pen, cls.ult?.cmd, infoX, 47, C)
  if (cmdW) infoX += cmdW + 12
  if (info.stats) {
    pen.text(info.stats, infoX, 58,
      { font: `600 ${IMG_FS.ultInfo}px ${IMG_FONT}`, color: C.text, lineH: 0 })
  }
  if (info.note) {
    pen.text(info.note, utx, 78,
      { font: `italic 400 ${IMG_FS.ultNote}px ${IMG_FONT}`, color: C.muted,
        maxW: utw, lineH: 14 })
  }
}

/**
 * Mede ou desenha o conteúdo de um cartão, a partir da lista de blocos.
```

---

## Parte 5 — `src/App.jsx`: o resto do desenho passa a usar `IMG_FS`

Substitui `paintCardBlocks`, `paintBand`, `abilityCards`, `gearCards` e `paintBuildImage`. As mudanças são: tamanhos de fonte vindos de `IMG_FS`, a paleta com `accent` e `hp`, o cabeçalho delegado a `paintHeader`, e a tabela de estatísticas com linha de 20 px em vez de 18, para acompanhar a fonte maior.

**Âncora de início:**

```
/**
 * Mede ou desenha o conteúdo de um cartão, a partir da lista de blocos.
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
        pen.text(b.t, x, y + dy + 9, { font: `600 ${IMG_FS.label}px ${IMG_FONT}`, color: C.dim, lineH: 0 })
        dy += 15
        break

      case 'head': {
        const img  = b.icon ? icons[b.icon] : null
        const size = b.size || IMG_ICON_CARD
        const tx   = x + size + 8
        const font = `700 ${b.fs}px ${IMG_FONT}`
        const badgeFont = `400 ${IMG_FS.badge}px ${IMG_FONT}`
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
          { font: `italic 400 ${IMG_FS.xp}px ${IMG_FONT}`, color: C.leg, maxW: w, lineH: IMG_FS.xp + 4 })
        dy += 3
        break

      case 'bullet':
        dy += pen.text(`• ${b.t}`, x, y + dy + 11,
          { font: `400 ${IMG_FS.bullet}px ${IMG_FONT}`, color: C.text, maxW: w, lineH: IMG_FS.bullet + 4 })
        break

      case 'desc':
        dy += pen.text(b.t, x + 10, y + dy + 10,
          { font: `400 ${IMG_FS.desc}px ${IMG_FONT}`, color: C.dim, maxW: w - 12, lineH: IMG_FS.desc + 4 })
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

  pen.text(title, x, y + 10, { font: `700 ${IMG_FS.band}px ${IMG_FONT}`, color: C.muted, lineH: 0 })
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
      { k: 'head', t: L ? (ab.nEN || ab.nPT) : ab.nPT, icon: 'ability', fs: IMG_FS.head,
        color: C.cls, badge: `${cd}s` },
      ...(withDesc ? [{ k: 'desc', t: L ? (ab.dEN || ab.dPT) : ab.dPT }] : []),
    ]})
  } else {
    out.push({ blocks: [
      { k: 'label', t: L ? 'Class Ability' : 'Habilidade' },
      { k: 'head', t: '—', fs: IMG_FS.head, color: C.dim, size: 4 },
    ]})
  }

  for (const tier of ['I', 'II', 'III']) {
    const techId = build.techs?.[tier]
    const tech   = techId ? cls.techs.find(t => t.id === techId) : null
    const label  = L ? `Perk ${tier}` : `Vantagem ${tier}`
    if (!tech) {
      out.push({ blocks: [
        { k: 'label', t: label },
        { k: 'head', t: '—', fs: IMG_FS.head, color: C.dim, size: 4 },
      ]})
      continue
    }
    out.push({ blocks: [
      { k: 'label', t: label },
      { k: 'head', t: L ? (tech.nEN || tech.nPT) : tech.nPT, icon: `tech_${tier}`,
        fs: IMG_FS.head, color: C.text },
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
        icon: `gear_${slot}`, fs: IMG_FS.headGear, color: item.leg ? C.leg : C.text,
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
    accent: T.accent, hp: '#c0392b',
    cls: T.cls[build.classId],
  }
  const withDesc  = mode === 'detailed' || mode === 'stats'
  const withStats = mode === 'stats'
  const innerW    = IMG_W - IMG_PAD * 2

  paintHeader(pen, { build, stats, cls, L, buildName, icons, C })

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
      { font: `700 ${IMG_FS.band}px ${IMG_FONT}`, color: C.muted, lineH: 0 })
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
    const rowsH = Math.ceil(rows.length / cols) * 20
    const ultH  = ultLine ? 34 : 0
    pen.card(IMG_PAD, y, innerW, ultH + rowsH + IMG_CARD_PAD * 2, C.card, C.border)

    let cy = y + IMG_CARD_PAD
    if (ultLine) {
      const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
      pen.text(`${L ? 'Ultimate' : 'Supremo'}: ${uName}`, IMG_PAD + IMG_CARD_PAD, cy + 12,
        { font: `700 ${IMG_FS.stat + 1}px ${IMG_FONT}`, color: C.cls, lineH: 0 })
      pen.text(ultLine, IMG_PAD + IMG_CARD_PAD, cy + 28,
        { font: `400 ${IMG_FS.stat}px ${IMG_FONT}`, color: C.muted, lineH: 0 })
      cy += ultH
    }

    const lblFt = `400 ${IMG_FS.stat}px ${IMG_FONT}`
    const valFt = `700 ${IMG_FS.stat}px ${IMG_FONT}`
    rows.forEach((row, i) => {
      const rx = IMG_PAD + IMG_CARD_PAD + (i % cols) * colW
      const ry = cy + Math.floor(i / cols) * 20 + 12
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

> Atenção: depois da Parte 4 existem **duas** ocorrências da âncora de início — a que você acabou de inserir como comentário-guia e a real. Aplique a Parte 5 na **segunda**, que é a que é seguida de `function paintCardBlocks`.

---

## Parte 6 — `src/App.jsx`: correção pequena no `ultimateSummary`

A busca da variante do Sopro cai para `undefined` quando o Ronin tem uma técnica de tier III que troca o Sopro **e** `activeBreath` não bate com nenhuma — hoje isso deixa a linha do Supremo sem a variante, em vez de mostrar a base. O `ultimateHeaderLines` novo já nasce com o retorno certo; este é o mesmo conserto no caminho do texto.

**Âncora:**

```
  // Ronin: o Sopro ativo é a variante escolhida (ou a única, quando só há uma)
  if (ult.classId === 'ronin' && ult.variants?.length) {
    const act = ult.variants.find(v => ult.variants.length === 1 || ult.activeBreath === v.id)
    if (act) parts.push(L ? (act.nEN || act.nPT) : act.nPT)
  }
```

**Substituir por:**

```
  // Ronin: a variante ativa, ou a base quando nenhuma tecnica de tier III a
  // troca. O `find` sozinho devolvia undefined nesse caso e a variante sumia
  // da linha; a base e sempre a primeira do array.
  if (ult.classId === 'ronin' && ult.variants?.length) {
    const act = ult.variants.find(v => v.id === ult.activeBreath) || ult.variants[0]
    parts.push(L ? (act.nEN || act.nPT) : act.nPT)
  }
```

---

## Parte 7 — Build e conferência

Rode `npm run build`. Se falhar, **PARE**.

No dev server:

**Cabeçalho — o alvo da spec**
1. **Barra de HP e círculos de Determinação** aparecem, e a quantidade bate com a topbar da interface.
2. **Cor uniforme:** a barra é de uma cor só e **todos** os círculos são iguais, mesmo com bônus. Se o quarto e o quinto círculo saírem verdes, o comportamento da interface vazou.
3. Com **HP acima de 100**, a barra fica visivelmente mais comprida, e o número ao lado bate.
4. O **Supremo está por volta do meio** da faixa, não colado na borda direita, e à direita dele vêm: nome, linha de números e a frase de modificação.
5. **Com nome de build salvo**, o nome sai grande e a classe em maiúsculas embaixo; **sem nome**, a classe sai grande e não se repete.
6. Nada transborda a faixa de 118 px nem invade a banda de baixo — teste com um **nome de build longo**.

**O Supremo por classe** (é onde a lógica varia mais)
7. **Samurai comum**: `Custo 3★ · Golpes N (+X) · +Y% dano`, e a frase é a descrição do Supremo **sem** o "Custa 3 Determinação" no fim.
8. **Samurai com a Fúria a 300%**: `Golpes 2 × 300%` e a frase vira *"Cada golpe causa 300% de dano."*
9. **Caçadora**: `Alvos N (+X)`.
10. **Assassino com Ofuscado**: aparece o `×2 dano`.
11. **Ronin sem técnica de tier III que troque o Sopro**: a frase mostra **Sopro de Izanami** e a descrição base. **Com** uma delas equipada (Reconfortante, De Fogo ou Atordoante), mostra a variante equipada. Este é o item 6 da spec e o mais fácil de errar.

**Tipografia, ícones e nitidez**
12. Texto **maior** em toda a imagem, e os ícones de cartão visivelmente maiores.
13. Abra o PNG e amplie a **300%**: o texto continua legível e sem borrar.
14. **Confira o tamanho do arquivo** do PNG no modo Estatístico com build cheia. Se passar de ~4 MB, reporte — `IMG_SCALE` volta para 2 numa linha, e com as fontes maiores isso já fica melhor que antes.

**Não-regressão**
15. Os cinco ícones de equipamento aparecem nos **dois temas** (FIX-012).
16. Ícones de técnica e do Supremo **continuam dourados**, não viraram retângulo sólido (armadilha 3).
17. Cartões da mesma linha com **altura igual**; Magistral com borda dourada; selo de recarga à direita sem encostar no nome.
18. **PT e EN**, e o modo Estatístico com HP e Determinação na tabela (DEC-022).

Se todos passarem:

```
git add src/App.jsx
git commit -m "feat(export): cabecalho com sinais vitais e informacao do supremo, tipografia maior"
```

Não faça `push` ainda.

---

## Parte 8 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-027):

```
Simulado antes de virar código, com o método da `spec0014`: as duas passadas devolvem altura idêntica nos três modos e em três preenchimentos (cheio, vazio, parcial), e a passada de medição não pinta nada. A altura passou a acompanhar o conteúdo em vez do modo — build vazia sai com 244 px onde a versão anterior reservava o mesmo de uma build cheia.
```

**Substituir por:**

```
Simulado antes de virar código, com o método da `spec0014`: as duas passadas devolvem altura idêntica nos três modos e em três preenchimentos (cheio, vazio, parcial), e a passada de medição não pinta nada. A altura passou a acompanhar o conteúdo em vez do modo — build vazia sai com 244 px onde a versão anterior reservava o mesmo de uma build cheia.

---

## DEC-028 — O cabeçalho da imagem: sinais vitais em cor uniforme e o Supremo com informação

**Data:** 2026-07-26 · **Status:** aceita, em vigor

### Cor uniforme na barra e nos círculos — a diferença deliberada
A topbar da interface distingue base de bônus por cor: os três primeiros círculos de Determinação em dourado e os extras em verde; a barra de HP vermelha até 100 e dourada no excedente. **A imagem não repete isso.** Barra de uma cor, círculos todos iguais.

O motivo não é economia de código, é de leitura. Na tela, o jogador está montando: ele acabou de equipar algo e a cor diferente responde "foi isto que mudou". No print não há esse antes-e-depois — quem recebe a imagem vê um estado pronto, e uma cor diferente no meio da barra vira uma pergunta sem resposta. O número ao lado já diz o total.

**Regra que fica:** distinção visual que só faz sentido durante a edição não deve ser transportada para a exportação. As duas superfícies têm leitores diferentes.

### O Supremo saiu da borda e ganhou o que dizer
Antes o Supremo era um ícone encostado na borda direita com o nome embaixo, e a faixa de 92 px existia praticamente para acomodar isso. Agora o bloco começa perto do meio e ocupa a metade direita com três informações:

1. **O nome**, na cor da classe.
2. **A linha de números** — custo, golpes ou alvos com o bônus entre parênteses, multiplicador e percentual de dano.
3. **A modificação textual**, que é a novidade real.

A terceira escolhe a fonte por especificidade: a nota de modo (a Fúria a 300%), depois a variante ativa do Sopro do Ronin, e por último **a descrição base do Supremo — que existe em `data.js` e não aparecia em lugar nenhum**, nem na imagem nem no texto exportado. O `computeUltimate` nunca a repassou, e ninguém sentiu falta porque não havia onde ela coubesse.

Da descrição base é retirada a frase final de custo (`Custa 3 Determinação`), que já está na linha de números logo acima. A remoção é uma expressão ancorada no fim da string e cobre os dois idiomas — estreita de propósito, porque o dado é do projeto e não muda de forma.

### O comando de ativação fica pronto, mas desligado
Há um renderizador de teclas — caixinha desenhada com o glifo dentro — e ele lê `cls.ult.cmd`. **O campo não existe em `data.js`**, porque o comando do Supremo não está registrado em lugar nenhum do projeto e não seria honesto inventá-lo. Enquanto não existir, nada é desenhado.

Não há dependência nova: os glifos do PlayStation (`△ ◯ ✕ ☐ R1 L2`) já são usados como **texto** nas descrições de `data.js`. A caixa é desenhada, o glifo é fonte.

Para ligar, basta acrescentar `cmd` ao `ult` da classe em `data.js` — por exemplo `cmd: "L1+R1"`. O valor precisa ser conferido no jogo, como todo dado deste projeto.

### Tipografia num lugar só
Todos os tamanhos de fonte da imagem passaram para `IMG_FS`. O pedido de "aumentar um pouco as letras" seria, antes, uma caçada por dezenove literais espalhados pelo desenho — e cada um esquecido produziria um desalinhamento sutil. `IMG_SCALE` subiu de 2 para 3 e `IMG_W` de 900 para 1000 pelo mesmo motivo: mais pixels por unidade lógica, e mais largura para o texto maior respirar.
```

---

## Parte 9 — `meta/CONTEXT.md`

**Âncora** (fim da armadilha 18, última da lista):

```
18. **Medir altura não detecta colisão.** A simulação de duas passadas da Fase 3 acerta a altura total e não diz nada sobre elementos que se sobrepõem *dentro* da faixa medida — foi assim que o FIX-013 passou. Conferência de imagem precisa de olho, não só de número.
```

**Substituir por:**

```
18. **Medir altura não detecta colisão.** A simulação de duas passadas da Fase 3 acerta a altura total e não diz nada sobre elementos que se sobrepõem *dentro* da faixa medida — foi assim que o FIX-013 passou. Conferência de imagem precisa de olho, não só de número.

19. **A imagem não é um espelho da interface.** Onde a tela usa cor para dizer "isto mudou agora" — o dourado do HP bônus, o verde dos círculos extras de Determinação —, a imagem usa cor única: quem recebe um print não viu o antes, e a distinção vira uma pergunta sem resposta. Antes de transportar um detalhe visual da UI para o canvas, pergunte se ele fala com quem está **editando** ou com quem está **lendo**. Ver DEC-028.

20. **Tamanho de fonte da imagem mora em `IMG_FS`.** Dezenove literais espalhados pelo desenho tornavam "aumente um pouco as letras" uma caçada, com desalinhamento garantido no que fosse esquecido. Acrescentou texto novo ao canvas? A medida vem do mapa.
```

---

## Parte 10 — `meta/GLOSSARY.md`

**Âncora:**

```
- **`paintBand(pen, mp, opts)`** — desenha uma banda: título, divisor e a grade de cartões. Recebe **dois** pintores: o da passada corrente e um de medição, porque a altura da linha precisa ser conhecida antes de pintar a borda do primeiro cartão.
```

**Substituir por:**

```
- **`paintBand(pen, mp, opts)`** — desenha uma banda: título, divisor e a grade de cartões. Recebe **dois** pintores: o da passada corrente e um de medição, porque a altura da linha precisa ser conhecida antes de pintar a borda do primeiro cartão.
- **`paintHeader(pen, opts)`** — o cabeçalho da imagem: identidade e sinais vitais à esquerda, Supremo e sua informação à direita. Altura fixa (`IMG_HEADER_H`), então não entra na medição.
- **`ultimateHeaderLines(ult, cls, L)`** — devolve `{ stats, note }` para o cabeçalho: a linha de números e a modificação textual do Supremo. A `note` escolhe por especificidade — nota de modo, variante ativa do Ronin, e por fim a descrição base do Supremo.
- **`IMG_FS`** — mapa com todos os tamanhos de fonte da imagem gerada. Texto novo no canvas tira a medida daqui, nunca de um literal.
- **`cls.ult.cmd`** — campo **opcional** de `data.js` com o comando de ativação do Supremo (ex.: `"L1+R1"`). Quando presente, vira teclas desenhadas no cabeçalho da imagem; quando ausente, nada é desenhado. **Ainda não preenchido** — precisa ser conferido no jogo.
```

---

## Parte 11 — `meta/CHANGELOG.md`

**Âncora** (a primeira linha da subseção «### Modificado»):

```
- **A imagem da build foi redesenhada em bandas.** O layout de duas colunas deixava metade da imagem vazia — as duas nunca podiam ter a mesma altura. Agora são faixas de largura total com cartões em grade: habilidade e vantagens em quatro colunas, equipamentos em duas, estatísticas ao pé. Magistral ganha borda dourada, e o cabeçalho passou a mostrar HP, Determinação e o contador de Magistrais nos três modos (DEC-027)
```

**Substituir por:**

```
- **O cabeçalho da imagem passou a mostrar barra de HP e círculos de Determinação de verdade**, como a topbar da ferramenta — em cor uniforme, sem a distinção base/bônus que só faz sentido enquanto se monta. O Supremo saiu da borda para perto do centro e ganhou custo, golpes ou alvos com o bônus, multiplicadores e a **descrição da habilidade**, que existia no dado e nunca tinha sido exibida (DEC-028)
- **Letras e ícones maiores na imagem gerada**, e resolução de renderização aumentada (DEC-028)
- **A imagem da build foi redesenhada em bandas.** O layout de duas colunas deixava metade da imagem vazia — as duas nunca podiam ter a mesma altura. Agora são faixas de largura total com cartões em grade: habilidade e vantagens em quatro colunas, equipamentos em duas, estatísticas ao pé. Magistral ganha borda dourada, e o cabeçalho passou a mostrar HP, Determinação e o contador de Magistrais nos três modos (DEC-027)
```

**Âncora** (primeira linha da subseção «### Corrigido»):

```
- Barra de rolagem fantasma no modal de configurações: um retângulo cinza surgia ao passar o cursor sobre as opções e deslocava o conteúdo (FIX-011)
```

**Substituir por:**

```
- No Ronin, a variante ativa do Sopro sumia do texto exportado quando `activeBreath` não batia com nenhuma das opções, em vez de cair na variante base
- Barra de rolagem fantasma no modal de configurações: um retângulo cinza surgia ao passar o cursor sobre as opções e deslocava o conteúdo (FIX-011)
```

---

## Parte 12 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo: F4 — polimento e mobile.** A F3 está fechada, e com ela a última pendência de desenho da exportação.
```

**Substituir por:**

```
**Próximo passo: F4 — polimento e mobile.** A F3 está fechada, e com ela a última pendência de desenho da exportação.

---

**2026-07-26 (2) — cabeçalho da imagem e tipografia (DEC-028).**

Quatro pedidos do autor sobre a imagem: letras maiores, mais nitidez, ícones maiores, e um cabeçalho que use o espaço.

- **Sinais vitais de verdade.** Barra de HP e círculos de Determinação, como na topbar da ferramenta — mas em **cor uniforme**. A distinção base/bônus da interface responde "foi isto que você acabou de mudar"; num print não há antes-e-depois e ela vira pergunta sem resposta. Virou a armadilha 19: a imagem não é espelho da interface.
- **O Supremo saiu da borda.** Foi para perto do centro e ganhou a metade direita: nome, linha de números com os bônus entre parênteses, e a **modificação textual** — a nota da Fúria a 300%, a variante ativa do Sopro do Ronin, ou, na falta das duas, **a descrição base do Supremo, que existe em `data.js` e nunca tinha sido exibida em lugar nenhum**, nem na imagem nem no texto.
- **Tipografia num lugar só.** Os dezenove tamanhos espalhados pelo desenho viraram `IMG_FS`. `IMG_SCALE` subiu para 3 e `IMG_W` para 1000. Virou a armadilha 20.
- **Um conserto de passagem:** no Ronin, a variante do Sopro sumia do texto exportado quando `activeBreath` não batia com nenhuma opção, em vez de cair na base.

**Pronto e desligado:** o renderizador do comando de ativação do Supremo. Desenha teclas com os glifos que o `data.js` já usa como texto, sem imagem nova, e lê `cls.ult.cmd`. **O campo não existe** — o comando não está registrado no projeto e inventá-lo seria dado não conferido. Uma linha em `data.js` liga a coisa toda.

**Também nesta sessão:** o `meta/specs/260725-spec0015-correcoes-modal-e-imagem.md` estava *untracked* desde a `spec0016` e entrou no commit. Spec é artefato versionado, e aquela ficou de fora por acidente — a `spec0015` é justamente a que registra um diagnóstico errado, e é o tipo de coisa que não deve sumir.

Simulado antes de virar spec: duas passadas com altura idêntica nos três modos, e as seis combinações de Supremo (Samurai comum e a 300%, Caçadora, Assassino com Ofuscado, Ronin com e sem variante) conferidas uma a uma.
```

---

## Parte 13 — `logs/2026-07-26.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 3 — Cabeçalho da imagem, tipografia e ícones

### Objetivo da sessão
Atender quatro pedidos do autor sobre a imagem gerada: letras maiores, mais nitidez, ícones maiores e melhor uso do espaço no topo.

### Feito
- `IMG_FS`: todos os tamanhos de fonte da imagem num objeto só. `IMG_SCALE` 2 → 3, `IMG_W` 900 → 1000, ícone de cartão 26 → 34, Supremo 46 → 56.
- Pintor ganhou `keycap`, `hpBar` e `detDots`.
- `paintHeader` novo: sinais vitais à esquerda em cor uniforme, Supremo perto do centro com números e modificação textual à direita.
- `ultimateHeaderLines`: escolhe a frase por especificidade e recupera a descrição base do Supremo, que existia no dado e nunca fora exibida.
- Renderizador de comando de ativação pronto, lendo `cls.ult.cmd` — campo ainda inexistente, de propósito.
- Conserto: variante do Sopro do Ronin no `ultimateSummary`.
- Simulado antes de escrever a spec: duas passadas idênticas nos três modos, e as seis combinações de Supremo conferidas.

### Specs entregues / aplicadas
- `260726-spec0018-cabecalho-e-tipografia.md`

### Decisões
- **DEC-028** — sinais vitais em cor uniforme, Supremo com informação, tipografia centralizada em `IMG_FS`.

### Bugs
- Variante do Sopro sumindo do texto exportado quando `activeBreath` não casava.

### Aprendizados / armadilhas
- **A imagem não é espelho da interface.** Cor que diz "isto mudou agora" fala com quem edita, não com quem lê um print. Armadilha 19.
- **Constante espalhada vira dívida no primeiro pedido de ajuste.** Dezenove tamanhos de fonte pelo desenho transformaram "aumente um pouco as letras" numa caçada. Armadilha 20.
- **Dado que existe e não é exibido é fácil de não sentir falta.** A descrição do Supremo estava em `data.js` desde o começo e não aparecia em canto nenhum — só apareceu quando houve espaço para ela.

### Onde parei
Cabeçalho entregue. Comando de ativação pronto e desligado, à espera do dado.

### Próximos passos
1. Confirmar o comando de ativação de cada Supremo e acrescentar `cmd` aos quatro `ult` de `data.js`.
2. F4 — polimento e mobile.
3. Backlog: destino de `getAvailableProps` / `getAvailablePerks`, duplicação de `selectTech` / `selectAbility`, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 14 — Fechamento

Rode `git diff`. O commit de código da Parte 7 já deve estar feito; agora o de documentação — **incluindo a spec0015, que estava untracked**:

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/GLOSSARY.md meta/CHANGELOG.md meta/STATUS.md logs/2026-07-26.md meta/specs/260725-spec0015-correcoes-modal-e-imagem.md meta/specs/260726-spec0018-cabecalho-e-tipografia.md
git commit -m "docs(meta): registra a DEC-028 e versiona a spec0015 que ficou de fora"
git push
```
