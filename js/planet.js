let planetDefense=null;
let planetDefenseAvatar=[];

const PLANET_W=1200;
const PLANET_H=600;
const PLANET_HALF=PLANET_W/2;
const PLANET_EDGE=46;
const PLANET_PLAYER_RADIUS=24;
const PLANET_SHIELD_MAX=5;
const PLANET_MISSION_TIME=75;
const PLANET_WAVE_TIME=15;
const PLANET_INVULNERABILITY=2;
const PLANET_FIRE_INTERVAL=.42;

const PLANET_STARS=Array.from({length:104},(_,i)=>({
  x:(i*193+41)%PLANET_W,
  y:(i*83+27)%(PLANET_H-55),
  r:.6+((i*13)%16)/10,
  phase:i*.43
}));

function planetPlayers(){
  return[
    {x:245,y:475,targetX:245,targetY:475,invulnerable:PLANET_INVULNERABILITY,stun:0,fireTimer:.35,flash:0},
    {x:PLANET_W-245,y:475,targetX:PLANET_W-245,targetY:475,invulnerable:PLANET_INVULNERABILITY,stun:0,fireTimer:.35,flash:0}
  ];
}

function planetCanPlay(){
  return typeof planetDefenseAvailable==='function'&&planetDefenseAvailable();
}

function startPlanetDefense(){
  if(!planetCanPlay()){home();return;}
  if(typeof stopGuardianDuel==='function')stopGuardianDuel();
  stopPlanetDefense();
  document.body.classList.add('planet-defense-active');
  const best=D?.defensaPlaneta?.bestScore||0,missions=D?.defensaPlaneta?.missions||0;
  A.innerHTML=`<main class="guardian-duel-menu planet-defense-menu">
    <section class="guardian-duel-menu-card planet-menu-card">
      <button class="duel-close" onclick="exitPlanetDefense()" aria-label="Volver">×</button>
      <span class="duel-kicker">MISIÓN COOPERATIVA PARA DOS</span>
      <h1>Defensa del planeta</h1>
      <p>Moved cada guardián con un dedo y destruid juntos los meteoritos antes de que atraviesen el escudo.</p>
      <div class="duel-rules">
        <div><span>☝️☝️</span><b>Dos jugadores</b><small>Un guardián en cada mitad</small></div>
        <div><span>🌠</span><b>Disparo automático</b><small>Apunta al peligro más cercano</small></div>
        <div><span>🛡️</span><b>75 segundos</b><small>5 impactos de escudo</small></div>
      </div>
      <div class="planet-menu-record"><span>Misiones superadas <b>${missions}</b></span><span>Mejor puntuación <b>${best}</b></span></div>
      <button class="duel-main-button planet-main-button" onclick="beginPlanetDefenseMission()">EMPEZAR MISIÓN</button>
      <small class="duel-landscape-hint">↻ Coloca el móvil en horizontal</small>
    </section>
  </main>`;
  planetLoadAvatar();
}

function planetLoadAvatar(){
  planetDefenseAvatar=[];
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
    planetDefenseAvatar.push(source);
  });
}

