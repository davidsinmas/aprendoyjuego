let differenceDemo=null;

const DIFFERENCE_TOTAL=6;

function differenceScene(side){
  const changed=side==='b',suffix=`dif-${side}`;
  return `<svg class="difference-scene" viewBox="0 0 500 360" role="img" aria-label="Escena ${side==='a'?'A':'B'} del valle">
    <defs>
      <linearGradient id="${suffix}-sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b9e7f4"/><stop offset="1" stop-color="#f5f0cf"/></linearGradient>
      <linearGradient id="${suffix}-grass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#93c77a"/><stop offset="1" stop-color="#60955e"/></linearGradient>
    </defs>
    <rect width="500" height="360" rx="20" fill="url(#${suffix}-sky)"/>
    <circle cx="74" cy="61" r="27" fill="#ffd965" stroke="#e9ad45" stroke-width="3"/>
    <g stroke="#e9ad45" stroke-width="4" stroke-linecap="round">
      <path d="M74 20v-12M74 114v-12M33 61H20M128 61h-13M45 32l-9-9M103 90l9 9M45 90l-9 9"/>
      ${changed?'':'<path d="M103 32l9-9"/>'}
    </g>
    <g fill="#fff" stroke="#dbe5e8" stroke-width="2"><circle cx="276" cy="68" r="23"/><circle cx="306" cy="61" r="30"/>${changed?'':'<circle cx="340" cy="72" r="20"/>'}<rect x="260" y="70" width="98" height="25" rx="13"/></g>
    <path d="M0 235L122 112l76 78 58-60 113 105z" fill="#7391a0"/>
    <path d="M122 112l-30 55 31-17 22 23 18-22 35 39z" fill="#edf5f3"/>
    <path d="M161 147v-35" stroke="#644a3d" stroke-width="4"/><path d="M163 113l27 10-27 11z" fill="${changed?'#f1c84f':'#df6868'}"/>
    <path d="M0 225q98-52 190 3t180 2q76-28 130 4v126H0z" fill="url(#${suffix}-grass)"/>
    <path d="M221 360q12-73 81-121" fill="none" stroke="#e7d2a1" stroke-width="39"/>
    <g><rect x="275" y="196" width="112" height="91" rx="3" fill="#f4d49c" stroke="#8d684e" stroke-width="3"/><path d="M258 202l74-61 74 61z" fill="#b95f55" stroke="#7d4542" stroke-width="3"/><rect x="355" y="155" width="20" height="40" fill="#8b6554"/><circle cx="366" cy="139" r="10" fill="#e7eef0"/><circle cx="378" cy="121" r="7" fill="#eef4f5"/><rect x="319" y="239" width="26" height="48" rx="3" fill="#846448"/>
      ${changed?'<rect x="288" y="216" width="34" height="31" rx="2" fill="#8dd0dc" stroke="#71584a" stroke-width="3"/><path d="M305 216v31M288 231h34" stroke="#fff" stroke-width="2"/>':'<circle cx="305" cy="231" r="18" fill="#8dd0dc" stroke="#71584a" stroke-width="3"/><path d="M305 213v36M287 231h36" stroke="#fff" stroke-width="2"/>'}
    </g>
    <g><rect x="423" y="220" width="17" height="71" rx="7" fill="#77533c"/><circle cx="431" cy="200" r="45" fill="#4f8f57"/><circle cx="404" cy="211" r="29" fill="#5ba063"/><circle cx="454" cy="215" r="29" fill="#55985e"/><circle cx="414" cy="187" r="7" fill="#d9574f"/><circle cx="444" cy="197" r="7" fill="#d9574f"/>${changed?'':'<circle cx="431" cy="224" r="7" fill="#d9574f"/>'}</g>
    <ellipse cx="113" cy="307" rx="78" ry="31" fill="#68bdd0" stroke="#4793ad" stroke-width="3"/><path d="M78 305q18-17 37 0-19 17-37 0z" fill="#f0a64b"/>${changed?'<path d="M79 305l-13-10v20z" fill="#e27f3c"/><circle cx="109" cy="301" r="2.5" fill="#263238"/>':'<path d="M114 305l13-10v20z" fill="#e27f3c"/><circle cx="84" cy="301" r="2.5" fill="#263238"/>'}
    <g fill="#f4e376"><circle cx="214" cy="279" r="5"/><circle cx="233" cy="291" r="5"/><circle cx="205" cy="307" r="5"/></g><g stroke="#557c50" stroke-width="2"><path d="M214 284v13M233 296v13M205 312v13"/></g>
    <g class="difference-targets">
      <rect data-diff="sun" tabindex="0" role="button" aria-label="Diferencia del sol" x="27" y="8" width="103" height="105" rx="20"/>
      <rect data-diff="cloud" tabindex="0" role="button" aria-label="Diferencia de la nube" x="250" y="33" width="116" height="70" rx="20"/>
      <rect data-diff="flag" tabindex="0" role="button" aria-label="Diferencia de la bandera" x="147" y="103" width="50" height="48" rx="12"/>
      <rect data-diff="window" tabindex="0" role="button" aria-label="Diferencia de la ventana" x="280" y="207" width="53" height="51" rx="12"/>
      <rect data-diff="apple" tabindex="0" role="button" aria-label="Diferencia del árbol" x="390" y="164" width="88" height="93" rx="24"/>
      <rect data-diff="fish" tabindex="0" role="button" aria-label="Diferencia del pez" x="57" y="281" width="83" height="48" rx="16"/>
    </g>
  </svg>`;
}

