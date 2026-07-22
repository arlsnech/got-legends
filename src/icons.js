// ============================================================
// icons.js — GoT Legends Build Planner
// Mapeamento de IDs de itens/técnicas → caminhos de ícones
// Todos os arquivos devem estar em public/icons/
// ============================================================

// ─── BASE PATHS ───────────────────────────────────────────────
const G  = '/icons/gear/'          // gear: katanas, arcos, amuletos
const GW = '/icons/ghost_weapons/' // ghost weapons
const T  = '/icons/techniques/'    // técnicas e habilidades (PNG)
const CL = '/icons/class/'         // classes (SVG)

// ─── ÍCONES DE GEAR POR ITEM ID ───────────────────────────────
// ATENÇÃO: as chaves DEVEM ser os IDs exatos dos itens em data.js
// Se algum ícone não aparecer, abra o console do navegador e verifique
// qual `item.id` está sendo passado para `getGearIconUrl`.
export const GEAR_ICON = {
  // ── Katanas normais
  katana_petrea:         G + 'stone-katana.svg',
  katana_aquatica:       G + 'water-katana.svg',
  katana_eolica:         G + 'wind-katana.svg',
  katana_lunar:          G + 'moon-katana.svg',

  // ── Katanas magistrais
  mao_yoshitsune:        G + 'yoshitsunes-hand-katana.svg',
  ira_sarugami:          G + 'wrath-of-sarugami-katana.svg',
  lamina_masamune:       G + 'masamunes-edge-katana.svg',
  katana_mestre:         G + 'masters-katana.svg',
  fustigador_pedra:      G + 'stone-striker-katana.svg',
  ceifador_demonios:     G + 'demon-cutter-katana.svg',

  // ── Longo alcance normais
  arco_curto:            G + 'shortbow.svg',   // renomeie o arquivo para shortbow.svg
  arco_longo:            G + 'long-bow.svg',
  zarabatana:            G + 'blowgun.svg',
  pacote_bombas:         G + 'bomb-pack.svg',

  // ── Longo alcance magistrais
  espirito_imponderavel: G + 'the-weightless-spirit-bow.svg',
  visao_sugaru:          G + 'sugarus-sight-bow.svg',
  arco_ricocheteador:    G + 'skipping-stone-bow.svg',
  picada_celestial:      G + 'heavens-sting-blowgun.svg',
  remedio_proibido:      G + 'forbidden-medicine.svg',

  // ── Armas Fantasma I (normais)
  arremesso_terra:       GW + 'gw_dirt_throw.svg',
  bomba_aderente:        GW + 'gw_sticky_bomb.svg',
  kunai:                 GW + 'gw_kunai.svg',

  // ── Armas Fantasma II (normais)
  bomba_fumaca:          GW + 'gw_smoke_bomb.svg',
  cabaca_curativa:       GW + 'gw_healing_gourd.svg',
  estrepes:              GW + 'gw_caltrops.svg',

  // ── Armas Fantasma I magistrais
  surpresa_sra_sanjo:    GW + 'gw_lady_sanjos_surprise.svg',
  bomba_magma:           GW + 'gw_magma_bomb.svg',
  toque_ceus:            GW + 'gw_the_touch_of_heaven.svg',
  kunai_espiritual:      GW + 'gw_spirit_kunai.svg',

  // ── Armas Fantasma II magistrais
  nevoa_yagata:          GW + 'gw_the_mist_of_yagata.svg',
  sementes_demoniacas:   GW + 'gw_demon_seeds.svg',
  sake_kenji:            GW + 'gw_kenjis_shared_brew.svg',
  garrafa_coragem:       GW + 'gw_bottle_of_liquid_courage.svg',

  // ── Amuletos normais de classe
  amuleto_samurai:       G + 'samurai-charm.svg',
  amuleto_cacador:       G + 'hunter-charm.svg',
  amuleto_ronin:         G + 'ronin-charm.svg',
  amuleto_assassino:     G + 'assassin-charm.svg',

  // ── Amuletos normais genéricos
  amuleto_cc:            G + 'melee-charm.svg',
  amuleto_dist:          G + 'ranged-charm.svg',
  amuleto_defesa:        G + 'defense-charm.svg',
  amuleto_furt:          G + 'stealth-charm.svg',
  amuleto_util:          G + 'utility-charm.svg',

  // ── Amuletos magistrais
  ultimo_suspiro:        G + 'last-breath-charm.svg',
  sermao_celestial:      G + 'heavenly-rebuke-charm.svg',
  ritmo_revigorante:     G + 'restorative-rhythm-charm.svg',
  ult_confronto_benkei:  G + 'benkeis-last-stand-charm.svg',
  remorso_enjo:          G + 'enjos-remorse-charm.svg',
  olhar_sarugami:        G + 'sarugamis-glare-charm.svg',
  bravura_xogum:         G + 'shoguns-fortitude-charm.svg',
  ferro_sagrado:         G + 'sacred-iron-charm.svg',

  // ⚠️  Se algum ícone não aparecer, adicione o ID correto aqui:
  //    Abra o console do navegador → no componente GearSlotCard, adicione
  //    console.log(item?.id) para ver o ID real do item selecionado.
  // 'id_real_do_item': G + 'nome-do-arquivo.svg',
}