function beginPlanetDefenseMission(){
  if(!planetCanPlay()){exitPlanetDefense();return;}
  stopPlanetDefense(false);
  document.body.classList.add('planet-defense-active');
  A.innerHTML=`<main class="planet-defense-shell">
    <header class="planet-topbar">
      <button class="duel-back-button" onclick="exitPlanetDefense()">← SALIR</button>
      <div class="planet-brand"><small>APRENDO JUGANDO</small><b>Defensa del planeta</b></div>
      <div class="planet-timer"><small>TIEMPO</small><b id="planetTime">1:15</b></div>
    </header>
    <section class="planet-arena">
      <div class="planet-shield"><small>ESCUDO DEL PLANETA</small><div><i><span id="planetShieldBar"></span></i><b id="planetShield">5</b></div></div>
      <div id="planetWave" class="planet-wave"><small>OLEADA</small><b>1 / 5</b></div>
      <div class="planet-score"><small>PUNTOS</small><b id="planetScore">0</b></div>
      <button id="planetPause" class="duel-pause planet-pause" onclick="togglePlanetDefensePause()" aria-label="Pausa">Ⅱ</button>
      <canvas id="planetDefenseCanvas" width="${PLANET_W}" height="${PLANET_H}" aria-label="Defensa cooperativa del planeta para dos jugadores"></canvas>
      <div id="planetOverlay" class="duel-overlay planet-overlay"></div>
    </section>
    <footer class="duel-footer planet-footer"><span>Jugador 1 · mitad izquierda</span><b>Proteged juntos el escudo</b><span>Jugador 2 · mitad derecha</span></footer>
  </main>`;

  const canvas=document.getElementById('planetDefenseCanvas');
  const ctx=canvas&&canvas.getContext('2d');
  if(!canvas||!ctx){exitPlanetDefense();return;}
  planetDefense={canvas,ctx,status:'countdown',players:planetPlayers(),meteors:[],bullets:[],particles:[],pointers:new Map(),keys:new Set(),handlers:{},shield:PLANET_SHIELD_MAX,shieldInvulnerable:0,timeLeft:PLANET_MISSION_TIME,elapsed:0,wave:1,score:0,destroyed:0,spawnTimer:.45,countdown:3,countdownShown:3,last:0,frame:0,displaySecond:PLANET_MISSION_TIME,impactFlash:0};
  planetBindControls();
  planetResetMission();
  planetDefense.frame=requestAnimationFrame(planetLoop);
}

function planetResetMission(){
  const game=planetDefense;
  if(!game)return;
  game.status='countdown';game.players=planetPlayers();game.meteors=[];game.bullets=[];game.particles=[];game.pointers.clear();game.shield=PLANET_SHIELD_MAX;game.shieldInvulnerable=0;game.timeLeft=PLANET_MISSION_TIME;game.elapsed=0;game.wave=1;game.score=0;game.destroyed=0;game.spawnTimer=.45;game.countdown=3;game.countdownShown=3;game.last=0;game.displaySecond=PLANET_MISSION_TIME;game.impactFlash=0;
  planetUpdateHud();
  planetOverlay(`<div class="duel-countdown planet-countdown"><b id="planetCountdown">3</b><span>¡PROTEGED EL PLANETA!</span></div>`);
}

function newPlanetDefenseMission(){planetResetMission();}

function planetBindControls(){
  const game=planetDefense,canvas=game?.canvas;
  if(!game||!canvas)return;
  game.handlers.pointerDown=event=>{
    if(!planetDefense||!['countdown','playing'].includes(game.status))return;
    event.preventDefault();
    const point=planetPointerPosition(event),owner=point.x<PLANET_HALF?0:1;
    game.pointers.set(event.pointerId,owner);
    try{canvas.setPointerCapture(event.pointerId);}catch(e){}
    planetSetTarget(owner,point.x,point.y);
  };
  game.handlers.pointerMove=event=>{
    const owner=game.pointers.get(event.pointerId);
    if(owner===undefined)return;
    event.preventDefault();
    const point=planetPointerPosition(event);
    planetSetTarget(owner,point.x,point.y);
  };
  game.handlers.pointerUp=event=>game.pointers.delete(event.pointerId);
  game.handlers.keyDown=event=>{
    const key=event.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key))event.preventDefault();
    if(key==='escape'){togglePlanetDefensePause();return;}
    game.keys.add(key);
  };
  game.handlers.keyUp=event=>game.keys.delete(event.key.toLowerCase());
  game.handlers.visibility=()=>{if(document.hidden&&planetDefense&&planetDefense.status==='playing')togglePlanetDefensePause();};
  canvas.addEventListener('pointerdown',game.handlers.pointerDown,{passive:false});
  canvas.addEventListener('pointermove',game.handlers.pointerMove,{passive:false});
  canvas.addEventListener('pointerup',game.handlers.pointerUp);
  canvas.addEventListener('pointercancel',game.handlers.pointerUp);
  window.addEventListener('keydown',game.handlers.keyDown,{passive:false});
  window.addEventListener('keyup',game.handlers.keyUp);
  document.addEventListener('visibilitychange',game.handlers.visibility);
}

