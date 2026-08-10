const GAME={
  total:5,
  mathTotal:10,
  wordTotal:10,
  compareTotal:10,
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
    comparar:[
      {id:'comparar1',level:1,name:'Nivel 1',desc:'Números del 1 al 5 · diferencias claras',min:1,max:5,minGap:2},
      {id:'comparar2',level:2,name:'Nivel 2',desc:'Números del 1 al 10 · diferencias claras',min:1,max:10,minGap:3},
      {id:'comparar3',level:3,name:'Nivel 3',desc:'Números del 1 al 10 · también consecutivos',min:1,max:10,minGap:1},
      {id:'comparar4',level:4,name:'Nivel 4',desc:'Números del 1 al 15',min:1,max:15,minGap:1},
      {id:'comparar5',level:5,name:'Nivel 5',desc:'Números del 1 al 20',min:1,max:20,minGap:1},
      {id:'comparar6',level:6,name:'Nivel 6',desc:'Números del 1 al 30',min:1,max:30,minGap:1},
      {id:'comparar7',level:7,name:'Nivel 7',desc:'Números del 10 al 40',min:10,max:40,minGap:1},
      {id:'comparar8',level:8,name:'Nivel 8',desc:'Números del 10 al 50 · parejas más cercanas',min:10,max:50,minGap:1,maxGap:10,closeChance:.55},
      {id:'comparar9',level:9,name:'Nivel 9',desc:'Números del 20 al 75 · diferencias pequeñas',min:20,max:75,minGap:1,maxGap:8,closeChance:.75},
      {id:'comparar10',level:10,name:'Nivel 10',desc:'Números del 1 al 100 · números muy próximos',min:1,max:100,minGap:1,maxGap:5,closeChance:1}
    ],
    palabras:[
      {id:'palabras1',level:1,name:'Nivel 1',desc:'Completa palabras fáciles de 2 sílabas',mode:'completeSyllable',minSyllables:2,maxSyllables:2,maxLen:5},
      {id:'palabras2',level:2,name:'Nivel 2',desc:'Elige la sílaba que falta',mode:'missingSyllable',minSyllables:2,maxSyllables:2,maxLen:5},
      {id:'palabras3',level:3,name:'Nivel 3',desc:'Ordena 2 sílabas para formar la palabra',mode:'order2',minSyllables:2,maxSyllables:2,maxLen:5},
      {id:'palabras4',level:4,name:'Nivel 4',desc:'Relaciona cada dibujo con su palabra',mode:'pictureWord',maxLen:5},
      {id:'palabras5',level:5,name:'Nivel 5',desc:'Completa una letra dentro de la palabra',mode:'missingLetter',minLen:4,maxLen:5},
      {id:'palabras6',level:6,name:'Nivel 6',desc:'Palabras de 2 y 3 sílabas',mode:'pictureWord',minSyllables:2,maxSyllables:3,maxLen:6},
      {id:'palabras7',level:7,name:'Nivel 7',desc:'Ordena 3 sílabas',mode:'order3',minSyllables:3,maxSyllables:3,maxLen:7},
      {id:'palabras8',level:8,name:'Nivel 8',desc:'Distingue palabras parecidas',mode:'similarWord',minLen:4,maxLen:6},
      {id:'palabras9',level:9,name:'Nivel 9',desc:'Completa palabras algo más largas',mode:'missingLetter',minLen:6,maxLen:8},
      {id:'palabras10',level:10,name:'Nivel 10',desc:'Elige la palabra correcta entre 4 opciones',mode:'pictureWord4',minLen:4,maxLen:7}
    ],
    sopa:[
      {id:'sopa1',level:1,name:'Nivel 1',desc:'4 × 4 · 2 palabras de 3 letras',size:4,count:2,minLen:3,maxLen:3,dirs:['h','v']},
      {id:'sopa2',level:2,name:'Nivel 2',desc:'5 × 5 · 3 palabras de 3 letras',size:5,count:3,minLen:3,maxLen:3,dirs:['h','v']},
      {id:'sopa3',level:3,name:'Nivel 3',desc:'5 × 5 · 3 palabras de 4 letras',size:5,count:3,minLen:4,maxLen:4,dirs:['h','v']},
      {id:'sopa4',level:4,name:'Nivel 4',desc:'6 × 6 · 4 palabras de 4 letras',size:6,count:4,minLen:4,maxLen:4,dirs:['h','v']},
      {id:'sopa5',level:5,name:'Nivel 5',desc:'6 × 6 · 4 palabras de 4–5 letras · alguna diagonal',size:6,count:4,minLen:4,maxLen:5,dirs:['h','v','d']},
      {id:'sopa6',level:6,name:'Nivel 6',desc:'7 × 7 · 5 palabras de hasta 5 letras',size:7,count:5,minLen:3,maxLen:5,dirs:['h','v','d']},
      {id:'sopa7',level:7,name:'Nivel 7',desc:'7 × 7 · 5 palabras · aparecen palabras de 6 letras',size:7,count:5,minLen:4,maxLen:6,dirs:['h','v','d']},
      {id:'sopa8',level:8,name:'Nivel 8',desc:'8 × 8 · 6 palabras y más letras distractoras',size:8,count:6,minLen:4,maxLen:6,dirs:['h','v','d']},
      {id:'sopa9',level:9,name:'Nivel 9',desc:'8 × 8 · 6 palabras de 5–7 letras',size:8,count:6,minLen:5,maxLen:7,dirs:['h','v','d']},
      {id:'sopa10',level:10,name:'Nivel 10',desc:'9 × 9 · 7 palabras infantiles de hasta 7 letras',size:9,count:7,minLen:4,maxLen:7,dirs:['h','v','d']}
    ]
  },
  words:[
    ['SOL','☀️',['SOL']],['MAR','🌊',['MAR']],['PAN','🍞',['PAN']],['PEZ','🐟',['PEZ']],['BUS','🚌',['BUS']],
    ['GATO','🐱',['GA','TO']],['PATO','🦆',['PA','TO']],['CASA','🏠',['CA','SA']],['MESA','🪑',['ME','SA']],['MANO','✋',['MA','NO']],['LUNA','🌙',['LU','NA']],['SOPA','🥣',['SO','PA']],['CAMA','🛏️',['CA','MA']],['PERA','🍐',['PE','RA']],['RANA','🐸',['RA','NA']],['VACA','🐮',['VA','CA']],['LEON','🦁',['LE','ON']],['OSO','🐻',['O','SO']],['MONO','🐵',['MO','NO']],['FLOR','🌸',['FLOR']],['HOJA','🍃',['HO','JA']],['NUBE','☁️',['NU','BE']],['ISLA','🏝️',['IS','LA']],['UVA','🍇',['U','VA']],['BICI','🚲',['BI','CI']],
    ['PERRO','🐶',['PE','RRO']],['RATON','🐭',['RA','TON']],['CERDO','🐷',['CER','DO']],['OVEJA','🐑',['O','VE','JA']],['TIGRE','🐯',['TI','GRE']],['PANDA','🐼',['PAN','DA']],['ZORRO','🦊',['ZO','RRO']],['KOALA','🐨',['KO','A','LA']],['POLLO','🐤',['PO','LLO']],['ABEJA','🐝',['A','BE','JA']],['ARBOL','🌳',['AR','BOL']],['NIEVE','❄️',['NIE','VE']],['FUEGO','🔥',['FUE','GO']],['QUESO','🧀',['QUE','SO']],['HUEVO','🥚',['HUE','VO']],['LECHE','🥛',['LE','CHE']],['FRESA','🍓',['FRE','SA']],['COCHE','🚗',['CO','CHE']],['BARCO','🚢',['BAR','CO']],['TREN','🚆',['TREN']],['AVION','✈️',['A','VION']],['RELOJ','⌚',['RE','LOJ']],['LLAVE','🔑',['LLA','VE']],['LIBRO','📘',['LI','BRO']],['LAPIZ','✏️',['LA','PIZ']],
    ['PELOTA','⚽',['PE','LO','TA']],['TOMATE','🍅',['TO','MA','TE']],['CAMISA','👕',['CA','MI','SA']],['MALETA','🧳',['MA','LE','TA']],['PALOMA','🕊️',['PA','LO','MA']],['CONEJO','🐰',['CO','NE','JO']],['ZAPATO','👟',['ZA','PA','TO']],['BANANA','🍌',['BA','NA','NA']],['NARANJA','🍊',['NA','RAN','JA']],['VENTANA','🪟',['VEN','TA','NA']],['CABALLO','🐴',['CA','BA','LLO']],['GALLINA','🐔',['GA','LLI','NA']],['ESTRELLA','⭐',['ES','TRE','LLA']]
  ].map(([word,icon,syllables])=>({word,icon,syllables}))
};
