(()=>{
  'use strict';
  if(typeof GAME==='undefined'||typeof EXERCISE_CATALOG==='undefined'||typeof startExercise!=='function')return;
  const TYPE='escribirLetras',ALPHABET='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const LEVELS=[
    {id:'escribirLetras1',level:1,name:'Nivel 1',desc:'Primeros trazos · I, O, L',letters:'IOL'},
    {id:'escribirLetras2',level:2,name:'Nivel 2',desc:'Vocales sencillas · A, E, I, O, U',letters:'AEIOU'},
    {id:'escribirLetras3',level:3,name:'Nivel 3',desc:'Letras de palos · L, T, I, E, F',letters:'LTIEF'},
    {id:'escribirLetras4',level:4,name:'Nivel 4',desc:'Curvas sencillas · C, O, U, J',letters:'COUJ'},
    {id:'escribirLetras5',level:5,name:'Nivel 5',desc:'Letras frecuentes · M, P, L, S',letters:'MPLS'},
    {id:'escribirLetras6',level:6,name:'Nivel 6',desc:'N, T, D y B',letters:'NTDB'},
    {id:'escribirLetras7',level:7,name:'Nivel 7',desc:'C, R, F y G',letters:'CRFG'},
    {id:'escribirLetras8',level:8,name:'Nivel 8',desc:'V, J, Z y H',letters:'VJZH'},
    {id:'escribirLetras9',level:9,name:'Nivel 9',desc:'Q, Y, X y K',letters:'QYXK'},
    {id:'escribirLetras10',level:10,name:'Nivel 10',desc:'W y Ñ · letras menos frecuentes',letters:'WÑ'},
    {id:'escribirLetras11',level:11,name:'Nivel 11',desc:'Repaso de vocales y consonantes frecuentes',letters:'AEIOUMPLSTN'},
    {id:'escribirLetras12',level:12,name:'Nivel 12',desc:'Repaso de consonantes',letters:'DBCRFGVJZH'},
    {id:'escribirLetras13',level:13,name:'Nivel 13',desc:'Letras con formas parecidas · P, B, D, R',letters:'PBDR'},
    {id:'escribirLetras14',level:14,name:'Nivel 14',desc:'Letras con formas parecidas · M, N, V, W',letters:'MNVW'},
    {id:'escribirLetras15',level:15,name:'Nivel 15',desc:'Letras con curvas · C, G, O, Q, S',letters:'CGOQS'},
    {id:'escribirLetras16',level:16,name:'Nivel 16',desc:'Letras menos frecuentes · H, J, K, X, Y, Z, Ñ',letters:'HJKXYZÑ'},
    {id:'escribirLetras17',level:17,name:'Nivel 17',desc:'Abecedario completo · práctica guiada',letters:ALPHABET},
    {id:'escribirLetras18',level:18,name:'Nivel 18',desc:'Abecedario completo · orden aleatorio',letters:ALPHABET},
    {id:'escribirLetras19',level:19,name:'Nivel 19',desc:'Reto de precisión · todas las letras',letters:ALPHABET},
    {id:'escribirLetras20',level:20,name:'Nivel 20',desc:'Reto maestro · todo el abecedario',letters:ALPHABET}
  ];
  GAME.levels[TYPE]=LEVELS;
  const config={type:TYPE,icon:'✍️',label:'Escribe la letra',menuTitle:'Escribe la letra',section:'reading',dailyGroup:'words',dailyLabel:'5 letras escritas',time:'3 min',engine:'handwriting',cardClass:'game-handwriting',detail:'Escucha y escribe con el dedo',activity:'10 letras'};
  if(!EXERCISE_CATALOG.some(item=>item.type===TYPE))EXERCISE_CATALOG.push(config);EXERCISE_BY_TYPE[TYPE]=config;if(!DAILY_TYPES.includes(TYPE))DAILY_TYPES.push(TYPE);if(Array.isArray(DAILY_GROUPS?.[1])&&!DAILY_GROUPS[1].includes(TYPE))DAILY_GROUPS[1].push(TYPE);DAILY_INFO[TYPE]={icon:config.icon,label:config.dailyLabel,time:config.time};if(!GAME_CONTROLS.some(item=>item.type===TYPE))GAME_CONTROLS.push({type:TYPE,icon:config.icon,label:config.label});
  const baseStartExercise=startExercise;startExercise=function(type,level,daily=false){if(type===TYPE){startHandwriting(level,daily);return;}return baseStartExercise(type,level,daily);};
  const LETTER_NAMES={A:'a',B:'be',C:'ce',D:'de',E:'e',F:'efe',G:'ge',H:'hache',I:'i',J:'jota',K:'ka',L:'ele',M:'eme',N:'ene','Ñ':'eñe',O:'o',P:'pe',Q:'cu',R:'erre',S:'ese',T:'te',U:'u',V:'uve',W:'uve doble',X:'equis',Y:'ye',Z:'zeta'};

  const RECOGNITION_SIZE=40;
  const STRUCTURAL_SENTINELS='IOAMSBRTCVXWZN';
  const CONFUSABLES={
    A:'RHV',B:'PRD',C:'OGQ',D:'OBP',E:'FBL',F:'ETP',G:'COQ',H:'NKA',I:'LTJ',J:'ILT',K:'RXH',L:'ITJ',
    M:'NWV',N:'MHW','Ñ':'NM',O:'CQD',P:'BRD',Q:'OGC',R:'PBK',S:'CGZ',T:'IFL',U:'VJO',V:'UWY',W:'MVU',X:'KY',Y:'VTX',Z:'SN'
  };

  let hw={canvas:null,ctx:null,drawing:false,hasInk:false,current:null,attempts:0,templates:new Map(),pointerId:null};

  function shuffledLetters(pool,count){const source=[...String(pool||ALPHABET)],out=[];while(out.length<count){const bag=[...source].sort(()=>Math.random()-.5);for(const letter of bag){if(out.length>=count)break;if(out.length&&out[out.length-1]===letter&&source.length>1)continue;out.push(letter);}}return out.slice(0,count);}

  function startHandwriting(level,daily=false){
    const n=typeof level==='number'?LEVELS[Math.max(0,Math.min(LEVELS.length-1,level-1))]:level;if(!n)return;
    state={...state,type:TYPE,level:n,daily:!!daily,qs:shuffledLetters(n.letters,daily?5:10),i:0,hits:0,total:daily?5:10,locked:false};
    prepareRecognition(state.qs);
    handwritingQuestion();
  }

  function speakCurrentLetter(){const letter=hw.current||state.qs[state.i-1];if(!letter)return;const text=`Escribe la letra ${LETTER_NAMES[letter]||letter}`;if('speechSynthesis'in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=1.02;u.pitch=1.04;const voices=window.speechSynthesis.getVoices();const preferred=voices.find(v=>/^es(-|_)?ES/i.test(v.lang)&&/female|mónica|monica|marta|paulina|helena|lucia|lucía/i.test(v.name))||voices.find(v=>/^es(-|_)?ES/i.test(v.lang))||voices.find(v=>/^es/i.test(v.lang));if(preferred)u.voice=preferred;window.speechSynthesis.speak(u);}}

  function handwritingQuestion(){if(state.i>=state.total){finishHandwriting();return;}hw.current=state.qs[state.i];hw.attempts=0;hw.hasInk=false;state.locked=false;const back=state.daily?'home()':`levels('${TYPE}')`;layout(`<div class="top"><button class="btn secondary back" onclick="${back}">← Salir</button>${diamond()}</div><div class="handwriting-shell"><div class="handwriting-heading"><div class="muted">Letra ${state.i+1} de ${state.total}</div><h2>Escucha y escribe</h2><p>Pulsa el altavoz si quieres volver a escucharla.</p></div><button type="button" class="handwriting-listen" id="handwritingListen">🔊</button><div class="handwriting-board-wrap"><canvas id="handwritingCanvas" class="handwriting-canvas" width="360" height="360"></canvas><div id="handwritingTyped" class="handwriting-typed" aria-hidden="true"></div><div class="handwriting-guide">Escribe una sola letra dentro del recuadro.</div></div><div class="handwriting-actions"><button type="button" class="btn secondary" id="handwritingClear">⌫ Borrar</button><button type="button" class="btn primary" id="handwritingCheck" disabled>✓ Comprobar</button></div><div id="handwritingMessage" class="handwriting-message" aria-live="polite"></div><div id="handwritingConfidence" class="handwriting-confidence"></div></div>`);state.i++;setupCanvas();document.getElementById('handwritingListen')?.addEventListener('click',speakCurrentLetter);document.getElementById('handwritingClear')?.addEventListener('click',clearHandwriting);document.getElementById('handwritingCheck')?.addEventListener('click',checkHandwriting);setTimeout(speakCurrentLetter,180);}

  function setupCanvas(){const canvas=document.getElementById('handwritingCanvas');if(!canvas)return;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#24323b';ctx.lineWidth=18;hw.canvas=canvas;hw.ctx=ctx;hw.drawing=false;hw.hasInk=false;hw.pointerId=null;const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};canvas.addEventListener('pointerdown',e=>{if(state.locked)return;e.preventDefault();hw.pointerId=e.pointerId;canvas.setPointerCapture?.(e.pointerId);const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();hw.drawing=true;hw.hasInk=true;toggleCheck(true);});canvas.addEventListener('pointermove',e=>{if(!hw.drawing||e.pointerId!==hw.pointerId||state.locked)return;e.preventDefault();const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();});const end=e=>{if(e.pointerId!==hw.pointerId)return;hw.drawing=false;hw.pointerId=null;};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('pointerleave',e=>{if(e.buttons===0)end(e);});}

  function toggleCheck(enabled){const b=document.getElementById('handwritingCheck');if(b)b.disabled=!enabled;}

  function clearHandwriting(){if(!hw.ctx||!hw.canvas)return;hw.ctx.clearRect(0,0,hw.canvas.width,hw.canvas.height);hw.hasInk=false;state.locked=false;toggleCheck(false);const typed=document.getElementById('handwritingTyped');if(typed){typed.textContent='';typed.classList.remove('show');}const m=document.getElementById('handwritingMessage'),c=document.getElementById('handwritingConfidence');if(m){m.textContent='';m.className='handwriting-message';}if(c)c.textContent='';}

  function normalizedBitmap(source,size=RECOGNITION_SIZE){
    const sourceCtx=source.getContext('2d',{willReadFrequently:true});if(!sourceCtx)return null;
    const image=sourceCtx.getImageData(0,0,source.width,source.height),w=source.width,h=source.height;
    let minX=w,minY=h,maxX=-1,maxY=-1;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(image.data[(y*w+x)*4+3]>35){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
    if(maxX<minX||maxY<minY)return null;
    const bw=maxX-minX+1,bh=maxY-minY+1;if(bw<7||bh<7)return null;
    const temp=document.createElement('canvas');temp.width=size;temp.height=size;
    const ctx=temp.getContext('2d',{willReadFrequently:true}),pad=3,scale=Math.min((size-pad*2)/bw,(size-pad*2)/bh),dw=bw*scale,dh=bh*scale,dx=(size-dw)/2,dy=(size-dh)/2;
    ctx.drawImage(source,minX,minY,bw,bh,dx,dy,dw,dh);
    const data=ctx.getImageData(0,0,size,size).data,mask=new Uint8Array(size*size);let count=0;
    for(let i=0;i<mask.length;i++)if(data[i*4+3]>42){mask[i]=1;count++;}
    if(count<12)return null;
    return{mask,count,aspect:bw/Math.max(1,bh),size,inkRatio:count/(size*size)};
  }

  function dilateMask(mask,size,radius=2){
    const out=new Uint8Array(mask.length);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(mask[y*size+x])for(let dy=-radius;dy<=radius;dy++){
      const yy=y+dy;if(yy<0||yy>=size)continue;
      for(let dx=-radius;dx<=radius;dx++){const xx=x+dx;if(xx<0||xx>=size)continue;if(dx*dx+dy*dy<=radius*radius)out[yy*size+xx]=1;}
    }
    return out;
  }

  function templateCanvas(letter,font,weight=400){
    const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;
    const ctx=canvas.getContext('2d');if(!ctx)return canvas;
    ctx.font=`${weight} 132px ${font}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.fillText(letter,90,94);
    return canvas;
  }

  function primitiveTemplate(letter){
    if(letter!=='I')return null;
    const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;const ctx=canvas.getContext('2d');if(!ctx)return null;
    ctx.strokeStyle='#000';ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(90,20);ctx.lineTo(90,160);ctx.stroke();
    return canvas;
  }

  function templateVariants(letter){
    if(hw.templates.has(letter))return hw.templates.get(letter);
    const variants=[],fonts=['Arial','Trebuchet MS','Verdana'],forms=[letter,letter.toLocaleLowerCase('es-ES')];
    for(const form of forms)for(const font of fonts)for(const weight of [400,700]){
      const normalized=normalizedBitmap(templateCanvas(form,font,weight));
      if(normalized)variants.push({...normalized,dilated:dilateMask(normalized.mask,normalized.size,2)});
    }
    const primitive=primitiveTemplate(letter),normalizedPrimitive=primitive&&normalizedBitmap(primitive);
    if(normalizedPrimitive)variants.push({...normalizedPrimitive,dilated:dilateMask(normalizedPrimitive.mask,normalizedPrimitive.size,2)});
    hw.templates.set(letter,variants);
    return variants;
  }

  function maskSimilarity(user,template,userDilated){
    let userNearTemplate=0,templateNearUser=0;
    for(let i=0;i<user.mask.length;i++){
      if(user.mask[i]&&template.dilated[i])userNearTemplate++;
      if(template.mask[i]&&userDilated[i])templateNearUser++;
    }
    const userCoverage=userNearTemplate/Math.max(1,user.count),templateCoverage=templateNearUser/Math.max(1,template.count);
    const aspectDelta=Math.abs(Math.log(Math.max(.08,user.aspect)/Math.max(.08,template.aspect))),aspectScore=Math.max(.48,1-aspectDelta*.32);
    return(.58*userCoverage+.42*templateCoverage)*aspectScore;
  }

  function bestLetterScore(user,letter,userDilated){
    let best=0;
    for(const template of templateVariants(letter)){const score=maskSimilarity(user,template,userDilated);if(score>best)best=score;}
    return best;
  }

  function recognitionLimits(level=Number(state.level?.level||1)){
    if(level<=6)return{minimum:.43,competitorMargin:.05};
    if(level<=16)return{minimum:.46,competitorMargin:.04};
    return{minimum:.49,competitorMargin:.03};
  }

  function candidateLetters(expected){return[...new Set([expected,...(CONFUSABLES[expected]||''),...STRUCTURAL_SENTINELS])];}

  function prepareRecognition(letters){
    const needed=new Set();
    for(const expected of new Set([...String(letters||'')]))for(const candidate of candidateLetters(expected))needed.add(candidate);
    for(const letter of needed)templateVariants(letter);
  }

  function recognizeExpected(canvas,expected){
    const user=normalizedBitmap(canvas);if(!user)return{accepted:false,reason:'empty'};
    const minAspect='ILTJ'.includes(expected)?.035:.10;
    if(user.inkRatio>.58||user.aspect<minAspect||user.aspect>5.5)return{accepted:false,reason:'shape'};
    const userDilated=dilateMask(user.mask,user.size,2),expectedScore=bestLetterScore(user,expected,userDilated);
    let bestLetter=expected,bestScore=expectedScore;
    for(const letter of candidateLetters(expected)){
      if(letter===expected)continue;
      const score=bestLetterScore(user,letter,userDilated);
      if(score>bestScore){bestScore=score;bestLetter=letter;}
    }
    const limits=recognitionLimits();
    return{
      accepted:expectedScore>=limits.minimum&&expectedScore>=bestScore-limits.competitorMargin,
      expectedScore,bestScore,bestLetter,reason:'shape'
    };
  }

  function morphToTypedLetter(letter){const typed=document.getElementById('handwritingTyped'),canvas=document.getElementById('handwritingCanvas');if(!typed||!canvas)return;typed.textContent=letter;canvas.classList.add('validated');typed.classList.add('show');}

  function checkHandwriting(){
    if(state.locked||!hw.hasInk||!hw.canvas)return;
    state.locked=true;toggleCheck(false);hw.attempts++;
    const expected=hw.current,result=recognizeExpected(hw.canvas,expected),accepted=result.accepted;
    const msg=document.getElementById('handwritingMessage'),confidence=document.getElementById('handwritingConfidence');
    if(accepted){
      if(hw.attempts===1)state.hits++;
      rewardProgressCorrect();
      if(msg){msg.textContent=hw.attempts===1?'¡Muy bien!':'¡Eso es!';msg.className='handwriting-message ok';}
      if(confidence)confidence.textContent='';
      morphToTypedLetter(expected);window.GameSound?.play('correct');setTimeout(handwritingQuestion,1350);
    }else{
      playChime('bad');
      if(msg){msg.textContent='Aún no parece la letra que has escuchado. Prueba otra vez.';msg.className='handwriting-message bad';}
      if(confidence)confidence.textContent='Puedes borrarla o escuchar la letra de nuevo.';
      state.locked=false;toggleCheck(true);
    }
  }

  function finishHandwriting(){if(state.daily){finishDailyActivity(TYPE,'¡Letras completadas!');return;}const n=state.level,s=stats(n.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[n.id]=s;const reward=levelDiamonds(n,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid">${nextLevelButton(TYPE,n)}<button class="btn secondary" onclick='startHandwriting(${JSON.stringify(n)})'>🔄 Jugar otra vez</button><button class="btn secondary" onclick="levels('${TYPE}')">▦ Volver a niveles</button></div>`);window.GameSound?.play(!wasDone&&nextLevelButton(TYPE,n)?'advance':'levelComplete');}

  window.startHandwriting=startHandwriting;window.speakCurrentLetter=speakCurrentLetter;
})();
