let guardianDuel=null;
let guardianDuelAvatar=[];

const DUEL_W=1200;
const DUEL_H=600;
const DUEL_HALF=DUEL_W/2;
const DUEL_MAX_LIFE=100;
const DUEL_HIT_DAMAGE=20;
const DUEL_PLAYER_RADIUS=22;
const DUEL_EDGE=45;
const DUEL_BASE_FIRE=0.66;
const DUEL_MONSTER_BASE_FIRE=0.9;
const DUEL_MIN_FIRE=0.22;
const DUEL_PACE_SECONDS=5;
const DUEL_PACE_REDUCTION=0.10;
const DUEL_ROUNDS_TO_WIN=3;
const DUEL_INVULNERABILITY=2;
const DUEL_BONUS_TYPES=[
  {id:'power',icon:'💥',label:'Potencia',duration:8,color:'#ffb85c'},
  {id:'rapid',icon:'⚡',label:'Cadencia',duration:8,color:'#6ff5ff'},
  {id:'satellite',icon:'🛰️',label:'Satélite',duration:11,color:'#c69cff'},
  {id:'laser',icon:'🔆',label:'Láser',duration:7,color:'#ff668a'}
];

const DUEL_STARS=Array.from({length:88},(_,i)=>({
  x:(i*173+47)%DUEL_W,
  y:(i*97+31)%DUEL_H,
  r:.7+((i*11)%17)/10,
  phase:i*.57
}));

function duelFighters(){
  return[
    {role:'avatar',x:155,y:DUEL_H/2,targetX:155,targetY:DUEL_H/2,life:DUEL_MAX_LIFE,invulnerable:DUEL_INVULNERABILITY,fireTimer:.55,flash:0,bonuses:{power:0,rapid:0,satellite:0,laser:0},satelliteAngle:0,satelliteSerial:0,satellites:[],laserFire:.1},
    {role:'monster',x:DUEL_W-155,y:DUEL_H/2,targetX:DUEL_W-155,targetY:DUEL_H/2,life:DUEL_MAX_LIFE,invulnerable:DUEL_INVULNERABILITY,fireTimer:.8,flash:0}
  ];
}

function duelCanPlay(){
  return typeof guardianDuelAvailable==='function'&&guardianDuelAvailable();
}

function startGuardianDuel(){
  if(!duelCanPlay()){home();return;}
  if(typeof stopPlanetDefense==='function')stopPlanetDefense();
  stopGuardianDuel();
  document.body.classList.add('guardian-duel-active');
  A.innerHTML=`<main class="guardian-duel-menu">
    <section class="guardian-duel-menu-card">
      <button class="duel-close" onclick="exitGuardianDuel()" aria-label="Volver">×</button>
      <span class="duel-kicker">JUEGO DE ACCIÓN PARA DOS</span>
      <h1>Duelo de Guardianes</h1>
      <p>El Avatar apunta hacia el monstruo mientras esquiva sus disparos rectos y recoge mejoras temporales.</p>
      <div class="duel-rules">
        <div><span>🧑‍🚀 👾</span><b>Avatar contra monstruo</b><small>Un jugador en cada mitad</small></div>
        <div><span>💥 ⚡ 🛰️ 🔆</span><b>Bonus temporales</b><small>El láser sustituye los demás disparos mientras está activo</small></div>
        <div><span>🏆</span><b>Mejor de 5</b><small>Gana quien llega a 3 rondas</small></div>
      </div>
      <button class="duel-main-button" onclick="beginGuardianDuelMatch()">EMPEZAR PARTIDA</button>
      <small class="duel-landscape-hint">↻ Coloca el móvil en horizontal</small>
    </section>
  </main>`;
  duelLoadAvatar();
}

function duelLoadAvatar(){
  guardianDuelAvatar=[];
  if(typeof AVATAR==='undefined')return;
  const sources=[];
  if(AVATAR.base&&AVATAR.base.src)sources.push({src:AVATAR.base.src,layer:AVATAR.base.layer||10});
  const equipped=D&&D.avatar&&D.avatar.equipped?D.avatar.equipped:{};
  for(const [slot,id] of Object.entries(equipped)){
    if(!id)continue;
    const item=(AVATAR.items||[]).find(candidate=>candidate.id===id);
    if(item&&item.avatarLayer)sources.push({src:item.avatarLayer,layer:AVATAR.slots?.[slot]?.layer||50});
  }
  sources.sort((a,b)=>a.layer-b.layer).forEach(source=>{
    const image=new Image();
    image.onload=()=>{source.image=image;};
    image.src=source.src;
    guardianDuelAvatar.push(source);
  });
}