function planetPointerPosition(event){
  const rect=planetDefense.canvas.getBoundingClientRect();
  return{x:(event.clientX-rect.left)/rect.width*PLANET_W,y:(event.clientY-rect.top)/rect.height*PLANET_H};
}

function planetSetTarget(owner,x,y){
  if(!planetDefense)return;
  const player=planetDefense.players[owner];
  player.targetX=owner===0?Math.max(PLANET_EDGE,Math.min(PLANET_HALF-PLANET_EDGE,x)):Math.max(PLANET_HALF+PLANET_EDGE,Math.min(PLANET_W-PLANET_EDGE,x));
  player.targetY=Math.max(255,Math.min(PLANET_H-78,y));
}

function togglePlanetDefensePause(){
  const game=planetDefense;
  if(!game)return;
  const pause=document.getElementById('planetPause');
  if(game.status==='playing'){
    game.status='paused';if(pause)pause.textContent='▶';
    planetOverlay(`<div class="duel-result planet-result"><span>⏸</span><h2>Pausa</h2><button class="duel-main-button planet-main-button" onclick="togglePlanetDefensePause()">CONTINUAR</button><button class="duel-text-button" onclick="exitPlanetDefense()">Terminar misión</button></div>`);
  }else if(game.status==='paused'){
    game.status='playing';game.last=0;if(pause)pause.textContent='Ⅱ';planetOverlay('');
  }
}

function planetOverlay(content){
  const overlay=document.getElementById('planetOverlay');
  if(!overlay)return;
  overlay.innerHTML=content;overlay.classList.toggle('visible',!!content);
}

function planetLoop(now){
  const game=planetDefense;
  if(!game)return;
  const time=now/1000;
  let dt=game.last?Math.min((now-game.last)/1000,.035):0;
  game.last=now;
  if(game.status==='countdown'){
    game.countdown-=dt;
    const shown=Math.max(1,Math.ceil(game.countdown));
    if(shown!==game.countdownShown){game.countdownShown=shown;const el=document.getElementById('planetCountdown');if(el)el.textContent=shown;}
    if(game.countdown<=0){game.status='playing';planetOverlay('');}
    dt=0;
  }else if(game.status!=='playing')dt=0;
  if(dt>0)planetUpdate(dt);
  planetDraw(time);
  game.frame=requestAnimationFrame(planetLoop);
}

