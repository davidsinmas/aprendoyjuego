/*
 * V3.8.11 — progreso diario por niveles.
 *
 * Los retos diarios originales NO se eliminan: se conservan y pueden volver a
 * activarse desde Zona de padres. El modo por defecto pasa a ser niveles.
 */
(function(){
  const DEFAULT_MODE='levels';
  const DEFAULT_REQUIRED=10;
  const MAX_REQUIRED=100;
  const MODE_LEVELS='levels';
  const MODE_CHALLENGES='challenges';

  function ensureSettings(){
    D.ajustes=D.ajustes&&typeof D.ajustes==='object'?D.ajustes:{};
    if(D.ajustes.progresoDiario!=='levels'&&D.ajustes.progresoDiario!=='challenges')D.ajustes.progresoDiario=DEFAULT_MODE;
    const raw=Number(D.ajustes.nivelesDiarios);
    D.ajustes.nivelesDiarios=Number.isFinite(raw)?Math.min(MAX_REQUIRED,Math.max(DEFAULT_REQUIRED,Math.floor(raw))):DEFAULT_REQUIRED;
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

  function unlockFromLevels(){
    const p=ensureLevelProgress();
    if(p.niveles.length>=levelProgressTarget()){
      p.desbloqueado=true;
      if(!parentMode)D.actionAccess={date:todayKey(),available:true,consumed:false};
    }
    save(D);
  }

  function markDailyLevel(levelId){
    if(parentMode||state.daily||levelProgressMode()!==MODE_LEVELS||!levelId)return;
    const p=ensureLevelProgress();
    if(!p.niveles.includes(levelId)){
      p.niveles.push(levelId);
      unlockFromLevels();
    }
    save(D);
  }

  function dailyLevelsHTML(){
    const p=ensureLevelProgress(),count=p.niveles.length,target=levelProgressTarget(),complete=count>=target;
    const pct=Math.min(100,Math.round(count/target*100));
    return `<div class="daily-card level-progress-card"><div class="daily-title"><b>🎮 Niveles de hoy</b><span>${count}/${target}</span></div><div class="daily-level-progress-track"><span style="width:${pct}%"></span></div><p class="daily-level-progress-text">${complete?'🎁 ¡Objetivo conseguido! Los juegos de acción están desbloqueados.':`Completa ${target} niveles diferentes para desbloquear los juegos de acción.`}</p><div class="daily-prize">${complete?'⚡ Puedes jugar una partida de acción hoy.':'⭐ Cada nivel completado cuenta una sola vez por día.'}</div></div>`;
  }

  function dailyModeCard(){
    const settings=ensureSettings(),mode=levelProgressMode(),target=levelProgressTarget();
    return `<div class="parent-card daily-mode-settings"><h3>📅 Progreso diario</h3><p class="muted">Elige cómo se desbloquean los juegos de acción. Los <b>Retos diarios</b> originales se conservan y no se borran.</p><div class="daily-mode-options"><label class="daily-mode-option ${mode===MODE_LEVELS?'selected':''}"><input type="radio" name="dailyProgressMode" value="levels" ${mode===MODE_LEVELS?'checked':''} onchange="setDailyProgressMode('levels')"><span><b>🎮 Niveles</b><small>Contar niveles completados cada día.</small></span></label><label class="daily-mode-option ${mode===MODE_CHALLENGES?'selected':''}"><input type="radio" name="dailyProgressMode" value="challenges" ${mode===MODE_CHALLENGES?'checked':''} onchange="setDailyProgressMode('challenges')"><span><b>🎯 Retos</b><small>Usar el sistema de retos diarios original.</small></span></label></div><div class="daily-level-config"><label>Niveles necesarios para desbloquear</label><input id="dailyLevelsRequired" type="number" min="10" max="${MAX_REQUIRED}" step="1" value="${target}"><button class="btn secondary" onclick="setDailyLevelsRequired()">Guardar número de niveles</button><small class="muted">Mínimo 10 · máximo ${MAX_REQUIRED}. El cambio se aplica al próximo progreso diario.</small></div></div>`;
  }

  function setDailyProgressMode(mode){
    if(mode!==MODE_LEVELS&&mode!==MODE_CHALLENGES)return;
    ensureSettings().progresoDiario=mode;
    ensureLevelProgress();
    if(mode===MODE_LEVELS)unlockFromLevels();
    save(D);parentDashboard();
  }

  function setDailyLevelsRequired(value=null){
    const input=document.getElementById('dailyLevelsRequired');
    const raw=value??input?.value,target=Number(String(raw).replace(',','.'));
    if(!Number.isFinite(target)){alert('Introduce un número válido de niveles.');return;}
    ensureSettings().nivelesDiarios=Math.min(MAX_REQUIRED,Math.max(DEFAULT_REQUIRED,Math.floor(target)));
    const p=ensureLevelProgress();
    p.desbloqueado=p.niveles.length>=ensureSettings().nivelesDiarios;
    if(p.desbloqueado&&!parentMode)D.actionAccess={date:todayKey(),available:true,consumed:false};
    save(D);parentDashboard();
  }

  /* Sustituye visualmente el panel diario solo cuando está activo el modo niveles. */
  const originalDailyHTML=dailyHTML;
  dailyHTML=function(){return levelProgressMode()===MODE_LEVELS?dailyLevelsHTML():originalDailyHTML();};

  /* En modo niveles, la disponibilidad de los dos juegos de acción depende del contador. */
  const originalActionGamesAvailable=actionGamesAvailable;
  actionGamesAvailable=function(){
    if(parentMode)return true;
    if(levelProgressMode()===MODE_LEVELS){
      const p=ensureLevelProgress();
      if(p.niveles.length>=levelProgressTarget()){
        p.desbloqueado=true;
        if(!D.actionAccess||D.actionAccess.date!==todayKey()||!D.actionAccess.available&&!D.actionAccess.consumed)D.actionAccess={date:todayKey(),available:true,consumed:false};
        save(D);
      }
      ensureActionAccess();
      return !!D.actionAccess.available&&!D.actionAccess.consumed;
    }
    return originalActionGamesAvailable();
  };

  /* Las tarjetas dejan de hablar de retos cuando el modo niveles está activo. */
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

  /* Cuenta el nivel justo cuando termina, sin alterar el sistema de estadísticas existente. */
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

  /* Ajusta el logro existente para que siga teniendo sentido con el nuevo modo. */
  if(Array.isArray(ACHIEVEMENTS)){
    const dailyAchievement=ACHIEVEMENTS.find(item=>item.id==='daily_complete');
    if(dailyAchievement){
      dailyAchievement.name='Objetivo diario';
      dailyAchievement.desc='Completa el objetivo diario de niveles o retos';
      dailyAchievement.test=()=>levelProgressMode()===MODE_LEVELS?levelProgressCount()>=levelProgressTarget():!!D.retosDiarios?.premio;
    }
  }

  /* Añade la sección de configuración al panel Padres existente, sin eliminar ninguna opción. */
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

  /* Arranque: conserva los retos diarios en almacenamiento y activa niveles como opción inicial. */
  ensureSettings();
  ensureLevelProgress();
  if(levelProgressMode()===MODE_LEVELS)unlockFromLevels();
  save(D);
  home();
})();
