const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const storage=new Map(),app={innerHTML:''};
const context={
  console,
  localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},
  sessionStorage:{getItem:()=>null,setItem:()=>{}},
  document:{getElementById:id=>id==='app'?app:null,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({className:'',textContent:'',remove(){}}),body:{appendChild(){}}},
  navigator:{onLine:true},location:{reload(){}},URL:{createObjectURL:()=>'',revokeObjectURL(){}},File:function(){},FileReader:function(){},
  Audio:class{constructor(){this.currentTime=0;this.preload=''}play(){return Promise.resolve()}},
  MutationObserver:class{observe(){}},
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,requestAnimationFrame:fn=>fn(),confirm:()=>true,alert(){},
  addEventListener(){},dispatchEvent(){},CustomEvent:function(){},crypto:{},
  pedagogyHomeCard:()=>'',startGuardianDuel(){},openPlanetDefense(){},avatarCatalog:()=>[],AvatarSystem:{priceFor:()=>0},
};
context.window=context;
vm.createContext(context);
for(const file of ['js/data.js','js/avatar-data.js','js/storage.js','js/app.js','js/adaptive-daily.js','js/analytics.js','js/age-progression.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}

assert.equal(vm.runInContext('EXERCISE_CATALOG.length',context),11);
assert.equal(vm.runInContext("EXERCISE_BY_TYPE.numeroFaltante.engine",context),'missingNumber');
assert.equal(vm.runInContext("DAILY_TYPES.includes('numeroFaltante')&&GAME_CONTROLS.some(g=>g.type==='numeroFaltante')&&DAILY_GROUPS.some(g=>g.includes('numeroFaltante'))",context),true);
assert.equal(vm.runInContext("GAME.levels.numeroFaltante.length",context),50);
assert.equal(vm.runInContext("D.ajustes.juegosActivos.numeroFaltante",context),true);
vm.runInContext('home()',context);
assert.match(app.innerHTML,/El número que falta/);

vm.runInContext("startMissingNumber(GAME.levels.numeroFaltante[0])",context);
assert.match(app.innerHTML,/¿Qué número falta\?/);
assert.match(app.innerHTML,/□/);
assert.equal(vm.runInContext('state.type',context),'numeroFaltante');
assert.equal(vm.runInContext('state.total',context),10);
assert.equal(vm.runInContext('new Set(state.qs.map(q=>`${q.operation}:${q.a}:${q.b}:${q.blank}`)).size',context),10);
assert.equal(vm.runInContext('state.qs.every(q=>q.correct>=0&&q.correct<=state.level.max)',context),true);

vm.runInContext('state.hits=state.total;state.i=state.total;finishMissingNumber()',context);
assert.equal(vm.runInContext('D.estadisticas.numeroFaltante1.partidas',context),1);
vm.runInContext("startMissingNumber(GAME.levels.numeroFaltante[0],true)",context);
assert.equal(vm.runInContext('state.total',context),5);

vm.runInContext('parentMode=true;parentDashboard()',context);
assert.equal((app.innerHTML.match(/toggleGame\('numeroFaltante'\)/g)||[]).length,1);
console.log('Nuevo ejercicio: registro, 50 niveles, partida, progreso, reto diario y Zona de padres correctos.');
