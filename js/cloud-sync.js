/* V3.9.0 — cuenta familiar y sincronización cloud con Supabase. */
(function(){
  'use strict';
  const SUPABASE_URL='https://wqyvbsnmrpomxoqfxozb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_cbA-5xXZH-VdJGiCxLB-PQ_M6loQAhs';
  const CLOUD_TABLE='game_states',LOAD_MARKER='ludeiko_cloud_last_loaded_at_v1';
  const client=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  if(!client){console.warn('[Ludeiko] Supabase no disponible.');return;}
  let syncing=false,timer=null,initialized=false,reloadAfterLoad=false;
  const originalSave=window.save,originalParentDashboard=window.parentDashboard;
  const state=()=>{try{return typeof D!=='undefined'&&D&&typeof D==='object'?D:null;}catch{return null;}};
  const score=d=>{if(!d)return 0;const g=Object.values(d.estadisticas||{}).reduce((s,x)=>s+Math.max(0,Number(x?.partidas)||0),0);return g*1000+Math.max(0,Number(d.totalAciertos)||0)*10+Math.max(1,Number(d.nivelJugador)||1)+Math.max(0,Number(d.diamantes)||0);};
  const localSave=d=>{if(typeof originalSave==='function')originalSave(d);};
  async function upload(){const {data}=await client.auth.getSession(),session=data?.session,d=state();if(!session||!d||syncing)return;const {error}=await client.from(CLOUD_TABLE).upsert({user_id:session.user.id,state:d,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)console.warn('[Ludeiko] Sincronización:',error.message);}
  function queue(){if(!initialized||syncing)return;clearTimeout(timer);timer=setTimeout(()=>upload().catch(console.warn),900);}
  window.save=function(d){if(typeof originalSave==='function')originalSave(d);queue();};
  function status(text,error=false){const e=document.querySelector('[data-cloud-status]');if(e){e.textContent=text;e.dataset.error=error?'1':'0';}}
  function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function card(session){
    if(session){const email=session.user?.email||'cuenta familiar';return `<div class="parent-card ludeiko-cloud-card"><h3>☁️ Cuenta Ludeiko</h3><p class="muted">Sincronización activa. El progreso y los ajustes de Padres se guardan en esta cuenta y estarán disponibles en tus otros dispositivos.</p><p><b>${esc(email)}</b></p><p class="muted" data-cloud-status>Sincronizado</p><button type="button" class="btn secondary" data-cloud-signout>Cerrar sesión</button></div>`;}
    return `<div class="parent-card ludeiko-cloud-card"><h3>☁️ Sincronizar entre dispositivos</h3><p class="muted">Crea una cuenta familiar o inicia sesión para conservar el progreso, la configuración y los juegos activos al cambiar de móvil, tablet u ordenador.</p><form data-cloud-form><label style="display:block;margin:.5rem 0">Correo electrónico<input name="email" type="email" autocomplete="email" required style="display:block;width:100%;box-sizing:border-box;margin-top:.25rem"></label><label style="display:block;margin:.5rem 0">Contraseña<input name="password" type="password" autocomplete="current-password" minlength="6" required style="display:block;width:100%;box-sizing:border-box;margin-top:.25rem"></label><div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem"><button type="submit" class="btn primary">Iniciar sesión</button><button type="button" class="btn secondary" data-cloud-signup>Crear cuenta</button></div><p class="muted" data-cloud-status>El juego seguirá funcionando aunque no inicies sesión.</p></form></div>`;
  }
  function render(){const grid=document.querySelector('.parent-grid');if(!grid)return;const old=grid.querySelector('.ludeiko-cloud-card');if(old)old.remove();client.auth.getSession().then(({data})=>{if(!document.querySelector('.parent-grid'))return;grid.insertAdjacentHTML('afterbegin',card(data?.session||null));bind(grid);});}
  function bind(root){const form=root.querySelector('[data-cloud-form]');if(form&&!form.dataset.bound){form.dataset.bound='1';form.addEventListener('submit',async e=>{e.preventDefault();status('Iniciando sesión…');const {error}=await client.auth.signInWithPassword({email:form.email.value.trim(),password:form.password.value});if(error)status(error.message,true);});}
    const signup=root.querySelector('[data-cloud-signup]');if(signup&&!signup.dataset.bound){signup.dataset.bound='1';signup.addEventListener('click',async()=>{const email=form?.email?.value.trim()||'',password=form?.password?.value||'';if(!email||password.length<6){status('Introduce un correo y una contraseña de al menos 6 caracteres.',true);return;}status('Creando cuenta…');const {data,error}=await client.auth.signUp({email,password,options:{data:{product:'ludeiko'}}});if(error){status(error.message,true);return;}status(data.session?'Cuenta creada. Sincronización activa.':'Cuenta creada. Revisa tu correo para confirmar la cuenta y después inicia sesión.');});}
    const signout=root.querySelector('[data-cloud-signout]');if(signout&&!signout.dataset.bound){signout.dataset.bound='1';signout.addEventListener('click',async()=>{await client.auth.signOut();});}
  }
  async function restore(session){if(!session)return;syncing=true;try{const {data,error}=await client.from(CLOUD_TABLE).select('state,updated_at').eq('user_id',session.user.id).maybeSingle();if(error){console.warn('[Ludeiko] Lectura cloud:',error.message);return;}const local=state(),remote=data?.state,marker=localStorage.getItem(LOAD_MARKER)||'';if(remote&&typeof remote==='object'&&Object.keys(remote).length){if(data.updated_at===marker){status('Sincronizado');return;}if(score(remote)>0||score(local)<=0){D=remote;localSave(remote);localStorage.setItem(LOAD_MARKER,data.updated_at||'');reloadAfterLoad=true;}else{await upload();}}else await upload();status('Sincronizado');}finally{syncing=false;}}
  client.auth.onAuthStateChange((event,session)=>{(async()=>{if(event==='SIGNED_IN'&&session){status('Sincronizando…');await restore(session);if(reloadAfterLoad){reloadAfterLoad=false;location.reload();return;}}if(event==='SIGNED_OUT')localStorage.removeItem(LOAD_MARKER);render();})().catch(e=>console.warn('[Ludeiko] Auth:',e));});
  if(typeof originalParentDashboard==='function')window.parentDashboard=function(){originalParentDashboard();render();};
  client.auth.getSession().then(async({data})=>{initialized=true;if(data?.session){await restore(data.session);if(reloadAfterLoad){reloadAfterLoad=false;location.reload();}}}).catch(e=>console.warn('[Ludeiko] Sesión:',e));
  window.ludeikoCloud={isConfigured:true,getSession:()=>client.auth.getSession(),syncNow:upload};
})();
