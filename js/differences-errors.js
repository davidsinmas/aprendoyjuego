/* V3.5.4 · Tres intentos en Encuentra las diferencias */
(()=>{
  'use strict';
  if(typeof startDifferencesGame!=='function')return;

  const MAX_ERRORS=3;
  const baseStartDifferencesGame=startDifferencesGame;

  function renderErrorDots(){
    const board=document.getElementById('differencesBoard');
    if(!board)return;
    let indicator=document.getElementById('differencesErrors');
    if(!indicator){
      indicator=document.createElement('div');
      indicator.id='differencesErrors';
      indicator.className='differences-errors';
      indicator.setAttribute('aria-label','Errores permitidos');
      board.appendChild(indicator);
    }
    const errors=Math.max(0,Math.min(MAX_ERRORS,Number(differenceGame?.errors)||0));
    indicator.innerHTML=`<span class="differences-errors-label">FALLOS</span><span class="differences-error-dots">${Array.from({length:MAX_ERRORS},(_,index)=>`<i class="${index<errors?'used':''}"></i>`).join('')}</span>`;
  }

  function drawWrongMark(event){
    const board=document.getElementById('differencesBoard');
    if(!board)return;
    const rect=board.getBoundingClientRect();
    const mark=document.createElement('span');
    mark.className='difference-wrong-mark';
    mark.textContent='×';
    mark.style.left=`${event.clientX-rect.left}px`;
    mark.style.top=`${event.clientY-rect.top}px`;
    board.appendChild(mark);
  }

  function loseDifferenceScene(){
    if(!differenceGame||differenceGame.complete)return;
    differenceGame.complete=true;
    const scene=differenceGame.scene;
    const next=scene<DIFFERENCE_SCENES?scene+1:DIFFERENCE_SCENES;
    const progress=ensureDifferenceProgress();
    progress.actual=next;
    save(D);

    const board=document.getElementById('differencesBoard');
    const message=document.getElementById('differencesMessage');
    const actions=document.getElementById('differencesActions');
    board?.classList.add('complete','lost');
    if(message)message.innerHTML=scene<DIFFERENCE_SCENES
      ?`<b class="difference-lost-message">Tres fallos. Pasamos a la escena ${next}…</b>`
      :'<b class="difference-lost-message">Tres fallos. Inténtalo de nuevo.</b>';
    if(actions)actions.innerHTML=scene<DIFFERENCE_SCENES
      ?`<button class="btn primary" onclick="startDifferencesGame(${next})">➡️ Ir ahora a la escena ${next}</button>`
      :`<button class="btn primary" onclick="startDifferencesGame(${DIFFERENCE_SCENES})">🔄 Repetir escena 50</button><button class="btn secondary" onclick="home()">⌂ Volver al menú</button>`;

    if(scene<DIFFERENCE_SCENES){
      setTimeout(()=>{
        if(differenceGame?.complete&&differenceGame.scene===scene)startDifferencesGame(next);
      },1300);
    }
  }

  function registerWrongClick(event){
    if(!differenceGame||differenceGame.complete)return;
    differenceGame.errors=Math.min(MAX_ERRORS,(Number(differenceGame.errors)||0)+1);
    window.GameSound?.play('wrong');
    drawWrongMark(event);
    renderErrorDots();

    const message=document.getElementById('differencesMessage');
    if(differenceGame.errors>=MAX_ERRORS){
      loseDifferenceScene();
      return;
    }
    const remaining=MAX_ERRORS-differenceGame.errors;
    if(message)message.textContent=`Ese sitio no es una diferencia. Te ${remaining===1?'queda 1 fallo':'quedan '+remaining+' fallos'}.`;
  }

  startDifferencesGame=function(sceneNumber){
    const result=baseStartDifferencesGame(sceneNumber);
    if(!differenceGame)return result;
    differenceGame.errors=0;
    renderErrorDots();

    const board=document.getElementById('differencesBoard');
    if(board){
      board.addEventListener('click',event=>{
        if(event.target.closest('[data-diff]'))return;
        registerWrongClick(event);
      });
    }
    return result;
  };
})();
