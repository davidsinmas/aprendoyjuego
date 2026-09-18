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
    type:TYPE,icon:'✍️',label:'Escribe la letra',menuTitle:'Escribe la letra',section:'reading',dailyGroup:'words',
    dailyLabel:'5 letras escritas',time:'3 min',engine:'handwriting',cardClass:'game-handwriting',detail:'Escucha y escribe con el dedo',activity:'10 letras'
  };

  if(!EXERCISE_CATALOG.some(item=>item.type===TYPE))EXERCISE_CATALOG.push(config);
  EXERCISE_BY_TYPE[TYPE]=config;
  if(!DAILY_TYPES.includes(TYPE))DAILY_TYPES.push(TYPE);
  if(Array.isArray(DAILY_GROUPS?.[1])&&!DAILY_GROUPS[1].includes(TYPE))DAILY_GROUPS[1].push(TYPE);
  DAILY_INFO[TYPE]={icon:config.icon,label:config.dailyLabel,time:config.time};
  if(!GAME_CONTROLS.some(item=>item.type===TYPE))GAME_CONTROLS.push({type:TYPE,icon:config.icon,label:config.label});

  const baseStartExercise=startExercise;
  startExercise=function(type,level,daily=false){
    if(type===TYPE){startHandwriting(level,daily);return;}
    return baseStartExercise(type,level,daily);
  };

  const LETTER_NAMES={
    A:'a',B:'be',C:'ce',D:'de',E:'e',F:'efe',G:'ge',H:'hache',I:'i',J:'jota',K:'ka',L:'ele',M:'eme',N:'ene','Ñ':'eñe',O:'o',P:'pe',Q:'cu',R:'erre',S:'ese',T:'te',U:'u',V:'uve',W:'uve doble',X:'equis',Y:'ye',Z:'zeta'
  };
  const LETTER_VOICE_URL=window.LudeikoAudioAssets?.handwritingLetters||'assets/audio/narration/handwriting-letters.mp3';
  const LETTER_AUDIO_ORDER=[...ALPHABET];
  const RECOGNITION_SIZE=40;
  const STRUCTURAL_SENTINELS='IOAMSBRTCV';
  const CONFUSABLES={
    A:'RHV',B:'PRD',C:'OGQ',D:'OBP',E:'FBL',F:'ETP',G:'COQ',H:'NKA',I:'LTJ',J:'ILT',K:'RXH',L:'ITJ',
    M:'NWV',N:'MHW','Ñ':'NM',O:'CQD',P:'BRD',Q:'OGC',R:'PBK',S:'CGZ',T:'IFL',U:'VJO',V:'UWY',W:'MVU',X:'KY',Y:'VTX',Z:'SN'
  };

  let letterVoice={context:null,bytes:null,buffer:null,segments:null,source:null,prefetch:null,decode:null,unlocked:false};
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

  function prefetchLetterVoice(){
    if(letterVoice.bytes)return Promise.resolve(letterVoice.bytes);
    if(letterVoice.prefetch)return letterVoice.prefetch;
    letterVoice.prefetch=fetch(LETTER_VOICE_URL,{cache:'force-cache'})
      .then(response=>{if(!response.ok)throw new Error(`Audio ${response.status}`);return response.arrayBuffer();})
      .then(bytes=>{letterVoice.bytes=bytes;return bytes;})
      .catch(error=>{console.warn('No se pudo precargar la voz de Escribe la letra',error);letterVoice.prefetch=null;return null;});
    return letterVoice.prefetch;
  }

  function ensureAudioContext(){
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return null;
    if(!letterVoice.context)letterVoice.context=new AudioContextClass();
    return letterVoice.context;
  }

  function unlockLetterAudio(){
    const context=ensureAudioContext();
    if(!context)return false;
    try{
      const resume=context.state==='suspended'?context.resume():null;
      if(resume&&typeof resume.then==='function')resume.then(()=>{letterVoice.unlocked=context.state==='running';}).catch(()=>{});
      const silent=context.createBuffer(1,1,context.sampleRate);
      const source=context.createBufferSource();source.buffer=silent;source.connect(context.destination);source.start(0);
      letterVoice.unlocked=context.state==='running'||letterVoice.unlocked;
      void decodeLetterVoice();
      return true;
    }catch(error){console.warn('No se pudo desbloquear el audio de escritura',error);return false;}
  }

  function detectLetterSegments(buffer,targetCount){
    const data=buffer.getChannelData(0),sampleRate=buffer.sampleRate,frame=Math.max(128,Math.round(sampleRate*.02)),energy=[];
    let peak=0;
    for(let offset=0;offset<data.length;offset+=frame){
      let sum=0;const count=Math.min(frame,data.length-offset);
      for(let i=0;i<count;i++){const value=data[offset+i];sum+=value*value;}
      const rms=Math.sqrt(sum/Math.max(1,count));energy.push(rms);if(rms>peak)peak=rms;
    }
    const thresholds=[.045,.035,.055,.025,.07].map(ratio=>Math.max(.0015,peak*ratio));
    for(const threshold of thresholds){
      const silent=energy.map(value=>value<threshold),gaps=[];let start=-1;
      for(let i=0;i<=silent.length;i++){
        if(i<silent.length&&silent[i]){if(start<0)start=i;continue;}
        if(start>=0){const end=i,duration=(end-start)*frame/sampleRate;if(duration>=.1&&start>1&&end<silent.length-1)gaps.push({start,end,duration});start=-1;}
      }
      if(gaps.length<targetCount-1)continue;
      const chosen=[...gaps].sort((a,b)=>b.duration-a.duration).slice(0,targetCount-1).sort((a,b)=>a.start-b.start);
      const cuts=[0,...chosen.map(gap=>((gap.start+gap.end)/2)*frame/sampleRate),buffer.duration],segments=[];
      for(let i=0;i<targetCount;i++)segments.push({start:Math.max(0,cuts[i]-.035),end:Math.min(buffer.duration,cuts[i+1]+.035)});
      if(segments.length===targetCount&&segments.every(segment=>segment.end-segment.start>.45))return segments;
    }
    return Array.from({length:targetCount},(_,i)=>({start:buffer.duration*i/targetCount,end:buffer.duration*(i+1)/targetCount}));
  }

  async function decodeLetterVoice(){
    if(letterVoice.buffer&&letterVoice.segments)return true;
    if(letterVoice.decode)return letterVoice.decode;
    const context=letterVoice.context;if(!context)return false;
    letterVoice.decode=(async()=>{
      const bytes=letterVoice.bytes||await prefetchLetterVoice();
      if(!bytes)return false;
      letterVoice.buffer=await context.decodeAudioData(bytes.slice(0));
      letterVoice.segments=detectLetterSegments(letterVoice.buffer,LETTER_AUDIO_ORDER.length);
      if(letterVoice.segments.length!==LETTER_AUDIO_ORDER.length)throw new Error('Número de segmentos de voz incorrecto');
      return true;
    })().catch(error=>{console.warn('No se pudo preparar la voz de Escribe la letra',error);letterVoice.decode=null;return false;});
    return letterVoice.decode;
  }

  function speechFallback(letter){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return false;
    try{
      window.speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(LETTER_NAMES[letter]||letter);
      utterance.lang='es-ES';utterance.rate=.88;utterance.pitch=1.02;
      window.speechSynthesis.speak(utterance);return true;
    }catch(error){return false;}
  }

  async function speakCurrentLetter(fromGesture=false){
    const letter=hw.current||state.qs[state.i-1],index=LETTER_AUDIO_ORDER.indexOf(letter);if(index<0)return false;
    if(fromGesture)unlockLetterAudio();
    const ready=await decodeLetterVoice();
    if(!ready){speechFallback(letter);return false;}
    const context=letterVoice.context;
    if(context?.state==='suspended'){try{await context.resume();}catch(error){}}
    if(!context||context.state!=='running'){speechFallback(letter);return false;}
    if(letterVoice.source){try{letterVoice.source.stop();}catch(error){}letterVoice.source=null;}
    const segment=letterVoice.segments[index];if(!segment){speechFallback(letter);return false;}
    try{
      const source=context.createBufferSource();source.buffer=letterVoice.buffer;source.connect(context.destination);
      source.onended=()=>{if(letterVoice.source===source)letterVoice.source=null;};
      letterVoice.source=source;source.start(0,segment.start,Math.max(.1,segment.end-segment.start));return true;
    }catch(error){console.warn('No se pudo reproducir la letra',error);speechFallback(letter);return false;}
  }

  function startHandwriting(level,daily=false){
    const n=typeof level==='number'?LEVELS[Math.max(0,Math.min(LEVELS.length-1,level-1))]:level;if(!n)return;
    unlockLetterAudio();
    state={...state,type:TYPE,level:n,daily:!!daily,qs:shuffledLetters(n.letters,daily?5:10),i:0,hits:0,total:daily?5:10,locked:false};
    handwritingQuestion();
  }

  function handwritingQuestion(){
    if(state.i>=state.total){finishHandwriting();return;}
    hw.current=state.qs[state.i];hw.attempts=0;hw.hasInk=false;state.locked=false;
    const back=state.daily?'home()':`levels('${TYPE}')`;
    layout(`<div class="top"><button class="btn secondary back" onclick="${back}">← Salir</button>${diamond()}</div><div class="handwriting-shell"><div class="handwriting-heading"><div class="muted">Letra ${state.i+1} de ${state.total}</div><h2>Escucha y escribe</h2><p>Pulsa el altavoz si quieres volver a escucharla.</p></div><button type="button" class="handwriting-listen" id="handwritingListen" aria-label="Escuchar la letra">🔊</button><div class="handwriting-board-wrap"><canvas id="handwritingCanvas" class="handwriting-canvas" width="360" height="360"></canvas><div id="handwritingTyped" class="handwriting-typed" aria-hidden="true"></div><div class="handwriting-guide">Escribe una letra en mayúscula o minúscula.</div></div><div class="handwriting-actions"><button type="button" class="btn secondary" id="handwritingClear">⌫ Borrar</button><button type="button" class="btn primary" id="handwritingCheck" disabled>✓ Comprobar</button></div><div id="handwritingMessage" class="handwriting-message" aria-live="polite"></div><div id="handwritingConfidence" class="handwriting-confidence"></div></div>`);
    state.i++;setupCanvas();
    document.getElementById('handwritingListen')?.addEventListener('click',()=>{unlockLetterAudio();void speakCurrentLetter(true);});
    document.getElementById('handwritingClear')?.addEventListener('click',clearHandwriting);
    document.getElementById('handwritingCheck')?.addEventListener('click',checkHandwriting);
    prewarmRecognition(hw.current);
    void speakCurrentLetter(false);
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

  function templateCanvas(letter,font,mode='stroke'){
    const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;
    const ctx=canvas.getContext('2d');if(!ctx)return canvas;
    const weight=mode==='fill'?700:400;ctx.font=`${weight} 132px ${font}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.strokeStyle='#000';ctx.lineJoin='round';
    if(mode==='fill')ctx.fillText(letter,90,94);else{ctx.lineWidth=10;ctx.strokeText(letter,90,94);}return canvas;
  }

  function templateVariants(letter){
    if(hw.templates.has(letter))return hw.templates.get(letter);
    const variants=[],fonts=['Arial','Trebuchet MS','Verdana'],forms=[letter,letter.toLocaleLowerCase('es-ES')];
    for(const form of forms)for(const font of fonts)for(const mode of ['stroke','fill']){
      const normalized=normalizedBitmap(templateCanvas(form,font,mode));
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
    const aspectDelta=Math.abs(Math.log(Math.max(.08,user.aspect)/Math.max(.08,template.aspect))),aspectScore=Math.max(.48,1-aspectDelta*.32);
    return(.58*userCoverage+.42*templateCoverage)*aspectScore;
  }

  function bestLetterScore(user,letter,userDilated){
    let best=0;
    for(const template of templateVariants(letter)){const score=maskSimilarity(user,template,userDilated);if(score>best)best=score;}
    return best;
  }

  function recognitionLimits(level=Number(state.level?.level||1)){
    if(level<=6)return{minimum:.43,competitorMargin:.08};
    if(level<=16)return{minimum:.46,competitorMargin:.07};
    return{minimum:.49,competitorMargin:.06};
  }

  function candidateLetters(expected){return[...new Set([expected,...(CONFUSABLES[expected]||''),...STRUCTURAL_SENTINELS])];}

  function recognizeExpected(canvas,expected,level){
    const user=normalizedBitmap(canvas);if(!user)return{accepted:false,expectedScore:0,bestScore:0,bestLetter:null,reason:'empty'};
    if(user.inkRatio>.58||user.aspect<.12||user.aspect>5.5)return{accepted:false,expectedScore:0,bestScore:0,bestLetter:null,reason:'shape'};
    const userDilated=dilateMask(user.mask,user.size,2),expectedScore=bestLetterScore(user,expected,userDilated);
    let bestLetter=expected,bestScore=expectedScore;
    for(const letter of candidateLetters(expected)){
      if(letter===expected)continue;
      const score=bestLetterScore(user,letter,userDilated);if(score>bestScore){bestScore=score;bestLetter=letter;}
    }
    const limits=recognitionLimits(level);
    const accepted=expectedScore>=limits.minimum&&expectedScore>=bestScore-limits.competitorMargin;
    return{accepted,expectedScore,bestScore,bestLetter,reason:'shape'};
  }

  function prewarmRecognition(letter){
    const work=()=>{for(const candidate of candidateLetters(letter))templateVariants(candidate);};
    if(typeof requestIdleCallback==='function')requestIdleCallback(work,{timeout:350});else setTimeout(work,0);
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
      }else{
        if(message){message.textContent='Prueba otra vez.';message.className='handwriting-message bad';}
        if(confidence)confidence.textContent='Puedes borrar el trazo o escuchar la letra de nuevo.';
      }
      state.locked=false;toggleCheck(true);
    },0));
  }

  function diagnosticCanvas(letter,{rotation=0,scaleX=1,scaleY=1,mode='fill'}={}){
    const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;const ctx=canvas.getContext('2d');if(!ctx)return canvas;
    ctx.translate(90,90);ctx.rotate(rotation);ctx.scale(scaleX,scaleY);ctx.translate(-90,-90);
    const weight=mode==='fill'?700:400;ctx.font=`${weight} 132px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.strokeStyle='#000';ctx.lineJoin='round';
    if(mode==='fill')ctx.fillText(letter,90,94);else{ctx.lineWidth=10;ctx.strokeText(letter,90,94);}return canvas;
  }

  function runRecognitionDiagnostics(){
    const wrongFor={I:'O',O:'I',A:'O',M:'O',S:'I',B:'I',R:'O'},letters=['I','O','A','M','S','B','R'];
    const details=letters.map(letter=>{
      const correct=recognizeExpected(diagnosticCanvas(letter),letter,1).accepted;
      const approximate=recognizeExpected(diagnosticCanvas(letter,{rotation:.055,scaleX:.92,scaleY:1.04,mode:'stroke'}),letter,1).accepted;
      const wrong=recognizeExpected(diagnosticCanvas(wrongFor[letter]),letter,1).accepted;
      return{letter,correct,approximate,wrongRejected:!wrong};
    });
    return{ok:details.every(item=>item.correct&&item.approximate&&item.wrongRejected),details};
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
  window.LudeikoHandwritingDiagnostics=Object.freeze({run:runRecognitionDiagnostics});

  document.addEventListener('pointerdown',unlockLetterAudio,{capture:true,passive:true,once:true});
  document.addEventListener('keydown',unlockLetterAudio,{capture:true,once:true});
  void prefetchLetterVoice();

  if(new URLSearchParams(window.location.search).get('handwriting-smoke')==='1'){
    requestAnimationFrame(()=>setTimeout(()=>{
      const result=runRecognitionDiagnostics();
      document.documentElement.dataset.handwritingSmoke=result.ok?'pass':'fail';
      const marker=document.createElement('meta');marker.name='ludeiko-handwriting-smoke';
      marker.content=result.details.map(item=>`${item.letter}:${item.correct&&item.approximate&&item.wrongRejected?'pass':'fail'}`).join(',');
      document.head.appendChild(marker);
    },0));
  }
})();
