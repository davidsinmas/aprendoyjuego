/* V3.9.4 — compatibilidad de entrada del PIN con Safari/iOS.
 * Safari puede enfocar mediante JavaScript un campo sin abrir el teclado
 * cuando el focus no procede directamente de un gesto del usuario.
 * La pantalla de Padres ya hace focus() automáticamente; en Safari
 * retiramos ese focus inicial para que el primer toque del usuario sea
 * quien active el teclado nativo. No se crea ningún teclado alternativo.
 */
(function(){
  'use strict';

  const isSafari=(()=>{
    const ua=navigator.userAgent||'';
    return /Safari/i.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Android/i.test(ua);
  })();

  if(!isSafari)return;

  function releaseProgrammaticFocus(){
    document.querySelectorAll('.parent-login input[type="password"][inputmode="numeric"]').forEach(input=>{
      if(document.activeElement===input)input.blur();
    });
  }

  function check(){
    releaseProgrammaticFocus();
  }

  const observer=new MutationObserver(()=>{
    requestAnimationFrame(check);
  });

  function init(){
    check();
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
