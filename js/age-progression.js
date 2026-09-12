/* V3.14.0 — progresión 4–8 años para todos los juegos educativos. */
(function(){
  'use strict';
  const TYPES=['suma','resta','comparar','palabras','sopa','sonidoInicial','sonidoFinal','construir','ordenarSilabas','rimas'];
  const ageForLevel=level=>level<=3?4:level<=6?5:level<=9?6:level<=12?7:8;
  const age=()=>{const n=Number(D?.perfil?.edad);return Number.isInteger(n)&&n>=4&&n<=8?n:null;};
  const add=(type,items)=>{const list=GAME.levels[type];if(!Array.isArray(list))return;for(const item of items)if(!list.some(x=>x.id===item.id))list.push(item);};

  add('comparar',[
    {id:'comparar11',level:11,name:'Nivel 11',desc:'Números hasta 150 · diferencias próximas',min:20,max:150,minGap:1,maxGap:8,closeChance:1},
    {id:'comparar12',level:12,name:'Nivel 12',desc:'Números hasta 200 · diferencias próximas',min:50,max:200,minGap:1,maxGap:6,closeChance:1},
    {id:'comparar13',level:13,name:'Nivel 13',desc:'Números hasta 300 · diferencias pequeñas',min:50,max:300,minGap:1,maxGap:5,closeChance:1},
    {id:'comparar14',level:14,name:'Nivel 14',desc:'Números hasta 500 · números muy próximos',min:100,max:500,minGap:1,maxGap:4,closeChance:1},
    {id:'comparar15',level:15,name:'Nivel 15',desc:'Números hasta 1000 · discriminación fina',min:100,max:1000,minGap:1,maxGap:3,closeChance:1}
  ]);
  add('palabras',[
    {id:'palabras11',level:11,name:'Nivel 11',desc:'Completa palabras de 6–8 letras',mode:'missingLetter',minLen:6,maxLen:8},
    {id:'palabras12',level:12,name:'Nivel 12',desc:'Distingue palabras parecidas más largas',mode:'similarWord',minLen:5,maxLen:8},
    {id:'palabras13',level:13,name:'Nivel 13',desc:'Elige la palabra correcta entre 4 opciones',mode:'pictureWord4',minLen:5,maxLen:9},
    {id:'palabras14',level:14,name:'Nivel 14',desc:'Completa letras en palabras largas',mode:'missingLetter',minLen:7,maxLen:10},
    {id:'palabras15',level:15,name:'Nivel 15',desc:'Discriminación avanzada de palabras',mode:'similarWord',minLen:6,maxLen:10}
  ]);
  add('sopa',[
    {id:'sopa11',level:11,name:'Nivel 11',desc:'9 × 9 · 7 palabras de hasta 8 letras',size:9,count:7,minLen:5,maxLen:8,dirs:['h','v','d']},
    {id:'sopa12',level:12,name:'Nivel 12',desc:'10 × 10 · 7 palabras',size:10,count:7,minLen:5,maxLen:8,dirs:['h','v','d']},
    {id:'sopa13',level:13,name:'Nivel 13',desc:'10 × 10 · 8 palabras',size:10,count:8,minLen:5,maxLen:9,dirs:['h','v','d']},
    {id:'sopa14',level:14,name:'Nivel 14',desc:'11 × 11 · 8 palabras largas',size:11,count:8,minLen:6,maxLen:9,dirs:['h','v','d']},
    {id:'sopa15',level:15,name:'Nivel 15',desc:'11 × 11 · 9 palabras · máxima dificultad',size:11,count:9,minLen:5,maxLen:10,dirs:['h','v','d']}
  ]);
  add('sonidoInicial',[
    {id:'sonidoinicial11',level:11,name:'Nivel 11',desc:'5 opciones y palabras más largas',letters:'MPLSTNCBDFGRVZJQ',options:5,minLen:5,maxLen:9},
    {id:'sonidoinicial12',level:12,name:'Nivel 12',desc:'Discriminación entre 5 sonidos',letters:'MPLSTNCBDFGRVZJQ',options:5,minLen:6,maxLen:9},
    {id:'sonidoinicial13',level:13,name:'Nivel 13',desc:'Sonidos iniciales con vocabulario amplio',letters:'MPLSTNCBDFGRVZJQ',options:5,minLen:5,maxLen:10},
    {id:'sonidoinicial14',level:14,name:'Nivel 14',desc:'6 opciones de sonido inicial',letters:'MPLSTNCBDFGRVZJQ',options:6,minLen:5,maxLen:10},
    {id:'sonidoinicial15',level:15,name:'Nivel 15',desc:'Discriminación fina entre 6 opciones',letters:'MPLSTNCBDFGRVZJQ',options:6,minLen:6,maxLen:10}
  ]);
  add('sonidoFinal',[
    {id:'sonidofinal11',level:11,name:'Nivel 11',desc:'5 opciones de sonido final',endings:'AOLNSRZE',options:5,minLen:5,maxLen:9},
    {id:'sonidofinal12',level:12,name:'Nivel 12',desc:'Finales en palabras más largas',endings:'AOLNSRZE',options:5,minLen:6,maxLen:9},
    {id:'sonidofinal13',level:13,name:'Nivel 13',desc:'Discriminación de finales próximos',endings:'AOLNSRZE',options:5,minLen:5,maxLen:10},
    {id:'sonidofinal14',level:14,name:'Nivel 14',desc:'6 opciones de sonido final',endings:'AOLNSRZE',options:6,minLen:5,maxLen:10},
    {id:'sonidofinal15',level:15,name:'Nivel 15',desc:'Discriminación fina entre 6 opciones',endings:'AOLNSRZE',options:6,minLen:6,maxLen:10}
  ]);
  add('construir',[
    {id:'construir11',level:11,name:'Nivel 11',desc:'Palabras de 3–4 sílabas con distractores',minSyllables:3,maxSyllables:4,maxLen:10,distractors:2},
    {id:'construir12',level:12,name:'Nivel 12',desc:'Palabras largas con 2 distractores',minSyllables:3,maxSyllables:4,maxLen:11,distractors:2},
    {id:'construir13',level:13,name:'Nivel 13',desc:'Construcción de 4 sílabas',minSyllables:4,maxSyllables:4,maxLen:12,distractors:2},
    {id:'construir14',level:14,name:'Nivel 14',desc:'4 sílabas con 3 distractores',minSyllables:4,maxSyllables:4,maxLen:12,distractors:3},
    {id:'construir15',level:15,name:'Nivel 15',desc:'Construcción avanzada de palabras largas',minSyllables:3,maxSyllables:5,maxLen:12,distractors:3}
  ]);
  add('ordenarSilabas',[
    {id:'ordenarsilabas11',level:11,name:'Nivel 11',desc:'Ordena palabras de 3–4 sílabas',minSyllables:3,maxSyllables:4,maxLen:10},
    {id:'ordenarsilabas12',level:12,name:'Nivel 12',desc:'Palabras más largas de 3–4 sílabas',minSyllables:3,maxSyllables:4,maxLen:11},
    {id:'ordenarsilabas13',level:13,name:'Nivel 13',desc:'Ordena palabras de 4 sílabas',minSyllables:4,maxSyllables:4,maxLen:12},
    {id:'ordenarsilabas14',level:14,name:'Nivel 14',desc:'4 sílabas y vocabulario más amplio',minSyllables:4,maxSyllables:4,maxLen:12},
    {id:'ordenarsilabas15',level:15,name:'Nivel 15',desc:'Ordenación avanzada de palabras largas',minSyllables:3,maxSyllables:5,maxLen:12}
  ]);
  add('rimas',[
    {id:'rimas11',level:11,name:'Nivel 11',desc:'Rimas entre 4 opciones',groups:8,options:4,hard:true},
    {id:'rimas12',level:12,name:'Nivel 12',desc:'Rimas con distractores parecidos',groups:9,options:4,hard:true},
    {id:'rimas13',level:13,name:'Nivel 13',desc:'Rimas entre 5 opciones',groups:10,options:5,hard:true},
    {id:'rimas14',level:14,name:'Nivel 14',desc:'Discriminación avanzada de rimas',groups:12,options:5,hard:true},
    {id:'rimas15',level:15,name:'Nivel 15',desc:'Rimas de máxima dificultad',groups:99,options:5,hard:true}
  ]);

  for(const type of TYPES){
    const list=GAME.levels[type]||[];
    list.forEach((item,index)=>{item.level=index+1;item.name=`Nivel ${index+1}`;item.ageMin=ageForLevel(index+1);});
  }

  const originalUnlocked=window.levelUnlocked||levelUnlocked;
  window.levelUnlocked=function(type,index){
    if(parentMode)return true;
    const playerAge=age(),list=GAME.levels[type]||[],item=list[index];
    if(!item)return false;
    if(playerAge&&item.ageMin<=playerAge)return true;
    return originalUnlocked(type,index);
  };
  try{levelUnlocked=window.levelUnlocked;}catch(e){}

  const originalLevels=window.levels||levels;
  window.levels=function(type){
    originalLevels(type);
    if(parentMode)return;
    const playerAge=age();if(!playerAge)return;
    const list=GAME.levels[type]||[],rows=[...document.querySelectorAll('.level-row')];
    rows.forEach((row,index)=>{if(list[index]&&list[index].ageMin<playerAge)row.remove();});
    const help=document.querySelector('.level-help');
    if(help)help.textContent=`Edad configurada: ${playerAge} años. Se muestran los niveles adecuados en adelante; los más fáciles quedan ocultos.`;
  };
  try{levels=window.levels;}catch(e){}

  window.setPlayerAge=function(){
    const input=document.getElementById('ageInput'),value=Number(input?.value);
    D.perfil=D.perfil&&typeof D.perfil==='object'?D.perfil:{nombre:'Jugador'};
    if(input?.value===''||!Number.isFinite(value)){delete D.perfil.edad;save(D);parentDashboard();return;}
    D.perfil.edad=Math.min(8,Math.max(4,Math.round(value)));save(D);parentDashboard();
  };

  const originalParentDashboard=window.parentDashboard||parentDashboard;
  window.parentDashboard=function(){
    originalParentDashboard();
    const name=document.getElementById('nameInput');if(!name)return;
    const card=name.closest('.parent-card');if(!card||card.querySelector('#ageInput'))return;
    const saveName=card.querySelector('button');
    const block=document.createElement('div');
    block.innerHTML=`<label style="margin-top:.75rem">Edad</label><div style="display:flex;gap:.5rem;align-items:center"><input id="ageInput" type="number" inputmode="numeric" min="4" max="8" step="1" value="${age()||''}" placeholder="4–8" style="max-width:7rem"><button type="button" class="btn secondary" onclick="setPlayerAge()">Guardar edad</button></div><small class="muted">La edad oculta ejercicios demasiado fáciles y abre el punto de inicio adecuado. Los niveles superiores se desbloquean al avanzar.</small>`;
    if(saveName)saveName.insertAdjacentElement('afterend',block);else card.appendChild(block);
  };
  try{parentDashboard=window.parentDashboard;}catch(e){}

  window.LudeikoAgeProgression={ageForLevel,getAge:age};
})();
