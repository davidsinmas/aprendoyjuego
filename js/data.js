const GAME={
  total:5,
  levels:{
    suma:[
      {id:'suma1',name:'Nivel 1',desc:'Resultado hasta 10',max:10},
      {id:'suma2',name:'Nivel 2',desc:'Resultado hasta 20',max:20},
      {id:'suma3',name:'Nivel 3',desc:'Resultado hasta 100',max:100}
    ],
    resta:[
      {id:'resta1',name:'Nivel 1',desc:'Hasta 10, sin negativos',max:10},
      {id:'resta2',name:'Nivel 2',desc:'Hasta 20, sin negativos',max:20},
      {id:'resta3',name:'Nivel 3',desc:'Hasta 100, sin negativos',max:100}
    ],
    sopa:[
      {id:'sopa1',name:'Nivel 1',desc:'5 × 5 · horizontal',size:5,dirs:['h']},
      {id:'sopa2',name:'Nivel 2',desc:'6 × 6 · horizontal y vertical',size:6,dirs:['h','v']},
      {id:'sopa3',name:'Nivel 3',desc:'7 × 7 · también al revés',size:7,dirs:['h','v','hr','vr']}
    ]
  },
  words:[['GATO','🐱'],['PATO','🦆'],['CASA','🏠'],['MESA','🪑'],['MANO','✋'],['LUNA','🌙'],['SOPA','🥣'],['CAMA','🛏️'],['SOL','☀️'],['PERA','🍐'],['PERRO','🐶'],['RANA','🐸'],['VACA','🐮'],['LEON','🦁'],['OSO','🐻'],['PEZ','🐟'],['RATON','🐭'],['MONO','🐵'],['CERDO','🐷'],['OVEJA','🐑'],['TIGRE','🐯'],['PANDA','🐼'],['ZORRO','🦊'],['KOALA','🐨'],['POLLO','🐤'],['ABEJA','🐝'],['FLOR','🌸'],['ARBOL','🌳'],['HOJA','🍃'],['NUBE','☁️'],['NIEVE','❄️'],['FUEGO','🔥'],['MAR','🌊'],['ISLA','🏝️'],['PAN','🍞'],['QUESO','🧀'],['HUEVO','🥚'],['LECHE','🥛'],['UVA','🍇'],['FRESA','🍓'],['COCHE','🚗'],['BARCO','🚢'],['TREN','🚆'],['AVION','✈️'],['BICI','🚲'],['BUS','🚌'],['RELOJ','⌚'],['LLAVE','🔑'],['LIBRO','📘'],['LAPIZ','✏️']].map(([word,icon])=>({word,icon}))
};