// ─── ÍCONES DE TÉCNICAS / HABILIDADES (PNG) ───────────────────
// Coloque os arquivos PNG em public/icons/techniques/
// Use os mesmos nomes base dos SVGs mas com extensão .png
export const TECH_ICON = {
  // ── Habilidades — Samurai
  extracao_espiritual:    T + 'spirit-pull-selected.png',
  lamina_explosiva:       T + 'explosive-blade-selected.png',
  chama_furiosa:          T + 'raging-flame-selected.png',

  // ── Técnicas — Samurai
  defensor:               T + 'defender-selected.png',
  golpes_prof:            T + 'deep-strikes-selected.png',
  sam_liberto:            T + 'samurai-unleashed-selected.png',
  leg_sam_i:              T + 'legendary-selected.png',

  refl_relamp:            T + 'lightning-reflexes-selected.png',
  def_critica:            T + 'critical-defense-selected.png',
  maior_det_s:            T + 'resolve-increase-selected.png',
  golpe_cur:              T + 'healing-strike-selected.png',

  golpe_cel_s:            T + 'heavenly-strike-selected.png',
  frenesi_hach:           T + 'hachimans-frenzy-selected.png',
  furia_hach_t3:          T + 'hachimans-rage-selected.png',
  leg_sam_iii:            T + 'legendary-selected.png',

  // ── Habilidades — Hunter
  flecha_atordoante:      T + 'staggering-arrow-selected.png',
  flecha_explosiva:       T + 'explosive-arrow-selected.png',
  arqueiro_esp:           T + 'spirit-archer-selected.png',

  // ── Técnicas — Hunter
  carrasco:               T + 'executioner-selected.png',
  cheiro_sang:            T + 'scent-of-blood-selected.png',
  cac_liberto:            T + 'hunter-unleashed-selected.png',
  leg_hun_i:              T + 'legendary-selected.png',

  reabastec:              T + 'resupply-selected.png',
  dano_colat:             T + 'status-damage-selected.png',
  flecha_perf:            T + 'piercing-arrow-selected.png',
  arco_espada:            T + 'bow-and-blade-selected.png',

  id_precisa:             T + 'pinpoint-selected.png',
  olho_tv:                T + 'all-seeing-eye-selected.png',
  olhar_ard:              T + 'burning-gaze-selected.png',
  leg_hun_iii:            T + 'legendary-selected.png',

  // ── Habilidades — Ronin
  animal_espiritual:      T + 'spirit-animal-selected.png',
  aroma_curativo:         T + 'healing-incense-selected.png',
  brado_ardente:          T + 'flaming-roar-selected.png',

  // ── Técnicas — Ronin
  af_melhores:            T + 'enhanced-ghost-weapons-selected.png',
  raj_debil:              T + 'weakening-burst-selected.png',
  ron_liberto:            T + 'ronin-unleashed-selected.png',
  leg_ron_i:              T + 'legendary-selected.png',

  imp_atord:              T + 'staggering-imposition-selected.png',
  maior_det_r:            T + 'resolve-increase-selected.png',
  regen_rapida:           T + 'quick-regen-selected.png',
  curar_todos:            T + 'cure-all-selected.png',

  sopro_recon:            T + 'soothing-breath-selected.png',
  sopro_fogo:             T + 'fire-breath-selected.png',
  sopro_atord:            T + 'staggering-breath-selected.png',
  leg_ron_iii:            T + 'legendary-selected.png',

  // ── Habilidades — Assassino
  sumico_toxico:          T + 'toxic-vanish-selected.png',
  sumico_grupo:           T + 'group-vanish-selected.png',
  sumico_revital:         T + 'refreshing-vanish-selected.png',

  // ── Técnicas — Assassino
  acerto_crit:            T + 'critical-hit-selected.png',
  supergolpe:             T + 'super-strike-selected.png',
  ass_liberto:            T + 'assassin-unleashed-selected.png',
  leg_ass_i:              T + 'legendary-selected.png',

  pisada_leve:            T + 'lightning-reflexes-selected.png',
  oportunista:            T + 'opportunist-selected.png',
  maos_habil:             T + 'deft-hands-selected.png',
  beladona:               T + 'deadly-nightshade-selected.png',

  temp_sombria:           T + 'shadow-storm-selected.png',
  sumico_cadeia:          T + 'chain-vanish-selected.png',
  leg_ass_iii:            T + 'legendary-selected.png',
  ofuscado:               T + 'overshadowed-selected.png',
}

// ─── ÍCONES DE CLASSE (SVG) ───────────────────────────────────
export const CLASS_ICON = {
  samurai:  CL + 'class_samurai.svg',
  hunter:   CL + 'class_hunter.svg',
  ronin:    CL + 'class_ronin.svg',
  assassin: CL + 'class_assassin.svg',
}

// ─── FALLBACK DE CLASSE para técnicas sem ícone mapeado ───────
export const CLASS_TECH_FALLBACK = {
  samurai:  T + 'samurai-tech-selected.png',
  hunter:   T + 'hunter-tech-selected.png',
  ronin:    T + 'ronin-tech-selected.png',
  assassin: T + 'assassin-tech-selected.png',
}

// ─── LOGO ─────────────────────────────────────────────────────
// Se tiver PNG: '/icons/logo/tsushima_logo.png'
// Se tiver SVG: '/icons/logo/tsushima_logo.svg'
export const LOGO_URL = '/icons/logo/tsushima_logo.png'

// ─── HELPERS ──────────────────────────────────────────────────
export function getGearIconUrl(item) {
  if (!item?.id) return null
  const url = GEAR_ICON[item.id]
  // undefined → não mapeado (silencioso)
  // null → explicitamente sem ícone
  return url ?? null
}

export function getTechIconUrl(techId, classId) {
  if (!techId) return null
  const url = TECH_ICON[techId]
  if (url !== undefined) return url ?? null
  // Fallback para ícone de classe quando técnica não tem ícone específico
  return CLASS_TECH_FALLBACK[classId] ?? null
}
