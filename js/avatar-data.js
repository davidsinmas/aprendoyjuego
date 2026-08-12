/**
 * Catálogo y configuración del avatar paper-doll.
 * Las 24 capas comparten el lienzo maestro 1024 × 1024 y vienen prealineadas.
 */
const NOVA_TIERS=[
  {id:'common',level:1,label:'Común',nameSuffix:'de cadete',priceFactor:1,directory:'common/'},
  {id:'rare',level:2,label:'Raro',nameSuffix:'de explorador',priceFactor:2,directory:'rare/'},
  {id:'legendary',level:3,label:'Legendario',nameSuffix:'Guardián Nova',priceFactor:4,directory:''}
];

const NOVA_PIECES=[
  {
    key:'helmet',asset:'nova_helmet',label:'Casco Nova',slot:'helmet',basePrice:54,
    descriptions:{
      common:'Aleación ligera y visor reforzado para las primeras misiones.',
      rare:'Visor de cobalto con sensores para descubrir nuevos mundos.',
      legendary:'Visor estelar de cobertura completa con halo de energía cian.'
    }
  },
  {
    key:'chest',asset:'nova_chest',label:'Peto Nova',slot:'chest',basePrice:48,
    descriptions:{
      common:'Protección de acero grafito con un núcleo Nova de baja potencia.',
      rare:'Acero de cobalto reforzado con un núcleo de energía azul.',
      legendary:'Núcleo estelar, acero de élite, detalles dorados y aura energética.'
    }
  },
  {
    key:'shoulders',asset:'nova_shoulders',label:'Hombreras Nova',slot:'shoulders',basePrice:38,
    descriptions:{
      common:'Placas de cobre y acero preparadas para entrenar con seguridad.',
      rare:'Placas plateadas para misiones más largas y exigentes.',
      legendary:'Placas de élite preparadas para proteger toda la galaxia.'
    }
  },
  {
    key:'gloves',asset:'nova_gloves',label:'Guanteletes Nova',slot:'gloves',basePrice:34,
    descriptions:{
      common:'Guanteletes firmes para sujetar el equipo durante el aprendizaje.',
      rare:'Canalizan energía azul con mayor precisión y potencia.',
      legendary:'Canalizan energía cian para controlar el equipo con máxima precisión.'
    }
  },
  {
    key:'legs',asset:'nova_legs',label:'Grebas Nova',slot:'legs',basePrice:44,
    descriptions:{
      common:'Armadura articulada de iniciación para moverse con confianza.',
      rare:'Protección articulada de cobalto para avanzar con rapidez.',
      legendary:'Protección articulada de élite para moverse con fuerza y velocidad.'
    }
  },
  {
    key:'boots',asset:'nova_boots',label:'Botas Nova',slot:'boots',basePrice:30,
    descriptions:{
      common:'Las primeras botas magnéticas del futuro guardián.',
      rare:'Botas magnéticas de cobalto para caminar por cualquier planeta.',
      legendary:'Botas gravitatorias de zafiro y oro con impulso de energía cian.'
    }
  },
  {
    key:'shield',asset:'nova_shield',label:'Escudo Nova',slot:'shield',basePrice:58,
    descriptions:{
      common:'Escudo de entrenamiento equilibrado y resistente.',
      rare:'Campo de defensa azul con borde de acero plateado.',
      legendary:'Campo protector dorado capaz de detener cualquier impacto.'
    }
  },
  {
    key:'weapon',asset:'nova_weapon',label:'Espada Nova',slot:'weapon',basePrice:64,
    descriptions:{
      common:'Hoja de energía estable para comenzar el entrenamiento estelar.',
      rare:'Hoja de energía azul para las misiones de exploración.',
      legendary:'La hoja fotónica más poderosa de la colección Nova.'
    }
  }
];


const ECLIPSE_PIECES=[
  {id:'eclipse_helmet',name:'Casco Eclipse Áureo',slot:'helmet',price:320,asset:'eclipse_helmet',description:'Casco de obsidiana estelar con líneas de oro y visor de energía áurea.'},
  {id:'eclipse_chest',name:'Peto Eclipse Áureo',slot:'chest',price:300,asset:'eclipse_chest',description:'Armadura negra reforzada con núcleo dorado y placas de élite.'},
  {id:'eclipse_shoulders',name:'Hombreras Eclipse Áureo',slot:'shoulders',price:260,asset:'eclipse_shoulders',description:'Hombreras de obsidiana con bordes dorados para misiones de máximo nivel.'},
  {id:'eclipse_gloves',name:'Guanteletes Eclipse Áureo',slot:'gloves',price:240,asset:'eclipse_gloves',description:'Guanteletes negros con conductos de energía dorada de alta precisión.'},
  {id:'eclipse_legs',name:'Grebas Eclipse Áureo',slot:'legs',price:280,asset:'eclipse_legs',description:'Grebas articuladas oscuras con refuerzos áureos y gran movilidad.'},
  {id:'eclipse_boots',name:'Botas Eclipse Áureo',slot:'boots',price:220,asset:'eclipse_boots',description:'Botas de gravedad negras con estabilizadores dorados.'},
  {id:'eclipse_shield',name:'Escudo Eclipse Áureo',slot:'shield',price:340,asset:'eclipse_shield',description:'Escudo de obsidiana y oro preparado para las misiones más exigentes.'},
  {id:'eclipse_cannon',name:'Cañón Eclipse Áureo',slot:'weapon',price:380,asset:'eclipse_cannon',description:'Cañón estelar de gran tamaño con cuerpo negro, anillos dorados y núcleo luminoso.'}
];

const AVATAR={
  schemaVersion:5,
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
  rarities:Object.fromEntries(NOVA_TIERS.map(tier=>[tier.id,{label:tier.label,level:tier.level}])),
  economy:{
    defaultPriceMultiplier:1,
    minimumPriceMultiplier:0.25,
    maximumPriceMultiplier:3
  },
  collections:{
    nova_guardian:{
      name:'Guardián Nova',
      description:'Tres niveles de equipamiento espacial para proteger las estrellas.',
      itemCount:NOVA_TIERS.length*NOVA_PIECES.length
    },
    eclipse_aureo:{
      name:'Eclipse Áureo',
      description:'Equipamiento de nivel 4 en obsidiana negra y oro, con un cañón estelar exclusivo.',
      itemCount:ECLIPSE_PIECES.length
    }
  },
  items:[
    ...NOVA_TIERS.flatMap(tier=>NOVA_PIECES.map(piece=>({
      id:tier.id==='legendary'?piece.asset:`${piece.asset}_${tier.id}`,
      name:`${piece.label} ${tier.nameSuffix}`,
      description:piece.descriptions[tier.id],
      slot:piece.slot,
      rarity:tier.id,
      level:tier.level,
      price:piece.basePrice*tier.priceFactor,
      collection:'nova_guardian',
      shopImage:`assets/shop/nova_guardian/${tier.directory}${piece.asset}.png`,
      avatarLayer:`assets/avatar/equipment/nova_guardian/${tier.directory}${piece.asset}.png`
    }))),
    ...ECLIPSE_PIECES.map(piece=>({
      id:piece.id,
      name:piece.name,
      description:piece.description,
      slot:piece.slot,
      rarity:'legendary',
      level:4,
      price:piece.price,
      collection:'eclipse_aureo',
      shopImage:`assets/shop/eclipse_aureo/${piece.asset}.png`,
      avatarLayer:`assets/avatar/equipment/eclipse_aureo/${piece.asset}.png`
    }))
  ]
};
