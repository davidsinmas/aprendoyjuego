let guardianDuel=null;
let guardianDuelAvatar=[];

const DUEL_W=1200;
const DUEL_H=600;
const DUEL_HALF=DUEL_W/2;
const DUEL_MAX_LIFE=100;
const DUEL_HIT_DAMAGE=20;
const DUEL_PLAYER_RADIUS=22;
const DUEL_EDGE=45;
const DUEL_BASE_FIRE=0.82;
const DUEL_MIN_FIRE=0.30;
const DUEL_PACE_SECONDS=5;
const DUEL_PACE_REDUCTION=0.10;
const DUEL_ROUNDS_TO_WIN=3;
const DUEL_INVULNERABILITY=2;

const DUEL_STARS=Array.from({length:88},(_,i)=>({
  x:(i*173+47)%DUEL_W,
  y:(i*97+31)%DUEL_H,
  r:.7+((i*11)%17)/10,
  phase:i*.57
}));

function duelFighters(){
  return[
    {x:155,y:DUEL_H/2,targetX:155,targetY:DUEL_H/2,life:DUEL_MAX_LIFE,invulnerable:DUEL_INVULNERABILITY,fireTimer:.7,flash:0},
    {x:DUEL_W-155,y:DUEL_H/2,targetX:DUEL_W-155,targetY:DUEL_H/2,life:DUEL_MAX_LIFE,invulnerable:DUEL_INVULNERABILITY,fireTimer:.7,flash:0}
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
      <p>Mueve cada guardián con un dedo dentro de su mitad y esquiva los disparos del contrario.</p>
      <div class="duel-rules">
        <div><span>☝️</span><b>Dos jugadores</b><small>Un dedo en cada mitad</small></div>
        <div><span>⚡</span><b>Disparo automático</b><small>El ritmo acelera poco a poco</small></div>
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
      <div class="duel-hud duel-hud-left"><div><b>JUGADOR 1</b><small>AZUL</small></div><div class="duel-health"><i><span id="duelLifeBar0"></span></i><b id="duelLife0">5</b></div></div>
      <div class="duel-hud duel-hud-right"><div><b>JUGADOR 2</b><small>ROSA</small></div><div class="duel-health"><i><span id="duelLifeBar1"></span></i><b id="duelLife1">5</b></div></div>
      <button id="duelPause" class="duel-pause" onclick="toggleGuardianDuelPause()" aria-label="Pausa">Ⅱ</button>
      <div id="duelPace" class="duel-pace"><small>RITMO</small><b>NORMAL</b></div>
      <canvas id="guardianDuelCanvas" width="${DUEL_W}" height="${DUEL_H}" aria-label="Arena para dos jugadores"></canvas>
      <div id="duelOverlay" class="duel-overlay"></div>
    </section>
    <footer class="duel-footer"><span>Jugador 1 · mitad izquierda</span><b>5 impactos por ronda · primero en ganar 3 rondas</b><span>Jugador 2 · mitad derecha</span></footer>
  </main>`;

  const canvas=document.getElementById('guardianDuelCanvas');
  const ctx=canvas&&canvas.getContext('2d');
  if(!canvas||!ctx){exitGuardianDuel();return;}
  guardianDuel={
    canvas,ctx,status:'countdown',scores:[0,0],fighters:duelFighters(),bullets:[],particles:[],pointers:new Map(),keys:new Set(),
    noHitTime:0,pace:0,countdown:3,countdownShown:3,last:0,frame:0,roundWinner:null,matchWinner:null,
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
  game.pointers.clear();
  game.noHitTime=0;
  game.pace=0;
  game.countdown=3;
  game.countdownShown=3;
  game.roundWinner=null;
  game.last=0;
  duelUpdateHud();
  duelOverlay(`<div class="duel-countdown"><b id="duelCountdown">3</b><span>¡PREPARADOS!</span></div>`);
}

function nextGuardianDuelRound(){duelResetRound();}

function newGuardianDuelMatch(){
  if(!guardianDuel)return;
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
    if(shown!==game.countdownShown){game.countdownShown=shown;const el=document.getElementById('duelCountdown');if(el)el.textContent=shown;}
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
  for(const owner of [0,1]){
    const fighter=game.fighters[owner];
    if(fighter.fireTimer<=0){
      duelFire(owner);
      fighter.fireTimer=Math.max(DUEL_MIN_FIRE,DUEL_BASE_FIRE-game.pace*DUEL_PACE_REDUCTION)+Math.random()*.04;
    }
  }
  for(const bullet of game.bullets){
    bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;
    const targetId=bullet.owner===0?1:0,target=game.fighters[targetId];
    if(bullet.life>0&&target.invulnerable<=0&&Math.hypot(bullet.x-target.x,bullet.y-target.y)<DUEL_PLAYER_RADIUS+bullet.r){
      bullet.life=0;
      target.life=Math.max(0,target.life-DUEL_HIT_DAMAGE);
      target.invulnerable=DUEL_INVULNERABILITY;target.flash=.22;
      target.targetX+=bullet.owner===0?20:-20;
      game.noHitTime=0;game.pace=0;
      duelParticles(target.x,target.y,bullet.owner===0?'#76f6ff':'#ff75b1',18);
      duelUpdateHud();
      if(target.life<=0){duelEndRound(bullet.owner);break;}
    }
  }
  game.bullets=game.bullets.filter(b=>b.life>0&&b.x>-50&&b.x<DUEL_W+50&&b.y>-50&&b.y<DUEL_H+50);
  for(const particle of game.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vx*=.98;particle.vy*=.98;particle.life-=dt;}
  game.particles=game.particles.filter(p=>p.life>0);
}

function duelFire(owner){
  const game=guardianDuel,shooter=game.fighters[owner],target=game.fighters[owner===0?1:0],direction=owner===0?1:-1;
  const x=shooter.x+direction*40,y=shooter.y-1,dx=target.x-x,dy=target.y+(Math.random()-.5)*38-y,length=Math.max(1,Math.hypot(dx,dy)),speed=430;
  game.bullets.push({x,y,vx:dx/length*speed,vy:dy/length*speed,owner,life:3.2,r:8});
  duelParticles(x,y,owner===0?'#75f5ff':'#ff75b1',4);
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
  const defeated=game.fighters[winner===0?1:0];
  duelParticles(defeated.x,defeated.y,winner===0?'#ff6ba8':'#6df2ff',34);
  duelUpdateHud();
  if(game.scores[winner]>=DUEL_ROUNDS_TO_WIN){
    game.status='matchOver';game.matchWinner=winner;
    D.dueloGuardianes.matches=(D.dueloGuardianes.matches||0)+1;save(D);
    duelOverlay(`<div class="duel-result duel-match-result"><span>🏆</span><small>PARTIDA TERMINADA</small><h2>¡Gana el jugador ${winner+1}!</h2><div class="duel-final-score"><b>${game.scores[0]}</b><i>—</i><b>${game.scores[1]}</b></div><button class="duel-main-button" onclick="newGuardianDuelMatch()">NUEVA PARTIDA</button><button class="duel-text-button" onclick="exitGuardianDuel()">Volver a Aprendo Jugando</button></div>`);
  }else{
    game.status='roundOver';
    duelOverlay(`<div class="duel-result"><span>⭐</span><small>RONDA TERMINADA</small><h2>¡Punto para el jugador ${winner+1}!</h2><div class="duel-final-score"><b>${game.scores[0]}</b><i>—</i><b>${game.scores[1]}</b></div><button class="duel-main-button" onclick="nextGuardianDuelRound()">SIGUIENTE RONDA</button><button class="duel-text-button" onclick="exitGuardianDuel()">Terminar partida</button></div>`);
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
  game.bullets.forEach(bullet=>duelDrawBullet(ctx,bullet));
  duelDrawFighter(ctx,game.fighters[0],0,time);
  duelDrawFighter(ctx,game.fighters[1],1,time);
  for(const particle of game.particles){ctx.globalAlpha=Math.max(0,particle.life/particle.maxLife);ctx.fillStyle=particle.color;ctx.beginPath();ctx.arc(particle.x,particle.y,particle.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
}

function duelDrawArena(ctx,time){
  const sky=ctx.createLinearGradient(0,0,0,DUEL_H);sky.addColorStop(0,'#080c28');sky.addColorStop(1,'#151a3f');ctx.fillStyle=sky;ctx.fillRect(0,0,DUEL_W,DUEL_H);
  const left=ctx.createRadialGradient(170,DUEL_H/2,10,170,DUEL_H/2,480);left.addColorStop(0,'rgba(25,210,255,.22)');left.addColorStop(1,'rgba(25,210,255,0)');ctx.fillStyle=left;ctx.fillRect(0,0,DUEL_HALF,DUEL_H);
  const right=ctx.createRadialGradient(DUEL_W-170,DUEL_H/2,10,DUEL_W-170,DUEL_H/2,480);right.addColorStop(0,'rgba(255,78,145,.22)');right.addColorStop(1,'rgba(255,78,145,0)');ctx.fillStyle=right;ctx.fillRect(DUEL_HALF,0,DUEL_HALF,DUEL_H);
  for(const star of DUEL_STARS){ctx.globalAlpha=.25+Math.sin(time*1.8+star.phase)*.18;ctx.fillStyle=star.x<DUEL_HALF?'#b8f7ff':'#ffd1e4';ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(151,189,255,.08)';ctx.lineWidth=1;
  for(let x=0;x<=DUEL_W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,DUEL_H);ctx.stroke();}
  for(let y=0;y<=DUEL_H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(DUEL_W,y);ctx.stroke();}
  ctx.strokeStyle='rgba(224,247,255,.8)';ctx.lineWidth=3;ctx.setLineDash([12,12]);ctx.lineDashOffset=-time*45;ctx.beginPath();ctx.moveTo(DUEL_HALF,0);ctx.lineTo(DUEL_HALF,DUEL_H);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(131,246,255,.08)';duelRoundRect(ctx,18,18,DUEL_HALF-36,DUEL_H-36,26);ctx.fill();ctx.fillStyle='rgba(255,105,168,.07)';duelRoundRect(ctx,DUEL_HALF+18,18,DUEL_HALF-36,DUEL_H-36,26);ctx.fill();
}

function duelDrawFighter(ctx,fighter,owner,time){
  const blue=owner===0,color=blue?'#55e9ff':'#ff5f9f',dark=blue?'#164a77':'#741d51',bob=Math.sin(time*7+owner*2)*2;
  ctx.save();ctx.translate(fighter.x,fighter.y+bob);if(!blue)ctx.scale(-1,1);if(fighter.invulnerable>0&&Math.floor(fighter.invulnerable*16)%2===0)ctx.globalAlpha=.3;
  const aura=ctx.createRadialGradient(0,0,2,0,0,50);aura.addColorStop(0,blue?'rgba(84,235,255,.38)':'rgba(255,89,157,.38)');aura.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(0,0,50,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,29,24,7,0,0,Math.PI*2);ctx.fill();
  const loaded=guardianDuelAvatar.filter(layer=>layer.image&&layer.image.complete);
  if(loaded.length){for(const layer of loaded)ctx.drawImage(layer.image,-48,-48,96,96);}else{
    ctx.strokeStyle=dark;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8,12);ctx.lineTo(-10,28);ctx.moveTo(8,12);ctx.lineTo(10,28);ctx.stroke();
    ctx.fillStyle=color;duelRoundRect(ctx,-19,-18,38,40,10);ctx.fill();ctx.fillStyle='#eefbff';ctx.beginPath();ctx.arc(0,-28,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111a3b';duelRoundRect(ctx,-13,-34,27,13,5);ctx.fill();
  }
  ctx.strokeStyle=dark;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(18,-2);ctx.lineTo(30,1);ctx.stroke();ctx.fillStyle='#f4fbff';ctx.strokeStyle=color;ctx.lineWidth=2;duelRoundRect(ctx,25,-6,24,13,4);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.fillRect(47,-2,10,5);
  if(fighter.flash>0){ctx.globalAlpha=Math.min(1,fighter.flash*4);ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,-2,37,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function duelDrawBullet(ctx,bullet){
  const blue=bullet.owner===0,color=blue?'#70f5ff':'#ff6eac',glow=ctx.createRadialGradient(bullet.x,bullet.y,1,bullet.x,bullet.y,bullet.r*3);
  glow.addColorStop(0,'#fff');glow.addColorStop(.28,color);glow.addColorStop(1,blue?'rgba(112,245,255,0)':'rgba(255,110,172,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(bullet.x,bullet.y,bullet.r*3,0,Math.PI*2);ctx.fill();
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
