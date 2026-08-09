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
  items:[
    {
      id:'test_helmet_01',
      name:'Casco de prueba',
      description:'Objeto técnico para comprobar la tienda, el inventario y el equipamiento.',
      slot:'helmet',
      rarity:'common',
      price:5,
      shopIcon:'🪖',
      shopImage:null,
      avatarLayer:'assets/avatar/equipment/_technical/blank_1024.png',
      technical:true
    },
    {
      id:'test_weapon_01',
      name:'Arma de prueba',
      description:'Objeto técnico para comprobar la compra y el equipamiento.',
      slot:'weapon',
      rarity:'rare',
      price:8,
      shopIcon:'⚔️',
      shopImage:null,
      avatarLayer:'assets/avatar/equipment/_technical/blank_1024.png',
      technical:true
    }
  ]
};
