// ============================================================
// icons.js — GoT Legends Build Planner
// Mapeamento de IDs de itens/técnicas → caminhos de ícones SVG
// Todos os arquivos devem estar em public/icons/
// ============================================================

// ─── BASE PATH ────────────────────────────────────────────────
const G  = '/icons/gear/'         // gear (katanas, arcos, amuletos)
const GW = '/icons/ghost_weapons/' // ghost weapons
const T  = '/icons/techniques/'   // técnicas e habilidades
const CL = '/icons/class/'        // classes

// ─── ÍCONES DE GEAR POR ITEM ID ──────────────────────────────
export const GEAR_ICON = {
  // Katanas normais
  katana_petrea:          G + 'stone-katana.svg',
  katana_aquatica:        G + 'water-katana.svg',
  katana_eolica:          G + 'wind-katana.svg',
  katana_lunar:           G + 'moon-katana.svg',
  // Katanas magistrais
  mao_yoshitsune:         G + 'yoshitsunes-hand-katana.svg',
  ira_sarugami:           G + 'wrath-of-sarugami-katana.svg',
  lamina_masamune:        G + 'masamunes-edge-katana.svg',
  katana_mestre:          G + 'masters-katana.svg',
  fustigador_pedra:       G + 'stone-striker-katana.svg',
  ceifador_demonios:      G + 'demon-cutter-katana.svg',
  // Longo alcance normais
  arco_curto:             null,   // shortbow — sem ícone disponível
  arco_longo:             G + 'long-bow.svg',
  zarabatana:             G + 'blowgun.svg',
  pacote_bombas:          G + 'bomb-pack.svg',
  // Longo alcance magistrais
  espirito_imponderavel:  G + 'the-weightless-spirit-bow.svg',
  visao_sugaru:           G + 'sugarus-sight-bow.svg',
  arco_ricocheteador:     G + 'skipping-stone-bow.svg',
  picada_celestial:       G + 'heavens-sting-blowgun.svg',
  remedio_proibido:       G + 'forbidden-medicine.svg',
  // Armas Fantasma GW1 normais
  arremesso_terra:        GW + 'gw_dirt_throw.svg',
  bomba_aderente:         GW + 'gw_sticky_bomb.svg',
  kunai:                  GW + 'gw_kunai.svg',
  bomba_magma:            GW + 'gw_magma_bomb.svg',
  surpresa_lady_sanjo:    GW + 'gw_lady_sanjos_surprise.svg',
  // Armas Fantasma GW2 normais
  bomba_fumaca:           GW + 'gw_smoke_bomb.svg',
  cabaca_curativa:        GW + 'gw_healing_gourd.svg',
  estrepes:               GW + 'gw_caltrops.svg',
  kunai_espiritual:       GW + 'gw_spirit_kunai.svg',
  toque_ceu:              GW + 'gw_the_touch_of_heaven.svg',
  // Armas Fantasma magistrais
  nevoa_yagata:           GW + 'gw_the_mist_of_yagata.svg',
  sementes_demoniacas:    GW + 'gw_demon_seeds.svg',
  sake_kenji:             GW + 'gw_kenjis_shared_brew.svg',
  garrafa_coragem:        GW + 'gw_bottle_of_liquid_courage.svg',
  // Amuletos normais (IDs prováveis — confirme em data.js)
  amuleto_samurai:        G + 'samurai-charm.svg',
  amuleto_hunter:         G + 'hunter-charm.svg',
  amuleto_ronin:          G + 'ronin-charm.svg',
  amuleto_assassin:       G + 'assassin-charm.svg',
  amuleto_cc:             G + 'melee-charm.svg',
  amuleto_dist:           G + 'ranged-charm.svg',
  amuleto_def:            G + 'defense-charm.svg',
  amuleto_furt:           G + 'stealth-charm.svg',
  amuleto_uti:            G + 'utility-charm.svg',
  // Amuletos magistrais
  ultimo_suspiro:         G + 'last-breath-charm.svg',
  sermao_celestial:       G + 'heavenly-rebuke-charm.svg',
  ritmo_revigorante:      G + 'restorative-rhythm-charm.svg',
  benkei_ultimo:          G + 'benkeis-last-stand-charm.svg',
  remorso_enjo:           G + 'enjos-remorse-charm.svg',
  olhar_sarugami:         G + 'sarugamis-glare-charm.svg',
  fortitude_shogun:       G + 'shoguns-fortitude-charm.svg',
  ferro_sagrado:          G + 'sacred-iron-charm.svg',
  // ⚠️ Se encontrar IDs faltando, adicione aqui:
  // 'id_do_item': G + 'nome-do-arquivo.svg',
}

