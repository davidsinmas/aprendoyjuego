/**
 * Infraestructura de avatar paper-doll.
 * Todos los PNG equipables deben compartir exactamente el mismo lienzo maestro.
 * No se permiten coordenadas, escala o rotación por objeto.
 */
const AVATAR={
  schemaVersion:1,
  canvas:{width:1024,height:1024},
  base:{
    id:'avatar_base',
    src:'assets/avatar/base/avatar_base.png',
    layer:10,
    optional:true
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
  items:[]
};

/**
 * Formato de futuro objeto:
 * {
 *   id:'helmet_space_01',
 *   name:'Casco del Caballero Espacial',
 *   slot:'helmet',
 *   rarity:'rare',
 *   price:500,
 *   shopImage:'assets/shop/helmet_space_01.webp',
 *   avatarLayer:'assets/avatar/equipment/helmets/helmet_space_01.png',
 *   description:'...'
 * }
 *
 * El orden de capa se obtiene del slot. No añadir x, y, scale ni rotation.
 */
