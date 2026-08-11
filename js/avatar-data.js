/**
 * Infraestructura de avatar paper-doll.
 * Todos los PNG equipables deben compartir exactamente el mismo lienzo maestro.
 * No se permiten coordenadas, escala o rotación por objeto.
 */
const AVATAR={
  schemaVersion:2,
  canvas:{width:1024,height:1024},
  base:{
    id:'avatar_base',
    src:'assets/avatar/base/avatar_base.png',
    layer:10,
    optional:false
  },
  slots:{
    back:{layer:0,label:'Espalda'},
    legs:{layer:20,label:'Piernas'},
    boots:{layer:30,label:'Botas'},
    chest:{layer:40,label:'Pecho'},
    shoulders:{layer:50,label:'Hombreras'},
    gloves:{layer:60,label:'Brazos y guantes'},
    head:{layer:70,label:'Cabeza'},
    helmet:{layer:80,label:'Casco'},
    shield:{layer:90,label:'Escudo'},
    weapon:{layer:100,label:'Arma'},
    effects:{layer:110,label:'Efectos'}
  },
  rarities:{
    common:{label:'Común'},
    rare:{label:'Raro'},
    epic:{label:'Épico'},
    legendary:{label:'Legendario'}
  },
  collections:{
    nova_guardian:{
      name:'Guardián Nova',
      description:'Armadura espacial creada para proteger las estrellas.',
      itemCount:8
    }
  },
  items:[
    {
      id:'nova_helmet',
      name:'Casco Nova',
      description:'Visor estelar y protección completa para las misiones más difíciles.',
      slot:'helmet',
      rarity:'legendary',
      price:55,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_helmet.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_helmet.png'
    },
    {
      id:'nova_chest',
      name:'Peto Nova',
      description:'Núcleo de energía reforzado con acero y detalles dorados.',
      slot:'chest',
      rarity:'epic',
      price:42,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_chest.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_chest.png'
    },
    {
      id:'nova_shoulders',
      name:'Hombreras orbitales',
      description:'Placas ligeras preparadas para aventuras por toda la galaxia.',
      slot:'shoulders',
      rarity:'rare',
      price:28,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_shoulders.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_shoulders.png'
    },
    {
      id:'nova_gloves',
      name:'Guanteletes de impulso',
      description:'Canalizan energía para sujetar el equipo con máxima precisión.',
      slot:'gloves',
      rarity:'rare',
      price:26,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_gloves.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_gloves.png'
    },
    {
      id:'nova_legs',
      name:'Grebas del cometa',
      description:'Protección articulada para moverse rápido y con seguridad.',
      slot:'legs',
      rarity:'epic',
      price:34,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_legs.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_legs.png'
    },
    {
      id:'nova_boots',
      name:'Botas gravitatorias',
      description:'Botas magnéticas con suela reforzada para cualquier planeta.',
      slot:'boots',
      rarity:'rare',
      price:24,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_boots.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_boots.png'
    },
    {
      id:'nova_shield',
      name:'Escudo estelar',
      description:'Un campo protector de luz capaz de detener cualquier impacto.',
      slot:'shield',
      rarity:'epic',
      price:45,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_shield.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_shield.png'
    },
    {
      id:'nova_weapon',
      name:'Espada fotónica',
      description:'Hoja de energía Nova: brillante, poderosa y segura para el héroe.',
      slot:'weapon',
      rarity:'legendary',
      price:60,
      collection:'nova_guardian',
      shopImage:'assets/shop/nova_guardian/nova_weapon.png',
      avatarLayer:'assets/avatar/equipment/nova_guardian/nova_weapon.png'
    }
  ]
};
