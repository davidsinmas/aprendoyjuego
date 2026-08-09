const STORE='aprendo_jugando_datos';
function blank(){
  return{
    versionDatos:10,
    perfil:{nombre:'Jugador'},
    diamantes:0,
    estadisticas:{},
    totalAciertos:0,
    nivelJugador:1,
    xp:0,
    retosDiarios:{fecha:'',sumas:false,restas:false,sopa:false,premio:false},
    retosCompletadosTotal:0,
    logros:[],
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
  let d;
  try{d=JSON.parse(localStorage.getItem(STORE))}catch{}
  if(!d)d=blank();
  d.perfil=d.perfil&&typeof d.perfil==='object'?d.perfil:{nombre:'Jugador'};
  if(!d.perfil.nombre)d.perfil.nombre='Jugador';
  d.diamantes=Math.max(0,Number(d.diamantes??d.monedas??0)||0);
  d.estadisticas=d.estadisticas&&typeof d.estadisticas==='object'?d.estadisticas:{};
  d.totalAciertos=Math.max(0,Number(d.totalAciertos)||0);
  d.nivelJugador=Math.max(1,Number(d.nivelJugador)||1);
  d.xp=Math.max(0,Number(d.xp)||0);
  d.retosDiarios=d.retosDiarios&&typeof d.retosDiarios==='object'?d.retosDiarios:{fecha:'',sumas:false,restas:false,sopa:false,premio:false};
  d.retosCompletadosTotal=Math.max(0,Number(d.retosCompletadosTotal)||0);
  d.logros=Array.isArray(d.logros)?d.logros:[];
  // Limpieza estructural de la tienda antigua.
  delete d.monedas;
  delete d.inventario;
  delete d.equipado;
  d.versionDatos=10;
  for(const id of ['suma1','suma2','suma3','resta1','resta2','resta3']){
    const v=localStorage.getItem('aprendo_stats_'+id);
    if(v&&!d.estadisticas[id])try{d.estadisticas[id]=JSON.parse(v)}catch{}
  }
  d.avatar=normalizeAvatar(d.avatar);
  save(d);return d;
}
function save(d){localStorage.setItem(STORE,JSON.stringify(d));}
