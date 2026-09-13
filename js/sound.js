(()=>{
  let context=null,lastShot=0,lastBounce=0,activeVoice=null;
  const VOICE_BASE='assets/audio/voice/';
  const VOICE_FILES={
    correct:'correct.mp3',
    wrong:'wrong.mp3',
    advance:'advance.mp3',
    corrected:'corrected.mp3',
    rhyme:'rhyme.mp3',
    levelComplete:'level_complete.mp3',
    dailyComplete:'daily_complete.mp3',
    achievement:'achievement.mp3',
    levelUp:'level_up.mp3',
    round:'round.mp3',
    win:'win.mp3',
    lose:'lose.mp3',
    bonus:'bonus.mp3'
  };
  const voiceCache=new Map();
  const voiceURL=file=>`${VOICE_BASE}${file}?v=${encodeURIComponent(window.APP_VERSION||'actual')}`;
  const nowMs=()=>typeof performance!=='undefined'?performance.now():Date.now();
  function audio(){
    try{
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!Audio)return null;
      context=context||new Audio();
      if(context.state==='suspended')context.resume();
      return context;
    }catch{return null;}
  }
  function tone(from,to,duration=.12,volume=.015,type='sine',delay=0){
    const ctx=audio();if(!ctx)return;
    const start=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type=type;osc.frequency.setValueAtTime(Math.max(40,from),start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40,to||from),start+duration);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(gain).connect(ctx.destination);osc.start(start);osc.stop(start+duration+.02);
  }
  function voice(name,fallback){
    const file=VOICE_FILES[name];
    if(!file){fallback?.();return false;}
    try{
      const source=voiceCache.get(name)||new Audio(voiceURL(file));
      if(!voiceCache.has(name)){source.preload='auto';voiceCache.set(name,source);}
      activeVoice?.pause();
      const player=source.cloneNode();
      activeVoice=player;player.volume=.92;
      player.addEventListener('ended',()=>{if(activeVoice===player)activeVoice=null;},{once:true});
      const attempt=player.play();
      if(attempt?.catch)attempt.catch(()=>{if(activeVoice===player)activeVoice=null;fallback?.();});
      return true;
    }catch{
      activeVoice=null;fallback?.();return false;
    }
  }
  function stopVoice(){if(activeVoice){activeVoice.pause();activeVoice.currentTime=0;activeVoice=null;}}
  Object.entries(VOICE_FILES).forEach(([name,file])=>{
    try{const clip=new Audio(voiceURL(file));clip.preload='metadata';voiceCache.set(name,clip);}catch{}
  });
  function play(name,variant=0){
    switch(name){
      case 'correct':
        voice('correct',()=>{
          tone(523,523,.11,.024,'sine');tone(659,659,.12,.021,'sine',.075);tone(784,784,.16,.019,'sine',.15);
        });
        break;
      case 'wrong':
        voice('wrong',()=>{tone(220,165,.15,.019,'triangle');tone(165,120,.19,.016,'triangle',.12);});
        break;
      case 'shoot':{
        const stamp=nowMs();if(stamp-lastShot<55)return;lastShot=stamp;
        if(variant==='monster')tone(145,105,.065,.006,'triangle');
        else if(variant==='satellite')tone(520,390,.05,.004,'sine');
        else if(variant==='laser')tone(720,410,.055,.005,'sine');
        else tone(330,250,.055,.005,'sine');
        break;
      }
      case 'bounce':{
        const stamp=nowMs();if(stamp-lastBounce<90)return;lastBounce=stamp;
        tone(360,440,.035,.0025,'sine');break;
      }
      case 'hit':tone(150,78,.19,.021,'triangle');break;
      case 'bonusAppear':tone(470,620,.12,.009,'sine');break;
      case 'bonus':
        voice('bonus',()=>{tone(390,560,.14,.022,'sine');tone(560,790,.16,.018,'sine',.1);});break;
      case 'round':
        voice('round',()=>{tone(330,460,.15,.018,'sine');tone(460,620,.16,.017,'sine',.11);});break;
      case 'win':
        voice('win',()=>{tone(360,510,.17,.021,'sine');tone(510,680,.18,.019,'sine',.13);tone(680,820,.2,.017,'sine',.27);});break;
      case 'lose':voice('lose',()=>tone(260,180,.28,.016,'triangle'));break;
      case 'advance':case 'corrected':case 'rhyme':case 'levelComplete':case 'dailyComplete':case 'achievement':case 'levelUp':
        voice(name);break;
      case 'countdown':tone(300,330,.07,.009,'sine');break;
      case 'meteor':tone(180,125,.09,.008,'triangle');break;
      case 'shield':tone(130,72,.2,.018,'triangle');break;
    }
  }
  window.GameSound={play,resume:audio,stopVoice};
  window.playChime=kind=>play(kind==='ok'?'correct':'wrong');
})();
