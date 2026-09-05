/* Ludeiko V3.12 · el avatar de la pantalla principal usa siempre el personaje activo. */
(function(){
  'use strict';
  const refresh=()=>{if(!window.LudeikoCharacterSystem||typeof D==='undefined')return;try{window.LudeikoCharacterSystem.ensureModel();document.querySelectorAll('.avatar-stage').forEach(stage=>window.LudeikoCharacterSystem.renderPreview(stage));}catch(e){console.warn('[Ludeiko] Avatar principal:',e);}};
  const original=window.home;
  if(typeof original==='function')window.home=function(){const result=original.apply(this,arguments);setTimeout(refresh,0);return result;};
  setTimeout(refresh,0);
})();
