// ============================================================
// logic.js — GoT Legends Build Planner
// Motor de cálculo de estatísticas e gerenciamento de estado
// ============================================================

import { CLASSES, GEAR, CLASS_EXCLUSIVE_CHARM_PROPS, CLASS_EXCLUSIVE_CHARM_PERKS, REQUIRED_PERKS } from './data.js';

/**
 * Retorna o id do perk obrigatório para um item numa determinada classe.
 * Retorna null se não houver obrigatoriedade.
 */
export function getRequiredPerkId(itemId, classId) {
  if (!itemId || !classId) return null;
  return REQUIRED_PERKS[itemId]?.[classId] ?? null;
}

// ─── CONSTANTES ──────────────────────────────────────────────

export const BASE_HP       = 100;
export const BASE_RESOLVE  = 3;
export const BASE_LEG_SLOTS = 1;

/** Mapeamento de sk → se é acumulação flat (soma literal) ou add (soma %) */
const SK_TYPE = {
  // flat: valor absoluto somado diretamente
  maxHP:              'flat',
  maxResolve:         'flat',
  legSlots:           'flat',
  reviveHP:           'flat',
  offeringHP:         'flat',
  stealth:            'flat',
  spiritPullTargets:  'flat',
  // add: acumulados como decimais, exibidos como %
  meleeDamage:        'add',
  resolveFromMelee:   'add',
  meleeStaggerDamage: 'add',
  parryWindow:        'add',
  counterDamage:      'add',
  ultimateDamage:     'add',
  abilityCDR:         'add',
  oniDamage:          'add',
  staggeredDamage:    'add',
  rangedDamage:       'add',
  resolveFromRanged:  'add',
  headshotDamage:     'add',
  drawSpeed:          'add',
  reloadSpeed:        'add',
  projectileSpeed:    'add',
  statusDuration:     'add',
  statusDamage:       'add',
  stealthDamage:      'add',
  blastRadius:        'add',
  damageReduction:    'add',
  resolveFromInjury:  'add',
  resolveGain:        'add',
  fireDamage:         'add',
  ghostWeaponDamage:  'add',
  gwCDRglobal:        'add',
  gw1CDR:             'add',
  gw2CDR:             'add',
  healingReceived:    'add',
  assassinDamage:     'add',
  assassinOnStagger:  'add',
  assassinFromAbove:  'add',
  headshotDmgClose:   'add',
  explosiveBladeRadius:'add',
  hunterAbilityRadius:'add',
  aromaticoRadius:    'add',
  aromaticoDuration:  'add',
  healingSpiritRadius:'add',
  weakeningBurstRadius:'add',
  toxicVanishRadius:  'add',
  vanishDuration:     'add',
  ultDmgBonus:        'add',
  // special / informational
  ultStrikeBonus:     'flat',
  ultTargetBonus:     'flat',
  gwCDRonKillGlobal:  'flat',   // seconds
  gw1CDRonKill:       'flat',   // seconds
  gw2CDRonKill:       'flat',   // seconds
  gwCDRonAssassin:    'flat',   // seconds
};

// ─── ESTADO DE BUILD ─────────────────────────────────────────

/**
 * Estrutura de estado de um slot de equipamento.
 * p1/p2: { propId: string | null, value: number }
 * perk1/perk2: string | null  (id do perk)
 */
const emptySlot = () => ({
  itemId: null,
  p1: { propId: null, value: 0 },
  p2: { propId: null, value: 0 },
  perk1: null,
  perk2: null,
});

/**
 * Cria um build vazio para a classe dada.
 * @param {string} classId
 * @returns {Object} build state
 */
export function createEmptyBuild(classId) {
  return {
    classId,
    abilityId: null,           // id da habilidade de classe selecionada
    ronin_breath: null,        // id da variante do Sopro de Izanami (Ronin)
    techs: {
      I:   null,
      II:  null,
      III: null,
    },
    gear: {
      katana: emptySlot(),
      ranged: emptySlot(),
      charm:  { ...emptySlot(), linkedClass: classId },
      gw1:    emptySlot(),
      gw2:    emptySlot(),
    },
  };
}

// ─── HELPERS DE DADOS ────────────────────────────────────────

/** Retorna o objeto de classe. */
export function getClass(classId) {
  return CLASSES.find(c => c.id === classId) ?? null;
}

/** Retorna o objeto de item pelo id. */
export function getItem(itemId) {
  return GEAR.find(g => g.id === itemId) ?? null;
}

/** Retorna a lista de itens de um tipo visíveis para a classe. */
export function getGearListForClass(type, classId) {
  return GEAR.filter(g => {
    if (g.type !== type) return false;
    if (!g.by) return true;
    return g.by.includes(classId);
  });
}

/**
 * Retorna as props disponíveis para um slot (P1 ou P2) de um item,
 * excluindo a prop já escolhida no outro slot (mesma sk = bloqueada).
 */
export function getAvailableProps(itemId, slot, otherPropId) {
  const item = getItem(itemId);
  if (!item) return [];
  const other = otherPropId ? item.props.find(p => p.id === otherPropId) : null;
  return item.props.filter(p => {
    if (!p.sl.includes(slot)) return false;
    // Bloqueia se tiver a mesma sk que a prop do outro slot
    if (other && p.sk === other.sk) return false;
    return true;
  });
}

/**
 * Retorna os perks disponíveis para um item, excluindo o já escolhido
 * no outro slot de perk.
 */
export function getAvailablePerks(itemId, otherPerkId) {
  const item = getItem(itemId);
  if (!item) return [];
  return item.perks.filter(p => p.id !== otherPerkId);
}

// ─── CLASSIBINDING — AMULETOS MAGISTRAIS ────────────────────

/**
 * Retorna os dados de amuleto magistral com classBinding ajustados
 * para a classe vinculada. Injeta as propriedades e vantagens
 * exclusivas da classe no item.
 */
export function resolveCharmClassBinding(item, linkedClass) {
  if (!item || !item.classBinding || !linkedClass) return item;

  // Usa diretamente as tabelas de props/perks exclusivos definidas em data.js.
  const exclusiveProps = CLASS_EXCLUSIVE_CHARM_PROPS[linkedClass] ?? [];
  const exclusivePerks = CLASS_EXCLUSIVE_CHARM_PERKS[linkedClass] ?? [];

  // Filtra props cujo sk já exista no magistral base (evita duplicação)
  const baseSkSet  = new Set(item.props.map(p => p.sk));
  const propsToAdd = exclusiveProps.filter(p => !baseSkSet.has(p.sk));

  // Filtra perks que já existam no magistral base (evita duplicação)
  const basePerkSet = new Set(item.perks.map(p => p.id));
  const perksToAdd  = exclusivePerks.filter(p => !basePerkSet.has(p.id));

  if (propsToAdd.length === 0 && perksToAdd.length === 0) return item;

  return {
    ...item,
    props: [...item.props, ...propsToAdd],
    perks: [...item.perks, ...perksToAdd],
  };
}

/**
 * Retorna o item de amuleto efetivo (com props/perks de classBinding
 * já resolvidos se aplicável).
 */
export function getEffectiveCharm(itemId, linkedClass) {
  const item = getItem(itemId);
  if (!item) return null;
  if (item.classBinding && linkedClass) {
    return resolveCharmClassBinding(item, linkedClass);
  }
  return item;
}

