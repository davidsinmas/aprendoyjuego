/* V3.5.7 · Ajuste dinámico de pantallas de ejercicio */
(()=>{
  'use strict';

  const root=document.documentElement;
  const app=document.getElementById('app');
  if(!app)return;

  let frame=0;

  function viewport(){
    const vv=window.visualViewport;
    return{
      width:Math.max(1,vv?.width||window.innerWidth||document.documentElement.clientWidth||1),
      height:Math.max(1,vv?.height||window.innerHeight||document.documentElement.clientHeight||1),
      top:Math.max(0,vv?.offsetTop||0)
    };
  }

  function isExerciseScreen(){
    return !!app.querySelector([
      '#wordGrid',
      '.answers',
      '.compare-numbers',
      '.listen-card',
      '.syllable-slots',
      '.syllable-bank',
      '.rhyme-prompt',
      '.differences-board'
    ].join(','));
  }

  function soupSize(){
    const grid=document.getElementById('wordGrid');
    if(!grid)return;

    const view=viewport();
    root.style.setProperty('--aj-exercise-vh',`${Math.round(view.height)}px`);
    root.classList.toggle('aj-soup-compact',view.height<700);
    root.classList.toggle('aj-soup-ultra',view.height<610);

    const card=grid.closest('.card');
    const status=document.getElementById('wordStatus');
    if(!card)return;

    const gridTop=grid.getBoundingClientRect().top;
    const viewportBottom=view.top+view.height;
    const statusHeight=status?status.getBoundingClientRect().height:22;
    const cardStyle=getComputedStyle(card);
    const bottomPadding=parseFloat(cardStyle.paddingBottom)||0;
    const availableHeight=Math.max(120,Math.floor(viewportBottom-gridTop-statusHeight-bottomPadding-6));
    const availableWidth=Math.max(120,Math.floor(card.clientWidth));
    const size=Math.max(120,Math.min(580,availableWidth,availableHeight));

    let cells=Number(typeof state!=='undefined'&&state?.level?.size)||0;
    if(!cells){
      const template=getComputedStyle(grid).gridTemplateColumns;
      cells=template?template.split(' ').length:4;
    }
    cells=Math.max(2,cells);

    const gap=size<300?2:size<410?3:4;
    const cell=(size-gap*(cells-1))/cells;
    const font=Math.max(11,Math.min(30,cell*.48));

    root.style.setProperty('--aj-soup-size',`${size}px`);
    root.style.setProperty('--aj-soup-gap',`${gap}px`);
    root.style.setProperty('--aj-soup-font',`${font.toFixed(1)}px`);
  }

  function fit(){
    frame=0;
    const exercise=isExerciseScreen();
    const soup=!!document.getElementById('wordGrid');
    root.classList.toggle('aj-exercise-fit',exercise);
    root.classList.toggle('aj-soup-fit',soup);

    const view=viewport();
    root.style.setProperty('--aj-exercise-vh',`${Math.round(view.height)}px`);
    root.style.setProperty('--aj-exercise-vw',`${Math.round(view.width)}px`);

    if(soup){
      requestAnimationFrame(soupSize);
    }else{
      root.classList.remove('aj-soup-compact','aj-soup-ultra');
    }
  }

  function queueFit(){
    if(frame)return;
    frame=requestAnimationFrame(fit);
  }

  const observer=new MutationObserver(queueFit);
  observer.observe(app,{childList:true,subtree:true});

  window.addEventListener('resize',queueFit,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(queueFit,60),{passive:true});
  window.visualViewport?.addEventListener('resize',queueFit,{passive:true});
  window.visualViewport?.addEventListener('scroll',queueFit,{passive:true});

  queueFit();
})();