function planetUpdate(dt){
  const game=planetDefense;
  game.elapsed+=dt;game.timeLeft=Math.max(0,game.timeLeft-dt);game.shieldInvulnerable=Math.max(0,game.shieldInvulnerable-dt);game.impactFlash=Math.max(0,game.impactFlash-dt);
  const wave=Math.min(5,Math.floor(game.elapsed/PLANET_WAVE_TIME)+1);
  if(wave!==game.wave){game.wave=wave;planetUpdateHud();planetWaveMessage();}
  const second=Math.ceil(game.timeLeft);
  if(second!==game.displaySecond){game.displaySecond=second;planetUpdateHud();}
  if(game.timeLeft<=0){planetEndMission(true);return;}

  const speed=320,p1=game.players[0],p2=game.players[1],keys=game.keys;
  if(keys.has('a'))p1.targetX-=speed*dt;if(keys.has('d'))p1.targetX+=speed*dt;if(keys.has('w'))p1.targetY-=speed*dt;if(keys.has('s'))p1.targetY+=speed*dt;
  if(keys.has('arrowleft'))p2.targetX-=speed*dt;if(keys.has('arrowright'))p2.targetX+=speed*dt;if(keys.has('arrowup'))p2.targetY-=speed*dt;if(keys.has('arrowdown'))p2.targetY+=speed*dt;
  planetSetTarget(0,p1.targetX,p1.targetY);planetSetTarget(1,p2.targetX,p2.targetY);
  for(const player of game.players){
    const smoothing=Math.min(1,dt*15);player.x+=(player.targetX-player.x)*smoothing;player.y+=(player.targetY-player.y)*smoothing;player.invulnerable=Math.max(0,player.invulnerable-dt);player.stun=Math.max(0,player.stun-dt);player.flash=Math.max(0,player.flash-dt);player.fireTimer-=dt;
  }
  for(const owner of [0,1]){
    const player=game.players[owner];
    if(player.fireTimer<=0&&player.stun<=0){planetFire(owner);player.fireTimer=PLANET_FIRE_INTERVAL+Math.random()*.06;}
  }

  game.spawnTimer-=dt;
  if(game.spawnTimer<=0){planetSpawnMeteor();const base=Math.max(.38,.92-game.wave*.105);game.spawnTimer=base+Math.random()*.18;}

  for(const bullet of game.bullets){
    bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;
    if(bullet.life<=0)continue;
    for(const meteor of game.meteors){
      if(meteor.dead||Math.hypot(bullet.x-meteor.x,bullet.y-meteor.y)>=meteor.r+bullet.r)continue;
      bullet.life=0;meteor.hp--;planetParticles(bullet.x,bullet.y,'#9df8ff',5);
      if(meteor.hp<=0){meteor.dead=true;game.destroyed++;game.score+=10+meteor.maxHp*8;planetParticles(meteor.x,meteor.y,meteor.color,18+meteor.maxHp*5);planetUpdateHud();}
      break;
    }
  }
  game.bullets=game.bullets.filter(b=>b.life>0&&b.y>-40&&b.x>-40&&b.x<PLANET_W+40);

  for(const meteor of game.meteors){
    if(meteor.dead)continue;
    meteor.x+=meteor.vx*dt;meteor.y+=meteor.vy*dt;meteor.rotation+=meteor.spin*dt;
    if(meteor.x<meteor.r||meteor.x>PLANET_W-meteor.r){meteor.vx*=-1;meteor.x=Math.max(meteor.r,Math.min(PLANET_W-meteor.r,meteor.x));}
    for(const player of game.players){
      if(meteor.dead||player.invulnerable>0)continue;
      if(Math.hypot(meteor.x-player.x,meteor.y-player.y)<meteor.r+PLANET_PLAYER_RADIUS){meteor.dead=true;player.invulnerable=PLANET_INVULNERABILITY;player.stun=.8;player.flash=.28;planetParticles(player.x,player.y,'#fff3a0',24);planetTakeShieldHit();}
    }
    if(!meteor.dead&&meteor.y+meteor.r>=552){meteor.dead=true;planetParticles(meteor.x,548,meteor.color,26);planetTakeShieldHit();}
  }
  game.meteors=game.meteors.filter(m=>!m.dead&&m.y<PLANET_H+70);
  for(const particle of game.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vx*=.985;particle.vy*=.985;particle.life-=dt;}
  game.particles=game.particles.filter(p=>p.life>0);
}

function planetSpawnMeteor(){
  const game=planetDefense,wave=game.wave,roll=Math.random();
  const maxHp=roll<.62?1:roll<.9?2:3,r=maxHp===1?14+Math.random()*5:maxHp===2?21+Math.random()*5:28+Math.random()*5;
  const x=55+Math.random()*(PLANET_W-110),speed=105+wave*18+Math.random()*38;
  const colors=maxHp===1?['#8e7a70','#a58b75']:maxHp===2?['#9e684d','#b37a52']:['#6f607d','#8b658e'];
  game.meteors.push({x,y:-r-4,vx:(Math.random()-.5)*(28+wave*5),vy:speed,r,hp:maxHp,maxHp,rotation:Math.random()*Math.PI*2,spin:(Math.random()-.5)*2.3,color:colors[Math.floor(Math.random()*colors.length)],points:Array.from({length:10},(_,i)=>.82+((i*7+maxHp*3)%9)/30)});
}

