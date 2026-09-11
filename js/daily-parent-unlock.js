/* V3.12.0 — acceso a juegos de acción de un solo uso. */
(function(){
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');

  function parentAccess(){
    if(!D.parentActionAccess||typeof D.parentActionAccess!=='object'||D.parentActionAccess.date!==todayKey()){
      D.parentActionAccess={date:todayKey(),available:false};
    }
    D.parentActionAccess.available=!!D.parentActionAccess.available;
    return D.parentActionAccess;
  }

  function levelModeActive(){return D.ajustes?.progresoDiario!=='challenges';}

  function levelRewardAvailable(){
    if(!levelModeActive())return false;
    ensureActionAccess();
    return D.actionAccess?.date===todayKey()&&!!D.actionAccess.available&&!D.actionAccess.consumed;
  }

  function parentUnlockActionGames(){
    if(!parentMode)return;
    parentAccess().available=true;
    save(D);
    parentDashboard();
  }

  function consumeCurrentAccess(){
    if(parentMode){
      const access=parentAccess();
      if(!access.available)return false;
      access.available=false;
      save(D);
      return true;
    }
    ensureActionAccess();
    if(!D.actionAccess.available||D.actionAccess.consumed)return false;
    D.actionAccess.available=false;
    D.actionAccess.consumed=true;
    D.dueloGuardianes.unlocked=false;
    D.dueloGuardianes.unlockedBy=null;
    D.defensaPlaneta.unlocked=false;
    D.defensaPlaneta.unlockedBy=null;
    save(D);
    return true;
  }

  function actionAvailable(){
    if(parentMode)return !!parentAccess().available;
    if(levelModeActive())return levelRewardAvailable();
    ensureActionAccess();
    return !!D.actionAccess?.available&&!D.actionAccess?.consumed;
  }

  function playGuardianFromAccess(){
    if(!actionAvailable()||!consumeCurrentAccess())return;
    startGuardianDuel();
  }

  function playPlanetFromAccess(){
    if(!actionAvailable()||!consumeCurrentAccess())return;
    openPlanetDefense();
  }

  function playTankFromAccess(){
    if(!actionAvailable()||typeof window.tankPixelOpen!=='function'||!consumeCurrentAccess())return;
    window.tankPixelOpen();
  }

  window.parentUnlockActionGames=parentUnlockActionGames;
  window.playGuardianFromAccess=playGuardianFromAccess;
  window.playPlanetFromAccess=playPlanetFromAccess;
  window.playTankFromAccess=playTankFromAccess;

  const previousAvailable=actionGamesAvailable;
  window.actionGamesAvailable=function(){
    if(parentMode)return !!parentAccess().available;
    if(levelModeActive())return levelRewardAvailable();
    return previousAvailable();
  };

  function actionNote(unlocked){
    if(parentMode)return unlocked?'Desbloqueado · una partida disponible':'Bloqueado · pulsa «Desbloquear» en Padres';
    if(unlocked)return 'Objetivo conseguido · una partida disponible';
    if(levelModeActive())return `Completa ${D.ajustes?.nivelesDiarios||10} niveles para desbloquear una partida`;
    return 'Completa los retos de hoy para desbloquear una partida';
  }

  window.guardianDuelCard=function(){
    const unlocked=actionAvailable();
    return `<button class="guardian-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="playGuardianFromAccess()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'⚡':'🔒'}</span><span><b>Duelo de Guardianes</b><small>${actionNote(unlocked)}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  window.planetDefenseCard=function(){
    const unlocked=actionAvailable();
    return `<button class="guardian-home-card planet-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="playPlanetFromAccess()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'🌍':'🔒'}</span><span><b>Defensa del planeta</b><small>${actionNote(unlocked)}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  const previousParentDashboard=parentDashboard;
  window.parentDashboard=function(){
    previousParentDashboard();
    const grid=document.querySelector('.parent-grid');
    if(!grid)return;
    const old=document.querySelector('.parent-action-unlock');
    if(old)old.remove();
    const unlocked=parentAccess().available;
    grid.insertAdjacentHTML('afterbegin',`<div class="parent-card parent-action-unlock"><h3>⚡ Juegos de acción</h3><p class="muted">Desbloquea manualmente una partida para probar Duelo de Guardianes, Defensa del planeta o Tank Pixel. Al iniciar cualquiera de ellos, el permiso se consume y vuelve a quedar bloqueado.</p><button type="button" class="btn ${unlocked?'secondary':'primary'}" onclick="parentUnlockActionGames()">${unlocked?'✓ UNA PARTIDA DISPONIBLE':'🔓 DESBLOQUEAR UNA PARTIDA'}</button></div>`);
  };

  const previousDisableParentMode=window.disableParentMode;
  window.disableParentMode=function(){
    parentAccess().available=false;
    save(D);
    if(typeof previousDisableParentMode==='function')previousDisableParentMode();
  };

  save(D);
})();