function beginGuardianDuelMatch(){
  if(!duelCanPlay()){exitGuardianDuel();return;}
  stopGuardianDuel(false);
  document.body.classList.add('guardian-duel-active');
  A.innerHTML=`<main class="guardian-duel-shell">
    <header class="duel-topbar">
      <button class="duel-back-button" onclick="exitGuardianDuel()">← SALIR</button>
      <div class="duel-brand"><small>APRENDO JUGANDO</small><b>Duelo de Guardianes</b></div>
      <div class="duel-match-score"><b id="duelScore0">0</b><span>MEJOR DE 5</span><b id="duelScore1">0</b></div>
    </header>
    <section class="duel-arena">
      <div class="duel-hud duel-hud-left"><div><b>AVATAR</b><small>RECOGE LOS BONUS</small></div><div class="duel-health"><i><span id="duelLifeBar0"></span></i><b id="duelLife0">5</b></div></div>
      <div class="duel-hud duel-hud-right"><div><b>MONSTRUO</b><small>DISPARO RECTO</small></div><div class="duel-health"><i><span id="duelLifeBar1"></span></i><b id="duelLife1">5</b></div></div>
      <button id="duelPause" class="duel-pause" onclick="toggleGuardianDuelPause()" aria-label="Pausa">Ⅱ</button>
      <div id="duelPace" class="duel-pace"><small>RITMO</small><b>NORMAL</b></div>
      <div id="duelBonusHud" class="duel-bonus-hud"><span>💫 Busca bonus</span></div>
      <canvas id="guardianDuelCanvas" width="${DUEL_W}" height="${DUEL_H}" aria-label="Arena para dos jugadores"></canvas>
      <div id="duelOverlay" class="duel-overlay"></div>
    </section>
    <footer class="duel-footer"><span>Avatar · apunta al monstruo</span><b>Satélites acumulables · láser horizontal</b><span>Monstruo · disparo recto</span></footer>
  </main>`;

  const canvas=document.getElementById('guardianDuelCanvas');
  const ctx=canvas&&canvas.getContext('2d');
  if(!canvas||!ctx){exitGuardianDuel();return;}
  guardianDuel={
    canvas,ctx,status:'countdown',scores:[0,0],fighters:duelFighters(),bullets:[],particles:[],bonuses:[],pointers:new Map(),keys:new Set(),
    noHitTime:0,pace:0,countdown:3,countdownShown:3,last:0,frame:0,roundWinner:null,matchWinner:null,bonusTimer:3.4,bonusHudKey:'',
    handlers:{}
  };
  duelBindControls();
  duelResetRound();
  guardianDuel.frame=requestAnimationFrame(duelLoop);
}

function duelBindControls(){
  const game=guardianDuel;
  if(!game)return;
  const canvas=game.canvas;
  game.handlers.pointerDown=event=>{
    if(!guardianDuel||!['countdown','playing'].includes(game.status))return;
    event.preventDefault();
    const point=duelPointerPosition(event),owner=point.x<DUEL_HALF?0:1;
    game.pointers.set(event.pointerId,owner);
    try{canvas.setPointerCapture(event.pointerId);}catch(e){}
    duelSetTarget(owner,point.x,point.y);
  };
  game.handlers.pointerMove=event=>{
    const owner=game.pointers.get(event.pointerId);
    if(owner===undefined)return;
    event.preventDefault();
    const point=duelPointerPosition(event);
    duelSetTarget(owner,point.x,point.y);
  };
  game.handlers.pointerUp=event=>game.pointers.delete(event.pointerId);
  game.handlers.keyDown=event=>{
    const key=event.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key))event.preventDefault();
    if(key==='escape'){toggleGuardianDuelPause();return;}
    game.keys.add(key);
  };
  game.handlers.keyUp=event=>game.keys.delete(event.key.toLowerCase());
  game.handlers.visibility=()=>{if(document.hidden&&guardianDuel&&guardianDuel.status==='playing')toggleGuardianDuelPause();};
  canvas.addEventListener('pointerdown',game.handlers.pointerDown,{passive:false});
  canvas.addEventListener('pointermove',game.handlers.pointerMove,{passive:false});
  canvas.addEventListener('pointerup',game.handlers.pointerUp);
  canvas.addEventListener('pointercancel',game.handlers.pointerUp);
  window.addEventListener('keydown',game.handlers.keyDown,{passive:false});
  window.addEventListener('keyup',game.handlers.keyUp);
  document.addEventListener('visibilitychange',game.handlers.visibility);
}

