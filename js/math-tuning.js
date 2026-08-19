/* V3.5.2 · Progresión reforzada de sumas */
(()=>{
  'use strict';

  const sumLevels=[
    {id:'suma1',level:1,name:'Nivel 1',desc:'Sumas básicas · resultado hasta 10',aMin:1,aMax:6,bMin:1,bMax:6,resultMax:10},
    {id:'suma2',level:2,name:'Nivel 2',desc:'Dos sumandos hasta 7 · resultado hasta 14',aMin:2,aMax:7,bMin:2,bMax:7,resultMax:14},
    {id:'suma3',level:3,name:'Nivel 3',desc:'Dos sumandos hasta 10 · resultado hasta 20',aMin:3,aMax:10,bMin:3,bMax:10,resultMax:20},
    {id:'suma4',level:4,name:'Nivel 4',desc:'Primer sumando hasta 15 · segundo hasta 10',aMin:5,aMax:15,bMin:3,bMax:10,resultMax:25},
    {id:'suma5',level:5,name:'Nivel 5',desc:'Primer sumando hasta 20 · segundo hasta 12',aMin:7,aMax:20,bMin:4,bMax:12,resultMax:30},
    {id:'suma6',level:6,name:'Nivel 6',desc:'Sumandos mayores · resultado hasta 40',aMin:10,aMax:25,bMin:5,bMax:15,resultMax:40},
    {id:'suma7',level:7,name:'Nivel 7',desc:'Primer sumando hasta 30 · segundo hasta 20',aMin:12,aMax:30,bMin:7,bMax:20,resultMax:50},
    {id:'suma8',level:8,name:'Nivel 8',desc:'Primer sumando hasta 40 · segundo hasta 25',aMin:15,aMax:40,bMin:10,bMax:25,resultMax:60},
    {id:'suma9',level:9,name:'Nivel 9',desc:'Sumas avanzadas · resultado hasta 75',aMin:20,aMax:50,bMin:12,bMax:30,resultMax:75},
    {id:'suma10',level:10,name:'Nivel 10',desc:'Reto final · resultado hasta 100',aMin:25,aMax:75,bMin:15,bMax:40,resultMax:100}
  ];

  if(typeof GAME!=='undefined'&&GAME.levels)GAME.levels.suma=sumLevels;

  if(typeof startMath==='function'){
    startMath=function(t,n,daily=false){
      const total=daily?GAME.dailyMathTotal:GAME.mathTotal;
      state={...state,type:t,level:n,mode:null,qs:[],i:0,hits:0,daily,total};
      const aMax=t==='resta'&&!D.ajustes.restasMayoresDe10?Math.min(10,n.aMax):n.aMax;
      const aMin=Math.max(1,Math.min(aMax,Number(n.aMin)||1));
      const bMin=Math.max(1,Number(n.bMin)||1);
      for(let a=aMin;a<=aMax;a++)for(let b=bMin;b<=n.bMax;b++){
        if(t==='suma'&&(!n.resultMax||a+b<=n.resultMax))state.qs.push({a,b,r:a+b});
        if(t==='resta'&&b<a)state.qs.push({a,b,r:a-b});
      }
      if(state.qs.length<total){
        for(let a=1;a<=aMax;a++)for(let b=1;b<=n.bMax;b++){
          if(t==='suma'&&(!n.resultMax||a+b<=n.resultMax))state.qs.push({a,b,r:a+b});
          if(t==='resta'&&b<a)state.qs.push({a,b,r:a-b});
        }
      }
      state.qs=mix(state.qs).slice(0,Math.min(total,state.qs.length));
      state.total=state.qs.length;
      question();
    };
  }
})();
