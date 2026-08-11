let D=load(),parentMode=false,state={type:null,level:null,mode:null,qs:[],i:0,hits:0,correct:null,locked:false,grid:null,path:[],target:[],daily:false,total:GAME.total};
const A=document.getElementById('app');
const mix=a=>[...a].sort(()=>Math.random()-.5);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const READING_TYPES=new Set(['sonidoInicial','sonidoFinal','construir','ordenarSilabas','rimas']);
const stats=id=>D.estadisticas[id]||{partidas:0,aciertos:0,respuestas:0};
const today=()=>new Date().toLocaleDateString('sv-SE');
function ensureDaily(){if(D.retosDiarios.fecha!==today())D.retosDiarios={fecha:today(),sumas:false,restas:false,sopa:false,premio:false};save(D);}
function xpNeeded(level){return 260+(level-1)*85;}
function xpPanel(){const need=xpNeeded(D.nivelJugador),pct=Math.min(100,Math.round(D.xp/need*100));return `<div class="xp-card"><div class="xp-head"><b>Nivel ${D.nivelJugador}</b><span>${D.xp} / ${need} XP</span></div><div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div><div class="next-gift">Siguiente nivel: +25 💎</div></div>`;}
const ACHIEVEMENTS=[
  {id:'first_game',icon:'🎮',name:'Primera partida',desc:'Termina una actividad',test:()=>totalGames()>=1,reward:5},
  {id:'ten_correct',icon:'⭐',name:'Buen comienzo',desc:'Consigue 10 respuestas correctas',test:()=>D.totalAciertos>=10,reward:8},
  {id:'fifty_correct',icon:'🏅',name:'Aprendiz constante',desc:'Consigue 50 respuestas correctas',test:()=>D.totalAciertos>=50,reward:15},
  {id:'daily_complete',icon:'☀️',name:'Día completo',desc:'Completa los tres retos diarios',test:()=>D.retosDiarios.premio,reward:10},
  {id:'level_3',icon:'🚀',name:'Nivel 3',desc:'Alcanza el nivel 3',test:()=>D.nivelJugador>=3,reward:12}
];
let pendingAchievements=[],pendingLevelRewards=[];
function totalGames(){return Object.values(D.estadisticas||{}).reduce((n,s)=>n+(s.partidas||0),0);}
function checkAchievements(){for(const a of ACHIEVEMENTS){if(!D.logros.includes(a.id)&&a.test()){D.logros.push(a.id);D.diamantes+=a.reward;pendingAchievements.push(a);}}save(D);}
function showPendingAchievement(){if(!pendingAchievements.length)return false;const a=pendingAchievements.shift();layout(`<div class="levelup"><div class="levelup-stars">✨ 🏆 ✨</div><h2>¡Nuevo logro!</h2><div class="achievement-big">${a.icon}</div><h3>${a.name}</h3><p>${a.desc}</p><div class="daily-prize">+${a.reward} 💎</div><button class="btn primary" onclick="home()">Continuar</button></div>`);return true;}
function achievements(){checkAchievements();layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div><h2>Logros</h2><div class="achievement-list">${ACHIEVEMENTS.map(a=>{const ok=D.logros.includes(a.id);return `<div class="achievement-card ${ok?'unlocked':'locked'}"><div class="achievement-icon">${ok?a.icon:'🔒'}</div><div><b>${a.name}</b><div class="muted">${a.desc}</div><div class="achievement-reward">${ok?'Conseguido':'Premio: '+a.reward+' 💎'}</div></div></div>`;}).join('')}</div>`);}
function progressSummary(){const games=totalGames();return `<div class="progress-summary"><div><b>${D.totalAciertos}</b><span>Aciertos</span></div><div><b>${games}</b><span>Partidas</span></div><div><b>${D.logros.length}/${ACHIEVEMENTS.length}</b><span>Logros</span></div></div>`;}
function giveXP(amount){D.xp+=amount;while(D.xp>=xpNeeded(D.nivelJugador)){D.xp-=xpNeeded(D.nivelJugador);D.nivelJugador++;D.diamantes+=25;pendingLevelRewards.push('25 diamantes');}save(D);}
function showPendingLevel(){if(!pendingLevelRewards.length)return false;const rewards=[...pendingLevelRewards];pendingLevelRewards=[];layout(`<div class="levelup"><div class="levelup-stars">✨ 🎉 ✨</div><h2>¡Has subido al nivel ${D.nivelJugador}!</h2><div class="gift-box">🎁</div><p>Has conseguido:</p><h3>${rewards.join('<br>')}</h3><button class="btn primary" onclick="home()">Continuar</button></div>`);return true;}
function dailyHTML(){ensureDaily();const r=D.retosDiarios,done=[r.sumas,r.restas,r.sopa].filter(Boolean).length;const row=(type,ok,label,time)=>`<button class="daily-row ${ok?'done locked':''}" ${ok?'disabled aria-disabled="true"':`onclick="startDaily('${type}')"`}><span>${ok?'🔒 ✅':'⬜'} ${label}</span><small>${ok?'Completado':time}</small></button>`;return `<div class="daily-card"><div class="daily-title"><b>🎯 Retos de hoy</b><span>${done}/3</span></div>${row('suma',r.sumas,'5 sumas','2 min')}${row('resta',r.restas,'5 restas','2 min')}${row('sopa',r.sopa,'1 sopa de letras','2 min')}<div class="daily-prize">${r.premio?'🎁 Premio diario conseguido · vuelve mañana':'🎁 Completa los 3: +10 💎 y +10 XP'}</div></div>`;}
function dailyDifficulty(){const step=Math.min(5,Math.floor((D.retosCompletadosTotal||0)/9));return{mathMax:10+step*2,soupLevel:step<2?GAME.levels.sopa[0]:step<4?GAME.levels.sopa[2]:GAME.levels.sopa[4]};}
function startDaily(type){ensureDaily();const r=D.retosDiarios;if((type==='suma'&&r.sumas)||(type==='resta'&&r.restas)||(type==='sopa'&&r.sopa))return;const dif=dailyDifficulty();if(type==='suma')startMath('suma',{...GAME.levels.suma[0],max:dif.mathMax,desc:`Resultado hasta ${dif.mathMax}`},true);else if(type==='resta')startMath('resta',{...GAME.levels.resta[0],max:dif.mathMax,desc:`Hasta ${dif.mathMax}, sin negativos`},true);else startSoup(dif.soupLevel,true);}
function markDaily(type){ensureDaily();let added=false;if(type==='suma'&&!D.retosDiarios.sumas){D.retosDiarios.sumas=true;added=true;}if(type==='resta'&&!D.retosDiarios.restas){D.retosDiarios.restas=true;added=true;}if(type==='sopa'&&!D.retosDiarios.sopa){D.retosDiarios.sopa=true;added=true;}if(added)D.retosCompletadosTotal=(D.retosCompletadosTotal||0)+1;if(D.retosDiarios.sumas&&D.retosDiarios.restas&&D.retosDiarios.sopa&&!D.retosDiarios.premio){D.retosDiarios.premio=true;D.diamantes+=10;giveXP(10);}save(D);}
function diamond(flash=false){return `<div id="diamond" class="diamond ${flash?'flash':''}">💎 <span>${D.diamantes}</span></div>`;}
function layout(content){A.innerHTML=`<div class="wrap"><div class="card">${content}</div></div>`;}
let audioCtx=null;
function playChime(kind='ok'){try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.setValueAtTime(kind==='ok'?660:220,now);osc.frequency.exponentialRampToValueAtTime(kind==='ok'?880:180,now+.11);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+.14);osc.connect(gain).connect(audioCtx.destination);osc.start(now);osc.stop(now+.15);}catch(e){}}
function home(){ensureDaily();checkAchievements();if(showPendingLevel())return;if(showPendingAchievement())return;layout(`
<div class="home-head"><div class="brand"><div class="brand-mark">AJ</div><div><h1>Aprendo jugando</h1><div class="muted">V${window.APP_VERSION||'actual'} · ${parentMode?'🔓 Modo Padres activo':'progresión educativa'}</div></div></div>${diamond()}</div>
${xpPanel()}
<div class="progress-actions"><button class="btn secondary progress-action" onclick="avatarScreen()">👤 Mi avatar</button><button class="btn secondary progress-action" onclick="achievements()">🏆 Logros</button></div>
<div class="dashboard-grid"><div class="dashboard-main">${dailyHTML()}</div><div class="dashboard-side">${progressSummary()}</div></div>
<h3 class="section-title">Juegos</h3>
<div class="game-grid">
<button class="game-card game-sum" onclick="levels('suma')"><span class="game-icon">＋</span><b>Sumas</b><small>10 niveles · 10 ejercicios</small></button>
<button class="game-card game-sub" onclick="levels('resta')"><span class="game-icon">−</span><b>Restas</b><small>10 niveles · 10 ejercicios</small></button>
<button class="game-card game-compare" onclick="levels('comparar')"><span class="game-icon">↕</span><b>Mayor o menor</b><small>10 niveles · 10 comparaciones</small></button>
<button class="game-card game-letters" onclick="levels('palabras')"><span class="game-icon">Aa</span><b>Palabras</b><small>10 niveles · 10 ejercicios</small></button>
<button class="game-card game-soup" onclick="levels('sopa')"><span class="game-icon">▦</span><b>Sopa de letras</b><small>10 niveles progresivos</small></button>
</div>
<h3 class="section-title">Aprender a leer</h3>
<div class="game-grid reading-grid">
<button class="game-card game-sound-start" onclick="levels('sonidoInicial')"><span class="game-icon">🔊</span><b>Sonido inicial</b><small>Escucha · elige la primera letra</small></button>
<button class="game-card game-sound-end" onclick="levels('sonidoFinal')"><span class="game-icon">👂</span><b>Sonido final</b><small>Escucha · elige la última letra</small></button>
<button class="game-card game-build-word" onclick="levels('construir')"><span class="game-icon">🧩</span><b>Construye la palabra</b><small>Une sílabas con ayuda de audio</small></button>
<button class="game-card game-order-syllables" onclick="levels('ordenarSilabas')"><span class="game-icon">🔀</span><b>Ordena sílabas</b><small>Coloca las sílabas en orden</small></button>
<button class="game-card game-rhyme" onclick="levels('rimas')"><span class="game-icon">🎵</span><b>Busca la rima</b><small>Escucha y encuentra cuál rima</small></button>
</div>
<div class="bottom-actions">${parentMode?'<button class="btn danger" onclick="disableParentMode()">🔒 Quitar modo Padres</button>':''}<button class="btn secondary" onclick="parents()">⚙️ Zona de padres</button></div>`);}
let selectedShopItemId=null,shopFeedback='',avatarChecksPromise=null,shopTierFilter='common';
function avatarCatalog(tier=null){return (AVATAR.items||[]).filter(item=>!item.technical&&(!tier||item.rarity===tier));}
function avatarItemPrice(item){return AvatarSystem.priceFor(D,item);}
function tierLabel(item){return `Nivel ${item.level||AVATAR.rarities?.[item.rarity]?.level||1}`;}
function avatarCollectionStats(){
  const items=avatarCatalog(),avatar=AvatarSystem.ensureState(D),owned=items.filter(item=>avatar.owned.includes(item.id)).length;
  return{owned,total:items.length,equipped:AvatarSystem.equippedItems(D).length};
}
function collectionProgress(){
  const stats=avatarCollectionStats(),pct=stats.total?Math.round(stats.owned/stats.total*100):0;
  return `<div class="collection-progress"><div class="collection-progress-head"><div><span class="eyebrow">Colección</span><b>Guardián Nova</b></div><strong>${stats.owned}/${stats.total}</strong></div><div class="collection-track" aria-label="${stats.owned} de ${stats.total} objetos conseguidos"><span style="width:${pct}%"></span></div><small>${stats.owned===stats.total?'¡Conjunto completo!':stats.total-stats.owned+' piezas por conseguir'}</small></div>`;
}
function renderAvatarStage(containerId,{statusId=null,previewItemId=null}={}){
  requestAnimationFrame(async()=>{
    const container=document.getElementById(containerId),status=statusId?document.getElementById(statusId):null;
    if(!container||!window.AvatarSystem){if(status)status.textContent='No se pudo iniciar el avatar.';return;}
    let assetError=false;
    AvatarSystem.render(container,D,{previewItemId,onAssetError:()=>{assetError=true;if(status)status.textContent='⚠️ Falta un recurso del equipamiento.';}});
    if(!status)return;
    const checks=await(avatarChecksPromise||(avatarChecksPromise=AvatarSystem.validateAssets({includeBase:true})));
    const invalid=checks.filter(check=>!check.ok);
    const ok=!assetError&&!invalid.length;
    status.textContent=ok?(previewItemId?'Vista previa · toca el botón para equipar':'✓ Avatar listo'):'⚠️ No se pudo cargar todo el equipamiento';
    status.classList.toggle('avatar-status-ok',ok);
    status.classList.toggle('avatar-status-error',!ok);
  });
}
function avatarScreen(){
  const stats=avatarCollectionStats();
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div>
  <div class="avatar-hub">
    <div class="avatar-preview-card avatar-preview-card-hero"><div class="space-orbit" aria-hidden="true"></div><div id="avatarPreview" class="avatar-preview" aria-label="Avatar del jugador"></div><div id="avatarAssetStatus" class="avatar-status muted">Cargando avatar…</div></div>
    <div class="avatar-hub-content"><span class="eyebrow">Centro de equipamiento</span><h2>Mi héroe</h2><p class="muted">Consigue piezas, prueba cómo quedan y crea tu propio guardián espacial.</p>${collectionProgress()}<div class="avatar-stats"><div><strong>${stats.owned}</strong><span>En el inventario</span></div><div><strong>${stats.equipped}</strong><span>Equipadas</span></div></div><div class="avatar-menu-grid"><button class="btn primary avatar-menu-btn" onclick="openShopScreen()">Explorar tienda</button><button class="btn secondary avatar-menu-btn" onclick="inventoryScreen()">Abrir inventario</button></div></div>
  </div>`);
  renderAvatarStage('avatarPreview',{statusId:'avatarAssetStatus'});
}
function rarityLabel(item){return AVATAR.rarities?.[item.rarity]?.label||item.rarity||'Objeto';}
function shopVisual(item){const src=item.shopImage?`${item.shopImage}${item.shopImage.includes('?')?'&':'?'}v=${encodeURIComponent(window.APP_VERSION||'')}`:'';return src?`<img src="${escapeHTML(src)}" alt="${escapeHTML(item.name)}">`:(item.shopIcon||'🎁');}
function shopItemCard(item,selected){
  const avatar=AvatarSystem.ensureState(D),owned=avatar.owned.includes(item.id),equipped=avatar.equipped[item.slot]===item.id;
  const state=equipped?'Equipado':owned?'En tu inventario':`${avatarItemPrice(item)} 💎`;
  return `<button type="button" class="shop-card rarity-border-${item.rarity} ${selected?'selected':''} ${owned?'owned':''}" onclick="selectShopItem('${item.id}')" aria-pressed="${selected}"><span class="shop-icon">${shopVisual(item)}</span><span class="shop-info"><span class="shop-title"><b>${escapeHTML(item.name)}</b><span class="rarity rarity-${item.rarity}">${escapeHTML(rarityLabel(item))}</span></span><span class="shop-slot">${escapeHTML(AVATAR.slots[item.slot]?.label||item.slot)} · ${tierLabel(item)}</span><span class="shop-card-state">${state}</span></span></button>`;
}
function shopDetail(item){
  const avatar=AvatarSystem.ensureState(D),owned=avatar.owned.includes(item.id),equipped=avatar.equipped[item.slot]===item.id,price=avatarItemPrice(item),missing=Math.max(0,price-D.diamantes);
  let action='';
  if(equipped)action=`<button class="btn secondary shop-main-action" onclick="unequipAvatarFromShop('${item.slot}')">✓ Equipado · Quitar</button>`;
  else if(owned)action=`<button class="btn primary shop-main-action" onclick="equipAvatarFromShop('${item.id}')">Equipar ahora</button>`;
  else if(!missing)action=`<button class="btn primary shop-main-action" onclick="buyAndEquipAvatarItem('${item.id}')">Comprar y equipar · ${price} 💎</button>`;
  else action=`<button class="btn secondary shop-main-action" disabled>Te faltan ${missing} 💎</button>`;
  return `<div class="shop-detail"><div class="shop-detail-title"><div><span class="eyebrow">${escapeHTML(AVATAR.slots[item.slot]?.label||item.slot)}</span><h2>${escapeHTML(item.name)}</h2></div><span class="rarity rarity-${item.rarity}">${escapeHTML(rarityLabel(item))}</span></div><p>${escapeHTML(item.description||'')}</p>${action}${!owned?'<small>Al comprarla se equipará automáticamente.</small>':'<small>La pieza seguirá guardada en tu inventario.</small>'}</div>`;
}
function openShopScreen(){shopFeedback='';shopScreen();}
function setShopTierFilter(tier){if(!AVATAR.rarities?.[tier])return;shopTierFilter=tier;selectedShopItemId=null;shopFeedback='';shopScreen();}
function shopTierTabs(){return `<div class="shop-tier-tabs" aria-label="Nivel de equipamiento">${Object.entries(AVATAR.rarities).map(([id,tier])=>`<button type="button" class="shop-tier-tab ${shopTierFilter===id?'active':''}" onclick="setShopTierFilter('${id}')" aria-pressed="${shopTierFilter===id}"><span>Nivel ${tier.level}</span><b>${escapeHTML(tier.label)}</b></button>`).join('')}</div>`;}
function shopScreen(){
  const items=avatarCatalog(shopTierFilter).sort((a,b)=>avatarItemPrice(a)-avatarItemPrice(b));
  if(!items.some(item=>item.id===selectedShopItemId))selectedShopItemId=items[0]?.id||null;
  const selected=AvatarSystem.getItem(selectedShopItemId);
  layout(`<div class="top"><button class="btn secondary back" onclick="avatarScreen()">← Avatar</button>${diamond()}</div><div class="shop-head"><div><span class="eyebrow">Colección Guardián Nova</span><h2>Tienda estelar</h2><p class="muted">Elige un nivel y prueba cada pieza antes de comprar.</p></div>${collectionProgress()}</div>${shopTierTabs()}${shopFeedback?`<div class="shop-feedback" role="status">${escapeHTML(shopFeedback)}</div>`:''}${selected?`<div class="shop-layout"><section class="shop-showcase"><div class="avatar-preview-card shop-preview-card"><div class="preview-label">VISTA PREVIA · ${tierLabel(selected).toUpperCase()}</div><div class="space-orbit" aria-hidden="true"></div><div id="shopAvatarPreview" class="avatar-preview" aria-label="Vista previa de ${escapeHTML(selected.name)}"></div><div id="shopAssetStatus" class="avatar-status muted">Preparando vista previa…</div></div>${shopDetail(selected)}</section><section><h3 class="catalog-title">Piezas de ${escapeHTML(rarityLabel(selected).toLowerCase())}</h3><div class="shop-list">${items.map(item=>shopItemCard(item,item.id===selected.id)).join('')}</div></section></div>`:'<div class="empty-state">Todavía no hay objetos disponibles.</div>'}`);
  if(selected)renderAvatarStage('shopAvatarPreview',{statusId:'shopAssetStatus',previewItemId:selected.id});
}
function selectShopItem(id){selectedShopItemId=id;shopFeedback='';shopScreen();}
function buyAndEquipAvatarItem(id){
  const result=AvatarSystem.buy(D,id);
  if(result.ok){AvatarSystem.equip(D,id);save(D);shopFeedback=`¡${result.item.name} ya está en tu inventario y equipado!`;playChime('ok');shopScreen();return;}
  if(result.reason==='owned'){equipAvatarFromShop(id);return;}
  if(result.reason==='diamonds')alert('Necesitas más diamantes para comprar este objeto.');
}
function equipAvatarFromShop(id){try{const item=AvatarSystem.equip(D,id);save(D);shopFeedback=`${item.name} equipado.`;playChime('ok');shopScreen();}catch(error){alert(error.message);}}
function unequipAvatarFromShop(slot){try{AvatarSystem.unequip(D,slot);save(D);shopFeedback='Pieza guardada en el inventario.';shopScreen();}catch(error){alert(error.message);}}
function inventoryItemCard(item){
  const equipped=AvatarSystem.ensureState(D).equipped[item.slot]===item.id;
  return `<article class="inventory-card rarity-border-${item.rarity} ${equipped?'equipped':''}"><div class="shop-icon">${shopVisual(item)}</div><div class="shop-info"><div class="shop-title"><b>${escapeHTML(item.name)}</b><span class="rarity rarity-${item.rarity}">${escapeHTML(rarityLabel(item))}</span></div><div class="muted">${escapeHTML(AVATAR.slots[item.slot]?.label||item.slot)} · ${tierLabel(item)}</div></div><div class="inventory-action">${equipped?`<button class="btn secondary" onclick="unequipAvatarSlot('${item.slot}')">Quitar</button>`:`<button class="btn primary" onclick="equipAvatarItem('${item.id}')">Equipar</button>`}</div></article>`;
}
function inventoryScreen(){
  const avatar=AvatarSystem.ensureState(D),items=avatar.owned.map(id=>AvatarSystem.getItem(id)).filter(Boolean).sort((a,b)=>(a.level||0)-(b.level||0)||a.slot.localeCompare(b.slot));
  layout(`<div class="top"><button class="btn secondary back" onclick="avatarScreen()">← Avatar</button>${diamond()}</div><div class="inventory-head"><div><span class="eyebrow">Tu equipamiento</span><h2>Inventario</h2><p class="muted">Combina las piezas que has conseguido. Solo puede haber una de cada categoría.</p></div><button class="btn primary" onclick="openShopScreen()">Ir a la tienda</button></div><div class="inventory-layout"><div class="avatar-preview-card inventory-preview-card"><div class="space-orbit" aria-hidden="true"></div><div id="inventoryAvatarPreview" class="avatar-preview" aria-label="Equipamiento actual del avatar"></div><div id="inventoryAssetStatus" class="avatar-status muted">Cargando equipamiento…</div>${collectionProgress()}</div><div>${items.length?`<div class="inventory-list">${items.map(inventoryItemCard).join('')}</div>`:'<div class="empty-state"><div class="empty-state-icon">🛰️</div><b>Tu inventario está esperando su primera pieza</b><p class="muted">Juega para ganar diamantes y visita la tienda estelar.</p><button class="btn primary" onclick="openShopScreen()">Ver colección</button></div>'}</div></div>`);
  renderAvatarStage('inventoryAvatarPreview',{statusId:'inventoryAssetStatus'});
}
function equipAvatarItem(id){try{AvatarSystem.equip(D,id);save(D);playChime('ok');inventoryScreen();}catch(error){alert(error.message);}}
function unequipAvatarSlot(slot){try{AvatarSystem.unequip(D,slot);save(D);inventoryScreen();}catch(error){alert(error.message);}}
function levelDone(n){return stats(n.id).partidas>0;}
function levelUnlocked(t,index){return parentMode||index===0||levelDone(GAME.levels[t][index-1]);}
function levelDiamonds(n,repeat=false){return repeat?n.level:n.level+4;}
function levels(t){
  state.type=t;
  const titles={suma:'Niveles de sumas',resta:'Niveles de restas',comparar:'Mayor o menor',palabras:'Niveles de palabras',sopa:'Sopa de letras',sonidoInicial:'¿Con qué sonido empieza?',sonidoFinal:'¿Con qué sonido termina?',construir:'Construye la palabra',ordenarSilabas:'Ordena las sílabas',rimas:'Busca la rima'};
  const title=titles[t]||'Niveles';
  const rows=GAME.levels[t].map((n,index)=>{
    const s=stats(n.id),done=s.partidas>0,unlocked=levelUnlocked(t,index),p=s.respuestas?Math.round(s.aciertos/s.respuestas*100):0,reward=levelDiamonds(n,done);
    const activity=t==='sopa'?`${n.count} palabras · 1 tablero`:t==='comparar'?'10 comparaciones':'10 ejercicios';
    let action='';
    if(unlocked){
      if(t==='suma'||t==='resta')action=`<button class="small play" onclick='startMath(${JSON.stringify(t)},${JSON.stringify(n)})'>${done?'Repetir':'Jugar'}</button>`;
      else if(t==='comparar')action=`<button class="small play" onclick='startCompare(${JSON.stringify(n)})'>${done?'Repetir':'Jugar'}</button>`;
      else if(t==='palabras')action=`<button class="small play" onclick='startWords(${JSON.stringify(n)})'>${done?'Repetir':'Jugar'}</button>`;
      else if(READING_TYPES.has(t))action=`<button class="small play" onclick='startReadingGame(${JSON.stringify(t)},${JSON.stringify(n)})'>${done?'Repetir':'Jugar'}</button>`;
      else action=`<button class="small play" onclick='startSoup(${JSON.stringify(n)})'>${done?'Repetir':'Jugar'}</button>`;
    }else action='<button class="small locked-button" disabled>Bloqueado</button>';
    return `<div class="row level-row ${done?'level-done':''} ${unlocked?'':'level-locked'}"><div class="level-main"><div class="level-title"><b>${done?'✅ ':unlocked?'':'🔒 '}${n.name}</b>${done?'<span class="done-badge">HECHO</span>':''}</div><div class="muted">${n.desc}</div><div class="level-meta"><span>${activity}</span><span>💎 ${reward} ${done?'al repetir':'primera vez'}</span>${done?`<span>Aciertos: ${p}%</span>`:''}</div></div><div class="actions">${action}</div></div>`;
  }).join('');
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div><h2>${title}</h2><p class="muted level-help">${parentMode?'🔓 Modo Padres: todos los niveles disponibles para pruebas.':'Completa un nivel una vez para desbloquear el siguiente. Puedes repetir cualquier nivel desbloqueado.'}</p><div class="levels">${rows}</div>`);
}
function resetLevel(id){if(confirm('¿Borrar estadísticas?')){delete D.estadisticas[id];save(D);levels(state.type);}}
function startMath(t,n,daily=false){
  const total=daily?GAME.dailyMathTotal:GAME.mathTotal;
  state={...state,type:t,level:n,mode:null,qs:[],i:0,hits:0,daily,total};
  if(daily){
    const max=n.max||10;
    for(let a=1;a<=max;a++)for(let b=1;b<=max;b++){
      if(t==='suma'&&a+b<=max)state.qs.push({a,b,r:a+b});
      if(t==='resta'&&b<a)state.qs.push({a,b,r:a-b});
    }
  }else{
    for(let a=1;a<=n.aMax;a++)for(let b=1;b<=n.bMax;b++){
      if(t==='suma'&&(!n.resultMax||a+b<=n.resultMax))state.qs.push({a,b,r:a+b});
      if(t==='resta'&&b<a)state.qs.push({a,b,r:a-b});
    }
  }
  state.qs=mix(state.qs).slice(0,total);
  question();
}
function question(){state.locked=false;if(state.i>=state.total)return finish();const q=state.qs[state.i];state.correct=q.r;const prompt=`${q.a} ${state.type==='suma'?'+':'−'} ${q.b}`;let optsSet=new Set([q.r]);while(optsSet.size<3){const v=q.r+rnd(-5,5);if(v>=0)optsSet.add(v);}const opts=mix([...optsSet]);layout(`<div class="top"><button class="btn secondary back" onclick="levels('${state.type}')">← Salir</button>${diamond()}</div><div class="muted">Ejercicio ${state.i+1} de ${state.total}</div><div class="question">${prompt}</div><div class="answers">${opts.map(o=>`<button class="answer" onclick="answer('${o}',this)">${o}</button>`).join('')}</div><div id="msg" class="muted msg"></div>`);state.i++;}
function answer(v,b){if(state.locked)return;state.locked=true;if(String(v)===String(state.correct)){state.hits++;if((state.type==='suma'||state.type==='resta')&&!state.daily){rewardProgressCorrect();document.getElementById('msg').textContent='¡Muy bien!';}else{rewardOne();document.getElementById('msg').textContent='¡Muy bien! +1 💎';}b.classList.add('correct');}else{playChime('bad');b.classList.add('wrong');document.getElementById('msg').textContent='Era '+state.correct;document.querySelectorAll('.answer').forEach(x=>{if(String(x.textContent)===String(state.correct))x.classList.add('correct');});}setTimeout(question,900);}
function rewardProgressCorrect(){D.totalAciertos++;giveXP(2);save(D);playChime('ok');}
function rewardOne(){D.diamantes++;D.totalAciertos++;giveXP(2);save(D);playChime('ok');animateDiamond();}
function animateDiamond(){const el=document.getElementById('diamond');if(el){const span=el.querySelector('span');if(span)span.textContent=D.diamantes;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}const t=document.createElement('div');t.className='toast';t.textContent='+1 💎';document.body.appendChild(t);setTimeout(()=>t.remove(),900);}
function finish(){
  if((state.type==='suma'||state.type==='resta')&&!state.daily){
    const s=stats(state.level.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[state.level.id]=s;
    const reward=levelDiamonds(state.level,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);
    layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid"><button class="btn primary" onclick="startMath('${state.type}',${JSON.stringify(state.level)})">Jugar otra vez</button><button class="btn secondary" onclick="levels('${state.type}')">Volver a niveles</button></div>`);return;
  }
  const perfect=state.hits===state.total,bonus=perfect?5:3,xp=5+(perfect?5:0);D.diamantes+=bonus;giveXP(xp);if(state.daily)markDaily(state.type);checkAchievements();save(D);layout(`<div class="top"><h2>¡Actividad terminada!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${bonus} 💎 · +${xp} XP</p><div class="grid"><button class="btn primary" onclick="home()">Volver</button></div>`);
}
function makeComparePair(n){
  const min=n.min||1,max=n.max||10,minGap=n.minGap||1,wantsClose=n.maxGap&&Math.random()<(n.closeChance??1);
  for(let attempt=0;attempt<200;attempt++){
    const a=rnd(min,max),b=rnd(min,max),gap=Math.abs(a-b);
    if(a===b||gap<minGap)continue;
    if(wantsClose&&gap>n.maxGap)continue;
    return [a,b];
  }
  return [min,max];
}
function startCompare(n){
  const targets=mix(Array.from({length:GAME.compareTotal},(_,i)=>i<Math.ceil(GAME.compareTotal/2)?'mayor':'menor'));
  const qs=targets.map(target=>{const [a,b]=makeComparePair(n);return{a,b,target,r:target==='mayor'?Math.max(a,b):Math.min(a,b)};});
  state={...state,type:'comparar',level:n,mode:null,qs,i:0,hits:0,daily:false,total:GAME.compareTotal};
  compareQuestion();
}
function speakCompareInstruction(target){
  try{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(target==='mayor'?'Toca el número mayor':'Toca el número menor');
    u.lang='es-ES';u.rate=.9;u.pitch=1.05;window.speechSynthesis.speak(u);
  }catch(e){}
}
function compareQuestion(){
  state.locked=false;
  if(state.i>=state.total)return finishCompare();
  const q=state.qs[state.i],isMajor=q.target==='mayor';state.correct=q.r;state.compareTarget=q.target;
  const icon=isMajor?'⬆️':'⬇️',label=isMajor?'MAYOR':'MENOR';
  layout(`<div class="top"><button class="btn secondary back" onclick="levels('comparar')">← Salir</button>${diamond()}</div><div class="muted">Comparación ${state.i+1} de ${state.total}</div><div class="compare-instruction"><span>${icon}</span><b>${label}</b><button class="compare-audio" onclick="speakCompareInstruction('${q.target}')" aria-label="Escuchar instrucción">🔊</button></div><div class="compare-numbers"><button class="compare-number" onclick="answerCompare(${q.a},this)">${q.a}</button><div class="compare-vs">¿?</div><button class="compare-number" onclick="answerCompare(${q.b},this)">${q.b}</button></div><div id="msg" class="muted msg"></div>`);
  state.i++;
  setTimeout(()=>speakCompareInstruction(q.target),120);
}
function answerCompare(v,b){
  if(state.locked)return;state.locked=true;
  if(Number(v)===Number(state.correct)){
    state.hits++;rewardProgressCorrect();b.classList.add('correct');document.getElementById('msg').textContent='¡Muy bien!';
  }else{
    playChime('bad');b.classList.add('wrong');document.getElementById('msg').textContent=`Era ${state.correct}`;
    document.querySelectorAll('.compare-number').forEach(x=>{if(Number(x.textContent)===Number(state.correct))x.classList.add('correct');});
  }
  setTimeout(compareQuestion,900);
}
function finishCompare(){
  const s=stats(state.level.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[state.level.id]=s;
  const reward=levelDiamonds(state.level,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);
  layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid"><button class="btn primary" onclick='startCompare(${JSON.stringify(state.level)})'>Jugar otra vez</button><button class="btn secondary" onclick="levels('comparar')">Volver a niveles</button></div>`);
}
function wordPool(n){return GAME.words.filter(w=>{const len=w.word.length,sy=w.syllables.length;return (!n.minLen||len>=n.minLen)&&(!n.maxLen||len<=n.maxLen)&&(!n.minSyllables||sy>=n.minSyllables)&&(!n.maxSyllables||sy<=n.maxSyllables);});}
function startWords(n){let pool=wordPool(n);if(pool.length<GAME.wordTotal)pool=GAME.words.filter(w=>(!n.maxLen||w.word.length<=n.maxLen+1));state={...state,type:'palabras',level:n,mode:n.mode,qs:mix(pool).slice(0,GAME.wordTotal),i:0,hits:0,daily:false,total:GAME.wordTotal};wordQuestion();}
function syllableDistractors(correct,q){const all=[...new Set(GAME.words.flatMap(w=>w.syllables))].filter(x=>x!==correct&&x.length<=Math.max(3,correct.length+1));return mix(all).slice(0,2);}
function similarOptions(q,count=3){let set=new Set([q.word]);const candidates=GAME.words.filter(w=>w.word!==q.word&&Math.abs(w.word.length-q.word.length)<=1).map(w=>w.word);for(const w of mix(candidates)){set.add(w);if(set.size>=count)break;}return mix([...set]);}
function wordQuestion(){if(state.i>=state.total)return finishWords();state.locked=false;const q=state.qs[state.i],m=state.mode;let prompt='',sub='',opts=[],correct=q.word;
  if(m==='completeSyllable'||m==='missingSyllable'){
    const idx=q.syllables.length>1?rnd(0,q.syllables.length-1):0,missing=q.syllables[idx];prompt=q.syllables.map((s,i)=>i===idx?'__':s).join(' · ');sub=m==='completeSyllable'?'Completa la palabra':'¿Qué sílaba falta?';correct=missing;opts=mix([missing,...syllableDistractors(missing,q)]);
  }else if(m==='order2'||m==='order3'){
    const scrambled=mix(q.syllables);prompt=scrambled.join('  +  ');sub='¿Qué palabra forman estas sílabas?';correct=q.word;opts=similarOptions(q,3);
  }else if(m==='missingLetter'){
    const pos=rnd(1,Math.max(1,q.word.length-2)),letter=q.word[pos];prompt=[...q.word].map((c,i)=>i===pos?'_':c).join(' ');sub='¿Qué letra falta?';correct=letter;const abc='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';let set=new Set([letter]);while(set.size<3)set.add(abc[rnd(0,abc.length-1)]);opts=mix([...set]);
  }else{
    prompt=q.icon;sub=m==='similarWord'?'Elige la palabra correcta. Fíjate bien.':'¿Qué palabra corresponde al dibujo?';correct=q.word;opts=similarOptions(q,m==='pictureWord4'?4:3);
  }
  state.correct=correct;layout(`<div class="top"><button class="btn secondary back" onclick="levels('palabras')">← Salir</button>${diamond()}</div><div class="muted">Ejercicio ${state.i+1} de ${state.total}</div><div class="word-exercise-icon">${q.icon}</div><div class="question letter-word">${prompt}</div><div class="muted center word-instruction">${sub}</div><div class="answers">${opts.map(o=>`<button class="answer word-answer" onclick="answerWord('${o}',this)">${o}</button>`).join('')}</div><div id="msg" class="muted msg"></div>`);state.i++;}
function answerWord(v,b){if(state.locked)return;state.locked=true;if(String(v)===String(state.correct)){state.hits++;rewardProgressCorrect();b.classList.add('correct');document.getElementById('msg').textContent='¡Muy bien!';}else{playChime('bad');b.classList.add('wrong');document.getElementById('msg').textContent='La respuesta era '+state.correct;document.querySelectorAll('.answer').forEach(x=>{if(String(x.textContent).trim()===String(state.correct))x.classList.add('correct');});}setTimeout(wordQuestion,900);}
function finishWords(){const s=stats(state.level.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[state.level.id]=s;const reward=levelDiamonds(state.level,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid"><button class="btn primary" onclick='startWords(${JSON.stringify(state.level)})'>Jugar otra vez</button><button class="btn secondary" onclick="levels('palabras')">Volver a niveles</button></div>`);}
function speakWord(text,prefix=''){
  try{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(prefix?`${prefix}. ${String(text).toLowerCase()}`:String(text).toLowerCase());
    u.lang='es-ES';u.rate=.82;u.pitch=1.02;window.speechSynthesis.speak(u);
  }catch(e){}
}
function readingWordPool(n,type){
  return GAME.words.filter(w=>{
    const len=w.word.length,sy=w.syllables.length,first=w.word[0],last=w.word.at(-1);
    if(n.minLen&&len<n.minLen)return false;if(n.maxLen&&len>n.maxLen)return false;
    if(n.minSyllables&&sy<n.minSyllables)return false;if(n.maxSyllables&&sy>n.maxSyllables)return false;
    if(type==='sonidoInicial'&&n.letters&&!n.letters.includes(first))return false;
    if(type==='sonidoFinal'&&n.endings&&!n.endings.includes(last))return false;
    if((type==='construir'||type==='ordenarSilabas')&&sy<2)return false;
    return true;
  });
}
function fillReadingQuestions(pool,total=10){
  if(!pool.length)return[];const out=[];let last='';
  while(out.length<total){let batch=mix(pool);if(batch.length>1&&batch[0].word===last)batch=[...batch.slice(1),batch[0]];for(const q of batch){out.push(q);last=q.word;if(out.length>=total)break;}}
  return out;
}
function startReadingGame(type,n){
  if(type==='rimas')return startRhymes(n);
  const pool=readingWordPool(n,type),qs=fillReadingQuestions(pool,10);
  state={...state,type,level:n,mode:type,qs,i:0,hits:0,daily:false,total:10,locked:false,picked:[],tokens:[]};
  readingQuestion();
}
function readingQuestion(){
  if(state.i>=state.total)return finishReading();
  if(state.type==='sonidoInicial'||state.type==='sonidoFinal')return soundQuestion();
  return syllableQuestion();
}
function makeLetterOptions(correct,n,type){
  const source=type==='sonidoInicial'?(n.letters||'MPLSTNCBDFGRVZJQ'):(n.endings||'AOLNSRZE');
  const all=[...new Set(source.split('').filter(x=>x!==correct))];let set=new Set([correct]);
  for(const letter of mix(all)){set.add(letter);if(set.size>=(n.options||3))break;}
  return mix([...set]);
}
function soundQuestion(){
  state.locked=false;const q=state.qs[state.i],initial=state.type==='sonidoInicial',correct=initial?q.word[0]:q.word.at(-1),opts=makeLetterOptions(correct,state.level,state.type);
  state.correct=correct;const num=state.i+1,label=initial?'¿CON QUÉ LETRA EMPIEZA?':'¿CON QUÉ LETRA TERMINA?',spoken=initial?'Escucha la palabra. Toca la letra por la que empieza':'Escucha la palabra. Toca la letra por la que termina';
  layout(`<div class="top"><button class="btn secondary back" onclick="levels('${state.type}')">← Salir</button>${diamond()}</div><div class="muted">Ejercicio ${num} de ${state.total}</div><div class="listen-card"><div class="reading-picture">${q.icon}</div><button class="listen-button" onclick="speakWord('${q.word}','${spoken}')">🔊</button><b>${label}</b></div><div class="answers reading-letter-answers">${opts.map(o=>`<button class="answer reading-letter" onclick="answerSound('${o}',this)">${o}</button>`).join('')}</div><div id="msg" class="muted msg"></div>`);
  state.i++;setTimeout(()=>speakWord(q.word,spoken),140);
}
function answerSound(value,b){
  if(state.locked)return;state.locked=true;
  if(value===state.correct){state.hits++;rewardProgressCorrect();b.classList.add('correct');document.getElementById('msg').textContent='¡Muy bien!';}
  else{playChime('bad');b.classList.add('wrong');document.getElementById('msg').textContent=`Era ${state.correct}`;document.querySelectorAll('.reading-letter').forEach(x=>{if(x.textContent.trim()===state.correct)x.classList.add('correct');});}
  setTimeout(readingQuestion,900);
}
function randomSyllableDistractors(q,count){
  const source=[...new Set(GAME.words.flatMap(w=>w.syllables))].filter(x=>!q.syllables.includes(x));return mix(source).slice(0,count);
}
function shuffledSyllableTokens(q,distractors=0){
  const values=[...q.syllables,...randomSyllableDistractors(q,distractors)].map((text,i)=>({text,id:`${i}-${Math.random()}`}));
  let shuffled=mix(values);const target=q.syllables.join('|');
  for(let tries=0;tries<12&&shuffled.filter(x=>q.syllables.includes(x.text)).slice(0,q.syllables.length).map(x=>x.text).join('|')===target;tries++)shuffled=mix(values);
  return shuffled;
}
function syllableQuestion(){
  state.locked=false;const q=state.qs[state.i],build=state.type==='construir',num=state.i+1;
  state.currentWord=q;state.picked=[];state.tokens=shuffledSyllableTokens(q,build?(state.level.distractors||0):0);state.i++;
  renderSyllableQuestion(num);
  setTimeout(()=>speakWord(q.word,build?'Construye esta palabra':'Ordena las sílabas para formar esta palabra'),140);
}
function renderSyllableQuestion(num=state.i){
  const q=state.currentWord,build=state.type==='construir',need=q.syllables.length,chosen=state.picked.map(i=>state.tokens[i]?.text).filter(Boolean);
  const slots=Array.from({length:need},(_,i)=>`<div class="syllable-slot ${chosen[i]?'filled':''}">${chosen[i]||'•'}</div>`).join('');
  layout(`<div class="top"><button class="btn secondary back" onclick="levels('${state.type}')">← Salir</button>${diamond()}</div><div class="muted">Ejercicio ${num} de ${state.total}</div><div class="listen-card compact"><div class="reading-picture">${q.icon}</div><button class="listen-button" onclick="speakWord('${q.word}')">🔊</button><b>${build?'CONSTRUYE':'ORDENA'}</b></div><div class="syllable-slots">${slots}</div><div class="syllable-bank">${state.tokens.map((tok,i)=>`<button class="syllable-token ${state.picked.includes(i)?'used':''}" ${state.picked.includes(i)?'disabled':''} onclick="pickSyllable(${i})">${tok.text}</button>`).join('')}</div><div id="msg" class="muted msg"></div>`);
}
function pickSyllable(index){
  if(state.locked||state.picked.includes(index))return;state.picked.push(index);const q=state.currentWord,need=q.syllables.length;
  renderSyllableQuestion();
  if(state.picked.length<need)return;
  state.locked=true;const attempt=state.picked.map(i=>state.tokens[i].text),ok=attempt.join('|')===q.syllables.join('|'),msg=document.getElementById('msg');
  if(ok){state.hits++;rewardProgressCorrect();if(msg)msg.textContent='¡Muy bien!';document.querySelectorAll('.syllable-slot').forEach(x=>x.classList.add('correct-slot'));}
  else{playChime('bad');if(msg)msg.textContent=`Era ${q.syllables.join(' · ')}`;document.querySelectorAll('.syllable-slot').forEach(x=>x.classList.add('wrong-slot'));}
  setTimeout(readingQuestion,1050);
}
function makeRhymeQuestion(n,index){
  const groups=GAME.rhymes.slice(0,Math.min(n.groups||GAME.rhymes.length,GAME.rhymes.length)),group=groups[index%groups.length],pair=mix(group.words),reference=pair[0],correct=pair[1]||pair[0];
  let candidates=groups.filter(g=>g.key!==group.key).flatMap(g=>g.words).filter(w=>w.word!==reference.word&&w.word!==correct.word);
  if(n.hard)candidates=candidates.sort((a,b)=>(b.word[0]===reference.word[0])-(a.word[0]===reference.word[0]));else candidates=mix(candidates);
  return{reference,correct,options:mix([correct,...candidates.slice(0,Math.max(1,(n.options||3)-1))])};
}
function startRhymes(n){
  const order=mix(Array.from({length:10},(_,i)=>i));const qs=order.map((v,i)=>makeRhymeQuestion(n,v+i));
  state={...state,type:'rimas',level:n,mode:'rimas',qs,i:0,hits:0,daily:false,total:10,locked:false};rhymeQuestion();
}
function rhymeQuestion(){
  if(state.i>=state.total)return finishReading();state.locked=false;const q=state.qs[state.i],num=state.i+1;state.correct=q.correct.word;
  layout(`<div class="top"><button class="btn secondary back" onclick="levels('rimas')">← Salir</button>${diamond()}</div><div class="muted">Ejercicio ${num} de ${state.total}</div><div class="rhyme-prompt"><span>${q.reference.icon}</span><b>${q.reference.word}</b><button class="listen-button" onclick="speakWord('${q.reference.word}','Busca una palabra que rime con')">🔊</button></div><div class="rhyme-options">${q.options.map(o=>`<div class="rhyme-option"><button class="rhyme-choice" data-word="${o.word}" onclick="answerRhyme('${o.word}',this)"><span>${o.icon}</span><b>${o.word}</b></button><button class="rhyme-hear" onclick="speakWord('${o.word}')" aria-label="Escuchar ${o.word}">🔊</button></div>`).join('')}</div><div id="msg" class="muted msg"></div>`);
  state.i++;setTimeout(()=>speakWord(q.reference.word,'Busca una palabra que rime con'),140);
}
function answerRhyme(word,b){
  if(state.locked)return;state.locked=true;
  if(word===state.correct){state.hits++;rewardProgressCorrect();b.classList.add('correct');document.getElementById('msg').textContent='¡Sí, riman!';}
  else{playChime('bad');b.classList.add('wrong');document.getElementById('msg').textContent='Escucha cómo terminan';document.querySelectorAll('.rhyme-choice').forEach(x=>{if(x.dataset.word===state.correct)x.classList.add('correct');});}
  setTimeout(rhymeQuestion,1050);
}
function finishReading(){
  const type=state.type,n=state.level,s=stats(n.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.total;D.estadisticas[n.id]=s;
  const reward=levelDiamonds(n,wasDone),perfect=state.hits===state.total,xp=5+(perfect?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);
  layout(`<div class="top"><h2>¡Nivel completado!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.total}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid"><button class="btn primary" onclick='startReadingGame(${JSON.stringify(type)},${JSON.stringify(n)})'>Jugar otra vez</button><button class="btn secondary" onclick="levels('${type}')">Volver a niveles</button></div>`);
}
function startSoup(n,daily=false){const pool=GAME.words.filter(w=>w.word.length>=(n.minLen||3)&&w.word.length<=(n.maxLen||n.size));const count=daily?1:n.count;const words=mix(pool).slice(0,count);state={...state,type:'sopa',level:n,mode:null,qs:words,i:0,hits:0,daily,total:count,path:[],found:[]};const built=buildMultiGrid(words.map(w=>w.word),n.size,n.dirs);state.grid=built.grid;state.targets=built.targets;state.found=Array(words.length).fill(false);renderSoup();}
function renderSoup(){const n=state.level,cols=`repeat(${n.size},1fr)`;layout(`<div class="top"><button class="btn secondary back" onclick="${state.daily?'home()':"levels('sopa')"}">← Salir</button>${diamond()}</div><div class="muted">Encuentra ${state.qs.length===1?'la palabra':`las ${state.qs.length} palabras`}</div><div class="soup-targets">${state.qs.map((q,i)=>`<div class="soup-target ${state.found[i]?'done':''}" data-target="${i}"><span>${state.found[i]?'✅':q.icon}</span><b>${q.word}</b></div>`).join('')}</div><div class="word-hint center">Toca la primera y la última letra de cada palabra.</div><div id="wordGrid" class="word-grid" style="grid-template-columns:${cols}">${state.grid.flatMap((row,r)=>row.map((letter,c)=>`<button class="word-cell" data-r="${r}" data-c="${c}" onclick="pickSoup(${r},${c})">${letter}</button>`)).join('')}</div><div id="wordStatus" class="word-status"></div>`);paintFoundSoup();}
function buildMultiGrid(words,size,dirs){for(let restart=0;restart<150;restart++){const grid=Array.from({length:size},()=>Array(size).fill('')),targets=[];let ok=true;for(const word of words){let placed=false;for(let attempt=0;attempt<250&&!placed;attempt++){const dir=dirs[rnd(0,dirs.length-1)];let dr=0,dc=1;if(dir==='v'){dr=1;dc=0;}if(dir==='d'){dr=1;dc=1;}const maxR=size-1-dr*(word.length-1),maxC=size-1-dc*(word.length-1);if(maxR<0||maxC<0)continue;const sr=rnd(0,maxR),sc=rnd(0,maxC),cells=[];let fits=true;for(let i=0;i<word.length;i++){const r=sr+dr*i,c=sc+dc*i;if(grid[r][c]&&grid[r][c]!==word[i]){fits=false;break;}cells.push([r,c]);}if(!fits)continue;[...word].forEach((ch,i)=>{const [r,c]=cells[i];grid[r][c]=ch;});targets.push(cells);placed=true;}if(!placed){ok=false;break;}}if(ok){const abc='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!grid[r][c])grid[r][c]=abc[rnd(0,abc.length-1)];return{grid,targets};}}throw new Error('No se pudo generar la sopa');}
function pickSoup(r,c){if(state.locked)return;if(!state.path.length){state.path=[[r,c]];paintPath();document.getElementById('wordStatus').textContent='Ahora toca la última letra.';return;}const line=getLine(state.path[0],[r,c]);state.path=line;paintPath();let idx=-1;for(let i=0;i<state.targets.length;i++){if(!state.found[i]&&samePath(line,state.targets[i])){idx=i;break;}}if(idx>=0){state.found[idx]=true;state.hits++;rewardProgressCorrect();state.path=[];playChime('ok');const status=document.getElementById('wordStatus');if(status)status.textContent='¡Encontrada!';if(state.hits>=state.qs.length){state.locked=true;setTimeout(finishSoup,700);}else setTimeout(renderSoup,450);}else{const status=document.getElementById('wordStatus');if(status)status.textContent='Prueba otra vez.';setTimeout(()=>{state.path=[];paintPath();if(status)status.textContent='';},550);}}
function getLine(a,b){const dR=b[0]-a[0],dC=b[1]-a[1];if(!(dR===0||dC===0||Math.abs(dR)===Math.abs(dC)))return[a,b];const dr=Math.sign(dR),dc=Math.sign(dC),len=Math.max(Math.abs(dR),Math.abs(dC))+1;return Array.from({length:len},(_,i)=>[a[0]+dr*i,a[1]+dc*i]);}
function samePath(a,b){return a.length===b.length&&a.every((p,i)=>p[0]===b[i][0]&&p[1]===b[i][1]);}
function cellAt(r,c){return document.querySelector(`.word-cell[data-r="${r}"][data-c="${c}"]`);}
function paintPath(){document.querySelectorAll('.word-cell').forEach(x=>x.classList.remove('selected'));state.path.forEach(([r,c])=>{const x=cellAt(r,c);if(x)x.classList.add('selected');});paintFoundSoup();}
function paintFoundSoup(){if(!state.targets||!state.found)return;state.targets.forEach((cells,i)=>{if(state.found[i])cells.forEach(([r,c])=>{const x=cellAt(r,c);if(x)x.classList.add('found');});});}
function finishSoup(){const s=stats(state.level.id),wasDone=s.partidas>0;s.partidas++;s.aciertos+=state.hits;s.respuestas+=state.qs.length;D.estadisticas[state.level.id]=s;if(state.daily){const perfect=state.hits===state.qs.length,bonus=perfect?5:3,xp=5+(perfect?5:0);D.diamantes+=bonus;giveXP(xp);markDaily('sopa');checkAchievements();save(D);layout(`<div class="top"><h2>¡Sopa completada!</h2>${diamond(true)}</div><p class="center reward-line">+${bonus} 💎 · +${xp} XP</p><button class="btn primary" onclick="home()">Volver a los retos</button>`);return;}const reward=levelDiamonds(state.level,wasDone),xp=5+(state.hits===state.qs.length?5:0);D.diamantes+=reward;giveXP(xp);checkAchievements();save(D);layout(`<div class="top"><h2>¡Sopa completada!</h2>${diamond(true)}</div><div class="question score">${state.hits} de ${state.qs.length}</div><p class="center reward-line">+${reward} 💎 · +${xp} XP</p><p class="center muted">${wasDone?'Premio de repetición':'¡Nivel marcado como hecho! El siguiente nivel ya está desbloqueado.'}</p><div class="grid"><button class="btn primary" onclick='startSoup(${JSON.stringify(state.level)})'>Jugar otra vez</button><button class="btn secondary" onclick="levels('sopa')">Volver a niveles</button></div>`);}
function parents(){
  if(!parentMode){
    layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div><div class="parent-login"><div class="parent-lock">🔒</div><h2>Zona de padres</h2><p class="muted center">Introduce la contraseña para activar el modo Padres.</p><input id="parentPassword" type="password" autocomplete="current-password" placeholder="Contraseña" onkeydown="if(event.key==='Enter')unlockParents()"><button class="btn primary" onclick="unlockParents()">Entrar</button><div id="parentError" class="parent-error"></div></div>`);
    setTimeout(()=>document.getElementById('parentPassword')?.focus(),0);return;
  }
  parentDashboard();
}
function unlockParents(){
  const input=document.getElementById('parentPassword'),error=document.getElementById('parentError');
  if(input&&input.value==='cali'){parentMode=true;parentDashboard();return;}
  if(error)error.textContent='Contraseña incorrecta';
  if(input){input.value='';input.focus();}
}
function parentDashboard(){
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button><span class="parent-active">🔓 Modo Padres activo</span>${diamond()}</div><h2>Zona de padres</h2><div class="parent-grid">
  <div class="parent-card"><h3>👤 Jugador</h3><label>Nombre</label><input id="nameInput" type="text" maxlength="24" value="${escapeHTML(D.perfil.nombre)}"><button class="btn secondary" onclick="setName()">Guardar nombre</button></div>
  <div class="parent-card"><h3>🧪 Modo de pruebas</h3><p class="muted">Todos los niveles están desbloqueados mientras este modo esté activo.</p><button class="btn secondary" onclick="parentTestLevels()">Probar cualquier nivel</button><button class="btn danger" onclick="disableParentMode()">🔒 Quitar modo Padres</button></div>
  <div class="parent-card"><h3>⭐ Experiencia y nivel</h3><label>Nivel actual</label><input id="parentLevel" type="number" min="1" max="999" step="1" value="${D.nivelJugador}"><label>XP actual</label><input id="parentXP" type="number" min="0" step="1" value="${D.xp}"><button class="btn secondary" onclick="setParentProgress()">Aplicar nivel y XP</button></div>
  <div class="parent-card"><h3>💎 Diamantes</h3><div class="grid2"><button class="btn secondary" onclick="changeDiamonds(-100)">−100</button><button class="btn secondary" onclick="changeDiamonds(100)">+100</button></div><button class="btn secondary" onclick="changeDiamonds(500)">+500</button><label>Cantidad exacta</label><input id="parentDiamonds" type="number" min="0" step="1" value="${D.diamantes}"><button class="btn secondary" onclick="setDiamondsExact()">Aplicar diamantes</button></div>
  <div class="parent-card"><h3>🛍️ Precios de la tienda</h3><p class="muted">Multiplica a la vez el precio de los 24 objetos. Las compras ya realizadas no cambian.</p><div class="price-presets"><button class="small secondary" onclick="setShopPriceMultiplier(0.5)">×0,5</button><button class="small secondary" onclick="setShopPriceMultiplier(1)">×1</button><button class="small secondary" onclick="setShopPriceMultiplier(1.5)">×1,5</button><button class="small secondary" onclick="setShopPriceMultiplier(2)">×2</button></div><label>Multiplicador global</label><input id="shopPriceMultiplier" type="number" min="0.25" max="3" step="0.25" value="${D.ajustes.multiplicadorPrecios}"><button class="btn secondary" onclick="setShopPriceMultiplier()">Aplicar a toda la tienda</button><small class="muted">Rango actual: ${Math.min(...avatarCatalog().map(avatarItemPrice))}–${Math.max(...avatarCatalog().map(avatarItemPrice))} 💎</small></div>
  <div class="parent-card"><h3>💾 Progreso</h3><div class="grid"><button class="btn secondary" onclick="exportData()">Exportar progreso</button><label class="btn secondary file-label" for="importFile">Importar progreso</label><input id="importFile" type="file" accept=".json,application/json" onchange="importData(event)" hidden></div></div>
  <div class="parent-card"><h3>⚠️ Reinicio</h3><button class="btn danger" onclick="resetAll()">Borrar todo el progreso</button></div>
  </div>`);
}
function parentTestLevels(){layout(`<div class="top"><button class="btn secondary back" onclick="parentDashboard()">← Padres</button><span class="parent-active">🔓 Pruebas</span></div><h2>Probar niveles</h2><p class="muted">Elige una actividad. Todos sus niveles estarán disponibles mientras el modo Padres siga activo.</p><div class="game-grid"><button class="game-card game-sum" onclick="levels('suma')"><span class="game-icon">＋</span><b>Sumas</b></button><button class="game-card game-sub" onclick="levels('resta')"><span class="game-icon">−</span><b>Restas</b></button><button class="game-card game-compare" onclick="levels('comparar')"><span class="game-icon">↕</span><b>Mayor o menor</b></button><button class="game-card game-letters" onclick="levels('palabras')"><span class="game-icon">Aa</span><b>Palabras</b></button><button class="game-card game-soup" onclick="levels('sopa')"><span class="game-icon">▦</span><b>Sopas</b></button><button class="game-card game-sound-start" onclick="levels('sonidoInicial')"><span class="game-icon">🔊</span><b>Sonido inicial</b></button><button class="game-card game-sound-end" onclick="levels('sonidoFinal')"><span class="game-icon">👂</span><b>Sonido final</b></button><button class="game-card game-build-word" onclick="levels('construir')"><span class="game-icon">🧩</span><b>Construye</b></button><button class="game-card game-order-syllables" onclick="levels('ordenarSilabas')"><span class="game-icon">🔀</span><b>Ordena sílabas</b></button><button class="game-card game-rhyme" onclick="levels('rimas')"><span class="game-icon">🎵</span><b>Rimas</b></button></div>`);}
function disableParentMode(){parentMode=false;home();}
function setParentProgress(){
  const level=Math.max(1,Math.floor(Number(document.getElementById('parentLevel')?.value)||1));
  const xp=Math.max(0,Math.floor(Number(document.getElementById('parentXP')?.value)||0));
  D.nivelJugador=level;D.xp=xp;save(D);parentDashboard();
}
function changeDiamonds(amount){D.diamantes=Math.max(0,D.diamantes+amount);save(D);parentDashboard();}
function setDiamondsExact(){D.diamantes=Math.max(0,Math.floor(Number(document.getElementById('parentDiamonds')?.value)||0));save(D);parentDashboard();}
function setShopPriceMultiplier(preset=null){
  const input=document.getElementById('shopPriceMultiplier'),raw=preset??input?.value,value=Number(String(raw).replace(',','.'));
  const min=AVATAR.economy?.minimumPriceMultiplier||0.25,max=AVATAR.economy?.maximumPriceMultiplier||3;
  if(!Number.isFinite(value)){alert('Introduce un multiplicador válido.');return;}
  D.ajustes.multiplicadorPrecios=Math.min(max,Math.max(min,Math.round(value*4)/4));
  save(D);parentDashboard();
}
function escapeHTML(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function setName(){const i=document.getElementById('nameInput');D.perfil.nombre=(i?.value||'Jugador').trim().slice(0,24)||'Jugador';save(D);alert('Nombre guardado');}
function exportData(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D,null,2)],{type:'application/json'}));a.download='progreso-aprendo-jugando.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importData(e){const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{localStorage.setItem(STORE,r.result);D=load();alert('Progreso importado');home();}catch{alert('Archivo no válido');}};r.readAsText(file);}
function resetAll(){if(confirm('¿Borrar todo el progreso? Esta acción no se puede deshacer.')){localStorage.removeItem(STORE);D=load();home();}}
home();
