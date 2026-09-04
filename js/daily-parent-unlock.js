/* V3.9.2 — acceso a juegos de acción persistente tras completar los niveles diarios. */
(function(){
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');

  function parentAccess(){
    if(!D.parentActionAccess||typeof D.parentActionAccess!=='object'||D.parentActionAccess.date!==todayKey()){
      D.parentActionAccess={date:todayKey(),available:false};
    }
    D.parentActionAccess.available=!!D.parentActionAccess.available;
    return D.parentActionAccess;
  }

  function levelUnlockActive(){
    const p=D.progresoNivelesDiarios;
    const target=Math.max(10,Math.floor(Number(D.ajustes?.nivelesDiarios)||10));
    return !!(p&&p.fecha===todayKey()&&Array.isArray(p.niveles)&&p.niveles.length>=target);
  }

  function restoreLevelUnlock(){
    if(!levelUnlockActive())return false;
    D.actionAccess={date:todayKey(),available:true,consumed:false};
    if(D.progresoNivelesDiarios)D.progresoNivelesDiarios.desbloqueado=true;
    save(D);
    return true;
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
    if(levelUnlockActive())restoreLevelUnlock();
    return !!D.actionAccess?.available&&!D.actionAccess?.consumed;
  }

  function consumeForActionGame(){
    /* Tras completar los niveles diarios, los tres juegos de acción permanecen disponibles durante el día. */
    if(parentMode||levelUnlockActive())return true;
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
    if(levelUnlockActive())return true;
    return previousAvailable();
  };

  window.guardianDuelCard=function(){
    const unlocked=actionAvailable();
    const note=parentMode
      ? (unlocked?'Desbloqueado · disponible en modo Padres':'Bloqueado · pulsa «Desbloquear» en Padres')
      : (unlocked?'Objetivo conseguido · juegos de acción disponibles hoy':`Completa ${D.ajustes?.nivelesDiarios||10} niveles para desbloquear los juegos de acción`);
    return `<button class="guardian-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="playGuardianFromAccess()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'⚡':'🔒'}</span><span><b>Duelo de Guardianes</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  window.planetDefenseCard=function(){
    const unlocked=actionAvailable();
    const note=parentMode
      ? (unlocked?'Desbloqueado · disponible en modo Padres':'Bloqueado · pulsa «Desbloquear» en Padres')
      : (unlocked?'Objetivo conseguido · juegos de acción disponibles hoy':`Completa ${D.ajustes?.nivelesDiarios||10} niveles para desbloquear los juegos de acción`);
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

  const previousDisableParentMode=window.disableParentMode;
  window.disableParentMode=function(){
    const access=parentAccess();
    access.available=false;
    save(D);
    if(typeof previousDisableParentMode==='function')previousDisableParentMode();
  };

  save(D);
})();