const GAME={
  total:5,
  mathTotal:10,
  dailyMathTotal:5,
  levels:{
    suma:[
      {id:'suma1',level:1,name:'Nivel 1',desc:'Números hasta 5 · resultado hasta 10',aMax:5,bMax:5,resultMax:10},
      {id:'suma2',level:2,name:'Nivel 2',desc:'Primer número hasta 7 · segundo hasta 5',aMax:7,bMax:5,resultMax:12},
      {id:'suma3',level:3,name:'Nivel 3',desc:'Primer número hasta 10 · segundo hasta 5',aMax:10,bMax:5,resultMax:15},
      {id:'suma4',level:4,name:'Nivel 4',desc:'Primer número hasta 12 · segundo hasta 6',aMax:12,bMax:6,resultMax:18},
      {id:'suma5',level:5,name:'Nivel 5',desc:'Primer número hasta 15 · segundo hasta 6',aMax:15,bMax:6,resultMax:20},
      {id:'suma6',level:6,name:'Nivel 6',desc:'Primer número hasta 18 · segundo hasta 7',aMax:18,bMax:7,resultMax:24},
      {id:'suma7',level:7,name:'Nivel 7',desc:'Primer número hasta 20 · segundo hasta 8',aMax:20,bMax:8,resultMax:27},
      {id:'suma8',level:8,name:'Nivel 8',desc:'Primer número hasta 24 · segundo hasta 8',aMax:24,bMax:8,resultMax:31},
      {id:'suma9',level:9,name:'Nivel 9',desc:'Primer número hasta 27 · segundo hasta 9',aMax:27,bMax:9,resultMax:35},
      {id:'suma10',level:10,name:'Nivel 10',desc:'Primer número hasta 30 · segundo siempre menor de 10',aMax:30,bMax:9,resultMax:39}
    ],
    resta:[
      {id:'resta1',level:1,name:'Nivel 1',desc:'Primer número hasta 5 · sin negativos',aMax:5,bMax:4},
      {id:'resta2',level:2,name:'Nivel 2',desc:'Primer número hasta 7 · segundo hasta 5',aMax:7,bMax:5},
      {id:'resta3',level:3,name:'Nivel 3',desc:'Primer número hasta 10 · segundo hasta 5',aMax:10,bMax:5},
      {id:'resta4',level:4,name:'Nivel 4',desc:'Primer número hasta 12 · segundo hasta 6',aMax:12,bMax:6},
      {id:'resta5',level:5,name:'Nivel 5',desc:'Primer número hasta 15 · segundo hasta 6',aMax:15,bMax:6},
      {id:'resta6',level:6,name:'Nivel 6',desc:'Primer número hasta 18 · segundo hasta 7',aMax:18,bMax:7},
      {id:'resta7',level:7,name:'Nivel 7',desc:'Primer número hasta 20 · segundo hasta 8',aMax:20,bMax:8},
      {id:'resta8',level:8,name:'Nivel 8',desc:'Primer número hasta 24 · segundo hasta 8',aMax:24,bMax:8},
      {id:'resta9',level:9,name:'Nivel 9',desc:'Primer número hasta 27 · segundo hasta 9',aMax:27,bMax:9},
      {id:'resta10',level:10,name:'Nivel 10',desc:'Primer número hasta 30 · segundo siempre menor de 10',aMax:30,bMax:9}
    ],
    sopa:[
      {id:'sopa1',name:'Nivel 1',desc:'5 × 5 · horizontal',size:5,dirs:['h']},
      {id:'sopa2',name:'Nivel 2',desc:'6 × 6 · horizontal y vertical',size:6,dirs:['h','v']},
      {id:'sopa3',name:'Nivel 3',desc:'7 × 7 · también al revés',size:7,dirs:['h','v','hr','vr']}
    ]
  },
  words:[['GATO','🐱'],['PATO','🦆'],['CASA','🏠'],['MESA','🪑'],['MANO','✋'],['LUNA','🌙'],['SOPA','🥣'],['CAMA','🛏️'],['SOL','☀️'],['PERA','🍐'],['PERRO','🐶'],['RANA','🐸'],['VACA','🐮'],['LEON','🦁'],['OSO','🐻'],['PEZ','🐟'],['RATON','🐭'],['MONO','🐵'],['CERDO','🐷'],['OVEJA','🐑'],['TIGRE','🐯'],['PANDA','🐼'],['ZORRO','🦊'],['KOALA','🐨'],['POLLO','🐤'],['ABEJA','🐝'],['FLOR','🌸'],['ARBOL','🌳'],['HOJA','🍃'],['NUBE','☁️'],['NIEVE','❄️'],['FUEGO','🔥'],['MAR','🌊'],['ISLA','🏝️'],['PAN','🍞'],['QUESO','🧀'],['HUEVO','🥚'],['LECHE','🥛'],['UVA','🍇'],['FRESA','🍓'],['COCHE','🚗'],['BARCO','🚢'],['TREN','🚆'],['AVION','✈️'],['BICI','🚲'],['BUS','🚌'],['RELOJ','⌚'],['LLAVE','🔑'],['LIBRO','📘'],['LAPIZ','✏️']].map(([word,icon])=>({word,icon}))
};