// ─── ÍCONES DE TÉCNICAS / HABILIDADES POR ID ─────────────────
export const TECH_ICON = {
  // Habilidades — Samurai
  extracao_espiritual:    null,
  lamina_explosiva:       T + 'explosive-blade-selected.svg',
  chama_furiosa:          T + 'raging-flame-selected.svg',
  // Técnicas — Samurai
  refl_relamp:            T + 'lightning-reflexes-selected.svg',
  def_critica:            T + 'critical-defense-selected.svg',
  maior_det_s:            T + 'resolve-increase-selected.svg',
  golpe_cur:              T + 'healing-strike-selected.svg',
  golpe_cel_s:            T + 'heavenly-strike-selected.svg',
  frenesi_hach:           T + 'hachimans-frenzy-selected.svg',
  furia_hach_t3:          T + 'hachimans-rage-selected.svg',
  leg_sam_i:              T + 'legendary-selected.svg',
  leg_sam_iii:            T + 'legendary-selected.svg',
  // Habilidades — Hunter
  flecha_atordoante:      T + 'staggering-arrow-selected.svg',
  flecha_explosiva:       T + 'explosive-arrow-selected.svg',
  arqueiro_esp:           T + 'spirit-archer-selected.svg',
  // Técnicas — Hunter
  reabastec:              T + 'resupply-selected.svg',
  dano_colat:             T + 'status-damage-selected.svg',
  flecha_perf:            T + 'piercing-arrow-selected.svg',
  arco_espada:            T + 'bow-and-blade-selected.svg',
  id_precisa:             T + 'pinpoint-selected.svg',
  olho_tv:                T + 'all-seeing-eye-selected.svg',
  olhar_ard:              T + 'burning-gaze-selected.svg',
  leg_hun_i:              T + 'legendary-selected.svg',
  leg_hun_iii:            T + 'legendary-selected.svg',
  // Habilidades — Ronin
  animal_espiritual:      T + 'spirit-animal-selected.svg',
  aroma_curativo:         T + 'healing-incense-selected.svg',
  brado_ardente:          T + 'flaming-roar-selected.svg',
  // Técnicas — Ronin
  raj_debil:              T + 'staggering-imposition-selected.svg',
  imp_atord:              T + 'staggering-imposition-selected.svg',
  maior_det_r:            T + 'resolve-increase-selected.svg',
  regen_rapida:           T + 'quick-regen-selected.svg',
  curar_todos:            T + 'cure-all-selected.svg',
  sopro_recon:            T + 'soothing-breath-selected.svg',
  sopro_fogo:             T + 'fire-breath-selected.svg',
  sopro_atord:            T + 'staggering-breath-selected.svg',
  leg_ron_i:              T + 'legendary-selected.svg',
  leg_ron_iii:            T + 'legendary-selected.svg',
  // Habilidades — Assassino (adicione os IDs corretos)
  // sumica_toxico:       T + 'toxic-vanish-selected.svg',
  leg_ass_i:              T + 'legendary-selected.svg',
  leg_ass_iii:            T + 'legendary-selected.svg',
  // ⚠️ Adicione mais mapeamentos conforme necessário
}

// ─── ÍCONES DE CLASSE ─────────────────────────────────────────
export const CLASS_ICON = {
  samurai:  CL + 'class_samurai.svg',
  hunter:   CL + 'class_hunter.svg',
  ronin:    CL + 'class_ronin.svg',
  assassin: CL + 'class_assassin.svg',
}

// ─── FALLBACK POR CLASSE (para técnicas sem ícone mapeado) ───
export const CLASS_TECH_FALLBACK = {
  samurai:  T + 'samurai-tech-selected.svg',
  hunter:   T + 'hunter-tech-selected.svg',
  ronin:    T + 'ronin-tech-selected.svg',
  assassin: T + 'assassin-tech-selected.svg',
}

// ─── LOGO ─────────────────────────────────────────────────────
export const LOGO_URL = '/icons/logo/tsushima_logo.svg'

// ─── HELPER — retorna URL do ícone de um item ────────────────
export function getGearIconUrl(item) {
  if (!item) return null
  return GEAR_ICON[item.id] ?? null
}

// ─── HELPER — retorna URL do ícone de uma técnica/habilidade ─
export function getTechIconUrl(techId, classId) {
  if (!techId) return null
  return TECH_ICON[techId] ?? CLASS_TECH_FALLBACK[classId] ?? null
}