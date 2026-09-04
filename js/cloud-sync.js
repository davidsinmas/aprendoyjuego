/* V3.9.0 — cuenta familiar y sincronización cloud con Supabase.
 * La clave publishable es apta para cliente web. La seguridad real está en RLS.
 * No se almacena ni utiliza ninguna service/secret key en el juego.
 */
(function(){
  'use strict';
  const SUPABASE_URL='https://wqyvbsnmrpomxoqfxozb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_cbA-5xXZH-VdJGiCxLB-PQ_M6loQAhs';
  const CLOUD_TABLE='game_states';
  const LOAD_MARKER='ludeiko_cloud_last_loaded_at_v1';
  const supabaseClient=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  if(!supabaseClient){console.warn('[Ludeiko] Supabase no disponible. Se mantiene almacenamiento local.');return;}
  let syncing=false,uploadTimer=null,initialized=false,reloadAfterCloudLoad=false;
  const originalSave=window.save;
  const originalParentDashboard=window.parentDashboard;
  function currentState(){try{return typeof D!=='undefined'&&D&&typeof D==='object'?D:null;}catch{return null;}}
  function localSave(state){if(typeof originalSave==='function')originalSave(state);}
  function meaningfulState(state){
    if(!state||typeof state!=='object')return 0;
    const games=Object.values(state.estadisticas||{}).reduce((sum,item)=>sum+Math.max(0,Number(item?.partidas)||0),0);
    return games*1000+Math.max(0,Number(state.totalAciertos)||0)*10+Math.max(1,Number(state.nivelJugador)||1)+Math.max(0,Number(state.diamantes)||0);
  }
  async function uploadNow(){
    const {data}=await supabaseClient.auth.getSession();
    const session=data?.session,state=currentState();
    if(!session||!state||syncing)return;
    const {error}=await supabaseClient.from(CLOUD_TABLE).upsert({user_id:session.user.id,state,updated_at:new Date().toISOString()},{onConflict:'user_id'});
    if(error)console.warn('[Ludeiko] No se pudo sincronizar:',error.message);
  }
  function scheduleUpload(){
    if(!initialized||syncing)return;
    clearTimeout(uploadTimer);
    uploadTimer=setTimeout(()=>uploadNow().catch(error=>console.warn('[Ludeiko] Error de sincronización:',error)),900);
  }
  window.save=function(state){if(typeof originalSave==='function')originalSave(state);scheduleUpload();};
  function setStatus(message,isError=false){const el=document.querySelector('[data-cloud-status]');if(el){el.textContent=message;el.dataset.error=isError?'1':'0';}}
  function escapeHTML(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
  function accountCardHTML(session){
    if(session){
      const email=session.user?.email||'cuenta familiar';
      return `<div class="parent-card ludeiko-cloud-card"><h3>☁️ Cuenta Ludeiko</h3><p class="muted">Sincronización activa. El progreso y los ajustes de Padres se guardan en esta cuenta y estarán disponibles en tus otros dispositivos.</p><p><b>${escapeHTML(email)}</b></p><p class="muted" data-cloud-status>Sincronizado</p><button type="button" class="btn secondary" data-cloud-signout>Cerrar sesión</button></div>`;
    }
    return `<div class="parent-card ludeiko-cloud-card"><h3>☁️ Sincronizar entre dispositivos</h3><p class="muted">Crea una cuenta familiar o inicia sesión para conservar el progreso, la configuración y los juegos activos al cambiar de móvil, tablet u ordenador.</p><form data-cloud-form><label style="display:block;margin:.5rem 0">Correo electrónico<input name="email" type="email" autocomplete="email" required style="display:block;width:100%;box-sizing:border-box;margin-top:.25rem"></label><label style="display:block;margin:.5rem 0">Contraseña<input name="password" type="password" autocomplete="current-password" minlength="6" required style="display:block;width:100%;box-sizing:border-box;margin-top:.25rem"></label><div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem"><button type="submit" class="btn primary">Iniciar sesión</button><button type="button" class="btn secondary" data-cloud-signup>Crear cuenta</button></div><p class="muted" data-cloud-status>El juego seguirá funcionando aunque no inicies sesión.</p></form></div>`;
  }
  function renderAccountCard(){
    const grid=document.querySelector('.parent-grid');if(!grid)return;
    const old=grid.querySelector('.ludeiko-cloud-card');if(old)old.remove();
    supabaseClient.auth.getSession().then(({data})=>{if(!document.querySelector('.parent-grid'))return;grid.insertAdjacentHTML('afterbegin',accountCardHTML(data?.session||null));bindAccountEvents(grid);});
  }
  function bindAccountEvents(root){
    const form=root.querySelector('[data-cloud-form]');
    if(form&&!form.dataset.bound){
      form.dataset.bound='1';
      form.addEventListener('submit',async event=>{event.preventDefault();const email=form.email.value.trim(),password=form.password.value;setStatus('Iniciando sesión…');const {error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)setStatus(error.message,true);});
    }
    const signup=root.querySelector('[data-cloud-signup]');
    if(signup&&!signup.dataset.bound){
      signup.dataset.bound='1';
      signup.addEventListener('click',async()=>{const email=form?.email?.value.trim()||'',password=form?.password?.value||'';if(!email||password.length<6){setStatus('Introduce un correo y una contraseña de al menos 6 caracteres.',true);return;}setStatus('Creando cuenta…');const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{product:'ludeiko'}}});if(error){setStatus(error.message,true);return;}if(data.session)setStatus('Cuenta creada. Sincronización activa.');else setStatus('Cuenta creada. Revisa tu correo para confirmar la cuenta y después inicia sesión.');});
    }
    const signout=root.querySelector('[data-cloud-signout');
    if(signout&&!signout.dataset.bound){signout.dataset.bound='1';signout.addEventListener('click',async()=>{await supabaseClient.auth.signOut();});}
  }
  async function loadCloudState(session){
    if(!session)return;
    syncing=true;
    try{
      const {data,error}=await supabaseClient.from(CLOUD_TABLE).select('state,updated_at').eq('user_id',session.user.id).maybeSingle();
      if(error){console.warn('[Ludeiko] No se pudo leer el progreso cloud:',error.message);return;}
      const local=currentState(),remote=data?.state,loadedMarker=localStorage.getItem(LOAD_MARKER)||'';
      if(remote&&typeof remote==='object'&&Object.keys(remote).length){
        if(data.updated_at===loadedMarker){setStatus('Sincronizado');return;}
        if(meaningfulState(remote)>0||meaningfulState(local)<=0){D=remote;localSave(remote);localStorage.setItem(LOAD_MARKER,data.updated_at||'');reloadAfterCloudLoad=true;}
        else await uploadNow();
      }else await uploadNow();
      setStatus('Sincronizado');
    }finally{syncing=false;}
  }
  async function onAuthChange(event,session){
    if(event==='SIGNED_IN'&&session){setStatus('Sincronizando…');await loadCloudState(session);if(reloadAfterCloudLoad){reloadAfterCloudLoad=false;window.location.reload();return;}}
    if(event==='SIGNED_OUT'){localStorage.removeItem(LOAD_MARKER);setStatus('Sesión cerrada. El juego sigue guardado en este dispositivo.');}
    renderAccountCard();
  }
  supabaseClient.auth.onAuthStateChange((event,session)=>{onAuthChange(event,session).catch(error=>console.warn('[Ludeiko] Error de autenticación:',error));});
  if(typeof originalParentDashboard==='function'){
    window.parentDashboard=function(){originalParentDashboard();renderAccountCard();};
  }
  supabaseClient.auth.getSession().then(async({data})=>{initialized=true;if(data?.session){await loadCloudState(data.session);if(reloadAfterCloudLoad){reloadAfterCloudLoad=false;window.location.reload();}}}).catch(error=>console.warn('[Ludeiko] No se pudo recuperar la sesión:',error));
  window.ludeikoCloud={isConfigured:true,getSession:()=>supabaseClient.auth.getSession(),syncNow:uploadNow};
})();
