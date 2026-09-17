(()=>{
  'use strict';

  if(typeof GAME==='undefined'||typeof EXERCISE_CATALOG==='undefined'||typeof startExercise!=='function')return;

  const TYPE='escribirLetras';
  const ALPHABET='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
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
  const config={
    type:TYPE,
    icon:'✍️',
    label:'Escribe la letra',
    menuTitle:'Escribe la letra',
    section:'reading',
    dailyGroup:'words',
    dailyLabel:'5 letras escritas',
    time:'3 min',
    engine:'handwriting',
    cardClass:'game-handwriting',
    detail:'Escucha y escribe con el dedo',
    activity:'10 letras'
  };

  if(!EXERCISE_CATALOG.some(item=>item.type===TYPE))EXERCISE_CATALOG.push(config);
  EXERCISE_BY_TYPE[TYPE]=config;
  if(!DAILY_TYPES.includes(TYPE))DAILY_TYPES.push(TYPE);
  if(Array.isArray(DAILY_GROUPS?.[1])&&!DAILY_GROUPS[1].includes(TYPE))DAILY_GROUPS[1].push(TYPE);
  DAILY_INFO[TYPE]={icon:config.icon,label:config.dailyLabel,time:config.time};
  if(!GAME_CONTROLS.some(item=>item.type===TYPE))GAME_CONTROLS.push({type:TYPE,icon:config.icon,label:config.label});

  const baseStartExercise=startExercise;
  startExercise=function(type,level,daily=false){
    if(type===TYPE){
      startHandwriting(level,daily);
      return;
    }
    return baseStartExercise(type,level,daily);
  };

  const LETTER_NAMES={
    A:'a',B:'be',C:'ce',D:'de',E:'e',F:'efe',G:'ge',H:'hache',I:'i',J:'jota',K:'ka',L:'ele',
    M:'eme',N:'ene','Ñ':'eñe',O:'o',P:'pe',Q:'cu',R:'erre',S:'ese',T:'te',U:'u',V:'uve',
    W:'uve doble',X:'equis',Y:'ye',Z:'zeta'
  };
  const LETTER_VOICE_URL='assets/audio/narration/handwriting-letters.mp3';
  const LETTER_AUDIO_ORDER=[...ALPHABET];
  const RECOGNITION_SIZE=40;

  let letterVoice={context:null,buffer:null,segments:null,source:null,loading:null};
  let hw={canvas:null,ctx:null,drawing:false,hasInk:false,current:null,attempts:0,templates:new Map(),pointerId:null};

  function shuffledLetters(pool,count){
    const source=[...String(pool||ALPHABET)],out=[];
    while(out.length<count){
      const bag=[...source].sort(()=>Math.random()-.5);
      for(const letter of bag){
        if(out.length>=count)break;
        if(out.length&&out[out.length-1]===letter&&source.length>1)continue;
        out.push(letter);
      }
    }
    return out.slice(0,count);
  }

  function ensureAudioContext(){
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return null;
    if(!letterVoice.context)letterVoice.context=new AudioContextClass();
    return letterVoice.context;
  }

  function primeLetterAudio(){
    const context=ensureAudioContext();
    if(context?.state==='suspended'){
      try{
        const resume=context.resume();
        if(resume&&typeof resume.catch==='function')resume.catch(()=>{});
      }catch(e){}
    }
    return context;
  }

  function startHandwriting(level,daily=false){
    const n=typeof level==='number'?LEVELS[Math.max(0,Math.min(LEVELS.length-1,level-1))]:level;
    if(!n)return;
    primeLetterAudio();
    loadLetterVoice();
    state={...state,type:TYPE,level:n,daily:!!daily,qs:shuffledLetters(n.letters,daily?5:10),i:0,hits:0,total:daily?5:10,locked:false};
    handwritingQuestion();
  }

  function detectLetterSegments(buffer,targetCount){
    const data=buffer.getChannelData(0),sampleRate=buffer.sampleRate,frame=Math.max(128,Math.round(sampleRate*.02)),energy=[];
    let peak=0;
    for(let offset=0;offset<data.length;offset+=frame){
      let sum=0;
      const count=Math.min(frame,data.length-offset);
      for(let i=0;i<count;i++){const v=data[offset+i];sum+=v*v;}
      const rms=Math.sqrt(sum/Math.max(1,count));energy.push(rms);if(rms>peak)peak=rms;
    }
    const thresholds=[.045,.035,.055,.025,.07].map(ratio=>Math.max(.0015,peak*ratio));
    for(const threshold of thresholds){
      const silent=energy.map(value=>value<threshold),gaps=[];let start=-1;
      for(let i=0;i<=silent.length;i++){
        if(i<silent.length&&silent[i]){if(start<0)start=i;continue;}
        if(start>=0){
          const end=i,duration=(end-start)*frame/sampleRate;
          if(duration>=.1&&start>1&&end<silent.length-1)gaps.push({start,end,duration});
          start=-1;
        }
      }
      if(gaps.length<targetCount-1)continue;
      const chosen=[...gaps].sort((a,b)=>b.duration-a.duration).slice(0,targetCount-1).sort((a,b)=>a.start-b.start);
      const cuts=[0,...chosen.map(gap=>((gap.start+gap.end)/2)*frame/sampleRate),buffer.duration],segments=[];
      for(let i=0;i<targetCount;i++){
        const startTime=Math.max(0,cuts[i]-.035),endTime=Math.min(buffer.duration,cuts[i+1]+.035);
        segments.push({start:startTime,end:endTime});
      }
      if(segments.every(segment=>segment.end-segment.start>.65))return segments;
    }
    return Array.from({length:targetCount},(_,i)=>({start:buffer.duration*i/targetCount,end:buffer.duration*(i+1)/targetCount}));
  }

  async function loadLetterVoice(){
    if(letterVoice.buffer&&letterVoice.segments)return true;
    if(letterVoice.loading)return letterVoice.loading;
    letterVoice.loading=(async()=>{
      const context=ensureAudioContext();
      if(!context)throw new Error('Web Audio no disponible');
      const response=await fetch(LETTER_VOICE_URL,{cache:'force-cache'});
      if(!response.ok)throw new Error(`Audio ${response.status}`);
      const bytes=await response.arrayBuffer();
      letterVoice.buffer=await context.decodeAudioData(bytes.slice(0));
      letterVoice.segments=detectLetterSegments(letterVoice.buffer,LETTER_AUDIO_ORDER.length);
      return true;
    })().catch(error=>{
      console.warn('No se pudo cargar la voz de Escribe la letra',error);
      letterVoice.loading=null;
      return false;
    });
    return letterVoice.loading;
  }

  function speechFallback(letter){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return false;
    try{
      window.speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(`La letra ${LETTER_NAMES[letter]||letter}`);
      utterance.lang='es-ES';utterance.rate=.9;utterance.pitch=1.03;
      window.speechSynthesis.speak(utterance);
      return true;
    }catch(e){return false;}
  }

  async function speakCurrentLetter(fromGesture=false){
    const letter=hw.current||state.qs[state.i-1],index=LETTER_AUDIO_ORDER.indexOf(letter);
    if(index<0)return false;
    if(fromGesture)primeLetterAudio();
    const ready=await loadLetterVoice();
    if(!ready){speechFallback(letter);return false;}
    const context=letterVoice.context;
    if(context.state==='suspended'){try{await context.resume();}catch(e){}}
    if(context.state!=='running'){speechFallback(letter);return false;}
    if(letterVoice.source){try{letterVoice.source.stop();}catch(e){}letterVoice.source=null;}
    const segment=letterVoice.segments[index];
    if(!segment){speechFallback(letter);return false;}
    try{
      const source=context.createBufferSource();source.buffer=letterVoice.buffer;source.connect(context.destination);
      source.onended=()=>{if(letterVoice.source===source)letterVoice.source=null;};
      letterVoice.source=source;source.start(0,segment.start,Math.max(.1,segment.end-segment.start));
      return true;
    }catch(error){console.warn('No se pudo reproducir la letra',error);speechFallback(letter);return false;}
  }

  function handwritingQuestion(){
    if(state.i>=state.total){finishHandwriting();return;}
    hw.current=state.qs[state.i];hw.attempts=0;hw.hasInk=false;state.locked=false;
    const back=state.daily?'home()':`levels('${TYPE}')`;
    layout(`<div class="top"><button class="btn secondary back" onclick="${back}">← Salir</button>${diamond()}</div><div class="handwriting-shell"><div class="handwriting-heading"><div class="muted">Letra ${state.i+1} de ${state.total}</div><h2>Escucha y escribe</h2><p>Pulsa el altavoz si quieres volver a escucharla.</p></div><button type="button" class="handwriting-listen" id="handwritingListen" aria-label="Escuchar la letra">🔊</button><div class="handwriting-board-wrap"><canvas id="handwritingCanvas" class="handwriting-canvas" width="360" height="360"></canvas><div id="handwritingTyped" class="handwriting-typed" aria-hidden="true"></div><div class="handwriting-guide">Escribe una letra en mayúscula o minúscula.</div></div><div class="handwriting-actions"><button type="button" class="btn secondary" id="handwritingClear">⌫ Borrar</button><button type="button" class="btn primary" id="handwritingCheck" disabled>✓ Comprobar</button></div><div id="handwritingMessage" class="handwriting-message" aria-live="polite"></div><div id="handwritingConfidence" class="handwriting-confidence"></div></div>`);
    state.i++;setupCanvas();
    document.getElementById('handwritingListen')?.addEventListener('click',()=>{primeLetterAudio();void speakCurrentLetter(true);});
    document.getElementById('handwritingClear')?.addEventListener('click',clearHandwriting);
    document.getElementById('handwritingCheck')?.addEventListener('click',checkHandwriting);
    setTimeout(()=>void speakCurrentLetter(false),160);
  }

  function setupCanvas(){
    const canvas=document.getElementById('handwritingCanvas');if(!canvas)return;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return;
    ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#24323b';ctx.lineWidth=18;
    hw.canvas=canvas;hw.ctx=ctx;hw.drawing=false;hw.hasInk=false;hw.pointerId=null;
    const point=e=>{const rect=canvas.getBoundingClientRect();return{x:(e.clientX-rect.left)*canvas.width/rect.width,y:(e.clientY-rect.top)*canvas.height/rect.height};};
    const begin=e=>{if(state.locked)return;e.preventDefault();hw.pointerId=e.pointerId;try{canvas.setPointerCapture?.(e.pointerId);}catch(error){}const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();hw.drawing=true;hw.hasInk=true;toggleCheck(true);};
    const move=e=>{if(!hw.drawing||e.pointerId!==hw.pointerId||state.locked)return;e.preventDefault();const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
    const end=e=>{if(hw.pointerId!==null&&e.pointerId!==hw.pointerId)return;hw.drawing=false;hw.pointerId=null;};
    canvas.addEventListener('pointerdown',begin,{passive:false});
    canvas.addEventListener('pointermove',move,{passive:false});
    canvas.addEventListener('pointerup',end,{passive:false});
    canvas.addEventListener('pointercancel',end,{passive:false});
    canvas.addEventListener('pointerleave',e=>{if(e.buttons===0)end(e);},{passive:false});
  }

  function toggleCheck(enabled){const button=document.getElementById('handwritingCheck');if(button)button.disabled=!enabled;}

  function clearHandwriting(){
    if(!hw.ctx||!hw.canvas)return;
    hw.ctx.clearRect(0,0,hw.canvas.width,hw.canvas.height);hw.hasInk=false;state.locked=false;toggleCheck(false);
    const typed=document.getElementById('handwritingTyped');if(typed){typed.textContent='';typed.classList.remove('show');}
    hw.canvas.classList.remove('validated');
    const message=document.getElementById('handwritingMessage'),confidence=document.getElementById('handwritingConfidence');
    if(message){message.textContent='';message.className='handwriting-message';}
    if(confidence)confidence.textContent='';
  }

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
    return{mask,count,aspect:bw/Math.max(1,bh),size};
  }

  function dilateMask(mask,size,radius=2){
    const out=new Uint8Array(mask.length);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(mask[y*size+x])for(let dy=-radius;dy<=radius;dy++){
      const yy=y+dy;if(yy<0||yy>=size)continue;
      for(let dx=-radius;dx<=radius;dx++){
        const xx=x+dx;if(xx<0||xx>=size)continue;
        if(dx*dx+dy*dy<=radius*radius)out[yy*size+xx]=1;
      }
    }
    return out;
  }

  function templateCanvas(letter,font,weight=400,mode='stroke'){
    const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;
    const ctx=canvas.getContext('2d');ctx.font=`${weight} 132px ${font}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.strokeStyle='#000';ctx.lineJoin='round';
    if(mode==='fill')ctx.fillText(letter,90,94);else{ctx.lineWidth=weight===400?9:7;ctx.strokeText(letter,90,94);}
    return canvas;
  }

  function templateVariants(letter){
    if(hw.templates.has(letter))return hw.templates.get(letter);
    const variants=[],fonts=['Arial','Trebuchet MS','Verdana','Avenir Next'],forms=[letter,letter.toLocaleLowerCase('es-ES')];
    for(const form of forms)for(const font of fonts)for(const weight of [400,700])for(const mode of ['stroke','fill']){
      const normalized=normalizedBitmap(templateCanvas(form,font,weight,mode));
      if(normalized)variants.push({...normalized,dilated:dilateMask(normalized.mask,normalized.size,2)});
    }
    hw.templates.set(letter,variants);return variants;
  }

  function maskSimilarity(user,template,userDilated){
    let userNearTemplate=0,templateNearUser=0;
    for(let i=0;i<user.mask.length;i++){
      if(user.mask[i]&&template.dilated[i])userNearTemplate++;
      if(template.mask[i]&&userDilated[i])templateNearUser++;
    }
    const userCoverage=userNearTemplate/Math.max(1,user.count),templateCoverage=templateNearUser/Math.max(1,template.count);
    const aspectDelta=Math.abs(Math.log(Math.max(.08,user.aspect)/Math.max(.08,template.aspect))),aspectScore=Math.max(.55,1-aspectDelta*.28);
    return(.56*userCoverage+.44*templateCoverage)*aspectScore;
  }

  function bestLetterScore(user,letter,userDilated){
    let best=0;
    for(const template of templateVariants(letter)){const score=maskSimilarity(user,template,userDilated);if(score>best)best=score;}
    return best;
  }

  function recognitionLimits(){
    const level=Number(state.level?.level||1);
    if(level<=6)return{minimum:.45,strong:.64,competitorMargin:.13};
    if(level<=16)return{minimum:.49,strong:.67,competitorMargin:.11};
    return{minimum:.53,strong:.70,competitorMargin:.09};
  }

  function recognizeExpected(canvas,expected){
    const user=normalizedBitmap(canvas);if(!user)return{accepted:false,expectedScore:0,bestScore:0,bestLetter:null,reason:'empty'};
    const userDilated=dilateMask(user.mask,user.size,2),expectedScore=bestLetterScore(user,expected,userDilated);
    let bestLetter=expected,bestScore=expectedScore;
    for(const letter of ALPHABET){
      if(letter===expected)continue;
      const score=bestLetterScore(user,letter,userDilated);
      if(score>bestScore){bestScore=score;bestLetter=letter;}
    }
    const limits=recognitionLimits();
    const accepted=expectedScore>=limits.strong||(expectedScore>=limits.minimum&&expectedScore>=bestScore-limits.competitorMargin);
    return{accepted,expectedScore,bestScore,bestLetter,reason:'shape'};
  }

  function morphToTypedLetter(letter){
    const typed=document.getElementById('handwritingTyped'),canvas=document.getElementById('handwritingCanvas');if(!typed||!canvas)return;
    typed.textContent=letter;canvas.classList.add('validated');typed.classList.add('show');
  }

  function checkHandwriting(){
    if(state.locked||!hw.hasInk||!hw.canvas)return;
    state.locked=true;toggleCheck(false);hw.attempts++;
    const message=document.getElementById('handwritingMessage'),confidence=document.getElementById('handwritingConfidence');
    if(message){message.textContent='Comprobando…';message.className='handwriting-message checking';}
    if(confidence)confidence.textContent='';
    requestAnimationFrame(()=>setTimeout(()=>{
      let result;
      try{result=recognizeExpected(hw.canvas,hw.current);}catch(error){console.error('Error evaluando la letra',error);result={accepted:false,reason:'error'};}
      const expected=hw.current;
      if(result.accepted){
        if(hw.attempts===1){state.hits++;rewardProgressCorrect();}else window.GameSound?.play('corrected');
        if(message){message.textContent=hw.attempts===1?'¡Muy bien!':'¡Eso es!';message.className='handwriting-message ok';}
        morphToTypedLetter(expected);window.GameSound?.play('correct');setTimeout(handwritingQuestion,1050);return;
      }
      playChime('bad');
      if(result.reason==='empty'||result.reason==='error'){
        if(message){message.textContent='No he podido leer el trazo. Prueba otra vez.';message.className='handwriting-message bad';}
        if(confidence)confidence.textContent='Haz la letra un poco más grande y clara.';
        state.locked=false;toggleCheck(true);return;
      }
      if(hw.attempts>=2){
        if(message){message.textContent='Vamos con la siguiente.';message.className='handwriting-message bad';}
        if(confidence)confidence.textContent='';setTimeout(handwritingQuestion,900);return;
      }
      if(message){message.textContent='Prueba una vez más.';message.className='handwriting-message bad';}
      if(confidence)confidence.textContent='Puedes escribirla en mayúscula o minúscula.';
      state.locked=false;toggleCheck(true);
    },24));
  }

  function finishHandwriting(){
    if(state.daily){finishDailyActivity(TYPE,'¡Letras completadas!');return;}
    const level=state.level,s=stats(level.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[level.id]=s;
    const reward=levelDiamonds(level,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);
    layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid">${nextLevelButton(TYPE,level)}<button class="btn secondary" onclick='startHandwriting(${JSON.stringify(level)})'>🔄 Jugar otra vez</button><button class="btn secondary" onclick="levels('${TYPE}')">▦ Volver a niveles</button></div>`);
    window.GameSound?.play(!wasDone&&nextLevelButton(TYPE,level)?'advance':'levelComplete');
  }

  window.startHandwriting=startHandwriting;
  window.speakCurrentLetter=speakCurrentLetter;
})();