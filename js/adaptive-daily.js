/* V3.5.1 · Selección pedagógica adaptativa de siete retos diarios */
(function(){
  'use strict';

  const ADAPTIVE_VERSION=2;
  const TARGET_DAILY_COUNT=7;
  const RECENT_LIMIT=80;
  const RECENT_SKILL_WINDOW=6;
  const DAILY_HISTORY_LIMIT=14;

  function ensureLearningProfile(){
    const current=D.adaptiveLearning&&typeof D.adaptiveLearning==='object'?D.adaptiveLearning:{};
    current.version=ADAPTIVE_VERSION;
    current.recent=Array.isArray(current.recent)?current.recent.filter(entry=>entry&&DAILY_TYPES.includes(entry.type)&&Number(entry.total)>0).slice(-RECENT_LIMIT):[];
    current.dailySelections=Array.isArray(current.dailySelections)?current.dailySelections.filter(entry=>entry&&typeof entry.date==='string'&&Array.isArray(entry.types)).slice(-DAILY_HISTORY_LIMIT):[];
    D.adaptiveLearning=current;
    return current;
  }

  function dayStamp(date){
    const value=new Date(`${date}T12:00:00`).getTime();
    return Number.isFinite(value)?Math.floor(value/86400000):0;
  }

  function daysSince(date,reference){
    if(!date)return 30;
    return Math.max(0,dayStamp(reference)-dayStamp(date));
  }

  function deterministicBias(type,date){
    const source=`${date}:${type}`;
    let hash=2166136261;
    for(let i=0;i<source.length;i++){hash^=source.charCodeAt(i);hash=Math.imul(hash,16777619);}
    return ((hash>>>0)%1000)/250;
  }

  function recentEntries(type){
    return ensureLearningProfile().recent.filter(entry=>entry.type===type).slice(-RECENT_SKILL_WINDOW);
  }

  function aggregateLegacyStats(type){
    const levels=GAME.levels[type]||[];
    return levels.reduce((total,level)=>{
      const s=stats(level.id);
      total.partidas+=Math.max(0,Number(s.partidas)||0);
      total.aciertos+=Math.max(0,Number(s.aciertos)||0);
      total.respuestas+=Math.max(0,Number(s.respuestas)||0);
      return total;
    },{partidas:0,aciertos:0,respuestas:0});
  }

  function skillAccuracy(type){
    const recent=recentEntries(type);
    if(recent.length){
      let weightedHits=0,weightedTotal=0;
      recent.forEach((entry,index)=>{
        const weight=index+1;
        weightedHits+=Math.max(0,Number(entry.hits)||0)*weight;
        weightedTotal+=Math.max(1,Number(entry.total)||1)*weight;
      });
      return weightedTotal?weightedHits/weightedTotal:.74;
    }
    const legacy=aggregateLegacyStats(type);
    return legacy.respuestas?legacy.aciertos/legacy.respuestas:.74;
  }

  function lastPracticeDate(type){
    const recent=recentEntries(type);
    return recent.length?recent[recent.length-1].date:null;
  }

  function selectedDaysAgo(type,date,days){
    const target=dayStamp(date)-days;
    return ensureLearningProfile().dailySelections.some(entry=>dayStamp(entry.date)===target&&entry.types.includes(type));
  }

  function skillPriority(type,date){
    const accuracy=Math.min(1,Math.max(0,skillAccuracy(type)));
    const legacy=aggregateLegacyStats(type);
    const recent=recentEntries(type);
    let score=(1-accuracy)*70;
    if(accuracy<.6)score+=18;
    else if(accuracy<.75)score+=8;
    score+=lastPracticeDate(type)?Math.min(30,daysSince(lastPracticeDate(type),date)*5):28;
    if(!recent.length&&!legacy.respuestas)score+=5;
    if(selectedDaysAgo(type,date,1))score-=18;
    if(selectedDaysAgo(type,date,2))score-=6;
    return score+deterministicBias(type,date);
  }

  dailyTypesForDate=function(date){
    ensureLearningProfile();
    const available=enabledDailyTypes(),target=dailyTargetCount(TARGET_DAILY_COUNT),chosen=[];
    for(const group of DAILY_GROUPS){
      const candidates=group.filter(type=>available.includes(type)&&!chosen.includes(type)).sort((a,b)=>skillPriority(b,date)-skillPriority(a,date));
      if(candidates[0])chosen.push(candidates[0]);
    }
    const remaining=available.filter(type=>!chosen.includes(type)).sort((a,b)=>skillPriority(b,date)-skillPriority(a,date));
    for(const type of remaining){if(chosen.length>=target)break;chosen.push(type);}
    return chosen.slice(0,target);
  };
  function levelEvidence(level){
    const s=stats(level.id);
    if((Number(s.partidas)||0)>0)return true;
    return ensureLearningProfile().recent.some(entry=>entry.levelId===level.id);
  }

  function levelMastered(level){
    const recent=ensureLearningProfile().recent.filter(entry=>entry.levelId===level.id).slice(-4);
    if(recent.length){
      const latest=recent[recent.length-1],latestAccuracy=latest.total?latest.hits/latest.total:0;
      if(latest.total>=3&&latestAccuracy>=.95)return true;
      if(recent.length>=2){
        const totals=recent.reduce((sum,entry)=>({hits:sum.hits+entry.hits,total:sum.total+entry.total}),{hits:0,total:0});
        if(totals.total&&totals.hits/totals.total>=.8)return true;
      }
      return false;
    }
    const s=stats(level.id),partidas=Math.max(0,Number(s.partidas)||0),respuestas=Math.max(0,Number(s.respuestas)||0);
    const accuracy=respuestas?(Math.max(0,Number(s.aciertos)||0)/respuestas):0;
    return (partidas>=2&&accuracy>=.8)||(partidas>=1&&accuracy>=.95);
  }

  dailyLevel=function(type){
    const levels=GAME.levels[type]||[];
    if(!levels.length)return null;
    let highest=-1;
    levels.forEach((level,index)=>{if(levelEvidence(level))highest=index;});
    const frontier=Math.min(levels.length-1,highest+1);
    const start=Math.max(0,frontier-2);
    for(let index=start;index<frontier;index++){
      if(levelEvidence(levels[index])&&!levelMastered(levels[index]))return levels[index];
    }
    if(levelEvidence(levels[frontier])&&!levelMastered(levels[frontier]))return levels[frontier];
    if(highest<levels.length-1)return levels[Math.min(levels.length-1,highest+1)];
    return levels[levels.length-1];
  };

  function recordSkillPerformance(type,hits,total,daily){
    if(!DAILY_TYPES.includes(type)||!Number(total))return;
    const profile=ensureLearningProfile();
    profile.recent.push({
      type,
      levelId:state.level&&state.level.id?state.level.id:null,
      date:today(),
      hits:Math.max(0,Math.min(Number(total)||0,Number(hits)||0)),
      total:Math.max(1,Number(total)||1),
      daily:!!daily
    });
    profile.recent=profile.recent.slice(-RECENT_LIMIT);
    save(D);
  }

  function syncDailySelection(date,types){
    const profile=ensureLearningProfile();
    const clean=[...new Set(types.filter(type=>DAILY_TYPES.includes(type)&&gameEnabled(type)))].slice(0,TARGET_DAILY_COUNT);
    const index=profile.dailySelections.findIndex(entry=>entry.date===date);
    if(index>=0)profile.dailySelections[index]={date,types:clean};
    else profile.dailySelections.push({date,types:clean});
    profile.dailySelections=profile.dailySelections.slice(-DAILY_HISTORY_LIMIT);
  }

  ensureDaily=function(){
    const date=today(),target=dailyTargetCount(TARGET_DAILY_COUNT),sameDay=D.retosDiarios&&D.retosDiarios.fecha===date&&Array.isArray(D.retosDiarios.retos);
    if(!sameDay){
      D.retosDiarios={fecha:date,retos:dailyTypesForDate(date).map(type=>({type,done:false})),premio:false};
      D.actionAccess={date,available:false,consumed:false};
    }else if(D.retosDiarios.retos.length!==target||D.retosDiarios.retos.some(reto=>!gameEnabled(reto.type))){
      const previous=D.retosDiarios.retos.filter(reto=>DAILY_TYPES.includes(reto.type)&&gameEnabled(reto.type)),types=[...new Set(previous.map(reto=>reto.type))];
      for(const type of dailyTypesForDate(date)){if(types.length>=target)break;if(!types.includes(type))types.push(type);}
      for(const type of enabledDailyTypes()){if(types.length>=target)break;if(!types.includes(type))types.push(type);}
      const completed=new Set(previous.filter(reto=>reto.done).map(reto=>reto.type)),rewarded=!!D.retosDiarios.premio;
      D.retosDiarios.retos=types.slice(0,target).map(type=>({type,done:rewarded||completed.has(type)}));
    }
    ensureActionAccess();
    if(D.retosDiarios.premio&&!D.actionAccess.available&&!D.actionAccess.consumed)unlockActionGames('daily');
    syncDailySelection(date,D.retosDiarios.retos.map(reto=>reto.type));
    save(D);
  };
  dailyHTML=function(){
    ensureDaily();
    const r=D.retosDiarios,done=r.retos.filter(x=>x.done).length,target=dailyTargetCount(TARGET_DAILY_COUNT);
    const row=challenge=>{
      const info=DAILY_INFO[challenge.type]||{icon:'🎯',label:challenge.type,time:'2 min'},ok=challenge.done;
      return `<button class="daily-row ${ok?'done locked':''}" ${ok?'disabled aria-disabled="true"':`onclick="startDaily('${challenge.type}')"`}><span>${ok?'🔒 ✅':info.icon} ${info.label}</span><small>${ok?'Completado':info.time}</small></button>`;
    };
    return `<div class="daily-card"><div class="daily-title"><b>🎯 Retos de hoy</b><span>${done}/${target}</span></div>${r.retos.map(row).join('')}<div class="daily-prize">${r.premio?'🎁 Premio diario conseguido · vuelve mañana':`🎁 Completa los ${target}: +10 💎 y +10 XP`}</div></div>`;
  };
  guardianDuelCard=function(){
    const unlocked=actionGamesAvailable(),reward=!!D.actionAccess.available;
    const note=parentMode?'Disponible mientras el modo Padres esté activo':reward?'Premio de hoy · una partida disponible':`Completa los ${dailyTargetCount(TARGET_DAILY_COUNT)} retos de hoy para desbloquear una partida`;
    return `<button class="guardian-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="startGuardianDuel()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'⚡':'🔒'}</span><span><b>Duelo de Guardianes</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  planetDefenseCard=function(){
    const unlocked=actionGamesAvailable(),reward=!!D.actionAccess.available;
    const note=parentMode?'Disponible mientras el modo Padres esté activo':reward?'Premio de hoy · una partida disponible':`Completa los ${dailyTargetCount(TARGET_DAILY_COUNT)} retos de hoy para desbloquear una partida`;
    return `<button class="guardian-home-card planet-home-card ${unlocked?'unlocked':'locked'}" ${unlocked?'onclick="openPlanetDefense()"':'disabled aria-disabled="true"'}><span class="guardian-home-icon">${unlocked?'🌍':'🔒'}</span><span><b>Defensa del planeta</b><small>${note}</small></span><strong>${unlocked?'JUGAR →':'BLOQUEADO'}</strong></button>`;
  };

  const dailyAchievement=ACHIEVEMENTS.find(item=>item.id==='daily_complete');
  if(dailyAchievement)dailyAchievement.desc='Completa los retos diarios';

  const baseFinishDailyActivity=finishDailyActivity;
  finishDailyActivity=function(type,title){
    recordSkillPerformance(type,state.hits,state.total,true);
    return baseFinishDailyActivity(type,title);
  };

  const baseFinish=finish;
  finish=function(){
    if(!state.daily&&(state.type==='suma'||state.type==='resta'))recordSkillPerformance(state.type,state.hits,state.total,false);
    return baseFinish();
  };

  const baseFinishCompare=finishCompare;
  finishCompare=function(){
    if(!state.daily)recordSkillPerformance('comparar',state.hits,state.total,false);
    return baseFinishCompare();
  };

  const baseFinishWords=finishWords;
  finishWords=function(){
    if(!state.daily)recordSkillPerformance('palabras',state.hits,state.total,false);
    return baseFinishWords();
  };

  const baseFinishReading=finishReading;
  finishReading=function(){
    if(!state.daily)recordSkillPerformance(state.type,state.hits,state.total,false);
    return baseFinishReading();
  };

  const baseFinishSoup=finishSoup;
  finishSoup=function(){
    if(!state.daily)recordSkillPerformance('sopa',state.hits,state.qs.length,false);
    return baseFinishSoup();
  };

  ensureDaily();
  home();

  window.AdaptiveDaily={version:ADAPTIVE_VERSION,targetDailyCount:dailyTargetCount(TARGET_DAILY_COUNT),skillPriority,dailyLevel};
})();
