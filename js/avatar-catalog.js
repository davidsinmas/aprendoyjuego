/* Ludeiko V3.12 · modelo de personajes, colecciones y categorías. Solo referencia assets existentes. */
(function(){
  'use strict';
  const existingItems=(typeof AVATAR!=='undefined'&&Array.isArray(AVATAR.items))?AVATAR.items:[];
  const compatibleItems=existingItems.map(item=>({
    ...item,
    categoria:'equipamiento',subcategoria:item.slot,personaje:'nova_guardian',coleccion:item.collection,rareza:item.rarity,precio:item.price,nivel:item.level,descripcion:item.description,imagenTienda:item.shopImage,capaAvatar:item.avatarLayer,ordenCapa:(typeof AVATAR!=='undefined'&&AVATAR.slots?.[item.slot])?AVATAR.slots[item.slot].layer:null,compatibleCon:['nova_guardian'],compatibleWith:['nova_guardian']
  }));
  const collections={
    nova_guardian:{id:'nova_guardian',name:'Guardián Nova',description:'Equipamiento espacial ya disponible en el juego.',characterId:'nova_guardian',status:'available'},
    eclipse_aureo:{id:'eclipse_aureo',name:'Eclipse Áureo',description:'Colección de obsidiana y oro ya disponible.',characterId:'nova_guardian',status:'available'},
    horizonte:{id:'horizonte',name:'Horizonte',description:'Colección preparada para nuevos assets compatibles.',characterId:'nova_guardian',status:'pending_assets'}
  };
  const characters={
    nova_guardian:{id:'nova_guardian',name:'Guardián Nova',description:'El personaje espacial actual de Ludeiko.',masterSrc:'assets/avatar/base/avatar_base.png',price:0,available:true,assetStatus:'available',collections:['nova_guardian','eclipse_aureo','horizonte'],compatibleItemIds:compatibleItems.map(i=>i.id)},
    personaje_femenino:{id:'personaje_femenino',name:'Personaje femenino',description:'Personaje preparado para incorporar su avatar maestro aprobado.',masterSrc:null,price:250,available:false,assetStatus:'pending_asset',collections:['femenino_1','femenino_2','femenino_3'],compatibleItemIds:[]},
    personaje_animal:{id:'personaje_animal',name:'Personaje animal',description:'Personaje preparado para incorporar su avatar maestro aprobado.',masterSrc:null,price:350,available:false,assetStatus:'pending_asset',collections:['animal_1','animal_2','animal_3'],compatibleItemIds:[]}
  };
  const futureCollection=(id,name,characterId)=>({id,name,description:'Estructura preparada para assets futuros.',characterId,status:'pending_assets'});
  Object.assign(collections,
    futureCollection('femenino_1','Colección 1','personaje_femenino'),futureCollection('femenino_2','Colección 2','personaje_femenino'),futureCollection('femenino_3','Colección 3','personaje_femenino'),
    futureCollection('animal_1','Colección 1','personaje_animal'),futureCollection('animal_2','Colección 2','personaje_animal'),futureCollection('animal_3','Colección 3','personaje_animal')
  );
  const categories={personajes:{id:'personajes',name:'Personajes',type:'characters'},colecciones:{id:'colecciones',name:'Colecciones',type:'collections'},personalizacion:{id:'personalizacion',name:'Personalización',type:'future'},equipamiento:{id:'equipamiento',name:'Equipamiento',type:'items'}};
  window.LudeikoAvatarCatalog={version:1,characters,collections,categories,items:compatibleItems};
})();
