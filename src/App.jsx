// App.jsx — GoT Legends Build Planner
import { useState, useEffect, useMemo, useRef } from 'react'
import { CLASSES } from './data.js'
import { CLASS_ICON, CLASS_TECH_FALLBACK, LOGO_URL, getGearIconUrl, getTechIconUrl } from './icons.js'
import {
  createEmptyBuild, computeStats,
  selectItem, selectProp,
  setPropValue, selectPerk,
  checkLegendaryLimit, getGearListForClass, getRequiredPerkId,
  getEffectiveCharm, getStatGroups, isStatChanged,
  getClass, getItem,
  formatStatValue, formatPropRange, propValueForDisplay,
  propValueFromDisplay, formatCd,
  encodeBuild, decodeBuild, serializeBuild, deserializeBuild,
  changeClass, randomBuild,
  LABELS_PT, LABELS_EN,
} from './logic.js'

// ─── Temas ──────────────────────────────────────────────
const THEME_DARK = {
  bg: '#07080f', panel: '#10111c', card: '#181924', cardHov: '#1e1f2e',
  border: '#252638', borderHov: '#3a3b5a', text: '#dde0ef',
  muted: '#6a6c88', dim: '#3a3c52', accent: '#c4a035', leg: '#d4af37',
  green: '#2ecc71', red: '#e74c3c',
  cls: { samurai:'#c0392b', hunter:'#2475ad', ronin:'#8e44ad', assassin:'#27ae60' },
  // Filtros para ícones SVG (ex: class icons) — torna-os brancos sobre fundo escuro
  iconFilter:    'brightness(0) invert(1)',
  iconFilterDim: 'brightness(0) invert(1) opacity(0.45)',
}
const THEME_LIGHT = {
  bg: '#f4f5fb', panel: '#e6e9f5', card: '#ffffff', cardHov: '#edf0fc',
  border: '#c8cce0', borderHov: '#9098c8', text: '#1a1d36',
  muted: '#4a5278', dim: '#b0b6d4', accent: '#8a6010', leg: '#8a6010',
  green: '#157040', red: '#b02020',
  cls: { samurai:'#a02020', hunter:'#1460a0', ronin:'#6a2a90', assassin:'#0e7830' },
  // Filtros para ícones SVG — torna-os pretos sobre fundo claro
  iconFilter:    'brightness(0)',
  iconFilterDim: 'brightness(0) opacity(0.4)',
}

// T é mutável — atualizado sincronamente no início de cada render do App
const T = { ...THEME_DARK }

// ─── Tamanho do ícone supremo na coluna de estatísticas ───────
// Altere APENAS este valor para ajustar o tamanho do ícone.
// O ícone ficará sempre centralizado horizontalmente no topo da coluna.
// Não afeta nada mais na interface.
const ULTIMATE_ICON_SIZE = 60  // px — experimente entre 48 e 120

// cls_emoji mantido apenas para as builds salvas no drawer (mostra classe da build)
const cls_emoji = { samurai:'⚔️', hunter:'🏹', ronin:'🐕', assassin:'🗡️' }
// slot_emoji REMOVIDO — substituído por ícones SVG nos GearSlotCards

// ─── Tooltip (com detecção de borda) ────────────────────
const TOOLTIP_W = 300   // largura máxima do tooltip
const TOOLTIP_H = 100   // altura estimada (conservador)

function Tooltip({ text, children, wrapperStyle }) {
  const [vis, setVis] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, flipX: false, flipY: false })

  const show = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const rawX = r.left
    const rawY = r.bottom + 6
    // Detecta se vai cortar à direita
    const flipX = rawX + TOOLTIP_W > vw
    // Detecta se vai cortar embaixo
    const flipY = rawY + TOOLTIP_H > vh
    setPos({
      x: flipX ? Math.max(4, vw - TOOLTIP_W - 8) : rawX,
      y: flipY ? r.top - TOOLTIP_H - 6 : rawY,
      flipX, flipY,
    })
    setVis(true)
  }

  if (!text) return children

  return (
    <span
      style={{ display: 'inline-block', cursor: 'help', ...wrapperStyle }}
      onMouseEnter={show}
      onMouseLeave={() => setVis(false)}>
      {children}
      {vis && (
        <div style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          background: T.card,
          border: `1px solid ${T.borderHov}`,
          borderRadius: 8,
          padding: '8px 12px',
          width: TOOLTIP_W,
          color: T.text,
          fontSize: 12,
          lineHeight: 1.5,
          boxShadow: '0 8px 32px rgba(0,0,0,0.65)',
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </span>
  )
}

// ─── Small helpers ───────────────────────────────────────────
const pct = (v) => v > 0 ? `+${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`
const pts = (v, u) => v > 0 ? `+${v}${u}` : `${v}${u}`

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

const HP_BASE_WIDTH   = 80    // px — largura da barra base (HP = 100, sempre cheia)
const HP_BONUS_SCALE  = 0.8   // px por ponto de HP bônus (25 bônus = +20px extras)
const HP_BAR_HEIGHT   = 7     // px — altura da barra
const DET_CIRCLE_SIZE = 12    // px — diâmetro dos círculos de Determinação

function HpResolveBar({ stats, lang }) {
  if (!stats) return null

  const hp      = stats.maxHP     ?? 100
  const resolve = stats.maxResolve ?? 3

  // ── HP — representa SOMENTE o bônus acima da base ───────────
  // Bônus máx possível = 25 (técnica Defensor nível máx)
  const BASE_HP_VAL  = 100
  const hpBonus      = Math.max(0, hp - BASE_HP_VAL)
  const hasBonus     = hpBonus > 0
  const bonusWidth   = hpBonus * HP_BONUS_SCALE  // largura extra em px, sem teto

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

        {/* Container único da barra — une vermelho e dourado sem gap */}
        <div style={{
          display:    'flex',
          alignItems: 'stretch',
          height:     HP_BAR_HEIGHT,
          borderRadius: HP_BAR_HEIGHT / 2,
          overflow:   'hidden',   // <-- isso que gruda tudo e arredonda as pontas
          flexShrink: 0,
        }}>
          {/* Porção vermelha — sempre visível, sempre cheia */}
          <div style={{
            width:      HP_BASE_WIDTH,
            height:     '100%',
            background: 'linear-gradient(90deg, #901818, #c0392b)',
            flexShrink: 0,
          }} />

          {/* Porção dourada — só aparece quando há bônus */}
          {hasBonus && (
            <div style={{
              width:      bonusWidth,
              height:     '100%',
              background: `linear-gradient(90deg, ${T.leg}, ${T.accent})`,
              flexShrink: 0,
              transition: 'width 0.35s ease',
            }} />
          )}
        </div>

        {/* Número — empurrado pelo flexbox normalmente */}
        <span style={{
          fontSize:   11,
          fontWeight: 700,
          color:      hasBonus ? T.leg : T.text,
          flexShrink: 0,
          transition: 'color 0.2s ease',
        }}>
          {hp}
        </span>
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: T.border, margin: '12px 0' }} />
}

function SectionTitle({ children }) {
  return (
    <div style={{ color: T.muted, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  )
}

function Tag({ children, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
      background: color + '25', color: color, border: `1px solid ${color}50`,
    }}>{children}</span>
  )
}

