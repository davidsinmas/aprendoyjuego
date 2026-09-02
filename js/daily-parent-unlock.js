/* V3.8.16 — desbloqueo manual desde Padres.
 *
 * En Zona de padres los juegos de acción permanecen bloqueados hasta pulsar
 * explícitamente el botón de desbloqueo. El desbloqueo concede una partida;
 * al iniciar cualquiera de los tres juegos de acción el acceso se consume y
 * vuelve a quedar bloqueado.
 */
(function(){
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');
  const mode=()=>D.ajustes?.progresoDiario||'levels';

  function parentAccess(){
    if(!D.parentActionAccess||typeof D.parentActionAccess!=='object'||D.parentActionAccess.date!==todayKey()){
      D.parentActionAccess={date:todayKey(),available:false};
    }
    D.parentActionAccess.available=!!D.parentActionAccess.available;
    return D.parentActionAccess;
  }

  function parentUnlockActionGames(){
    if(!parentMode)return;
    const access=parentAccess();
    access.available=true;
    save(D);
    parentDashboard();
  }

  function actionAvailable(){
    ensureActionAccess();
    if(parentMode)return !!parentAccess().available;
    return !!D.actionAccess?.available&&!D.actionAccess?.consumed;
  }

  function consumeForActionGame(){
    if(parentMode){
      const access=parentAccess();
      if(!access.available)return false;
      access.available=false;
      save(D);
      return true;
    }
    return consumeActionGameAccess();
  }

  function playGuardianFromAccess(){
    if(!actionAvailable())return;
    if(!consumeForActionGame())return;
    startGuardianDuel();
  }

  function playPlanetFromAccess(){
    if(!actionAvailable())return;
    if(!consumeForActionGame())return;
    openPlanetDefense();
  }

  function playTankFromAccess(){
    if(!actionAvailable())return;
    if(typeof window.tankPixelOpen!=='function')return;
    window.tankPixelOpen();
    consumeForActionGame();
  }

  window.parentUnlockActionGames=parentUnlockActionGames;
  window.playGuardianFromAccess=playGuardianFromAccess;
  window.playPlanetFromAccess=playPlanetFromAccess;
  window.playTankFromAccess=playTankFromAccess;

  const previousAvailable=actionGamesAvailable;
  window.actionGamesAvailable=function(){
    if(parentMode)return actionAvailable();
    return previousAvailable();
  };

  window.guardianDuelCard=function(){
    const unlocked=actionAvailable();
    const note=parentMode
      ? (unlocked?'Desbloqueado manualmente · una partida disponible':'Bloqueado · pulsa «Desbloquear» en Padres')
      : (unlocked?'Objetivo diario completado · una partida disponible':`Completa ${D.ajustes?.nivelesDiarios||10} niveles para desbloquear una partida`);
    return `<button class="guardian-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="playGuardianFromAccess()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'⚡':'🔒'}</span><span><b>Duelo de Guardianes</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  window.planetDefenseCard=function(){
    const unlocked=actionAvailable();
    const note=parentMode
      ? (unlocked?'Desbloqueado manualmente · una partida disponible':'Bloqueado · pulsa «Desbloquear» en Padres')
      : (unlocked?'Objetivo diario completado · una partida disponible':`Completa ${D.ajustes?.nivelesDiarios||10} niveles para desbloquear una partida`);
    return `<button class="guardian-home-card planet-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="playPlanetFromAccess()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'🌍':'🔒'}</span><span><b>Defensa del planeta</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  const previousParentDashboard=parentDashboard;
  window.parentDashboard=function(){
    previousParentDashboard();
    const grid=document.querySelector('.parent-grid');
    if(!grid)return;
    const old=document.querySelector('.parent-action-unlock');
    if(old)old.remove();
    const unlocked=parentAccess().available;
    grid.insertAdjacentHTML('afterbegin',`<div class="parent-card parent-action-unlock"><h3>⚡ Juegos de acción</h3><p class="muted">Los tres juegos permanecen bloqueados incluso en modo Padres hasta que pulses el botón. El desbloqueo permite <b>una sola partida</b>; después vuelve a bloquearse.</p><button type="button" class="btn ${unlocked?'secondary':'primary'}" onclick="parentUnlockActionGames()">${unlocked?'✓ DESBLOQUEADO':'🔓 DESBLOQUEAR UNA PARTIDA'}</button>${unlocked?'<small class="muted">Ya está desbloqueado. Puedes entrar en uno de los tres juegos; al iniciarlo el acceso se consumirá.</small>':''}</div>`);
  };

  if(!parentMode){
    /* No tocamos el pase diario normal de niveles/retos. */
  }
  save(D);
})();
