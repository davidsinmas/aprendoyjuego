(function(){
  'use strict';
  const VALID_SLOTS=Object.keys(AVATAR.slots);

  function getItem(id){
    return AVATAR.items.find(item=>item.id===id)||null;
  }
  function validateItem(item){
    const errors=[];
    if(!item||typeof item!=='object')return['Objeto no válido'];
    if(!item.id||typeof item.id!=='string')errors.push('Falta id');
    if(!VALID_SLOTS.includes(item.slot))errors.push(`Slot no válido: ${item.slot}`);
    if(!item.avatarLayer||typeof item.avatarLayer!=='string')errors.push('Falta avatarLayer');
    if(!Number.isFinite(Number(item.price))||Number(item.price)<0)errors.push('Precio no válido');
    if('x' in item||'y' in item||'scale' in item||'rotation' in item)errors.push('No se permiten ajustes de posición, escala o rotación por objeto');
    return errors;
  }
  function validateCatalog(){
    const seen=new Set(),problems=[];
    for(const item of AVATAR.items){
      const errors=validateItem(item);
      if(seen.has(item.id))errors.push('ID duplicado');
      seen.add(item.id);
      if(errors.length)problems.push({id:item.id||'(sin id)',errors});
    }
    return problems;
  }
  function ensureState(data){
    if(!data.avatar)data.avatar={owned:[],equipped:{}};
    if(!Array.isArray(data.avatar.owned))data.avatar.owned=[];
    if(!data.avatar.equipped||typeof data.avatar.equipped!=='object')data.avatar.equipped={};
    for(const slot of VALID_SLOTS)if(!(slot in data.avatar.equipped))data.avatar.equipped[slot]=null;
    return data.avatar;
  }
  function owns(data,itemId){
    return ensureState(data).owned.includes(itemId);
  }
  function grant(data,itemId){
    const item=getItem(itemId);
    if(!item)throw new Error(`Objeto de avatar desconocido: ${itemId}`);
    const avatar=ensureState(data);
    if(!avatar.owned.includes(itemId))avatar.owned.push(itemId);
    return true;
  }
  function priceFor(data,itemOrId){
    const item=typeof itemOrId==='string'?getItem(itemOrId):itemOrId;
    if(!item)return 0;
    const configured=Number(data?.ajustes?.multiplicadorPrecios);
    const fallback=Number(AVATAR.economy?.defaultPriceMultiplier)||1;
    const minimum=Number(AVATAR.economy?.minimumPriceMultiplier)||0.25;
    const maximum=Number(AVATAR.economy?.maximumPriceMultiplier)||3;
    const multiplier=Math.min(maximum,Math.max(minimum,Number.isFinite(configured)?configured:fallback));
    return Math.max(1,Math.round((Number(item.price)||0)*multiplier));
  }
  function buy(data,itemId){
    const item=getItem(itemId);
    if(!item)throw new Error(`Objeto de avatar desconocido: ${itemId}`);
    const avatar=ensureState(data);
    if(avatar.owned.includes(itemId))return{ok:false,reason:'owned',item};
    const price=priceFor(data,item);
    const diamonds=Math.max(0,Number(data.diamantes)||0);
    if(diamonds<price)return{ok:false,reason:'diamonds',item};
    data.diamantes=diamonds-price;
    avatar.owned.push(itemId);
    return{ok:true,item,spent:price};
  }
  function revoke(data,itemId){
    const avatar=ensureState(data);
    avatar.owned=avatar.owned.filter(id=>id!==itemId);
    for(const slot of VALID_SLOTS)if(avatar.equipped[slot]===itemId)avatar.equipped[slot]=null;
  }
  function equip(data,itemId,{allowUnowned=false}={}){
    const item=getItem(itemId);
    if(!item)throw new Error(`Objeto de avatar desconocido: ${itemId}`);
    const errors=validateItem(item);
    if(errors.length)throw new Error(`${itemId}: ${errors.join(', ')}`);
    if(!allowUnowned&&!owns(data,itemId))throw new Error(`El jugador no posee ${itemId}`);
    const avatar=ensureState(data);
    avatar.equipped[item.slot]=itemId;
    return item;
  }
  function unequip(data,slot){
    if(!VALID_SLOTS.includes(slot))throw new Error(`Slot no válido: ${slot}`);
    ensureState(data).equipped[slot]=null;
  }
  function equippedItems(data){
    const avatar=ensureState(data);
    return VALID_SLOTS
      .map(slot=>getItem(avatar.equipped[slot]))
      .filter(Boolean)
      .sort((a,b)=>AVATAR.slots[a.slot].layer-AVATAR.slots[b.slot].layer);
  }
  function previewItems(data,previewItemId){
    const bySlot=new Map(equippedItems(data).map(item=>[item.slot,item]));
    const preview=getItem(previewItemId);
    if(preview)bySlot.set(preview.slot,preview);
    return [...bySlot.values()]
      .sort((a,b)=>AVATAR.slots[a.slot].layer-AVATAR.slots[b.slot].layer);
  }
  function assetURL(src){
    const version=window.APP_VERSION;
    if(!version)return src;
    return `${src}${src.includes('?')?'&':'?'}v=${encodeURIComponent(version)}`;
  }
  function makeLayer(src,layer,kind,id,rarity='',collection=''){
    const img=document.createElement('img');
    img.src=assetURL(src);
    img.alt='';
    img.draggable=false;
    img.className='avatar-layer';
    img.dataset.kind=kind;
    if(id)img.dataset.itemId=id;
    if(rarity)img.dataset.rarity=rarity;
    if(collection)img.dataset.collection=collection;
    img.style.zIndex=String(layer);
    return img;
  }
  function render(container,data,{showBase=true,onAssetError=null,previewItemId=null}={}){
    if(typeof container==='string')container=document.querySelector(container);
    if(!container)throw new Error('No se encontró el contenedor del avatar');
    container.classList.add('avatar-stage');
    container.style.setProperty('--avatar-aspect',`${AVATAR.canvas.width}/${AVATAR.canvas.height}`);
    container.replaceChildren();
    const add=(img)=>{
      img.addEventListener('error',()=>{
        img.classList.add('avatar-asset-error');
        if(typeof onAssetError==='function')onAssetError(img.src,img.dataset.itemId||'base');
      },{once:true});
      container.appendChild(img);
    };
    const items=previewItemId?previewItems(data,previewItemId):equippedItems(data);
    const legendaryCount=items.filter(item=>item.rarity==='legendary').length;
    const eclipseCount=items.filter(item=>item.collection==='eclipse_aureo').length;
    container.classList.toggle('has-legendary',legendaryCount>0);
    container.classList.toggle('has-eclipse',eclipseCount>0);
    container.style.setProperty('--legendary-aura-opacity',String(Math.min(.26,.08+legendaryCount*.022)));
    container.style.setProperty('--eclipse-aura-opacity',String(Math.min(.34,.10+eclipseCount*.028)));
    if(showBase&&AVATAR.base.src)add(makeLayer(AVATAR.base.src,AVATAR.base.layer,'base',AVATAR.base.id));
    for(const item of items)add(makeLayer(item.avatarLayer,AVATAR.slots[item.slot].layer,previewItemId===item.id?'preview':'equipment',item.id,item.rarity,item.collection));
    return container;
  }
  function inspectImageDimensions(src){
    return new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve({src,ok:img.naturalWidth===AVATAR.canvas.width&&img.naturalHeight===AVATAR.canvas.height,width:img.naturalWidth,height:img.naturalHeight,expected:{...AVATAR.canvas}});
      img.onerror=()=>resolve({src,ok:false,error:'No se pudo cargar el recurso',expected:{...AVATAR.canvas}});
      img.src=assetURL(src);
    });
  }
  async function validateAssets({includeBase=true}={}){
    const checks=[];
    if(includeBase&&AVATAR.base.src)checks.push(inspectImageDimensions(AVATAR.base.src));
    for(const item of AVATAR.items)checks.push(inspectImageDimensions(item.avatarLayer));
    return Promise.all(checks);
  }
  window.AvatarSystem={
    canvas:{...AVATAR.canvas},
    slots:{...AVATAR.slots},
    getItem,
    validateItem,
    validateCatalog,
    validateAssets,
    ensureState,
    owns,
    grant,
    priceFor,
    buy,
    revoke,
    equip,
    unequip,
    equippedItems,
    render
  };
})();