function duelPointerPosition(event){
  const rect=guardianDuel.canvas.getBoundingClientRect();
  return{x:(event.clientX-rect.left)/rect.width*DUEL_W,y:(event.clientY-rect.top)/rect.height*DUEL_H};
}

function duelSetTarget(owner,x,y){
  if(!guardianDuel)return;
  const fighter=guardianDuel.fighters[owner];
  fighter.targetX=owner===0?Math.max(DUEL_EDGE,Math.min(DUEL_HALF-DUEL_EDGE,x)):Math.max(DUEL_HALF+DUEL_EDGE,Math.min(DUEL_W-DUEL_EDGE,x));
  fighter.targetY=Math.max(DUEL_EDGE+35,Math.min(DUEL_H-DUEL_EDGE,y));
}

function duelResetRound(){
  const game=guardianDuel;
  if(!game)return;
  game.status='countdown';
  game.fighters=duelFighters();
  game.bullets=[];
  game.particles=[];
  game.bonuses=[];
  game.pointers.clear();
  game.noHitTime=0;
  game.pace=0;
  game.countdown=3;
  game.countdownShown=3;
  game.roundWinner=null;
  game.bonusTimer=3.4+Math.random()*1.2;
  game.bonusHudKey='';
  game.last=0;
  duelUpdateHud();
  duelUpdateBonusHud();
  duelOverlay(`<div class="duel-countdown"><b id="duelCountdown">3</b><span>¡PREPARADOS!</span></div>`);
  window.GameSound?.play('countdown');
}

function nextGuardianDuelRound(){duelResetRound();}

function newGuardianDuelMatch(){
  if(!guardianDuel)return;
  if(!duelCanPlay()){exitGuardianDuel();return;}
  guardianDuel.scores=[0,0];
  guardianDuel.matchWinner=null;
  duelResetRound();
}

function toggleGuardianDuelPause(){
  const game=guardianDuel;
  if(!game)return;
  const pause=document.getElementById('duelPause');
  if(game.status==='playing'){
    game.status='paused';
    if(pause)pause.textContent='▶';
    duelOverlay(`<div class="duel-result"><span>⏸</span><h2>Pausa</h2><button class="duel-main-button" onclick="toggleGuardianDuelPause()">CONTINUAR</button><button class="duel-text-button" onclick="exitGuardianDuel()">Terminar partida</button></div>`);
  }else if(game.status==='paused'){
    game.status='playing';
    game.last=0;
    if(pause)pause.textContent='Ⅱ';
    duelOverlay('');
  }
}

function duelOverlay(content){
  const overlay=document.getElementById('duelOverlay');
  if(!overlay)return;
  overlay.innerHTML=content;
  overlay.classList.toggle('visible',!!content);
}

function duelLoop(now){
  const game=guardianDuel;
  if(!game)return;
  const time=now/1000;
  let dt=game.last?Math.min((now-game.last)/1000,.035):0;
  game.last=now;
  if(game.status==='countdown'){
    game.countdown-=dt;
    const shown=Math.max(1,Math.ceil(game.countdown));
    if(shown!==game.countdownShown){game.countdownShown=shown;const el=document.getElementById('duelCountdown');if(el)el.textContent=shown;window.GameSound?.play('countdown');}
    if(game.countdown<=0){game.status='playing';duelOverlay('');}
    dt=0;
  }else if(game.status!=='playing')dt=0;
  if(dt>0)duelUpdate(dt);
  duelDraw(time);
  game.frame=requestAnimationFrame(duelLoop);
}

