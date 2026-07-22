// App.jsx — GoT Legends Build Planner
import { useState, useEffect, useMemo, useRef } from 'react'
import { CLASSES } from './data.js'
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

// ─── Theme ──────────────────────────────────────────────────
const T = {
  bg:       '#07080f',
  panel:    '#10111c',
  card:     '#181924',
  cardHov:  '#1e1f2e',
  border:   '#252638',
  borderHov:'#3a3b5a',
  text:     '#dde0ef',
  muted:    '#5a5c76',
  dim:      '#3a3c52',
  accent:   '#c4a035',
  leg:      '#d4af37',
  green:    '#2ecc71',
  red:      '#e74c3c',
  cls: {
    samurai: '#c0392b',
    hunter:  '#2475ad',
    ronin:   '#8e44ad',
    assassin:'#27ae60',
  },
}

const cls_emoji = { samurai:'⚔️', hunter:'🏹', ronin:'🐕', assassin:'🗡️' }
const slot_emoji = { katana:'⚔️', ranged:'🏹', charm:'🧿', gw1:'💣', gw2:'💊' }

// ─── Tooltip ────────────────────────────────────────────────
function Tooltip({ text, children }) {
  const [vis, setVis] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef()

  const show = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: r.left, y: r.bottom + 6 })
    setVis(true)
  }

  if (!text) return children

  return (
    <span className="relative inline-block" ref={ref}
      onMouseEnter={show} onMouseLeave={() => setVis(false)}
      style={{ cursor: 'help' }}>
      {children}
      {vis && (
        <div style={{
          position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999,
          background: T.card, border: `1px solid ${T.borderHov}`,
          borderRadius: 8, padding: '8px 12px',
          minWidth: 220, maxWidth: 340,
          color: T.text, fontSize: 12, lineHeight: 1.5,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
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
function GearSlotCard({ slotName, slotState, classId, build, setBuild, stats, lang }) {
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
    katana: lang === 'en' ? '⚔️ Katana'        : '⚔️ Katana',
    ranged: lang === 'en' ? '🏹 Ranged'         : '🏹 Longo Alcance',
    charm:  lang === 'en' ? '🧿 Charm'          : '🧿 Amuleto',
    gw1:    lang === 'en' ? '💣 Ghost Weapon I'  : '💣 Arma Fantasma I',
    gw2:    lang === 'en' ? '💊 Ghost Weapon II' : '💊 Arma Fantasma II',
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

  return (
    <div style={{
      background: T.card, border: `1px solid ${isLeg ? T.leg + '60' : T.border}`,
      borderRadius: 10, padding: '14px 16px', marginBottom: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{slotLabel}</span>
        {isLeg && <Tag color={T.leg}>MAGISTRAL</Tag>}
        {!legInfo.canAdd && !item?.leg && (
          <span style={{ fontSize: 10, color: T.muted }}>
            ({lang === 'en' ? 'Legendary limit reached' : 'Limite magistral atingido'})
          </span>
        )}
      </div>

      {/* Item selector */}
      <select
        value={slotState.itemId ?? ''}
        onChange={e => onItemSelect(e.target.value)}
        style={{
          width: '100%', background: T.panel, border: `1px solid ${T.border}`,
          borderRadius: 6, color: T.text, fontSize: 12, padding: '6px 8px',
          marginBottom: 10,
        }}>
        <option value="">— {lang === 'en' ? 'Select item' : 'Selecionar'} —</option>
        {/* Normal items */}
        {available.filter(i => !i.leg).map(i => (
          <option key={i.id} value={i.id}>{lang === 'en' ? (i.nEN || i.nPT) : i.nPT}</option>
        ))}
        {/* Legendary items */}
        {available.filter(i => i.leg).length > 0 && (
          <>
            <option disabled>— {lang === 'en' ? 'Legendary' : 'Magistrais'} —</option>
            {available.filter(i => i.leg).map(i => (
              <option
                key={i.id} value={i.id}
                disabled={!legInfo.canAdd && i.leg && !item?.leg}
              >
                ⭐ {lang === 'en' ? (i.nEN || i.nPT) : i.nPT}
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
    const desc  = lang === 'en' ? (tech.dEN || tech.dPT) : tech.dPT
    const name  = lang === 'en' ? (tech.nEN || tech.nPT) : tech.nPT
    const isLeg = name.toLowerCase() === 'magistral' || name.toLowerCase() === 'legendary'
    const isSp  = tech.sp
    const isAct = selected === tech.id
    const isBlocked = blocked && isAct // only block deselect when active and would violate

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
            opacity: (!isAct && blocked && selected !== null && !isBlocked) ? 1 : 1,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%', border: `2px solid`,
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
      {cls.abilities.map(a => (
        <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <button
            onClick={() => handleAbility(a.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, flex: 1,
              textAlign: 'left', padding: '7px 10px',
              background: build.abilityId === a.id ? T.cls[build.classId] + '25' : 'transparent',
              border: `1px solid ${build.abilityId === a.id ? T.cls[build.classId] : T.border}`,
              borderRadius: 7, cursor: 'pointer', color: T.text,
            }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%', border: `2px solid`,
              borderColor: build.abilityId === a.id ? T.cls[build.classId] : T.dim,
              background: build.abilityId === a.id ? T.cls[build.classId] : 'transparent',
              flexShrink: 0,
            }} />
            <Tooltip text={lang === 'en' ? (a.dEN || a.dPT) : a.dPT}>
              <span style={{ fontSize: 12, fontWeight: build.abilityId === a.id ? 700 : 400 }}>
                {lang === 'en' ? (a.nEN || a.nPT) : a.nPT}
                <span style={{ fontSize: 10, color: T.muted, marginLeft: 6 }}>{a.cd}s</span>
              </span>
            </Tooltip>
          </button>
        </div>
      ))}

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
        <span style={{ fontSize: 16 }}>💥</span>
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

// ─── BookmarkTab — aba lateral fixa para abrir o drawer ────────
function BookmarkTab({ open, onToggle, lang }) {
  return (
    <button
      onClick={onToggle}
      title={open
        ? (lang === 'en' ? 'Close saved builds' : 'Fechar builds salvas')
        : (lang === 'en' ? 'Open saved builds' : 'Abrir builds salvas')}
      style={{
        position: 'fixed',
        left: 0,
        top: 130,
        zIndex: 450,
        background: open ? T.borderHov : T.accent + 'dd',
        border: `1px solid ${open ? T.border : T.accent}`,
        borderLeft: 'none',
        borderRadius: '0 10px 10px 0',
        padding: '12px 7px',
        cursor: 'pointer',
        boxShadow: '3px 0 14px rgba(0,0,0,0.45)',
        transition: 'background 0.2s, left 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        color: T.text,
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 18 }}>{open ? '◀' : '🗂️'}</span>
      <span style={{
        writingMode: 'vertical-lr',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: open ? T.muted : T.text,
      }}>
        {lang === 'en' ? 'Builds' : 'Builds'}
      </span>
    </button>
  )
}

// ─── SaveDrawer — gaveta lateral de gerenciamento de builds ────
function SaveDrawer({ open, onClose, build, lang, buildName, setBuildName }) {
  const [saves, setSaves]       = useState([])
  const [shareCode, setShareCode] = useState('')
  const [msg, setMsg]           = useState('')
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

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  const save = () => {
    const name = buildName.trim() || (lang === 'en' ? 'Unnamed' : 'Sem nome')
    const entry = serializeBuild(build, name)
    persist([entry, ...saves.filter(s => s.name !== name)])
    flash(lang === 'en' ? `Saved "${name}"` : `"${name}" salvo`)
  }

  const load = (entry) => {
    const r = deserializeBuild(entry)
    if (r.ok) {
      window.__loadBuild?.(r.build)
      flash(lang === 'en' ? `Loaded "${entry.name}"` : `"${entry.name}" carregado`)
    }
  }

  const remove = (id) => persist(saves.filter(s => s.id !== id))

  const clearAll = () => {
    if (window.confirm(lang === 'en'
      ? 'Clear ALL saved builds? This cannot be undone.'
      : 'Limpar TODAS as builds salvas? Esta ação não pode ser desfeita.')) {
      persist([])
    }
  }

  const exportAll = () => {
    if (saves.length === 0) return
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
        flash(`${valid.length} ${lang === 'en' ? 'builds imported' : 'builds importados'}`)
      } catch {
        flash(lang === 'en' ? 'Invalid file' : 'Arquivo inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const copyCode = () => {
    const code = encodeBuild(build, buildName || 'Build')
    setShareCode(code)
    navigator.clipboard.writeText(code).catch(() => {})
    flash(lang === 'en' ? 'Code copied!' : 'Código copiado!')
  }

  const loadCode = () => {
    const r = decodeBuild(shareCode.trim())
    if (r.ok) {
      window.__loadBuild?.(r.build)
      flash(lang === 'en' ? 'Build loaded!' : 'Build carregado!')
      setShareCode('')
    } else {
      flash(r.error)
    }
  }

  // Sem open: não renderiza nada (economia de DOM)
  if (!open) return null

  return (
    <>
      {/* Backdrop — clique fora fecha o drawer */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.45)',
        }}
      />

      {/* Drawer propriamente dito */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: 'min(300px, 88vw)',
        zIndex: 500,
        background: T.panel,
        borderRight: `1px solid ${T.borderHov}`,
        display: 'flex', flexDirection: 'column',
        boxShadow: '6px 0 28px rgba(0,0,0,0.55)',
        overflowY: 'auto',
      }}>

        {/* ── Cabeçalho do drawer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 13px 10px',
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
          background: T.card,
        }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>
            🗂️ {lang === 'en' ? 'Saved Builds' : 'Builds Salvas'}
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            {saves.length > 0 && (
              <Tooltip text={lang === 'en' ? 'Clear all saved builds' : 'Limpar todas as builds salvas'}>
                <button onClick={clearAll} style={{
                  background: T.red + '22', border: `1px solid ${T.red}44`,
                  borderRadius: 6, color: T.red, fontSize: 13,
                  padding: '3px 8px', cursor: 'pointer', fontWeight: 700,
                }}>🗑️</button>
              </Tooltip>
            )}
            <button onClick={onClose} style={{
              background: T.cardHov, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.muted, fontSize: 14,
              padding: '3px 9px', cursor: 'pointer',
            }}>✕</button>
          </div>
        </div>

        {/* Flash message */}
        {msg && (
          <div style={{
            margin: '8px 12px 0',
            background: T.green + '22', border: `1px solid ${T.green}44`,
            borderRadius: 7, padding: '6px 10px',
            fontSize: 12, color: T.green, flexShrink: 0,
          }}>{msg}</div>
        )}

        {/* ── Conteúdo rolável */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 13px' }}>

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
                  padding: '6px 26px 6px 8px',
                }}
              />
              {buildName && (
                <button
                  onClick={() => setBuildName('')}
                  title={lang === 'en' ? 'Clear name' : 'Limpar nome'}
                  style={{
                    position: 'absolute', right: 5, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: T.muted, cursor: 'pointer',
                    fontSize: 12, padding: 0, lineHeight: 1,
                  }}>✕</button>
              )}
            </div>
            <Tooltip text={lang === 'en' ? 'Save current build' : 'Salvar build atual'}>
              <button onClick={save} style={btnAction(T.accent)}>
                {lang === 'en' ? 'Save' : 'Salvar'}
              </button>
            </Tooltip>
          </div>

          {/* Lista de builds salvas */}
          {saves.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {saves.map(s => {
                const sc = s.build?.classId
                const sc_color = sc ? (T.cls[sc] || T.accent) : T.accent
                return (
                  <Tooltip
                    key={s.id}
                    text={lang === 'en'
                      ? `Load "${s.name}"`
                      : `Carregar "${s.name}"`}>
                    <div
                      onClick={() => load(s)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '5px 8px', borderRadius: 7,
                        border: `1px solid ${sc_color}55`,
                        background: sc_color + '16',
                        cursor: 'pointer',
                        maxWidth: '100%',
                      }}
                    >
                      <span style={{
                        fontSize: 11, color: sc_color, fontWeight: 700,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', maxWidth: 160,
                      }}>
                        {cls_emoji[sc] ?? '⚔️'} {s.name}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); remove(s.id) }}
                        title={lang === 'en' ? 'Remove' : 'Remover'}
                        style={{
                          background: 'none', border: 'none', color: T.muted,
                          cursor: 'pointer', fontSize: 11,
                          padding: '0 1px', lineHeight: 1, flexShrink: 0,
                        }}>✕</button>
                    </div>
                  </Tooltip>
                )
              })}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: T.dim, marginBottom: 12 }}>
              {lang === 'en' ? 'No builds saved yet.' : 'Nenhuma build salva ainda.'}
            </div>
          )}

          <Divider />

          {/* Exportar / Importar JSON */}
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>
            📁 {lang === 'en' ? 'Export / Import JSON' : 'Exportar / Importar JSON'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <Tooltip text={lang === 'en'
              ? 'Export all saved builds to a .json file'
              : 'Exportar todas as builds salvas para um arquivo .json'}>
              <button
                onClick={exportAll}
                disabled={saves.length === 0}
                style={{ ...btnNeutral, opacity: saves.length === 0 ? 0.4 : 1 }}>
                ⬇ {lang === 'en' ? 'Export' : 'Exportar'}
              </button>
            </Tooltip>
            <Tooltip text={lang === 'en'
              ? 'Import builds from a .json file'
              : 'Importar builds de um arquivo .json'}>
              <button onClick={() => fileRef.current.click()} style={btnNeutral}>
                ⬆ {lang === 'en' ? 'Import' : 'Importar'}
              </button>
            </Tooltip>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={importFile}
            />
          </div>

          <Divider />

          {/* Código de compartilhamento */}
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>
            🔗 {lang === 'en' ? 'Share Code' : 'Código de Compartilhamento'}
          </div>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <input
              value={shareCode}
              onChange={e => setShareCode(e.target.value)}
              placeholder={lang === 'en' ? 'Paste code here...' : 'Cole o código aqui...'}
              style={{
                width: '100%', background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 6, color: T.text,
                fontSize: 11, padding: '5px 26px 5px 8px',
              }}
            />
            {shareCode && (
              <button
                onClick={() => setShareCode('')}
                title={lang === 'en' ? 'Clear code' : 'Limpar código'}
                style={{
                  position: 'absolute', right: 5, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: T.muted, cursor: 'pointer',
                  fontSize: 12, padding: 0, lineHeight: 1,
                }}>✕</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            <Tooltip text={lang === 'en'
              ? 'Generate and copy the share code for this build'
              : 'Gerar e copiar o código de compartilhamento desta build'}>
              <button onClick={copyCode} style={btnNeutral}>
                📋 {lang === 'en' ? 'Copy' : 'Copiar'}
              </button>
            </Tooltip>
            <Tooltip text={lang === 'en'
              ? 'Load the build from the pasted code'
              : 'Carregar a build do código colado'}>
              <button
                onClick={loadCode}
                disabled={!shareCode}
                style={{ ...btnAction('#2475ad'), opacity: !shareCode ? 0.4 : 1 }}>
                ⬆ {lang === 'en' ? 'Load' : 'Carregar'}
              </button>
            </Tooltip>
          </div>

        </div>
      </div>
    </>
  )
}

// ─── ExportPanel — botões de copiar texto e gerar imagem ───────
//     Fase 2 implementará os handlers reais de geração
function ExportPanel({ build, stats, lang, buildName, includeShareCode }) {
  const [feedback, setFeedback] = useState(null)  // null | 'text-build' | 'img-detailed' etc.

  const flash = (key) => {
    setFeedback(key)
    setTimeout(() => setFeedback(null), 1600)
  }

  // ── Handlers — serão implementados na Fase 2 ──────────────
  const handleCopyText = (mode) => {
    // TODO Fase 2: gerar string de texto e copiar para clipboard
    flash(`text-${mode}`)
  }

  const handleGenImage = (mode) => {
    // TODO Fase 2: gerar imagem via Canvas API e disparar download
    flash(`img-${mode}`)
  }

  const modes = [
    {
      id: 'build',
      labelPT: 'Build',
      labelEN: 'Build',
      tipTextPT: 'Copia um resumo compacto: nomes de habilidades, vantagens, equipamentos e valores de propriedades — sem descrições',
      tipTextEN: 'Copies a compact summary: ability names, perks, gear and property values — no descriptions',
      tipImgPT:  'Gera uma imagem compacta com os dados resumidos da build',
      tipImgEN:  'Generates a compact image with the summarized build data',
    },
    {
      id: 'detailed',
      labelPT: 'Detalhado',
      labelEN: 'Detailed',
      tipTextPT: 'Copia a build completa com descrições de habilidade de classe, vantagens de classe e de cada equipamento',
      tipTextEN: 'Copies the full build with class ability, class perks and gear descriptions',
      tipImgPT:  'Gera uma imagem detalhada com todas as descrições da build',
      tipImgEN:  'Generates a detailed image with all build descriptions',
    },
    {
      id: 'stats',
      labelPT: 'Estatístico',
      labelEN: 'Statistical',
      tipTextPT: 'Copia a build completa com descrições + todas as estatísticas calculadas (somente as modificadas pela build)',
      tipTextEN: 'Copies the full build with descriptions + all calculated statistics (only those modified by the build)',
      tipImgPT:  'Gera uma imagem com a build completa e todas as estatísticas calculadas',
      tipImgEN:  'Generates an image with the full build and all calculated statistics',
    },
  ]

  const L = lang === 'en'

  const btnExport = (isActive, baseColor) => ({
    background: isActive ? baseColor + '55' : baseColor + '22',
    border: `1px solid ${isActive ? baseColor : baseColor + '66'}`,
    color: T.text, borderRadius: 7,
    padding: '5px 12px', cursor: 'pointer',
    fontSize: 11, fontWeight: 600,
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    flexShrink: 0,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Linha 1 — copiar texto */}
      <div style={{ display: 'flex', gap: 8 }}>
        {modes.map(m => (
          <Tooltip key={m.id} text={L ? m.tipTextEN : m.tipTextPT}>
            <button
              onClick={() => handleCopyText(m.id)}
              style={btnExport(feedback === `text-${m.id}`, T.accent)}
            >
              {feedback === `text-${m.id}` ? '✓' : '📋'} {L ? m.labelEN : m.labelPT}
            </button>
          </Tooltip>
        ))}
      </div>
      {/* Linha 2 — gerar imagem */}
      <div style={{ display: 'flex', gap: 8 }}>
        {modes.map(m => (
          <Tooltip key={m.id} text={L ? m.tipImgEN : m.tipImgPT}>
            <button
              onClick={() => handleGenImage(m.id)}
              style={btnExport(feedback === `img-${m.id}`, '#6c5ce7')}
            >
              {feedback === `img-${m.id}` ? '✓' : '🖼️'} {L ? m.labelEN : m.labelPT}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

// ─── SettingsModal — modal de configurações ─────────────────────
function SettingsModal({
  open, onClose, lang,
  layoutMode, setLayoutMode,
  includeShareCode, setIncludeShareCode,
}) {
  if (!open) return null

  const LAYOUTS = [
    { id: 'three-col', labelPT: '3 Colunas', labelEN: '3 Columns', icon: '⫿⫿⫿' },
    { id: 'two-col',   labelPT: '2 Colunas', labelEN: '2 Columns', icon: '⫿⫿'  },
  ]

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'rgba(0,0,0,0.55)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 900,
        background: T.panel, border: `1px solid ${T.borderHov}`,
        borderRadius: 13, padding: '18px 20px',
        width: 340, maxWidth: '92vw',
        boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 16,
        }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            ⚙️ {lang === 'en' ? 'Settings' : 'Configurações'}
          </span>
          <button onClick={onClose} style={{
            background: T.cardHov, border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.muted, cursor: 'pointer',
            fontSize: 14, padding: '3px 9px',
          }}>✕</button>
        </div>

        {/* ── Seção: Layout */}
        <SectionTitle>{lang === 'en' ? 'Layout' : 'Layout'}</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {LAYOUTS.map(l => (
            <Tooltip
              key={l.id}
              text={lang === 'en'
                ? (l.id === 'three-col'
                    ? 'Class abilities left · Gear center · Stats right — each column scrolls independently'
                    : 'Class abilities + Gear left · Stats right — classic layout')
                : (l.id === 'three-col'
                    ? 'Habilidades à esquerda · Equipamentos no centro · Estatísticas à direita — cada coluna rola independentemente'
                    : 'Habilidades + Equipamentos à esquerda · Estatísticas à direita — layout clássico')
              }>
              <button
                onClick={() => setLayoutMode(l.id)}
                style={{
                  flex: 1, padding: '9px 6px',
                  background: layoutMode === l.id ? T.accent + '28' : T.card,
                  border: `2px solid ${layoutMode === l.id ? T.accent : T.border}`,
                  borderRadius: 9, cursor: 'pointer', color: T.text,
                  fontSize: 13, fontWeight: layoutMode === l.id ? 700 : 400,
                  transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: 18, letterSpacing: 3 }}>{l.icon}</div>
                <div style={{ fontSize: 10, marginTop: 4, color: T.muted }}>
                  {lang === 'en' ? l.labelEN : l.labelPT}
                </div>
              </button>
            </Tooltip>
          ))}
        </div>

        <Divider />

        {/* ── Seção: Opções de exportação */}
        <SectionTitle>{lang === 'en' ? 'Export Options' : 'Opções de Exportação'}</SectionTitle>
        <Tooltip text={lang === 'en'
          ? 'When enabled, the share code (Base64) will be appended to the end of the exported text. Useful for forums or posts where others can load the build directly.'
          : 'Quando ativado, o código de compartilhamento (Base64) será adicionado ao final do texto exportado. Útil para fóruns ou posts onde outros podem carregar a build diretamente.'}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', marginBottom: 14,
          }}>
            <input
              type="checkbox"
              checked={includeShareCode}
              onChange={e => setIncludeShareCode(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: T.accent, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: T.text, lineHeight: 1.4 }}>
              {lang === 'en'
                ? 'Include share code in exported text'
                : 'Incluir código de compartilhamento no texto exportado'}
            </span>
          </label>
        </Tooltip>

        <Divider />

        {/* ── Seção: Créditos e dados */}
        <SectionTitle>{lang === 'en' ? 'Credits & Data Sources' : 'Créditos & Fontes de Dados'}</SectionTitle>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
          <div>
            <strong style={{ color: T.text }}>arlsnech</strong>
            {' '}— {lang === 'en' ? 'Author, maintainer & data research (PT-BR)' : 'Autor, mantenedor e pesquisa de dados (PT-BR)'}
          </div>
          <div style={{ marginTop: 4 }}>
            {lang === 'en' ? 'Community data:' : 'Dados da comunidade:'}
            {' '}DoctorKoolman · Boneofimba · berrek45 · tenshimkii
          </div>
          <div style={{ marginTop: 4 }}>
              📊 {lang === 'en' ? 'PT-BR Data Sheet (arlsnech)' : 'Planilha PT-BR (arlsnech)'}
          </div>
          <div style={{ marginTop: 4 }}>
              📖 {lang === 'en' ? 'GoT Legends Wiki (EN)' : 'Wiki GoT Lendas'}
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, color: T.dim }}>
            {lang === 'en'
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
  const [settingsOpen,     setSettingsOpen]     = useState(false)
  const [includeShareCode, setIncludeShareCode] = useState(false)

  const stats   = useMemo(() => computeStats(build), [build])
  const legInfo = useMemo(() => checkLegendaryLimit(build), [build])

  // Permite que SaveDrawer dispare o carregamento de build
  useEffect(() => {
    window.__loadBuild = (b) => setBuild(b)
    return () => { delete window.__loadBuild }
  }, [])

  // Estilo base do body
  useEffect(() => {
    document.body.style.background = T.bg
    document.body.style.color = T.text
    document.body.style.margin = '0'
    document.body.style.overflow = 'hidden'
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, [])

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

      {/* ══════════════════════════════════════════════════════
          HEADER FIXO — Marca, Classes, Controles
      ══════════════════════════════════════════════════════ */}
      <header style={{
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        padding: '8px 16px',
        flexShrink: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}>

        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>
            ⛩ GoT: Legends
          </span>
          <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>
            Build Planner
          </span>
        </div>

        {/* Classes — centralizadas */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {CLASSES.map(c => {
            const active = build.classId === c.id
            return (
              <Tooltip
                key={c.id}
                text={lang === 'en'
                  ? `Switch to ${c.nEN} class`
                  : `Trocar para a classe ${c.nPT}`}>
                <button
                  onClick={() => onClassChange(c.id)}
                  style={{
                    padding: '5px 11px',
                    background: active ? T.cls[c.id] + '28' : T.card,
                    border: `2px solid ${active ? T.cls[c.id] : T.border}`,
                    borderRadius: 8, cursor: 'pointer',
                    color: active ? T.text : T.muted,
                    fontWeight: active ? 700 : 400,
                    fontSize: 12,
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 5,
                    flexShrink: 0,
                  }}>
                  <span style={{ fontSize: 14 }}>{cls_emoji[c.id]}</span>
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
              borderRadius: 7, padding: '6px 10px', cursor: 'pointer',
              color: T.text, fontSize: 13,
            }}>🎲</button>
          </Tooltip>

          <Tooltip text={lang === 'en' ? 'Settings' : 'Configurações'}>
            <button onClick={() => setSettingsOpen(true)} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '6px 10px', cursor: 'pointer',
              color: T.text, fontSize: 13,
            }}>⚙️</button>
          </Tooltip>

          <Tooltip text={lang === 'en' ? 'Toggle language' : 'Alternar idioma'}>
            <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '6px 9px', cursor: 'pointer',
              color: T.text, fontSize: 12, fontWeight: 600,
            }}>
              {lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
            </button>
          </Tooltip>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          SUB-HEADER — Slots magistrais + Painel de exportação
      ══════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0,
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        padding: '7px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Info de slots magistrais — sempre visível */}
        <div style={{ fontSize: 11, color: T.muted, flexShrink: 0 }}>
          {'⭐'.repeat(legInfo.used)}{'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
          {' '}
          <span style={{ color: legInfo.used >= legInfo.limit ? T.leg : T.muted }}>
            {lang === 'en'
              ? `${legInfo.used}/${legInfo.limit} Legendary`
              : `${legInfo.used}/${legInfo.limit} Magistrais`}
          </span>
        </div>

        {/* Painel de exportação (placeholder Fase 1; funcional na Fase 2) */}
        <ExportPanel
          build={build}
          stats={stats}
          lang={lang}
          buildName={buildName}
          includeShareCode={includeShareCode}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          ÁREA PRINCIPAL — 3 ou 2 colunas com scroll independente
      ══════════════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: layoutMode === 'three-col'
          ? '255px 1fr 340px'
          : '1fr 360px',
        gap: 0,
      }}>

        {/* ── COL ESQUERDA: Técnicas de classe (somente no modo 3 colunas) */}
        {layoutMode === 'three-col' && (
          <div style={{
            overflowY: 'auto',
            borderRight: `1px solid ${T.border}`,
            padding: '10px 10px 16px',
          }}>
            <TechniquesPanel build={build} setBuild={setBuild} lang={lang} />
          </div>
        )}

        {/* ── COL CENTRAL: Equipamentos (+ Técnicas no modo 2 colunas) */}
        <div style={{
          overflowY: 'auto',
          borderRight: `1px solid ${T.border}`,
          padding: '10px 12px 16px',
        }}>
          {/* No modo 2 colunas, as técnicas ficam aqui acima dos equipamentos */}
          {layoutMode === 'two-col' && (
            <TechniquesPanel build={build} setBuild={setBuild} lang={lang} />
          )}

          {/* Slots de equipamento */}
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
            />
          ))}
        </div>

        {/* ── COL DIREITA: Estatísticas */}
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

      {/* ══════════════════════════════════════════════════════
          ELEMENTOS SOBREPOSTOS (fixos, fora do fluxo normal)
      ══════════════════════════════════════════════════════ */}

      {/* Aba lateral para abrir o drawer de builds */}
      <BookmarkTab
        open={drawerOpen}
        onToggle={() => setDrawerOpen(o => !o)}
        lang={lang}
      />

      {/* Drawer lateral de gerenciamento de builds */}
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
        includeShareCode={includeShareCode}
        setIncludeShareCode={setIncludeShareCode}
      />

      {/* Estilos globais */}
      <style>{`
        select option { background: #181924; color: #dde0ef; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #10111c; }
        ::-webkit-scrollbar-thumb { background: #2a2b3d; border-radius: 3px; }
        * { box-sizing: border-box; }
        button { transition: opacity 0.12s; }
        button:hover { opacity: 0.82; }
        input { outline: none; }
        input:focus { border-color: ${T.borderHov} !important; }
        /* Mobile: drawer ocupa quase toda a tela */
        @media (max-width: 600px) {
          /* As colunas no mobile se tornam scroll horizontal seria ruim,
             então forçamos empilhamento via grid column collapse */
        }
      `}</style>
    </div>
  )
}