// ─── ACUMULADOR DE STATS ─────────────────────────────────────

/** Cria um acumulador zerado com todos os stats reconhecidos. */
function zeroStats() {
  const s = {};
  Object.keys(SK_TYPE).forEach(k => { s[k] = 0; });
  // Especiais não numéricos
  s.ultMode = null;  // null | "rage300"
  return s;
}

/** Adiciona o valor de um efeito {s, v, t} ao acumulador. */
function applyFx(acc, fx) {
  const { s, v, t } = fx;
  if (s === 'ultMode') { acc.ultMode = v; return; }
  if (SK_TYPE[s] === undefined) return;  // sk desconhecido, ignora
  acc[s] = (acc[s] ?? 0) + v;
}

/**
 * Lê o valor de uma prop de um slot do gear e adiciona ao acumulador.
 * @param {Object} acc  acumulador
 * @param {Object} slot slotState { itemId, p1, p2, perk1, perk2 }
 * @param {string} slotName 'p1' | 'p2'
 */
function applyPropSlot(acc, slot, slotName) {
  const propState = slot[slotName];
  if (!propState || !propState.propId || propState.value === 0) return;
  const item = getItem(slot.itemId);
  if (!item) return;
  const propDef = item.props.find(p => p.id === propState.propId);
  if (!propDef) return;
  const sk = propDef.sk;
  if (!SK_TYPE[sk]) return;
  // Para props de GW: distinguir gw1 vs gw2 baseado no tipo do item
  const resolvedSk = resolveGWSk(sk, item.type);
  acc[resolvedSk] = (acc[resolvedSk] ?? 0) + propState.value;
}

/**
 * Resolve a sk de uma prop de Arma Fantasma para o canal correto.
 * Props de GW no próprio item: 'gw1CDR' / 'gw1CDRonKill' para gw1,
 * 'gw2CDR' / 'gw2CDRonKill' para gw2.
 * Props no amuleto: 'gwCDRglobal' / 'gwCDRonKillGlobal' — ficam como estão.
 */
function resolveGWSk(sk, itemType) {
  if (itemType === 'gw1') {
    if (sk === 'gw1CDR')      return 'gw1CDR';
    if (sk === 'gw1CDRonKill') return 'gw1CDRonKill';
  }
  if (itemType === 'gw2') {
    if (sk === 'gw2CDR')      return 'gw2CDR';
    if (sk === 'gw2CDRonKill') return 'gw2CDRonKill';
  }
  return sk;
}

/**
 * Aplica os efeitos estáticos de um perk (fx[]) ao acumulador.
 * Perks sem fx[] são informativos — não contribuem para stats numéricos.
 */
function applyPerkFx(acc, perkId, itemId, charmEffective) {
  // O item pode ser o charm efetivo (com classBinding resolvido)
  const item = charmEffective ?? getItem(itemId);
  if (!item) return;
  const perk = item.perks.find(p => p.id === perkId);
  if (!perk || !perk.fx) return;
  perk.fx.forEach(fx => applyFx(acc, fx));
}

// ─── COMPUTESTATS — FUNÇÃO PRINCIPAL ─────────────────────────

/**
 * Calcula todas as estatísticas de um build.
 *
 * @param {Object} build  estado do build (ver createEmptyBuild)
 * @returns {Object} stats com todos os valores calculados + info de cooldowns
 */
export function computeStats(build) {
  const acc = zeroStats();
  const cls = getClass(build.classId);
  if (!cls) return buildResult(acc, build, cls);

  // ── 1. Técnicas selecionadas ──────────────────────────────
  ['I', 'II', 'III'].forEach(tier => {
    const techId = build.techs[tier];
    if (!techId) return;
    const tech = cls.techs.find(t => t.id === techId);
    if (!tech) return;
    tech.fx.forEach(fx => applyFx(acc, fx));
  });

  // ── 2. Props de todos os slots de equipamento ─────────────
  const GEAR_SLOTS = ['katana', 'ranged', 'charm', 'gw1', 'gw2'];
  GEAR_SLOTS.forEach(slotName => {
    const slot = build.gear[slotName];
    if (!slot.itemId) return;

    // Para charm: usa item efetivo (classBinding)
    const effectiveItem = slotName === 'charm'
      ? getEffectiveCharm(slot.itemId, slot.linkedClass)
      : getItem(slot.itemId);

    if (!effectiveItem) return;

    // P1
    applyPropSlotWithItem(acc, slot.p1, effectiveItem);
    // P2
    applyPropSlotWithItem(acc, slot.p2, effectiveItem);
    // Perk1
    applyPerkFxWithItem(acc, slot.perk1, effectiveItem);
    // Perk2
    applyPerkFxWithItem(acc, slot.perk2, effectiveItem);
  });

  return buildResult(acc, build, cls);
}

/** Aplica uma prop dada o item já resolvido (evita re-busca). */
function applyPropSlotWithItem(acc, propState, item) {
  if (!propState || !propState.propId || !propState.value) return;
  const propDef = item.props.find(p => p.id === propState.propId);
  if (!propDef) return;
  const sk = resolveGWSk(propDef.sk, item.type);
  if (SK_TYPE[sk] !== undefined) {
    acc[sk] = (acc[sk] ?? 0) + propState.value;
  }
}

/** Aplica fx de um perk dado o item já resolvido. */
function applyPerkFxWithItem(acc, perkId, item) {
  if (!perkId || !item) return;
  const perk = item.perks.find(p => p.id === perkId);
  if (!perk || !perk.fx) return;
  perk.fx.forEach(fx => applyFx(acc, fx));
}

// ─── RESULTADO FINAL ─────────────────────────────────────────

/**
 * Constrói o objeto de resultado com todos os valores finais
 * calculados, prontos para exibição.
 */
