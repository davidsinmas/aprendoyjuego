/* V3.8.17 — palabras: mínimo de 3 sílabas */
(function(){
  if(typeof window.startWords!=='function'||!window.GAME)return;
  const originalStartWords=window.startWords;
  window.startWords=function(level){
    const n={...(level||{})};
    n.minSyllables=Math.max(3,Number(n.minSyllables)||0);
    if(Number.isFinite(Number(n.maxSyllables))&&Number(n.maxSyllables)<3)delete n.maxSyllables;
    const originalWords=GAME.words;
    GAME.words=originalWords.filter(w=>Array.isArray(w.syllables)&&w.syllables.length>=3);
    try{return originalStartWords(n);}finally{GAME.words=originalWords;}
  };
  if(Array.isArray(GAME.levels?.palabras)){
    GAME.levels.palabras.forEach(n=>{
      if(typeof n.desc==='string'){
        n.desc=n.desc.replace(/2 sílabas/g,'3 o más sílabas').replace(/2 y 3 sílabas/g,'3 o más sílabas');
      }
      if(n.minSyllables<3)n.minSyllables=3;
      if(n.maxSyllables<3)delete n.maxSyllables;
    });
  }
})();
