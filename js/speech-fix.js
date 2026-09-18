(()=>{
  const originalSpeakWord=window.speakWord;
  if(typeof originalSpeakWord!=='function')return;
  const wordActivities=new Set(['palabras','sonidoInicial','sonidoFinal','construir','ordenarSilabas','rimas']);
  window.speakWord=function(text,prefix=''){
    const current=typeof state!=='undefined'?state:null;
    if(prefix&&current&&wordActivities.has(current.type)&&current.i>1)prefix='';
    return originalSpeakWord(text,prefix);
  };

  const originalMathQuestion=window.question;
  if(typeof originalMathQuestion==='function'){
    window.question=function(){
      const current=typeof state!=='undefined'?state:null;
      const index=current?.i??-1,type=current?.type;
      const operation=(type==='suma'||type==='resta')&&index>=0&&index<current.total?current.qs[index]:null;
      const result=originalMathQuestion();
      if(operation){
        const word=type==='suma'?'más':'menos';
        setTimeout(()=>window.speakWord(`${operation.a} ${word} ${operation.b}`),140);
      }
      return result;
    };
  }

  const originalWordQuestion=window.wordQuestion;
  if(typeof originalWordQuestion==='function'){
    const wordInstructions={
      completeSyllable:'Completa la palabra',
      missingSyllable:'Elige la sílaba que falta',
      order2:'Ordena las sílabas para formar esta palabra',
      order3:'Ordena las sílabas para formar esta palabra',
      pictureWord:'Elige la palabra que corresponde al dibujo',
      missingLetter:'Completa la letra que falta',
      similarWord:'Elige la palabra correcta',
      pictureWord4:'Elige la palabra correcta'
    };
    window.wordQuestion=function(){
      const current=typeof state!=='undefined'?state:null;
      const index=current?.i??-1,question=index>=0&&index<current.total?current.qs[index]:null,mode=current?.mode;
      const result=originalWordQuestion();
      if(question&&current.type==='palabras'){
        const prefix=index===0?(wordInstructions[mode]||'Escucha la palabra'):'';
        const icon=document.querySelector('.word-exercise-icon'),button=document.createElement('button');
        button.type='button';button.className='listen-button word-listen-button';button.textContent='🔊';button.setAttribute('aria-label',`Escuchar ${question.word}`);
        button.onclick=()=>window.speakWord(question.word,prefix);
        if(icon)icon.insertAdjacentElement('afterend',button);
        setTimeout(()=>window.speakWord(question.word,prefix),140);
      }
      return result;
    };
  }

  const originalFinishDailyActivity=window.finishDailyActivity;
  if(typeof originalFinishDailyActivity==='function'){
    window.finishDailyActivity=function(type,title='¡Reto diario completado!'){
      const current=typeof state!=='undefined'?state:null,total=Math.max(1,current?.total||0),needed=Math.ceil(total*.5),hits=current?.hits||0;
      if(hits>=needed)return originalFinishDailyActivity(type,title);
      layout(`<div class="top"><h2>¡Inténtalo otra vez!</h2>${diamond()}</div><div class="question score">${hits} de ${total}</div><p class="center">Para completar el reto necesitas al menos ${needed} aciertos.</p><p class="center muted">Este intento no se marca como resuelto.</p><div class="grid"><button class="btn primary" onclick="startDaily('${type}')">Repetir reto</button><button class="btn secondary" onclick="home()">Volver a los retos</button></div>`);
    };
  }
})();