function buildResult(acc, build, cls) {
  const res = {};

  // ── Vida & Sobrevivência ──────────────────────────────────
  res.maxHP          = BASE_HP + acc.maxHP;
  res.damageReduction= round2(acc.damageReduction);
  res.reviveHP       = acc.reviveHP;
  res.offeringHP     = acc.offeringHP;
  res.healingReceived= round2(acc.healingReceived);

  // ── Determinação ─────────────────────────────────────────
  res.maxResolve     = BASE_RESOLVE + acc.maxResolve;
  res.resolveGain    = round2(acc.resolveGain);
  res.resolveFromMelee   = round2(acc.resolveFromMelee);
  res.resolveFromRanged  = round2(acc.resolveFromRanged);
  res.resolveFromInjury  = round2(acc.resolveFromInjury);

  // ── Slots Magistrais ──────────────────────────────────────
  res.legSlots       = BASE_LEG_SLOTS + acc.legSlots;

  // ── Dano C/C ──────────────────────────────────────────────
  res.meleeDamage       = round2(acc.meleeDamage);
  res.meleeStaggerDamage= round2(acc.meleeStaggerDamage);
  res.parryWindow       = round2(acc.parryWindow);
  res.counterDamage     = round2(acc.counterDamage);
  res.stealthDamage     = round2(acc.stealthDamage);
  res.assassinDamage    = round2(acc.assassinDamage);
  res.assassinOnStagger = round2(acc.assassinOnStagger);
  res.assassinFromAbove = round2(acc.assassinFromAbove);

  // ── Dano à Distância ──────────────────────────────────────
  res.rangedDamage      = round2(acc.rangedDamage);
  res.headshotDamage    = round2(acc.headshotDamage);
  res.headshotDmgClose  = round2(acc.headshotDmgClose);
  res.drawSpeed         = round2(acc.drawSpeed);
  res.reloadSpeed       = round2(acc.reloadSpeed);
  res.projectileSpeed   = round2(acc.projectileSpeed);

  // ── Dano Especial ─────────────────────────────────────────
  res.ghostWeaponDamage = round2(acc.ghostWeaponDamage);
  res.ultimateDamage    = round2(acc.ultimateDamage);
  res.fireDamage        = round2(acc.fireDamage);
  res.statusDamage      = round2(acc.statusDamage);
  res.statusDuration    = round2(acc.statusDuration);
  res.oniDamage         = round2(acc.oniDamage);
  res.staggeredDamage   = round2(acc.staggeredDamage);
  res.blastRadius       = round2(acc.blastRadius);

  // ── Furtividade ───────────────────────────────────────────
  res.stealth           = acc.stealth;

  // ── Recargas ──────────────────────────────────────────────
  res.abilityCDR        = round2(acc.abilityCDR);
  res.abilityCooldown   = computeAbilityCooldown(build, cls, res.abilityCDR);

  // Cooldowns individuais de GW (calculados separadamente)
  res.gw1 = computeGWCooldown(build.gear.gw1, {
    ownCDR:      acc.gw1CDR,
    ownCDRonKill:acc.gw1CDRonKill,
    globalCDR:   acc.gwCDRglobal,
    globalKill:  acc.gwCDRonKillGlobal,
    deftHands:   acc.gwCDRonAssassin,
  });
  res.gw2 = computeGWCooldown(build.gear.gw2, {
    ownCDR:      acc.gw2CDR,
    ownCDRonKill:acc.gw2CDRonKill,
    globalCDR:   acc.gwCDRglobal,
    globalKill:  acc.gwCDRonKillGlobal,
    deftHands:   acc.gwCDRonAssassin,
  });

  // ── Específicos de Classe ─────────────────────────────────
  res.spiritPullTargets    = acc.spiritPullTargets;   // Samurai
  res.explosiveBladeRadius = round2(acc.explosiveBladeRadius); // Samurai
  res.hunterAbilityRadius  = round2(acc.hunterAbilityRadius);  // Caçadora
  res.aromaticoRadius      = round2(acc.aromaticoRadius);      // Ronin
  res.aromaticoDuration    = round2(acc.aromaticoDuration);    // Ronin
  res.healingSpiritRadius  = round2(acc.healingSpiritRadius);  // Ronin
  res.weakeningBurstRadius = round2(acc.weakeningBurstRadius); // Ronin
  res.toxicVanishRadius    = round2(acc.toxicVanishRadius);    // Assassino
  res.vanishDuration       = round2(acc.vanishDuration);       // Assassino

  // ── Painel do Supremo ─────────────────────────────────────
  res.ultimate = computeUltimate(build, cls, acc);

  return res;
}

// ─── CÁLCULOS DE COOLDOWN ────────────────────────────────────

/**
 * Calcula recarga final da habilidade de classe.
 * Retorna { abilityId, baseCd, finalCd } ou null se sem classe/habilidade.
 */
function computeAbilityCooldown(build, cls, totalCDR) {
  if (!cls || !build.abilityId) return null;
  const ability = cls.abilities.find(a => a.id === build.abilityId);
  if (!ability) return null;

  // Total CDR: de técnicas + props de katana/amuleto
  // acc.abilityCDR já acumula tudo com sk: "abilityCDR"
  // Clampa em 0 (não pode ter recarga negativa)
  const reduction = Math.min(totalCDR, 0.99);
  const finalCd   = roundCd(ability.cd * (1 - reduction));

  return {
    abilityId: ability.id,
    nPT:       ability.nPT,
    nEN:       ability.nEN,
    baseCd:    ability.cd,
    cdr:       reduction,
    finalCd,
  };
}

/**
 * Calcula cooldown de uma arma fantasma.
 * @param {Object} gwSlot  { itemId, p1, p2, perk1, perk2 }
 * @param {Object} cdrs    { ownCDR, ownCDRonKill, globalCDR, globalKill, deftHands }
 * @returns {Object} info de cooldown ou null
 */
function computeGWCooldown(gwSlot, cdrs) {
  if (!gwSlot || !gwSlot.itemId) return null;
  const item = getItem(gwSlot.itemId);
  if (!item || !item.cd) return null;

  const { ownCDR, ownCDRonKill, globalCDR, globalKill, deftHands } = cdrs;

  // % de redução total (própria + global do amuleto)
  const totalPctCDR = Math.min(ownCDR + globalCDR, 0.99);
  // Redução em s ao abater (própria + global)
  const killCDR = roundCd(ownCDRonKill + globalKill + deftHands);

  const baseCd  = item.cd;
  const finalCd = roundCd(baseCd * (1 - totalPctCDR));

  return {
    itemId:     item.id,
    nPT:        item.nPT,
    nEN:        item.nEN,
    baseCd,
    ownCDR:     round2(ownCDR),
    globalCDR:  round2(globalCDR),
    totalPctCDR:round2(totalPctCDR),
    finalCd,
    killCDR:    killCDR > 0 ? killCDR : null,  // null se não há CDR por abate
  };
}

// ─── PAINEL DO SUPREMO ────────────────────────────────────────

/**
 * Calcula e retorna as informações do painel da habilidade suprema.
 * @param {Object} build
 * @param {Object} cls
 * @param {Object} acc  acumulador de stats
 * @returns {Object} dados do painel do supremo
 */
function computeUltimate(build, cls, acc) {
  if (!cls) return null;

  const base = cls.ult;

  switch (cls.id) {

    case 'samurai': {
      if (acc.ultMode === 'rage300') {
        return {
          classId:  'samurai',
          nPT:      base.nPT,
          nEN:      base.nEN,
          cost:     base.cost,
          mode:     'rage300',
          strikes:  2,
          dmgPct:   300,
          notePT:   'Cada golpe causa 300% de dano.',
          noteEN:   'Each strike deals 300% damage.',
        };
      }
      const strikes = base.strikes + (acc.ultStrikeBonus || 0);
      return {
        classId:      'samurai',
        nPT:          base.nPT,
        nEN:          base.nEN,
        cost:         base.cost,
        mode:         'normal',
        strikes,
        strikeBonus:  acc.ultStrikeBonus || 0,
        ultDmgBonus:  round2(acc.ultimateDamage),
      };
    }

    case 'hunter': {
      const targets = (base.targets ?? 3) + (acc.ultTargetBonus || 0);
      return {
        classId:      'hunter',
        nPT:          base.nPT,
        nEN:          base.nEN,
        cost:         base.cost,
        targets,
        targetBonus:  acc.ultTargetBonus || 0,
        ultDmgBonus:  round2(acc.ultimateDamage),
      };
    }

    case 'ronin': {
      // O Ronin seleciona qual variante do Sopro está ativa via build.ronin_breath
      const breathVariants = getBreathVariants(build);
      return {
        classId:     'ronin',
        nPT:         base.nPT,
        nEN:         base.nEN,
        cost:        base.cost,
        activeBreath: build.ronin_breath,
        variants:    breathVariants,
        ultDmgBonus: round2(acc.ultimateDamage),
      };
    }

    case 'assassin': {
      const strikes = base.strikes + (acc.ultStrikeBonus || 0);
      const dmgMult = acc.ultDmgBonus > 0 ? (1 + acc.ultDmgBonus) : null;
      return {
        classId:     'assassin',
        nPT:         base.nPT,
        nEN:         base.nEN,
        cost:        base.cost,
        strikes,
        strikeBonus: acc.ultStrikeBonus || 0,
        dmgMult,      // null ou 2.0 quando Ofuscado ativo
        ultDmgBonus: round2(acc.ultimateDamage),
      };
    }

    default:
      return null;
  }
}