function planetFire(owner){
  const game=planetDefense,player=game.players[owner];
  const alive=game.meteors.filter(m=>!m.dead);
  let target=null,best=Infinity;
  for(const meteor of alive){
    const ownHalf=owner===0?meteor.x<PLANET_HALF:meteor.x>=PLANET_HALF;
    const value=(PLANET_H-meteor.y)*1.25+Math.abs(meteor.x-player.x)+(ownHalf?0:150);
    if(value<best){best=value;target=meteor;}
  }
  const x=player.x,y=player.y-40,tx=target?target.x:x,ty=target?target.y:-40,dx=tx-x,dy=ty-y,length=Math.max(1,Math.hypot(dx,dy)),speed=650;
  game.bullets.push({x,y,vx:dx/length*speed,vy:dy/length*speed,owner,life:1.8,r:6});
  planetParticles(x,y,owner===0?'#6ff5ff':'#ffe56c',3);
}

function planetTakeShieldHit(){
  const game=planetDefense;
  if(!game||game.status!=='playing'||game.shieldInvulnerable>0)return;
  game.shield=Math.max(0,game.shield-1);game.shieldInvulnerable=.65;game.impactFlash=.32;planetUpdateHud();
  if(game.shield<=0)planetEndMission(false);
}

function planetParticles(x,y,color,amount){
  const game=planetDefense;if(!game)return;
  for(let i=0;i<amount;i++){const angle=i/amount*Math.PI*2+Math.random()*.5,speed=55+Math.random()*230,life=.32+Math.random()*.55;game.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life,maxLife:life,color,r:1.5+Math.random()*4});}
}

function planetWaveMessage(){
  const wave=document.getElementById('planetWave');
  if(!wave)return;
  wave.classList.remove('wave-pop');void wave.offsetWidth;wave.classList.add('wave-pop');
}

function planetUpdateHud(){
  const game=planetDefense;if(!game)return;
  const shield=document.getElementById('planetShield'),bar=document.getElementById('planetShieldBar'),time=document.getElementById('planetTime'),score=document.getElementById('planetScore'),wave=document.getElementById('planetWave');
  if(shield)shield.textContent=game.shield;if(bar)bar.style.width=`${game.shield/PLANET_SHIELD_MAX*100}%`;
  if(time){const seconds=Math.ceil(game.timeLeft),minutes=Math.floor(seconds/60);time.textContent=`${minutes}:${String(seconds%60).padStart(2,'0')}`;}
  if(score)score.textContent=game.score;
  if(wave){const label=wave.querySelector('b');if(label)label.textContent=`${game.wave} / 5`;}
}

function planetEndMission(won){
  const game=planetDefense;
  if(!game||!['playing','countdown'].includes(game.status))return;
  game.status=won?'missionWon':'missionLost';
  D.defensaPlaneta=D.defensaPlaneta&&typeof D.defensaPlaneta==='object'?D.defensaPlaneta:{unlocked:true,unlockedBy:'daily',missions:0,bestScore:0};
  if(won)D.defensaPlaneta.missions=(D.defensaPlaneta.missions||0)+1;
  D.defensaPlaneta.bestScore=Math.max(D.defensaPlaneta.bestScore||0,game.score);save(D);
  if(won){
    planetOverlay(`<div class="duel-result planet-result planet-win"><span>🌍✨</span><small>MISIÓN SUPERADA</small><h2>¡Planeta a salvo!</h2><div class="planet-final-stats"><b>${game.score}<small>PUNTOS</small></b><b>${game.destroyed}<small>METEORITOS</small></b><b>${game.shield}<small>ESCUDO</small></b></div><button class="duel-main-button planet-main-button" onclick="newPlanetDefenseMission()">NUEVA MISIÓN</button><button class="duel-text-button" onclick="exitPlanetDefense()">Volver a Aprendo Jugando</button></div>`);
  }else{
    planetOverlay(`<div class="duel-result planet-result planet-loss"><span>🛡️</span><small>MISIÓN TERMINADA</small><h2>¡Volved a intentarlo!</h2><p>Habéis conseguido ${game.score} puntos y destruido ${game.destroyed} meteoritos.</p><button class="duel-main-button planet-main-button" onclick="newPlanetDefenseMission()">REPETIR MISIÓN</button><button class="duel-text-button" onclick="exitPlanetDefense()">Volver a Aprendo Jugando</button></div>`);
  }
}

