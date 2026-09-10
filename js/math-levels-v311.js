/* V3.11.0 · Progresión matemática
   Baja ligeramente la dificultad de los niveles existentes de sumas/restas
   y amplía la progresión con 5 niveles nuevos.
   No modifica la tienda ni el sistema de avatar.
*/
(function(){
  'use strict';
  const suma=[
    [5,4,8],[6,4,9],[8,4,11],[10,5,14],[12,5,16],
    [15,6,20],[18,7,24],[21,7,27],[24,8,31],[27,8,35],
    [30,9,39],[34,9,43],[38,10,48],[42,10,52],[46,10,56]
  ];
  const resta=[
    [5,4],[6,4],[8,4],[10,5],[12,5],
    [15,6],[18,7],[21,7],[24,8],[27,8],
    [30,9],[34,9],[38,10],[42,10],[46,10]
  ];
  GAME.levels.suma.forEach((l,i)=>{
    const [a,b,r]=suma[i]; l.aMax=a;l.bMax=b;l.resultMax=r;
    l.desc=i===0?'Números hasta 5 · resultado hasta 8':`Números hasta ${a} · segundo hasta ${b} · resultado hasta ${r}`;
  });
  GAME.levels.resta.forEach((l,i)=>{
    const [a,b]=resta[i]; l.aMax=a;l.bMax=b;
    l.desc=i===0?'Primer número hasta 5 · sin negativos':`Primer número hasta ${a} · segundo hasta ${b} · sin negativos`;
  });
  for(let i=10;i<15;i++){
    const n=i+1;
    const [a,b,r]=suma[i];
    GAME.levels.suma.push({id:`suma${n}`,level:n,name:`Nivel ${n}`,desc:`Números hasta ${a} · segundo hasta ${b} · resultado hasta ${r}`,aMax:a,bMax:b,resultMax:r});
    const [ra,rb]=resta[i];
    GAME.levels.resta.push({id:`resta${n}`,level:n,name:`Nivel ${n}`,desc:`Primer número hasta ${ra} · segundo hasta ${rb} · sin negativos`,aMax:ra,bMax:rb});
  }
})();