/**
 * Retorna as variantes de Sopro de Izanami disponíveis para o Ronin
 * com base nas técnicas selecionadas.
 * Base: Sopro Normal (revive)
 * + Sopro Reconfortante (Tech III: sopro_recon) — cura gradual
 * + Sopro de Fogo (Tech III: sopro_fogo) — incendeia
 * + Sopro Atordoante (Tech III: sopro_atord) — onda de choque
 */
function getBreathVariants(build) {
  const base = [
    { id: 'breath_base', nPT: 'Sopro de Izanami', nEN: 'Breath of Izanami',
      dPT: 'Revive todos os aliados incapacitados.', dEN: 'Revive all downed allies.' },
  ];
  const tier3 = build.techs?.III;
  const variants = {
    sopro_recon:  { id: 'sopro_recon',  nPT: 'Sopro Reconfortante', nEN: 'Soothing Breath',
                    dPT: 'Aplica cura gradual a todos os jogadores por 8 segundos.', dEN: 'Applies a heal over time on all players for 8 seconds.' },
    sopro_fogo:   { id: 'sopro_fogo',   nPT: 'Sopro De Fogo',       nEN: 'Fire Breath',
                    dPT: 'Incendeia os inimigos próximos a todos os jogadores.', dEN: 'Ignites enemies near all players.' },
    sopro_atord:  { id: 'sopro_atord',  nPT: 'Sopro Atordoante',    nEN: 'Staggering Breath',
                    dPT: 'Cria onda de choque que afasta e enfraquece todos os inimigos próximos.', dEN: 'Creates a shockwave that knocks back and weakens nearby enemies.' },
  };

  if (tier3 && variants[tier3]) {
    return [...base, variants[tier3]];
  }
  return base;
}

// ─── VALIDAÇÃO DE SLOTS ───────────────────────────────────────

/**
 * Verifica se um segundo slot magistral pode ser equipado.
 * Regra: limite base é 1. Cada técnica "Magistral" selecionada
 * adiciona +1. Máx teórico com 2 técnicas = 3 slots.
 *
 * @param {Object} build
 * @returns {{ limit: number, used: number, canAdd: boolean }}
 */
export function checkLegendaryLimit(build) {
  const cls = getClass(build.classId);
  if (!cls) return { limit: 1, used: 0, canAdd: false };

  let techLegBonus = 0;
  ['I', 'II', 'III'].forEach(tier => {
    const techId = build.techs[tier];
    if (!techId) return;
    const tech = cls.techs.find(t => t.id === techId);
    if (!tech) return;
    tech.fx.forEach(fx => { if (fx.s === 'legSlots') techLegBonus += fx.v; });
  });

  const limit = BASE_LEG_SLOTS + techLegBonus;

  let used = 0;
  ['katana', 'ranged', 'charm', 'gw1', 'gw2'].forEach(slotName => {
    const slot = build.gear[slotName];
    if (!slot.itemId) return;
    const item = getItem(slot.itemId);
    if (item?.leg) used++;
  });

  return { limit, used, canAdd: used < limit };
}

// ─── SELEÇÃO DE TÉCNICA ───────────────────────────────────────

/**
 * Seleciona (ou desseleciona) uma técnica no build.
 * Comportamento rádio: substituí a anterior no mesmo tier.
 * Clicar na já selecionada desseleciona.
 *
 * @param {Object} build
 * @param {string} tier   'I' | 'II' | 'III'
 * @param {string} techId
 * @returns {Object} novo build (imutável)
 */
export function selectTech(build, tier, techId) {
  const current = build.techs[tier];
  return {
    ...build,
    techs: {
      ...build.techs,
      [tier]: current === techId ? null : techId,
    },
  };
}

/**
 * Seleciona (ou desseleciona) a habilidade de classe.
 * Comportamento rádio: 1 de 3.
 *
 * @param {Object} build
 * @param {string} abilityId
 * @returns {Object} novo build
 */
export function selectAbility(build, abilityId) {
  return {
    ...build,
    abilityId: build.abilityId === abilityId ? null : abilityId,
  };
}

// ─── SELEÇÃO DE EQUIPAMENTO ───────────────────────────────────

/**
 * Seleciona um item em um slot de gear.
 * Limpa P1, P2, Perk1, Perk2 ao trocar de item.
 *
 * @param {Object} build
 * @param {string} slotName  'katana' | 'ranged' | 'charm' | 'gw1' | 'gw2'
 * @param {string|null} itemId
 * @returns {Object} novo build
 */
export function selectItem(build, slotName, itemId) {
  const prev = build.gear[slotName];
  // Se o item exige um perk para esta classe, pré-preenche perk1
  const requiredPerkId = itemId ? getRequiredPerkId(itemId, build.classId) : null;
  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...emptySlot(),
        itemId: itemId ?? null,
        // Preserva linkedClass no charm
        ...(slotName === 'charm' ? { linkedClass: prev.linkedClass ?? build.classId } : {}),
        // Auto-preenche perk1 se houver perk obrigatório
        ...(requiredPerkId ? { perk1: requiredPerkId } : {}),
      },
    },
  };
}

/**
 * Define a prop de um slot (P1 ou P2).
 * Limpa o valor ao trocar de prop.
 * Impede P1 e P2 terem a mesma sk (bloqueia na validação).
 *
 * @param {Object} build
 * @param {string} slotName
 * @param {'p1'|'p2'} propSlot
 * @param {string|null} propId
 * @returns {Object} novo build
 */
export function selectProp(build, slotName, propSlot, propId) {
  const slot     = build.gear[slotName];
  // Use effective charm for class-binding legendary charms
  const item = slotName === 'charm'
    ? getEffectiveCharm(slot.itemId, slot.linkedClass)
    : getItem(slot.itemId);
  if (!item) return build;

  const propDef  = item.props.find(p => p.id === propId);
  if (!propDef && propId !== null) return build;

  // Verifica colisão de sk com o outro slot
  const otherKey = propSlot === 'p1' ? 'p2' : 'p1';
  const otherPropState = slot[otherKey];
  if (propId && otherPropState?.propId) {
    const otherDef = item.props.find(p => p.id === otherPropState.propId);
    if (otherDef && propDef && otherDef.sk === propDef.sk) return build; // Bloqueado
  }

  const defaultValue = propDef ? propDef.mx : 0;

  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...slot,
        [propSlot]: { propId: propId ?? null, value: propId ? defaultValue : 0 },
      },
    },
  };
}

