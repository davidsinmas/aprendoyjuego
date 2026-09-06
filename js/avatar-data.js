/**
 * Sistema de niveles y catálogo del avatar paper-doll.
 * Una única fuente de verdad para niveles, orden y nombres visibles.
 */
const AVATAR_LEVELS=[
  {id:'aprendiz',name:'Aprendiz',order:1},
  {id:'explorador',name:'Explorador',order:2},
  {id:'aventurero',name:'Aventurero',order:3},
  {id:'guerrero',name:'Guerrero',order:4},
  {id:'heroe',name:'Héroe',order:5},
  {id:'campeon',name:'Campeón',order:6},
  {id:'maestro',name:'Maestro',order:7},
  {id:'leyenda',name:'Leyenda',order:8}
];

const LEVEL_BY_ID=Object.fromEntries(AVATAR_LEVELS.map(level=>[level.id,level]));
const LEVEL_BY_ORDER=Object.fromEntries(AVATAR_LEVELS.map(level=>[level.order,level]));

// Tres niveles de equipamiento actualmente disponibles.
// El antiguo nivel intermedio ha sido eliminado del catálogo.
// El conjunto Eclipse Áureo es el equipamiento de máximo nivel disponible.
const EQUIPMENT_TIERS=[
  {id:'aprendiz',levelId:'aprendiz',order:1,directory:'common/',priceFactor:1},
  {id:'explorador',levelId:'explorador',order:2,directory:'',priceFactor:4},
  {id:'aventurero',levelId:'aventurero',order:3,directory:'eclipse_aureo/',priceFactor:1}
];

const EQUIPMENT_PIECES=[
  {key:'helmet',asset:'nova_helmet',label:'Casco',slot:'helmet',basePrice:54,description:'Protección ligera para las primeras misiones.'},
  {key:'chest',asset:'nova_chest',label:'Peto',slot:'chest',basePrice:48,description:'Protección frontal equilibrada para avanzar con seguridad.'},
  {key:'shoulders',asset:'nova_shoulders',label:'Hombreras',slot:'shoulders',basePrice:38,description:'Protección de hombros preparada para la aventura.'},
  {key:'gloves',asset:'nova_gloves',label:'Guanteletes',slot:'gloves',basePrice:34,description:'Protección de manos para manejar el equipo.'},
  {key:'legs',asset:'nova_legs',label:'Grebas',slot:'legs',basePrice:44,description:'Protección articulada para moverse con confianza.'},
  {key:'boots',asset:'nova_boots',label:'Botas',slot:'boots',basePrice:30,description:'Botas resistentes para explorar nuevos lugares.'},
  {key:'shield',asset:'nova_shield',label:'Escudo',slot:'shield',basePrice:58,description:'Escudo equilibrado para protegerse durante las misiones.'},
  {key:'weapon',asset:'nova_weapon',label:'Espada',slot:'weapon',basePrice:64,description:'Hoja de energía estable para las misiones.'}
];

const ECLIPSE_PIECES=[
  {key:'helmet',id:'eclipse_helmet',name:'Casco Eclipse Áureo',slot:'helmet',price:320,asset:'eclipse_helmet',description:'Casco de obsidiana estelar con líneas de oro y visor de energía áurea.'},
  {key:'chest',id:'eclipse_chest',name:'Peto Eclipse Áureo',slot:'chest',price:300,asset:'eclipse_chest',description:'Armadura negra reforzada con núcleo dorado y placas de élite.'},
  {key:'shoulders',id:'eclipse_shoulders',name:'Hombreras Eclipse Áureo',slot:'shoulders',price:260,asset:'eclipse_shoulders',description:'Hombreras de obsidiana con bordes dorados para misiones de máximo nivel.'},
  {key:'gloves',id:'eclipse_gloves',name:'Guanteletes Eclipse Áureo',slot:'gloves',price:240,asset:'eclipse_gloves',description:'Guanteletes negros con conductos de energía dorada de alta precisión.'},
  {key:'legs',id:'eclipse_legs',name:'Grebas Eclipse Áureo',slot:'legs',price:280,asset:'eclipse_legs',description:'Grebas articuladas oscuras con refuerzos áureos y gran movilidad.'},
  {key:'boots',id:'eclipse_boots',name:'Botas Eclipse Áureo',slot:'boots',price:220,asset:'eclipse_boots',description:'Botas de gravedad negras con estabilizadores dorados.'},
  {key:'shield',id:'eclipse_shield',name:'Escudo Eclipse Áureo',slot:'shield',price:340,asset:'eclipse_shield',description:'Escudo de obsidiana y oro preparado para las misiones más exigentes.'},
  {key:'weapon',id:'eclipse_cannon',name:'Cañón Eclipse Áureo',slot:'weapon',price:380,asset:'eclipse_cannon',description:'Cañón estelar de gran tamaño con cuerpo negro, anillos dorados y núcleo luminoso.'}
];

