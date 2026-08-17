const PEDAGOGY_SUBTRACTION_STEPS=[
  {
    title:'Construye una decena',
    icon:'🧱',
    intro:'Los números mayores de 10 tienen una decena completa y algunas unidades sueltas. El 14 es una decena y cuatro unidades.',
    example:'14 = 10 + 4'
  },
  {
    title:'Aterriza en el 10',
    icon:'🛬',
    intro:'Antes de seguir restando, busca cuánto hay que quitar para llegar exactamente a 10. Desde 16 quitamos 6 y aterrizamos en 10.',
    example:'16 − 6 = 10'
  },
  {
    title:'Cruza el puente del 10',
    icon:'🌉',
    intro:'Si hay que quitar más, divide la resta en dos saltos. En 14 menos 6, primero quita 4 para llegar a 10 y después quita los 2 que faltan.',
    example:'14 − 6 = 14 − 4 − 2 = 8'
  },
  {
    title:'Resuelve historias',
    icon:'📖',
    intro:'Ahora usa el puente del 10 en pequeñas aventuras. Imagina los objetos, quita los que se marchan y comprueba cuántos quedan.',
    example:'15 luciérnagas − 7 que se van = 8'
  },
  {
    title:'Misión final',
    icon:'🏆',
    intro:'Demuestra lo aprendido con seis restas. Para superar la misión necesitas acertar al menos la mitad. Puedes repetirla cuando quieras.',
    example:'Piensa: llegar a 10 y continuar'
  }
];

let pedagogyState={step:1,questions:[],index:0,hits:0,locked:false,current:null};

function pedagogyUnitProgress(){
  if(!D.unidadesPedagogicas||typeof D.unidadesPedagogicas!=='object')D.unidadesPedagogicas={};
  if(!D.unidadesPedagogicas.restasMas10||typeof D.unidadesPedagogicas.restasMas10!=='object'){
    D.unidadesPedagogicas.restasMas10={paso:1,pasosCompletados:[],completada:false,mejorResultado:0};
  }
  const progress=D.unidadesPedagogicas.restasMas10;
  if(!Array.isArray(progress.pasosCompletados))progress.pasosCompletados=[];
  return progress;
}

function pedagogyHomeCard(){
  const progress=pedagogyUnitProgress(),status=progress.completada?'🏆 Unidad completada':`🚩 Misión ${progress.paso} de 5`;
  return `<button class="pedagogy-home-card" onclick="pedagogyUnits()"><span class="pedagogy-home-icon">🌉</span><span><b>La misión del puente del 10</b><small>Aprende a restar con números mayores de 10</small><small>${status}</small></span><strong>ENTRAR →</strong></button>`;
}

