// App.jsx — GoT Legends Build Planner
import { useState, useEffect, useMemo, useRef } from 'react'
import { CLASSES } from './data.js'
import { GEAR_ICON, TECH_ICON, CLASS_ICON, CLASS_TECH_FALLBACK, LOGO_URL, getGearIconUrl, getTechIconUrl } from './icons.js'
import {
  createEmptyBuild, computeStats,
  selectTech, selectAbility, selectItem, selectProp,
  setPropValue, selectPerk, setCharmLinkedClass,
  checkLegendaryLimit, getGearListForClass, getAvailableProps, getRequiredPerkId,
  getAvailablePerks, getEffectiveCharm, getStatGroups,
  getClass, getItem,
  formatStatValue, formatPropRange, propValueForDisplay,
  propValueFromDisplay, formatCd,
  encodeBuild, decodeBuild, serializeBuild, deserializeBuild,
  changeClass, randomBuild,
  LABELS_PT, LABELS_EN,
  BASE_HP, BASE_RESOLVE, BASE_LEG_SLOTS,
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

// cls_emoji mantido apenas para as builds salvas no drawer (mostra classe da build)
const cls_emoji = { samurai:'⚔️', hunter:'🏹', ronin:'🐕', assassin:'🗡️' }
// slot_emoji REMOVIDO — substituído por ícones SVG nos GearSlotCards

// ─── Tooltip (com detecção de borda) ────────────────────
const TOOLTIP_W = 300   // largura máxima do tooltip
const TOOLTIP_H = 100   // altura estimada (conservador)

function Tooltip({ text, children }) {
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
    <span style={{ display: 'inline-block', cursor: 'help' }}
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
function HpResolveBar({ stats, lang }) {
  if (!stats) return null
  const hp      = stats.maxHP     ?? 100
  const resolve = stats.maxResolve ?? 3
  // Barra de HP
  const MAX_HP  = 125  // 100 base + 25 máx (técnica Defensor)
  const basePct = (Math.min(hp, 100) / MAX_HP) * 100
  const bonusPct= (Math.max(0, hp - 100) / MAX_HP) * 100
  const hasBonus= hp > 100

  // Círculos: mostra SOMENTE os círculos necessários (sem vazio extra)
  // Base = 3 círculos dourados; bônus = círculos verdes extras
  const baseCircles  = 3
  const bonusCircles = Math.max(0, resolve - baseCircles)
  const totalCircles = baseCircles + bonusCircles

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0,
    }}>
      {/* Linha 1 — Círculos de Determinação (acima) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          fontSize: 8, color: T.muted, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 20,
        }}>
          {lang === 'en' ? 'RES' : 'DET'}
        </span>
        {Array.from({ length: totalCircles }).map((_, i) => {
          const isBonus = i >= baseCircles
          return (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isBonus ? T.green : T.accent,
              border: `1.5px solid ${isBonus ? T.green + 'cc' : T.accent + 'cc'}`,
              boxShadow: `0 0 4px ${isBonus ? T.green : T.accent}88`,
            }} />
          )
        })}
      </div>

      {/* Linha 2 — Barra de HP (abaixo) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          fontSize: 8, color: T.muted, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 20,
        }}>
          HP
        </span>
        {/* Track */}
        <div style={{
          width: 60, height: 5,
          background: T.dim,
          borderRadius: 3, overflow: 'hidden', display: 'flex',
        }}>
          <div style={{
            width: `${basePct}%`, height: '100%',
            background: 'linear-gradient(90deg, #901818, #c0392b)',
            borderRadius: bonusPct > 0 ? '3px 0 0 3px' : 3,
            flexShrink: 0,
          }} />
          {bonusPct > 0 && (
            <div style={{
              width: `${bonusPct}%`, height: '100%',
              background: `linear-gradient(90deg, ${T.leg}, ${T.accent})`,
              borderRadius: '0 3px 3px 0',
              flexShrink: 0,
            }} />
          )}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700,
          color: hasBonus ? T.leg : T.muted,
          minWidth: 26,
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
              <button onClick={() => step(-1)} style={btnSmall}>▼</button>
              <input
                type="number"
                value={shown}
                min={minDisplay}
                max={maxDisplay}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Tab') commit() }}
                style={{
                  width: 52, textAlign: 'center', background: T.panel,
                  border: `1px solid ${T.borderHov}`, borderRadius: 6,
                  color: T.text, fontSize: 12, padding: '4px 2px',
                }}
              />
              <span style={{ fontSize: 11, color: T.muted }}>{propDef.u}</span>
              <button onClick={() => step(1)} style={btnSmall}>▲</button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

const btnSmall = {
  background: T.card, border: `1px solid ${T.border}`, color: T.text,
  borderRadius: 4, width: 22, height: 22, cursor: 'pointer', fontSize: 10,
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
      <Tooltip text={desc}>
        <select
          value={effectiveSelected ?? ''}
          onChange={e => !isForced && onSelect(e.target.value || null)}
          disabled={isForced}
          style={{
            width: '100%', background: isForced ? T.panel : T.panel,
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
      </Tooltip>
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

  const onLinkedClass = (cls) => {
    setBuild(prev => setCharmLinkedClass(prev, cls))
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
function TechniquesPanel({ build, setBuild, lang }) {
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

  const TechRow = ({ tech, selected, onToggle, blocked }) => {
    const desc    = lang === 'en' ? (tech.dEN || tech.dPT) : tech.dPT
    const name    = lang === 'en' ? (tech.nEN || tech.nPT) : tech.nPT
    const isLeg   = name.toLowerCase() === 'magistral' || name.toLowerCase() === 'legendary'
    const isSp    = tech.sp
    const isAct   = selected === tech.id
    const isBlocked = blocked && isAct
    const iconUrl = getTechIconUrl(tech.id, build.classId)

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
            }}>
              {isSp && '✨ '}{isLeg && '⭐ '}{name}
              {isBlocked && ' 🔒'}
            </span>
          </div>
        </button>
      </Tooltip>
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
      {cls.abilities.map(a => {
        const isAct    = build.abilityId === a.id
        const iconUrl  = getTechIconUrl(a.id, build.classId)
        return (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
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
            {techs.map(t => (
              <TechRow
                key={t.id}
                tech={t}
                selected={build.techs[tier]}
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
        )
      })}
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

// ─── ExportPanel — botões de copiar texto e gerar imagem ─────
function ExportPanel({ build, stats, lang, buildName, includeShareCode }) {
  const [feedback, setFeedback] = useState(null)
  const flash = (key) => { setFeedback(key); setTimeout(() => setFeedback(null), 1500) }

  const handleCopyText = (mode) => { flash(`txt-${mode}`) /* TODO Fase 2 */ }
  const handleGenImage = (mode) => { flash(`img-${mode}`) /* TODO Fase 3 */ }

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
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 900,
        background: T.panel, border: `1px solid ${T.borderHov}`,
        borderRadius: 13, padding: '16px 18px',
        width: 360, maxWidth: '92vw',
        boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        maxHeight: '88vh', overflowY: 'auto',
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
      <div style={{
        flexShrink: 0,
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        // paddingLeft 48 reserva espaço para a aba bookmark sem sobreposição
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

      {/* ══ ÁREA DE 3/2 COLUNAS ══════════════════════════════════ */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: layoutMode === 'three-col'
          ? '255px 1fr 340px'
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
            <TechniquesPanel build={build} setBuild={setBuild} lang={lang} />
          </div>
        )}

        {/* COL CENTRAL: Equipamentos (+Técnicas no modo two-col) */}
        <div style={{
          overflowY: 'auto',
          borderRight: `1px solid ${T.border}`,
          padding: '10px 12px 16px',
        }}>
          {layoutMode === 'two-col' && (
            <TechniquesPanel build={build} setBuild={setBuild} lang={lang} />
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

        {/* COL DIREITA: Estatísticas */}
        <div style={{
          overflowY: 'auto',
          padding: '10px 10px 16px',
        }}>
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: '10px 13px', marginBottom: 10,
          }}>
            <SectionTitle>
              {lang === 'en' ? '📊 Statistics' : '📊 Estatísticas'}
            </SectionTitle>
          </div>
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