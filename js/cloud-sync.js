/* V3.15.3 — progreso y opciones sincronizados entre dispositivos. */
(function(){
  'use strict';
  const SUPABASE_URL='https://wqyvbsnmrpomxoqfxozb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_cbA-5xXZH-VdJGiCxLB-PQ_M6loQAhs';
  const AUTH_REDIRECT_URL='https://davidsinmas.github.io/aprendoyjuego/';
  const CLOUD_TABLE='game_states',SETTINGS_TABLE='user_settings';
  const LOAD_MARKER='ludeiko_cloud_last_loaded_at_v2',DIRTY_MARKER='ludeiko_cloud_local_changed_at_v1';
  const SETTINGS_LOAD_MARKER='ludeiko_settings_last_loaded_at_v1',SETTINGS_DIRTY_MARKER='ludeiko_settings_local_changed_at_v1';
  const GAME_VERSION='3.15.4',DATA_VERSION=20;
  const client=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  if(!client){console.warn('[Ludeiko] Supabase no disponible.');return;}

  let syncing=false,settingsSyncing=false,timer=null,initialized=false,reloading=false,lastSessionId='',retryTimer=null,settingsChannel=null;
  const originalSave=window.save,originalParentDashboard=window.parentDashboard;
  const state=()=>{try{return typeof D!=='undefined'&&D&&typeof D==='object'?D:null;}catch{return null;}};
  const now=()=>new Date().toISOString();
  const localSave=d=>{if(typeof originalSave==='function')originalSave(d);};
  const settingsOf=d=>d?.ajustes&&typeof d.ajustes==='object'?d.ajustes:{};
  const settingsHash=d=>JSON.stringify(settingsOf(d));
  let lastSettingsHash=settingsHash(state());

  function status(text,error=false){
    const e=document.querySelector('[data-cloud-status]');
    if(e){e.textContent=text;e.dataset.error=error?'1':'0';}
  }
  function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function markDirty(d){
    if(!initialized||syncing||settingsSyncing)return;
    const stamp=now(),nextHash=settingsHash(d);
    localStorage.setItem(DIRTY_MARKER,stamp);
    if(nextHash!==lastSettingsHash){
      lastSettingsHash=nextHash;
      localStorage.setItem(SETTINGS_DIRTY_MARKER,stamp);
    }
  }
  function scheduleRetry(){
    if(!initialized||!navigator.onLine)return;
    clearTimeout(retryTimer);
    retryTimer=setTimeout(()=>synchronize().catch(console.warn),2500);
  }

  async function uploadSettings(session,d,force=false){
    if(!session||!d||(!force&&!localStorage.getItem(SETTINGS_DIRTY_MARKER)))return true;
    const {data,error}=await client.from(SETTINGS_TABLE)
      .upsert({user_id:session.user.id,settings:settingsOf(d)},{onConflict:'user_id'})
      .select('updated_at').single();
    if(error){console.warn('[Ludeiko] Sincronización de opciones:',error.message);return false;}
    localStorage.setItem(SETTINGS_LOAD_MARKER,data?.updated_at||now());
    localStorage.removeItem(SETTINGS_DIRTY_MARKER);
    lastSettingsHash=settingsHash(d);
    return true;
  }

  async function upload(force=false){
    const {data}=await client.auth.getSession(),session=data?.session,d=state();
    if(!session||!d||(syncing&&!force))return false;
    if(!navigator.onLine){scheduleRetry();return false;}
    const stamp=now();
    d.versionDatos=Math.max(DATA_VERSION,Number(d.versionDatos)||DATA_VERSION);
    const {error}=await client.from(CLOUD_TABLE).upsert({user_id:session.user.id,state:d,updated_at:stamp},{onConflict:'user_id'});
    if(error){console.warn('[Ludeiko] Sincronización:',error.message);scheduleRetry();return false;}
    if(!await uploadSettings(session,d,false)){scheduleRetry();return false;}
    localStorage.setItem(LOAD_MARKER,stamp);
    localStorage.removeItem(DIRTY_MARKER);
    status('Sincronizado en todos tus dispositivos');
    return true;
  }

  function queue(){
    if(!initialized||syncing||settingsSyncing)return;
    clearTimeout(timer);
    timer=setTimeout(()=>upload().catch(console.warn),900);
  }
  window.save=function(d){
    if(typeof originalSave==='function')originalSave(d);
    markDirty(d);
    queue();
  };

  function refreshSettingsScreen(){
    window.dispatchEvent(new CustomEvent('ludeiko:settings-synced',{detail:{settings:settingsOf(state())}}));
    if(document.querySelector('.parent-grid')&&typeof originalParentDashboard==='function'){
      originalParentDashboard();
      render();
    }
  }

  async function pullSettings(session,{createIfMissing=true}={}){
    if(!session||settingsSyncing||!navigator.onLine)return false;
    settingsSyncing=true;
    try{
      const {data,error}=await client.from(SETTINGS_TABLE).select('settings,updated_at').eq('user_id',session.user.id).maybeSingle();
      if(error){console.warn('[Ludeiko] Lectura de opciones:',error.message);return false;}
      const d=state();
      if(!d)return false;
      if(!data?.settings||typeof data.settings!=='object'){
        return createIfMissing?await uploadSettings(session,d,true):false;
      }
      const remoteTime=data.updated_at||'',loadedTime=localStorage.getItem(SETTINGS_LOAD_MARKER)||'';
      const dirtyTime=localStorage.getItem(SETTINGS_DIRTY_MARKER)||'';
      const remoteStamp=Date.parse(remoteTime)||0,loadedStamp=Date.parse(loadedTime)||0,dirtyStamp=Date.parse(dirtyTime)||0;
      if(dirtyTime&&dirtyStamp>loadedStamp&&dirtyStamp>remoteStamp)return await uploadSettings(session,d,true);
      if(!loadedTime||remoteStamp>loadedStamp||settingsHash(d)!==JSON.stringify(data.settings)){
        d.ajustes=data.settings;
        localSave(d);
        lastSettingsHash=settingsHash(d);
        localStorage.setItem(SETTINGS_LOAD_MARKER,remoteTime||now());
        localStorage.removeItem(SETTINGS_DIRTY_MARKER);
        refreshSettingsScreen();
      }
      return true;
    }finally{settingsSyncing=false;}
  }

  async function restore(session){
    if(!session||syncing||!navigator.onLine)return false;
    syncing=true;
    try{
      const {data,error}=await client.from(CLOUD_TABLE).select('state,updated_at').eq('user_id',session.user.id).maybeSingle();
      if(error){console.warn('[Ludeiko] Lectura cloud:',error.message);status('No se ha podido sincronizar ahora.',true);return false;}
      const local=state(),remote=data?.state,remoteTime=data?.updated_at||'',lastLoaded=localStorage.getItem(LOAD_MARKER)||'',localDirty=localStorage.getItem(DIRTY_MARKER)||'';
      if(!remote||typeof remote!=='object'||!Object.keys(remote).length){
        syncing=false;await upload(true);syncing=true;
      }else{
        const remoteStamp=Date.parse(remoteTime)||0,dirtyStamp=Date.parse(localDirty)||0,loadedStamp=Date.parse(lastLoaded)||0;
        if(localDirty&&dirtyStamp>loadedStamp&&dirtyStamp>remoteStamp){
          syncing=false;await upload(true);syncing=true;
        }else if(remoteStamp>loadedStamp||!lastLoaded){
          D=remote;
          D.versionDatos=Math.max(DATA_VERSION,Number(D.versionDatos)||DATA_VERSION);
          localSave(D);
          lastSettingsHash=settingsHash(D);
          localStorage.setItem(LOAD_MARKER,remoteTime||now());
          localStorage.removeItem(DIRTY_MARKER);
          reloading=true;
        }
      }
      await pullSettings(session);
      status('Sincronizado en todos tus dispositivos');
      return true;
    }finally{syncing=false;}
  }

  async function synchronize(){
    if(!initialized||!navigator.onLine)return false;
    const {data}=await client.auth.getSession(),session=data?.session;
    if(!session)return false;
    const changed=await restore(session);
    if(reloading){reloading=false;location.reload();return true;}
    if(localStorage.getItem(DIRTY_MARKER)||localStorage.getItem(SETTINGS_DIRTY_MARKER))await upload();
    return changed;
  }

  function unsubscribeSettings(){
    if(settingsChannel){client.removeChannel(settingsChannel);settingsChannel=null;}
  }
  function subscribeSettings(session){
    unsubscribeSettings();
    if(!session)return;
    settingsChannel=client.channel('ludeiko-settings-'+session.user.id)
      .on('postgres_changes',{event:'*',schema:'public',table:SETTINGS_TABLE,filter:'user_id=eq.'+session.user.id},payload=>{
        const remoteTime=payload?.new?.updated_at||'',loadedTime=localStorage.getItem(SETTINGS_LOAD_MARKER)||'';
        if((Date.parse(remoteTime)||0)>(Date.parse(loadedTime)||0))pullSettings(session).catch(console.warn);
      })
      .subscribe();
  }

  function card(session){
    if(session){const email=session.user?.email||'cuenta familiar';return `<div class="parent-card ludeiko-cloud-card"><h3>☁️ Cuenta Ludeiko</h3><p class="muted">Sincronización activa. El progreso y todas las opciones se guardan en esta cuenta y se actualizan en tus otros dispositivos.</p><p><b>${esc(email)}</b></p><p class="muted" data-cloud-status>Sincronizado en todos tus dispositivos</p><button type="button" class="btn secondary" data-cloud-sync>Sincronizar ahora</button><button type="button" class="btn secondary" data-cloud-signout>Cerrar sesión</button></div>`;}
    return `<div class="parent-card ludeiko-cloud-card"><h3>☁️ Sincronizar entre dispositivos</h3><p class="muted">Crea una cuenta familiar o inicia sesión para conservar el progreso, todas las opciones y los juegos activos al cambiar de móvil, tablet u ordenador.</p><form data-cloud-form><label style="display:block;margin:.5rem 0">Correo electrónico<input name="email" type="email" autocomplete="email" required style="display:block;width:100%;box-sizing:border-box;margin-top:.25rem"></label><label style="display:block;margin:.5rem 0">Contraseña<input name="password" type="password" autocomplete="current-password" minlength="6" required style="display:block;width:100%;box-sizing:border-box;margin-top:.25rem"></label><div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem"><button type="submit" class="btn primary">Iniciar sesión</button><button type="button" class="btn secondary" data-cloud-signup>Crear cuenta</button></div><p class="muted" data-cloud-status>El juego seguirá funcionando aunque no inicies sesión.</p></form></div>`;
  }
  function render(){
    const grid=document.querySelector('.parent-grid');if(!grid)return;
    const old=grid.querySelector('.ludeiko-cloud-card');if(old)old.remove();
    client.auth.getSession().then(({data})=>{
      const current=document.querySelector('.parent-grid');if(!current)return;
      current.insertAdjacentHTML('afterbegin',card(data?.session||null));bind(current);
    });
  }
  function bind(root){
    const form=root.querySelector('[data-cloud-form]');
    if(form&&!form.dataset.bound){form.dataset.bound='1';form.addEventListener('submit',async e=>{e.preventDefault();status('Iniciando sesión…');const {error}=await client.auth.signInWithPassword({email:form.email.value.trim(),password:form.password.value});if(error)status(error.message,true);});}
    const signup=root.querySelector('[data-cloud-signup]');
    if(signup&&!signup.dataset.bound){signup.dataset.bound='1';signup.addEventListener('click',async()=>{const email=form?.email?.value.trim()||'',password=form?.password?.value||'';if(!email||password.length<6){status('Introduce un correo y una contraseña de al menos 6 caracteres.',true);return;}status('Creando cuenta…');const {data,error}=await client.auth.signUp({email,password,options:{data:{product:'ludeiko'},emailRedirectTo:AUTH_REDIRECT_URL}});if(error){status(error.message,true);return;}status(data.session?'Cuenta creada. Sincronización activa.':'Cuenta creada. Revisa tu correo para confirmar la cuenta y después inicia sesión.');});}
    const syncButton=root.querySelector('[data-cloud-sync]');
    if(syncButton&&!syncButton.dataset.bound){syncButton.dataset.bound='1';syncButton.addEventListener('click',async()=>{status('Sincronizando…');await synchronize();render();});}
    const signout=root.querySelector('[data-cloud-signout]');
    if(signout&&!signout.dataset.bound){signout.dataset.bound='1';signout.addEventListener('click',async()=>{await client.auth.signOut();});}
  }

  function clearSession(){
    unsubscribeSettings();
    for(const key of [LOAD_MARKER,DIRTY_MARKER,SETTINGS_LOAD_MARKER,SETTINGS_DIRTY_MARKER])localStorage.removeItem(key);
    lastSessionId='';
  }
  function processSession(session,event){
    if(event==='SIGNED_OUT'){clearSession();render();return;}
    if(!session)return;
    const id=session.user.id;
    if(id===lastSessionId&&!reloading){render();return;}
    lastSessionId=id;
    subscribeSettings(session);
    setTimeout(async()=>{try{status('Sincronizando…');await restore(session);if(reloading){reloading=false;location.reload();return;}render();}catch(e){console.warn('[Ludeiko] Auth:',e);}},0);
  }

  window.addEventListener('online',()=>{status('Conexión recuperada. Sincronizando…');clearTimeout(retryTimer);synchronize().catch(console.warn);});
  window.addEventListener('offline',()=>status('Sin conexión. Los cambios se guardarán y se sincronizarán al recuperar internet.'));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&initialized)synchronize().catch(console.warn);});
  window.addEventListener('pagehide',()=>{if(initialized&&(localStorage.getItem(DIRTY_MARKER)||localStorage.getItem(SETTINGS_DIRTY_MARKER)))upload().catch(()=>{});});
  client.auth.onAuthStateChange((event,session)=>{if(initialized)processSession(session,event);});
  if(typeof originalParentDashboard==='function')window.parentDashboard=function(){originalParentDashboard();render();};
  client.auth.getSession().then(async({data})=>{
    initialized=true;
    lastSettingsHash=settingsHash(state());
    if(data?.session){
      lastSessionId=data.session.user.id;
      subscribeSettings(data.session);
      await restore(data.session);
      if(reloading){reloading=false;location.reload();return;}
      render();
    }
  }).catch(e=>console.warn('[Ludeiko] Sesión:',e));
  setInterval(()=>{if(initialized&&navigator.onLine&&document.visibilityState==='visible')synchronize().catch(console.warn);},30000);
  window.ludeikoCloud={isConfigured:true,getSession:()=>client.auth.getSession(),syncNow:()=>synchronize(),gameVersion:GAME_VERSION,dataVersion:DATA_VERSION};
})();
// Compatibilidad con el validador histórico del actualizador: versionDatos:20