/**
 * Atualiza o valor numérico de uma prop, respeitando min/max.
 *
 * @param {Object} build
 * @param {string} slotName
 * @param {'p1'|'p2'} propSlot
 * @param {number} value  valor cru (pode estar fora do range durante digitação)
 * @param {boolean} clamp  true = clampa no range; false = aceita valor intermediário
 * @returns {Object} novo build
 */
export function setPropValue(build, slotName, propSlot, value, clamp = true) {
  const slot    = build.gear[slotName];
  const propId  = slot[propSlot]?.propId;
  if (!propId) return build;

  const item    = slotName === 'charm'
    ? getEffectiveCharm(slot.itemId, slot.linkedClass)
    : getItem(slot.itemId);
  const propDef = item?.props.find(p => p.id === propId);
  if (!propDef) return build;

  let v = parseFloat(value);
  if (isNaN(v)) v = propDef.mn;
  if (clamp) {
    v = Math.max(propDef.mn, Math.min(propDef.mx, v));
  }

  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...slot,
        [propSlot]: { propId, value: v },
      },
    },
  };
}

/**
 * Seleciona (ou desseleciona) um perk em um slot.
 * Impede perk1 === perk2.
 *
 * @param {Object} build
 * @param {string} slotName
 * @param {'perk1'|'perk2'} perkSlot
 * @param {string|null} perkId
 * @returns {Object} novo build
 */
export function selectPerk(build, slotName, perkSlot, perkId) {
  const slot      = build.gear[slotName];
  const otherKey  = perkSlot === 'perk1' ? 'perk2' : 'perk1';
  const otherPerk = slot[otherKey];

  // Bloqueia qualquer interação com perk1 se ele for obrigatório para esta classe
  if (perkSlot === 'perk1') {
    const requiredPerkId = getRequiredPerkId(slot.itemId, build.classId);
    if (requiredPerkId) return build; // slot travado, ignora silenciosamente
  }

  // Clicar no mesmo desseleciona
  if (slot[perkSlot] === perkId) perkId = null;
  // Impede duplicata
  if (perkId && perkId === otherPerk) return build;

  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...slot,
        [perkSlot]: perkId ?? null,
      },
    },
  };
}

/**
 * Define a classe vinculada de um amuleto magistral.
 * Limpa P1, P2 (as opções disponíveis mudam com a classe).
 *
 * @param {Object} build
 * @param {string} linkedClass
 * @returns {Object} novo build
 */
export function setCharmLinkedClass(build, linkedClass) {
  const slot = build.gear.charm;
  return {
    ...build,
    gear: {
      ...build.gear,
      charm: {
        ...emptySlot(),
        itemId:      slot.itemId,
        linkedClass: linkedClass,
      },
    },
  };
}

/**
 * Seleciona a variante do Sopro de Izanami (Ronin).
 */
export function selectRoninBreath(build, breathId) {
  return {
    ...build,
    ronin_breath: build.ronin_breath === breathId ? null : breathId,
  };
}

// ─── TROCA DE CLASSE ──────────────────────────────────────────

/**
 * Troca a classe do build, resetando técnicas e equipamentos
 * que não são válidos para a nova classe.
 *
 * @param {Object} build
 * @param {string} newClassId
 * @returns {Object} novo build
 */
export function changeClass(build, newClassId) {
  const newBuild = createEmptyBuild(newClassId);
  // Preserva itens de gear que sejam válidos para a nova classe
  ['katana', 'ranged', 'charm', 'gw1', 'gw2'].forEach(slotName => {
    const slot = build.gear[slotName];
    if (!slot.itemId) return;
    const item = getItem(slot.itemId);
    if (!item) return;
    const valid = !item.by || item.by.includes(newClassId);
    if (valid) {
      const oldRequiredPerk = getRequiredPerkId(slot.itemId, build.classId);
      const newRequiredPerk = getRequiredPerkId(slot.itemId, newClassId);
      // Se perk1 era o perk obrigatório da classe antiga, atualiza para o novo (ou libera)
      const preservedPerk1 = newRequiredPerk
        ? newRequiredPerk
        : (slot.perk1 === oldRequiredPerk ? null : slot.perk1);
      newBuild.gear[slotName] = {
        ...slot,
        linkedClass: slotName === 'charm' ? newClassId : undefined,
        perk1: preservedPerk1,
      };
    }
  });

  // Para cada tier: se a técnica selecionada na classe antiga concedia
  // legSlots ("magistral"), busca a técnica equivalente na nova classe
  // (mesma tier, também concede legSlots) e já a equipa automaticamente.
  const oldCls = getClass(build.classId);
  const newCls = getClass(newClassId);
  if (oldCls && newCls) {
    ['I', 'II', 'III'].forEach(tier => {
      const oldTechId = build.techs[tier];
      if (!oldTechId) return; // tier sem técnica selecionada → ignora

      const oldTech = oldCls.techs.find(t => t.id === oldTechId);
      if (!oldTech) return;

      // Verifica se a técnica antiga concedia legSlots
      const grantsLeg = oldTech.fx?.some(fx => fx.s === 'legSlots');
      if (!grantsLeg) return; // não era magistral → ignora (desequipa normalmente)

      // Encontra a técnica magistral da nova classe no mesmo tier
      const newLegTech = newCls.techs.find(
        t => t.tier === tier && t.fx?.some(fx => fx.s === 'legSlots')
      );
      if (newLegTech) {
        newBuild.techs[tier] = newLegTech.id; // equipa automaticamente
      }
    });
  }

  return newBuild;
}

// ─── BUILD ALEATÓRIO ──────────────────────────────────────────

/**
 * Gera um build completamente aleatório para a classe atual.
 * Respeita as restrições de classe nos itens e slots magistrais.
 *
 * @param {Object} build  build atual (usa classId)
 * @returns {Object} novo build aleatório
 */
