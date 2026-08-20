/* V3.5.6 · Opción de encaje lateral estable */
(()=>{
  'use strict';
  if(typeof D==='undefined')return;

  const KEY='ajustarPantalla';

  function ensureSetting(){
    if(!D.ajustes||typeof D.ajustes!=='object')D.ajustes={};
    if(typeof D.ajustes[KEY]!=='boolean'){
      D.ajustes[KEY]=true;
      if(typeof save==='function')save(D);
    }
  }

  function applyScreenFit(){
    ensureSetting();
    const enabled=D.ajustes[KEY]!==false;
    document.documentElement.classList.toggle('aj-screen-fit',enabled);
    document.body.classList.toggle('aj-screen-fit',enabled);
    return enabled;
  }

  function injectParentControl(){
    const grid=document.querySelector('.parent-grid');
    if(!grid||document.getElementById('screenFitParentCard'))return;
    const enabled=D.ajustes[KEY]!==false;
    const card=document.createElement('div');
    card.id='screenFitParentCard';
    card.className='parent-card';
    card.innerHTML=`<h3>📱 Ajuste de pantalla</h3><p class="muted">Hace que el juego encaje al ancho de la pantalla y evita el desplazamiento lateral accidental. El zoom con dos dedos sigue disponible.</p><button class="btn ${enabled?'primary':'secondary'}" type="button" aria-pressed="${enabled?'true':'false'}" onclick="toggleScreenFit()">${enabled?'✅ Ajuste al ancho activado':'○ Ajuste al ancho desactivado'}</button>`;
    grid.appendChild(card);
  }

  window.toggleScreenFit=function(){
    ensureSetting();
    D.ajustes[KEY]=!D.ajustes[KEY];
    if(typeof save==='function')save(D);
    applyScreenFit();
    if(typeof parentDashboard==='function'&&typeof parentMode!=='undefined'&&parentMode)parentDashboard();
  };

  const baseParentDashboard=typeof parentDashboard==='function'?parentDashboard:null;
  if(baseParentDashboard){
    parentDashboard=function(){
      const result=baseParentDashboard();
      injectParentControl();
      return result;
    };
  }

  ensureSetting();
  applyScreenFit();
})();