function duelUpdate(dt){
  const game=guardianDuel;
  game.noHitTime+=dt;
  const pace=Math.min(6,Math.floor(game.noHitTime/DUEL_PACE_SECONDS));
  if(pace!==game.pace){game.pace=pace;duelUpdateHud();}
  const speed=290,p1=game.fighters[0],p2=game.fighters[1],keys=game.keys;
  if(keys.has('a'))p1.targetX-=speed*dt;if(keys.has('d'))p1.targetX+=speed*dt;if(keys.has('w'))p1.targetY-=speed*dt;if(keys.has('s'))p1.targetY+=speed*dt;
  if(keys.has('arrowleft'))p2.targetX-=speed*dt;if(keys.has('arrowright'))p2.targetX+=speed*dt;if(keys.has('arrowup'))p2.targetY-=speed*dt;if(keys.has('arrowdown'))p2.targetY+=speed*dt;
  duelSetTarget(0,p1.targetX,p1.targetY);duelSetTarget(1,p2.targetX,p2.targetY);
  for(const fighter of game.fighters){
    const smoothing=Math.min(1,dt*15);
    fighter.x+=(fighter.targetX-fighter.x)*smoothing;
    fighter.y+=(fighter.targetY-fighter.y)*smoothing;
    fighter.invulnerable=Math.max(0,fighter.invulnerable-dt);
    fighter.flash=Math.max(0,fighter.flash-dt);
    fighter.fireTimer-=dt;
  }

  const laserWasActive=p1.bonuses.laser>0;
  for(const type of DUEL_BONUS_TYPES){
    if(type.id==='satellite')continue;
    if(type.id==='laser')p1.bonuses.laser=Math.max(0,p1.bonuses.laser-dt);
    else if(!laserWasActive)p1.bonuses[type.id]=Math.max(0,p1.bonuses[type.id]-dt);
  }
  const laserActive=p1.bonuses.laser>0;
  if(laserWasActive&&!laserActive)game.bullets=game.bullets.filter(bullet=>bullet.kind!=='laser');
  p1.satelliteAngle=(p1.satelliteAngle+dt*2.6)%(Math.PI*2);
  for(let index=0;index<p1.satellites.length;index++){
    const satellite=p1.satellites[index];
    if(!laserActive){
      satellite.life-=dt;satellite.fireTimer-=dt;
      if(satellite.life>0&&satellite.fireTimer<=0){duelFireSatellite(satellite,index);satellite.fireTimer=.68+Math.random()*.12;}
    }
  }
  p1.satellites=p1.satellites.filter(satellite=>satellite.life>0);
  p1.bonuses.satellite=p1.satellites.reduce((remaining,satellite)=>Math.max(remaining,satellite.life),0);
  p1.laserFire-=dt;
  if(laserActive&&p1.laserFire<=0){duelFireLaser();p1.laserFire=.34;}

  for(const owner of [0,1]){
    const fighter=game.fighters[owner];
    if(owner===0&&laserActive){fighter.fireTimer=Math.max(fighter.fireTimer,.08);continue;}
    if(fighter.fireTimer<=0){
      duelFire(owner);
      let interval=Math.max(DUEL_MIN_FIRE,(owner===0?DUEL_BASE_FIRE:DUEL_MONSTER_BASE_FIRE)-game.pace*DUEL_PACE_REDUCTION);
      if(owner===0&&p1.bonuses.rapid>0)interval=Math.max(.16,interval*.52);
      fighter.fireTimer=interval+Math.random()*.04;
    }
  }
  game.bonusTimer-=dt;
  if(game.bonusTimer<=0){
    duelSpawnBonus();
    game.bonusTimer=5+Math.random()*2.2;
  }
  for(const bonus of game.bonuses){
    bonus.x+=bonus.vx*dt;
    bonus.life-=dt;
    if(bonus.life>0&&Math.hypot(bonus.x-p1.x,bonus.y-p1.y)<DUEL_PLAYER_RADIUS+bonus.r)duelCollectBonus(bonus);
  }
  game.bonuses=game.bonuses.filter(bonus=>bonus.life>0&&bonus.x>-45);
  duelUpdateBonusHud();

  for(const bullet of game.bullets){
    bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;
    if(bullet.bounce){
      const top=18+bullet.r,bottom=DUEL_H-18-bullet.r;
      if(bullet.y<top&&bullet.vy<0){bullet.y=top;bullet.vy*=-1;window.GameSound?.play('bounce');}
      if(bullet.y>bottom&&bullet.vy>0){bullet.y=bottom;bullet.vy*=-1;window.GameSound?.play('bounce');}
    }
    const targetId=bullet.owner===0?1:0,target=game.fighters[targetId];
    if(bullet.life>0&&target.invulnerable<=0&&Math.hypot(bullet.x-target.x,bullet.y-target.y)<DUEL_PLAYER_RADIUS+bullet.r){
      bullet.life=0;
      target.life=Math.max(0,target.life-(bullet.damage||DUEL_HIT_DAMAGE));
      target.invulnerable=DUEL_INVULNERABILITY;target.flash=.22;
      target.targetX+=bullet.owner===0?20:-20;
      game.noHitTime=0;game.pace=0;
      duelParticles(target.x,target.y,bullet.owner===0?'#76f6ff':'#bd80ff',18);
      window.GameSound?.play('hit');
      duelUpdateHud();
      if(target.life<=0){duelEndRound(bullet.owner);break;}
    }
  }
  game.bullets=game.bullets.filter(b=>b.life>0&&b.x>-50&&b.x<DUEL_W+50&&b.y>-50&&b.y<DUEL_H+50);
  for(const particle of game.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vx*=.98;particle.vy*=.98;particle.life-=dt;}
  game.particles=game.particles.filter(p=>p.life>0);
}