// ─── Prop input ──────────────────────────────────────────────
function PropInput({ item, propState, onPropChange, onValueChange, slot, propSlot, otherPropId, locked, lang }) {
  const L = lang === 'en' ? LABELS_EN : LABELS_PT
  const avail = useMemo(() => {
    if (!item) return []
    const slotCode = propSlot === 'p1' ? 'P1' : 'P2'
    return item.props.filter(p => {
      if (!p.sl.includes(slotCode)) return false
      if (otherPropId) {
        const other = item.props.find(pp => pp.id === otherPropId)
        if (other && p.sk === other.sk) return false
      }
      return true
    })
  }, [item, propSlot, otherPropId])

  const propDef = propState?.propId ? item?.props.find(p => p.id === propState.propId) : null
  const [draft, setDraft] = useState(null)

  const displayVal = propDef
    ? propValueForDisplay(propState.value, propDef.u)
    : 0
  const shown = draft !== null ? draft : String(displayVal)

  const commit = () => {
    if (!propDef || draft === null) return
    const n = parseFloat(draft)
    if (!isNaN(n)) {
      const internal = propValueFromDisplay(n, propDef.u)
      onValueChange(internal)
    }
    setDraft(null)
  }

  const stepDisplay = propDef?.u === '%' ? 1 : 1
  const minDisplay  = propDef ? propValueForDisplay(propDef.mn, propDef.u) : 0
  const maxDisplay  = propDef ? propValueForDisplay(propDef.mx, propDef.u) : 0

  const step = (dir) => {
    if (!propDef) return
    const cur = parseFloat(shown) || minDisplay
    const next = Math.max(minDisplay, Math.min(maxDisplay, cur + dir * stepDisplay))
    setDraft(null)
    onValueChange(propValueFromDisplay(next, propDef.u))
  }

  const labelPT = propSlot === 'p1' ? 'Propriedade I' : 'Propriedade II'
  const labelEN = propSlot === 'p1' ? 'Property I' : 'Property II'
  const label = lang === 'en' ? labelEN : labelPT

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 3 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <select
          value={propState?.propId ?? ''}
          onChange={e => onPropChange(e.target.value || null)}
          style={{
            flex: 1, background: T.panel, border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.text, fontSize: 12, padding: '5px 8px',
          }}
        >
          <option value="">— {lang === 'en' ? 'Property' : 'Propriedade'} —</option>
          {avail.map(p => (
            <option key={p.id} value={p.id}>
              {lang === 'en' ? (p.nEN || p.nPT) : p.nPT} ({formatPropRange(p)})
            </option>
          ))}
        </select>

        {propDef && (
          locked ? (
            <div style={{
              minWidth: 48, textAlign: 'center', color: T.leg,
              fontSize: 12, fontWeight: 700,
              background: T.leg + '15', border: `1px solid ${T.leg}30`,
              borderRadius: 6, padding: '5px 8px',
            }}>
              {displayVal}{propDef.u}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <button
                onClick={() => step(-1)}
                aria-label={lang === 'en' ? 'Decrease value' : 'Diminuir valor'}
                style={btnSmall}
              >−</button>
              <input
                type="text"
                inputMode="decimal"
                value={shown}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === 'Tab') { commit(); return }
                  // O type="text" não incrementa sozinho — reproduzimos o passo
                  // com as setas do teclado, que o type="number" dava nativamente.
                  if (e.key === 'ArrowUp')   { e.preventDefault(); step(1) }
                  if (e.key === 'ArrowDown') { e.preventDefault(); step(-1) }
                }}
                style={{
                  width: 46, textAlign: 'center', background: T.panel,
                  border: `1px solid ${T.borderHov}`, borderRadius: 6,
                  color: T.text, fontSize: 12, padding: '4px 6px',
                }}
              />
              <span style={{ fontSize: 11, color: T.muted }}>{propDef.u}</span>
              <button
                onClick={() => step(1)}
                aria-label={lang === 'en' ? 'Increase value' : 'Aumentar valor'}
                style={btnSmall}
              >+</button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

const btnSmall = {
  background: T.card, border: `1px solid ${T.border}`, color: T.text,
  borderRadius: 4, width: 22, height: 22, cursor: 'pointer',
  fontSize: 14, fontWeight: 600, lineHeight: 1, paddingBottom: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

// ─── Formatação de munições por classe ───────────────────────
/**
 * Detecta a classe "primária" de um item (aquela que tem a quantidade maior).
 * - Itens com `by`: o primeiro da lista é o primário.
 * - Itens `by: null` do tipo ranged: hunter é o primário (flechas).
 */
function getPrimaryClass(item) {
  if (!item) return null;
  if (item.by && item.by.length > 0) return item.by[0];
  if (item.type === 'ranged') return 'hunter';
  return null;
}

/**
 * Formata o texto de munição de acordo com a classe atual.
 *
 * Regras:
 * - "Label: X (Y)" → classe primária mostra Y, outras mostram X
 * - "Label: (Y)"   → classe primária mostra Y, outras NÃO mostram a linha
 * - "Label: X"     → todos mostram X (sem diferença)
 */
function formatAmmoForClass(ammoStr, classId, item) {
  if (!ammoStr) return ammoStr;
  const primaryClass = getPrimaryClass(item);
  // Se não há classe primária definida, mostra como está
  if (!primaryClass) return ammoStr;

  const isPrimary = classId === primaryClass;

  const lines = ammoStr.split('\n');
  const result = lines.map(line => {
    // Padrão "Label: X (Y)" — valor externo e interno
    const matchBoth = line.match(/^(.+?):\s*(\d+)\s*\((\d+)\)$/)
    if (matchBoth) {
      const [, label, outside, inside] = matchBoth
      return isPrimary ? `${label}: ${inside}` : `${label}: ${outside}`
    }
    // Padrão "Label: (Y)" — só valor entre parênteses
    const matchInner = line.match(/^(.+?):\s*\((\d+)\)$/)
    if (matchInner) {
      const [, label, inside] = matchInner
      // Primário mostra o valor; outros ocultam a linha inteiramente
      return isPrimary ? `${label}: ${inside}` : null
    }
    // Sem parênteses — igual para todos
    return line
  }).filter(Boolean)  // remove as linhas null (ocultas)

  return result.join('\n')
}

// ─── Perk selector ───────────────────────────────────────────
function PerkRow({ item, selected, other, onSelect, perkSlot, lang, forcedPerkId }) {
  // Se forcedPerkId existe, este slot está travado (perk de desbloqueio obrigatório)
  const isForced = perkSlot === 'perk1' && !!forcedPerkId
  const effectiveSelected = isForced ? forcedPerkId : selected

  const avail = item ? item.perks.filter(p => p.id !== other) : []
  const perkDef = effectiveSelected ? item?.perks.find(p => p.id === effectiveSelected) : null
  const labelPT = perkSlot === 'perk1' ? 'Vantagem I (60 Ki)' : 'Vantagem II (120 Ki)'
  const labelEN = perkSlot === 'perk1' ? 'Perk I (60 Ki)' : 'Perk II (120 Ki)'
  const label = lang === 'en' ? labelEN : labelPT
  const desc = perkDef ? (lang === 'en' ? (perkDef.dEN || perkDef.dPT) : perkDef.dPT) : null

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: T.muted }}>{label}</span>
        {isForced && (
          <span style={{ fontSize: 10, color: T.leg, fontWeight: 700 }}>
            🔒 {lang === 'en' ? 'Required' : 'Obrigatório'}
          </span>
        )}
      </div>
      {/*
        IMPORTANTE: NÃO envolva o <select> em <Tooltip>.
        O Tooltip cria um <span display:inline-block> que faz o select
        ignorar width:100% do parent e encolher para o tamanho do texto.
        A descrição já aparece abaixo, então o Tooltip é desnecessário aqui.
      */}
      <select
        value={effectiveSelected ?? ''}
        onChange={e => !isForced && onSelect(e.target.value || null)}
        disabled={isForced}
        style={{
          width: '100%',
          display: 'block',
          background: T.panel,
          border: `1px solid ${isForced ? T.leg + '60' : T.border}`,
          borderRadius: 6, color: isForced ? T.leg : T.text,
          fontSize: 12, padding: '5px 8px',
          opacity: isForced ? 0.85 : 1,
          cursor: isForced ? 'not-allowed' : 'default',
        }}>
        {isForced ? null : <option value="">— {lang === 'en' ? 'Perk' : 'Vantagem'} —</option>}
        {avail.map(p => (
          <option key={p.id} value={p.id}>
            {lang === 'en' ? (p.nEN || p.nPT) : p.nPT}
          </option>
        ))}
      </select>
      {desc && (
        <div style={{ fontSize: 11, color: isForced ? T.leg : T.muted, marginTop: 3, paddingLeft: 4 }}>
          {desc}
        </div>
      )}
    </div>
  )
}

