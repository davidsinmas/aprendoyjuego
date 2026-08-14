(()=>{
  let context=null,lastShot=0;
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
  function play(name,variant=0){
    switch(name){
      case 'correct':
        tone(430,610,.14,.022,'sine');tone(610,760,.11,.016,'sine',.08);break;
      case 'wrong':tone(230,185,.18,.014,'triangle');break;
      case 'shoot':{
        const stamp=nowMs();if(stamp-lastShot<55)return;lastShot=stamp;
        if(variant==='monster')tone(145,105,.065,.006,'triangle');
        else if(variant==='satellite')tone(520,390,.05,.004,'sine');
        else tone(330,250,.055,.005,'sine');
        break;
      }
      case 'hit':tone(150,78,.19,.021,'triangle');break;
      case 'bonusAppear':tone(470,620,.12,.009,'sine');break;
      case 'bonus':
        tone(390,560,.14,.022,'sine');tone(560,790,.16,.018,'sine',.1);break;
      case 'round':
        tone(330,460,.15,.018,'sine');tone(460,620,.16,.017,'sine',.11);break;
      case 'win':
        tone(360,510,.17,.021,'sine');tone(510,680,.18,.019,'sine',.13);tone(680,820,.2,.017,'sine',.27);break;
      case 'lose':tone(260,180,.28,.016,'triangle');break;
      case 'countdown':tone(300,330,.07,.009,'sine');break;
      case 'meteor':tone(180,125,.09,.008,'triangle');break;
      case 'shield':tone(130,72,.2,.018,'triangle');break;
    }
  }
  window.GameSound={play,resume:audio};
  window.playChime=kind=>play(kind==='ok'?'correct':'wrong');
})();
