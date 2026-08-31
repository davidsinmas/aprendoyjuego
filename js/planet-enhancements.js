/* V3.8.5 — Defensa planetaria: ritmo más táctico, armas especiales y enemigos de fuego */
(function(){
  if(typeof planetDefense==='undefined') return;

  const BASE_APPLY_BONUS=window.planetApplyBonus;
  const BASE_DRAW_BONUS=window.planetDrawBonus;
  const BASE_DRAW_METEOR=window.planetDrawMeteor;
  const BASE_PLANET_DRAW=window.planetDraw;
  const BASE_BEGIN=window.beginPlanetDefenseMission;
  const BASE_RESET=window.planetResetMission;
  const BASE_UPDATE=window.planetUpdate;

  function initSpecialState(game){
    if(!game)return;
    game.enemyBullets=[];game.enemyShotTimer=3.2;game.extraShots=0;game.bombCharges=0;
  }

  window.beginPlanetDefenseMission=function(){BASE_BEGIN();if(planetDefense)initSpecialState(planetDefense);};
  window.planetResetMission=function(){BASE_RESET();if(planetDefense){initSpecialState(planetDefense);planetUpdateBonusHud();}};

  window.planetSpawnMeteor=function(){
    const game=planetDefense;if(!game)return;
    const wave=game.wave,difficulty=Math.min(PLANET_MAX_DIFFICULTY,game.missionLevel);
    const shooterChance=Math.min(.18,.055+wave*.018+Math.max(0,difficulty-2)*.012);
    if(Math.random()<shooterChance){
      const r=20+Math.random()*4,hp=2+(wave>=4?1:0);
      game.meteors.push({kind:'shooter',x:65+Math.random()*(PLANET_W-130),y:-r-8,vx:(Math.random()-.5)*(18+wave*3),vy:72+wave*7+(difficulty-1)*2+Math.random()*14,r,hp,maxHp:hp,rotation:0,spin:(Math.random()-.5)*1.4,color:'#6d78b5',points:[1,1,1,1,1,1,1,1]});
      return;
    }
    const roll=Math.random(),maxHp=roll<.58?1:roll<.90?2:3+(wave>=4?1:0),r=maxHp===1?14+Math.random()*5:maxHp===2?21+Math.random()*5:27+Math.random()*6;
    const x=55+Math.random()*(PLANET_W-110),speed=76+wave*10+(difficulty-1)*2.5+Math.random()*22;
    const colors=maxHp===1?['#8e7a70','#a58b75']:maxHp===2?['#9e684d','#b37a52']:['#6f607d','#8b658e'];
    game.meteors.push({x,y:-r-4,vx:(Math.random()-.5)*(22+wave*3),vy:speed,r,hp:maxHp,maxHp,rotation:Math.random()*Math.PI*2,spin:(Math.random()-.5)*1.8,color:colors[Math.floor(Math.random()*colors.length)],points:Array.from({length:10},(_,i)=>.82+((i*7+maxHp*3)%9)/30)});
  };

  window.planetSpawnBonus=function(){
    const game=planetDefense;if(!game)return;
    let type;
    if(game.shield<=2&&Math.random()<.34)type='shield';
    else{const roll=Math.random();if(roll<.34)type='rapid';else if(roll<.62)type='double';else if(roll<.82)type='bomb';else type='slow';}
    if(type==='shield'&&game.shield>=PLANET_SHIELD_MAX)type='rapid';
    const owner=game.bonusIndex++%2,x=owner===0?110+Math.random()*(PLANET_HALF-220):PLANET_HALF+110+Math.random()*(PLANET_HALF-220);
    game.bonuses.push({x,y:-26,vy:62+Math.random()*12,r:23,type,phase:0,dead:false});
  };

  window.planetApplyBonus=function(type,x,y){
    const game=planetDefense;if(!game)return;
    if(type==='double'){game.extraShots=Math.min(2,(game.extraShots||0)+1);game.score+=8;}
    else if(type==='bomb'){game.bombCharges=(game.bombCharges||0)+1;game.score+=8;}
    else{BASE_APPLY_BONUS(type,x,y);return;}
    planetParticles(x,y,type==='bomb'?'#ff7d66':'#d69cff',34);window.GameSound?.play('correct');planetUpdateHud();planetUpdateBonusHud();
  };

  window.planetFire=function(owner){
    const game=planetDefense,player=game.players[owner];if(!game||!player)return;
    const alive=game.meteors.filter(m=>!m.dead);let target=null,best=Infinity;
    for(const meteor of alive){const ownHalf=owner===0?meteor.x<PLANET_HALF:meteor.x>=PLANET_HALF,value=(PLANET_H-meteor.y)*1.25+Math.abs(meteor.x-player.x)+(ownHalf?0:150);if(value<best){best=value;target=meteor;}}
    const shots=1+(game.extraShots||0),spread=shots===1?[0]:shots===2?[-.055,.055]:[-.085,0,.085];
    for(const angleOffset of spread){const x=player.x,y=player.y-40,tx=target?target.x:x,ty=target?target.y:-40,dx=tx-x,dy=ty-y,length=Math.max(1,Math.hypot(dx,dy)),speed=600,baseAngle=Math.atan2(dy,dx)+angleOffset;game.bullets.push({x,y,vx:Math.cos(baseAngle)*speed,vy:Math.sin(baseAngle)*speed,owner,life:2,r:6});}
    planetParticles(player.x,player.y-40,owner===0?'#74f5ff':'#ffe76f',3+shots);window.GameSound?.play('shoot',owner===0?'avatar':'satellite');
  };

  window.planetUseBomb=function(){
    const game=planetDefense;if(!game||game.status!=='playing'||(game.bombCharges||0)<=0)return false;
    game.bombCharges--;let cleared=0;
    for(const meteor of game.meteors){if(meteor.dead)continue;meteor.dead=true;cleared++;planetParticles(meteor.x,meteor.y,meteor.kind==='shooter'?'#9bb4ff':meteor.color,12);}
    game.enemyBullets=[];game.destroyed+=cleared;game.score+=cleared*10+25;game.impactFlash=.22;planetParticles(PLANET_W/2,PLANET_H/2,'#ffffff',70);window.GameSound?.play('correct');planetUpdateHud();planetUpdateBonusHud();return true;
  };

  const originalBind=window.planetBindControls;
  window.planetBindControls=function(){
    originalBind();const game=planetDefense;if(!game)return;const oldKeyDown=game.handlers.keyDown;
    game.handlers.keyDown=event=>{const key=event.key.toLowerCase();if(key==='b'){event.preventDefault();planetUseBomb();return;}oldKeyDown(event);};
    window.removeEventListener('keydown',oldKeyDown);window.addEventListener('keydown',game.handlers.keyDown,{passive:false});
  };

  function updateEnemyFire(dt){
    const game=planetDefense;if(!game||game.status!=='playing')return;
    game.enemyShotTimer-=dt;const shooters=game.meteors.filter(m=>!m.dead&&m.kind==='shooter');
    if(game.enemyShotTimer<=0&&shooters.length){
      const shooter=shooters[Math.floor(Math.random()*shooters.length)],owner=Math.random()<.5?0:1,target=game.players[owner],dx=target.x-shooter.x,dy=target.y-shooter.y,len=Math.max(1,Math.hypot(dx,dy)),speed=180+game.wave*7;
      game.enemyBullets.push({x:shooter.x,y:shooter.y+shooter.r*.65,vx:dx/len*speed,vy:dy/len*speed,life:5,r:7,owner});
      game.enemyShotTimer=3.4-Math.min(1,game.wave*.12)+Math.random()*1.1;
    }
    for(const bullet of game.enemyBullets){
      bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;if(bullet.life<=0)continue;
      const player=game.players[bullet.owner];if(player.invulnerable<=0&&Math.hypot(bullet.x-player.x,bullet.y-player.y)<bullet.r+PLANET_PLAYER_RADIUS){bullet.life=0;player.invulnerable=PLANET_INVULNERABILITY;player.stun=.5;player.flash=.28;planetParticles(player.x,player.y,'#ff9c86',22);planetTakeShieldHit();}
    }
    game.enemyBullets=game.enemyBullets.filter(b=>b.life>0&&b.y>-40&&b.y<PLANET_H+40&&b.x>-40&&b.x<PLANET_W+40);
  }

  window.planetUpdate=function(dt){BASE_UPDATE(dt);if(planetDefense)updateEnemyFire(dt);};

  window.planetDrawMeteor=function(ctx,meteor){
    if(meteor.kind!=='shooter')return BASE_DRAW_METEOR(ctx,meteor);
    ctx.save();ctx.translate(meteor.x,meteor.y);ctx.rotate(meteor.rotation);ctx.shadowBlur=18;ctx.shadowColor='#7895ff';ctx.fillStyle='#202d58';ctx.strokeStyle='#9eb3ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-meteor.r);ctx.lineTo(meteor.r*.9,meteor.r*.45);ctx.lineTo(0,meteor.r);ctx.lineTo(-meteor.r*.9,meteor.r*.45);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ff7b66';ctx.beginPath();ctx.arc(0,0,6+Math.sin(performance.now()/130)*1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a9c2ff';ctx.fillRect(-meteor.r-5,-3,9,6);ctx.fillRect(meteor.r-4,-3,9,6);ctx.shadowBlur=0;ctx.restore();
    if(meteor.maxHp>1){ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(meteor.x,meteor.y,meteor.r+6,-Math.PI/2,-Math.PI/2+Math.PI*2*(meteor.hp/meteor.maxHp));ctx.stroke();}
  };

  window.planetDrawBonus=function(ctx,bonus,time){
    if(!['double','bomb'].includes(bonus.type))return BASE_DRAW_BONUS(ctx,bonus,time);
    const meta=bonus.type==='double'?{icon:'✚',label:'MULTI',color:'#d69cff'}:{icon:'💥',label:'BOMBA',color:'#ff806d'},pulse=1+Math.sin(time*7+bonus.phase)*.08;
    ctx.save();ctx.translate(bonus.x,bonus.y);ctx.scale(pulse,pulse);ctx.shadowBlur=22;ctx.shadowColor=meta.color;ctx.fillStyle='rgba(16,18,50,.94)';ctx.strokeStyle=meta.color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,bonus.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=meta.color;ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(meta.icon,0,-1);ctx.fillStyle='#f5ffff';ctx.font='900 8px sans-serif';ctx.fillText(meta.label,0,bonus.r+13);ctx.restore();
  };

  window.planetDraw=function(time){
    const game=planetDefense;BASE_PLANET_DRAW(time);if(!game)return;const ctx=game.ctx;
    for(const bullet of game.enemyBullets||[]){const glow=ctx.createRadialGradient(bullet.x,bullet.y,1,bullet.x,bullet.y,bullet.r*3);glow.addColorStop(0,'#fff');glow.addColorStop(.28,'#ff8f76');glow.addColorStop(1,'rgba(255,100,80,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(bullet.x,bullet.y,bullet.r*3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff806d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bullet.x-bullet.vx*.025,bullet.y-bullet.vy*.025);ctx.lineTo(bullet.x,bullet.y);ctx.stroke();}
    if((game.extraShots||0)>0||(game.bombCharges||0)>0){ctx.save();ctx.font='900 14px sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(8,18,45,.78)';ctx.beginPath();ctx.roundRect(PLANET_W/2-112,16,224,34,17);ctx.fill();ctx.fillStyle='#f5ffff';ctx.fillText(`MULTI: ${1+(game.extraShots||0)}  ·  💥: ${game.bombCharges||0}`,PLANET_W/2,38);ctx.restore();}
  };

  window.planetUpdateBonusHud=function(){
    const game=planetDefense,status=document.getElementById('planetBonusStatus');if(!game||!status)return;const effects=[];
    if(game.rapidTime>0)effects.push(`⚡ DISPARO RÁPIDO ${Math.ceil(game.rapidTime)}s`);if(game.slowTime>0)effects.push(`❄️ TIEMPO LENTO ${Math.ceil(game.slowTime)}s`);if((game.extraShots||0)>0)effects.push(`✚ MULTI x${1+game.extraShots}`);if((game.bombCharges||0)>0)effects.push(`💥 BOMBA x${game.bombCharges}`);
    status.textContent=effects.join(' · ')||'✨ RECOGED LOS BONUS';status.classList.toggle('active',effects.length>0);
  };
})();
