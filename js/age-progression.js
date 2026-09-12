/* V3.15.0 — progresión educativa extensa de 4 a 8 años. */
(function(){
  'use strict';
  const TYPES=['suma','resta','comparar','palabras','sopa','sonidoInicial','sonidoFinal','construir','ordenarSilabas','rimas'];
  const TOTAL_LEVELS=50;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const ageForLevel=level=>clamp(4+Math.floor((level-1)/10),4,8);
  const age=()=>{const n=Number(D?.perfil?.edad);return Number.isInteger(n)&&n>=4&&n<=8?n:null;};
  const level=(type,n,desc,extra={})=>({id:`${type}${n}`,level:n,name:`Nivel ${n}`,desc,ageMin:ageForLevel(n),...extra});

  function mathLevels(type){
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10;
      const bases={4:[5,4],5:[10,5],6:[20,9],7:[50,15],8:[100,25]}[a];
      const aMax=bases[0]+Math.ceil(step*(a===4?0.6:a===5?1:a===6?2:a===7?5:10));
      const bMax=Math.min(aMax-1,bases[1]+Math.ceil(step*(a===4?0.4:a===5?0.7:a===6?1:a===7?2:4)));
      if(type==='suma')return level(type,n,`Números hasta ${aMax} · resultado hasta ${aMax+bMax}`,{aMax,bMax,resultMax:aMax+bMax});
      return level(type,n,`Primer número hasta ${aMax} · segundo hasta ${bMax} · sin negativos`,{aMax,bMax});
    });
  }

  function compareLevels(){
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10;
      const maxBase={4:10,5:20,6:50,7:200,8:500}[a],max=maxBase+Math.round(step*maxBase/5);
      const close=step>=5,maxGap=close?Math.max(2,12-step):undefined;
      return level('comparar',n,`Números hasta ${max}${close?' · diferencias próximas':''}`,{min:a>=7?10:1,max,minGap:1,...(maxGap?{maxGap,closeChance:.8}: {})});
    });
  }

  function wordLevels(){
    const modes=['pictureWord','pictureWord','completeSyllable','missingSyllable','missingLetter','order2','similarWord','order3','pictureWord4','similarWord'];
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10,mode=modes[step];
      const minLen=clamp(3+(a-4)+(step>=6?1:0),3,7),maxLen=clamp(minLen+2+(step>=8?1:0),5,10);
      return level('palabras',n,`Palabras de ${minLen}–${maxLen} letras · dificultad ${step+1}/10`,{mode,minLen,maxLen,minSyllables:step>=7?2:undefined,maxSyllables:step>=7?4:undefined});
    });
  }

  function soupLevels(){
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10,size=clamp(5+(a-4)+Math.floor(step/3),5,11),count=clamp(2+(a-4)+Math.floor(step/2),2,9);
      const dirs=step<3?['h']:step<6?['h','v']:['h','v','d'];
      const minLen=clamp(3+(a>=7?1:0)+(step>=7?1:0),3,6),maxLen=clamp(size,4,10);
      return level('sopa',n,`${size} × ${size} · ${count} palabras · ${dirs.length} direcciones`,{size,count,minLen,maxLen,dirs});
    });
  }

  function soundLevels(type){
    const initial='MPLSTNCBDFGRVZJQ',final='AOLNSRZE';
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10,options=clamp(3+Math.floor(step/3)+(a>=7?1:0),3,6),minLen=clamp(3+(a-4)+(step>=7?1:0),3,7),maxLen=clamp(minLen+3,6,10);
      const extra=type==='sonidoInicial'?{letters:initial.slice(0,clamp(5+(a-4)*3+step,5,initial.length))}:{endings:final.slice(0,clamp(4+(a-4)+Math.floor(step/2),4,final.length))};
      return level(type,n,`${options} opciones · palabras de ${minLen}–${maxLen} letras`,{options,minLen,maxLen,...extra});
    });
  }

  function syllableLevels(type){
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10,minSyllables=step<3?2:step<7?2+(a>=6?1:0):3,maxSyllables=clamp(minSyllables+(step>=5?1:0),2,5),maxLen=clamp(6+(a-4)+Math.floor(step/2),6,12);
      const distractors=type==='construir'?clamp(Math.floor(step/3)+(a>=7?1:0),0,3):0;
      return level(type,n,`${minSyllables}–${maxSyllables} sílabas${distractors?` · ${distractors} distractores`:''}`,{minSyllables,maxSyllables,maxLen,...(type==='construir'?{distractors}: {})});
    });
  }

  function rhymeLevels(){
    return Array.from({length:TOTAL_LEVELS},(_,i)=>{
      const n=i+1,a=ageForLevel(n),step=(n-1)%10,options=clamp(3+Math.floor(step/3)+(a>=7?1:0),3,5),groups=clamp(4+(a-4)*2+step,4,99),hard=step>=5||a>=7;
      return level('rimas',n,`${options} opciones · ${hard?'distractores parecidos':'rimas básicas'}`,{groups,options,hard});
    });
  }

  const generated={
    suma:mathLevels('suma'),resta:mathLevels('resta'),comparar:compareLevels(),palabras:wordLevels(),sopa:soupLevels(),
    sonidoInicial:soundLevels('sonidoInicial'),sonidoFinal:soundLevels('sonidoFinal'),construir:syllableLevels('construir'),ordenarSilabas:syllableLevels('ordenarSilabas'),rimas:rhymeLevels()
  };
  for(const type of TYPES)GAME.levels[type]=generated[type];

  const originalUnlocked=window.levelUnlocked||levelUnlocked;
  window.levelUnlocked=function(type,index){
    if(parentMode)return true;
    const playerAge=age(),list=GAME.levels[type]||[],item=list[index];
    if(!item)return false;
    const ageStart=playerAge?(playerAge-4)*10:0;
    if(playerAge&&index===ageStart)return true;
    if(playerAge&&index<ageStart)return true;
    return originalUnlocked(type,index);
  };
  try{levelUnlocked=window.levelUnlocked;}catch(e){}

  const originalLevels=window.levels||levels;
  window.levels=function(type){
    originalLevels(type);
    if(parentMode)return;
    const playerAge=age();if(!playerAge)return;
    const list=GAME.levels[type]||[],rows=[...document.querySelectorAll('.level-row')],start=(playerAge-4)*10;
    rows.forEach((row,index)=>{if(index<start)row.remove();});
    const help=document.querySelector('.level-help');
    if(help)help.textContent=`Edad configurada: ${playerAge} años. Punto de inicio: nivel ${start+1}. Los niveles siguientes se desbloquean al avanzar.`;
  };
  try{levels=window.levels;}catch(e){}

  window.setPlayerAge=function(){
    const input=document.getElementById('ageInput'),value=Number(input?.value);
    D.perfil=D.perfil&&typeof D.perfil==='object'?D.perfil:{nombre:'Jugador'};
    if(input?.value===''||!Number.isFinite(value)){delete D.perfil.edad;save(D);parentDashboard();return;}
    D.perfil.edad=clamp(Math.round(value),4,8);save(D);parentDashboard();
  };

  const originalParentDashboard=window.parentDashboard||parentDashboard;
  window.parentDashboard=function(){
    originalParentDashboard();
    const name=document.getElementById('nameInput');if(!name)return;
    const card=name.closest('.parent-card');if(!card||card.querySelector('#ageInput'))return;
    const saveName=card.querySelector('button'),block=document.createElement('div');
    block.innerHTML=`<label style="margin-top:.75rem">Edad</label><div style="display:flex;gap:.5rem;align-items:center"><input id="ageInput" type="number" inputmode="numeric" min="4" max="8" step="1" value="${age()||''}" placeholder="4–8" style="max-width:7rem"><button type="button" class="btn secondary" onclick="setPlayerAge()">Guardar edad</button></div><small class="muted">Cada edad dispone de un bloque de 10 niveles por juego. Los superiores se desbloquean progresivamente.</small>`;
    if(saveName)saveName.insertAdjacentElement('afterend',block);else card.appendChild(block);
  };
  try{parentDashboard=window.parentDashboard;}catch(e){}

  window.LudeikoAgeProgression={ageForLevel,getAge:age,totalLevels:TOTAL_LEVELS};
})();