function duelFire(owner){
  const game=guardianDuel,shooter=game.fighters[owner],direction=owner===0?1:-1;
  const x=shooter.x+direction*40,y=shooter.y-1;
  if(owner===0){
    const powered=shooter.bonuses.power>0,target=game.fighters[1],dx=target.x-x,dy=target.y-y,length=Math.max(1,Math.hypot(dx,dy)),speed=540;
    game.bullets.push({x,y,vx:dx/length*speed,vy:dy/length*speed,owner,life:3.2,r:powered?12:8,damage:powered?40:DUEL_HIT_DAMAGE,kind:powered?'power':'avatar'});
    duelParticles(x,y,powered?'#ffb85c':'#75f5ff',powered?7:4);
    window.GameSound?.play('shoot','avatar');
    return;
  }
  game.bullets.push({x,y,vx:-420,vy:0,owner,life:3.2,r:9,damage:DUEL_HIT_DAMAGE,kind:'monster'});
  duelParticles(x,y,'#bd80ff',5);
  window.GameSound?.play('shoot','monster');
}

function duelSatellitePosition(satellite){
  const fighter=guardianDuel.fighters[0],radius=48+(satellite.ring||0)*15,angle=fighter.satelliteAngle+satellite.offset;
  return{x:fighter.x+Math.cos(angle)*radius,y:fighter.y+Math.sin(angle)*radius};
}

function duelFireSatellite(satellite,index){
  const game=guardianDuel,point=duelSatellitePosition(satellite),speeds=[380,455,530,605,680],vertical=[-175,-85,0,85,175],colors=['#9cf6ff','#8dc5ff','#c69cff','#ef9cff','#ff9fd3'];
  for(let shot=0;shot<speeds.length;shot++)game.bullets.push({x:point.x+13,y:point.y+(shot-2)*3,vx:speeds[shot]+index*12,vy:vertical[shot],owner:0,life:3.4,r:4.5,damage:8,kind:'satellite',bounce:true,color:colors[shot]});
  duelParticles(point.x+10,point.y,'#c69cff',7);
  window.GameSound?.play('shoot','satellite');
}

function duelFireLaser(){
  const game=guardianDuel,shooter=game.fighters[0],x=shooter.x+42,y=shooter.y;
  game.bullets.push({x,y,vx:1120,vy:0,owner:0,life:1.25,r:7,damage:DUEL_HIT_DAMAGE,kind:'laser'});
  duelParticles(x,y,'#ff668a',8);window.GameSound?.play('shoot','laser');
}

function duelSpawnBonus(){
  const game=guardianDuel,type=DUEL_BONUS_TYPES[Math.floor(Math.random()*DUEL_BONUS_TYPES.length)];
  game.bonuses.push({type,x:DUEL_HALF-34,y:105+Math.random()*(DUEL_H-210),vx:-60-Math.random()*14,life:8.3,r:24,phase:Math.random()*Math.PI*2});
  window.GameSound?.play('bonusAppear');
}

function duelCollectBonus(bonus){
  const fighter=guardianDuel.fighters[0];
  if(bonus.type.id==='satellite'){
    const serial=fighter.satelliteSerial++;
    fighter.satellites.push({life:bonus.type.duration,fireTimer:.08+fighter.satellites.length*.06,offset:serial*2.399963,ring:serial%2});
    fighter.bonuses.satellite=Math.max(fighter.bonuses.satellite,bonus.type.duration);
  }else{
    fighter.bonuses[bonus.type.id]=bonus.type.duration;
    if(bonus.type.id==='laser'){fighter.laserFire=.04;guardianDuel.bullets=guardianDuel.bullets.filter(bullet=>bullet.owner!==0||bullet.kind==='laser');}
  }
  bonus.life=0;
  duelParticles(bonus.x,bonus.y,bonus.type.color,20);
  window.GameSound?.play('bonus');
  duelUpdateBonusHud();
}

function duelUpdateBonusHud(){
  const game=guardianDuel,element=document.getElementById('duelBonusHud');
  if(!game||!element)return;
  const active=DUEL_BONUS_TYPES.filter(type=>game.fighters[0].bonuses[type.id]>0);
  const satellites=game.fighters[0].satellites.length,key=active.map(type=>type.id+Math.ceil(game.fighters[0].bonuses[type.id])+(type.id==='satellite'?`x${satellites}`:'')).join('|');
  if(key===game.bonusHudKey)return;
  game.bonusHudKey=key;
  element.innerHTML=active.length?active.map(type=>{const paused=game.fighters[0].bonuses.laser>0&&type.id!=='laser';return `<span style="--bonus-color:${type.color}">${paused?'⏸ ':''}${type.icon} ${type.label}${type.id==='satellite'&&satellites>1?` ×${satellites}`:''} <b>${paused?'PAUSA':Math.ceil(game.fighters[0].bonuses[type.id])+'s'}</b></span>`;}).join(''):'<span>💫 Busca bonus</span>';
}

