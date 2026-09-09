/* V3.17.0 · autodiagnóstico técnico de la tienda de Avatar. Solo se ejecuta con ?avatar-test=1. */
(function(){
  'use strict';
  function report(name,ok,detail){return {name,ok,detail:detail||''};}
  function checkImage(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src,ok:img.naturalWidth===1024&&img.naturalHeight===1024,width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>resolve({src,ok:false,width:0,height:0,error:'No se pudo cargar'});img.src=src+(src.includes('?')?'&':'?')+'v='+(window.APP_VERSION||'actual');});}
  function run(){
    const results=[];
    if(!window.AVATAR||!window.AvatarSystem){
      results.push(report('Inicialización',false,'AVATAR o AvatarSystem no está disponible.'));
      console.table(results);return results;
    }
    const catalogProblems=AvatarSystem.validateCatalog();
    results.push(report('Catálogo',catalogProblems.length===0,catalogProblems.length?JSON.stringify(catalogProblems):'Sin errores.'));
    const ids=AVATAR.items.map(i=>i.id),duplicateIds=ids.filter((id,i)=>ids.indexOf(id)!==i);
    results.push(report('IDs únicos',duplicateIds.length===0,duplicateIds.length?duplicateIds.join(', '):'Sin duplicados.'));
    const missingSlots=AVATAR.items.filter(i=>!AVATAR.slots[i.slot]).map(i=>i.id);
    results.push(report('Slots válidos',missingSlots.length===0,missingSlots.length?missingSlots.join(', '):'Todos los slots existen.'));
    const feline=AVATAR.items.filter(i=>i.characterId==='personaje_animal');
    results.push(report('Felino · 10 piezas',feline.length===10,`Detectadas ${feline.length}.`));
    const felineSlots=[...new Set(feline.map(i=>i.slot))];
    results.push(report('Felino · slots únicos',felineSlots.length===10,`Detectados ${felineSlots.length} slots.`));
    const levels=AVATAR_LEVELS||[];
    results.push(report('Progresión · 8 niveles',levels.length===8&&levels.every((l,i)=>l.order===i+1),`Detectados ${levels.length}.`));
    const masters=[...new Set(Object.values(AVATAR.characters).filter(c=>c.available&&c.masterSrc).map(c=>c.masterSrc))];
    const layers=AVATAR.items.filter(i=>i.available!==false&&i.avatarLayer).map(i=>i.avatarLayer);
    const assetSources=[...new Set([...masters,...layers])];
    Promise.all(assetSources.map(checkImage)).then(assetChecks=>{
      const failed=assetChecks.filter(x=>!x.ok);
      results.push(report('Assets paper-doll',failed.length===0,failed.length?failed.map(x=>`${x.src} (${x.width||0}x${x.height||0})`).join(', '):`${assetChecks.length} assets válidos en 1024×1024.`));
      const missingMasters=Object.values(AVATAR.characters).filter(c=>c.available&&c.masterSrc&&!assetChecks.some(x=>x.src===c.masterSrc&&x.ok)).map(c=>c.id);
      results.push(report('Avatares maestros',missingMasters.length===0,missingMasters.length?`Sin asset válido: ${missingMasters.join(', ')}.`:`${masters.length} avatar(es) maestro(s) válidos.`));
      window.dispatchEvent(new CustomEvent('avatar-test-complete',{detail:results}));
      console.table(results);
    });
    return results;
  }
  window.AvatarShopSelfTest={run};
  if(new URLSearchParams(location.search).get('avatar-test')==='1'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
    else run();
  }
})();
