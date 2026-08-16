(()=>{
  const originalSpeakWord=window.speakWord;
  if(typeof originalSpeakWord!=='function')return;
  const wordActivities=new Set(['sonidoInicial','sonidoFinal','construir','ordenarSilabas','rimas']);
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
})();