function duelParticles(x,y,color,amount){
  if(!guardianDuel)return;
  for(let i=0;i<amount;i++){
    const angle=i/amount*Math.PI*2+Math.random()*.4,speed=70+Math.random()*220;
    guardianDuel.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.3+Math.random()*.45,maxLife:.75,color,r:2+Math.random()*4});
  }
}

function duelEndRound(winner){
  const game=guardianDuel;
  if(!game||game.status!=='playing')return;
  game.scores[winner]++;
  game.roundWinner=winner;
  const winnerName=winner===0?'Avatar':'Monstruo';
  const defeated=game.fighters[winner===0?1:0];
  duelParticles(defeated.x,defeated.y,winner===0?'#ff6ba8':'#6df2ff',34);
  duelUpdateHud();
  if(game.scores[winner]>=DUEL_ROUNDS_TO_WIN){
    game.status='matchOver';game.matchWinner=winner;
    window.GameSound?.play('win');
    D.dueloGuardianes.matches=(D.dueloGuardianes.matches||0)+1;
    if(typeof consumeActionGameAccess==='function')consumeActionGameAccess();else save(D);
    const replay=duelCanPlay()?'<button class="duel-main-button" onclick="newGuardianDuelMatch()">NUEVA PARTIDA</button>':'';
    duelOverlay(`<div class="duel-result duel-match-result"><span>🏆</span><small>PARTIDA TERMINADA</small><h2>¡Gana ${winnerName}!</h2><div class="duel-final-score"><b>${game.scores[0]}</b><i>—</i><b>${game.scores[1]}</b></div>${replay}<button class="duel-text-button" onclick="exitGuardianDuel()">Volver a Aprendo Jugando</button></div>`);
  }else{
    game.status='roundOver';
    window.GameSound?.play('round');
    duelOverlay(`<div class="duel-result"><span>⭐</span><small>RONDA TERMINADA</small><h2>¡Punto para ${winnerName}!</h2><div class="duel-final-score"><b>${game.scores[0]}</b><i>—</i><b>${game.scores[1]}</b></div><button class="duel-main-button" onclick="nextGuardianDuelRound()">SIGUIENTE RONDA</button><button class="duel-text-button" onclick="exitGuardianDuel()">Terminar partida</button></div>`);
  }
}

function duelUpdateHud(){
  if(!guardianDuel)return;
  guardianDuel.fighters.forEach((fighter,index)=>{
    const bar=document.getElementById(`duelLifeBar${index}`),life=document.getElementById(`duelLife${index}`),score=document.getElementById(`duelScore${index}`);
    if(bar)bar.style.width=`${fighter.life}%`;
    if(life)life.textContent=Math.ceil(fighter.life/DUEL_HIT_DAMAGE);
    if(score)score.textContent=guardianDuel.scores[index];
  });
  const pace=document.getElementById('duelPace');
  if(pace){pace.className=`duel-pace pace-${guardianDuel.pace}`;const label=pace.querySelector('b');if(label)label.textContent=guardianDuel.pace?'×'+(guardianDuel.pace+1):'NORMAL';}
}

