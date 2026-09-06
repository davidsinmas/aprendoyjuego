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

const EQUIPMENT_TIERS=[
  {id:'aprendiz',levelId:'aprendiz',order:1,directory:'common/',priceFactor:1},
  {id:'explorador',levelId:'explorador',order:2,directory:'rare/',priceFactor:2},
  {id:'aventurero',levelId:'aventurero',order:3,directory:'',priceFactor:4}
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

const AVATAR={
  schemaVersion:6,
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
    ...EQUIPMENT_TIERS.flatMap(tier=>EQUIPMENT_PIECES.map(piece=>({
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
    {id:'eclipse_helmet',name:'Casco Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'helmet',levelId:'guerrero',level:4,price:320,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_helmet.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_helmet.png',available:false},
    {id:'eclipse_chest',name:'Peto Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'chest',levelId:'guerrero',level:4,price:300,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_chest.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_chest.png',available:false},
    {id:'eclipse_shoulders',name:'Hombreras Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'shoulders',levelId:'guerrero',level:4,price:260,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_shoulders.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_shoulders.png',available:false},
    {id:'eclipse_gloves',name:'Guanteletes Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'gloves',levelId:'guerrero',level:4,price:240,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_gloves.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_gloves.png',available:false},
    {id:'eclipse_legs',name:'Grebas Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'legs',levelId:'guerrero',level:4,price:280,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_legs.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_legs.png',available:false},
    {id:'eclipse_boots',name:'Botas Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'boots',levelId:'guerrero',level:4,price:220,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_boots.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_boots.png',available:false},
    {id:'eclipse_shield',name:'Escudo Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'shield',levelId:'guerrero',level:4,price:340,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_shield.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_shield.png',available:false},
    {id:'eclipse_cannon',name:'Cañón Eclipse Áureo',description:'Equipamiento preparado para un nivel futuro.',slot:'weapon',levelId:'guerrero',level:4,price:380,characterId:'principal',shopImage:'assets/shop/eclipse_aureo/eclipse_cannon.png',avatarLayer:'assets/avatar/equipment/eclipse_aureo/eclipse_cannon.png',available:false}
  ]
};

window.AVATAR_LEVELS=AVATAR_LEVELS;
window.LEVEL_BY_ID=LEVEL_BY_ID;
window.LEVEL_BY_ORDER=LEVEL_BY_ORDER;
