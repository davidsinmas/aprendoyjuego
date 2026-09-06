/* V3.14 · catálogo único: AVATAR → NIVEL → EQUIPAMIENTO. */
(function(){'use strict';
const items=(typeof AVATAR!=='undefined'&&Array.isArray(AVATAR.items))?AVATAR.items:[];
const levels=(typeof AVATAR_LEVELS!=='undefined'?AVATAR_LEVELS:[]).map(level=>({...level}));
const characters=(typeof AVATAR!=='undefined'&&AVATAR.characters)?Object.fromEntries(Object.entries(AVATAR.characters).map(([id,character])=>[id,{...character,compatibleItemIds:items.filter(item=>item.characterId===id&&item.available).map(item=>item.id)}])):{};
const elements={all:{id:'all',name:'Todo'},helmet:{id:'helmet',name:'Casco'},chest:{id:'chest',name:'Peto'},shoulders:{id:'shoulders',name:'Hombreras'},gloves:{id:'gloves',name:'Guanteletes'},legs:{id:'legs',name:'Grebas'},boots:{id:'boots',name:'Botas'},shield:{id:'shield',name:'Escudo'},weapon:{id:'weapon',name:'Arma'}};
const levelById=Object.fromEntries(levels.map(level=>[level.id,level]));
const enriched=items.map(item=>({...item,personaje:item.characterId,nivel:item.level,levelId:item.levelId,ordenCapa:typeof AVATAR!=='undefined'&&AVATAR.slots?.[item.slot]?AVATAR.slots[item.slot].layer:null,imagenTienda:item.shopImage,capaAvatar:item.avatarLayer,descripcion:item.description}));
window.LudeikoAvatarCatalog={version:3,levels,levelById,characters,elements,items:enriched};
})();
