/* V3.8.18 · Avatar visible en la cabecera y Rimas desactivado por defecto. */
(function(){
  'use strict';

  function keepRimasDisabledByDefault(){
    if(typeof D==='undefined')return;
    D.ajustes=D.ajustes&&typeof D.ajustes==='object'?D.ajustes:{};
    const settings=D.ajustes.juegosActivos&&typeof D.ajustes.juegosActivos==='object'?D.ajustes.juegosActivos:{};
    /* Solo fija el valor inicial. Si Padres lo activa, se conserva entre sesiones. */
    if(typeof settings.rimas!=='boolean'){
      settings.rimas=false;
      D.ajustes.juegosActivos=settings;
      if(typeof save==='function')save(D);
    }
  }

  function renderHomeAvatar(){
    const head=document.querySelector('.home-head');
    const brand=document.querySelector('.home-head .brand');
    if(!head||!brand||!window.AvatarSystem)return;
    let stage=head.querySelector('.home-avatar');
    if(!stage){
      stage=document.createElement('div');
      stage.className='home-avatar';
      stage.setAttribute('aria-label','Avatar equipado');
      brand.insertBefore(stage,brand.firstChild);
    }
    try{
      window.AvatarSystem.render(stage,D,{showBase:true});
    }catch(error){
      stage.replaceChildren();
      stage.classList.add('home-avatar-error');
      console.warn('No se pudo renderizar el avatar de la pantalla principal.',error);
    }
  }

  keepRimasDisabledByDefault();

  if(typeof window.home==='function'){
    const originalHome=window.home;
    window.home=function(){
      const result=originalHome.apply(this,arguments);
      renderHomeAvatar();
      return result;
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderHomeAvatar,{once:true});
  else renderHomeAvatar();
})();