// ─── Gear slot card ──────────────────────────────────────────
function GearSlotCard({ slotName, slotState, classId, build, setBuild, stats, lang, gearIconMode }) {
  const L = lang === 'en' ? LABELS_EN : LABELS_PT
  const available = useMemo(() => getGearListForClass(slotName === 'gw1' ? 'gw1' : slotName === 'gw2' ? 'gw2' : slotName, classId), [slotName, classId])

  const item = slotState.itemId ? getItem(slotState.itemId) : null
  const effectiveItem = useMemo(() => {
    if (!slotState.itemId) return null
    if (slotName === 'charm') return getEffectiveCharm(slotState.itemId, slotState.linkedClass)
    return getItem(slotState.itemId)
  }, [slotState.itemId, slotState.linkedClass, slotName])

  const isLeg   = item?.leg === true
  const ammo    = item?.ammo
  const xp      = item?.xp
  const legInfo = useMemo(() => checkLegendaryLimit(build), [build])
  // Perk obrigatório para esta combinação item+classe (null se não houver)
  const requiredPerkId = useMemo(
    () => getRequiredPerkId(slotState.itemId, classId),
    [slotState.itemId, classId]
  )

  const slotLabel = {
    katana: lang === 'en' ? 'Katana'          : 'Katana',
    ranged: lang === 'en' ? 'Ranged Weapon'   : 'Longo Alcance',
    charm:  lang === 'en' ? 'Charm'           : 'Amuleto',
    gw1:    lang === 'en' ? 'Ghost Weapon I'  : 'Arma Fantasma I',
    gw2:    lang === 'en' ? 'Ghost Weapon II' : 'Arma Fantasma II',
  }[slotName]

  // GW cooldown display
  const gwCd = slotName === 'gw1' ? stats?.gw1 : slotName === 'gw2' ? stats?.gw2 : null

  const onItemSelect = (itemId) => {
    // Check legendary limit
    if (itemId) {
      const newItem = getItem(itemId)
      if (newItem?.leg && !item?.leg && !legInfo.canAdd) return
    }
    setBuild(prev => selectItem(prev, slotName, itemId || null))
  }

  const onPropChange = (propSlot, propId) => {
    setBuild(prev => selectProp(prev, slotName, propSlot, propId))
  }

  const onPropValue = (propSlot, val) => {
    setBuild(prev => setPropValue(prev, slotName, propSlot, val, true))
  }

  const onPerkSelect = (perkSlot, perkId) => {
    setBuild(prev => selectPerk(prev, slotName, perkSlot, perkId))
  }

  // Ícone do item atual (para compact e full)
  const itemIconUrl = item ? getGearIconUrl(item) : null

  return (
    <div style={{
      background: T.card, border: `1px solid ${isLeg ? T.leg + '55' : T.border}`,
      borderRadius: 10, padding: '12px 14px', marginBottom: 10,
    }}>

      {/* ── Modo EXPANDIDO: ícone grande + nome do slot ── */}
      {gearIconMode === 'full' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
          background: isLeg ? T.leg + '10' : T.panel,
          border: `1px solid ${isLeg ? T.leg + '30' : T.border}`,
          borderRadius: 8, padding: '8px 10px',
        }}>
          {/* Ícone grande do item (ou placeholder de slot) */}
          {itemIconUrl ? (
            <img src={itemIconUrl} width={36} height={36}
              style={{ filter: T.iconFilter, opacity: 0.85, objectFit: 'contain', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none' }}
              alt=""
            />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: 6, flexShrink: 0,
              background: T.dim, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, color: T.muted,
            }}>
              {{ katana: '⚔', ranged: '🏹', charm: '🧿', gw1: '💣', gw2: '💊' }[slotName]}
            </div>
          )}
          {/* Nome do slot (sem duplicar nome do item) */}
          <div>
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: isLeg ? T.leg : T.text,
            }}>
              {slotLabel}
              {isLeg && (
                <span style={{ fontSize: 10, color: T.leg, marginLeft: 5 }}>★</span>
              )}
            </div>
            {item && (
              <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>
                {lang === 'en' ? (item.nEN || item.nPT) : item.nPT}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Header (modo COMPACTO ou sem seleção no expandido) ── */}
      {gearIconMode === 'compact' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {/* Ícone compacto do item */}
          {itemIconUrl && (
            <img src={itemIconUrl} width={20} height={20}
              style={{ filter: T.iconFilter, opacity: 0.75, objectFit: 'contain', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none' }}
              alt=""
            />
          )}
          <span style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>
            {slotLabel}
          </span>
          {isLeg && <Tag color={T.leg}>MAGISTRAL</Tag>}
          {!legInfo.canAdd && !item?.leg && (
            <span style={{ fontSize: 10, color: T.muted }}>
              ({lang === 'en' ? 'Legendary limit reached' : 'Limite magistral atingido'})
            </span>
          )}
        </div>
      )}

      {/* No modo expandido, tag MAGISTRAL aparece separada do bloco de ícone */}
      {gearIconMode === 'full' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {isLeg && <Tag color={T.leg}>MAGISTRAL</Tag>}
          {!legInfo.canAdd && !item?.leg && (
            <span style={{ fontSize: 10, color: T.muted }}>
              ({lang === 'en' ? 'Legendary limit reached' : 'Limite magistral atingido'})
            </span>
          )}
        </div>
      )}

      {/* ── Seletor de item ── */}
      <select
        value={slotState.itemId ?? ''}
        onChange={e => onItemSelect(e.target.value)}
        style={{
          width: '100%', background: T.panel, border: `1px solid ${T.border}`,
          borderRadius: 6, color: T.text, fontSize: 12, padding: '6px 8px',
          marginBottom: 10,
        }}>
        <option value="">— {lang === 'en' ? 'Select item' : 'Selecionar'} —</option>
        {available.filter(i => !i.leg).map(i => (
          <option key={i.id} value={i.id}>
            {lang === 'en' ? (i.nEN || i.nPT) : i.nPT}
          </option>
        ))}
        {available.filter(i => i.leg).length > 0 && (
          <>
            <option disabled>── {lang === 'en' ? 'Legendary' : 'Magistrais'} ──</option>
            {available.filter(i => i.leg).map(i => (
              <option
                key={i.id} value={i.id}
                disabled={!legInfo.canAdd && i.leg && !item?.leg}
              >
                {lang === 'en' ? (i.nEN || i.nPT) : i.nPT} ★
              </option>
            ))}
          </>
        )}
      </select>

      {item && (
        <>
          {/* Legendary exclusive perk */}
          {isLeg && xp && (
            <div style={{
              background: T.leg + '12', border: `1px solid ${T.leg}35`,
              borderRadius: 7, padding: '8px 12px', marginBottom: 10,
              fontSize: 12, color: T.leg,
            }}>
              ✨ {lang === 'en' ? (xp.en || xp.pt) : xp.pt}
            </div>
          )}

          {/* Ammo info — formatada por classe */}
          {ammo && (() => {
            const rawAmmo = lang === 'en' ? (ammo.en || ammo.pt) : ammo.pt
            const formattedAmmo = formatAmmoForClass(rawAmmo, classId, item)
            if (!formattedAmmo) return null
            return (
              <div style={{
                background: T.panel, border: `1px solid ${T.border}`,
                borderRadius: 7, padding: '7px 12px', marginBottom: 10,
                fontSize: 11, color: T.muted, whiteSpace: 'pre-line',
              }}>
                🎯 {formattedAmmo}
              </div>
            )
          })()}

          {/* GW cooldown */}
          {gwCd && (
            <div style={{
              background: T.panel, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '7px 12px', marginBottom: 10,
            }}>
              <span style={{ fontSize: 11, color: T.muted }}>
                ⏱ {lang === 'en' ? 'Cooldown:' : 'Recarga:'} {' '}
              </span>
              <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>
                {formatCd(gwCd.baseCd)} → {formatCd(gwCd.finalCd)}
              </span>
              {gwCd.killCDR && (
                <span style={{ fontSize: 11, color: T.muted }}>
                  {' '}(−{gwCd.killCDR}s {lang === 'en' ? 'on kill' : 'ao abater'})
                </span>
              )}
            </div>
          )}

          {/* Props */}
          <PropInput
            item={effectiveItem}
            propState={slotState.p1}
            propSlot="p1"
            otherPropId={slotState.p2?.propId}
            onPropChange={id => onPropChange('p1', id)}
            onValueChange={v => onPropValue('p1', v)}
            locked={isLeg}
            lang={lang}
          />
          <PropInput
            item={effectiveItem}
            propState={slotState.p2}
            propSlot="p2"
            otherPropId={slotState.p1?.propId}
            onPropChange={id => onPropChange('p2', id)}
            onValueChange={v => onPropValue('p2', v)}
            locked={isLeg}
            lang={lang}
          />

          {/* Perks */}
          <PerkRow
            item={effectiveItem}
            selected={slotState.perk1}
            other={slotState.perk2}
            onSelect={id => onPerkSelect('perk1', id)}
            perkSlot="perk1"
            lang={lang}
            forcedPerkId={requiredPerkId}
          />
          <PerkRow
            item={effectiveItem}
            selected={slotState.perk2}
            other={slotState.perk1}
            onSelect={id => onPerkSelect('perk2', id)}
            perkSlot="perk2"
            lang={lang}
          />
        </>
      )}
    </div>
  )
}

// ─── Techniques panel ────────────────────────────────────────
function TechniquesPanel({ build, setBuild, lang, layoutMode }) {
  const cls = getClass(build.classId)
  if (!cls) return null
  const L = lang === 'en' ? LABELS_EN : LABELS_PT

  const tierLabel = {
    ability: lang === 'en' ? '⚡ Class Ability' : '⚡ Habilidade de Classe',
    I:   lang === 'en' ? '📚 Perk I'   : '📚 Vantagem I',
    II:  lang === 'en' ? '📚 Perk II'  : '📚 Vantagem II',
    III: lang === 'en' ? '📚 Perk III' : '📚 Vantagem III',
  }

  // Returns true if the current tech in `tier` can be replaced/deselected
  // Blocks if the current tech grants legSlots and removing it would leave
  // more legendary items equipped than the new limit allows
  const canChangeTech = (tier, incomingId) => {
    const currentId = build.techs[tier]
    if (!currentId) return true
    const currentTech = cls.techs.find(t => t.id === currentId)
    const legSlotsLost = currentTech?.fx
      .filter(f => f.s === 'legSlots')
      .reduce((a, f) => a + f.v, 0) ?? 0
    if (legSlotsLost === 0) return true
    // How many legendary items are currently equipped?
    const legUsed = Object.values(build.gear)
      .filter(s => s.itemId && getItem(s.itemId)?.leg).length
    // What would the new limit be?
    const newTech = incomingId && incomingId !== currentId
      ? cls.techs.find(t => t.id === incomingId) : null
    const legSlotsGained = newTech?.fx
      .filter(f => f.s === 'legSlots')
      .reduce((a, f) => a + f.v, 0) ?? 0
    const currentLimit = checkLegendaryLimit(build).limit
    const newLimit = currentLimit - legSlotsLost + legSlotsGained
    return legUsed <= newLimit
  }

  const TechRow = ({ tech, selected, onToggle, blocked, layoutMode: rowLayoutMode }) => {
    const desc    = lang === 'en' ? (tech.dEN || tech.dPT) : tech.dPT
    const name    = lang === 'en' ? (tech.nEN || tech.nPT) : tech.nPT
    const isLeg   = name.toLowerCase() === 'magistral' || name.toLowerCase() === 'legendary'
    const isSp    = tech.sp
    const isAct   = selected === tech.id
    const isBlocked = blocked && isAct
    const iconUrl = getTechIconUrl(tech.id, build.classId)

    /*
      wrapperStyle do Tooltip — é o que torna os dois modos independentes:
      - three-col: bloco 100% → o botão ocupa a coluna inteira (larguras uniformes)
      - two-col:   inline-block 100% → os botões fluem lado a lado dentro do grid
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
              // marginBottom removido daqui — está no div pai acima
              cursor: isBlocked ? 'not-allowed' : 'pointer', color: T.text,
              transition: 'all 0.15s',
            }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {/* Ícone da técnica PNG (sem filtro — mantém cores originais douradas) */}
            {iconUrl ? (
              <img
                src={iconUrl}
                width={18} height={18}
                style={{
                  flexShrink: 0,
                  objectFit: 'contain',
                  opacity: isAct ? 1 : 0.38,
                }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'inline-block'
                }}
                alt=""
              />
            ) : null}
            {/* Bolinha fallback — visível somente quando PNG falhou ao carregar */}
            <span style={{
              display: 'none',
              width: 12, height: 12, borderRadius: '50%', border: '2px solid',
              borderColor: isAct ? T.cls[build.classId] : T.dim,
              background: isAct ? T.cls[build.classId] : 'transparent',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 12, fontWeight: isAct ? 700 : 400,
              color: isAct ? T.text : T.muted,
              // No 2-col os botoes ficam lado a lado numa grade: quebrar o
              // nome no meio nao faz sentido. A reticencia so aparece em
              // janela muito estreita — a celula de 190px cobre o pior nome.
              ...(rowLayoutMode === 'two-col' ? {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              } : {}),
            }}>
              {name}
              {isBlocked && ' 🔒'}
            </span>
          </div>
        </button>
        </Tooltip>
      </div>
    )
  }

  const handleAbility = (id) => {
    setBuild(prev => ({ ...prev, abilityId: prev.abilityId === id ? null : id }))
  }

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 10, padding: '14px 16px', marginBottom: 10,
    }}>
      {/* Ability */}
      <SectionTitle>{tierLabel.ability}</SectionTitle>
      {/*
        No modo 2 colunas (two-col), as habilidades ficam lado a lado em grid.
        No modo 3 colunas (three-col ou padrão), ficam empilhadas normalmente.
      */}
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

      <Divider />

      {/* Tiers I, II, III */}
      {['I', 'II', 'III'].map(tier => {
        const techs = cls.techs.filter(t => t.tier === tier)
        return (
          <div key={tier} style={{ marginBottom: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 6,
            }}>
              <SectionTitle>{tierLabel[tier]}</SectionTitle>
              {build.techs[tier] && (
                <button
                  onClick={() => {
                    if (!canChangeTech(tier, null)) return
                    setBuild(prev => ({ ...prev, techs: { ...prev.techs, [tier]: null } }))
                  }}
                  title={!canChangeTech(tier, null)
                    ? (lang === 'en' ? 'Unequip a Legendary item first' : 'Desequipe um item Magistral primeiro')
                    : undefined}
                  style={{
                    background: 'none', border: 'none', color: T.muted,
                    cursor: canChangeTech(tier, null) ? 'pointer' : 'not-allowed',
                    fontSize: 11, padding: '0 4px', opacity: canChangeTech(tier, null) ? 1 : 0.35,
                  }}>✕</button>
              )}
            </div>
            {/*
              Container dos TechRows:
              - two-col:   grid lado a lado (minmax 140px evita quebra de nome)
              - three-col: coluna simples, um embaixo do outro
            */}
            <div style={layoutMode === 'two-col' ? {
              display: 'grid',
              // 190px cabe o nome mais longo do jogo ("Armas Fantasma
              // Melhoradas", 25 caracteres) em uma linha, ja descontando
              // padding, icone e gap. O `1fr` faz as celulas esticarem, entao
              // nao sobra buraco quando cabem menos por linha.
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
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
          </div>
        )
      })}
    </div>
  )
}

