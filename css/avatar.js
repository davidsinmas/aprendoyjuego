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

  function makeLayer(src,layer,kind,id){
    const img=document.createElement('img');
    img.src=src;
    img.alt='';
    img.draggable=false;
    img.className='avatar-layer';
    img.dataset.kind=kind;
    if(id)img.dataset.itemId=id;
    img.style.zIndex=String(layer);
    return img;
  }

  function render(container,data,{showBase=true,onAssetError=null}={}){
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

    if(showBase&&AVATAR.base.src)add(makeLayer(AVATAR.base.src,AVATAR.base.layer,'base',AVATAR.base.id));
    for(const item of equippedItems(data))add(makeLayer(item.avatarLayer,AVATAR.slots[item.slot].layer,'equipment',item.id));
    return container;
  }

  function inspectImageDimensions(src){
    return new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve({src,ok:img.naturalWidth===AVATAR.canvas.width&&img.naturalHeight===AVATAR.canvas.height,width:img.naturalWidth,height:img.naturalHeight,expected:{...AVATAR.canvas}});
      img.onerror=()=>resolve({src,ok:false,error:'No se pudo cargar el recurso',expected:{...AVATAR.canvas}});
      img.src=src;
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
    revoke,
    equip,
    unequip,
    equippedItems,
    render
  };
})();
