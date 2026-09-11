/* V3.12.1 — progreso diario por niveles o retos. */
(function(){
  const DEFAULT_MODE='levels';
  const DEFAULT_REQUIRED=10;
  const MIN_REQUIRED=5;
  const MAX_REQUIRED=100;
  const MODE_LEVELS='levels';
  const MODE_CHALLENGES='challenges';

  function ensureSettings(){
    D.ajustes=D.ajustes&&typeof D.ajustes==='object'?D.ajustes:{};
    if(D.ajustes.progresoDiario!==MODE_LEVELS&&D.ajustes.progresoDiario!==MODE_CHALLENGES)D.ajustes.progresoDiario=DEFAULT_MODE;
    const raw=Number(D.ajustes.nivelesDiarios);
    D.ajustes.nivelesDiarios=Number.isFinite(raw)?Math.min(MAX_REQUIRED,Math.max(MIN_REQUIRED,Math.floor(raw))):DEFAULT_REQUIRED;
    return D.ajustes;
  }

  function todayKey(){return new Date().toLocaleDateString('sv-SE');}

  function ensureLevelProgress(){
    ensureSettings();
    const date=todayKey();
    if(!D.progresoNivelesDiarios||typeof D.progresoNivelesDiarios!=='object'||D.progresoNivelesDiarios.fecha!==date){
      D.progresoNivelesDiarios={fecha:date,niveles:[],desbloqueado:false};
    }
    if(!Array.isArray(D.progresoNivelesDiarios.niveles))D.progresoNivelesDiarios.niveles=[];
    D.progresoNivelesDiarios.niveles=[...new Set(D.progresoNivelesDiarios.niveles.filter(x=>typeof x==='string'&&x.length))];
    D.progresoNivelesDiarios.desbloqueado=!!D.progresoNivelesDiarios.desbloqueado;
    return D.progresoNivelesDiarios;
  }

  function levelProgressCount(){return ensureLevelProgress().niveles.length;}
  function levelProgressTarget(){return ensureSettings().nivelesDiarios;}
  function levelProgressMode(){return ensureSettings().progresoDiario;}

  function grantLevelReward(){
    const p=ensureLevelProgress();
    if(p.desbloqueado||p.niveles.length<levelProgressTarget())return false;
    p.desbloqueado=true;
    if(!parentMode)D.actionAccess={date:todayKey(),available:true,consumed:false};
    save(D);
    return true;
  }

  function markDailyLevel(levelId){
    if(parentMode||state.daily||levelProgressMode()!==MODE_LEVELS||!levelId)return;
    const p=ensureLevelProgress();
    if(!p.niveles.includes(levelId)){
      p.niveles.push(levelId);
      grantLevelReward();
      save(D);
    }
  }

  function dailyLevelsHTML(){
    const p=ensureLevelProgress(),count=p.niveles.length,target=levelProgressTarget(),complete=count>=target;
    ensureActionAccess();
    const available=!!D.actionAccess?.available&&!D.actionAccess?.consumed;
    const used=complete&&p.desbloqueado&&!available;
    const pct=Math.min(100,Math.round(count/target*100));
    let text=`Completa ${target} niveles diferentes para desbloquear una partida de acción.`;
    let prize='⭐ Cada nivel completado cuenta una sola vez por día.';
    if(available){text='🎁 ¡Objetivo conseguido! Tienes una partida de acción disponible.';prize='⚡ El permiso se consumirá al iniciar un minijuego de acción.';}
    else if(used){text='✓ Objetivo diario completado.';prize='La partida de acción de hoy ya se ha utilizado.';}
    return `<div class="daily-card level-progress-card"><div class="daily-title"><b>🎮 Niveles de hoy</b><span>${count}/${target}</span></div><div class="daily-level-progress-track"><span style="width:${pct}%"></span></div><p class="daily-level-progress-text">${text}</p><div class="daily-prize">${prize}</div></div>`;
  }

  function dailyModeCard(){
    const mode=levelProgressMode(),target=levelProgressTarget();
    return `<div class="parent-card daily-mode-settings"><h3>📅 Progreso diario</h3><p class="muted">Elige cómo se desbloquean los juegos de acción.</p><div class="daily-mode-options"><label class="daily-mode-option ${mode===MODE_LEVELS?'selected':''}"><input type="radio" name="dailyProgressMode" value="levels" ${mode===MODE_LEVELS?'checked':''} onchange="setDailyProgressMode('levels')"><span><b>🎮 Niveles</b><small>Contar niveles diferentes completados cada día.</small></span></label><label class="daily-mode-option ${mode===MODE_CHALLENGES?'selected':''}"><input type="radio" name="dailyProgressMode" value="challenges" ${mode===MODE_CHALLENGES?'checked':''} onchange="setDailyProgressMode('challenges')"><span><b>🎯 Retos</b><small>Usar el sistema de retos diarios original.</small></span></label></div><div class="daily-level-config"><label>Niveles necesarios para desbloquear</label><input id="dailyLevelsRequired" type="number" min="${MIN_REQUIRED}" max="${MAX_REQUIRED}" step="1" value="${target}"><button class="btn secondary" onclick="setDailyLevelsRequired()">Guardar número de niveles</button><small class="muted">Mínimo ${MIN_REQUIRED} · máximo ${MAX_REQUIRED}.</small></div></div>`;
  }

  function setDailyProgressMode(mode){
    if(mode!==MODE_LEVELS&&mode!==MODE_CHALLENGES)return;
    ensureSettings().progresoDiario=mode;
    if(mode===MODE_LEVELS){
      ensureLevelProgress();
      D.actionAccess={date:todayKey(),available:false,consumed:false};
      grantLevelReward();
    }else{
      ensureDaily();
      const complete=!!D.retosDiarios?.premio;
      D.actionAccess={date:todayKey(),available:complete,consumed:false};
    }
    save(D);parentDashboard();
  }

  function setDailyLevelsRequired(value=null){
    const input=document.getElementById('dailyLevelsRequired');
    const raw=value??input?.value,target=Number(String(raw).replace(',','.'));
    if(!Number.isFinite(target)){alert('Introduce un número válido de niveles.');return;}
    ensureSettings().nivelesDiarios=Math.min(MAX_REQUIRED,Math.max(MIN_REQUIRED,Math.floor(target)));
    const p=ensureLevelProgress();
    const reached=p.niveles.length>=ensureSettings().nivelesDiarios;
    if(!reached){p.desbloqueado=false;D.actionAccess={date:todayKey(),available:false,consumed:false};}
    else if(!p.desbloqueado)grantLevelReward();
    save(D);parentDashboard();
  }

  window.setDailyProgressMode=setDailyProgressMode;
  window.setDailyLevelsRequired=setDailyLevelsRequired;

  const originalDailyHTML=dailyHTML;
  dailyHTML=function(){return levelProgressMode()===MODE_LEVELS?dailyLevelsHTML():originalDailyHTML();};

  const originalActionGamesAvailable=actionGamesAvailable;
  actionGamesAvailable=function(){
    if(parentMode)return originalActionGamesAvailable();
    if(levelProgressMode()===MODE_LEVELS){
      ensureLevelProgress();ensureActionAccess();
      return !!D.actionAccess.available&&!D.actionAccess.consumed;
    }
    return originalActionGamesAvailable();
  };

  const originalGuardianCard=guardianDuelCard;
  guardianDuelCard=function(){
    if(levelProgressMode()!==MODE_LEVELS)return originalGuardianCard();
    const unlocked=actionGamesAvailable();
    const note=parentMode?'Disponible mientras el modo Padres esté activo':unlocked?'Objetivo diario completado · una partida disponible':`Completa ${levelProgressTarget()} niveles para desbloquear una partida`;
    return `<button class="guardian-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="startGuardianDuel()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'⚡':'🔒'}</span><span><b>Duelo de Guardianes</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  const originalPlanetCard=planetDefenseCard;
  planetDefenseCard=function(){
    if(levelProgressMode()!==MODE_LEVELS)return originalPlanetCard();
    const unlocked=actionGamesAvailable();
    const note=parentMode?'Disponible mientras el modo Padres esté activo':unlocked?'Objetivo diario completado · una partida disponible':`Completa ${levelProgressTarget()} niveles para desbloquear una partida`;
    return `<button class="guardian-home-card planet-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="openPlanetDefense()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'🌍':'🔒'}</span><span><b>Defensa del planeta</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  function wrapFinish(name,levelGetter){
    const original=window[name];
    if(typeof original!=='function')return;
    window[name]=function(){
      if(levelProgressMode()===MODE_LEVELS&&!parentMode&&!state.daily){
        try{markDailyLevel(levelGetter.apply(this,arguments));}catch(e){}
      }
      return original.apply(this,arguments);
    };
  }
  wrapFinish('finish',()=>state.level?.id);
  wrapFinish('finishCompare',()=>state.level?.id);
  wrapFinish('finishWords',()=>state.level?.id);
  wrapFinish('finishReading',()=>state.level?.id);
  wrapFinish('finishSoup',()=>state.level?.id);

  if(Array.isArray(ACHIEVEMENTS)){
    const dailyAchievement=ACHIEVEMENTS.find(item=>item.id==='daily_complete');
    if(dailyAchievement){
      dailyAchievement.name='Objetivo diario';
      dailyAchievement.desc='Completa el objetivo diario de niveles o retos';
      dailyAchievement.test=()=>levelProgressMode()===MODE_LEVELS?levelProgressCount()>=levelProgressTarget():!!D.retosDiarios?.premio;
    }
  }

  const originalParentDashboard=parentDashboard;
  parentDashboard=function(){
    ensureSettings();ensureLevelProgress();
    originalParentDashboard();
    const grid=document.querySelector('.parent-grid');
    if(!grid)return;
    const existing=document.querySelector('.daily-mode-settings');
    if(existing)existing.remove();
    grid.insertAdjacentHTML('afterbegin',dailyModeCard());
  };

  ensureSettings();
  ensureLevelProgress();
  grantLevelReward();
  save(D);
  home();
})();
