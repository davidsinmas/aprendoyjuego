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
  const LETTER_VOICE_URL='https://cdn.creativeclaw.co/u/d65593e1/audio/34505963-7d20-4e1c-8ce2-f505089dc3d2.mp3';
  const LETTER_AUDIO_ORDER=[...ALPHABET];
  let letterVoice={context:null,buffer:null,segments:null,source:null,loading:null};
  let hw={canvas:null,ctx:null,drawing:false,hasInk:false,current:null,attempts:0,templates:null,pointerId:null};

  function shuffledLetters(pool,count){const source=[...String(pool||ALPHABET)],out=[];while(out.length<count){const bag=[...source].sort(()=>Math.random()-.5);for(const letter of bag){if(out.length>=count)break;if(out.length&&out[out.length-1]===letter&&source.length>1)continue;out.push(letter);}}return out.slice(0,count);}
  function startHandwriting(level,daily=false){const n=typeof level==='number'?LEVELS[Math.max(0,Math.min(LEVELS.length-1,level-1))]:level;if(!n)return;state={...state,type:TYPE,level:n,daily:!!daily,qs:shuffledLetters(n.letters,daily?5:10),i:0,hits:0,total:daily?5:10,locked:false};handwritingQuestion();}

  function detectLetterSegments(buffer,targetCount){
    const data=buffer.getChannelData(0),sampleRate=buffer.sampleRate,frame=Math.max(128,Math.round(sampleRate*.02)),energy=[];
    let peak=0;
    for(let offset=0;offset<data.length;offset+=frame){let sum=0,count=Math.min(frame,data.length-offset);for(let i=0;i<count;i++){const v=data[offset+i];sum+=v*v;}const rms=Math.sqrt(sum/Math.max(1,count));energy.push(rms);if(rms>peak)peak=rms;}
    const thresholds=[.045,.035,.055,.025,.07].map(ratio=>Math.max(.0015,peak*ratio));
    for(const threshold of thresholds){
      const silent=energy.map(value=>value<threshold),gaps=[];let start=-1;
      for(let i=0;i<=silent.length;i++){
        if(i<silent.length&&silent[i]){if(start<0)start=i;continue;}
        if(start>=0){const end=i,duration=(end-start)*frame/sampleRate;if(duration>=.1&&start>1&&end<silent.length-1)gaps.push({start,end,duration});start=-1;}
      }
      if(gaps.length<targetCount-1)continue;
      const chosen=[...gaps].sort((a,b)=>b.duration-a.duration).slice(0,targetCount-1).sort((a,b)=>a.start-b.start);
      const cuts=[0,...chosen.map(gap=>((gap.start+gap.end)/2)*frame/sampleRate),buffer.duration];
      const segments=[];
      for(let i=0;i<targetCount;i++){const startTime=Math.max(0,cuts[i]-.035),endTime=Math.min(buffer.duration,cuts[i+1]+.035);segments.push({start:startTime,end:endTime});}
      if(segments.every(segment=>segment.end-segment.start>.65))return segments;
    }
    return Array.from({length:targetCount},(_,i)=>({start:buffer.duration*i/targetCount,end:buffer.duration*(i+1)/targetCount}));
  }

  async function loadLetterVoice(){
    if(letterVoice.buffer&&letterVoice.segments)return true;
    if(letterVoice.loading)return letterVoice.loading;
    letterVoice.loading=(async()=>{
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)throw new Error('Web Audio no disponible');
      const response=await fetch(LETTER_VOICE_URL,{mode:'cors',cache:'force-cache'});if(!response.ok)throw new Error(`Audio ${response.status}`);
      const bytes=await response.arrayBuffer();letterVoice.context=letterVoice.context||new AudioContextClass();letterVoice.buffer=await letterVoice.context.decodeAudioData(bytes.slice(0));letterVoice.segments=detectLetterSegments(letterVoice.buffer,LETTER_AUDIO_ORDER.length);return true;
    })().catch(error=>{console.warn('No se pudo cargar la voz de Escribe la letra',error);letterVoice.loading=null;return false;});
    return letterVoice.loading;
  }

  async function speakCurrentLetter(){
    const letter=hw.current||state.qs[state.i-1],index=LETTER_AUDIO_ORDER.indexOf(letter);if(index<0)return;
    const ready=await loadLetterVoice();if(!ready)return;
    const context=letterVoice.context;if(context.state==='suspended'){try{await context.resume();}catch(e){}}
    if(letterVoice.source){try{letterVoice.source.stop();}catch(e){}letterVoice.source=null;}
    const segment=letterVoice.segments[index],source=context.createBufferSource();source.buffer=letterVoice.buffer;source.connect(context.destination);source.onended=()=>{if(letterVoice.source===source)letterVoice.source=null;};letterVoice.source=source;source.start(0,segment.start,Math.max(.1,segment.end-segment.start));
  }

  function handwritingQuestion(){if(state.i>=state.total){finishHandwriting();return;}hw.current=state.qs[state.i];hw.attempts=0;hw.hasInk=false;state.locked=false;const back=state.daily?'home()':`levels('${TYPE}')`;layout(`<div class="top"><button class="btn secondary back" onclick="${back}">← Salir</button>${diamond()}</div><div class="handwriting-shell"><div class="handwriting-heading"><div class="muted">Letra ${state.i+1} de ${state.total}</div><h2>Escucha y escribe</h2><p>Pulsa el altavoz si quieres volver a escucharla.</p></div><button type="button" class="handwriting-listen" id="handwritingListen">🔊</button><div class="handwriting-board-wrap"><canvas id="handwritingCanvas" class="handwriting-canvas" width="360" height="360"></canvas><div id="handwritingTyped" class="handwriting-typed" aria-hidden="true"></div><div class="handwriting-guide">Escribe una sola letra dentro del recuadro.</div></div><div class="handwriting-actions"><button type="button" class="btn secondary" id="handwritingClear">⌫ Borrar</button><button type="button" class="btn primary" id="handwritingCheck" disabled>✓ Comprobar</button></div><div id="handwritingMessage" class="handwriting-message" aria-live="polite"></div><div id="handwritingConfidence" class="handwriting-confidence"></div></div>`);state.i++;setupCanvas();document.getElementById('handwritingListen')?.addEventListener('click',speakCurrentLetter);document.getElementById('handwritingClear')?.addEventListener('click',clearHandwriting);document.getElementById('handwritingCheck')?.addEventListener('click',checkHandwriting);setTimeout(speakCurrentLetter,180);}
  function setupCanvas(){const canvas=document.getElementById('handwritingCanvas');if(!canvas)return;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#24323b';ctx.lineWidth=18;hw.canvas=canvas;hw.ctx=ctx;hw.drawing=false;hw.hasInk=false;hw.pointerId=null;const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};canvas.addEventListener('pointerdown',e=>{if(state.locked)return;e.preventDefault();hw.pointerId=e.pointerId;canvas.setPointerCapture?.(e.pointerId);const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();hw.drawing=true;hw.hasInk=true;toggleCheck(true);});canvas.addEventListener('pointermove',e=>{if(!hw.drawing||e.pointerId!==hw.pointerId||state.locked)return;e.preventDefault();const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();});const end=e=>{if(e.pointerId!==hw.pointerId)return;hw.drawing=false;hw.pointerId=null;};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('pointerleave',e=>{if(e.buttons===0)end(e);});}
  function toggleCheck(enabled){const b=document.getElementById('handwritingCheck');if(b)b.disabled=!enabled;}
  function clearHandwriting(){if(!hw.ctx||!hw.canvas)return;hw.ctx.clearRect(0,0,hw.canvas.width,hw.canvas.height);hw.hasInk=false;state.locked=false;toggleCheck(false);const typed=document.getElementById('handwritingTyped');if(typed){typed.textContent='';typed.classList.remove('show');}const m=document.getElementById('handwritingMessage'),c=document.getElementById('handwritingConfidence');if(m){m.textContent='';m.className='handwriting-message';}if(c)c.textContent='';}
  function normalizedMask(source,size=32){const ctx=source.getContext('2d',{willReadFrequently:true}),img=ctx.getImageData(0,0,source.width,source.height),w=source.width,h=source.height;let minX=w,minY=h,maxX=-1,maxY=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(img.data[(y*w+x)*4+3]>35){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}if(maxX<minX||maxY<minY)return null;const bw=maxX-minX+1,bh=maxY-minY+1;if(bw<8||bh<8)return null;const temp=document.createElement('canvas');temp.width=size;temp.height=size;const t=temp.getContext('2d',{willReadFrequently:true});const pad=2,scale=Math.min((size-pad*2)/bw,(size-pad*2)/bh),dw=bw*scale,dh=bh*scale,dx=(size-dw)/2,dy=(size-dh)/2;t.drawImage(source,minX,minY,bw,bh,dx,dy,dw,dh);const d=t.getImageData(0,0,size,size).data,coords=[];for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(d[(y*size+x)*4+3]>50)coords.push([x,y]);return coords.length>=8?coords:null;}
  function templateCanvas(letter,font,lower=false,mirror=false){const c=document.createElement('canvas');c.width=180;c.height=180;const x=c.getContext('2d');x.save();if(mirror){x.translate(c.width,0);x.scale(-1,1);}x.font=`700 132px ${font}`;x.textAlign='center';x.textBaseline='middle';x.strokeStyle='#000';x.lineWidth=4;x.lineJoin='round';x.strokeText(lower?letter.toLocaleLowerCase('es-ES'):letter,90,94);x.restore();return c;}
  function ensureTemplates(){if(hw.templates)return hw.templates;const fonts=['Arial','Trebuchet MS','Verdana','Avenir Next'];hw.templates={};for(const letter of ALPHABET){const variants=[];for(const font of fonts)for(const lower of [false,true])for(const mirror of [false,true]){const mask=normalizedMask(templateCanvas(letter,font,lower,mirror));if(mask)variants.push(mask);}hw.templates[letter]=variants;}return hw.templates;}
  function maskDistance(a,b){if(!a||!b||!a.length||!b.length)return Infinity;const directional=(from,to)=>{let total=0;for(const [x,y] of from){let best=Infinity;for(const [u,v] of to){const dx=x-u,dy=y-v,d=dx*dx+dy*dy;if(d<best){best=d;if(best===0)break;}}total+=Math.sqrt(best);}return total/from.length;};return(directional(a,b)+directional(b,a))/2;}
  function recognize(canvas){const mask=normalizedMask(canvas);if(!mask)return{letter:null,score:0,ranking:[]};const templates=ensureTemplates(),ranking=[];for(const letter of ALPHABET){let best=Infinity;for(const variant of templates[letter])best=Math.min(best,maskDistance(mask,variant));ranking.push({letter,distance:best,score:Math.max(0,1-best/8)});}ranking.sort((a,b)=>a.distance-b.distance);return{letter:ranking[0]?.letter||null,score:ranking[0]?.score||0,ranking};}
  function acceptanceLimits(){const level=Number(state.level?.level||1);if(level<=6)return{maxDistance:3.25,strongDistance:2.35,minGap:.08};if(level<=16)return{maxDistance:3,strongDistance:2.15,minGap:.12};return{maxDistance:2.75,strongDistance:1.95,minGap:.16};}
  function isExpectedLetter(result,expected){if(!result?.ranking?.length||result.letter!==expected)return false;const target=result.ranking[0],second=result.ranking[1],limits=acceptanceLimits();if(!Number.isFinite(target.distance)||target.distance>limits.maxDistance)return false;const gap=second&&Number.isFinite(second.distance)?second.distance-target.distance:Infinity;return target.distance<=limits.strongDistance||gap>=limits.minGap;}
  function morphToTypedLetter(letter){const typed=document.getElementById('handwritingTyped'),canvas=document.getElementById('handwritingCanvas');if(!typed||!canvas)return;typed.textContent=letter;canvas.classList.add('validated');typed.classList.add('show');}
  function checkHandwriting(){if(state.locked||!hw.hasInk||!hw.canvas)return;state.locked=true;toggleCheck(false);hw.attempts++;const result=recognize(hw.canvas),expected=hw.current,accepted=isExpectedLetter(result,expected);const msg=document.getElementById('handwritingMessage'),confidence=document.getElementById('handwritingConfidence');if(accepted){if(hw.attempts===1)state.hits++;rewardProgressCorrect();if(msg){msg.textContent=hw.attempts===1?'¡Muy bien!':'¡Eso es!';msg.className='handwriting-message ok';}if(confidence)confidence.textContent='';morphToTypedLetter(expected);window.GameSound?.play('correct');setTimeout(handwritingQuestion,1350);}else{playChime('bad');if(msg){msg.textContent='Aún no parece la letra que has escuchado. Prueba otra vez.';msg.className='handwriting-message bad';}if(confidence)confidence.textContent='Puedes borrarla o escuchar la letra de nuevo.';state.locked=false;toggleCheck(true);}}
  function finishHandwriting(){if(state.daily){finishDailyActivity(TYPE,'¡Letras completadas!');return;}const n=state.level,s=stats(n.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[n.id]=s;const reward=levelDiamonds(n,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid">${nextLevelButton(TYPE,n)}<button class="btn secondary" onclick='startHandwriting(${JSON.stringify(n)})'>🔄 Jugar otra vez</button><button class="btn secondary" onclick="levels('${TYPE}')">▦ Volver a niveles</button></div>`);window.GameSound?.play(!wasDone&&nextLevelButton(TYPE,n)?'advance':'levelComplete');}
  window.startHandwriting=startHandwriting;window.speakCurrentLetter=speakCurrentLetter;
  loadLetterVoice();
})();