export function randomBuild(build) {
  const classId = build.classId;
  const cls     = getClass(classId);
  if (!cls) return build;

  const nb = createEmptyBuild(classId);

  // Habilidade aleatória
  if (cls.abilities.length > 0) {
    nb.abilityId = pick(cls.abilities).id;
  }

  // Técnicas aleatórias (1 por tier)
  ['I', 'II', 'III'].forEach(tier => {
    const opts = cls.techs.filter(t => t.tier === tier);
    if (opts.length > 0) nb.techs[tier] = pick(opts).id;
  });

  // Slots magistrais disponíveis após técnicas
  const legLimit = BASE_LEG_SLOTS + countLegBonus(nb, cls);

  // Preenche gear
  let legUsed = 0;
  const slotTypes = { katana:'katana', ranged:'ranged', charm:'charm', gw1:'gw1', gw2:'gw2' };
  Object.entries(slotTypes).forEach(([slot, type]) => {
    const avail = getGearListForClass(type, classId);
    if (avail.length === 0) return;

    // Filtra magistrais se limite atingido
    let pool = avail.filter(i => {
      if (i.leg && legUsed >= legLimit) return false;
      return true;
    });
    if (pool.length === 0) pool = avail.filter(i => !i.leg);
    if (pool.length === 0) return;

    const chosen = pick(pool);
    if (chosen.leg) legUsed++;

    const linkedClass = slot === 'charm' ? classId : undefined;
    const effectiveItem = slot === 'charm' && chosen.classBinding
      ? getEffectiveCharm(chosen.id, linkedClass)
      : chosen;

    // P1
    const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1'));
    const p1 = p1opts.length > 0 ? pick(p1opts) : null;
    const p1val = p1 ? randomInRange(p1.mn, p1.mx, p1.u) : 0;

    // P2 (bloqueando mesma sk que P1)
    const p2opts = effectiveItem.props.filter(p =>
      p.sl.includes('P2') &&
      !(p1 && p.sk === p1.sk)
    );
    const p2 = p2opts.length > 0 ? pick(p2opts) : null;
    const p2val = p2 ? randomInRange(p2.mn, p2.mx, p2.u) : 0;

    // Perks
    const perks = [...effectiveItem.perks];
    const forcedPerk = getRequiredPerkId(chosen.id, classId);
    // perk1: usa o obrigatório se existir, senão sorteia livremente
    const perk1 = forcedPerk ?? (perks.length > 0 ? pick(perks).id : null);
    const remaining = perks.filter(p => p.id !== perk1);
    const perk2 = remaining.length > 0 ? pick(remaining).id : null;

    nb.gear[slot] = {
      itemId: chosen.id,
      linkedClass,
      p1: { propId: p1?.id ?? null, value: p1val },
      p2: { propId: p2?.id ?? null, value: p2val },
      perk1,
      perk2,
    };
  });

  // Ronin breath aleatório se tier3 der opção
  if (classId === 'ronin' && nb.techs.III) {
    const breaths = getBreathVariants(nb);
    if (breaths.length > 1) nb.ronin_breath = pick(breaths).id;
  }

  return nb;
}

/** Conta o bônus de slots magistrais das técnicas. */
function countLegBonus(build, cls) {
  let bonus = 0;
  ['I','II','III'].forEach(tier => {
    const techId = build.techs[tier];
    if (!techId) return;
    const tech = cls.techs.find(t => t.id === techId);
    tech?.fx.forEach(fx => { if (fx.s === 'legSlots') bonus += fx.v; });
  });
  return bonus;
}

// ─── SAVE / LOAD ─────────────────────────────────────────────

/**
 * Serializa um build para JSON (para salvar/exportar).
 * @param {Object} build
 * @param {string} name
 * @returns {Object} objeto serializável
 */
export function serializeBuild(build, name) {
  return {
    version:   '1.0',
    game:      'got-legends',
    id:        generateId(),
    name:      name || 'Build sem nome',
    createdAt: new Date().toISOString(),
    build,
  };
}

/**
 * Deserializa um build de um objeto salvo.
 * Valida versão e retorna build state.
 * @param {Object} saved
 * @returns {{ ok: boolean, build?: Object, error?: string }}
 */
export function deserializeBuild(saved) {
  if (!saved || saved.game !== 'got-legends') {
    return { ok: false, error: 'Arquivo inválido ou de jogo diferente.' };
  }
  if (!saved.build || !saved.build.classId) {
    return { ok: false, error: 'Estrutura de build inválida.' };
  }
  // Verifica se a classe existe
  const cls = getClass(saved.build.classId);
  if (!cls) {
    return { ok: false, error: `Classe desconhecida: ${saved.build.classId}` };
  }
  return { ok: true, build: saved.build };
}

/**
 * Codifica um build em base64 para compartilhamento via link/código.
 */
