/* V3.13.0 — analítica anónima y opcional para mejorar Ludeiko. */
(function(){
  'use strict';
  const SUPABASE_URL='https://wqyvbsnmrpomxoqfxozb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_cbA-5xXZH-VdJGiCxLB-PQ_M6loQAhs';
  const TABLE='telemetry_events';
  const CONSENT_KEY='ludeiko_analytics_consent_v1';
  const INSTALL_KEY='ludeiko_analytics_installation_v1';
  const SESSION_KEY='ludeiko_analytics_session_v1';
  const client=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  const uuid=()=>crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16);});
  function getId(key,session=false){
    const store=session?sessionStorage:localStorage;
    let id=store.getItem(key);
    if(!id){id=uuid();store.setItem(key,id);}
    return id;
  }
  const installationId=getId(INSTALL_KEY),sessionId=getId(SESSION_KEY,true);
  const enabled=()=>localStorage.getItem(CONSENT_KEY)==='yes';
  function cleanText(v,max){if(v===undefined||v===null||v==='')return null;return String(v).slice(0,max);}
  function cleanNumber(v,max=10000){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(max,Math.round(n))):null;}
  function safeMetadata(meta){
    if(!meta||typeof meta!=='object'||Array.isArray(meta))return {};
    const out={};
    for(const [key,value] of Object.entries(meta).slice(0,12)){
      if(!/^[a-zA-Z0-9_]{1,32}$/.test(key))continue;
      if(typeof value==='boolean'||typeof value==='number')out[key]=value;
      else if(typeof value==='string')out[key]=value.slice(0,80);
    }
    return out;
  }
  async function track(eventName,data={}){
    if(!enabled()||!client||!navigator.onLine)return false;
    const row={
      installation_id:installationId,session_id:sessionId,event_name:cleanText(eventName,64),
      game_type:cleanText(data.gameType,48),level_id:cleanText(data.levelId,64),
      duration_ms:cleanNumber(data.durationMs,86400000),correct_count:cleanNumber(data.correct,10000),
      error_count:cleanNumber(data.errors,10000),app_version:cleanText(window.APP_VERSION,24),metadata:safeMetadata(data.metadata)
    };
    if(!row.event_name)return false;
    const {error}=await client.from(TABLE).insert(row);
    if(error){console.warn('[Ludeiko] Analítica:',error.message);return false;}
    return true;
  }
  function setConsent(value){
    localStorage.setItem(CONSENT_KEY,value?'yes':'no');
    if(value)track('analytics_enabled');
    if(typeof window.parentDashboard==='function'&&typeof parentMode!=='undefined'&&parentMode)window.parentDashboard();
  }
  function analyticsCard(){
    const on=enabled();
    return `<div class="parent-card ludeiko-analytics-card"><h3>Estadísticas anónimas</h3><p class="muted">Ayuda a mejorar los juegos enviando únicamente datos de uso y aprendizaje: actividad, nivel, aciertos, errores y duración. No se envían nombre, correo, ubicación ni respuestas escritas.</p><button type="button" class="btn ${on?'secondary':'primary'}" onclick="ludeikoAnalytics.setConsent(${on?'false':'true'})">${on?'DESACTIVAR ESTADÍSTICAS':'ACTIVAR ESTADÍSTICAS'}</button><p class="muted">Estado: <b>${on?'activadas':'desactivadas'}</b></p></div>`;
  }
  const previousParentDashboard=window.parentDashboard;
  if(typeof previousParentDashboard==='function')window.parentDashboard=function(){
    previousParentDashboard();
    const grid=document.querySelector('.parent-grid');if(!grid)return;
    grid.querySelector('.ludeiko-analytics-card')?.remove();
    grid.insertAdjacentHTML('beforeend',analyticsCard());
  };
  window.ludeikoAnalytics={track,setConsent,isEnabled:enabled,installationId};
  if(enabled())track('session_start',{metadata:{platform:'web'}});
})();
