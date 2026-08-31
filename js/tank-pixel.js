/* Tank Pixel — módulo independiente para Aprendo Jugando */
(() => {
  const STYLE_ID='tank-pixel-style';
  const CARD_CLASS='tank-pixel-home-card';
  let originalHome=null;

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const link=document.createElement('link');
    link.id=STYLE_ID; link.rel='stylesheet';
    link.href='css/tank-pixel.css?v='+(window.APP_VERSION||Date.now());
    document.head.appendChild(link);
  }

  function addHomeCard(){
    const grid=document.querySelector('.action-game-grid');
    if(!grid || grid.querySelector('.'+CARD_CLASS)) return;
    const b=document.createElement('button');
    b.className='guardian-home-card planet-home-card '+CARD_CLASS+' unlocked';
    b.type='button';
    b.innerHTML='<span class="guardian-home-icon">🛡️</span><span><b>Tank Pixel</b><small>Tanques, rebotes y obstáculos destructibles</small></span><strong>JUGAR →</strong>';
    b.onclick=()=>window.openTankPixel();
    grid.appendChild(b);
  }

  function hookHome(){
    injectStyle();
    if(typeof window.home!=='function') return;
    if(!window.home.__tankPixelHooked){
      originalHome=window.home;
      const wrapped=function(){
        const result=originalHome.apply(this,arguments);
        requestAnimationFrame(addHomeCard);
        return result;
      };
      wrapped.__tankPixelHooked=true;
      window.home=wrapped;
    }
    // app.js llama a home() antes de cargar este módulo; por eso hay que
    // insertar también la tarjeta inmediatamente en la pantalla ya renderizada.
    requestAnimationFrame(addHomeCard);
  }

  function openTankPixel(){
    injectStyle();
    const A=document.getElementById('app');
    if(!A) return;
    A.innerHTML='<div class="tank-screen"><div class="tank-shell"><div class="tank-head"><button class="tank-back" type="button">← Volver</button><div><b>Tank Pixel</b><small>Destruye las coberturas</small></div><span class="tank-score">💥 0</span></div><div class="tank-stage-wrap"><canvas id="tankCanvas" class="tank-canvas" width="960" height="600"></canvas><div class="tank-help">Mover: ◀ ▶ · Disparar: 🔥 · En móvil usa los controles</div><div class="tank-controls"><button data-key="left">◀</button><button data-action="fire">🔥</button><button data-key="right">▶</button></div></div></div></div>';
    A.querySelector('.tank-back').onclick=()=>window.home();
    startTank();
  }
  window.openTankPixel=openTankPixel;

  function startTank(){
    const canvas=document.getElementById('tankCanvas'); if(!canvas) return;
    const ctx=canvas.getContext('2d'); ctx.imageSmoothingEnabled=false;
    const W=canvas.width,H=canvas.height;
    const keys={left:false,right:false};
    const player={x:W/2,y:H-72,w:58,h:42,speed:330,cool:0};
    const enemy={x:W/2,y:58,w:58,h:42,cool:1.3,alive:true};
    const bullets=[],sparks=[];
    const obstacles=[
      {x:95,y:125,w:135,h:42,hp:5,max:5},{x:330,y:175,w:105,h:52,hp:4,max:4},{x:545,y:110,w:155,h:42,hp:6,max:6},{x:760,y:205,w:105,h:54,hp:4,max:4},
      {x:160,y:310,w:155,h:48,hp:6,max:6},{x:410,y:345,w:120,h:58,hp:5,max:5},{x:640,y:305,w:170,h:48,hp:6,max:6},
      {x:55,y:445,w:120,h:44,hp:4,max:4},{x:275,y:475,w:150,h:42,hp:5,max:5},{x:555,y:455,w:135,h:48,hp:5,max:5},{x:785,y:420,w:120,h:44,hp:4,max:4}
    ];
    let score=0,running=true,last=performance.now(),enemyHit=0;
    function rectHitCircle(r,c){const nx=Math.max(r.x,Math.min(c.x,r.x+r.w)),ny=Math.max(r.y,Math.min(c.y,r.y+r.h));return (c.x-nx)**2+(c.y-ny)**2<=c.r*c.r;}
    function tankHitCircle(t,c){return rectHitCircle({x:t.x-t.w/2,y:t.y-t.h/2,w:t.w,h:t.h},c);}
    function spawnSpark(x,y,n=5){for(let i=0;i<n;i++)sparks.push({x,y,vx:(Math.random()-.5)*180,vy:(Math.random()-.5)*180,life:.35});}
    function fire(fromPlayer=true){const t=fromPlayer?player:enemy,dir=fromPlayer?-1:1;bullets.push({x:t.x,y:t.y+dir*22,r:7,vx:0,vy:dir*430,owner:fromPlayer?'p':'e'});}
    function damageObstacle(o,b){o.hp--;spawnSpark(b.x,b.y,8);score+=10;if(o.hp<=0){o.dead=true;score+=30;spawnSpark(o.x+o.w/2,o.y+o.h/2,20);}b.dead=true;}
    function reset(){bullets.length=0;sparks.length=0;obstacles.forEach(o=>{o.dead=false;o.hp=o.max});enemy.alive=true;enemyHit=0;score=0;player.x=W/2;running=true;}
    function updateBullet(b,dt){
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      if(b.x-b.r<=0){b.x=b.r;b.vx=Math.abs(b.vx);}
      if(b.x+b.r>=W){b.x=W-b.r;b.vx=-Math.abs(b.vx);}
      if(b.y-b.r<=0){b.y=b.r;b.vy=Math.abs(b.vy);}
      if(b.y-b.r>H){b.dead=true;return;}
      for(const o of obstacles)if(!o.dead&&rectHitCircle(o,b)){damageObstacle(o,b);return;}
      if(b.owner==='p'&&enemy.alive&&tankHitCircle(enemy,b)){b.dead=true;enemyHit++;score+=50;spawnSpark(b.x,b.y,14);if(enemyHit>=8){enemy.alive=false;score+=300;running=false;}}
      if(b.owner==='e'&&tankHitCircle(player,b)){b.dead=true;score=Math.max(0,score-25);spawnSpark(b.x,b.y,10);player.x=W/2;}
    }
    function drawPixelTank(t,playerTank=true){ctx.save();ctx.translate(Math.round(t.x),Math.round(t.y));ctx.fillStyle=playerTank?'#36d67b':'#ef5b67';ctx.fillRect(-t.w/2,-t.h/2,t.w,t.h);ctx.fillStyle='#18212b';ctx.fillRect(-t.w/2-7,-t.h/2+4,8,12);ctx.fillRect(t.w/2-1,-t.h/2+4,8,12);ctx.fillRect(-t.w/2-7,t.h/2-16,8,12);ctx.fillRect(t.w/2-1,t.h/2-16,8,12);ctx.fillStyle=playerTank?'#7affad':'#ff9b9b';ctx.fillRect(-18,-14,36,28);ctx.fillStyle='#202b38';ctx.fillRect(-5,-27,10,32);ctx.fillRect(-5,-32,10,8);ctx.fillStyle='#c8f7ff';ctx.fillRect(-2,-25,4,8);ctx.restore();}
    function drawObstacle(o){const ratio=o.hp/o.max;ctx.fillStyle='#3b4652';ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle='#687482';ctx.fillRect(o.x+4,o.y+4,o.w-8,o.h-8);ctx.fillStyle='#8997a5';for(let x=o.x+8;x<o.x+o.w-8;x+=18)ctx.fillRect(x,o.y+8,10,5);ctx.fillStyle='#222b34';ctx.fillRect(o.x,o.y+o.h-6,o.w,6);ctx.fillStyle='#f6c84c';ctx.fillRect(o.x,o.y-5,o.w*ratio,3);}
    function draw(){ctx.fillStyle='#0c1320';ctx.fillRect(0,0,W,H);ctx.fillStyle='#111d2b';for(let x=0;x<W;x+=32)for(let y=0;y<H;y+=32)if((x/32+y/32)%2===0)ctx.fillRect(x,y,1,1);ctx.strokeStyle='#26384a';ctx.lineWidth=4;ctx.strokeRect(2,2,W-4,H-4);obstacles.forEach(o=>{if(!o.dead)drawObstacle(o);});if(enemy.alive)drawPixelTank(enemy,false);drawPixelTank(player,true);for(const b of bullets){ctx.fillStyle=b.owner==='p'?'#ffe16b':'#ff7070';ctx.fillRect(Math.round(b.x-b.r),Math.round(b.y-b.r),b.r*2,b.r*2);ctx.fillStyle='#fff7c2';ctx.fillRect(Math.round(b.x-2),Math.round(b.y-2),4,4);}for(const s of sparks){ctx.fillStyle='#ffd65c';ctx.fillRect(s.x-2,s.y-2,4,4);}const scoreEl=document.querySelector('.tank-score');if(scoreEl)scoreEl.textContent='💥 '+score;if(!running){ctx.fillStyle='rgba(6,10,16,.82)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 42px monospace';ctx.fillText(enemy.alive?'¡Fin de la partida!':'¡Tanque enemigo destruido!',W/2,H/2-20);ctx.font='bold 24px monospace';ctx.fillText('Puntuación: '+score,W/2,H/2+28);}}
    function loop(now){if(!document.getElementById('tankCanvas'))return;const dt=Math.min(.033,(now-last)/1000);last=now;if(running){if(keys.left)player.x-=player.speed*dt;if(keys.right)player.x+=player.speed*dt;player.x=Math.max(38,Math.min(W-38,player.x));player.cool-=dt;if(player.cool<=0){fire(true);player.cool=.72;}enemy.cool-=dt;if(enemy.alive&&enemy.cool<=0){fire(false);enemy.cool=1.9;}bullets.forEach(b=>updateBullet(b,dt));for(let i=bullets.length-1;i>=0;i--)if(bullets[i].dead)bullets.splice(i,1);for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(s.life<=0)sparks.splice(i,1);}}draw();requestAnimationFrame(loop);}
    function bindHold(btn,key){const on=()=>keys[key]=true,off=()=>keys[key]=false;btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointercancel',off);btn.addEventListener('pointerleave',off);}
    bindHold(document.querySelector('[data-key="left"]'),'left');bindHold(document.querySelector('[data-key="right"]'),'right');document.querySelector('[data-action="fire"]').addEventListener('click',()=>{if(running&&player.cool<=0){fire(true);player.cool=.12;}});
    const keydown=e=>{if(e.key==='ArrowLeft')keys.left=true;if(e.key==='ArrowRight')keys.right=true;if(e.code==='Space'&&running){e.preventDefault();if(player.cool<=0){fire(true);player.cool=.12;}}};const keyup=e=>{if(e.key==='ArrowLeft')keys.left=false;if(e.key==='ArrowRight')keys.right=false};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
    const back=document.querySelector('.tank-back'),restart=document.createElement('button');restart.className='tank-restart';restart.textContent='🔄';restart.title='Repetir';restart.onclick=()=>{reset();last=performance.now();};back.parentElement.appendChild(restart);requestAnimationFrame(loop);
  }
  injectStyle();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hookHome,{once:true});else hookHome();
})();
