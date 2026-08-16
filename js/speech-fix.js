(()=>{
  const originalSpeakWord=window.speakWord;
  if(typeof originalSpeakWord!=='function')return;
  const wordActivities=new Set(['sonidoInicial','sonidoFinal','construir','ordenarSilabas','rimas']);
  window.speakWord=function(text,prefix=''){
    const current=typeof state!=='undefined'?state:null;
    if(prefix&&current&&wordActivities.has(current.type)&&current.i>1)prefix='';
    return originalSpeakWord(text,prefix);
  };
})();