const AVATAR={
  schemaVersion:7,
  canvas:{width:1024,height:1024},
  levels:AVATAR_LEVELS,
  base:{id:'avatar_base',src:'assets/avatar/base/avatar_base.png',layer:10,optional:false},
  slots:{
    back:{layer:0,label:'Espalda'},legs:{layer:20,label:'Piernas'},boots:{layer:30,label:'Botas'},chest:{layer:40,label:'Pecho'},shoulders:{layer:50,label:'Hombreras'},gloves:{layer:60,label:'Brazos y guantes'},head:{layer:70,label:'Cabeza'},helmet:{layer:80,label:'Casco'},shield:{layer:90,label:'Escudo'},weapon:{layer:100,label:'Arma'},effects:{layer:110,label:'Efectos'}
  },
  economy:{defaultPriceMultiplier:1,minimumPriceMultiplier:0.25,maximumPriceMultiplier:3},
  characters:{
    principal:{id:'principal',name:'Avatar principal',description:'Avatar principal disponible.',levelId:'aventurero',masterSrc:'assets/avatar/base/avatar_base.png',price:0,available:true,assetStatus:'available'},
    personaje_femenino:{id:'personaje_femenino',name:'Personaje femenino',description:'Pendiente de avatar maestro aprobado.',levelId:'aprendiz',masterSrc:null,price:250,available:false,assetStatus:'pending_asset'},
    personaje_animal:{id:'personaje_animal',name:'Personaje animal',description:'Pendiente de avatar maestro aprobado.',levelId:'aprendiz',masterSrc:null,price:350,available:false,assetStatus:'pending_asset'}
  },
  items:[
    ...EQUIPMENT_TIERS.slice(0,2).flatMap(tier=>EQUIPMENT_PIECES.map(piece=>({
      id:`${piece.asset}_${tier.id}`,
      name:`${piece.label} ${LEVEL_BY_ID[tier.levelId].name}`,
      description:piece.description,
      slot:piece.slot,
      levelId:tier.levelId,
      level:tier.order,
      price:piece.basePrice*tier.priceFactor,
      characterId:'principal',
      shopImage:`assets/shop/nova_guardian/${tier.directory}${piece.asset}.png`,
      avatarLayer:`assets/avatar/equipment/nova_guardian/${tier.directory}${piece.asset}.png`,
      available:true
    }))),
    ...ECLIPSE_PIECES.map(piece=>({
      id:piece.id,
      name:piece.name,
      description:piece.description,
      slot:piece.slot,
      levelId:'aventurero',
      level:3,
      price:piece.price,
      characterId:'principal',
      shopImage:`assets/shop/eclipse_aureo/${piece.asset}.png`,
      avatarLayer:`assets/avatar/equipment/eclipse_aureo/${piece.asset}.png`,
      available:true
    }))
  ]
};

window.AVATAR_LEVELS=AVATAR_LEVELS;
window.LEVEL_BY_ID=LEVEL_BY_ID;
window.LEVEL_BY_ORDER=LEVEL_BY_ORDER;