function pedagogyUnits(){
  const progress=pedagogyUnitProgress(),done=progress.pasosCompletados.length,pct=Math.round(done/5*100);
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div>
    <div class="pedagogy-heading"><span>🧭</span><div><div class="eyebrow">Aprender paso a paso</div><h2>Unidades pedagógicas</h2></div></div>
    <p class="muted pedagogy-lead">Pequeñas aventuras guiadas para comprender una idea antes de practicarla en los juegos.</p>
    <button class="pedagogy-unit-card" onclick="subtractionPedagogyUnit()">
      <span class="pedagogy-unit-illustration">🌉<i>10</i></span>
      <span class="pedagogy-unit-copy"><span class="pedagogy-tag">MATEMÁTICAS · 10–15 MIN</span><b>La misión del puente del 10</b><small>Restas con números mayores de 10 mediante decenas, saltos y pequeñas historias.</small><span class="pedagogy-track"><i style="width:${pct}%"></i></span><small>${progress.completada?'¡Aventura completada!':`${done} de 5 misiones completadas`}</small></span>
      <strong>${progress.completada?'REPETIR →':'CONTINUAR →'}</strong>
    </button>`);
}

function subtractionPedagogyUnit(){
  const progress=pedagogyUnitProgress();
  const rows=PEDAGOGY_SUBTRACTION_STEPS.map((step,index)=>{
    const number=index+1,done=progress.pasosCompletados.includes(number),unlocked=done||number<=progress.paso;
    return `<div class="pedagogy-step ${done?'done':''} ${unlocked?'':'locked'}">
      <span class="pedagogy-step-number">${done?'✓':unlocked?number:'🔒'}</span>
      <span><b>${step.icon} ${step.title}</b><small>${done?'Completada':unlocked?'Lista para empezar':'Completa la misión anterior'}</small></span>
      <button class="small ${unlocked?'play':'locked-button'}" ${unlocked?`onclick="pedagogyLesson(${number})"`:'disabled'}>${done?'Repetir':unlocked?'Empezar':'Bloqueada'}</button>
    </div>`;
  }).join('');
  layout(`<div class="top"><button class="btn secondary back" onclick="pedagogyUnits()">← Unidades</button>${diamond()}</div>
    <div class="pedagogy-hero"><div class="pedagogy-hero-icon">🌉</div><div><div class="eyebrow">Unidad 1 · Matemáticas</div><h2>La misión del puente del 10</h2><p>Ayuda al Guardián Nova a cruzar cinco paradas y descubre una forma fácil de restar desde números mayores de 10.</p></div></div>
    <div class="pedagogy-adult-note">👨‍👩‍👧 <span>Al terminar, un adulto puede activar las restas mayores de 10 desde la Zona de padres. La unidad no cambia ese ajuste automáticamente.</span></div>
    <div class="pedagogy-steps">${rows}</div>`);
}

function pedagogyLesson(stepNumber){
  const progress=pedagogyUnitProgress(),step=PEDAGOGY_SUBTRACTION_STEPS[stepNumber-1];
  if(!step||(!progress.pasosCompletados.includes(stepNumber)&&stepNumber>progress.paso)){subtractionPedagogyUnit();return;}
  let visual='';
  if(stepNumber===1)visual=`${pedagogyNumberModel(14)}<div class="pedagogy-equation">14 = <span>10</span> + <span>4</span></div>`;
  else if(stepNumber===2)visual=`${pedagogyNumberModel(16)}<div class="pedagogy-equation">16 − <span>6</span> = 10</div>`;
  else if(stepNumber===3)visual=`<div class="ten-bridge"><span>14</span><i>− 4</i><span class="bridge-ten">10</span><i>− 2</i><span>8</span></div>`;
  else if(stepNumber===4)visual=`<div class="pedagogy-story-icons">${'✨'.repeat(15)}</div><div class="pedagogy-equation">15 − 7 = 8</div>`;
  else visual='<div class="pedagogy-final-badge">🛡️<span>6 retos</span></div>';
  layout(`<div class="top"><button class="btn secondary back" onclick="subtractionPedagogyUnit()">← Misiones</button>${diamond()}</div>
    <div class="pedagogy-lesson-head"><span>${step.icon}</span><div><div class="eyebrow">Misión ${stepNumber} de 5</div><h2>${step.title}</h2></div></div>
    <div class="pedagogy-explanation"><div class="pedagogy-guide">🧑‍🚀</div><p>${step.intro}</p><button class="pedagogy-audio" onclick="pedagogySpeakLesson(${stepNumber})" aria-label="Escuchar explicación">🔊</button></div>
    <div class="pedagogy-demo">${visual}<b>${step.example}</b></div>
    <button class="btn primary pedagogy-start" onclick="startPedagogyPractice(${stepNumber})">▶️ Practicar</button>`);
}

function pedagogyNumberModel(number){
  const units=Math.max(0,number-10),ten=Array.from({length:10},()=>'<i></i>').join(''),loose=Array.from({length:units},()=>'<i></i>').join('');
  return `<div class="number-model" aria-label="Una decena y ${units} unidades"><div class="ten-box">${ten}</div><span>+</span><div class="unit-box">${loose}</div></div>`;
}

function pedagogySpeak(text){
  try{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='es-ES';utterance.rate=.82;utterance.pitch=1.04;
    window.speechSynthesis.speak(utterance);
  }catch(error){}
}

function pedagogySpeakLesson(stepNumber){
  const step=PEDAGOGY_SUBTRACTION_STEPS[stepNumber-1];
  if(step)pedagogySpeak(`${step.title}. ${step.intro}. Ejemplo: ${step.example.replaceAll('−',' menos ').replaceAll('=',' es igual a ')}`);
}

function pedagogyShuffle(items){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}

function pedagogyQuestions(stepNumber){
  const groups={
    1:[
      {kind:'units',a:14,r:4,prompt:'El 14 tiene una decena. ¿Cuántas unidades sueltas tiene?'},
      {kind:'units',a:17,r:7,prompt:'El 17 tiene una decena. ¿Cuántas unidades sueltas tiene?'},
      {kind:'units',a:12,r:2,prompt:'El 12 tiene una decena. ¿Cuántas unidades sueltas tiene?'},
      {kind:'units',a:19,r:9,prompt:'El 19 tiene una decena. ¿Cuántas unidades sueltas tiene?'}
    ],
    2:[
      {kind:'reach',a:16,r:6,prompt:'¿Cuánto debes quitar a 16 para llegar a 10?'},
      {kind:'reach',a:13,r:3,prompt:'¿Cuánto debes quitar a 13 para llegar a 10?'},
      {kind:'reach',a:18,r:8,prompt:'¿Cuánto debes quitar a 18 para llegar a 10?'},
      {kind:'reach',a:15,r:5,prompt:'¿Cuánto debes quitar a 15 para llegar a 10?'}
    ],
    3:[
      {kind:'bridge',a:14,b:6,toTen:4,rest:2,r:8,prompt:'Catorce menos seis. Primero quita 4 y después 2. ¿Cuánto queda?'},
      {kind:'bridge',a:13,b:5,toTen:3,rest:2,r:8,prompt:'Trece menos cinco. Primero quita 3 y después 2. ¿Cuánto queda?'},
      {kind:'bridge',a:15,b:7,toTen:5,rest:2,r:8,prompt:'Quince menos siete. Primero quita 5 y después 2. ¿Cuánto queda?'},
      {kind:'bridge',a:16,b:9,toTen:6,rest:3,r:7,prompt:'Dieciséis menos nueve. Primero quita 6 y después 3. ¿Cuánto queda?'}
    ],
    4:[
      {kind:'story',icon:'✨',a:15,b:7,r:8,prompt:'Había 15 luciérnagas. Se fueron 7. ¿Cuántas quedan?'},
      {kind:'story',icon:'🍪',a:13,b:5,r:8,prompt:'Había 13 galletas. Compartes 5. ¿Cuántas quedan?'},
      {kind:'story',icon:'🚀',a:18,b:9,r:9,prompt:'Había 18 cohetes. Despegan 9. ¿Cuántos quedan?'},
      {kind:'story',icon:'🐟',a:16,b:7,r:9,prompt:'Había 16 peces. Se esconden 7. ¿Cuántos puedes ver?'}
    ],
    5:[
      {kind:'final',a:12,b:5,r:7,prompt:'¿Cuánto es doce menos cinco?'},
      {kind:'final',a:14,b:8,r:6,prompt:'¿Cuánto es catorce menos ocho?'},
      {kind:'final',a:17,b:9,r:8,prompt:'¿Cuánto es diecisiete menos nueve?'},
      {kind:'final',a:19,b:7,r:12,prompt:'¿Cuánto es diecinueve menos siete?'},
      {kind:'final',a:16,b:6,r:10,prompt:'¿Cuánto es dieciséis menos seis?'},
      {kind:'final',a:18,b:9,r:9,prompt:'¿Cuánto es dieciocho menos nueve?'}
    ]
  };
  return pedagogyShuffle(groups[stepNumber]||[]);
}

function startPedagogyPractice(stepNumber){
  const progress=pedagogyUnitProgress();
  if(!PEDAGOGY_SUBTRACTION_STEPS[stepNumber-1]||(!progress.pasosCompletados.includes(stepNumber)&&stepNumber>progress.paso)){subtractionPedagogyUnit();return;}
  pedagogyState={step:stepNumber,questions:pedagogyQuestions(stepNumber),index:0,hits:0,locked:false,current:null};
  pedagogyQuestion();
}

function pedagogyQuestionVisual(question){
  if(question.kind==='units')return `${pedagogyNumberModel(question.a)}<div class="pedagogy-equation">${question.a} = 10 + ?</div>`;
  if(question.kind==='reach')return `${pedagogyNumberModel(question.a)}<div class="pedagogy-equation">${question.a} − ? = 10</div>`;
  if(question.kind==='bridge')return `<div class="ten-bridge small-bridge"><span>${question.a}</span><i>− ${question.toTen}</i><span class="bridge-ten">10</span><i>− ${question.rest}</i><span>?</span></div>`;
  if(question.kind==='story')return `<div class="pedagogy-story-question"><span>${question.icon}</span><b>${question.a} − ${question.b}</b></div>`;
  return `<div class="pedagogy-final-operation">${question.a} − ${question.b}</div>`;
}

function pedagogyOptions(correct){
  const options=new Set([correct]);
  for(const delta of pedagogyShuffle([-3,-2,-1,1,2,3])){const value=correct+delta;if(value>=0)options.add(value);if(options.size===3)break;}
  return pedagogyShuffle([...options]);
}

function pedagogyQuestion(){
  if(pedagogyState.index>=pedagogyState.questions.length){finishPedagogyStep();return;}
  const question=pedagogyState.questions[pedagogyState.index],step=PEDAGOGY_SUBTRACTION_STEPS[pedagogyState.step-1],number=pedagogyState.index+1,total=pedagogyState.questions.length;
  pedagogyState.current=question;pedagogyState.locked=false;
  const options=pedagogyOptions(question.r),width=Math.round((number-1)/total*100);
  layout(`<div class="top"><button class="btn secondary back" onclick="subtractionPedagogyUnit()">← Salir</button>${diamond()}</div>
    <div class="pedagogy-practice-top"><span>${step.icon} Misión ${pedagogyState.step}</span><b>${number} de ${total}</b></div>
    <div class="pedagogy-question-track"><i style="width:${width}%"></i></div>
    <div class="pedagogy-question-card"><button class="pedagogy-audio question-audio" onclick="pedagogyRepeatQuestion()" aria-label="Escuchar de nuevo">🔊</button>${pedagogyQuestionVisual(question)}<h2>${question.prompt}</h2></div>
    <div class="answers pedagogy-answers">${options.map(option=>`<button class="answer" onclick="answerPedagogy(${option},this)">${option}</button>`).join('')}</div>
    <div id="msg" class="msg pedagogy-message"></div>`);
  pedagogyState.index++;
  setTimeout(()=>pedagogySpeak(question.prompt),160);
}

function pedagogyRepeatQuestion(){if(pedagogyState.current)pedagogySpeak(pedagogyState.current.prompt);}

function answerPedagogy(value,button){
  if(pedagogyState.locked)return;pedagogyState.locked=true;
  const correct=pedagogyState.current.r,message=document.getElementById('msg');
  if(Number(value)===correct){
    pedagogyState.hits++;D.totalAciertos++;save(D);playChime('ok');button.classList.add('correct');if(message)message.textContent='¡Muy bien! Has cruzado este salto.';
  }else{
    playChime('bad');button.classList.add('wrong');if(message)message.textContent=`Casi. La respuesta es ${correct}.`;
    document.querySelectorAll('.pedagogy-answers .answer').forEach(option=>{if(Number(option.textContent)===correct)option.classList.add('correct');});
  }
  setTimeout(pedagogyQuestion,1050);
}

function finishPedagogyStep(){
  const stepNumber=pedagogyState.step,total=pedagogyState.questions.length,hits=pedagogyState.hits,needed=Math.ceil(total/2),passed=hits>=needed,progress=pedagogyUnitProgress(),wasDone=progress.pasosCompletados.includes(stepNumber);
  const percent=Math.round(hits/total*100);
  if(stepNumber===5)progress.mejorResultado=Math.max(progress.mejorResultado,percent);
  let reward=0,xp=0;
  if(passed){
    if(!wasDone){progress.pasosCompletados.push(stepNumber);progress.pasosCompletados.sort((a,b)=>a-b);reward=stepNumber===5?10:2;xp=stepNumber===5?10:4;D.diamantes+=reward;giveXP(xp);}
    if(stepNumber<5)progress.paso=Math.max(progress.paso,stepNumber+1);
    else{progress.paso=5;progress.completada=true;}
    checkAchievements();
  }
  save(D);
  if(!passed){
    layout(`<div class="top"><h2>¡Buen intento!</h2>${diamond()}</div><div class="pedagogy-result-icon">💪</div><div class="question score">${hits} de ${total}</div><p class="center">Necesitas ${needed} aciertos para completar la misión. Repasamos el ejemplo y lo intentamos otra vez.</p><div class="grid"><button class="btn primary" onclick="pedagogyLesson(${stepNumber})">🔄 Repasar y repetir</button><button class="btn secondary" onclick="subtractionPedagogyUnit()">← Volver a las misiones</button></div>`);return;
  }
  const final=stepNumber===5,title=final?'¡Puente del 10 dominado!':'¡Misión completada!',next=stepNumber+1;
  layout(`<div class="top"><h2>${title}</h2>${diamond(true)}</div><div class="pedagogy-result-icon">${final?'🏆':'⭐'}</div><div class="question score">${hits} de ${total}</div><p class="center">${final?'Ya sabes separar una resta en dos saltos usando el 10.':'¡Muy bien! La siguiente parada ya está preparada.'}</p>${reward?`<p class="center reward-line">+${reward} 💎 · +${xp} XP</p>`:'<p class="center muted">Misión practicada de nuevo.</p>'}<div class="grid">${final?'<button class="btn primary" onclick="pedagogyUnits()">🧭 Ver unidades</button>':`<button class="btn primary" onclick="pedagogyLesson(${next})">➡️ Siguiente misión</button>`}<button class="btn secondary" onclick="startPedagogyPractice(${stepNumber})">🔄 Practicar otra vez</button><button class="btn secondary" onclick="subtractionPedagogyUnit()">▦ Volver a las misiones</button></div>`);
}
