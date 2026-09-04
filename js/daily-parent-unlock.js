/* V3.8.19 — acceso estable a juegos de acción desde Padres.
 *
 * El permiso de Padres para los juegos de acción se guarda como un estado
 * independiente. Entrar en un juego nunca lo consume ni modifica. Solo se
 * elimina al salir explícitamente del Modo Padres.
 */
(function(){
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');

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
    /* En Padres el permiso manual es independiente del pase diario. */
    if(parentMode)return !!parentAccess().available;
    return !!D.actionAccess?.available&&!D.actionAccess?.consumed;
  }

  function consumeForActionGame(){
    /* El acceso de Padres jamás se consume al abrir un juego. */
    if(parentMode)return true;
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
    if(!consumeForActionGame())return;
    window.tankPixelOpen();
  }

  window.parentUnlockActionGames=parentUnlockActionGames;
  window.playGuardianFromAccess=playGuardianFromAccess;
  window.playPlanetFromAccess=playPlanetFromAccess;
  window.playTankFromAccess=playTankFromAccess;

  const previousAvailable=actionGamesAvailable;
  window.actionGamesAvailable=function(){
    if(parentMode)return !!parentAccess().available;
    return previousAvailable();
  };

  window.guardianDuelCard=function(){
    const unlocked=actionAvailable();
    const note=parentMode
      ? (unlocked?'Desbloqueado · disponible en modo Padres':'Bloqueado · pulsa «Desbloquear» en Padres')
      : (unlocked?'Objetivo diario completado · una partida disponible':`Completa ${D.ajustes?.nivelesDiarios||10} niveles para desbloquear una partida`);
    return `<button class="guardian-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="playGuardianFromAccess()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'⚡':'🔒'}</span><span><b>Duelo de Guardianes</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  window.planetDefenseCard=function(){
    const unlocked=actionAvailable();
    const note=parentMode
      ? (unlocked?'Desbloqueado · disponible en modo Padres':'Bloqueado · pulsa «Desbloquear» en Padres')
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
    grid.insertAdjacentHTML('afterbegin',`<div class="parent-card parent-action-unlock"><h3>⚡ Juegos de acción</h3><p class="muted">Activa este permiso para probar Duelo de Guardianes, Defensa del planeta y Tank Pixel. El permiso permanece activo mientras estés en modo Padres y no se consume al entrar en un juego.</p><button type="button" class="btn ${unlocked?'secondary':'primary'}" onclick="parentUnlockActionGames()">${unlocked?'✓ JUEGOS DESBLOQUEADOS':'🔓 DESBLOQUEAR JUEGOS'}</button>${unlocked?'<small class="muted">Los tres juegos están disponibles. Entrar en uno no bloquea los demás.</small>':''}</div>`);
  };

  /* Al salir de Padres se elimina únicamente el permiso manual de Padres. */
  const previousDisableParentMode=window.disableParentMode;
  window.disableParentMode=function(){
    const access=parentAccess();
    access.available=false;
    save(D);
    if(typeof previousDisableParentMode==='function')previousDisableParentMode();
  };

  save(D);
})();