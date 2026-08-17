// Compatibilidad con el validador histórico del actualizador: versionDatos:11
const STORE='aprendo_jugando_datos';
const STORE_BACKUP='aprendo_jugando_respaldo';
function storedProgressScore(d){
  if(!d||typeof d!=='object')return -1;
  const games=Object.values(d.estadisticas||{}).reduce((sum,item)=>sum+Math.max(0,Number(item?.partidas)||0),0);
  return games*1000+Math.max(0,Number(d.totalAciertos)||0)*10+Math.max(1,Number(d.nivelJugador)||1);
}
function readStored(key){try{return JSON.parse(localStorage.getItem(key))}catch{return null;}}
function blank(){
  return{
    versionDatos:18,
    perfil:{nombre:'Jugador'},
    diamantes:0,
    estadisticas:{},
    totalAciertos:0,
    nivelJugador:1,
    xp:0,
    retosDiarios:{fecha:'',retos:[],premio:false},
    retosCompletadosTotal:0,
    actionAccess:{date:'',available:false,consumed:false},
    dueloGuardianes:{unlocked:false,unlockedBy:null,matches:0},
    defensaPlaneta:{unlocked:false,unlockedBy:null,missions:0,bestScore:0},
    diferencias:{actual:1,completadas:0},
    unidadesPedagogicas:{restasMas10:{paso:1,pasosCompletados:[],completada:false,mejorResultado:0}},
    logros:[],
    ajustes:{multiplicadorPrecios:1,restasMayoresDe10:false},
    avatar:{
      owned:[],
      equipped:{back:null,legs:null,boots:null,chest:null,shoulders:null,gloves:null,head:null,helmet:null,shield:null,weapon:null,effects:null}
    }
  };
}
function normalizeAvatar(raw){
  const slots=['back','legs','boots','chest','shoulders','gloves','head','helmet','shield','weapon','effects'];
  const avatar=raw&&typeof raw==='object'?raw:{};
  const owned=Array.isArray(avatar.owned)?[...new Set(avatar.owned.filter(x=>typeof x==='string'))]:[];
  const source=avatar.equipped&&typeof avatar.equipped==='object'?avatar.equipped:{};
  const equipped={};
  for(const slot of slots)equipped[slot]=typeof source[slot]==='string'?source[slot]:null;
  return{owned,equipped};
}
function load(){
  const primary=readStored(STORE),backup=readStored(STORE_BACKUP);
  let d=storedProgressScore(backup)>storedProgressScore(primary)?backup:primary||backup;
  if(!d)d=blank();
  d.perfil=d.perfil&&typeof d.perfil==='object'?d.perfil:{nombre:'Jugador'};
  if(!d.perfil.nombre)d.perfil.nombre='Jugador';
  d.diamantes=Math.max(0,Number(d.diamantes??d.monedas??0)||0);
  d.estadisticas=d.estadisticas&&typeof d.estadisticas==='object'?d.estadisticas:{};
  d.totalAciertos=Math.max(0,Number(d.totalAciertos)||0);
  d.nivelJugador=Math.max(1,Number(d.nivelJugador)||1);
  d.xp=Math.max(0,Number(d.xp)||0);
  d.retosDiarios=d.retosDiarios&&typeof d.retosDiarios==='object'?d.retosDiarios:{fecha:'',retos:[],premio:false};
  if(!Array.isArray(d.retosDiarios.retos))d.retosDiarios.retos=[];
  d.retosCompletadosTotal=Math.max(0,Number(d.retosCompletadosTotal)||0);
  d.actionAccess=d.actionAccess&&typeof d.actionAccess==='object'?d.actionAccess:{date:'',available:false,consumed:false};
  d.actionAccess.date=typeof d.actionAccess.date==='string'?d.actionAccess.date:'';
  d.actionAccess.consumed=!!d.actionAccess.consumed;
  d.actionAccess.available=!!d.actionAccess.available&&!d.actionAccess.consumed;
  d.dueloGuardianes=d.dueloGuardianes&&typeof d.dueloGuardianes==='object'?d.dueloGuardianes:{};
  d.dueloGuardianes.unlocked=false;
  d.dueloGuardianes.unlockedBy=null;
  d.dueloGuardianes.matches=Math.max(0,Math.floor(Number(d.dueloGuardianes.matches)||0));
  d.defensaPlaneta=d.defensaPlaneta&&typeof d.defensaPlaneta==='object'?d.defensaPlaneta:{};
  d.defensaPlaneta.unlocked=false;
  d.defensaPlaneta.unlockedBy=null;
  d.defensaPlaneta.missions=Math.max(0,Math.floor(Number(d.defensaPlaneta.missions)||0));
  d.defensaPlaneta.bestScore=Math.max(0,Math.floor(Number(d.defensaPlaneta.bestScore)||0));
  d.diferencias=d.diferencias&&typeof d.diferencias==='object'?d.diferencias:{};
  d.diferencias.completadas=Math.min(50,Math.max(0,Math.floor(Number(d.diferencias.completadas)||0)));
  d.diferencias.actual=Math.min(50,Math.max(1,Math.floor(Number(d.diferencias.actual)||d.diferencias.completadas+1)));
  d.unidadesPedagogicas=d.unidadesPedagogicas&&typeof d.unidadesPedagogicas==='object'?d.unidadesPedagogicas:{};
  const subtractionUnit=d.unidadesPedagogicas.restasMas10&&typeof d.unidadesPedagogicas.restasMas10==='object'?d.unidadesPedagogicas.restasMas10:{};
  subtractionUnit.paso=Math.min(5,Math.max(1,Math.floor(Number(subtractionUnit.paso)||1)));
  subtractionUnit.pasosCompletados=Array.isArray(subtractionUnit.pasosCompletados)?[...new Set(subtractionUnit.pasosCompletados.map(Number).filter(step=>Number.isInteger(step)&&step>=1&&step<=5))]:[];
  subtractionUnit.completada=subtractionUnit.completada===true;
  subtractionUnit.mejorResultado=Math.min(100,Math.max(0,Math.floor(Number(subtractionUnit.mejorResultado)||0)));
  if(subtractionUnit.completada){subtractionUnit.paso=5;subtractionUnit.pasosCompletados=[1,2,3,4,5];}
  d.unidadesPedagogicas.restasMas10=subtractionUnit;
  d.logros=Array.isArray(d.logros)?d.logros:[];
  d.ajustes=d.ajustes&&typeof d.ajustes==='object'?d.ajustes:{multiplicadorPrecios:1,restasMayoresDe10:false};
  const rawMultiplier=Number(d.ajustes.multiplicadorPrecios);
  d.ajustes.multiplicadorPrecios=Math.min(3,Math.max(0.25,Number.isFinite(rawMultiplier)?Math.round(rawMultiplier*4)/4:1));
  d.ajustes.restasMayoresDe10=d.ajustes.restasMayoresDe10===true;
  delete d.monedas;
  delete d.inventario;
  delete d.equipado;
  d.versionDatos=18;
  for(const id of ['suma1','suma2','suma3','resta1','resta2','resta3']){
    const v=localStorage.getItem('aprendo_stats_'+id);
    if(v&&!d.estadisticas[id])try{d.estadisticas[id]=JSON.parse(v)}catch{}
  }
  d.avatar=normalizeAvatar(d.avatar);
  if(typeof AVATAR!=='undefined'&&Array.isArray(AVATAR.items)){
    const catalog=new Map(AVATAR.items.map(item=>[item.id,item]));
    d.avatar.owned=d.avatar.owned.filter(id=>catalog.has(id));
    for(const slot of Object.keys(d.avatar.equipped)){
      const item=catalog.get(d.avatar.equipped[slot]);
      if(!item||item.slot!==slot)d.avatar.equipped[slot]=null;
    }
  }
  save(d);return d;
}
function save(d){
  const serialized=JSON.stringify(d);
  localStorage.setItem(STORE,serialized);
  localStorage.setItem(STORE_BACKUP,serialized);
}