function planetDraw(time){
  const game=planetDefense,ctx=game.ctx;
  planetDrawArena(ctx,time);
  game.meteors.forEach(meteor=>planetDrawMeteor(ctx,meteor));
  game.bullets.forEach(bullet=>planetDrawBullet(ctx,bullet));
  planetDrawPlayer(ctx,game.players[0],0,time);planetDrawPlayer(ctx,game.players[1],1,time);
  for(const particle of game.particles){ctx.globalAlpha=Math.max(0,particle.life/particle.maxLife);ctx.fillStyle=particle.color;ctx.beginPath();ctx.arc(particle.x,particle.y,particle.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  if(game.impactFlash>0){ctx.fillStyle=`rgba(255,74,74,${game.impactFlash*.48})`;ctx.fillRect(0,0,PLANET_W,PLANET_H);}
}

function planetDrawArena(ctx,time){
  const sky=ctx.createLinearGradient(0,0,0,PLANET_H);sky.addColorStop(0,'#050820');sky.addColorStop(.62,'#102653');sky.addColorStop(1,'#244f72');ctx.fillStyle=sky;ctx.fillRect(0,0,PLANET_W,PLANET_H);
  const glow=ctx.createRadialGradient(PLANET_W/2,PLANET_H+160,20,PLANET_W/2,PLANET_H+110,620);glow.addColorStop(0,'rgba(81,232,200,.28)');glow.addColorStop(1,'rgba(27,118,179,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,PLANET_W,PLANET_H);
  for(const star of PLANET_STARS){ctx.globalAlpha=.28+Math.sin(time*1.7+star.phase)*.2;ctx.fillStyle='#d9fbff';ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(152,213,255,.075)';ctx.lineWidth=1;for(let x=0;x<=PLANET_W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,550);ctx.stroke();}
  ctx.strokeStyle='rgba(213,249,255,.38)';ctx.lineWidth=2;ctx.setLineDash([10,14]);ctx.lineDashOffset=-time*25;ctx.beginPath();ctx.moveTo(PLANET_HALF,72);ctx.lineTo(PLANET_HALF,540);ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(0,554);ctx.quadraticCurveTo(PLANET_W/2,500,PLANET_W,554);ctx.lineTo(PLANET_W,PLANET_H);ctx.lineTo(0,PLANET_H);ctx.closePath();const ground=ctx.createLinearGradient(0,515,0,PLANET_H);ground.addColorStop(0,'#2c9b83');ground.addColorStop(1,'#0e4052');ctx.fillStyle=ground;ctx.fill();
  ctx.strokeStyle='rgba(150,255,220,.82)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,554);ctx.quadraticCurveTo(PLANET_W/2,500,PLANET_W,554);ctx.stroke();
  for(let i=0;i<9;i++){const x=90+i*128,y=548-Math.sin(i*.8)*9;ctx.fillStyle='rgba(195,255,238,.35)';ctx.beginPath();ctx.arc(x,y,12+(i%3)*4,Math.PI,0);ctx.fill();}
}

function planetDrawPlayer(ctx,player,owner,time){
  const blue=owner===0,color=blue?'#5beeff':'#ffe269',dark=blue?'#174c75':'#735619',bob=Math.sin(time*7+owner*2)*2;
  ctx.save();ctx.translate(player.x,player.y+bob);if(player.invulnerable>0&&Math.floor(player.invulnerable*16)%2===0)ctx.globalAlpha=.28;
  const aura=ctx.createRadialGradient(0,0,3,0,0,48);aura.addColorStop(0,blue?'rgba(83,237,255,.36)':'rgba(255,225,91,.34)');aura.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(0,0,48,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,30,24,7,0,0,Math.PI*2);ctx.fill();
  const loaded=planetDefenseAvatar.filter(layer=>layer.image&&layer.image.complete);
  if(loaded.length){for(const layer of loaded)ctx.drawImage(layer.image,-46,-46,92,92);}else{ctx.strokeStyle=dark;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8,12);ctx.lineTo(-10,28);ctx.moveTo(8,12);ctx.lineTo(10,28);ctx.stroke();ctx.fillStyle=color;planetRoundRect(ctx,-19,-18,38,40,10);ctx.fill();ctx.fillStyle='#eefbff';ctx.beginPath();ctx.arc(0,-28,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111a3b';planetRoundRect(ctx,-13,-34,27,13,5);ctx.fill();}
  ctx.strokeStyle=dark;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,-27);ctx.stroke();ctx.fillStyle='#f5fbff';ctx.strokeStyle=color;ctx.lineWidth=2;planetRoundRect(ctx,-7,-42,14,25,4);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.fillRect(-3,-49,6,10);
  if(player.stun>0){ctx.fillStyle='#fff5a8';ctx.font='bold 18px sans-serif';ctx.textAlign='center';ctx.fillText('✦',-22,-39);ctx.fillText('✦',22,-33);}
  if(player.flash>0){ctx.globalAlpha=Math.min(1,player.flash*4);ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,-2,36,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function planetDrawMeteor(ctx,meteor){
  ctx.save();ctx.translate(meteor.x,meteor.y);ctx.rotate(meteor.rotation);ctx.beginPath();meteor.points.forEach((factor,i)=>{const angle=i/meteor.points.length*Math.PI*2,r=meteor.r*factor,x=Math.cos(angle)*r,y=Math.sin(angle)*r;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.closePath();const rock=ctx.createRadialGradient(-meteor.r*.32,-meteor.r*.35,2,0,0,meteor.r*1.2);rock.addColorStop(0,'#d0a17c');rock.addColorStop(.34,meteor.color);rock.addColorStop(1,'#302b39');ctx.fillStyle=rock;ctx.fill();ctx.strokeStyle='rgba(255,203,142,.42)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(31,26,35,.42)';ctx.beginPath();ctx.arc(-meteor.r*.25,-meteor.r*.12,meteor.r*.17,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(meteor.r*.25,meteor.r*.2,meteor.r*.12,0,Math.PI*2);ctx.fill();ctx.restore();
  if(meteor.maxHp>1){ctx.strokeStyle='rgba(255,255,255,.32)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(meteor.x,meteor.y,meteor.r+6,-Math.PI/2,-Math.PI/2+Math.PI*2*(meteor.hp/meteor.maxHp));ctx.stroke();}
}

function planetDrawBullet(ctx,bullet){
  const color=bullet.owner===0?'#74f5ff':'#ffe76f',glow=ctx.createRadialGradient(bullet.x,bullet.y,1,bullet.x,bullet.y,bullet.r*3);glow.addColorStop(0,'#fff');glow.addColorStop(.3,color);glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(bullet.x,bullet.y,bullet.r*3,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bullet.x-bullet.vx*.025,bullet.y-bullet.vy*.025);ctx.lineTo(bullet.x,bullet.y);ctx.stroke();
}

function planetRoundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}

function stopPlanetDefense(removeClass=true){
  const game=planetDefense;
  if(game){cancelAnimationFrame(game.frame);const h=game.handlers;game.canvas.removeEventListener('pointerdown',h.pointerDown);game.canvas.removeEventListener('pointermove',h.pointerMove);game.canvas.removeEventListener('pointerup',h.pointerUp);game.canvas.removeEventListener('pointercancel',h.pointerUp);window.removeEventListener('keydown',h.keyDown);window.removeEventListener('keyup',h.keyUp);document.removeEventListener('visibilitychange',h.visibility);}
  planetDefense=null;if(removeClass)document.body.classList.remove('planet-defense-active');
}

function exitPlanetDefense(){stopPlanetDefense();home();}