function differencesCard(){
  return `<button id="differencesHomeCard" class="game-card game-differences" onclick="startDifferencesDemo()"><span class="game-icon">🔎</span><b>Encuentra las diferencias</b><small>Prueba · 6 diferencias</small></button>`;
}

function addDifferencesHomeCard(){
  if(document.getElementById('differencesHomeCard'))return;
  const grid=document.querySelector('.game-grid');
  if(grid)grid.insertAdjacentHTML('beforeend',differencesCard());
}

function startDifferencesDemo(){
  differenceDemo={found:new Set()};
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div>
    <div class="differences-heading"><span>PRUEBA</span><h2>Encuentra las 6 diferencias</h2><p>Toca una diferencia en cualquiera de las dos escenas.</p></div>
    <div class="differences-progress"><div id="differencesDots">${Array.from({length:DIFFERENCE_TOTAL},()=>'<i></i>').join('')}</div><b id="differencesCount">0 / ${DIFFERENCE_TOTAL}</b></div>
    <div id="differencesBoard" class="differences-board"><figure><figcaption>ESCENA A</figcaption>${differenceScene('a')}</figure><figure><figcaption>ESCENA B</figcaption>${differenceScene('b')}</figure></div>
    <div id="differencesMessage" class="differences-message">Observa con atención: algunas diferencias son pequeñas.</div>
    <div id="differencesActions" class="differences-actions"><button class="btn secondary" onclick="startDifferencesDemo()">🔄 Repetir escena</button></div>`);
  const board=document.getElementById('differencesBoard');
  if(!board)return;
  board.addEventListener('click',event=>{const target=event.target.closest('[data-diff]');if(target)findDifference(target.dataset.diff);});
  board.addEventListener('keydown',event=>{if(!['Enter',' '].includes(event.key))return;const target=event.target.closest('[data-diff]');if(target){event.preventDefault();findDifference(target.dataset.diff);}});
}

function findDifference(id){
  if(!differenceDemo||differenceDemo.found.has(id))return;
  differenceDemo.found.add(id);
  document.querySelectorAll(`[data-diff="${id}"]`).forEach(element=>element.classList.add('found'));
  const count=differenceDemo.found.size,counter=document.getElementById('differencesCount'),dots=document.querySelectorAll('#differencesDots i');
  if(counter)counter.textContent=`${count} / ${DIFFERENCE_TOTAL}`;
  dots.forEach((dot,index)=>dot.classList.toggle('found',index<count));
  window.GameSound?.play(count===DIFFERENCE_TOTAL?'win':'correct');
  const message=document.getElementById('differencesMessage'),actions=document.getElementById('differencesActions');
  if(count===DIFFERENCE_TOTAL){
    if(message)message.innerHTML='<b>🎉 ¡Has encontrado las seis diferencias!</b>';
    if(actions)actions.innerHTML='<button class="btn primary" onclick="startDifferencesDemo()">🔄 Jugar otra vez</button><button class="btn secondary" onclick="home()">⌂ Volver al menú</button>';
  }else if(message)message.textContent=`¡Bien! Te quedan ${DIFFERENCE_TOTAL-count}.`;
}

const differencesOriginalHome=window.home;
if(typeof differencesOriginalHome==='function'){
  window.home=function(){const result=differencesOriginalHome();addDifferencesHomeCard();return result;};
}
addDifferencesHomeCard();
