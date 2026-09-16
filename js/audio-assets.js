(()=>{
  'use strict';

  const remoteHandwriting='https://cdn.creativeclaw.co/u/d65593e1/audio/34505963-7d20-4e1c-8ce2-f505089dc3d2.mp3';
  const localHandwriting=new URL('assets/audio/narration/handwriting-letters.mp3',document.baseURI).href;
  const nativeFetch=window.fetch.bind(window);

  window.LudeikoAudioAssets=Object.freeze({
    handwritingLetters:localHandwriting
  });

  window.fetch=async function(input,init){
    let requested='';
    try{requested=typeof input==='string'?new URL(input,document.baseURI).href:input?.url||'';}catch{}
    if(requested!==remoteHandwriting)return nativeFetch(input,init);

    try{
      const localResponse=await nativeFetch(localHandwriting,{...init,mode:'same-origin'});
      if(localResponse.ok)return localResponse;
    }catch(error){
      console.warn('[Ludeiko] Audio local de escritura no disponible; se usará el origen de respaldo.',error);
    }
    return nativeFetch(input,init);
  };
})();