export function encodeBuild(build, name) {
  const payload = serializeBuild(build, name);
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

/**
 * Decodifica um build de base64.
 * @returns {{ ok: boolean, name?: string, build?: Object, error?: string }}
 */
export function decodeBuild(code) {
  try {
    const json = JSON.parse(decodeURIComponent(escape(atob(code))));
    const result = deserializeBuild(json);
    if (!result.ok) return result;
    return { ok: true, name: json.name, build: result.build };
  } catch {
    return { ok: false, error: 'Código inválido ou corrompido.' };
  }
}

// ─── INFORMAÇÕES DE DISPLAY ───────────────────────────────────

/**
 * Retorna os grupos de estatísticas para exibição no painel,
 * filtrando grupos irrelevantes para a classe atual.
 *
 * @param {Object} stats  resultado de computeStats()
 * @param {string} classId
 * @param {string} lang  'pt' | 'en'
 * @returns {Array<{ groupId, label, stats: Array }>}
 */
export function getStatGroups(stats, classId, lang) {
  const t = lang === 'en' ? LABELS_EN : LABELS_PT;

  const groups = [
    {
      groupId: 'survival',
      label:   t.grp_survival,
      stats: [
        { key: 'maxHP',          label: t.maxHP,          value: stats.maxHP,           unit: '',   base: BASE_HP     },
        { key: 'damageReduction',label: t.damageReduction, value: stats.damageReduction, unit: '%',  base: 0           },
        { key: 'reviveHP',       label: t.reviveHP,        value: stats.reviveHP,        unit: 'pts',base: 0           },
        { key: 'offeringHP',     label: t.offeringHP,      value: stats.offeringHP,      unit: 'pts',base: 0           },
        { key: 'healingReceived',label: t.healingReceived, value: stats.healingReceived, unit: '%',  base: 0           },
      ],
    },
    {
      groupId: 'resolve',
      label:   t.grp_resolve,
      stats: [
        { key: 'maxResolve',       label: t.maxResolve,       value: stats.maxResolve,       unit: '★', base: BASE_RESOLVE },
        { key: 'resolveGain',      label: t.resolveGain,      value: stats.resolveGain,      unit: '%', base: 0 },
        { key: 'resolveFromMelee', label: t.resolveFromMelee, value: stats.resolveFromMelee, unit: '%', base: 0 },
        { key: 'resolveFromRanged',label: t.resolveFromRanged,value: stats.resolveFromRanged,unit: '%', base: 0 },
        { key: 'resolveFromInjury',label: t.resolveFromInjury,value: stats.resolveFromInjury,unit: '%', base: 0 },
      ],
    },
    {
      groupId: 'leg',
      label:   t.grp_leg,
      stats: [
        { key: 'legSlots', label: t.legSlots, value: stats.legSlots, unit: '', base: BASE_LEG_SLOTS },
      ],
    },
    {
      groupId: 'melee',
      label:   t.grp_melee,
      stats: filterStats([
        { key: 'meleeDamage',        label: t.meleeDamage,        value: stats.meleeDamage,        unit: '%', base: 0 },
        { key: 'meleeStaggerDamage', label: t.meleeStaggerDamage, value: stats.meleeStaggerDamage, unit: '%', base: 0 },
        { key: 'parryWindow',        label: t.parryWindow,        value: stats.parryWindow,        unit: '%', base: 0 },
        { key: 'counterDamage',      label: t.counterDamage,      value: stats.counterDamage,      unit: '%', base: 0 },
        { key: 'stealthDamage',      label: t.stealthDamage,      value: stats.stealthDamage,      unit: '%', base: 0 },
        { key: 'assassinDamage',     label: t.assassinDamage,     value: stats.assassinDamage,     unit: '%', base: 0 },
        { key: 'assassinOnStagger',  label: t.assassinOnStagger,  value: stats.assassinOnStagger,  unit: '%', base: 0 },
        { key: 'assassinFromAbove',  label: t.assassinFromAbove,  value: stats.assassinFromAbove,  unit: '%', base: 0 },
      ]),
    },
    {
      groupId: 'ranged',
      label:   t.grp_ranged,
      stats: filterStats([
        { key: 'rangedDamage',    label: t.rangedDamage,    value: stats.rangedDamage,    unit: '%', base: 0 },
        { key: 'headshotDamage',  label: t.headshotDamage,  value: stats.headshotDamage,  unit: '%', base: 0 },
        { key: 'headshotDmgClose',label: t.headshotDmgClose,value: stats.headshotDmgClose,unit: '%', base: 0 },
        { key: 'drawSpeed',       label: t.drawSpeed,       value: stats.drawSpeed,       unit: '%', base: 0 },
        { key: 'reloadSpeed',     label: t.reloadSpeed,     value: stats.reloadSpeed,     unit: '%', base: 0 },
        { key: 'projectileSpeed', label: t.projectileSpeed, value: stats.projectileSpeed, unit: '%', base: 0 },
      ]),
    },
    {
      groupId: 'special',
      label:   t.grp_special,
      stats: filterStats([
        { key: 'ghostWeaponDamage',label: t.ghostWeaponDamage,value: stats.ghostWeaponDamage,unit: '%', base: 0 },
        { key: 'ultimateDamage',   label: t.ultimateDamage,   value: stats.ultimateDamage,   unit: '%', base: 0 },
        { key: 'fireDamage',       label: t.fireDamage,       value: stats.fireDamage,       unit: '%', base: 0 },
        { key: 'statusDamage',     label: t.statusDamage,     value: stats.statusDamage,     unit: '%', base: 0 },
        { key: 'statusDuration',   label: t.statusDuration,   value: stats.statusDuration,   unit: '%', base: 0 },
        { key: 'oniDamage',        label: t.oniDamage,        value: stats.oniDamage,        unit: '%', base: 0 },
        { key: 'staggeredDamage',  label: t.staggeredDamage,  value: stats.staggeredDamage,  unit: '%', base: 0 },
        { key: 'blastRadius',      label: t.blastRadius,      value: stats.blastRadius,      unit: '%', base: 0 },
      ]),
    },
    {
      groupId: 'cooldowns',
      label:   t.grp_cooldowns,
      stats: filterStats([
        { key: 'abilityCDR', label: t.abilityCDR, value: stats.abilityCDR, unit: '%', base: 0 },
      ]),
      // GW1 e GW2 são exibidos como sub-cards separados pelo App.jsx
      gw1: stats.gw1,
      gw2: stats.gw2,
      abilityCooldown: stats.abilityCooldown,
    },
    {
      groupId: 'stealth',
      label:   t.grp_stealth,
      stats: filterStats([
        { key: 'stealth', label: t.stealth, value: stats.stealth, unit: 'pts', base: 0 },
      ]),
    },
    // Específicos de classe — exibidos somente quando relevante
    ...(classId === 'samurai' ? [{
      groupId: 'samurai_class',
      label:   t.grp_class_specific,
      stats: filterStats([
        { key: 'spiritPullTargets',    label: t.spiritPullTargets,    value: stats.spiritPullTargets,    unit: '',  base: 0 },
        { key: 'explosiveBladeRadius', label: t.explosiveBladeRadius, value: stats.explosiveBladeRadius, unit: '%', base: 0 },
      ]),
    }] : []),
    ...(classId === 'hunter' ? [{
      groupId: 'hunter_class',
      label:   t.grp_class_specific,
      stats: filterStats([
        { key: 'hunterAbilityRadius', label: t.hunterAbilityRadius, value: stats.hunterAbilityRadius, unit: '%', base: 0 },
      ]),
    }] : []),
    ...(classId === 'ronin' ? [{
      groupId: 'ronin_class',
      label:   t.grp_class_specific,
      stats: filterStats([
        { key: 'aromaticoRadius',    label: t.aromaticoRadius,    value: stats.aromaticoRadius,    unit: '%', base: 0 },
        { key: 'aromaticoDuration',  label: t.aromaticoDuration,  value: stats.aromaticoDuration,  unit: '%', base: 0 },
        { key: 'healingSpiritRadius',label: t.healingSpiritRadius,value: stats.healingSpiritRadius,unit: '%', base: 0 },
        { key: 'weakeningBurstRadius',label:t.weakeningBurstRadius,value:stats.weakeningBurstRadius,unit:'%', base: 0 },
      ]),
    }] : []),
    ...(classId === 'assassin' ? [{
      groupId: 'assassin_class',
      label:   t.grp_class_specific,
      stats: filterStats([
        { key: 'toxicVanishRadius', label: t.toxicVanishRadius, value: stats.toxicVanishRadius, unit: '%', base: 0 },
        { key: 'vanishDuration',    label: t.vanishDuration,    value: stats.vanishDuration,    unit: '%', base: 0 },
      ]),
    }] : []),
  ];

  // Remove grupos onde todos os stats estão em zero e não são "always show"
  return groups.filter(g => {
    const ALWAYS_SHOW = ['survival','resolve','leg'];
    if (ALWAYS_SHOW.includes(g.groupId)) return true;
    // Mostra se ao menos um stat tem valor > base
    return g.stats && g.stats.some(s => s.value !== s.base);
  });
}

/** Filtra stats que tem valor 0 (não alterados) para omissão nos grupos secundários. */
function filterStats(stats) {
  return stats; // Deixa todos — App.jsx decide qual destacar
}

// ─── LABELS PT/EN ─────────────────────────────────────────────

const LABELS_PT = {
  grp_survival:       'Vida & Sobrevivência',
  grp_resolve:        'Determinação',
  grp_leg:            'Slots Magistrais',
  grp_melee:          'Dano',
  grp_ranged:         'Longo Alcance',
  grp_special:        'Dano Especial',
  grp_cooldowns:      'Recargas',
  grp_stealth:        'Furtividade',
  grp_class_specific: 'Habilidades de Classe',
  maxHP:              'Vida Máxima',
  damageReduction:    'Redução de Dano',
  reviveHP:           'Ressurreição Vital',
  offeringHP:         'Oferenda Fantasma Vital',
  healingReceived:    'Aumento de Cura',
  maxResolve:         'Determinação Máxima',
  resolveGain:        'Ganho de Determinação',
  resolveFromMelee:   'Ganho Det. C/C',
  resolveFromRanged:  'Ganho Det. Distância',
  resolveFromInjury:  'Ganho Det. Ferido',
  legSlots:           'Slots Magistrais',
  meleeDamage:        'Dano Corpo a Corpo',
  meleeStaggerDamage: 'Dano Atordoante C/C',
  parryWindow:        'Janela de Aparo Perfeito',
  counterDamage:      'Dano de Contra-Ataque',
  stealthDamage:      'Dano de Ataque Furtivo',
  assassinDamage:     'Dano de Assassinato',
  assassinOnStagger:  'Bônus Assassinato em Atordoados',
  assassinFromAbove:  'Dano Assassinato de Cima',
  rangedDamage:       'Dano a Distância',
  headshotDamage:     'Dano Tiro na Cabeça',
  headshotDmgClose:   'Dano Tiro na Cabeça (< 12m)',
  drawSpeed:          'Velocidade de Tensão',
  reloadSpeed:        'Velocidade de Recarga',
  projectileSpeed:    'Celeridade dos Projéteis',
  ghostWeaponDamage:  'Dano de Arma Fantasma',
  ultimateDamage:     'Dano Supremo',
  fireDamage:         'Dano de Fogo',
  statusDamage:       'Dano de Efeito Colateral',
  statusDuration:     'Duração de Efeito Colateral',
  oniDamage:          'Dano contra Oni',
  staggeredDamage:    'Dano contra Atordoados',
  blastRadius:        'Raio de Explosão',
  stealth:            'Furtividade',
  abilityCDR:         'Red. Recarga Habilidade',
  spiritPullTargets:   'Alvos Extração Espiritual',
  explosiveBladeRadius:'Raio da Lâmina Explosiva',
  hunterAbilityRadius: 'Raio Habilidades Caçador',
  aromaticoRadius:     'Raio do Aroma Curativo',
  aromaticoDuration:   'Duração do Aroma Curativo',
  healingSpiritRadius: 'Raio do Espírito Curativo',
  weakeningBurstRadius:'Raio da Rajada Debilitante',
  toxicVanishRadius:   'Raio do Sumiço Tóxico',
  vanishDuration:      'Duração do Sumiço',
};

const LABELS_EN = {
  grp_survival:       'Survival',
  grp_resolve:        'Resolve',
  grp_leg:            'Legendary Slots',
  grp_melee:          'Damage',
  grp_ranged:         'Ranged',
  grp_special:        'Special Damage',
  grp_cooldowns:      'Cooldowns',
  grp_stealth:        'Stealth',
  grp_class_specific: 'Class Abilities',
  maxHP:              'Max HP',
  damageReduction:    'Damage Reduction',
  reviveHP:           'Revive Health',
  offeringHP:         'Ghost Offering Health',
  healingReceived:    'Healing Increase',
  maxResolve:         'Max Resolve',
  resolveGain:        'Resolve Gain',
  resolveFromMelee:   'Melee Resolve Gain',
  resolveFromRanged:  'Ranged Resolve Gain',
  resolveFromInjury:  'Injured Resolve Gain',
  legSlots:           'Legendary Slots',
  meleeDamage:        'Melee Damage',
  meleeStaggerDamage: 'Melee Stagger Damage',
  parryWindow:        'Perfect Parry Window',
  counterDamage:      'Counter Damage',
  stealthDamage:      'Stealth Attack Damage',
  assassinDamage:     'Assassination Damage',
  assassinOnStagger:  'Assassination Bonus vs Staggered',
  assassinFromAbove:  'Assassinate from Above',
  rangedDamage:       'Ranged Damage',
  headshotDamage:     'Headshot Damage',
  headshotDmgClose:   'Headshot Damage (< 12m)',
  drawSpeed:          'Draw Speed',
  reloadSpeed:        'Reload Speed',
  projectileSpeed:    'Projectile Speed',
  ghostWeaponDamage:  'Ghost Weapon Damage',
  ultimateDamage:     'Ultimate Damage',
  fireDamage:         'Fire Damage',
  statusDamage:       'Status Effect Damage',
  statusDuration:     'Status Effect Duration',
  oniDamage:          'Oni Damage',
  staggeredDamage:    'Damage vs Staggered',
  blastRadius:        'Blast Radius',
  stealth:            'Stealth',
  abilityCDR:         'Ability Cooldown Reduction',
  spiritPullTargets:  'Spirit Pull Targets',
  explosiveBladeRadius:'Explosive Blade Radius',
  hunterAbilityRadius: 'Hunter Ability Radius',
  aromaticoRadius:     'Healing Incense Radius',
  aromaticoDuration:   'Healing Incense Duration',
  healingSpiritRadius: 'Healing Spirit Radius',
  weakeningBurstRadius:'Weakening Burst Radius',
  toxicVanishRadius:   'Toxic Vanish Radius',
  vanishDuration:      'Vanish Duration',
};

export { LABELS_PT, LABELS_EN };

// ─── UTILITÁRIOS ─────────────────────────────────────────────

function round2(v) {
  return Math.round(v * 10000) / 10000;   // 4 casas para evitar float noise; App.jsx formata
}

function roundCd(v) {
  return Math.round(v * 10) / 10;         // 1 decimal para segundos
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange(mn, mx, unit) {
  if (unit === 'pts' || unit === 's') {
    // Valor inteiro no range
    const steps = Math.round(mx - mn);
    return mn + Math.floor(Math.random() * (steps + 1));
  }
  // Float: sorteia entre min e max em incrementos de 0.01
  const steps = Math.round((mx - mn) / 0.01);
  return Math.round((mn + Math.floor(Math.random() * (steps + 1)) * 0.01) * 1000) / 1000;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── FORMATAÇÃO PARA DISPLAY ──────────────────────────────────

/**
 * Formata um valor de stat para exibição na UI.
 * @param {number} value
 * @param {string} unit  '%' | 'pts' | 's' | '★' | ''
 * @param {string} sk    stat key (para casos especiais)
 * @returns {string}
 */
export function formatStatValue(value, unit, sk) {
  if (unit === '★') {
    return '★'.repeat(value);
  }
  if (unit === '%') {
    const pct = Math.round(value * 10000) / 100; // ex: 0.12 → 12
    return `${pct > 0 ? '+' : ''}${pct}%`;
  }
  if (unit === 'pts' || unit === 's') {
    return value > 0 ? `+${value}${unit}` : `${value}${unit}`;
  }
  return String(value);
}

/**
 * Retorna true se o stat está em um valor diferente do base
 * (para highlight na UI).
 */
export function isStatChanged(statEntry) {
  return statEntry.value !== statEntry.base;
}

/**
 * Formata os segundos de cooldown.
 * @param {number} cd
 * @returns {string}  ex: "32.4s"
 */
export function formatCd(cd) {
  if (cd == null) return '—';
  return `${cd}s`;
}

/**
 * Formata o range de uma prop para exibição no dropdown.
 * @param {Object} prop  { mn, mx, u }
 * @returns {string}  ex: "5–12%"
 */
export function formatPropRange(prop) {
  if (!prop) return '';
  const mn = prop.u === '%' ? Math.round(prop.mn * 100) : prop.mn;
  const mx = prop.u === '%' ? Math.round(prop.mx * 100) : prop.mx;
  return `${mn}–${mx}${prop.u}`;
}

/**
 * Formata o valor atual de uma prop para exibição no input.
 * @param {number} value  decimal (ex: 0.12)
 * @param {string} unit   '%' | 'pts' | 's'
 * @returns {number}  para exibição (ex: 12 para 0.12 com %)
 */
export function propValueForDisplay(value, unit) {
  if (unit === '%') return Math.round(value * 100);
  return value;
}

/**
 * Converte o valor do input de volta para a unidade interna.
 * @param {number} displayValue
 * @param {string} unit
 * @returns {number}
 */
export function propValueFromDisplay(displayValue, unit) {
  if (unit === '%') return displayValue / 100;
  return displayValue;
}

/**
 * Retorna o step de incremento para uma prop (para botões ▲▼).
 * @param {Object} prop
 * @returns {number}
 */
export function propStep(prop) {
  if (!prop) return 1;
  if (prop.u === '%') return 0.01;  // 1% de cada vez
  return 1;                          // pts/s: 1 de cada vez
}