function duelDraw(time){
  const game=guardianDuel,ctx=game.ctx;
  duelDrawArena(ctx,time);
  game.bonuses.forEach(bonus=>duelDrawBonus(ctx,bonus,time));
  game.bullets.forEach(bullet=>duelDrawBullet(ctx,bullet));
  game.fighters[0].satellites.forEach(satellite=>duelDrawSatellite(ctx,duelSatellitePosition(satellite),time));
  duelDrawFighter(ctx,game.fighters[0],0,time);
  duelDrawFighter(ctx,game.fighters[1],1,time);
  for(const particle of game.particles){ctx.globalAlpha=Math.max(0,particle.life/particle.maxLife);ctx.fillStyle=particle.color;ctx.beginPath();ctx.arc(particle.x,particle.y,particle.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
}

function duelDrawArena(ctx,time){
  const sky=ctx.createLinearGradient(0,0,0,DUEL_H);sky.addColorStop(0,'#080c28');sky.addColorStop(1,'#151a3f');ctx.fillStyle=sky;ctx.fillRect(0,0,DUEL_W,DUEL_H);
  const left=ctx.createRadialGradient(170,DUEL_H/2,10,170,DUEL_H/2,480);left.addColorStop(0,'rgba(25,210,255,.22)');left.addColorStop(1,'rgba(25,210,255,0)');ctx.fillStyle=left;ctx.fillRect(0,0,DUEL_HALF,DUEL_H);
  const right=ctx.createRadialGradient(DUEL_W-170,DUEL_H/2,10,DUEL_W-170,DUEL_H/2,480);right.addColorStop(0,'rgba(142,79,255,.23)');right.addColorStop(1,'rgba(142,79,255,0)');ctx.fillStyle=right;ctx.fillRect(DUEL_HALF,0,DUEL_HALF,DUEL_H);
  for(const star of DUEL_STARS){ctx.globalAlpha=.25+Math.sin(time*1.8+star.phase)*.18;ctx.fillStyle=star.x<DUEL_HALF?'#b8f7ff':'#dfc6ff';ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(151,189,255,.08)';ctx.lineWidth=1;
  for(let x=0;x<=DUEL_W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,DUEL_H);ctx.stroke();}
  for(let y=0;y<=DUEL_H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(DUEL_W,y);ctx.stroke();}
  ctx.strokeStyle='rgba(224,247,255,.8)';ctx.lineWidth=3;ctx.setLineDash([12,12]);ctx.lineDashOffset=-time*45;ctx.beginPath();ctx.moveTo(DUEL_HALF,0);ctx.lineTo(DUEL_HALF,DUEL_H);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(131,246,255,.08)';duelRoundRect(ctx,18,18,DUEL_HALF-36,DUEL_H-36,26);ctx.fill();ctx.fillStyle='rgba(161,105,255,.08)';duelRoundRect(ctx,DUEL_HALF+18,18,DUEL_HALF-36,DUEL_H-36,26);ctx.fill();
}

function duelDrawFighter(ctx,fighter,owner,time){
  const avatar=owner===0,bob=Math.sin(time*7+owner*2)*2;
  ctx.save();ctx.translate(fighter.x,fighter.y+bob);if(fighter.invulnerable>0&&Math.floor(fighter.invulnerable*16)%2===0)ctx.globalAlpha=.3;
  const aura=ctx.createRadialGradient(0,0,2,0,0,54);aura.addColorStop(0,avatar?'rgba(84,235,255,.38)':'rgba(158,96,255,.42)');aura.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(0,0,54,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,29,24,7,0,0,Math.PI*2);ctx.fill();
  if(avatar)duelDrawAvatar(ctx);else duelDrawMonster(ctx,time);
  if(fighter.flash>0){ctx.globalAlpha=Math.min(1,fighter.flash*4);ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,-2,37,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function duelDrawAvatar(ctx){
  const color='#55e9ff',dark='#164a77';
  const loaded=guardianDuelAvatar.filter(layer=>layer.image&&layer.image.complete);
  if(loaded.length){for(const layer of loaded)ctx.drawImage(layer.image,-48,-48,96,96);}else{
    ctx.strokeStyle=dark;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8,12);ctx.lineTo(-10,28);ctx.moveTo(8,12);ctx.lineTo(10,28);ctx.stroke();
    ctx.fillStyle=color;duelRoundRect(ctx,-19,-18,38,40,10);ctx.fill();ctx.fillStyle='#eefbff';ctx.beginPath();ctx.arc(0,-28,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111a3b';duelRoundRect(ctx,-13,-34,27,13,5);ctx.fill();
  }
  ctx.strokeStyle=dark;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(18,-2);ctx.lineTo(30,1);ctx.stroke();ctx.fillStyle='#f4fbff';ctx.strokeStyle=color;ctx.lineWidth=2;duelRoundRect(ctx,25,-6,24,13,4);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.fillRect(47,-2,10,5);
}

function duelDrawMonster(ctx,time){
  ctx.lineCap='round';
  ctx.strokeStyle='#37215f';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-13,15);ctx.quadraticCurveTo(-18,29,-24,31);ctx.moveTo(0,18);ctx.lineTo(0,32);ctx.moveTo(14,15);ctx.quadraticCurveTo(18,29,24,30);ctx.stroke();
  ctx.fillStyle='#78e07a';ctx.beginPath();ctx.moveTo(-22,-24);ctx.lineTo(-29,-45);ctx.lineTo(-9,-31);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(12,-30);ctx.lineTo(28,-45);ctx.lineTo(23,-21);ctx.closePath();ctx.fill();
  const body=ctx.createLinearGradient(-25,-30,25,25);body.addColorStop(0,'#b370ff');body.addColorStop(1,'#7141b9');ctx.fillStyle=body;duelRoundRect(ctx,-28,-28,56,51,20);ctx.fill();ctx.strokeStyle='#42236e';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#d9ff9a';ctx.beginPath();ctx.arc(-10,-11,8,0,Math.PI*2);ctx.arc(11,-11,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#172137';ctx.beginPath();ctx.arc(-8,-10,3.5,0,Math.PI*2);ctx.arc(9,-10,3.5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#dfffb2';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(1,4,12,.2,Math.PI-.2);ctx.stroke();ctx.fillStyle='#f5fbff';ctx.beginPath();ctx.moveTo(-8,8);ctx.lineTo(-4,15);ctx.lineTo(0,8);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#4d287a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-24,-1);ctx.lineTo(-34,1);ctx.stroke();ctx.fillStyle='#f4fbff';ctx.strokeStyle='#8b55d4';ctx.lineWidth=2;duelRoundRect(ctx,-55,-7,27,15,5);ctx.fill();ctx.stroke();ctx.fillStyle='#8f5bdd';ctx.fillRect(-62,-3,9,7);
  ctx.fillStyle='#86ef80';ctx.beginPath();ctx.arc(19,4+Math.sin(time*5)*2,4,0,Math.PI*2);ctx.fill();
}

function duelDrawBonus(ctx,bonus,time){
  const pulse=1+Math.sin(time*5+bonus.phase)*.08;
  ctx.save();ctx.translate(bonus.x,bonus.y);ctx.scale(pulse,pulse);ctx.globalAlpha=Math.min(1,bonus.life*1.7);
  const glow=ctx.createRadialGradient(0,0,2,0,0,42);glow.addColorStop(0,bonus.type.color+'bb');glow.addColorStop(1,bonus.type.color+'00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(11,16,48,.9)';ctx.strokeStyle=bonus.type.color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(bonus.type.icon,0,1);
  ctx.font='bold 10px sans-serif';ctx.fillStyle=bonus.type.color;ctx.fillText(bonus.type.label.toUpperCase(),0,36);ctx.restore();
}

function duelDrawSatellite(ctx,point,time){
  ctx.save();ctx.translate(point.x,point.y);ctx.rotate(time*2.7);ctx.shadowColor='#c69cff';ctx.shadowBlur=16;
  ctx.fillStyle='#eff4ff';ctx.strokeStyle='#8b63cf';ctx.lineWidth=2;duelRoundRect(ctx,-8,-8,16,16,5);ctx.fill();ctx.stroke();
  ctx.fillStyle='#9bd8ff';ctx.fillRect(-20,-5,10,10);ctx.fillRect(10,-5,10,10);ctx.strokeStyle='#f4e8ff';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,-15);ctx.stroke();ctx.restore();
}

function duelDrawBullet(ctx,bullet){
  const colors={avatar:'#70f5ff',power:'#ffb85c',satellite:'#c69cff',monster:'#a86cff',laser:'#ff668a'},color=bullet.color||colors[bullet.kind]||(bullet.owner===0?'#70f5ff':'#a86cff');
  if(bullet.kind==='laser'){
    ctx.save();ctx.lineCap='round';ctx.shadowColor=color;ctx.shadowBlur=18;ctx.strokeStyle=color;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(bullet.x-105,bullet.y);ctx.lineTo(bullet.x+12,bullet.y);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bullet.x-92,bullet.y);ctx.lineTo(bullet.x+14,bullet.y);ctx.stroke();ctx.restore();return;
  }
  const glow=ctx.createRadialGradient(bullet.x,bullet.y,1,bullet.x,bullet.y,bullet.r*3);
  glow.addColorStop(0,'#fff');glow.addColorStop(.28,color);glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(bullet.x,bullet.y,bullet.r*3,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bullet.x-bullet.vx*.04,bullet.y-bullet.vy*.04);ctx.lineTo(bullet.x,bullet.y);ctx.stroke();
}

function duelRoundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}

function stopGuardianDuel(removeClass=true){
  const game=guardianDuel;
  if(game){
    cancelAnimationFrame(game.frame);
    const h=game.handlers;
    game.canvas.removeEventListener('pointerdown',h.pointerDown);
    game.canvas.removeEventListener('pointermove',h.pointerMove);
    game.canvas.removeEventListener('pointerup',h.pointerUp);
    game.canvas.removeEventListener('pointercancel',h.pointerUp);
    window.removeEventListener('keydown',h.keyDown);
    window.removeEventListener('keyup',h.keyUp);
    document.removeEventListener('visibilitychange',h.visibility);
  }
  guardianDuel=null;
  if(removeClass)document.body.classList.remove('guardian-duel-active');
}

function exitGuardianDuel(){stopGuardianDuel();home();}
