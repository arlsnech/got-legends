// ============================================================
// data.js — GoT Legends Build Planner
// Fonte primária: Planilha PT-BR do usuário
// Referência: Community Data Sheet EN (DoctorKoolman et al.)
// Magistrais: 100% explícitos — zero herança ("inherit")
// ============================================================

// ─── CLASSES ────────────────────────────────────────────────
export const CLASSES = [
  {
    id: "samurai",
    nPT: "Samurai", nEN: "Samurai",
    col: "#C0392B",
    hp: 100, res: 3,
    ult: {
      id: "furia_de_hachiman",
      nPT: "Fúria de Hachiman", nEN: "Hachiman's Fury",
      cost: 3, strikes: 3,
      dPT: "Executa uma série de golpes extremamente ágeis contra um grupo de inimigos. Custa 3 Determinação.",
      dEN: "Perform a series of lightning-fast strikes against a group of enemies. Costs 3 Resolve."
    },
    abilities: [
      { id: "extracao_espiritual", nPT: "Extração Espiritual", nEN: "Spirit Pull",   cd: 36,
        dPT: "Enquanto ativa, drena vida de um inimigo próximo.",
        dEN: "While active, Spirit Pull passively siphons health from 1 nearby enemy." },
      { id: "lamina_explosiva",    nPT: "Lâmina Explosiva",   nEN: "Explosive Blade", cd: 36,
        dPT: "Ataques corpo a corpo causam dano com explosões ao acertar.",
        dEN: "Melee attacks deal damaging explosions on impact." },
      { id: "chama_furiosa",       nPT: "Chama Furiosa",      nEN: "Raging Flame",    cd: 36,
        dPT: "Ataques pesados com esta lâmina ardente podem incendiar inimigos próximos.",
        dEN: "Heavy attacks with this burning blade can also ignite nearby enemies." }
    ],
    techs: [
      // Tier I
      { id:"defensor",     tier:"I",  nPT:"Defensor",              nEN:"Defender",          rank:2,    sp:false, fx:[{s:"maxHP",v:25,t:"flat"}],
        dPT:"Aumenta a vida base em 25.", dEN:"Increases base health by 25." },
      { id:"golpes_prof",  tier:"I",  nPT:"Golpes Profundos",      nEN:"Deep Strikes",      rank:7,    sp:false, fx:[{s:"meleeDamage",v:0.25,t:"add"}],
        dPT:"Aumenta o dano corpo a corpo em 25%.", dEN:"Increases Melee damage by 25%." },
      { id:"sam_liberto",  tier:"I",  nPT:"Samurai Liberto",       nEN:"Samurai Unleashed", rank:14,   sp:false, fx:[{s:"abilityCDR",v:0.15,t:"add"}],
        dPT:"Reduz a recarga da habilidade de classe em 15%.", dEN:"Decrease class ability cooldown by 15%." },
      { id:"leg_sam_i",    tier:"I",  nPT:"Magistral",             nEN:"Legendary",         rank:null, sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      // Tier II
      { id:"refl_relamp",  tier:"II", nPT:"Reflexos Relâmpago",   nEN:"Lightning Reflexes", rank:3,    sp:true,  fx:[],
        dPT:"Apare flechas enquanto estiver bloqueando.", dEN:"Parry incoming arrows while blocking." },
      { id:"def_critica",  tier:"II", nPT:"Defesa Crítica",        nEN:"Critical Defense",  rank:9,    sp:true,  fx:[],
        dPT:"Tempo adicional para aparar e esquivar quando estiver com pouca vida.",
        dEN:"Increased parry and dodge window when at low health." },
      { id:"maior_det_s",  tier:"II", nPT:"Maior Determinação",   nEN:"Resolve Increase",  rank:16,   sp:false, fx:[{s:"maxResolve",v:1,t:"flat"}],
        dPT:"Aumenta a Determinação máxima em 1.", dEN:"Increase max Resolve by 1." },
      { id:"golpe_cur",    tier:"II", nPT:"Golpe Curativo",        nEN:"Healing Strike",    rank:null, sp:true,  fx:[],
        dPT:"Matar um inimigo com Aparo Perfeito restaura 50 de vida.",
        dEN:"Killing an enemy with a Perfect Parry counterattack restores 50 health." },
      // Tier III
      { id:"golpe_cel_s",  tier:"III",nPT:"Golpe Celestial",       nEN:"Heavenly Strike",   rank:5,    sp:true,  fx:[],
        dPT:"Golpe rápido não bloqueável. O+△ para ativar. Custa 1 Determinação.",
        dEN:"Perform an unblockable quick strike. O+△ to activate. Costs 1 Resolve." },
      { id:"frenesi_hach", tier:"III",nPT:"Frenesi de Hachiman",   nEN:"Hachiman's Frenzy", rank:11,   sp:false, fx:[{s:"ultStrikeBonus",v:2,t:"flat"}],
        dPT:"A Fúria de Hachiman ganha 2 golpes adicionais.", dEN:"Hachiman's Fury gains 2 extra strikes." },
      { id:"leg_sam_iii",  tier:"III",nPT:"Magistral",             nEN:"Legendary",         rank:18,   sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"furia_hach_t3",tier:"III",nPT:"Fúria de Hachiman (300%)",nEN:"Hachiman's Rage", rank:null, sp:false, fx:[{s:"ultMode",v:"rage300"}],
        dPT:"A Fúria de Hachiman executa 2 golpes, cada um causando 300% de dano.",
        dEN:"Hachiman's Fury does 2 strikes for 300% damage each." }
    ]
  },
  {
    id: "hunter",
    nPT: "Caçadora", nEN: "Hunter",
    col: "#2475AD",
    hp: 100, res: 3,
    ult: {
      id: "olho_de_uchitsune",
      nPT: "Olho de Uchitsune", nEN: "Eye of Uchitsune",
      cost: 3, targets: 3,
      dPT: "Mira em 3 inimigos e acerta um disparo na cabeça garantido em cada alvo. Custa 3 Determinação.",
      dEN: "Target 3 enemies and fire a guaranteed headshot at each target. Costs 3 Resolve."
    },
    abilities: [
      { id: "flecha_atordoante", nPT: "Flecha Atordoante", nEN: "Staggering Arrow", cd: 42,
        dPT: "Atira uma flecha que atordoa inimigos em pequena área.",
        dEN: "Fire an arrow that stuns enemies in a small area." },
      { id: "flecha_explosiva",  nPT: "Flecha Explosiva",  nEN: "Explosive Arrow",  cd: 55,
        dPT: "Atira uma flecha que explode depois de um ligeiro atraso.",
        dEN: "Fire an arrow that explodes after a short delay." },
      { id: "arqueiro_esp",      nPT: "Arqueiro Espiritual",nEN: "Spirit Archer",   cd: 42,
        dPT: "Invoca, por tempo limitado, um arqueiro fantasmagórico para lutar ao seu lado.",
        dEN: "Summon a ghostly archer to fight beside you for a limited time." }
    ],
    techs: [
      { id:"carrasco",    tier:"I",  nPT:"Carrasco",           nEN:"Executioner",   rank:2,    sp:false, fx:[{s:"headshotDmgClose",v:0.5,t:"add"}],
        dPT:"Aumenta o dano de tiro na cabeça em 50% em alvos dentro de 12 metros.",
        dEN:"Increase headshot damage by 50% for targets within 12 meters." },
      { id:"cheiro_sang", tier:"I",  nPT:"Cheiro de Sangue",   nEN:"Scent of Blood",rank:7,    sp:true,  fx:[],
        dPT:"Aumenta a velocidade de saque e recarga em 100% por 30s após tentar um assassinato.",
        dEN:"Increase draw and reload speed by 100% for 30s after attempting an assassination." },
      { id:"cac_liberto", tier:"I",  nPT:"Caçador Liberto",    nEN:"Hunter Unleashed",rank:14, sp:false, fx:[{s:"abilityCDR",v:0.15,t:"add"}],
        dPT:"Reduz a recarga da habilidade de classe em 15%.", dEN:"Decrease class ability cooldown by 15%." },
      { id:"leg_hun_i",   tier:"I",  nPT:"Magistral",          nEN:"Legendary",     rank:null, sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"reabastec",   tier:"II", nPT:"Reabastecimento",    nEN:"Resupply",      rank:3,    sp:true,  fx:[],
        dPT:"Recarrega 30% de todos os tipos de munição. X enquanto mira. Custa 1 Determinação.",
        dEN:"Refill 30% of all ammo types. X while aiming to activate. Costs 1 Resolve." },
      { id:"dano_colat",  tier:"II", nPT:"Dano Colateral",     nEN:"Status Damage", rank:9,    sp:false, fx:[{s:"statusDamage",v:0.25,t:"add"}],
        dPT:"Aumenta o dano de efeitos colaterais em 25%.", dEN:"Damage of status effects increased by 25%." },
      { id:"flecha_perf", tier:"II", nPT:"Flecha Perfurante",  nEN:"Piercing Arrow",rank:16,   sp:true,  fx:[],
        dPT:"Desbloqueia Flechas Perfurantes capazes de penetrar escudos.",
        dEN:"Unlock Piercing Arrows for your bow that can penetrate shields." },
      { id:"arco_espada", tier:"II", nPT:"Arco e Espada",      nEN:"Bow & Blade",   rank:null, sp:true,  fx:[],
        dPT:"Matar com flecha aumenta próximo ataque C/C em 100%, e vice-versa.",
        dEN:"Killing an enemy with an arrow makes your next sword attack deal 100% more damage, and vice versa." },
      { id:"id_precisa",  tier:"III",nPT:"Identificação Precisa",nEN:"Pinpoint",    rank:5,    sp:true,  fx:[],
        dPT:"Disparos no corpo com o arco têm uma chance de 50% de causar dano de tiro na cabeça.",
        dEN:"Body shots with the bow have a 50% chance to deal headshot damage." },
      { id:"olho_tv",     tier:"III",nPT:"Olho que Tudo Vê",   nEN:"All-Seeing Eye",rank:11,   sp:false, fx:[{s:"ultTargetBonus",v:2,t:"flat"}],
        dPT:"Olho de Uchitsune passa a alvejar mais 2 inimigos (total 5).",
        dEN:"Eye of Uchitsune can target 2 more enemies." },
      { id:"leg_hun_iii", tier:"III",nPT:"Magistral",          nEN:"Legendary",     rank:18,   sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"olhar_ard",   tier:"III",nPT:"Olhar Ardente",      nEN:"Burning Gaze",  rank:null, sp:false, fx:[{s:"fireDamage",v:0.15,t:"add"}],
        dPT:"Os disparos do Olho de Uchitsune ateiam fogo nos inimigos.",
        dEN:"Eye of Uchitsune shots set enemies on fire." }
    ]
  },
  {
    id: "ronin",
    nPT: "Ronin", nEN: "Ronin",
    col: "#8E44AD",
    hp: 100, res: 3,
    ult: {
      id: "sopro_de_izanami",
      nPT: "Sopro de Izanami", nEN: "Breath of Izanami",
      cost: 3, strikes: 1,
      dPT: "Revive todos os aliados incapacitados. Custa 3 Determinação.",
      dEN: "Revive all downed allies. Costs 3 Resolve."
    },
    abilities: [
      { id: "animal_espiritual", nPT: "Animal Espiritual", nEN: "Spirit Animal",    cd: 65,
        dPT: "Invoca um companheiro canino por um breve período.",
        dEN: "Summon a friendly dog companion for a short amount of time." },
      { id: "aroma_curativo",    nPT: "Aroma Curativo",   nEN: "Healing Incense",  cd: 42,
        dPT: "Aplica um pequeno frasco com aroma que cura aliados próximos.",
        dEN: "Deploy a small pot of incense that heals nearby allies." },
      { id: "brado_ardente",     nPT: "Brado Ardente",    nEN: "Flaming Roar",     cd: 42,
        dPT: "Libera uma bola de fogo e incendeia inimigos próximos.",
        dEN: "Unleash a ball of fire and ignite surrounding enemies." }
    ],
    techs: [
      { id:"af_melhores",  tier:"I",  nPT:"Armas Fantasma Melhoradas",nEN:"Enhanced Ghost Weapons",rank:2, sp:false, fx:[{s:"ghostWeaponDamage",v:0.5,t:"add"}],
        dPT:"Aumenta o dano de todas as Armas Fantasma em 50%.", dEN:"Increase damage from all Ghost Weapons by 50%." },
      { id:"raj_debil",    tier:"I",  nPT:"Rajada Debilitante", nEN:"Weakening Burst",rank:7,  sp:true,  fx:[],
        dPT:"Enfraquece inimigos: -25% dano causado, +25% dano sofrido. R1+X. Custa 1 Determinação.",
        dEN:"Weaken enemies so they deal 25% less damage and take 25% more damage. R1+X. Costs 1 Resolve." },
      { id:"ron_liberto",  tier:"I",  nPT:"Ronin Liberto",      nEN:"Ronin Unleashed",rank:14, sp:false, fx:[{s:"abilityCDR",v:0.15,t:"add"}],
        dPT:"Reduz a recarga da habilidade de classe em 15%.", dEN:"Decrease class ability cooldown by 15%." },
      { id:"leg_ron_i",    tier:"I",  nPT:"Magistral",          nEN:"Legendary",     rank:null,sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"imp_atord",    tier:"II", nPT:"Imposição Atordoante",nEN:"Staggering Imposition",rank:3,sp:false,fx:[{s:"meleeStaggerDamage",v:0.15,t:"add"}],
        dPT:"Aumenta o dano atordoante causado em 15%.", dEN:"Increases Stagger damage inflicted by 15%." },
      { id:"maior_det_r",  tier:"II", nPT:"Maior Determinação", nEN:"Resolve Increase",rank:9, sp:false, fx:[{s:"maxResolve",v:1,t:"flat"}],
        dPT:"Aumenta a Determinação máxima em 1.", dEN:"Increases max Resolve by 1." },
      { id:"regen_rapida", tier:"II", nPT:"Regeneração Rápida", nEN:"Quick Regen",   rank:16,  sp:false, fx:[{s:"healingReceived",v:0.5,t:"add"}],
        dPT:"Aumenta a cura recebida e regeneração de vida em 50%.", dEN:"Increase healing received and health regen by 50%." },
      { id:"curar_todos",  tier:"II", nPT:"Curar Todos",        nEN:"Cure All",      rank:null,sp:true,  fx:[],
        dPT:"Sempre que o Ronin é curado, 50% dessa cura também vai para os seus aliados.",
        dEN:"Any time the Ronin is healed, 50% goes to teammates as well." },
      { id:"sopro_recon",  tier:"III",nPT:"Sopro Reconfortante",nEN:"Soothing Breath",rank:5,  sp:true,  fx:[],
        dPT:"Sopro de Izanami aplica cura gradual a todos os jogadores por 8 segundos.",
        dEN:"Breath of Izanami also applies a heal over time on all players for 8 seconds." },
      { id:"sopro_fogo",   tier:"III",nPT:"Sopro De Fogo",      nEN:"Fire Breath",   rank:11,  sp:true,  fx:[],
        dPT:"Sopro de Izanami também incendeia os inimigos próximos a todos os jogadores.",
        dEN:"Breath of Izanami now also ignites enemies near all players." },
      { id:"leg_ron_iii",  tier:"III",nPT:"Magistral",          nEN:"Legendary",     rank:18,  sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"sopro_atord",  tier:"III",nPT:"Sopro Atordoante",   nEN:"Staggering Breath",rank:null,sp:true,fx:[],
        dPT:"Sopro de Izanami cria onda de choque poderosa que afasta todos os inimigos próximos e os enfraquece.",
        dEN:"Breath of Izanami creates a massive shockwave that knocks back all nearby enemies and weakens them." }
    ]
  },
  {
    id: "assassin",
    nPT: "Assassino", nEN: "Assassin",
    col: "#27AE60",
    hp: 100, res: 3,
    ult: {
      id: "golpe_sombrio",
      nPT: "Golpe Sombrio", nEN: "Shadow Strike",
      cost: 3, strikes: 3,
      dPT: "Entra nas sombras e ataca inimigos à distância. Custa 3 Determinação.",
      dEN: "Enter the shadows and strike enemies from a distance. Costs 3 Resolve."
    },
    abilities: [
      { id: "sumico_toxico",      nPT: "Sumiço Tóxico",      nEN: "Toxic Vanish",    cd: 62,
        dPT: "Some em uma nuvem de fumaça tóxica que causa dano atordoante a inimigos próximos.",
        dEN: "Vanish in a cloud of poison smoke that deals Stagger damage to nearby enemies." },
      { id: "sumico_grupo",       nPT: "Sumiço em Grupo",    nEN: "Group Vanish",    cd: 50,
        dPT: "Some juntamente com aliados próximos.",
        dEN: "Vanish along with nearby allies." },
      { id: "sumico_revital",     nPT: "Sumiço Revitalizante",nEN: "Refreshing Vanish",cd: 50,
        dPT: "Faz com que você suma em uma explosão de energia que cura você e todos os aliados próximos.",
        dEN: "Vanish in a burst of energy that heals you and nearby allies." }
    ],
    techs: [
      { id:"acerto_crit",  tier:"I",  nPT:"Acerto Crítico",    nEN:"Critical Hit",    rank:2,   sp:false, fx:[{s:"assassinDamage",v:0.3,t:"add"}],
        dPT:"Causa 30% a mais de dano durante assassinatos.", dEN:"Inflict 30% more damage during assassinations." },
      { id:"supergolpe",   tier:"I",  nPT:"Supergolpe",        nEN:"Super Strike",    rank:7,   sp:true,  fx:[],
        dPT:"Ataque furtivo que causa o dobro de dano normal. △ enquanto escondido. Custa 1 Determinação.",
        dEN:"Perform a stronger Stealth Attack dealing 2x normal damage. △ while hidden. Costs 1 Resolve." },
      { id:"ass_liberto",  tier:"I",  nPT:"Assassino Liberto", nEN:"Assassin Unleashed",rank:14, sp:false, fx:[{s:"abilityCDR",v:0.15,t:"add"}],
        dPT:"Reduz a recarga da habilidade de classe em 15%.", dEN:"Decrease class ability cooldown by 15%." },
      { id:"leg_ass_i",    tier:"I",  nPT:"Magistral",         nEN:"Legendary",       rank:null,sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"pisada_leve",  tier:"II", nPT:"Pisada Leve",       nEN:"Light Step",      rank:3,   sp:true,  fx:[],
        dPT:"Você corre silenciosamente.", dEN:"You are silent when running." },
      { id:"oportunista",  tier:"II", nPT:"Oportunista",       nEN:"Opportunist",     rank:9,   sp:false, fx:[{s:"assassinOnStagger",v:0.5,t:"add"}],
        dPT:"Causa 50% de dano bônus de assassinato a inimigos atordoados.",
        dEN:"Deals 50% bonus assassination damage to Staggered enemies." },
      { id:"maos_habil",   tier:"II", nPT:"Mãos Habilidosas",  nEN:"Deft Hands",      rank:16,  sp:false, fx:[{s:"gwCDRonAssassin",v:3,t:"flat"}],
        dPT:"Golpes Críticos e Assassinatos reduzem recargas das Armas Fantasmas em 3s.",
        dEN:"Assassination & Critical Strikes reduce all GW cooldowns by 3s." },
      { id:"beladona",     tier:"II", nPT:"Beladona Mortífera",nEN:"Deadly Nightshade",rank:null,sp:true,  fx:[],
        dPT:"Veneno também causa dano à vida dos inimigos.", dEN:"Poison also damages enemy health." },
      { id:"temp_sombria", tier:"III",nPT:"Tempestade Sombria",nEN:"Shadow Storm",    rank:5,   sp:false, fx:[{s:"ultStrikeBonus",v:2,t:"flat"}],
        dPT:"Golpe Sombrio ganha 2 golpes adicionais.", dEN:"Shadow Strike gains 2 extra strikes." },
      { id:"sumico_cadeia",tier:"III",nPT:"Sumiço em Cadeia",  nEN:"Chain Vanish",    rank:11,  sp:true,  fx:[],
        dPT:"Assassinar ao usar o Sumiço reativa o Sumiço e renova a duração.",
        dEN:"Successfully assassinating an enemy while vanished re-activates vanish and refreshes the duration." },
      { id:"leg_ass_iii",  tier:"III",nPT:"Magistral",         nEN:"Legendary",       rank:18,  sp:false, fx:[{s:"legSlots",v:1,t:"flat"}],
        dPT:"Aumenta em 1 o número de itens Magistrais que você pode equipar.",
        dEN:"Increases the number of Legendary items you can equip by 1." },
      { id:"ofuscado",     tier:"III",nPT:"Ofuscado",          nEN:"Overshadowed",    rank:null,sp:false, fx:[{s:"ultDmgBonus",v:1.0,t:"add"}],
        dPT:"Os ataques do Golpe Sombrio causam 100% de dano adicional.",
        dEN:"Shadow Strike attacks do 100% extra damage." }
    ]
  }
];

// ─── PROP POOLS (reutilizados explicitamente em magistrais) ──
// Katana
const P_KATANA_COMMON_P1P2 = [
  {id:"dano_cc",    nPT:"Dano Corpo a Corpo",      nEN:"Melee Damage",          sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeDamage"},
  {id:"ganho_det_cc",nPT:"Ganho de Determinação C/C",nEN:"Melee Resolve Gain",   sl:["P1","P2"],mn:0.05,mx:0.25,u:"%",sk:"resolveFromMelee"},
  {id:"dano_atord_cc",nPT:"Dano Atordoante C/C",   nEN:"Melee Stagger Damage",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeStaggerDamage"},
  {id:"janela_aparo",nPT:"Janela de Aparo Perfeito",nEN:"Perfect Parry Window",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"parryWindow"},
  {id:"dano_contra", nPT:"Dano de Contra-Ataque",  nEN:"Counter Damage",        sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"counterDamage"}
];
const P_KATANA_P2ONLY = [
  {id:"dano_supremo",nPT:"Dano Supremo",            nEN:"Ultimate Damage",       sl:["P2"],      mn:0.1, mx:0.2, u:"%",sk:"ultimateDamage"},
  {id:"red_rec_hab", nPT:"Red. Recarga Habilidade", nEN:"Ability Cooldown Reduction",sl:["P2"],  mn:0.05,mx:0.12,u:"%",sk:"abilityCDR"},
  {id:"dano_oni",    nPT:"Dano contra Oni",         nEN:"Oni Damage",            sl:["P2"],      mn:0.05,mx:0.1, u:"%",sk:"oniDamage"},
  {id:"dano_atord_alvo",nPT:"Dano contra Atordoados",nEN:"Staggered Damage",    sl:["P2"],      mn:0.1, mx:0.2, u:"%",sk:"staggeredDamage"}
];
const PROPS_KATANA = [...P_KATANA_COMMON_P1P2, ...P_KATANA_P2ONLY];

// Perks base de katana (comuns a todas)
const PERK_KATANA_BASE = [
  {id:"lamina_ard",   nPT:"Lâmina Ardente",       nEN:"Burning Blade",       dPT:"Ataques C/C têm chance de aplicar Combustão.",                            dEN:"Melee attacks have a chance to apply the Burning effect."},
  {id:"lamina_env",   nPT:"Lâmina Envenenada",    nEN:"Poison Blade",        dPT:"Ataques C/C têm chance de aplicar Envenenado.",                           dEN:"Melee attacks have a chance to apply the Poison effect."},
  {id:"cam_chama",    nPT:"Caminho da Chama",     nEN:"Way of the Flame",    dPT:"Incendeia a Katana para aplicar dano de Queimadura a ataques C/C (R1+O).",dEN:"Ignite the katana to apply Burning damage to melee attacks (R1+O)."},
  {id:"contra_intim", nPT:"Contra-Ataque Intimidador",nEN:"Intimidating Counter",dPT:"Contra-ataques do Aparo Perfeito têm 50% de chance de dano a inimigos próximos.",dEN:"Perfect Parry counter attacks have a 50% chance to also deal damage to nearby foes."}
];
// Stance unlock perks
const PERK_PEDRA = {id:"postura_pedra", nPT:"Postura de Pedra", nEN:"Stone Stance", dPT:"Permite mudar para a Postura de Pedra (R2+X).",  dEN:"Allows switching to Stone Stance (R2+X)."};
const PERK_AGUA  = {id:"postura_agua",  nPT:"Postura da Água",  nEN:"Water Stance", dPT:"Permite mudar para a Postura da Água (R2+O).",  dEN:"Allows switching to Water Stance (R2+O)."};
const PERK_VENTO = {id:"postura_vento", nPT:"Postura do Vento", nEN:"Wind Stance",  dPT:"Permite mudar para a Postura do Vento (R2+△).",dEN:"Allows switching to Wind Stance (R2+△)."};
const PERK_LUA   = {id:"postura_lua",   nPT:"Postura da Lua",   nEN:"Moon Stance",  dPT:"Permite mudar para a Postura da Lua (R2+☐).",  dEN:"Allows switching to Moon Stance (R2+☐)."};
// Stance master perks
const PERK_MESTRE_PEDRA = {id:"mestre_pedra",nPT:"Mestre da Pedra",nEN:"Stone Master",dPT:"Realize ataques pesados na Postura da Pedra com velocidade intensa, e o ataque final causará dano aumentado.",dEN:"Perform Stone Stance heavy attacks with ferocious speed, and the final attack does increased damage."};
const PERK_MESTRE_AGUA  = {id:"mestre_agua", nPT:"Mestre da Água", nEN:"Water Master",dPT:"Causa danos crescentes com cada ataque de seus Golpes Afluentes.",dEN:"Inflict increasing damage with each attack in your Surging Strike."};
const PERK_MESTRE_VENTO = {id:"mestre_vento",nPT:"Mestre do Vento",nEN:"Wind Master", dPT:"O Chute do Tufão causa Dano Atordoante aumentado e derruba os inimigos.",dEN:"Typhoon Kick deals increased Stagger Damage and causes knock down."};
const PERK_MESTRE_LUA   = {id:"mestre_lua",  nPT:"Mestre da Lua",  nEN:"Moon Master", dPT:"O Golpe Rodopiante pode atingir até 3 vezes. O ataque final na combinação de Golpe Pesado causa dano adicional.",dEN:"Spinning strike can combo 3 times. The final attack in the Heavy Strike combo deals increased damage."};

// Ranged props
const PROPS_ARCO = [
  {id:"dano_dist",    nPT:"Dano a Distância",        nEN:"Ranged Damage",         sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"rangedDamage"},
  {id:"ganho_det_dist",nPT:"Ganho de Det. Distância",nEN:"Ranged Resolve Gain",   sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"resolveFromRanged"},
  {id:"dano_cabeca",  nPT:"Dano Tiro na Cabeça",     nEN:"Headshot Damage",       sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"headshotDamage"},
  {id:"vel_tensao",   nPT:"Velocidade de Tensão",    nEN:"Draw Speed",            sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"drawSpeed"},
  {id:"vel_recarga",  nPT:"Velocidade de Recarga",   nEN:"Reload Speed",          sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"reloadSpeed"},
  {id:"celer_proj",   nPT:"Celeridade dos Projéteis",nEN:"Projectile Speed",      sl:["P1","P2"],mn:0.15,mx:0.25,u:"%",sk:"projectileSpeed"}
];

// Arco Longo tem perks adicionais
const PERKS_ARCO_CURTO = [
  {id:"mun_env",  nPT:"Munição Envenenada",    nEN:"Poisoned Ammo",        dPT:"Ataques de arco têm chance de aplicar Envenenamento.",          dEN:"Bow attacks have a chance to apply Poison."},
  {id:"mun_afi",  nPT:"Munição Afiada",        nEN:"Sharpened Ammo",       dPT:"Ataques de arco têm chance de aplicar Sangramento.",            dEN:"Bow attacks have a chance to apply Bleeding."},
  {id:"restit_prec",nPT:"Restituição por Precisão",nEN:"Headshot Refund",  dPT:"Recupera munições comuns ao acertar um disparo na cabeça.",     dEN:"Recover standard ammo on headshot."},
  {id:"mun_elmo", nPT:"Munição Perfura-Elmo",  nEN:"Helmet Piercing Ammo", dPT:"A Munição desta arma perfura elmos.",                           dEN:"Ammo pierces helmets."},
  {id:"mun_esc",  nPT:"Munição Perfura-Escudo",nEN:"Shield Piercing Ammo", dPT:"A Munição desta arma perfura escudos.",                         dEN:"Ammo pierces shields."}
];
const PERKS_ARCO_LONGO_EXTRAS = [
  {id:"disp_arrem",nPT:"Disparo Arremessante",nEN:"Throwing Shot",   dPT:"Flechas disparadas com o arco completamente tensionado arremessam o inimigo.",dEN:"Fully drawn arrows knock enemies back."},
  {id:"disp_cert", nPT:"Disparo Certeiro",    nEN:"Sharpshooter",    dPT:"Aumenta a ampliação em 100%.",                                                   dEN:"Increase zoom by 100%."},
  {id:"olho_aguia",nPT:"Olho de Águia",       nEN:"Eagle Eye",       dPT:"Aumenta a ampliação em 200%.",                                                   dEN:"Increase zoom by 200%."},
  {id:"versatil",  nPT:"Versátil",            nEN:"Versatile",       dPT:"Qualquer classe pode utilizar.",                                                 dEN:"Can be used by any class."}
];
// Arco Longo completo (Headshot Refund + Throwing Shot + Sharpshooter + Eagle Eye + Versatile)
const PERKS_ARCO_LONGO = [...PERKS_ARCO_CURTO, ...PERKS_ARCO_LONGO_EXTRAS];

// GW1 props (CDR só desta arma)
const mkGW1Props = (extra = []) => [
  ...extra,
  {id:"red_rec_gw1",  nPT:"Redução de Recarga",      nEN:"GW Cooldown Reduction", sl:["P1","P2"],mn:0.08,mx:0.15,u:"%",sk:"gw1CDR"},
  {id:"dano_af",      nPT:"Dano de Arma Fantasma",   nEN:"Ghost Weapon Damage",   sl:["P1","P2"],mn:0.12,mx:0.2, u:"%",sk:"ghostWeaponDamage"},
  {id:"red_rec_gw1_kill",nPT:"Red. Recarga ao Abater",nEN:"GW CDR on Kill",       sl:["P1","P2"],mn:1,   mx:4,   u:"s",sk:"gw1CDRonKill"},
  {id:"dur_ef_col",   nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1,mx:0.15,u:"%",sk:"statusDuration"}
];
// GW2 props (CDR só desta arma)
const mkGW2Props = (specific = []) => [
  ...specific,
  {id:"red_rec_gw2",  nPT:"Redução de Recarga",      nEN:"GW Cooldown Reduction", sl:["P1","P2"],mn:0.08,mx:0.15,u:"%",sk:"gw2CDR"},
  {id:"red_rec_gw2_kill",nPT:"Red. Recarga ao Abater",nEN:"GW CDR on Kill",       sl:["P1","P2"],mn:1,   mx:4,   u:"s",sk:"gw2CDRonKill"}
];

// Charm props helpers
const CHARM_ATK_P1P2 = [
  {id:"dano_cc_c",     nPT:"Dano Corpo a Corpo",      nEN:"Melee Damage",          sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeDamage"},
  {id:"ganho_det_cc_c",nPT:"Ganho de Det. C/C",       nEN:"Melee Resolve Gain",    sl:["P1","P2"],mn:0.05,mx:0.25,u:"%",sk:"resolveFromMelee"},
  {id:"dano_atord_c",  nPT:"Dano Atordoante C/C",     nEN:"Melee Stagger Damage",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeStaggerDamage"},
  {id:"janela_c",      nPT:"Janela de Aparo Perfeito",nEN:"Perfect Parry Window",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"parryWindow"},
  {id:"contra_c",      nPT:"Dano de Contra-Ataque",   nEN:"Counter Damage",        sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"counterDamage"}
];
const CHARM_DIST_P1P2 = [
  {id:"dano_dist_c",   nPT:"Dano a Distância",        nEN:"Ranged Damage",         sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"rangedDamage"},
  {id:"ganho_dist_c",  nPT:"Ganho de Det. Distância", nEN:"Ranged Resolve Gain",   sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"resolveFromRanged"},
  {id:"dano_cab_c",    nPT:"Dano Tiro na Cabeça",     nEN:"Headshot Damage",       sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"headshotDamage"},
  {id:"vel_tens_c",    nPT:"Velocidade de Tensão",    nEN:"Draw Speed",            sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"drawSpeed"},
  {id:"vel_rec_c",     nPT:"Velocidade de Recarga",   nEN:"Reload Speed",          sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"reloadSpeed"}
];
const CHARM_DEF_P1P2 = [
  {id:"red_dano",     nPT:"Redução de Dano",         nEN:"Damage Reduction",      sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"damageReduction"},
  {id:"ganho_det_fer",nPT:"Ganho de Det. Ferido",    nEN:"Injured Resolve Gain",  sl:["P1","P2"],mn:0.1, mx:0.25,u:"%",sk:"resolveFromInjury"},
  {id:"ressurr_vital",nPT:"Ressurreição Vital",      nEN:"Revive Health",         sl:["P1","P2"],mn:13,  mx:25,  u:"pts",sk:"reviveHP"},
  {id:"oferta_vital", nPT:"Oferenda Fantasma Vital", nEN:"Ghost Offering Health", sl:["P1","P2"],mn:10,  mx:25,  u:"pts",sk:"offeringHP"}
];
const CHARM_UTI_P1P2 = [
  {id:"ganho_det_u",  nPT:"Ganho de Determinação",   nEN:"Resolve Gain",          sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"resolveGain"},
  {id:"dano_sup_u",   nPT:"Dano Supremo",            nEN:"Ultimate Damage",       sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"ultimateDamage"},
  {id:"red_hab_u",    nPT:"Red. Recarga Habilidade", nEN:"Ability Cooldown Reduction",sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"abilityCDR"},
  {id:"dano_fogo_u",  nPT:"Dano de Fogo",            nEN:"Fire Damage",           sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"fireDamage"},
  {id:"dano_oni_u",   nPT:"Dano contra Oni",         nEN:"Oni Damage",            sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"oniDamage"},
  {id:"dano_atd_u",   nPT:"Dano contra Atordoados",  nEN:"Staggered Damage",      sl:["P1","P2"],mn:0.1, mx:0.2, u:"%",sk:"staggeredDamage"}
];
const CHARM_FURT_P1P2 = [
  {id:"dano_furt_c",  nPT:"Dano de Ataque Furtivo",  nEN:"Stealth Attack Damage", sl:["P1","P2"],mn:0.1, mx:0.25,u:"%",sk:"stealthDamage"},
  {id:"red_rec_af_c", nPT:"Redução de Recarga (AF)", nEN:"GW Cooldown Reduction", sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"gwCDRglobal"},
  {id:"dano_af_c",    nPT:"Dano de Arma Fantasma",   nEN:"Ghost Weapon Damage",   sl:["P1","P2"],mn:0.12,mx:0.2, u:"%",sk:"ghostWeaponDamage"},
  {id:"red_abate_c",  nPT:"Red. Recarga ao Abater (AF)",nEN:"GW CDR on Kill",     sl:["P1","P2"],mn:1,   mx:2,   u:"s",sk:"gwCDRonKillGlobal"},
  {id:"dur_ef_c",     nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1,mx:0.15,u:"%",sk:"statusDuration"},
  {id:"dano_ef_c",    nPT:"Dano de Efeito Colateral",nEN:"Status Effect Damage",  sl:["P1","P2"],mn:0.1, mx:0.18,u:"%",sk:"statusDamage"},
  {id:"furtiv_c",     nPT:"Furtividade",             nEN:"Stealth",               sl:["P1","P2"],mn:10,  mx:20,  u:"pts",sk:"stealth"}
];
const CHARM_P2ONLY = [
  {id:"ganho_det",    nPT:"Ganho de Determinação",   nEN:"Resolve Gain",          sl:["P2"],      mn:0.05,mx:0.1, u:"%",sk:"resolveGain"},
  {id:"dano_sup",     nPT:"Dano Supremo",            nEN:"Ultimate Damage",       sl:["P2"],      mn:0.1, mx:0.2, u:"%",sk:"ultimateDamage"},
  {id:"red_rec_hab2", nPT:"Red. Recarga Habilidade", nEN:"Ability Cooldown Reduction",sl:["P2"],  mn:0.05,mx:0.12,u:"%",sk:"abilityCDR"},
  {id:"dano_fogo2",   nPT:"Dano de Fogo",            nEN:"Fire Damage",           sl:["P2"],      mn:0.05,mx:0.12,u:"%",sk:"fireDamage"},
  {id:"dano_oni2",    nPT:"Dano contra Oni",         nEN:"Oni Damage",            sl:["P2"],      mn:0.05,mx:0.1, u:"%",sk:"oniDamage"},
  {id:"dano_atord2",  nPT:"Dano contra Atordoados",  nEN:"Staggered Damage",      sl:["P2"],      mn:0.1, mx:0.2, u:"%",sk:"staggeredDamage"}
];
const PERKS_CHARM_BASE = [
  {id:"regen_comb",   nPT:"Regeneração em Combate",  nEN:"Combat Regeneration",  dPT:"A vida se regenera até 50 da vida máxima. Taxa reduzida em combate.",   dEN:"Health regenerates to 50 max. Rate halved in combat."},
  {id:"aparo_sang",   nPT:"Aparo Sanguessuga",       nEN:"Leeching Parry",       dPT:"Um Aparo Perfeito restaura vida e recupera Determinação mais rápido.",  dEN:"A Perfect Parry restores health and recovers Resolve faster."},
  {id:"mestre_fogo",  nPT:"Mestre do Fogo",          nEN:"Fire Master",          dPT:"Aumenta o dano de fogo em 25%.", dEN:"Increases fire damage by 25%.", fx:[{s:"fireDamage",v:0.25,t:"add"}]},
  {id:"aum_vida",     nPT:"Aumento de Vida",         nEN:"Health Increase",      dPT:"Aumenta a vida máxima em 25.", dEN:"Increases max health by 25.", fx:[{s:"maxHP",v:25,t:"flat"}]},
  {id:"maior_det_p",  nPT:"Maior Determinação",      nEN:"Resolve Increase",     dPT:"Aumenta a Determinação máxima em 1.", dEN:"Increases max Resolve by 1.", fx:[{s:"maxResolve",v:1,t:"flat"}]},
  {id:"superarmadura",nPT:"Superarmadura",            nEN:"Super Armor",          dPT:"Você não é mais interrompido por ataques C/C e pode atacar enquanto recebe dano.",dEN:"You are no longer interrupted by melee attacks and can attack while taking damage."},
  {id:"arrem_impac",  nPT:"Arremessos Impactantes",  nEN:"Impactful Throws",     dPT:"Arremessar um inimigo deixa-o derrubado e vulnerável a golpes críticos.", dEN:"Throwing an enemy leaves them knocked down and vulnerable to critical hits."}
];

// ─── PROPS E PERKS EXCLUSIVOS DE CLASSE (para amuletos magistrais vinculados) ──
// Regra: ao vincular um magistral a uma classe, APENAS estes são adicionados.
// sl:["P1","P2"] em todos — magistrais expõem o prop em ambos os slots.
export const CLASS_EXCLUSIVE_CHARM_PROPS = {
  samurai: [
    {id:"alvos_extr_m", nPT:"Alvos Extração Espiritual",nEN:"Spirit Pull Targets",   sl:["P1","P2"],mn:1,   mx:1,   u:"pts",sk:"spiritPullTargets"},
    {id:"raio_lam_m",   nPT:"Raio da Lâmina Explosiva", nEN:"Explosive Blade Radius",sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",  sk:"explosiveBladeRadius"}
  ],
  hunter: [
    {id:"raio_hab_h_m", nPT:"Raio Habilidades Caçador", nEN:"Hunter Ability Radius", sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",  sk:"hunterAbilityRadius"}
  ],
  ronin: [
    {id:"raio_aroma_m",   nPT:"Raio do Aroma Curativo",   nEN:"Healing Incense Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"aromaticoRadius"},
    {id:"dur_aroma_m",    nPT:"Duração do Aroma Curativo", nEN:"Healing Incense Duration", sl:["P1","P2"],mn:0.2,mx:0.4,u:"%",sk:"aromaticoDuration"},
    {id:"raio_esp_m",     nPT:"Raio do Espírito Curativo", nEN:"Healing Spirit Radius",    sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"healingSpiritRadius"},
    {id:"raio_raj_ro_m",  nPT:"Raio da Rajada Debilitante",nEN:"Weakening Burst Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"weakeningBurstRadius"}
  ],
  assassin: [
    {id:"raio_sumi_m",  nPT:"Raio do Sumiço Tóxico",    nEN:"Toxic Vanish Radius",    sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"toxicVanishRadius"},
    {id:"dur_sumi_m",   nPT:"Duração do Sumiço",         nEN:"Vanish Duration",        sl:["P1","P2"],mn:0.25,mx:0.5, u:"%",sk:"vanishDuration"},
    {id:"dano_cima_m",  nPT:"Dano Assassinato de Cima",  nEN:"Assassinate from Above", sl:["P1","P2"],mn:0.1, mx:0.5, u:"%",sk:"assassinFromAbove"}
  ]
};

export const CLASS_EXCLUSIVE_CHARM_PERKS = {
  samurai: [
    {id:"ritmo_cresc_m",  nPT:"Ritmo Crescente",   nEN:"Rising Tempo",    dPT:"Abates sucessivos sem receber dano aumentam o dano causado.",              dEN:"Successive kills without taking damage increase damage dealt."},
    {id:"golpes_abenc_m", nPT:"Golpes Abençoados", nEN:"Blessed Strikes", dPT:"Causar dano C/C cura você enquanto sua habilidade de classe estiver ativa.",dEN:"Dealing melee damage heals you while your class ability is active."}
  ],
  hunter: [
    {id:"flechas_vis_m",  nPT:"Flechas Vis",        nEN:"Foul Arrows",    dPT:"Tiros na cabeça também enfraquecem o alvo.",        dEN:"Headshots also weaken the target."},
    {id:"flechas_abenc_m",nPT:"Flechas Abençoadas", nEN:"Blessed Arrows", dPT:"Tiros na cabeça também curam aliados próximos.",    dEN:"Headshots also heal nearby allies."},
    {id:"catador_m",      nPT:"Catador",            nEN:"Scavenger",      dPT:"Aumenta a quantidade de munição coletada em 100%.", dEN:"Increases ammo picked up by 100%."}
  ],
  ronin: [
    {id:"esp_urso_m",  nPT:"Espírito de Urso", nEN:"Spirit Bear",    dPT:"O Animal Espiritual do Ronin invoca um urso em vez de um cachorro.", dEN:"The Ronin's Spirit Animal summons a bear instead of a dog."},
    {id:"esp_curat_m", nPT:"Espírito Curativo",nEN:"Healing Spirit", dPT:"O Animal Espiritual do Ronin tem uma aura curativa.",                dEN:"The Ronin's Spirit Animal has a healing aura."}
  ],
  assassin: [
    {id:"sumi_cadeia_p_m",nPT:"Sumiço em Cadeia", nEN:"Chain Vanish", dPT:"Assassinar ao usar Sumiço reativa e renova a duração.",dEN:"Assassinating while vanished re-activates vanish."},
    {id:"histeria_m",     nPT:"Histeria",          nEN:"Hysteria",     dPT:"Assassinatos fazem com que inimigos próximos alucinem.",dEN:"Assassinations cause nearby enemies to hallucinate."}
  ]
};

// ─── PERKS OBRIGATÓRIOS POR ITEM+CLASSE ─────────────────────
// Estrutura: { itemId: { classId: 'perkId', ... } }
// Quando uma classe usa um item que não é "primário" dela,
// o perk listado é obrigatório e fica travado no slot Perk I.
export const REQUIRED_PERKS = {
  arco_longo:         { samurai: 'versatil', ronin: 'versatil', assassin: 'versatil' },
  arco_ricocheteador: { samurai: 'versatil', ronin: 'versatil', assassin: 'versatil' },
  zarabatana:         { ronin: 'desbloq_ron' },
  pacote_bombas:      { assassin: 'desbloq_ass' },
  remedio_proibido:   { assassin: 'desbloq_ass_rp', samurai: 'desbloq_sam_rp' },
};

// ─── GEAR DATA ───────────────────────────────────────────────
export const GEAR = [

  // ══════════════════════════════════════
  // KATANAS — NORMAIS
  // ══════════════════════════════════════
  {
    id:"katana_petrea", nPT:"Katana Pétrea", nEN:"Stone Katana",
    type:"katana", sub:"stone", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: PROPS_KATANA,
    perks: [...PERK_KATANA_BASE, PERK_AGUA, PERK_VENTO, PERK_LUA, PERK_MESTRE_PEDRA]
  },
  {
    id:"katana_aquatica", nPT:"Katana Aquática", nEN:"Water Katana",
    type:"katana", sub:"water", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: PROPS_KATANA,
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_VENTO, PERK_LUA, PERK_MESTRE_AGUA]
  },
  {
    id:"katana_eolica", nPT:"Katana Eólica", nEN:"Wind Katana",
    type:"katana", sub:"wind", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: PROPS_KATANA,
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_AGUA, PERK_LUA, PERK_MESTRE_VENTO]
  },
  {
    id:"katana_lunar", nPT:"Katana Lunar", nEN:"Moon Katana",
    type:"katana", sub:"moon", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: PROPS_KATANA,
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_AGUA, PERK_VENTO, PERK_MESTRE_LUA]
  },

  // ══════════════════════════════════════
  // ARCOS — NORMAIS
  // ══════════════════════════════════════
  {
    id:"arco_curto", nPT:"Arco Curto", nEN:"Shortbow",
    type:"ranged", sub:"shortbow", leg:false, by:null, cd:null,
    ammo:{pt:"Flecha Normal: 22\nFlecha Flamejante: 3 (6)\nFlecha Perfurante: (6)", en:"Normal Arrow: 22\nFire Arrow: 3 (6)\nPiercing Arrow: (6)"},
    xp:null,
    props: PROPS_ARCO,
    perks: PERKS_ARCO_CURTO
  },
  {
    id:"arco_longo", nPT:"Arco Longo", nEN:"Longbow",
    type:"ranged", sub:"longbow", leg:false, by:null, cd:null,
    ammo:{pt:"Flecha Normal: 15\nFlecha Flamejante: 2 (5)\nFlecha Perfurante: (6)", en:"Normal Arrow: 15\nFire Arrow: 2 (5)\nPiercing Arrow: (6)"},
    xp:null,
    props: PROPS_ARCO,
    // Longbow: todos os perks incluindo os exclusivos de arco longo
    perks: PERKS_ARCO_LONGO
  },
  {
    id:"zarabatana", nPT:"Zarabatana", nEN:"Blowgun",
    type:"ranged", sub:"blowgun", leg:false, by:["assassin","ronin"], cd:null,
    ammo:{pt:"Dardo Venenoso: 10\nDardo Alucinógeno: 2\nDardo Debilitante: 3", en:"Poison Dart: 10\nHallucination Dart: 2\nWeakening Dart: 3"},
    xp:null,
    props: [
      {id:"dur_ef_col_z", nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1, mx:0.15,u:"%",sk:"statusDuration"},
      {id:"dano_ef_col_z",nPT:"Dano de Efeito Colateral",   nEN:"Status Effect Damage",  sl:["P1","P2"],mn:0.1, mx:0.18,u:"%",sk:"statusDamage"},
      {id:"furtiv_z",     nPT:"Furtividade",                nEN:"Stealth",               sl:["P1","P2"],mn:10,  mx:20,  u:"pts",sk:"stealth"},
      {id:"dano_furtivo_z",nPT:"Dano de Ataque Furtivo",    nEN:"Stealth Attack Damage", sl:["P2"],      mn:0.1, mx:0.25,u:"%",sk:"stealthDamage"}
    ],
    perks: [
      {id:"mun_afi_z",   nPT:"Munição Afiada",         nEN:"Sharpened Ammo",       dPT:"Ataques têm chance de aplicar Sangramento.",                dEN:"Attacks have a chance to apply Bleeding."},
      {id:"mun_elmo_z",  nPT:"Munição Perfura-Elmo",   nEN:"Helmet Piercing Ammo", dPT:"Munição desta arma perfura elmos.",                         dEN:"Ammo pierces helmets."},
      {id:"mun_esc_z",   nPT:"Munição Perfura-Escudo", nEN:"Shield Piercing Ammo", dPT:"Munição desta arma perfura escudos.",                       dEN:"Ammo pierces shields."},
      {id:"dardos_aluc", nPT:"Dardos Alucinógenos",    nEN:"Hallucination Darts",  dPT:"Dardos Alucinógenos fazem inimigos atacarem uns aos outros.", dEN:"Hallucination Darts make enemies attack each other."},
      {id:"desbloq_ron", nPT:"Desbloqueio do Ronin",   nEN:"Ronin Unlock",         dPT:"Pode ser usada pelo Ronin.",                                 dEN:"Can be used by Ronin."}
    ]
  },
  {
    id:"pacote_bombas", nPT:"Pacote de Bombas", nEN:"Bomb Pack",
    type:"ranged", sub:"bombpack", leg:false, by:["ronin","assassin"], cd:null,
    ammo:{pt:"Bomba de Concussão: 6 (12)\nBomba Luminosa: 2\nBomba de Pólvora: 2", en:"Concussion Bomb: 6 (12)\nFlash Bomb: 2\nBlack Powder Bomb: 2"},
    xp:null,
    props: [
      {id:"dano_atord_pb",nPT:"Dano Atordoante C/C",       nEN:"Melee Stagger Damage",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeStaggerDamage"},
      {id:"raio_expl_pb", nPT:"Raio de Explosão",          nEN:"Blast Radius",          sl:["P1","P2"],mn:0.15,mx:0.25,u:"%",sk:"blastRadius"},
      {id:"dur_ef_pb",    nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1, mx:0.15,u:"%",sk:"statusDuration"},
      {id:"dano_ef_pb",   nPT:"Dano de Efeito Colateral",  nEN:"Status Effect Damage",  sl:["P1","P2"],mn:0.1, mx:0.18,u:"%",sk:"statusDamage"}
    ],
    perks: [
      {id:"bomba_lum",    nPT:"Bomba Luminosa",         nEN:"Flash Bomb",           dPT:"Adiciona Bombas Luminosas ao Pacote (L2+△).",   dEN:"Adds Flash Bombs to the Pack (L2+△)."},
      {id:"bomba_polv",   nPT:"Bomba de Pólvora",       nEN:"Black Powder Bomb",    dPT:"Adiciona Bombas de Pólvora ao Pacote (L2+◯).",  dEN:"Adds Black Powder Bombs to the Pack (L2+◯)."},
      {id:"desbloq_ass",  nPT:"Desbloqueio de Assassino",nEN:"Assassin Unlock",     dPT:"Assassinos podem utilizar.",                    dEN:"Can be used by Assassin."}
    ]
  },

  // ══════════════════════════════════════
  // AMULETOS — NORMAIS (GERAIS)
  // ══════════════════════════════════════
  {
    id:"amuleto_cc", nPT:"Amuleto de Corpo a Corpo", nEN:"Melee Charm",
    type:"charm", sub:"melee", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: [...CHARM_ATK_P1P2, ...CHARM_P2ONLY],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"amuleto_dist", nPT:"Amuleto de Longo Alcance", nEN:"Ranged Charm",
    type:"charm", sub:"ranged", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: [...CHARM_DIST_P1P2, ...CHARM_P2ONLY],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"amuleto_defesa", nPT:"Amuleto de Defesa", nEN:"Defense Charm",
    type:"charm", sub:"defense", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: [...CHARM_DEF_P1P2, ...CHARM_P2ONLY],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"amuleto_util", nPT:"Amuleto de Utilidades", nEN:"Utility Charm",
    type:"charm", sub:"utility", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: CHARM_UTI_P1P2,
    perks: PERKS_CHARM_BASE
  },
  {
    id:"amuleto_furt", nPT:"Amuleto de Furtividade", nEN:"Stealth Charm",
    type:"charm", sub:"stealth", leg:false, by:null, cd:null, ammo:null, xp:null,
    props: [...CHARM_FURT_P1P2, ...CHARM_P2ONLY],
    perks: PERKS_CHARM_BASE
  },

  // ══════════════════════════════════════
  // AMULETOS DE CLASSE — NORMAIS
  // ══════════════════════════════════════
  {
    id:"amuleto_samurai", nPT:"Amuleto do Samurai", nEN:"Samurai Charm",
    type:"charm", sub:"melee", leg:false, by:["samurai"], cd:null, ammo:null, xp:null,
    props: [
      ...CHARM_ATK_P1P2,
      ...CHARM_P2ONLY,
      {id:"alvos_extr",    nPT:"Alvos Extração Espiritual",nEN:"Spirit Pull Targets",  sl:["P2"],      mn:1,   mx:1,   u:"pts",sk:"spiritPullTargets"},
      {id:"raio_lam",      nPT:"Raio da Lâmina Explosiva",nEN:"Explosive Blade Radius",sl:["P2"],      mn:0.5, mx:1.0, u:"%",sk:"explosiveBladeRadius"}
    ],
    perks: [
      ...PERKS_CHARM_BASE,
      {id:"ritmo_cresc", nPT:"Ritmo Crescente",  nEN:"Rising Tempo",    dPT:"Abates sucessivos sem receber dano aumentam o dano causado.", dEN:"Successive kills without taking damage increase damage dealt."},
      {id:"golpes_abenc",nPT:"Golpes Abençoados",nEN:"Blessed Strikes", dPT:"Causar dano C/C cura você enquanto sua habilidade de classe estiver ativa.", dEN:"Dealing melee damage heals you while your class ability is active."}
    ]
  },
  {
    id:"amuleto_cacador", nPT:"Amuleto do Caçador", nEN:"Hunter Charm",
    type:"charm", sub:"ranged", leg:false, by:["hunter"], cd:null, ammo:null, xp:null,
    props: [
      ...CHARM_DIST_P1P2,
      {id:"raio_hab_h",   nPT:"Raio Habilidades Caçador",nEN:"Hunter Ability Radius", sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"hunterAbilityRadius"},
      ...CHARM_P2ONLY
    ],
    perks: [
      ...PERKS_CHARM_BASE,
      {id:"flechas_vis",  nPT:"Flechas Vis",        nEN:"Foul Arrows",    dPT:"Tiros na cabeça também enfraquecem o alvo.",          dEN:"Headshots also weaken the target."},
      {id:"flechas_abenc",nPT:"Flechas Abençoadas", nEN:"Blessed Arrows", dPT:"Tiros na cabeça também curam aliados próximos.",      dEN:"Headshots also heal nearby allies."},
      {id:"catador",      nPT:"Catador",            nEN:"Scavenger",      dPT:"Aumenta a quantidade de munição coletada em 100%.",    dEN:"Increases ammo picked up by 100%."}
    ]
  },
  {
    id:"amuleto_ronin", nPT:"Amuleto do Ronin", nEN:"Ronin Charm",
    type:"charm", sub:"defense", leg:false, by:["ronin"], cd:null, ammo:null, xp:null,
    props: [
      ...CHARM_DEF_P1P2,
      {id:"raio_aroma",  nPT:"Raio do Aroma Curativo",  nEN:"Healing Incense Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"aromaticoRadius"},
      {id:"dur_aroma",   nPT:"Duração do Aroma Curativo",nEN:"Healing Incense Duration", sl:["P1","P2"],mn:0.2,mx:0.4,u:"%",sk:"aromaticoDuration"},
      {id:"raio_esp",    nPT:"Raio do Espírito Curativo",nEN:"Healing Spirit Radius",    sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"healingSpiritRadius"},
      ...CHARM_P2ONLY,
      {id:"raio_raj_ro", nPT:"Raio da Rajada Debilitante",nEN:"Weakening Burst Radius", sl:["P2"],     mn:0.5, mx:1.0, u:"%",sk:"weakeningBurstRadius"}
    ],
    perks: [
      ...PERKS_CHARM_BASE,
      {id:"esp_urso",    nPT:"Espírito de Urso", nEN:"Spirit Bear",    dPT:"O Animal Espiritual do Ronin invoca um urso em vez de um cachorro.", dEN:"The Ronin's Spirit Animal summons a bear instead of a dog."},
      {id:"esp_curat",   nPT:"Espírito Curativo",nEN:"Healing Spirit", dPT:"O Animal Espiritual do Ronin tem uma aura curativa.",                dEN:"The Ronin's Spirit Animal has a healing aura."}
    ]
  },
  {
    id:"amuleto_assassino", nPT:"Amuleto do Assassino", nEN:"Assassin Charm",
    type:"charm", sub:"stealth", leg:false, by:["assassin"], cd:null, ammo:null, xp:null,
    props: [
      ...CHARM_FURT_P1P2,
      {id:"raio_sumi",    nPT:"Raio do Sumiço Tóxico",    nEN:"Toxic Vanish Radius",   sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"toxicVanishRadius"},
      {id:"dur_sumi",     nPT:"Duração do Sumiço",        nEN:"Vanish Duration",       sl:["P1","P2"],mn:0.25,mx:0.5, u:"%",sk:"vanishDuration"},
      {id:"dano_cima",    nPT:"Dano Assassinato de Cima", nEN:"Assassinate from Above",sl:["P1","P2"],mn:0.1, mx:0.5, u:"%",sk:"assassinFromAbove"},
      ...CHARM_P2ONLY
    ],
    perks: [
      ...PERKS_CHARM_BASE,
      {id:"sumi_cadeia_p",nPT:"Sumiço em Cadeia", nEN:"Chain Vanish", dPT:"Assassinar ao usar Sumiço reativa e renova a duração.",dEN:"Assassinating while vanished re-activates vanish."},
      {id:"histeria",     nPT:"Histeria",          nEN:"Hysteria",     dPT:"Assassinatos fazem com que inimigos próximos alucinem.",dEN:"Assassinations cause nearby enemies to hallucinate."}
    ]
  },

  // ══════════════════════════════════════
  // ARMAS FANTASMA — NORMAIS
  // ══════════════════════════════════════
  {
    id:"kunai", nPT:"Kunai", nEN:"Kunai",
    type:"gw1", sub:"kunai", leg:false, by:null, cd:30, ammo:null, xp:null,
    props: mkGW1Props([{id:"dano_cc_k",nPT:"Dano Corpo a Corpo",nEN:"Melee Damage",sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeDamage"}]),
    perks: [
      {id:"em_chamas",   nPT:"Em Chamas",     nEN:"Fired Up",       dPT:"Incendeia os alvos.",                                    dEN:"Sets targets on fire."},
      {id:"sortudo",     nPT:"Sortudo",       nEN:"Lucky",          dPT:"15% de chance de zerar o tempo de recarga ao usar.",     dEN:"15% chance to reset cooldown on use."},
      {id:"supermassiva",nPT:"Supermassiva",  nEN:"Super Massive",  dPT:"Causa dano adicional e derruba inimigos mais leves.",    dEN:"Deals extra damage and knocks down lighter enemies."},
      {id:"laminas_ocul",nPT:"Lâminas Ocultas",nEN:"Hidden Blades",dPT:"Arremessa 5 Kunai de uma só vez.",                      dEN:"Throws 5 Kunai at once."}
    ]
  },
  {
    id:"arremesso_terra", nPT:"Arremesso de Terra", nEN:"Dirt Throw",
    type:"gw1", sub:"dirtthrow", leg:false, by:null, cd:40, ammo:null, xp:null,
    props: mkGW1Props([{id:"janela_k",nPT:"Janela de Aparo Perfeito",nEN:"Perfect Parry Window",sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"parryWindow"}]),
    perks: [
      {id:"em_chamas2",  nPT:"Em Chamas",     nEN:"Fired Up",   dPT:"Incendeia os alvos.",                               dEN:"Sets targets on fire."},
      {id:"sortudo2",    nPT:"Sortudo",       nEN:"Lucky",      dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"podridao",    nPT:"Podridão",      nEN:"Rancid",     dPT:"Enfraquece os alvos ao atingi-los.",                dEN:"Weakens targets on hit."}
    ]
  },
  {
    id:"bomba_aderente", nPT:"Bomba Aderente", nEN:"Sticky Bomb",
    type:"gw1", sub:"stickybomb", leg:false, by:null, cd:90, ammo:null, xp:null,
    props: mkGW1Props([{id:"raio_bomb",nPT:"Raio de Explosão",nEN:"Blast Radius",sl:["P1","P2"],mn:0.15,mx:0.25,u:"%",sk:"blastRadius"}]),
    perks: [
      {id:"em_chamas3",  nPT:"Em Chamas",      nEN:"Fired Up",          dPT:"Incendeia os alvos.",                               dEN:"Sets targets on fire."},
      {id:"sortudo3",    nPT:"Sortudo",        nEN:"Lucky",             dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"raio_aum",    nPT:"Raio Aumentado", nEN:"Increased Radius",  dPT:"O raio é aumentado em 50%.",                        dEN:"Radius is increased by 50%."}
    ]
  },
  {
    id:"bomba_fumaca", nPT:"Bomba de Fumaça", nEN:"Smoke Bomb",
    type:"gw2", sub:"smokebomb", leg:false, by:null, cd:120, ammo:null, xp:null,
    props: mkGW2Props([
      {id:"dano_furt_g2",nPT:"Dano de Ataque Furtivo",  nEN:"Stealth Attack Damage",sl:["P1","P2"],mn:0.1,mx:0.25,u:"%",sk:"stealthDamage"},
      {id:"furtiv_g2",   nPT:"Furtividade",             nEN:"Stealth",              sl:["P1","P2"],mn:10, mx:20,  u:"pts",sk:"stealth"}
    ]),
    perks: [
      {id:"sortudo4",    nPT:"Sortudo",              nEN:"Lucky",           dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"municoes",    nPT:"Munições",             nEN:"Munitions",       dPT:"Cria munições aleatórias ao usar.",                  dEN:"Creates random ammo on use."},
      {id:"det_repent",  nPT:"Determinação Repentina",nEN:"Sudden Resolve", dPT:"Preenche a primeira barra de Determinação ao usar.", dEN:"Fills first Resolve bar on use."},
      {id:"polvora",     nPT:"Pólvora",              nEN:"Black Powder",    dPT:"Quando a bomba detona, inimigos próximos são arremessados para trás.", dEN:"On detonation, nearby enemies are knocked back."}
    ]
  },
  {
    id:"cabaca_curativa", nPT:"Cabaça Curativa", nEN:"Healing Gourd",
    type:"gw2", sub:"healinggourd", leg:false, by:null, cd:90, ammo:null, xp:null,
    props: mkGW2Props([
      {id:"red_dano_g",  nPT:"Redução de Dano",         nEN:"Damage Reduction",     sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"damageReduction"},
      {id:"ganho_fer_g", nPT:"Ganho de Det. Ferido",    nEN:"Injured Resolve Gain", sl:["P1","P2"],mn:0.1, mx:0.25,u:"%",sk:"resolveFromInjury"},
      {id:"oferta_g",    nPT:"Oferenda Fantasma Vital", nEN:"Ghost Offering Health",sl:["P1","P2"],mn:10,  mx:25,  u:"pts",sk:"offeringHP"}
    ]),
    perks: [
      {id:"sortudo5",    nPT:"Sortudo",              nEN:"Lucky",          dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"det_repent2", nPT:"Determinação Repentina",nEN:"Sudden Resolve",dPT:"Preenche a primeira barra de Determinação ao usar.", dEN:"Fills first Resolve bar on use."},
      {id:"bebida_forte",nPT:"Bebida Forte",         nEN:"Strong Brew",    dPT:"A cura é ampliada em 50%.",                          dEN:"Healing is amplified by 50%."}
    ]
  },
  {
    id:"estrepes", nPT:"Estrepes", nEN:"Caltrops",
    type:"gw2", sub:"caltrops", leg:false, by:null, cd:90, ammo:null, xp:null,
    props: mkGW2Props([
      {id:"atord_cal",   nPT:"Dano Atordoante C/C",   nEN:"Melee Stagger Damage",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeStaggerDamage"},
      {id:"dano_af_cal", nPT:"Dano de Arma Fantasma", nEN:"Ghost Weapon Damage",   sl:["P1","P2"],mn:0.12,mx:0.2, u:"%",sk:"ghostWeaponDamage"},
      {id:"dur_ef_cal",  nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1,mx:0.15,u:"%",sk:"statusDuration"}
    ]),
    perks: [
      {id:"em_chamas4",  nPT:"Em Chamas",   nEN:"Fired Up",    dPT:"Incendeia os alvos.",                               dEN:"Sets targets on fire."},
      {id:"sortudo6",    nPT:"Sortudo",     nEN:"Lucky",       dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"municoes2",   nPT:"Munições",    nEN:"Munitions",   dPT:"Cria munições aleatórias ao usar.",                  dEN:"Creates random ammo on use."},
      {id:"bolsos_fund", nPT:"Bolsos Fundos",nEN:"Deep Bags",  dPT:"Aumenta o raio e o número de estrepes.",             dEN:"Increases radius and number of caltrops."}
    ]
  },

  // ══════════════════════════════════════
  // MAGISTRAIS — KATANAS (EXPLÍCITAS)
  // ══════════════════════════════════════
  {
    id:"mao_yoshitsune", nPT:"Mão de Yoshitsune", nEN:"Yoshitsune's Hand",
    type:"katana", sub:"water", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Atordoar um alvo tem uma chance de 30% de derrubá-lo.", en:"Staggering a target has a 30% chance to cause a knock down."},
    // Props: pool da Katana Aquática (máximos fixos na UI)
    props: PROPS_KATANA,
    // Perks: Katana Aquática, SEM Mestre da Água (já embutido)
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_VENTO, PERK_LUA]
  },
  {
    id:"ira_sarugami", nPT:"Ira de Sarugami", nEN:"Wrath of Sarugami",
    type:"katana", sub:"water", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Aparar Perfeito triplo se torna um ataque especial. Remove a capacidade de aparar normalmente.", en:"Triple Perfect Parry becomes a special attack. Removes the ability to regular parry."},
    props: PROPS_KATANA,
    // Perks: Katana Aquática, SEM Mestre da Água (já embutido)
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_VENTO, PERK_LUA]
  },
  {
    id:"lamina_masamune", nPT:"Lâmina de Masamune", nEN:"Masamune's Edge",
    type:"katana", sub:"wind", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Ataques C/C têm uma chance de 20% de causarem dano dobrado.", en:"Melee has 20% chance to deal double damage."},
    props: PROPS_KATANA,
    // Perks: Katana Eólica, SEM Mestre do Vento (já embutido)
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_AGUA, PERK_LUA]
  },
  {
    id:"katana_mestre", nPT:"Katana de Mestre", nEN:"Master's Katana",
    type:"katana", sub:"all", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Permite trocar entre qualquer postura com R2 + (△, ☐, ◯, ✕)", en:"Allows switching between any Stance with R2 + (△, □, ○, ✕)."},
    props: PROPS_KATANA,
    // Tem todas as 4 posturas embutidas → NÃO tem perks de postura, NÃO tem perks Mestre de postura
    perks: PERK_KATANA_BASE
  },
  {
    id:"fustigador_pedra", nPT:"Fustigador de Pedra", nEN:"Stone Striker",
    type:"katana", sub:"stone", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Concede o Golpe Celestial (△+◯). Usar contra inimigos atordoados causa dano extra e repele inimigos próximos. Custa 1 Determinação.", en:"Grants Heavenly Strike (△+○). Using against staggered enemies deals extra damage and repels nearby enemies. Costs 1 Resolve."},
    props: PROPS_KATANA,
    // Perks: Katana Pétrea, SEM Mestre da Pedra (já embutido)
    perks: [...PERK_KATANA_BASE, PERK_AGUA, PERK_VENTO, PERK_LUA]
  },
  {
    id:"ceifador_demonios", nPT:"Ceifador de Demônios", nEN:"Demon Cutter",
    type:"katana", sub:"moon", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Atordoar um alvo tem 30% de chance de arremessar inimigos próximos.", en:"Staggering a target has a 30% chance to throw nearby enemies."},
    props: PROPS_KATANA,
    // Perks: Katana Lunar, SEM Mestre da Lua (já embutido)
    perks: [...PERK_KATANA_BASE, PERK_PEDRA, PERK_AGUA, PERK_VENTO]
  },

  // ══════════════════════════════════════
  // MAGISTRAIS — LONGO ALCANCE (EXPLÍCITAS)
  // ══════════════════════════════════════
  {
    id:"espirito_imponderavel", nPT:"Espírito Imponderável", nEN:"The Weightless Spirit",
    type:"ranged", sub:"shortbow", leg:true, by:null, cd:null,
    // Munição aumentada (magistral do Arco Curto)
    ammo:{pt:"Flecha Normal: 22\nFlecha Flamejante: 6 (9)\nFlecha Perfurante: (6)", en:"Normal Arrow: 22\nFire Arrow: 6 (9)\nPiercing Arrow: (6)"},
    xp:{pt:"As flechas não caem. Velocidade de recarga e disparo dramaticamente aumentadas.", en:"Arrows don't descend. Reload and draw speed dramatically increased."},
    // Pool: Arco Curto (igual ao normal)
    props: PROPS_ARCO,
    perks: PERKS_ARCO_CURTO
  },
  {
    id:"visao_sugaru", nPT:"Visão de Sugaru", nEN:"Sugaru's Sight",
    type:"ranged", sub:"longbow", leg:true, by:null, cd:null,
    ammo:{pt:"Flecha Normal: 15\nFlecha Flamejante: 3 (6)\nFlecha Tiro Múltiplo: 15", en:"Normal Arrow: 15\nFire Arrow: 3 (6)\nMultishot Arrow: 15"},
    xp:{pt:"Dispara até 3 flechas de uma vez, se tiver munição suficiente. Não compatível com Munição Perfurante.", en:"Shoot up to 3 arrows at once if you have enough ammo. Not compatible with Piercing Arrows."},
    // Props: pool do Arco Longo
    props: PROPS_ARCO,
    // Perks: Arco Longo SEM Restituição por Precisão, Disparo Arremessante, Disparo Certeiro, Olho de Águia, Versátil
    perks: [
      {id:"mun_env_vs",  nPT:"Munição Envenenada",    nEN:"Poisoned Ammo",        dPT:"Ataques de arco têm chance de aplicar Envenenamento.", dEN:"Bow attacks have a chance to apply Poison."},
      {id:"mun_afi_vs",  nPT:"Munição Afiada",        nEN:"Sharpened Ammo",       dPT:"Ataques de arco têm chance de aplicar Sangramento.",  dEN:"Bow attacks have a chance to apply Bleeding."},
      {id:"mun_elmo_vs", nPT:"Munição Perfura-Elmo",  nEN:"Helmet Piercing Ammo", dPT:"A Munição desta arma perfura elmos.",                 dEN:"Ammo pierces helmets."},
      {id:"mun_esc_vs",  nPT:"Munição Perfura-Escudo",nEN:"Shield Piercing Ammo", dPT:"A Munição desta arma perfura escudos.",               dEN:"Ammo pierces shields."}
    ]
  },
  {
    id:"arco_ricocheteador", nPT:"Arco Ricocheteador", nEN:"Skipping-Stone Bow",
    type:"ranged", sub:"longbow", leg:true, by:null, cd:null,
    ammo:{pt:"Flecha Normal: 15\nFlecha Flamejante: 5 (8)\nFlecha Perfurante: (6)", en:"Normal Arrow: 15\nFire Arrow: 5 (8)\nPiercing Arrow: (6)"},
    xp:{pt:"Disparos na cabeça ricocheteiam para um inimigo próximo.", en:"Headshots ricochet to nearby targets."},
    // Pool completo do Arco Longo (incluindo todos os perks extras)
    props: PROPS_ARCO,
    perks: PERKS_ARCO_LONGO
  },
  {
    id:"picada_celestial", nPT:"Picada Celestial", nEN:"Heaven's Sting",
    type:"ranged", sub:"blowgun", leg:true, by:["assassin","ronin"], cd:null,
    ammo:{pt:"Dardo Venenoso: 10\nDardo Alucinógeno: 2\nDardo Debilitante: 3", en:"Poison Dart: 10\nHallucination Dart: 2\nWeakening Dart: 3"},
    xp:{pt:"Dardos têm uma chance de 20% de matar instantaneamente alvos que não sejam Oni.", en:"20% chance to instantly kill non-oni targets."},
    // Pool: Zarabatana (igual)
    props: [
      {id:"dur_ef_pc",  nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1, mx:0.15,u:"%",sk:"statusDuration"},
      {id:"dano_ef_pc", nPT:"Dano de Efeito Colateral",   nEN:"Status Effect Damage",  sl:["P1","P2"],mn:0.1, mx:0.18,u:"%",sk:"statusDamage"},
      {id:"furtiv_pc",  nPT:"Furtividade",                nEN:"Stealth",               sl:["P1","P2"],mn:10,  mx:20,  u:"pts",sk:"stealth"},
      {id:"dano_furt_pc",nPT:"Dano de Ataque Furtivo",    nEN:"Stealth Attack Damage", sl:["P2"],      mn:0.1, mx:0.25,u:"%",sk:"stealthDamage"}
    ],
    perks: [
      {id:"mun_afi_pc",  nPT:"Munição Afiada",         nEN:"Sharpened Ammo",       dPT:"Ataques têm chance de aplicar Sangramento.",   dEN:"Attacks have a chance to apply Bleeding."},
      {id:"mun_elmo_pc", nPT:"Munição Perfura-Elmo",   nEN:"Helmet Piercing Ammo", dPT:"Munição desta arma perfura elmos.",             dEN:"Ammo pierces helmets."},
      {id:"mun_esc_pc",  nPT:"Munição Perfura-Escudo", nEN:"Shield Piercing Ammo", dPT:"Munição desta arma perfura escudos.",           dEN:"Ammo pierces shields."},
      {id:"dardos_pc",   nPT:"Dardos Alucinógenos",    nEN:"Hallucination Darts",  dPT:"Dardos Alucinógenos fazem inimigos atacarem uns aos outros.", dEN:"Hallucination Darts make enemies attack each other."},
      {id:"desbloq_ron_pc",nPT:"Desbloqueio do Ronin", nEN:"Ronin Unlock",         dPT:"Pode ser usada pelo Ronin.",                   dEN:"Can be used by Ronin."}
    ]
  },
  {
    id:"remedio_proibido", nPT:"Remédio Proibido", nEN:"Forbidden Medicine",
    type:"ranged", sub:"bombpack", leg:true, by:["ronin","assassin","samurai"], cd:null,
    // Munição inferior ao Pacote normal (para Samurai/Assassino: 6, mas 12 com perk)
    ammo:{pt:"Bomba de Concussão: 6 (12)\nBomba Luminosa: 2\nBomba de Pólvora: 2", en:"Concussion Bomb: 6 (12)\nFlash Bomb: 2\nBlack Powder Bomb: 2"},
    xp:{pt:"As bombas também curam aliados que estejam no raio da explosão. Quantidade de munição inferior ao Pacote normal.", en:"Bombs also heal allies within blast radius. Reduced ammo compared to normal Bomb Pack."},
    props: [
      {id:"atord_rp",nPT:"Dano Atordoante C/C",       nEN:"Melee Stagger Damage",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeStaggerDamage"},
      {id:"raio_rp", nPT:"Raio de Explosão",          nEN:"Blast Radius",          sl:["P1","P2"],mn:0.15,mx:0.25,u:"%",sk:"blastRadius"},
      {id:"dur_rp",  nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1, mx:0.15,u:"%",sk:"statusDuration"},
      {id:"dano_rp", nPT:"Dano de Efeito Colateral",  nEN:"Status Effect Damage",  sl:["P1","P2"],mn:0.1, mx:0.18,u:"%",sk:"statusDamage"}
    ],
    perks: [
      {id:"bomba_lum_rp",  nPT:"Bomba Luminosa",           nEN:"Flash Bomb",       dPT:"Adiciona Bombas Luminosas ao Pacote (L2+△).",            dEN:"Adds Flash Bombs to the Pack (L2+△)."},
      {id:"bomba_polv_rp", nPT:"Bomba de Pólvora",         nEN:"Black Powder Bomb",dPT:"Adiciona Bombas de Pólvora ao Pacote (L2+◯).",           dEN:"Adds Black Powder Bombs to the Pack (L2+◯)."},
      {id:"desbloq_ass_rp",nPT:"Desbloqueio de Assassino", nEN:"Assassin Unlock",  dPT:"Assassinos podem utilizar.",                             dEN:"Can be used by Assassin."},
      {id:"desbloq_sam_rp",nPT:"Samurais Desbloqueados",   nEN:"Samurai Unlock",   dPT:"Samurais podem utilizar.",                               dEN:"Can be used by Samurai."}
    ]
  },

  // ══════════════════════════════════════
  // MAGISTRAIS — AMULETOS (EXPLÍCITAS)
  // Nota: quando vinculado a uma classe, logic.js adiciona as
  // propriedades e vantagens exclusivas dessa classe.
  // ══════════════════════════════════════
  {
    id:"ultimo_suspiro", nPT:"Último Suspiro", nEN:"Last Breath",
    type:"charm", sub:"defense", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Em vez de receber dano letal, você se cura, restaurando 50 de vida. Pode ocorrer a cada 5 minutos.", en:"Instead of taking fatal damage, heal for 50 health. Can occur once every 5 minutes."},
    classBinding: true,
    props: [...CHARM_DEF_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"sermao_celestial", nPT:"Sermão Celestial", nEN:"Heavenly Rebuke",
    type:"charm", sub:"defense", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Ao executar um Golpe Celestial, há 50% de chance de um relâmpago acertar um inimigo próximo. Concede Golpe Celestial.", en:"On Heavenly Strike, 50% chance a lightning strike hits a nearby enemy. Grants Heavenly Strike."},
    classBinding: true,
    props: [...CHARM_DEF_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"ritmo_revigorante", nPT:"Ritmo Revigorante", nEN:"Restorative Rhythm",
    type:"charm", sub:"defense", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Tocar um tambor curativo curará todos os heróis feridos e reviverá qualquer pessoa que esteja incapacitada.", en:"Hitting a healing drum heals all wounded Ghosts and revives any downed Ghost."},
    classBinding: true,
    props: [...CHARM_DEF_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"olhar_sarugami", nPT:"Olhar de Sarugami", nEN:"Sarugami's Glare",
    type:"charm", sub:"defense", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"A Esquiva Perfeita vira um ataque que cega inimigos próximos.", en:"Perfect Dodge becomes an attack that blinds nearby enemies."},
    classBinding: true,
    // Props: Defesa base; class binding em logic.js
    props: [...CHARM_DEF_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"ult_confronto_benkei", nPT:"Último Confronto de Benkei", nEN:"Benkei's Last Stand",
    type:"charm", sub:"ranged", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"75% de chance de ignorar dano por flechas.", en:"75% chance to ignore arrow damage."},
    classBinding: true,
    // Pool base: Amuleto de Longo Alcance
    props: [...CHARM_DIST_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"remorso_enjo", nPT:"Remorso de Enjo", nEN:"Enjo's Remorse",
    type:"charm", sub:"melee", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Causa 15% de dano adicional quando a vida estiver cheia.", en:"Deal 15% bonus damage when at full health."},
    classBinding: true,
    props: [...CHARM_ATK_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"bravura_xogum", nPT:"Bravura do Xogum", nEN:"Shogun's Fortitude",
    type:"charm", sub:"stealth", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Concede imunidade a efeitos de clarões e venenos.", en:"Grants immunity to flash and poison effects."},
    classBinding: true,
    // Pool base: Amuleto de Furtividade
    props: [...CHARM_FURT_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },
  {
    id:"ferro_sagrado", nPT:"Ferro Sagrado", nEN:"Sacred Iron",
    type:"charm", sub:"defense", leg:true, by:null, cd:null, ammo:null,
    xp:{pt:"Enfraquece os inimigos que causarem dano corpo a corpo a você.", en:"Enemies that deal Melee damage to you have Weaken applied to them."},
    classBinding: true,
    props: [...CHARM_DEF_P1P2, ...CHARM_UTI_P1P2],
    perks: PERKS_CHARM_BASE
  },

  // ══════════════════════════════════════
  // MAGISTRAIS — ARMAS FANTASMA (EXPLÍCITAS)
  // ══════════════════════════════════════
  {
    id:"surpresa_sra_sanjo", nPT:"Surpresa de Sra. Sanjo", nEN:"Lady Sanjo's Surprise",
    type:"gw1", sub:"dirtthrow", leg:true, by:null, cd:40, ammo:null,
    xp:{pt:"Um arremesso de terra com 25% de chance de fazer os alvos alucinarem.", en:"A Dirt Throw with 25% chance to cause enemies to hallucinate."},
    props: mkGW1Props([{id:"janela_ss",nPT:"Janela de Aparo Perfeito",nEN:"Perfect Parry Window",sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"parryWindow"}]),
    perks: [
      {id:"em_chamas_ss",nPT:"Em Chamas",nEN:"Fired Up",dPT:"Incendeia os alvos.",dEN:"Sets targets on fire."},
      {id:"sortudo_ss",  nPT:"Sortudo",  nEN:"Lucky",   dPT:"15% de chance de zerar o tempo de recarga ao usar.",dEN:"15% chance to reset cooldown on use."},
      {id:"podridao_ss", nPT:"Podridão", nEN:"Rancid",  dPT:"Enfraquece os alvos ao atingi-los.",dEN:"Weakens targets on hit."}
    ]
  },
  {
    id:"kunai_espiritual", nPT:"Kunai Espiritual", nEN:"Spirit Kunai",
    type:"gw1", sub:"kunai", leg:true, by:null, cd:30, ammo:null,
    xp:{pt:"Obter um abate com kunai reduz os tempos de recarga para o seu personagem em 10 segundos.", en:"Getting a kill with Kunai lowers all cooldowns on your character by 10 seconds."},
    props: mkGW1Props([{id:"dano_cc_ks",nPT:"Dano Corpo a Corpo",nEN:"Melee Damage",sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeDamage"}]),
    perks: [
      {id:"em_chamas_ks",nPT:"Em Chamas",     nEN:"Fired Up",       dPT:"Incendeia os alvos.",                                   dEN:"Sets targets on fire."},
      {id:"sortudo_ks",  nPT:"Sortudo",       nEN:"Lucky",          dPT:"15% de chance de zerar o tempo de recarga ao usar.",    dEN:"15% chance to reset cooldown on use."},
      {id:"superm_ks",   nPT:"Supermassiva",  nEN:"Super Massive",  dPT:"Causa dano adicional e derruba inimigos mais leves.",   dEN:"Deals extra damage and knocks down lighter enemies."},
      {id:"laminas_ks",  nPT:"Lâminas Ocultas",nEN:"Hidden Blades",dPT:"Arremessa 5 Kunai de uma só vez.",                     dEN:"Throws 5 Kunai at once."}
    ]
  },
  {
    id:"toque_ceus", nPT:"O Toque dos Céus", nEN:"The Touch of Heaven",
    type:"gw1", sub:"stickybomb", leg:true, by:null, cd:90, ammo:null,
    xp:{pt:"A Bomba Aderente também cura aliados ao atingi-los.", en:"A Sticky Bomb that also heals allies on hit."},
    props: mkGW1Props([{id:"raio_tc",nPT:"Raio de Explosão",nEN:"Blast Radius",sl:["P1","P2"],mn:0.15,mx:0.25,u:"%",sk:"blastRadius"}]),
    perks: [
      {id:"em_chamas_tc",nPT:"Em Chamas",     nEN:"Fired Up",         dPT:"Incendeia os alvos.",                                 dEN:"Sets targets on fire."},
      {id:"sortudo_tc",  nPT:"Sortudo",       nEN:"Lucky",            dPT:"15% de chance de zerar o tempo de recarga ao usar.",  dEN:"15% chance to reset cooldown on use."},
      {id:"raio_aum_tc", nPT:"Raio Aumentado",nEN:"Increased Radius", dPT:"O raio é aumentado em 50%.",                         dEN:"Radius is increased by 50%."}
    ]
  },
  {
    id:"bomba_magma", nPT:"Bomba de Magma", nEN:"Magma Bomb",
    type:"gw1", sub:"stickybomb", leg:true, by:null, cd:90, ammo:null,
    xp:{pt:"Prende-se a um inimigo e explode, atordoando atingidos, além de criar fumaça. Não derruba mais inimigos.", en:"Sticks to an enemy and explodes, staggering those hit, also creating a small smoke cloud. No longer knocks down enemies."},
    props: mkGW1Props([{id:"raio_bm",nPT:"Raio de Explosão",nEN:"Blast Radius",sl:["P1","P2"],mn:0.15,mx:0.25,u:"%",sk:"blastRadius"}]),
    perks: [
      {id:"em_chamas_bm",nPT:"Em Chamas",     nEN:"Fired Up",         dPT:"Incendeia os alvos.",                                 dEN:"Sets targets on fire."},
      {id:"sortudo_bm",  nPT:"Sortudo",       nEN:"Lucky",            dPT:"15% de chance de zerar o tempo de recarga ao usar.",  dEN:"15% chance to reset cooldown on use."},
      {id:"raio_aum_bm", nPT:"Raio Aumentado",nEN:"Increased Radius", dPT:"O raio é aumentado em 50%.",                         dEN:"Radius is increased by 50%."}
    ]
  },
  {
    id:"nevoa_yagata", nPT:"A Névoa de Yagata", nEN:"The Mist of Yagata",
    type:"gw2", sub:"smokebomb", leg:true, by:null, cd:120, ammo:null,
    xp:{pt:"Uma Bomba de Fumaça que também cura aliados com seus gases. Cura aumentada.", en:"A Smoke Bomb that also heals allies in the smoke. Increased healing."},
    props: mkGW2Props([
      {id:"dano_furt_ny",nPT:"Dano de Ataque Furtivo",  nEN:"Stealth Attack Damage",sl:["P1","P2"],mn:0.1,mx:0.25,u:"%",sk:"stealthDamage"},
      {id:"furtiv_ny",   nPT:"Furtividade",             nEN:"Stealth",              sl:["P1","P2"],mn:10, mx:20,  u:"pts",sk:"stealth"}
    ]),
    perks: [
      {id:"sortudo_ny",  nPT:"Sortudo",              nEN:"Lucky",          dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"municoes_ny", nPT:"Munições",             nEN:"Munitions",      dPT:"Cria munições aleatórias ao usar.",                  dEN:"Creates random ammo on use."},
      {id:"det_rep_ny",  nPT:"Determinação Repentina",nEN:"Sudden Resolve",dPT:"Preenche a primeira barra de Determinação ao usar.", dEN:"Fills first Resolve bar on use."},
      {id:"polvora_ny",  nPT:"Pólvora",              nEN:"Black Powder",   dPT:"Quando a bomba detona, inimigos próximos são arremessados para trás.", dEN:"On detonation, nearby enemies are knocked back."}
    ]
  },
  {
    id:"sementes_demoniacas", nPT:"Sementes Demoníacas", nEN:"Demon Seeds",
    type:"gw2", sub:"caltrops", leg:true, by:null, cd:90, ammo:null,
    xp:{pt:"Enfraquece os inimigos afetados pelos estrepes.", en:"Applies Weaken to affected enemies."},
    props: mkGW2Props([
      {id:"atord_sd",    nPT:"Dano Atordoante C/C",   nEN:"Melee Stagger Damage",  sl:["P1","P2"],mn:0.05,mx:0.12,u:"%",sk:"meleeStaggerDamage"},
      {id:"dano_af_sd",  nPT:"Dano de Arma Fantasma", nEN:"Ghost Weapon Damage",   sl:["P1","P2"],mn:0.12,mx:0.2, u:"%",sk:"ghostWeaponDamage"},
      {id:"dur_ef_sd",   nPT:"Duração de Efeito Colateral",nEN:"Status Effect Duration",sl:["P1","P2"],mn:0.1,mx:0.15,u:"%",sk:"statusDuration"}
    ]),
    perks: [
      {id:"em_chamas_sd",nPT:"Em Chamas",    nEN:"Fired Up",   dPT:"Incendeia os alvos.",                               dEN:"Sets targets on fire."},
      {id:"sortudo_sd",  nPT:"Sortudo",      nEN:"Lucky",      dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"municoes_sd", nPT:"Munições",     nEN:"Munitions",  dPT:"Cria munições aleatórias ao usar.",                  dEN:"Creates random ammo on use."},
      {id:"bolsos_sd",   nPT:"Bolsos Fundos",nEN:"Deep Bags",  dPT:"Aumenta o raio e o número de estrepes.",             dEN:"Increases radius and number of caltrops."}
    ]
  },
  {
    id:"sake_kenji", nPT:"Saquê Compartilhado de Kenji", nEN:"Kenji's Shared Brew",
    type:"gw2", sub:"healinggourd", leg:true, by:null, cd:90, ammo:null,
    xp:{pt:"Uma Cabaça Curativa que também cura aliados próximos ao ser usada. Pode ser usada mesmo com vida cheia.", en:"A Healing Gourd that also heals nearby allies when used. Can be used even at max health."},
    props: mkGW2Props([
      {id:"red_dano_kj", nPT:"Redução de Dano",         nEN:"Damage Reduction",     sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"damageReduction"},
      {id:"ganho_fer_kj",nPT:"Ganho de Det. Ferido",    nEN:"Injured Resolve Gain", sl:["P1","P2"],mn:0.1, mx:0.25,u:"%",sk:"resolveFromInjury"},
      {id:"oferta_kj",   nPT:"Oferenda Fantasma Vital", nEN:"Ghost Offering Health",sl:["P1","P2"],mn:10,  mx:25,  u:"pts",sk:"offeringHP"}
    ]),
    perks: [
      {id:"sortudo_kj",  nPT:"Sortudo",              nEN:"Lucky",         dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"det_rep_kj",  nPT:"Determinação Repentina",nEN:"Sudden Resolve",dPT:"Preenche a primeira barra de Determinação ao usar.", dEN:"Fills first Resolve bar on use."},
      {id:"bebida_kj",   nPT:"Bebida Forte",          nEN:"Strong Brew",   dPT:"A cura é ampliada em 50%.",                         dEN:"Healing is amplified by 50%."}
    ]
  },
  {
    id:"garrafa_coragem", nPT:"Garrafa de Coragem Líquida", nEN:"Bottle of Liquid Courage",
    type:"gw2", sub:"healinggourd", leg:true, by:null, cd:120, ammo:null,
    xp:{pt:"Enche menos a vida, mas também enche de 1-2 de Determinação. (Recarga: 120s)", en:"Refills less health on use, but also refills 1-2 Resolves. (120s Cooldown)"},
    props: mkGW2Props([
      {id:"red_dano_gc", nPT:"Redução de Dano",         nEN:"Damage Reduction",     sl:["P1","P2"],mn:0.05,mx:0.1, u:"%",sk:"damageReduction"},
      {id:"ganho_fer_gc",nPT:"Ganho de Det. Ferido",    nEN:"Injured Resolve Gain", sl:["P1","P2"],mn:0.1, mx:0.25,u:"%",sk:"resolveFromInjury"},
      {id:"oferta_gc",   nPT:"Oferenda Fantasma Vital", nEN:"Ghost Offering Health",sl:["P1","P2"],mn:10,  mx:25,  u:"pts",sk:"offeringHP"}
    ]),
    perks: [
      {id:"sortudo_gc",  nPT:"Sortudo",              nEN:"Lucky",         dPT:"15% de chance de zerar o tempo de recarga ao usar.", dEN:"15% chance to reset cooldown on use."},
      {id:"det_rep_gc",  nPT:"Determinação Repentina",nEN:"Sudden Resolve",dPT:"Preenche a primeira barra de Determinação ao usar.", dEN:"Fills first Resolve bar on use."},
      {id:"bebida_gc",   nPT:"Bebida Forte",          nEN:"Strong Brew",   dPT:"A cura é ampliada em 50%.",                         dEN:"Healing is amplified by 50%."}
    ]
  }
];

// ─── HELPERS DE CONSULTA ─────────────────────────────────────

/** Retorna todos os itens de um tipo para uma classe */
export function getGearForClass(type, classId) {
  return GEAR.filter(g => {
    if (g.type !== type) return false;
    if (!g.by) return true;              // sem restrição = qualquer classe
    return g.by.includes(classId);
  });
}

/** Resolve props de P1 ou P2 para um item */
export function getPropsForSlot(itemId, slot) {
  const item = GEAR.find(g => g.id === itemId);
  if (!item) return [];
  return item.props.filter(p => p.sl.includes(slot));
}

/** Retorna os perks disponíveis para um item */
export function getPerks(itemId) {
  const item = GEAR.find(g => g.id === itemId);
  return item ? item.perks : [];
}

/** Verifica se dois props são iguais (para bloquear P1 = P2) */
export function sameStatKey(propA, propB) {
  return propA && propB && propA.sk === propB.sk;
}

// ─── MAPEAMENTO: slot de equipamento → tipos de gear ────────
export const SLOT_TYPES = {
  katana: ["katana"],
  ranged: ["ranged"],
  charm:  ["charm"],
  gw1:    ["gw1"],
  gw2:    ["gw2"]
};
