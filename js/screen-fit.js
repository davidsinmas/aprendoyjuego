/* V3.8.0 · Encaje permanente al ancho del dispositivo */
(()=>{
  'use strict';
  document.documentElement.classList.add('aj-screen-fit');
  document.body.classList.add('aj-screen-fit');
  if(typeof D!=='undefined'){
    if(!D.ajustes||typeof D.ajustes!=='object')D.ajustes={};
    if(D.ajustes.ajustarPantalla!==true){D.ajustes.ajustarPantalla=true;if(typeof save==='function')save(D);}
  }
})();
