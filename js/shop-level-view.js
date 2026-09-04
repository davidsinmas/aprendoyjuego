/* V3.10.5 · La tienda muestra únicamente el nivel del jugador. */
(function(){
  'use strict';
  const STORE='aprendo_jugando_datos';
  let adjusting=false;

  function playerLevel(){
    try{
      const data=JSON.parse(localStorage.getItem(STORE)||'null');
      return Math.max(1,Number(data?.nivelJugador)||1);
    }catch(e){return 1;}
  }

  function applyShopLevel(){
    const cards=[...document.querySelectorAll('.shop-layout .shop-card')];
    if(!cards.length)return;
    const level=playerLevel();
    const matching=cards.filter(card=>{
      const text=card.querySelector('.shop-slot')?.textContent||'';
      const match=text.match(/Nivel\s+(\d+)/i);
      return match&&Number(match[1])===level;
    });

    cards.forEach(card=>{card.style.display=matching.includes(card)?'':'none';});

    const title=document.querySelector('.shop-layout .catalog-title');
    if(title)title.textContent=`${matching.length} ${matching.length===1?'pieza':'piezas'} · Nivel ${level}`;

    const selected=cards.find(card=>card.classList.contains('selected'));
    if(!matching.length||matching.includes(selected)||adjusting)return;

    const first=matching[0];
    adjusting=true;
    first.click();
    adjusting=false;
  }

  const originalShopScreen=window.shopScreen;
  if(typeof originalShopScreen!=='function')return;
  window.shopScreen=function(){
    originalShopScreen();
    applyShopLevel();
  };

  window.addEventListener('storage',event=>{
    if(event.key===STORE&&typeof window.shopScreen==='function'&&!adjusting){
      const shop=document.querySelector('.shop-layout');
      if(shop)window.shopScreen();
    }
  });
})();