// ─── UltimateHeader — ícone supremo no topo da coluna de stats ──
// Exibe o ícone grande centralizado + nome da habilidade suprema
// O tamanho é controlado pela constante ULTIMATE_ICON_SIZE no topo do arquivo
function UltimateHeader({ stats, build, lang }) {
  const cls      = getClass(build.classId)
  const clsColor = T.cls[build.classId]
  const iconUrl  = CLASS_TECH_FALLBACK[build.classId]  // ícone da habilidade suprema
  const ult      = stats?.ultimate
  if (!cls) return null

  const ultName = ult
    ? (lang === 'en' ? (ult.nEN || ult.nPT) : ult.nPT)
    : (lang === 'en' ? 'Ultimate' : 'Supremo')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: clsColor + '14',
      border: `1px solid ${clsColor}40`,
      borderRadius: 10, padding: '14px 10px 10px',
      marginBottom: 10,
      gap: 8,
    }}>
      {/* Ícone grande — tamanho ajustado por ULTIMATE_ICON_SIZE */}
      {iconUrl && (
        <img
          src={iconUrl}
          width={ULTIMATE_ICON_SIZE}
          height={ULTIMATE_ICON_SIZE}
          style={{
            objectFit: 'contain',
            // PNG mantém cores originais douradas — sem filtro
            // (os PNGs de técnica já têm as cores certas)
            filter: 'drop-shadow(0 2px 8px ' + clsColor + '66)',
          }}
          onError={e => { e.target.style.display = 'none' }}
          alt={ultName}
        />
      )}
      {/* Nome da habilidade suprema */}
      <div style={{
        fontSize: 13, fontWeight: 700,
        color: clsColor,
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {ultName}
      </div>
    </div>
  )
}

