/* V3.15.6 — analítica anónima, opcional y sincronizada con la cuenta. */
(function(){
  'use strict';
  const TABLE='telemetry_events';
  const CONSENT_KEY='ludeiko_analytics_consent_v1';
  const INSTALL_KEY='ludeiko_analytics_installation_v1';
  const SESSION_KEY='ludeiko_analytics_session_v1';
  const client=window.ludeikoCloud?.getClient?.();
  const uuid=()=>crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16);});
  function getId(key,session=false){
    const store=session?sessionStorage:localStorage;
    let id=store.getItem(key);
    if(!id){id=uuid();store.setItem(key,id);}
    return id;
  }
  const installationId=getId(INSTALL_KEY),sessionId=getId(SESSION_KEY,true);
  let activity=null,sessionTracked=false,consentMigration=false;

  function settings(){
    try{
      if(typeof D==='undefined'||!D||typeof D!=='object')return null;
      D.ajustes=D.ajustes&&typeof D.ajustes==='object'?D.ajustes:{};
      return D.ajustes;
    }catch{return null;}
  }
  function migrateConsent(){
    const current=settings();
    if(!current)return false;
    const stored=localStorage.getItem(CONSENT_KEY);
    if(typeof current.analyticsEnabled!=='boolean'){
      current.analyticsEnabled=stored==='yes';
      localStorage.setItem(CONSENT_KEY,current.analyticsEnabled?'yes':'no');
      if(!consentMigration&&typeof window.save==='function'){
        consentMigration=true;
        window.save(D);
        consentMigration=false;
      }
    }else localStorage.setItem(CONSENT_KEY,current.analyticsEnabled?'yes':'no');
    return current.analyticsEnabled;
  }
  const enabled=()=>migrateConsent();
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
  function trackSession(){
    if(sessionTracked||!enabled())return;
    sessionTracked=true;
    track('session_start',{metadata:{platform:'web'}});
  }
  function setConsent(value){
    const on=!!value,current=settings();
    localStorage.setItem(CONSENT_KEY,on?'yes':'no');
    if(current){current.analyticsEnabled=on;if(typeof window.save==='function')window.save(D);}
    if(on){track('analytics_enabled');trackSession();}
    renderCard();
  }
  function analyticsCard(){
    const on=enabled();
    return `<div class="parent-card ludeiko-analytics-card"><button type="button" class="parent-option-row parent-toggle-button ${on?'on':'off'}" onclick="ludeikoAnalytics.setConsent(${on?'false':'true'})" aria-pressed="${on}"><span class="parent-option-copy"><b>Estadísticas anónimas</b><small>Actividad, nivel, aciertos, errores y duración; nunca datos personales.</small></span><span class="parent-switch-ui" aria-hidden="true"><i></i></span></button></div>`;
  }
  function renderCard(){
    const grid=document.querySelector('.parent-grid');if(!grid)return;
    grid.querySelector('.ludeiko-analytics-card')?.remove();
    const target=grid.querySelector('[data-parent-section="account"] .parent-section-body')||grid;
    target.insertAdjacentHTML('beforeend',analyticsCard());
  }

  function begin(gameType,level,daily=false,metadata={}){
    activity={gameType:cleanText(gameType,48),levelId:cleanText(level?.id??level,64),startedAt:Date.now(),daily:!!daily,metadata:safeMetadata(metadata)};
  }
  function finishActivity({gameType=null,levelId=null,correct=null,total=null,metadata={}}={}){
    const current=activity||{},hits=cleanNumber(correct,10000),count=cleanNumber(total,10000);
    track('activity_complete',{
      gameType:gameType||current.gameType,levelId:levelId||current.levelId,
      durationMs:current.startedAt?Date.now()-current.startedAt:null,correct:hits,
      errors:hits!==null&&count!==null?Math.max(0,count-hits):null,
      metadata:{...current.metadata,...safeMetadata(metadata),daily:!!current.daily}
    });
    activity=null;
  }
  function currentState(){try{return typeof state!=='undefined'?state:null;}catch{return null;}}
  function wrapStart(name,details){
    const original=window[name];if(typeof original!=='function')return;
    window[name]=function(){const info=details.apply(this,arguments)||{};begin(info.gameType,info.level,info.daily,info.metadata);return original.apply(this,arguments);};
  }
  function wrapFinish(name){
    const original=window[name];if(typeof original!=='function')return;
    window[name]=function(){
      const current=currentState();
      if(current&&!current.daily)finishActivity({gameType:current.type,levelId:current.level?.id,correct:current.hits,total:current.total??current.qs?.length});
      return original.apply(this,arguments);
    };
  }
  wrapStart('startMath',(type,level,daily)=>({gameType:type,level,daily}));
  wrapStart('startCompare',(level,daily)=>({gameType:'comparar',level,daily}));
  wrapStart('startWords',(level,daily)=>({gameType:'palabras',level,daily}));
  wrapStart('startReadingGame',(type,level,daily)=>({gameType:type,level,daily}));
  wrapStart('startSoup',(level,daily)=>({gameType:'sopa',level,daily}));
  ['finish','finishCompare','finishWords','finishReading','finishSoup'].forEach(wrapFinish);

  const originalDaily=window.finishDailyActivity;
  if(typeof originalDaily==='function')window.finishDailyActivity=function(type,title){
    const current=currentState();
    finishActivity({gameType:type,levelId:current?.level?.id,correct:current?.hits,total:current?.total??current?.qs?.length,metadata:{attempt:'daily'}});
    return originalDaily.apply(this,arguments);
  };
  const originalPedagogyStart=window.startPedagogyPractice;
  if(typeof originalPedagogyStart==='function')window.startPedagogyPractice=function(step){begin('pedagogia_restas',`mision${step}`,false,{unit:'puente_del_10'});return originalPedagogyStart.apply(this,arguments);};
  const originalPedagogyFinish=window.finishPedagogyStep;
  if(typeof originalPedagogyFinish==='function')window.finishPedagogyStep=function(){
    try{finishActivity({gameType:'pedagogia_restas',levelId:`mision${pedagogyState.step}`,correct:pedagogyState.hits,total:pedagogyState.questions.length,metadata:{unit:'puente_del_10'}});}catch(e){}
    return originalPedagogyFinish.apply(this,arguments);
  };
  const originalDifferencesStart=window.startDifferencesGame;
  if(typeof originalDifferencesStart==='function')window.startDifferencesGame=function(scene){const number=Number(scene)||D?.diferencias?.actual||1;begin('diferencias',`escena${number}`);return originalDifferencesStart.apply(this,arguments);};
  const originalDifferencesFinish=window.finishDifferenceScene;
  if(typeof originalDifferencesFinish==='function')window.finishDifferenceScene=function(){
    try{finishActivity({gameType:'diferencias',levelId:`escena${differenceGame.scene}`,correct:differenceGame.found.size,total:6});}catch(e){}
    return originalDifferencesFinish.apply(this,arguments);
  };

  const previousParentDashboard=window.parentDashboard;
  if(typeof previousParentDashboard==='function')window.parentDashboard=function(){const result=previousParentDashboard.apply(this,arguments);renderCard();return result;};
  window.addEventListener('ludeiko:settings-synced',()=>setTimeout(()=>{migrateConsent();renderCard();trackSession();},0));
  const observer=new MutationObserver(()=>{if(document.querySelector('.parent-grid')&&!document.querySelector('.ludeiko-analytics-card'))renderCard();});
  const app=document.getElementById('app');if(app)observer.observe(app,{childList:true,subtree:true});

  window.ludeikoAnalytics={track,setConsent,isEnabled:enabled,installationId,renderCard};
  migrateConsent();
  trackSession();
})();