// ─── Ultimate card ───────────────────────────────────────────
function UltimateCard({ stats, build, setBuild, lang }) {
  const ult = stats?.ultimate
  if (!ult) return null
  const cls = getClass(build.classId)
  const clsColor = T.cls[build.classId]

  const title = lang === 'en' ? (ult.nEN || ult.nPT) : ult.nPT
  const ultPct = ult.ultDmgBonus > 0 ? ` (+${Math.round(ult.ultDmgBonus * 100)}% ${lang === 'en' ? 'dmg' : 'dano'})` : ''

  return (
    <div style={{
      background: clsColor + '12', border: `1px solid ${clsColor}40`,
      borderRadius: 10, padding: '12px 14px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontWeight: 700, color: clsColor, fontSize: 14 }}>{title}</span>
        <span style={{ fontSize: 11, color: T.muted }}>
          {lang === 'en' ? 'Cost:' : 'Custo:'} {ult.cost}★
        </span>
      </div>

      {/* Samurai */}
      {ult.classId === 'samurai' && ult.mode === 'normal' && (
        <div style={{ fontSize: 12, color: T.text }}>
          {lang === 'en' ? 'Strikes:' : 'Golpes:'}{' '}
          <strong>{ult.strikes}</strong>
          {ult.strikeBonus > 0 && (
            <span style={{ color: T.green, fontSize: 11 }}> (+{ult.strikeBonus})</span>
          )}
          {ultPct && <span style={{ color: T.accent, fontSize: 11 }}>{ultPct}</span>}
        </div>
      )}
      {ult.classId === 'samurai' && ult.mode === 'rage300' && (
        <div style={{ fontSize: 12, color: T.leg }}>
          {lang === 'en' ? '2 strikes × 300% damage' : '2 golpes × 300% de dano'}
        </div>
      )}

      {/* Hunter */}
      {ult.classId === 'hunter' && (
        <div style={{ fontSize: 12, color: T.text }}>
          {lang === 'en' ? 'Targets:' : 'Alvos:'}{' '}
          <strong>{ult.targets}</strong>
          {ult.targetBonus > 0 && (
            <span style={{ color: T.green, fontSize: 11 }}> (+{ult.targetBonus})</span>
          )}
          {ultPct && <span style={{ color: T.accent, fontSize: 11 }}>{ultPct}</span>}
        </div>
      )}

      {/* Ronin */}
      {ult.classId === 'ronin' && (
        <div>
          {ult.variants?.map(v => {
            const name = lang === 'en' ? (v.nEN || v.nPT) : v.nPT
            const desc = lang === 'en' ? (v.dEN || v.dPT) : v.dPT
            const isAct = ult.variants.length === 1 || ult.activeBreath === v.id
            return (
              <div key={v.id} style={{
                background: isAct ? clsColor + '20' : 'transparent',
                border: `1px solid ${isAct ? clsColor + '50' : T.border}`,
                borderRadius: 7, padding: '6px 10px', marginBottom: 5,
                cursor: ult.variants.length > 1 ? 'pointer' : 'default',
              }}
                onClick={() => ult.variants.length > 1 && setBuild(prev => ({
                  ...prev,
                  ronin_breath: prev.ronin_breath === v.id ? null : v.id,
                }))}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isAct ? clsColor : T.muted }}>
                  {name}
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>{desc}</div>
              </div>
            )
          })}
          {ultPct && <div style={{ fontSize: 11, color: T.accent }}>{ultPct}</div>}
        </div>
      )}

      {/* Assassin */}
      {ult.classId === 'assassin' && (
        <div style={{ fontSize: 12, color: T.text }}>
          {lang === 'en' ? 'Strikes:' : 'Golpes:'}{' '}
          <strong>{ult.strikes}</strong>
          {ult.strikeBonus > 0 && (
            <span style={{ color: T.green, fontSize: 11 }}> (+{ult.strikeBonus})</span>
          )}
          {ult.dmgMult && (
            <span style={{ color: T.accent, fontSize: 11 }}>
              {' '}× {ult.dmgMult} {lang === 'en' ? 'dmg' : 'dano'}
            </span>
          )}
          {!ult.dmgMult && ultPct && (
            <span style={{ color: T.accent, fontSize: 11 }}>{ultPct}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Stats panel ─────────────────────────────────────────────
function StatsPanel({ stats, build, setBuild, lang }) {
  const L = lang === 'en' ? LABELS_EN : LABELS_PT
  const groups = useMemo(() => stats ? getStatGroups(stats, build.classId, lang) : [], [stats, build.classId, lang])

  const fmtStat = (s) => {
    if (s.unit === '★') return '★'.repeat(s.value)
    if (s.unit === '%') return pct(s.value)
    if (s.unit === 'pts' || s.unit === 's') return pts(s.value, s.unit)
    return String(s.value)
  }

  const changed = (s) => s.value !== s.base

  if (!stats) return null

  return (
    <div>
      {/* Ultimate */}
      <UltimateCard stats={stats} build={build} setBuild={setBuild} lang={lang} />

      {/* Ability cooldown */}
      {stats.abilityCooldown && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: '10px 14px', marginBottom: 10,
          fontSize: 12,
        }}>
          <span style={{ color: T.muted }}>⚡ </span>
          <span style={{ color: T.text, fontWeight: 600 }}>
            {lang === 'en'
              ? (stats.abilityCooldown.nEN || stats.abilityCooldown.nPT)
              : stats.abilityCooldown.nPT}
          </span>
          <span style={{ color: T.muted, marginLeft: 8, fontSize: 11 }}>
            {lang === 'en' ? 'Cooldown:' : 'Recarga:'}{' '}
          </span>
          <span style={{ color: T.text }}>
            {formatCd(stats.abilityCooldown.baseCd)} → {formatCd(stats.abilityCooldown.finalCd)}
          </span>
          {stats.abilityCooldown.cdr > 0 && (
            <span style={{ color: T.green, fontSize: 11 }}>
              {' '}(−{Math.round(stats.abilityCooldown.cdr * 100)}%)
            </span>
          )}
        </div>
      )}

      {/* Stat groups */}
      {groups.map(g => (
        <div key={g.groupId} style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: '12px 14px', marginBottom: 10,
        }}>
          <SectionTitle>{g.label}</SectionTitle>

          {g.stats.map(s => (
            <div key={s.key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '4px 0',
              borderBottom: `1px solid ${T.border}20`,
            }}>
              <span style={{ fontSize: 12, color: changed(s) ? T.text : T.muted }}>{s.label}</span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: changed(s) ? T.green : T.muted,
              }}>
                {fmtStat(s)}
              </span>
            </div>
          ))}

          {/* GW cooldown sub-cards */}
          {g.groupId === 'cooldowns' && (
            <>
              {[stats.gw1, stats.gw2].filter(Boolean).map((gw, i) => (
                <div key={i} style={{
                  marginTop: 8, background: T.panel, border: `1px solid ${T.border}`,
                  borderRadius: 7, padding: '8px 10px',
                }}>
                  <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 4 }}>
                    {lang === 'en' ? (gw.nEN || gw.nPT) : gw.nPT}
                    <span style={{ color: T.muted, fontWeight: 400 }}>
                      {' '}({lang === 'en' ? 'GW' : 'AF'} {i + 1})
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: T.text }}>
                    {formatCd(gw.baseCd)} → <strong>{formatCd(gw.finalCd)}</strong>
                    {gw.totalPctCDR > 0 && (
                      <span style={{ color: T.green, fontSize: 11 }}>
                        {' '}(−{Math.round(gw.totalPctCDR * 100)}%)
                      </span>
                    )}
                  </div>
                  {gw.killCDR && (
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                      {lang === 'en' ? 'On kill:' : 'Ao abater:'} −{gw.killCDR}s
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

const btnAction = (color) => ({
  background: color + '28', border: `1px solid ${color}99`, color: T.text,
  borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
  fontWeight: 600, whiteSpace: 'nowrap',
})

const btnNeutral = {
  background: T.cardHov, border: `1px solid ${T.borderHov}`, color: T.text,
  borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
  fontWeight: 600, whiteSpace: 'nowrap',
}

const btnMini = (color) => ({
  background: color + '20', border: `1px solid ${color}40`, color: T.text,
  borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 11,
  flexShrink: 0,
})

// ─── Ícone de lixeira (SVG inline) ──────────────────────────
function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

// ─── BookmarkTab — aba lateral para abrir/fechar builds ──────
function BookmarkTab({ open, onToggle, lang }) {
  return (
    <Tooltip text={open
      ? (lang === 'en' ? 'Close saved builds panel' : 'Fechar painel de builds salvas')
      : (lang === 'en'
          ? 'Open saved builds — save, load, export, import and share your builds'
          : 'Abrir builds salvas — salve, carregue, exporte, importe e compartilhe suas builds')
    }>
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          left: 0,
          // Alinhado ao sub-header: header (~44px) + início do sub-header
          top: 44,
          zIndex: 450,
          background: open ? T.borderHov : T.card,
          border: `1px solid ${open ? T.borderHov : T.accent + 'cc'}`,
          borderLeft: 'none',
          borderRadius: '0 8px 8px 0',
          // Altura calibrada para cobrir só o sub-header (~44px)
          height: 44,
          padding: '0 7px',
          cursor: 'pointer',
          boxShadow: open ? 'none' : '3px 0 12px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          color: open ? T.muted : T.text,
          userSelect: 'none',
        }}
      >
        {/* Logo PNG do jogo */}
        <img
          src={LOGO_URL}
          alt="GoT Legends"
          width={22}
          height={22}
          style={{
            // PNG tem cores próprias — aplicamos apenas contraste via tema
            filter: T.iconFilter,
            opacity: open ? 0.35 : 0.9,
            objectFit: 'contain',
          }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        {/* Fallback se PNG não carregar */}
        <span style={{ display: 'none', fontSize: 18 }}>⛩</span>
      </button>
    </Tooltip>
  )
}

// ─── SaveDrawer — painel lateral de gerenciamento de builds ──
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName }) {
  const [saves, setSaves]         = useState([])
  const [shareCode, setShareCode] = useState('')
  // Flash: string quando mensagem ativa, null quando silencioso
  const [flash, setFlash]         = useState(null)
  const fileRef = useRef()
  const STORAGE_KEY = 'gotlegends_v1_builds'

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSaves(JSON.parse(raw))
    } catch {}
  }, [])

  const persist = (list) => {
    setSaves(list)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  // Flash com posição fixa — não empurra conteúdo
  const showFlash = (msg) => {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2200)
  }

  const save = () => {
    const name = buildName.trim() || (lang === 'en' ? 'Unnamed' : 'Sem nome')
    const entry = serializeBuild(build, name)
    persist([entry, ...saves.filter(s => s.name !== name)])
    showFlash(lang === 'en' ? `✓ "${name}" saved` : `✓ "${name}" salvo`)
  }

  const load = (entry) => {
    const r = deserializeBuild(entry)
    if (r.ok) {
      window.__loadBuild?.(r.build)
      showFlash(lang === 'en' ? `✓ "${entry.name}" loaded` : `✓ "${entry.name}" carregado`)
    } else {
      showFlash(lang === 'en' ? '✗ Error loading' : '✗ Erro ao carregar')
    }
  }

  const remove = (id) => persist(saves.filter(s => s.id !== id))

  const clearAll = () => {
    if (window.confirm(lang === 'en'
      ? 'Delete ALL saved builds? This cannot be undone.'
      : 'Apagar TODAS as builds salvas? Esta ação não pode ser desfeita.')) {
      persist([])
      showFlash(lang === 'en' ? 'All builds cleared' : 'Todas as builds apagadas')
    }
  }

  const exportAll = () => {
    if (!saves.length) return
    const blob = new Blob(
      [JSON.stringify({ version: '1.0', game: 'got-legends', builds: saves }, null, 2)],
      { type: 'application/json' }
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'got-legends-builds.json'
    a.click()
  }

  const importFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result)
        const incoming = json.builds ?? [json]
        const valid = incoming.filter(b => b.build?.classId)
        persist([...valid, ...saves.filter(s => !valid.find(v => v.id === s.id))])
        showFlash(`${valid.length} ${lang === 'en' ? 'builds imported' : 'builds importados'}`)
      } catch {
        showFlash(lang === 'en' ? '✗ Invalid file' : '✗ Arquivo inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const copyCode = () => {
    const code = encodeBuild(build, buildName || 'Build')
    setShareCode(code)
    navigator.clipboard.writeText(code).catch(() => {})
    showFlash(lang === 'en' ? '✓ Code copied!' : '✓ Código copiado!')
  }

  const loadCode = () => {
    const r = decodeBuild(shareCode.trim())
    if (r.ok) {
      window.__loadBuild?.(r.build)
      setShareCode('')
      showFlash(lang === 'en' ? '✓ Build loaded!' : '✓ Build carregada!')
    } else {
      showFlash(lang === 'en' ? '✗ Invalid code' : '✗ Código inválido')
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop — clique fora fecha */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(0,0,0,0.42)',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: 'min(300px, 88vw)',
        zIndex: 500,
        background: T.panel,
        borderRight: `1px solid ${T.borderHov}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '6px 0 28px rgba(0,0,0,0.55)',
      }}>

        {/* ── Cabeçalho fixo do drawer */}
        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 12px 10px',
          borderBottom: `1px solid ${T.border}`,
          background: T.card,
        }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>
            🗂️ {lang === 'en' ? 'Saved Builds' : 'Builds Salvas'}
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            {saves.length > 0 && (
              <Tooltip text={lang === 'en' ? 'Delete all saved builds' : 'Apagar todas as builds salvas'}>
                <button onClick={clearAll} style={{
                  background: T.red + '20',
                  border: `1px solid ${T.red}40`,
                  borderRadius: 6, color: T.red,
                  padding: '4px 8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11,
                }}>
                  <TrashIcon size={12} />
                </button>
              </Tooltip>
            )}
            <Tooltip text={lang === 'en' ? 'Close panel' : 'Fechar painel'}>
              <button onClick={onClose} style={{
                background: T.cardHov, border: `1px solid ${T.border}`,
                borderRadius: 6, color: T.muted, cursor: 'pointer',
                padding: '4px 9px', fontSize: 14,
              }}>✕</button>
            </Tooltip>
          </div>
        </div>

        {/* ── Flash — altura FIXA, sempre ocupando espaço (não empurra) */}
        <div style={{
          flexShrink: 0,
          height: 28,
          margin: '6px 12px 0',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
          background: flash
            ? (flash.startsWith('✗') ? T.red + '22' : T.green + '22')
            : 'transparent',
          color: flash
            ? (flash.startsWith('✗') ? T.red : T.green)
            : 'transparent',
          border: flash
            ? `1px solid ${flash.startsWith('✗') ? T.red + '40' : T.green + '40'}`
            : '1px solid transparent',
          transition: 'all 0.2s',
          userSelect: 'none',
        }}>
          {flash ?? ''}
        </div>

        {/* ── Área scrollável com controles */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>

          {/* Nome da build + salvar */}
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>
            {lang === 'en' ? 'Build name' : 'Nome da build'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={buildName}
                onChange={e => setBuildName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') save() }}
                placeholder={lang === 'en' ? 'Name...' : 'Nome...'}
                style={{
                  width: '100%', background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text, fontSize: 12,
                  padding: '6px 24px 6px 8px',
                }}
              />
              {buildName && (
                <button onClick={() => setBuildName('')}
                  title={lang === 'en' ? 'Clear' : 'Limpar'}
                  style={{
                    position: 'absolute', right: 5, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: T.muted, cursor: 'pointer', fontSize: 12,
                    padding: 0, lineHeight: 1,
                  }}>✕</button>
              )}
            </div>
            <Tooltip text={lang === 'en' ? 'Save current build' : 'Salvar build atual'}>
              <button onClick={save} style={btnAction(T.accent)}>
                {lang === 'en' ? 'Save' : 'Salvar'}
              </button>
            </Tooltip>
          </div>

          <Divider />

          {/* Exportar / Importar */}
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 5 }}>
            📁 {lang === 'en' ? 'Export / Import .json' : 'Exportar / Importar .json'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <Tooltip text={lang === 'en'
              ? 'Export all saved builds to a .json file'
              : 'Exportar todas as builds salvas para .json'}>
              <button onClick={exportAll}
                disabled={!saves.length}
                style={{ ...btnNeutral, opacity: saves.length ? 1 : 0.4, fontSize: 11 }}>
                ⬇ {lang === 'en' ? 'Export' : 'Exportar'}
              </button>
            </Tooltip>
            <Tooltip text={lang === 'en'
              ? 'Import builds from a .json file'
              : 'Importar builds de um arquivo .json'}>
              <button onClick={() => fileRef.current.click()} style={{ ...btnNeutral, fontSize: 11 }}>
                ⬆ {lang === 'en' ? 'Import' : 'Importar'}
              </button>
            </Tooltip>
            <input ref={fileRef} type="file" accept=".json"
              style={{ display: 'none' }} onChange={importFile} />
          </div>

          <Divider />

          {/* Código de compartilhamento */}
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 5 }}>
            🔗 {lang === 'en' ? 'Share Code' : 'Código de Compartilhamento'}
          </div>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <input
              value={shareCode}
              onChange={e => setShareCode(e.target.value)}
              placeholder={lang === 'en' ? 'Paste code...' : 'Cole o código...'}
              style={{
                width: '100%', background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 6, color: T.text,
                fontSize: 11, padding: '5px 24px 5px 8px',
              }}
            />
            {shareCode && (
              <button onClick={() => setShareCode('')}
                title={lang === 'en' ? 'Clear code' : 'Limpar código'}
                style={{
                  position: 'absolute', right: 5, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: T.muted, cursor: 'pointer', fontSize: 12,
                  padding: 0, lineHeight: 1,
                }}>✕</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            <Tooltip text={lang === 'en'
              ? 'Generate and copy the share code for the current build'
              : 'Gerar e copiar o código de compartilhamento da build atual'}>
              <button onClick={copyCode} style={{ ...btnNeutral, fontSize: 11 }}>
                📋 {lang === 'en' ? 'Copy' : 'Copiar'}
              </button>
            </Tooltip>
            <Tooltip text={lang === 'en'
              ? 'Load a build from the pasted share code'
              : 'Carregar uma build pelo código colado'}>
              <button onClick={loadCode} disabled={!shareCode}
                style={{ ...btnAction('#2475ad'), opacity: shareCode ? 1 : 0.4, fontSize: 11 }}>
                ⬆ {lang === 'en' ? 'Load' : 'Carregar'}
              </button>
            </Tooltip>
          </div>

          <Divider />

          {/* Lista de builds salvas — com scroll próprio */}
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>
            {lang === 'en' ? 'Saved builds' : 'Builds salvas'}
            {saves.length > 0 && (
              <span style={{ color: T.dim, marginLeft: 4 }}>({saves.length})</span>
            )}
          </div>

          {saves.length === 0 ? (
            <div style={{ fontSize: 11, color: T.dim, fontStyle: 'italic' }}>
              {lang === 'en' ? 'No builds saved yet.' : 'Nenhuma build salva ainda.'}
            </div>
          ) : (
            // Scroll próprio para a lista — máx. ~180px antes de rolar
            <div style={{
              maxHeight: 180,
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 5,
              paddingRight: 2,
            }}>
              {saves.map(s => {
                const sc = s.build?.classId
                const sc_col = sc ? (T.cls[sc] || T.accent) : T.accent
                return (
                  <Tooltip key={s.id}
                    text={lang === 'en' ? `Load "${s.name}"` : `Carregar "${s.name}"`}>
                    <div onClick={() => load(s)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '5px 7px', borderRadius: 7,
                      border: `1px solid ${sc_col}50`,
                      background: sc_col + '15',
                      cursor: 'pointer',
                      maxWidth: 200,
                    }}>
                      {/* Ícone da classe */}
                      {CLASS_ICON[sc] && (
                        <img
                          src={CLASS_ICON[sc]}
                          width={12} height={12}
                          style={{ filter: T.iconFilter, opacity: 0.7, flexShrink: 0 }}
                          onError={e => { e.target.style.display = 'none' }}
                          alt=""
                        />
                      )}
                      <span style={{
                        fontSize: 11, color: sc_col, fontWeight: 700,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', maxWidth: 150,
                      }}>
                        {s.name}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); remove(s.id) }}
                        title={lang === 'en' ? 'Remove' : 'Remover'}
                        style={{
                          background: 'none', border: 'none', color: T.muted,
                          cursor: 'pointer', fontSize: 11, padding: '0 1px',
                          lineHeight: 1, flexShrink: 0,
                        }}>✕</button>
                    </div>
                  </Tooltip>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

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

    // Recarga de GW — as chaves sao `stats.gw1` / `stats.gw2` (ver FIX-010).
    // `gw1Cooldown` / `gw2Cooldown` nao existem: liam undefined e a recarga
    // sumia do texto sem erro.
    let cdPart = ''
    if (slotName === 'gw1' && stats?.gw1?.finalCd != null) {
      cdPart = ` [${stats.gw1.finalCd}s]`
    } else if (slotName === 'gw2' && stats?.gw2?.finalCd != null) {
      cdPart = ` [${stats.gw2.finalCd}s]`
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

    // Habilidade Suprema — o resumo e montado por classe, porque as chaves
    // devolvidas por computeUltimate mudam entre elas. Ver FIX-010.
    if (stats.ultimate) {
      const uName = L ? (stats.ultimate.nEN || stats.ultimate.nPT) : stats.ultimate.nPT
      const uLine = ultimateSummary(stats.ultimate, L)
      lines.push('')
      lines.push(L ? `**Ultimate: ${uName}**` : `**Supremo: ${uName}**`)
      if (uLine) lines.push(`  ${uLine}`)
    }

    lines.push('')
    lines.push(L ? '**Statistics:**' : '**Estatísticas:**')

    // HP e DET sempre aparecem (conforme solicitado)
    const hp = stats.maxHP ?? 100
    const resolve = stats.maxResolve ?? 3
    lines.push(`  HP: ${hp}`)
    lines.push(`  ${L ? 'Resolve' : 'Determinação'}: ${resolve}`)

    // Demais stats — somente as que diferem do valor base.
    // ATENÇÃO: getStatGroups(stats, classId, lang) — o classId é obrigatório.
    // Sem ele o lang cai no lugar errado (rótulos sempre em PT) e o grupo
    // de stats específico da classe some da lista. Ver FIX-005.
    const groups = getStatGroups(stats, build.classId, lang)
    for (const group of groups) {
      for (const stat of group.stats) {
        // HP e DET já foram adicionados acima
        if (stat.key === 'maxHP' || stat.key === 'maxResolve') continue
        // Só mostra o que o build de fato alterou em relação à base
        if (!isStatChanged(stat)) continue
        lines.push(`  ${stat.label}: ${formatStatValue(stat.value, stat.unit)}`)
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
    img.onload  = () => {
      // Marca o tipo AQUI, que e onde a URL esta a mao. A regra de filtro do
      // canvas e por tipo de arquivo, nao por slot: SVG e monocromatico e
      // precisa do filtro do tema; PNG ja vem colorido e nao pode receber.
      // Ver FIX-012 e as armadilhas 3 e 15.
      img.isSvgIcon = /\.svg(\?|#|$)/i.test(src)
      resolve(img)
    }
    img.onerror = () => {
      console.warn('[imagem da build] icone nao carregou:', src)
      resolve(null)
    }
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

  // Ronin: a variante ativa, ou a base quando nenhuma tecnica de tier III a
  // troca. O `find` sozinho devolvia undefined nesse caso e a variante sumia
  // da linha; a base e sempre a primeira do array.
  if (ult.classId === 'ronin' && ult.variants?.length) {
    const act = ult.variants.find(v => v.id === ult.activeBreath) || ult.variants[0]
    parts.push(L ? (act.nEN || act.nPT) : act.nPT)
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

  // Icone ausente nao derruba o desenho — mas some sem dizer nada, e foi
  // justamente o silencio que fez o FIX-012 ser diagnosticado errado da
  // primeira vez. Avisar no console custa nada.
  const missing = keys.filter(k => !out[k])
  if (missing.length) console.warn('[imagem da build] sem icone:', missing.join(', '))

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
function ExportPanel({ build, stats, lang, buildName, includeShareCode }) {
  const [feedback, setFeedback] = useState(null)
  const flash = (key) => { setFeedback(key); setTimeout(() => setFeedback(null), 1500) }

  const handleCopyText = (mode) => {
    const text = generateBuildText({ build, stats, lang, buildName, mode, includeShareCode })
    navigator.clipboard.writeText(text)
      .then(() => flash(`txt-${mode}`))
      .catch(() => flash(`txt-${mode}`))  // copia mesmo se clipboard falhou silenciosamente
  }

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

  const L = lang === 'en'
  const modes = [
    {
      id: 'build',
      labelPT: 'Build',      labelEN: 'Build',
      tipTxtPT: 'Copia um resumo compacto: habilidade de classe, vantagens, equipamentos e valores de propriedades — sem descrições',
      tipTxtEN: 'Copies a compact summary: class ability, perks, gear and property values — no descriptions',
      tipImgPT: 'Gera uma imagem compacta com os dados resumidos da build',
      tipImgEN: 'Generates a compact image with the summarized build data',
    },
    {
      id: 'detailed',
      labelPT: 'Detalhado',  labelEN: 'Detailed',
      tipTxtPT: 'Copia a build completa com descrições de habilidade de classe, vantagens de classe e de cada equipamento',
      tipTxtEN: 'Copies the full build with class ability, class perk and gear descriptions',
      tipImgPT: 'Gera uma imagem detalhada com todas as descrições da build',
      tipImgEN: 'Generates a detailed image with all build descriptions',
    },
    {
      id: 'stats',
      labelPT: 'Estatístico', labelEN: 'Statistical',
      tipTxtPT: 'Copia a build completa com descrições + todas as estatísticas calculadas (somente as modificadas pela build)',
      tipTxtEN: 'Copies the full build with descriptions + all calculated stats (only those modified by the build)',
      tipImgPT: 'Gera uma imagem com a build completa e as estatísticas calculadas, dividida em colunas',
      tipImgEN: 'Generates a columned image with the full build and all calculated statistics',
    },
  ]

  // Estilo dos botões de texto (dourado)
  const bTxt = (mode) => ({
    background: feedback === `txt-${mode}` ? T.accent + '44' : T.accent + '18',
    border: `1px solid ${feedback === `txt-${mode}` ? T.accent : T.accent + '50'}`,
    color: T.text, borderRadius: 6,
    padding: '3px 9px', cursor: 'pointer',
    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  })
  // Estilo dos botões de imagem (roxo)
  const bImg = (mode) => ({
    background: feedback === `img-${mode}` ? '#6c5ce740' : '#6c5ce714',
    border: `1px solid ${feedback === `img-${mode}` ? '#6c5ce7' : '#6c5ce750'}`,
    color: T.text, borderRadius: 6,
    padding: '3px 9px', cursor: 'pointer',
    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  })
  // Estilo do grupo (caixa rotulada)
  const groupBox = (borderColor, bgColor) => ({
    border: `1px solid ${borderColor}`,
    borderRadius: 8,
    padding: '4px 8px',
    background: bgColor,
    display: 'flex', alignItems: 'center', gap: 6,
  })

  return (
    // Uma única linha horizontal com dois grupos rotulados
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

      {/* Grupo TEXTO */}
      <div style={groupBox(T.accent + '44', T.accent + '0c')}>
        <span style={{
          fontSize: 9, color: T.accent, fontWeight: 800,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          borderRight: `1px solid ${T.accent + '44'}`,
          paddingRight: 6, whiteSpace: 'nowrap',
        }}>
          📋 {L ? 'Text' : 'Texto'}
        </span>
        {modes.map(m => (
          <Tooltip key={m.id} text={L ? m.tipTxtEN : m.tipTxtPT}>
            <button onClick={() => handleCopyText(m.id)} style={bTxt(m.id)}>
              {feedback === `txt-${m.id}` ? '✓' : (L ? m.labelEN : m.labelPT)}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Grupo PRINT */}
      <div style={groupBox('#6c5ce750', '#6c5ce70c')}>
        <span style={{
          fontSize: 9, color: '#9b8ef0', fontWeight: 800,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          borderRight: '1px solid #6c5ce750',
          paddingRight: 6, whiteSpace: 'nowrap',
        }}>
          🖼️ {L ? 'Print' : 'Print'}
        </span>
        {modes.map(m => (
          <Tooltip key={m.id} text={L ? m.tipImgEN : m.tipImgPT}>
            <button onClick={() => handleGenImage(m.id)} style={bImg(m.id)}>
              {feedback === `img-${m.id}` ? '✓' : (L ? m.labelEN : m.labelPT)}
            </button>
          </Tooltip>
        ))}
      </div>

    </div>
  )
}

// ─── SettingsModal ────────────────────────────────────────────
function SettingsModal({
  open, onClose, lang,
  layoutMode, setLayoutMode,
  gearIconMode, setGearIconMode,
  includeShareCode, setIncludeShareCode,
  theme, setTheme,
}) {
  if (!open) return null
  const L = lang === 'en'

  const LAYOUTS = [
    { id: 'three-col',
      labelPT: '3 Colunas', labelEN: '3 Columns',
      tipPT: 'Habilidades à esquerda · Equipamentos no centro · Estatísticas à direita — cada coluna rola independentemente',
      tipEN: 'Abilities on left · Gear in center · Stats on right — each column scrolls independently',
      icon: (
        <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
          <rect x="0" y="0" width="10" height="22" rx="2" fill="currentColor" opacity=".4"/>
          <rect x="13" y="0" width="10" height="22" rx="2" fill="currentColor" opacity=".7"/>
          <rect x="26" y="0" width="10" height="22" rx="2" fill="currentColor" opacity=".4"/>
        </svg>
      )
    },
    { id: 'two-col',
      labelPT: '2 Colunas', labelEN: '2 Columns',
      tipPT: 'Habilidades + Equipamentos à esquerda · Estatísticas à direita — layout clássico',
      tipEN: 'Abilities + Gear on left · Stats on right — classic layout',
      icon: (
        <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
          <rect x="0" y="0" width="22" height="22" rx="2" fill="currentColor" opacity=".7"/>
          <rect x="25" y="0" width="11" height="22" rx="2" fill="currentColor" opacity=".4"/>
        </svg>
      )
    },
  ]

  const GEAR_ICON_MODES = [
    { id: 'compact',
      labelPT: 'Compacto', labelEN: 'Compact',
      tipPT: 'Ícone pequeno ao lado esquerdo do nome do equipamento',
      tipEN: 'Small icon to the left of the gear name',
    },
    { id: 'full',
      labelPT: 'Expandido', labelEN: 'Expanded',
      tipPT: 'Ícone maior no início do card, com o nome ao lado — destaca visualmente o equipamento',
      tipEN: 'Larger icon at the start of the gear card with the name beside it',
    },
  ]

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.55)',
      }} />
      {/*
        Centralizacao por FLEXBOX, sem transform — e proposital, nao estilo.
        Um transform aqui torna este elemento o bloco-contenedor dos filhos
        `position: fixed`, e o Tooltip e fixed: ele passaria a contar no
        overflow do modal, criando uma barra de rolagem horizontal que empurra
        o conteudo a cada hover. Ver FIX-011 e a armadilha 16.
        `pointerEvents: none` no envelope deixa o clique fora do modal chegar
        ao backdrop, que e quem fecha.
      */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
      <div style={{
        pointerEvents: 'auto',
        background: T.panel, border: `1px solid ${T.borderHov}`,
        borderRadius: 13, padding: '16px 18px',
        width: 360, maxWidth: '92vw',
        boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 14,
        }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
            ⚙️ {L ? 'Settings' : 'Configurações'}
          </span>
          <button onClick={onClose} style={{
            background: T.cardHov, border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.muted, cursor: 'pointer',
            fontSize: 14, padding: '3px 9px',
          }}>✕</button>
        </div>

        {/* ── Tema */}
        <SectionTitle>{L ? 'Theme' : 'Tema'}</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'dark',  labelPT: '🌙 Escuro', labelEN: '🌙 Dark',
              tipPT: 'Interface escura — padrão do planejador',
              tipEN: 'Dark interface — planner default' },
            { id: 'light', labelPT: '☀️ Claro',  labelEN: '☀️ Light',
              tipPT: 'Interface clara — melhor em ambientes iluminados',
              tipEN: 'Light interface — better in bright environments' },
          ].map(th => (
            <Tooltip key={th.id} text={L ? th.tipEN : th.tipPT}>
              <button onClick={() => setTheme(th.id)} style={{
                flex: 1, padding: '8px 6px',
                background: theme === th.id ? T.accent + '28' : T.card,
                border: `2px solid ${theme === th.id ? T.accent : T.border}`,
                borderRadius: 8, cursor: 'pointer', color: T.text,
                fontSize: 12, fontWeight: theme === th.id ? 700 : 400,
                transition: 'all 0.15s',
              }}>
                {L ? th.labelEN : th.labelPT}
              </button>
            </Tooltip>
          ))}
        </div>

        <Divider />

        {/* ── Layout de colunas */}
        <SectionTitle>{L ? 'Column Layout' : 'Layout de Colunas'}</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {LAYOUTS.map(l => (
            <Tooltip key={l.id} text={L ? l.tipEN : l.tipPT}>
              <button onClick={() => setLayoutMode(l.id)} style={{
                flex: 1, padding: '10px 6px',
                background: layoutMode === l.id ? T.accent + '28' : T.card,
                border: `2px solid ${layoutMode === l.id ? T.accent : T.border}`,
                borderRadius: 8, cursor: 'pointer',
                color: layoutMode === l.id ? T.accent : T.muted,
                fontSize: 11, fontWeight: layoutMode === l.id ? 700 : 400,
                transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                {l.icon}
                <span style={{ fontSize: 10 }}>{L ? l.labelEN : l.labelPT}</span>
              </button>
            </Tooltip>
          ))}
        </div>

        <Divider />

        {/* ── Layout dos ícones de equipamento */}
        <SectionTitle>{L ? 'Gear Icon Style' : 'Estilo dos Ícones de Equipamento'}</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {GEAR_ICON_MODES.map(m => (
            <Tooltip key={m.id} text={L ? m.tipEN : m.tipPT}>
              <button onClick={() => setGearIconMode(m.id)} style={{
                flex: 1, padding: '8px 6px',
                background: gearIconMode === m.id ? T.accent + '28' : T.card,
                border: `2px solid ${gearIconMode === m.id ? T.accent : T.border}`,
                borderRadius: 8, cursor: 'pointer', color: T.text,
                fontSize: 11, fontWeight: gearIconMode === m.id ? 700 : 400,
                transition: 'all 0.15s',
              }}>
                {L ? m.labelEN : m.labelPT}
              </button>
            </Tooltip>
          ))}
        </div>

        <Divider />

        {/* ── Opções de exportação */}
        <SectionTitle>{L ? 'Export Options' : 'Opções de Exportação'}</SectionTitle>
        <Tooltip text={L
          ? 'When enabled, the Base64 share code is appended at the end of exported text. Useful for posts where others can load the build directly.'
          : 'Quando ativado, o código Base64 de compartilhamento é adicionado ao final do texto exportado. Útil para posts onde outros podem carregar a build diretamente.'}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', marginBottom: 14,
          }}>
            <input type="checkbox" checked={includeShareCode}
              onChange={e => setIncludeShareCode(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: T.accent, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: T.text, lineHeight: 1.4 }}>
              {L
                ? 'Include share code in exported text'
                : 'Incluir código de compartilhamento no texto exportado'}
            </span>
          </label>
        </Tooltip>

        <Divider />

        {/* ── Créditos */}
        <SectionTitle>{L ? 'Credits & Data Sources' : 'Créditos & Fontes de Dados'}</SectionTitle>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.9 }}>
          <div>
            <strong style={{ color: T.text }}>arlsnech</strong>
            {' — '}{L ? 'Author, maintainer & data research (PT-BR)' : 'Autor, mantenedor e pesquisa de dados (PT-BR)'}
          </div>
          <div>
            <strong style={{ color: T.text }}>swiezdo</strong>
            {' — '}{L
              ? 'Sharing access to the game\'s icon collection (gear, techniques, classes)'
              : 'Por compartilhar acesso à coleção de ícones do jogo (equipamentos, técnicas, classes)'}
          </div>
          <div style={{ marginTop: 4 }}>
            {L ? 'Community data: ' : 'Dados da comunidade: '}
            DoctorKoolman · Boneofimba · berrek45 · tenshimkii
          </div>
          <div style={{ marginTop: 6 }}>
            <a href="https://docs.google.com/spreadsheets/d/1nTewBLL3gQrmVvFe0cs81CGWzqryh9uS-PHK7vuzUgg/edit?usp=sharing"
              target="_blank" rel="noopener noreferrer"
              style={{ color: T.accent, textDecoration: 'none' }}>
              📊 {L ? 'PT-BR Data Sheet (arlsnech)' : 'Planilha PT-BR (arlsnech)'}
            </a>
          </div>
          <div>
            <a href="https://ghostfranchise.fandom.com/wiki/Gear"
              target="_blank" rel="noopener noreferrer"
              style={{ color: T.accent, textDecoration: 'none' }}>
              📖 {L ? 'GoT Legends Wiki' : 'Wiki GoT Lendas'}
            </a>
          </div>
          <div style={{
            marginTop: 8, paddingTop: 8,
            borderTop: `1px solid ${T.border}`,
            color: T.dim, fontSize: 10,
          }}>
            {L
              ? 'Technical implementation: Claude (Anthropic AI)'
              : 'Implementação técnica: Claude (Anthropic AI)'}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

// ─── App ─────────────────────────────────────────────────────
export default function App() {
  const [build,            setBuild]            = useState(() => createEmptyBuild('samurai'))
  const [lang,             setLang]             = useState('pt')
  const [buildName,        setBuildName]        = useState('')
  const [drawerOpen,       setDrawerOpen]       = useState(false)
  const [layoutMode,       setLayoutMode]       = useState('three-col')
  const [gearIconMode,     setGearIconMode]     = useState('compact')
  const [settingsOpen,     setSettingsOpen]     = useState(false)
  const [includeShareCode, setIncludeShareCode] = useState(false)
  const [theme,            setTheme]            = useState('dark')

  // ── Aplica tema ANTES de qualquer render (síncrono, single-thread)
  Object.assign(T, theme === 'dark' ? THEME_DARK : THEME_LIGHT)

  const stats   = useMemo(() => computeStats(build), [build])
  const legInfo = useMemo(() => checkLegendaryLimit(build), [build])

  // Permite que o SaveDrawer dispare carregamentos de build
  useEffect(() => {
    window.__loadBuild = (b) => setBuild(b)
    return () => { delete window.__loadBuild }
  }, [])

  // Estilo base do body (atualiza com o tema)
  useEffect(() => {
    document.body.style.background  = T.bg
    document.body.style.color       = T.text
    document.body.style.margin      = '0'
    document.body.style.overflow    = 'hidden'
    document.body.style.fontFamily  = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, [theme])

  const cls      = getClass(build.classId)
  const clsColor = T.cls[build.classId] ?? T.accent

  const onClassChange = (id) => setBuild(prev => changeClass(prev, id))
  const onRandom      = () => setBuild(prev => randomBuild(prev))

  const SLOT_NAMES = ['katana', 'ranged', 'charm', 'gw1', 'gw2']

  return (
    <div style={{
      height: '100vh', background: T.bg, color: T.text,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ══ HEADER FIXO ══════════════════════════════════════════ */}
      <header style={{
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        padding: '6px 16px 6px 20px',
        flexShrink: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
      }}>
        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', color: T.text }}>
            ⛩ GoT: Legends
          </span>
          <span style={{ fontSize: 9, color: T.muted, fontWeight: 600, letterSpacing: '0.05em' }}>
            BUILD PLANNER
          </span>
        </div>

        {/* Classes — centralizadas no header */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 5, flexWrap: 'wrap' }}>
          {CLASSES.map(c => {
            const active = build.classId === c.id
            const iconUrl = CLASS_ICON[c.id]
            return (
              <Tooltip key={c.id}
                text={lang === 'en'
                  ? `Switch to ${c.nEN} class`
                  : `Trocar para a classe ${c.nPT}`}>
                <button
                  onClick={() => onClassChange(c.id)}
                  style={{
                    padding: '5px 10px',
                    background: active ? T.cls[c.id] + '28' : T.card,
                    border: `2px solid ${active ? T.cls[c.id] : T.border}`,
                    borderRadius: 8, cursor: 'pointer',
                    color: active ? T.text : T.muted,
                    fontWeight: active ? 700 : 400,
                    fontSize: 12,
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 6,
                    flexShrink: 0,
                  }}>
                  {/* Ícone SVG da classe */}
                  {iconUrl && (
                    <img src={iconUrl} width={16} height={16}
                      style={{
                        filter: active ? T.iconFilter : T.iconFilterDim,
                        objectFit: 'contain', flexShrink: 0,
                      }}
                      onError={e => { e.target.style.display = 'none' }}
                      alt=""
                    />
                  )}
                  <span>{lang === 'en' ? c.nEN : c.nPT}</span>
                </button>
              </Tooltip>
            )
          })}
        </div>

        {/* Controles direita */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <Tooltip text={lang === 'en'
            ? 'Generate a random build for the current class'
            : 'Gerar uma build aleatória para a classe atual'}>
            <button onClick={onRandom} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '5px 9px', cursor: 'pointer',
              color: T.text, fontSize: 13,
            }}>🎲</button>
          </Tooltip>
          <Tooltip text={lang === 'en' ? 'Settings, layout and credits' : 'Configurações, layout e créditos'}>
            <button onClick={() => setSettingsOpen(true)} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '5px 9px', cursor: 'pointer',
              color: T.text, fontSize: 13,
            }}>⚙️</button>
          </Tooltip>
          <Tooltip text={lang === 'en' ? 'Toggle language PT-BR / EN' : 'Alternar idioma PT-BR / EN'}>
            <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '5px 8px', cursor: 'pointer',
              color: T.text, fontSize: 11, fontWeight: 700,
            }}>
              {lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
            </button>
          </Tooltip>
        </div>
      </header>

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

        {/* Grupo 2: Contador de magistrais — nome por extenso, afastado do HP */}
        <div style={{
          flexShrink: 0,
          paddingLeft: 32, paddingRight: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          {/* Estrelas */}
          <span style={{ fontSize: 14, letterSpacing: 3, color: T.leg, lineHeight: 1 }}>
            {'★'.repeat(legInfo.used)}
            <span style={{ color: T.dim }}>
              {'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
            </span>
          </span>
          {/* Texto completo, nos dois idiomas */}
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

      {/* ══ ÁREA DE 3/2 COLUNAS ══════════════════════════════════ */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: layoutMode === 'three-col'
          ? '300px 1fr 340px'   // 300px: col técnicas | 1fr: col equipamentos | 340px: col stats
          : '1fr 360px',
        gap: 0,
      }}>

        {/* COL ESQUERDA: Técnicas (modo three-col apenas) */}
        {layoutMode === 'three-col' && (
          <div style={{
            overflowY: 'auto',
            borderRight: `1px solid ${T.border}`,
            padding: '10px 10px 16px',
          }}>
            <TechniquesPanel build={build} setBuild={setBuild} lang={lang} layoutMode={layoutMode} />
          </div>
        )}

        {/* COL CENTRAL: Equipamentos (+Técnicas no modo two-col) */}
        <div style={{
          overflowY: 'auto',
          borderRight: `1px solid ${T.border}`,
          padding: '10px 12px 16px',
        }}>
          {layoutMode === 'two-col' && (
            <TechniquesPanel build={build} setBuild={setBuild} lang={lang} layoutMode={layoutMode} />
          )}
          {SLOT_NAMES.map(slotName => (
            <GearSlotCard
              key={slotName}
              slotName={slotName}
              slotState={build.gear[slotName]}
              classId={build.classId}
              build={build}
              setBuild={setBuild}
              stats={stats}
              lang={lang}
              gearIconMode={gearIconMode}
            />
          ))}
        </div>

        {/* COL DIREITA: Ícone supremo + Estatísticas */}
        <div style={{
          overflowY: 'auto',
          padding: '10px 10px 16px',
        }}>
          {/* Ícone grande da habilidade suprema no topo */}
          <UltimateHeader stats={stats} build={build} lang={lang} />

          {/* Painel de estatísticas (já inclui UltimateCard internamente) */}
          <StatsPanel stats={stats} build={build} setBuild={setBuild} lang={lang} />
        </div>
      </div>

      {/* ══ OVERLAYS FIXOS ══════════════════════════════════════ */}

      {/* Aba de bookmark — alinhada ao sub-header */}
      <BookmarkTab
        open={drawerOpen}
        onToggle={() => setDrawerOpen(o => !o)}
        lang={lang}
      />

      {/* Drawer de builds salvas */}
      <SaveDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        build={build}
        lang={lang}
        buildName={buildName}
        setBuildName={setBuildName}
      />

      {/* Modal de configurações */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        lang={lang}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        gearIconMode={gearIconMode}
        setGearIconMode={setGearIconMode}
        includeShareCode={includeShareCode}
        setIncludeShareCode={setIncludeShareCode}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Estilos globais */}
      <style>{`
        select option { background: ${T.card}; color: ${T.text}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.panel}; }
        ::-webkit-scrollbar-thumb { background: ${T.dim}; border-radius: 3px; }
        * { box-sizing: border-box; }
        button { transition: opacity 0.12s, background 0.15s, border-color 0.15s; }
        button:hover { opacity: 0.83; }
        input { outline: none; }
        input:focus { border-color: ${T.borderHov} !important; }
      `}</style>
    </div>
  )
}