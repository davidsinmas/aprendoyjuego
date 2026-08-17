let differenceGame=null;

const DIFFERENCE_TOTAL=6;
const DIFFERENCE_SCENES=50;
const DIFFERENCE_PALETTES=[
  {sky:'#b9e7f4',ground:'#79ae68',accent:'#e05d55',accent2:'#f2c94c'},
  {sky:'#f7d6a6',ground:'#8bbd73',accent:'#6b7fd7',accent2:'#f08a5d'},
  {sky:'#ccebd9',ground:'#62a77c',accent:'#d66b96',accent2:'#f6c85f'},
  {sky:'#d8d0f2',ground:'#7896c5',accent:'#d96c4f',accent2:'#f2d86b'},
  {sky:'#bcd9f5',ground:'#70a58a',accent:'#8a62c7',accent2:'#f2a84b'}
];

function differenceTargetLayer(items){
  return `<g class="difference-targets">${items.map(item=>`<rect data-diff="${item[0]}" tabindex="0" role="button" aria-label="${item[1]}" x="${item[2]}" y="${item[3]}" width="${item[4]}" height="${item[5]}" rx="${item[6]||14}"/>`).join('')}</g>`;
}

function valleyTheme(changed,v,p){
  const appleY=187+(v%3)*5;
  return{label:'Valle',art:`
    <rect width="500" height="360" rx="20" fill="${p.sky}"/><circle cx="72" cy="62" r="28" fill="#ffd866" stroke="#e6ad42" stroke-width="3"/>
    <g stroke="#e6ad42" stroke-width="4" stroke-linecap="round"><path d="M72 19V8M72 116v-11M29 62H17M126 62h-12M42 32l-9-9M102 92l9 9M42 92l-9 9"/>${changed?'':'<path d="M102 32l9-9"/>'}</g>
    <g fill="#fff" stroke="#d8e5e8" stroke-width="2"><circle cx="276" cy="67" r="22"/><circle cx="307" cy="60" r="29"/>${changed?'':'<circle cx="340" cy="72" r="20"/>'}<rect x="258" y="69" width="101" height="25" rx="13"/></g>
    <path d="M0 232L123 111l75 78 61-62 112 105z" fill="#7593a5"/><path d="M123 111l-29 55 30-16 22 23 18-22 34 38z" fill="#f1f6f4"/>
    <path d="M161 148v-37" stroke="#654b3f" stroke-width="4"/><path d="M163 113l29 10-29 12z" fill="${changed?p.accent2:p.accent}"/>
    <path d="M0 224q97-50 191 4t179 2q77-28 130 4v126H0z" fill="${p.ground}"/><path d="M222 360q12-73 82-122" fill="none" stroke="#ead4a2" stroke-width="38"/>
    <g><rect x="274" y="195" width="114" height="93" rx="4" fill="#f3d39d" stroke="#805f48" stroke-width="3"/><path d="M257 202l75-62 75 62z" fill="${p.accent}" stroke="#75423f" stroke-width="3"/><rect x="319" y="239" width="27" height="49" rx="3" fill="#856348"/>${changed?'<rect x="288" y="214" width="35" height="32" rx="2" fill="#8dd0dc" stroke="#705548" stroke-width="3"/><path d="M305 214v32M288 230h35" stroke="#fff" stroke-width="2"/>':'<circle cx="305" cy="230" r="18" fill="#8dd0dc" stroke="#705548" stroke-width="3"/><path d="M305 212v36M287 230h36" stroke="#fff" stroke-width="2"/>'}</g>
    <g><rect x="423" y="220" width="17" height="73" rx="7" fill="#76523b"/><circle cx="431" cy="201" r="46" fill="#4f8e57"/><circle cx="404" cy="211" r="29" fill="#5b9f63"/><circle cx="455" cy="214" r="29" fill="#55975e"/><circle cx="414" cy="${appleY}" r="7" fill="#d9564e"/><circle cx="445" cy="${appleY+10}" r="7" fill="#d9564e"/>${changed?'':`<circle cx="431" cy="${appleY+37}" r="7" fill="#d9564e"/>`}</g>
    <ellipse cx="112" cy="307" rx="79" ry="31" fill="#68bdd0" stroke="#478fa9" stroke-width="3"/><path d="M78 305q18-17 37 0-19 17-37 0z" fill="#efa449"/>${changed?'<path d="M79 305l-13-10v20z" fill="#db7937"/><circle cx="108" cy="301" r="2.5" fill="#263238"/>':'<path d="M114 305l13-10v20z" fill="#db7937"/><circle cx="84" cy="301" r="2.5" fill="#263238"/>'}
    <g fill="#f4e376"><circle cx="208" cy="285" r="5"/><circle cx="233" cy="299" r="5"/><circle cx="199" cy="316" r="5"/></g>`,targets:[['sun','Diferencia del sol',18,7,111,110],['cloud','Diferencia de la nube',250,30,116,72],['flag','Diferencia de la bandera',145,101,54,51],['window','Diferencia de la ventana',278,207,57,53],['apple','Diferencia del árbol',388,158,91,104],['fish','Diferencia del pez',55,278,87,53]]};
}

function spaceTheme(changed,v,p){
  const starX=205+v*6;
  return{label:'Espacio',art:`
    <rect width="500" height="360" rx="20" fill="#102f61"/><circle cx="430" cy="67" r="38" fill="${p.accent2}"/>${changed?'':`<ellipse cx="430" cy="67" rx="57" ry="12" fill="none" stroke="#ef8eb8" stroke-width="8" transform="rotate(-12 430 67)"/>`}
    <g fill="#ffd85e"><path d="M${starX} 30l4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z"/><path d="M279 70l4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z"/><path d="M342 31l4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z"/>${changed?'':`<path d="M${starX+26} 104l4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z"/>`}</g>
    <path d="M0 267q92-46 189-5t183 1q73-31 128 3v94H0z" fill="#c6cbd4"/><g fill="#a7adb9"><ellipse cx="44" cy="313" rx="18" ry="7"/><ellipse cx="228" cy="290" rx="24" ry="9"/><ellipse cx="462" cy="322" rx="20" ry="8"/></g>
    <g><path d="M53 218V90q0-53 49-70 49 17 49 70v128z" fill="#f7f3e9" stroke="#53657a" stroke-width="3"/><path d="M53 91h98" stroke="${p.accent}" stroke-width="21"/><path d="M53 185l-28 39 30-8M151 185l28 39-30-8" fill="${p.accent}" stroke="#53657a" stroke-width="3"/>${changed?'<path d="M102 111l22 35H80z" fill="#74c4e6" stroke="#40576f" stroke-width="4"/>':'<circle cx="102" cy="129" r="24" fill="#74c4e6" stroke="#40576f" stroke-width="4"/>'}</g>
    <g><rect x="185" y="218" width="77" height="64" rx="15" fill="#dfe8ed" stroke="#4f6271" stroke-width="3"/><rect x="197" y="232" width="53" height="26" rx="6" fill="#183d55"/><circle cx="207" cy="270" r="6" fill="#e95e55"/><circle cx="229" cy="270" r="6" fill="#f2c94c"/><path d="M223 218v-28" stroke="#4f6271" stroke-width="5"/>${changed?'<path d="M223 184l9 9-9 9-9-9z" fill="#f2c94c"/>':'<circle cx="223" cy="187" r="9" fill="#75c46b"/>'}<path d="M185 246l-25 18M262 246l25 18" stroke="#4f6271" stroke-width="7"/></g>
    <g><ellipse cx="329" cy="215" rx="54" ry="65" fill="#77c968"/><circle cx="312" cy="205" r="10" fill="#fff"/><circle cx="346" cy="205" r="10" fill="#fff"/>${changed?'':'<circle cx="329" cy="187" r="10" fill="#fff"/>'}<g fill="#20323b"><circle cx="312" cy="205" r="4"/><circle cx="346" cy="205" r="4"/>${changed?'':'<circle cx="329" cy="187" r="4"/>'}</g><path d="M308 231q21 19 42 0" fill="none" stroke="#315e37" stroke-width="4"/></g>
    <g><circle cx="410" cy="232" r="32" fill="#f4d0ad"/><path d="M378 228q7-42 32-42t32 42" fill="#f3f5f8" stroke="#738395" stroke-width="5"/><rect x="385" y="262" width="53" height="71" rx="17" fill="#f3f5f8" stroke="#738395" stroke-width="3"/><rect x="366" y="270" width="20" height="53" rx="7" fill="${changed?'#4a91d1':p.accent}"/></g>`,targets:[['rocket','Diferencia de la nave',48,82,109,91],['planet','Diferencia del planeta',367,18,126,99],['alien','Diferencia del alienígena',270,144,118,140],['robot','Diferencia del robot',175,176,97,115],['astronaut','Diferencia del astronauta',360,180,89,157],['stars','Diferencia de las estrellas',180,17,115,121]]};
}

function farmTheme(changed,v,p){
  return{label:'Granja',art:`
    <rect width="500" height="360" rx="20" fill="${p.sky}"/><path d="M0 216q118-61 240 0t260 0v144H0z" fill="${p.ground}"/>
    <g><rect x="265" y="113" width="184" height="150" fill="#c95643" stroke="#7c4939" stroke-width="3"/><path d="M242 126l115-85 116 85z" fill="#684b40" stroke="#4d3933" stroke-width="3"/><rect x="326" y="183" width="61" height="80" fill="#f5e3c3"/><path d="M326 183l61 80M387 183l-61 80" stroke="#9b5647" stroke-width="8"/>${changed?'<rect x="332" y="121" width="45" height="39" fill="#f2e6c7" stroke="#744639" stroke-width="4"/><path d="M354 121v39M332 140h45" stroke="#744639" stroke-width="3"/>':'<circle cx="354" cy="141" r="22" fill="#f2e6c7" stroke="#744639" stroke-width="4"/><path d="M354 119v44M332 141h44" stroke="#744639" stroke-width="3"/>'}</g>
    <g><rect x="64" y="134" width="14" height="89" rx="6" fill="#76513a"/><circle cx="70" cy="104" r="53" fill="#5c9c55"/><circle cx="35" cy="116" r="31" fill="#69aa60"/><circle cx="104" cy="115" r="31" fill="#65a45b"/><circle cx="45" cy="88" r="8" fill="#df564d"/><circle cx="84" cy="77" r="8" fill="#df564d"/>${changed?'':'<circle cx="103" cy="116" r="8" fill="#df564d"/>'}</g>
    <g><rect x="59" y="243" width="128" height="49" rx="12" fill="${p.accent}" stroke="#603d34" stroke-width="3"/><rect x="113" y="217" width="51" height="34" rx="7" fill="#8fd0de" stroke="#526977" stroke-width="3"/><circle cx="85" cy="296" r="24" fill="#34434a"/><circle cx="166" cy="296" r="31" fill="#34434a"/>${changed?'<circle cx="73" cy="259" r="10" fill="#ffe06a"/>':'<g fill="#ffe06a"><circle cx="73" cy="259" r="10"/><circle cx="99" cy="259" r="10"/></g>'}</g>
    <g><path d="M229 183v132" stroke="#72513b" stroke-width="8"/><path d="M190 217h79" stroke="#72513b" stroke-width="8"/><circle cx="229" cy="181" r="24" fill="#f0c993"/><path d="M196 217l23 18M262 217l-23 18" stroke="#e39b45" stroke-width="8"/>${changed?'':'<path d="M193 168q36-31 73 0z" fill="#e7b34c" stroke="#795b3e" stroke-width="3"/><rect x="184" y="165" width="90" height="8" rx="4" fill="#e7b34c"/>'}</g>
    <g><ellipse cx="337" cy="310" rx="57" ry="33" fill="#f3a5a8" stroke="#8c5a59" stroke-width="3"/><circle cx="383" cy="298" r="25" fill="#f3a5a8" stroke="#8c5a59" stroke-width="3"/><ellipse cx="395" cy="304" rx="14" ry="10" fill="#ef858c"/>${changed?'':'<ellipse cx="329" cy="305" rx="17" ry="12" fill="#9c654b"/>'}</g>
    <g><ellipse cx="232" cy="309" rx="29" ry="34" fill="#f3e5c4"/><circle cx="237" cy="282" r="21" fill="#f3e5c4"/><path d="M217 329q-33 5-43-19 27-17 51-1z" fill="${changed?'#3c8d63':'#3e72b9'}"/><path d="M236 279l19 8-19 7z" fill="#e39a38"/></g>`,targets:[['barn','Diferencia del granero',320,109,70,62],['apple','Diferencia del manzano',20,50,111,112],['tractor','Diferencia del tractor',53,231,61,50],['scarecrow','Diferencia del espantapájaros',178,146,102,68],['pig','Diferencia del cerdito',279,273,82,66],['rooster','Diferencia del gallo',168,270,76,72]]};
}

function oceanTheme(changed,v,p){
  return{label:'Fondo marino',art:`
    <rect width="500" height="360" rx="20" fill="#45b7d8"/><path d="M0 300q90-32 179 0t171 1q79-29 150 1v58H0z" fill="#e8cf93"/><g fill="none" stroke="#bdebf3" stroke-width="3" opacity=".8"><circle cx="44" cy="60" r="9"/><circle cx="463" cy="92" r="12"/><circle cx="326" cy="42" r="7"/><circle cx="188" cy="173" r="6"/></g>
    <g><path d="M42 122q0-58 71-58h75q51 0 72 49-20 50-72 50h-75q-71 0-71-41z" fill="#f1bd39" stroke="#6c6b5f" stroke-width="3"/><path d="M43 100l-31-20v66l31-18z" fill="#ef9d32"/>${changed?'<g fill="#80d1e5" stroke="#536b79" stroke-width="3"><circle cx="105" cy="113" r="17"/><circle cx="153" cy="113" r="17"/><circle cx="201" cy="113" r="17"/></g>':'<g fill="#80d1e5" stroke="#536b79" stroke-width="3"><circle cx="116" cy="113" r="18"/><circle cx="178" cy="113" r="18"/></g>'}</g>
    <g><ellipse cx="351" cy="151" rx="53" ry="42" fill="${changed?'#e79043':'#609c54'}" stroke="#476b4a" stroke-width="3"/><circle cx="407" cy="146" r="26" fill="#85c56f"/><path d="M324 180l-18 25M373 185l16 26" stroke="#85c56f" stroke-width="17" stroke-linecap="round"/><path d="M318 130l67 43M315 160l66-39" stroke="#4e7c48" stroke-width="3" opacity=".7"/></g>
    <g><circle cx="213" cy="245" r="35" fill="#9870cb"/><path d="M188 266q-13 45-37 22M202 272q-3 49-25 40M220 274q10 43-5 51M235 266q29 37 43 13" fill="none" stroke="#9870cb" stroke-width="17" stroke-linecap="round"/>${changed?'':'<path d="M178 214q35-35 70 0z" fill="${p.accent}" stroke="#5e486d" stroke-width="3"/><circle cx="213" cy="204" r="7" fill="${p.accent2}"/>'}</g>
    <g transform="translate(57 214)"><path d="M0 18q27-25 55 0-28 25-55 0z" fill="#f5dc72" stroke="#5b6470" stroke-width="3"/>${changed?'<path d="M4 18l-17-13v26z" fill="#ef9d32"/><circle cx="45" cy="14" r="3" fill="#263238"/>':'<path d="M51 18l17-13v26z" fill="#ef9d32"/><circle cx="10" cy="14" r="3" fill="#263238"/>'}<path d="M18 0v36M36 1v34" stroke="#425a78" stroke-width="8"/></g>
    <path d="M78 307l8-20 8 20 22 1-17 13 6 21-19-12-19 12 7-21-18-13z" fill="${changed?'#9b6ad1':'#f2c84b'}"/>
    <g>${changed?'<rect x="344" y="278" width="111" height="62" rx="7" fill="#8a5c35" stroke="#5c3a27" stroke-width="4"/><path d="M344 278q55-42 111 0" fill="#a67340" stroke="#5c3a27" stroke-width="4"/>':'<rect x="344" y="294" width="111" height="46" rx="7" fill="#8a5c35" stroke="#5c3a27" stroke-width="4"/><path d="M344 294h111l-9-35h-92z" fill="#a67340" stroke="#5c3a27" stroke-width="4"/><g fill="#ffd75a"><circle cx="373" cy="286" r="8"/><circle cx="397" cy="281" r="8"/><circle cx="421" cy="287" r="8"/></g>'}</g>`,targets:[['submarine','Diferencia del submarino',36,59,230,112],['turtle','Diferencia de la tortuga',294,103,142,107],['octopus','Diferencia del pulpo',146,188,137,141],['fish','Diferencia del pez',39,205,91,64],['starfish','Diferencia de la estrella de mar',51,279,74,74],['chest','Diferencia del cofre',336,244,128,104]]};
}

function castleTheme(changed,v,p){
  return{label:'Castillo',art:`
    <rect width="500" height="360" rx="20" fill="${p.sky}"/><path d="M0 246q93-47 191 0t186-3q71-30 123 4v113H0z" fill="${p.ground}"/>
    <g fill="#d8c9aa" stroke="#756b5d" stroke-width="3"><rect x="160" y="105" width="177" height="151"/><rect x="125" y="83" width="65" height="173"/><rect x="307" y="83" width="65" height="173"/></g><g fill="${p.accent}" stroke="#70423d" stroke-width="3"><path d="M117 85l40-57 40 57z"/><path d="M299 85l40-57 40 57z"/></g>
    <path d="M157 29V8" stroke="#5f4b3e" stroke-width="4"/>${changed?'<path d="M159 10h47v24h-47z" fill="#e45650"/>':'<path d="M159 10l48 13-48 14z" fill="#e45650"/>'}<rect x="222" y="190" width="54" height="66" rx="26" fill="#6f523e"/>
    <g fill="#33434b">${changed?'<rect x="143" y="112" width="18" height="30" rx="8"/><rect x="143" y="165" width="18" height="30" rx="8"/>':'<rect x="143" y="100" width="18" height="30" rx="8"/><rect x="143" y="147" width="18" height="30" rx="8"/><rect x="143" y="194" width="18" height="30" rx="8"/>'}</g>
    <g><ellipse cx="386" cy="236" rx="67" ry="44" fill="#66b45e"/><circle cx="431" cy="201" r="33" fill="#66b45e"/>${changed?'<path d="M435 173l13-18 7 25" fill="'+p.accent2+'" stroke="#49683d" stroke-width="3"/>':'<path d="M409 178l7-22 13 19M435 173l13-18 7 25" fill="'+p.accent2+'" stroke="#49683d" stroke-width="3"/>'}<path d="M449 209q19 6 26-5" fill="none" stroke="#3f623d" stroke-width="4"/><path d="M349 248l-31 30M386 265l8 28" stroke="#66b45e" stroke-width="19" stroke-linecap="round"/></g>
    <g><circle cx="77" cy="245" r="24" fill="#f0c99d"/><path d="M52 239q5-36 25-36t25 36" fill="#9da9b0"/><rect x="52" y="269" width="51" height="61" rx="12" fill="#aab5bb"/><path d="M94 268l39 19-28 46-31-20z" fill="#356eaf" stroke="#e6e6d3" stroke-width="4"/>${changed?'<circle cx="104" cy="289" r="11" fill="#f4d254"/>':'<path d="M104 278l4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z" fill="#f4d254"/>'}</g>
    <g><rect x="189" y="296" width="12" height="35" fill="#eee2c3"/><path d="M174 299q21-40 42 0z" fill="${changed?'#8c67c5':'#d95c55'}" stroke="#6c4b42" stroke-width="3"/></g>
    <g transform="translate(275 311)"><path d="M0 10q18-15 37 0-19 15-37 0z" fill="#ef9f42"/>${changed?'<path d="M3 10l-12-8v16z"/><circle cx="29" cy="7" r="2"/>':'<path d="M34 10l12-8v16z"/><circle cx="7" cy="7" r="2"/>'}</g>`,targets:[['flag','Diferencia de la bandera',148,5,68,44],['windows','Diferencia de las ventanas',132,91,38,145],['dragon','Diferencia del dragón',401,145,65,56],['shield','Diferencia del escudo',70,267,68,70],['mushroom','Diferencia de la seta',168,267,56,73],['fish','Diferencia del pez',259,299,69,42]]};
}

function jungleTheme(changed,v,p){
  return{label:'Jungla',art:`
    <rect width="500" height="360" rx="20" fill="#9ed9bd"/><path d="M0 250q110-48 213 0t183-4q61-25 104 6v108H0z" fill="#4c9a65"/><g fill="#2f7651"><circle cx="34" cy="91" r="62"/><circle cx="472" cy="85" r="68"/><circle cx="165" cy="52" r="45"/></g>
    <g><rect x="332" y="145" width="116" height="108" fill="#d5a95c" stroke="#775d3a" stroke-width="4"/><path d="M314 152l76-69 77 69z" fill="#8a603d"/>${changed?'<rect x="371" y="196" width="38" height="57" rx="18" fill="#644834"/>':'<rect x="371" y="196" width="38" height="57" fill="#644834"/>'}</g>
    <g><path d="M54 0q12 91 64 160" fill="none" stroke="#6c4a31" stroke-width="12"/><circle cx="126" cy="161" r="32" fill="#9a6b42"/><circle cx="105" cy="147" r="13" fill="#9a6b42"/><circle cx="147" cy="147" r="13" fill="#9a6b42"/><ellipse cx="126" cy="166" rx="19" ry="15" fill="#e0b77d"/>${changed?'':'<path d="M157 166q34-21 50 2-23 13-50-2z" fill="#f3d34e"/><path d="M184 158l11-7" stroke="#7d5a2f" stroke-width="4"/>'}</g>
    <g><ellipse cx="266" cy="104" rx="29" ry="39" fill="#db5a52"/><circle cx="274" cy="74" r="24" fill="#f0c94e"/><path d="M294 76l24 9-24 10z" fill="#e58e37"/><path d="M243 101q-35 8-39 38 32 0 49-15z" fill="${changed?p.accent2:'#3c79bb'}"/></g>
    <path d="M210 145q32 65 2 144" fill="none" stroke="#83d7e8" stroke-width="37"/><path d="M196 145q18 65 2 144M224 145q18 65 2 144" fill="none" stroke="#d9f5f7" stroke-width="5" opacity="${changed?0:.9}"/>
    <g><path d="M284 293q47-35 94 0-47 35-94 0z" fill="#72bd62" stroke="#3d7443" stroke-width="4"/>${changed?'<path d="M306 274l8 18M338 266l7 18" stroke="#e4d14b" stroke-width="7"/>':'<path d="M303 276l7 18M328 269l7 18M351 275l7 18" stroke="#e4d14b" stroke-width="7"/>'}</g>
    <g transform="translate(75 284)"><circle cx="24" cy="24" r="10" fill="#f0b94d"/>${changed?'<g fill="#f5e7e3"><circle cx="24" cy="5" r="10"/><circle cx="43" cy="24" r="10"/><circle cx="24" cy="43" r="10"/><circle cx="5" cy="24" r="10"/></g>':'<g fill="#f5e7e3"><circle cx="24" cy="5" r="10"/><circle cx="42" cy="14" r="10"/><circle cx="38" cy="36" r="10"/><circle cx="10" cy="36" r="10"/><circle cx="6" cy="14" r="10"/></g>'}</g>`,targets:[['hut','Diferencia de la cabaña',354,183,70,75],['monkey','Diferencia del mono',91,128,116,64],['parrot','Diferencia del loro',196,60,83,90],['waterfall','Diferencia de la cascada',180,135,76,159],['snake','Diferencia de la serpiente',279,257,105,72],['flower','Diferencia de la flor',67,275,67,70]]};
}

function cityTheme(changed,v,p){
  return{label:'Ciudad',art:`
    <rect width="500" height="360" rx="20" fill="${p.sky}"/><rect y="264" width="500" height="96" fill="#69737b"/><path d="M0 315h500" stroke="#f4d35e" stroke-width="8" stroke-dasharray="45 28"/>
    <g><rect x="22" y="91" width="105" height="173" fill="#d98b65"/><rect x="145" y="57" width="112" height="207" fill="#809bc0"/><rect x="278" y="105" width="98" height="159" fill="#e1b45e"/><rect x="397" y="74" width="83" height="190" fill="#8aa982"/><g fill="#e8f1dc">${[42,77,164,204,297,335,415,449].map((x,i)=>`<rect x="${x}" y="${122+(i%2)*48}" width="22" height="31"/>`).join('')}</g>${changed?'':'<path d="M201 57V23M188 23h26" stroke="#53606a" stroke-width="5"/>'}</g>
    <g><rect x="42" y="207" width="18" height="91" fill="#4a5158"/><rect x="27" y="176" width="48" height="76" rx="20" fill="#303b43"/><circle cx="51" cy="194" r="11" fill="#e45a53"/><circle cx="51" cy="216" r="11" fill="#f0c74d"/>${changed?'':'<circle cx="51" cy="238" r="11" fill="#68b869"/>'}</g>
    <g><rect x="113" y="268" width="181" height="64" rx="14" fill="${p.accent}" stroke="#3f4d58" stroke-width="4"/><circle cx="153" cy="332" r="18" fill="#28343d"/><circle cx="255" cy="332" r="18" fill="#28343d"/>${changed?'<g fill="#9ed8eb"><rect x="140" y="279" width="40" height="25"/><rect x="194" y="279" width="40" height="25"/></g>':'<g fill="#9ed8eb"><rect x="130" y="279" width="36" height="25"/><rect x="178" y="279" width="36" height="25"/><rect x="226" y="279" width="36" height="25"/></g>'}</g>
    <g><circle cx="340" cy="215" r="30" fill="#f3eee0" stroke="#5b6570" stroke-width="5"/><path d="M340 215V194M340 215l${changed?'-16 10':'17 0'}" stroke="#384550" stroke-width="5" stroke-linecap="round"/><rect x="335" y="245" width="10" height="39" fill="#5b6570"/></g>
    <g><circle cx="439" cy="184" r="28" fill="${changed?p.accent2:p.accent}"/><path d="M439 212q-10 29 4 55" fill="none" stroke="#6d5a4c" stroke-width="3"/></g>
    <g><ellipse cx="364" cy="322" rx="28" ry="19" fill="#9b765d"/><circle cx="386" cy="309" r="15" fill="#9b765d"/><path d="M377 297l4-14 9 12M393 297l8-13 4 17" fill="#9b765d"/>${changed?'<path d="M339 320q-28-6-24 20" fill="none" stroke="#9b765d" stroke-width="9"/>':'<path d="M339 320q-28 7-18 27" fill="none" stroke="#9b765d" stroke-width="9"/>'}</g>`,targets:[['antenna','Diferencia de la antena',175,14,54,51],['traffic','Diferencia del semáforo',20,168,62,94],['bus','Diferencia del autobús',111,267,185,69],['clock','Diferencia del reloj',305,180,70,71],['balloon','Diferencia del globo',405,151,68,121],['cat','Diferencia del gato',305,281,99,70]]};
}

function dinosaurTheme(changed,v,p){
  return{label:'Dinosaurios',art:`
    <rect width="500" height="360" rx="20" fill="${p.sky}"/><path d="M0 235q90-51 185 1t178-2q82-31 137 5v121H0z" fill="${p.ground}"/>
    <g><path d="M35 174L113 49l77 125z" fill="#7e6b66"/><path d="M84 95q28 21 58 0" fill="none" stroke="#e46a4f" stroke-width="15"/>${changed?'<g fill="#d8d8d8"><circle cx="100" cy="43" r="18"/><circle cx="127" cy="25" r="14"/></g>':'<g fill="#d8d8d8"><circle cx="94" cy="45" r="17"/><circle cx="121" cy="27" r="15"/><circle cx="145" cy="43" r="13"/></g>'}</g>
    <g><ellipse cx="278" cy="240" rx="87" ry="52" fill="#68aa5f"/><path d="M340 220q37-95 78-75 26 13 17 40-9 27-46 25l-17 39z" fill="#68aa5f"/><path d="M205 242q-54 2-64-35 43-17 82 9z" fill="#68aa5f"/><path d="M251 281l-8 42M309 282l12 41" stroke="#68aa5f" stroke-width="24" stroke-linecap="round"/><g fill="#e2c64f"><circle cx="252" cy="217" r="10"/><circle cx="285" cy="202" r="10"/>${changed?'':'<circle cx="318" cy="221" r="10"/>'}</g></g>
    <g fill="#f4e5c6" stroke="#8d755a" stroke-width="3"><ellipse cx="78" cy="308" rx="18" ry="28"/><ellipse cx="119" cy="308" rx="18" ry="28"/>${changed?'':'<ellipse cx="160" cy="308" rx="18" ry="28"/>'}</g>
    <g><rect x="443" y="188" width="16" height="112" fill="#73513a"/><path d="M451 188q-41-36-72-7 36 15 72 7M451 188q40-39 67-4-34 15-67 4" fill="#4f9959"/>${changed?'<circle cx="441" cy="191" r="8" fill="#7f5637"/>':'<circle cx="441" cy="191" r="8" fill="#7f5637"/><circle cx="461" cy="190" r="8" fill="#7f5637"/>'}</g>
    <g transform="translate(278 68)"><path d="M0 17q41-37 82 0-41 14-82 0z" fill="#ba6c55"/>${changed?'<path d="M6 17l-18-11v22z"/><circle cx="69" cy="13" r="3"/>':'<path d="M76 17l18-11v22z"/><circle cx="12" cy="13" r="3"/>'}</g>
    <path d="M0 347q80-35 164 0t168 0q82-34 168 0v13H0z" fill="#5ab3cd"/><path d="M370 344q18-15 37 0-19 15-37 0z" fill="${changed?p.accent:p.accent2}"/>`,targets:[['volcano','Diferencia del volcán',72,8,98,104],['dinosaur','Diferencia del dinosaurio',232,187,106,61],['eggs','Diferencia de los huevos',52,275,136,71],['palm','Diferencia de la palmera',411,166,85,67],['flying','Diferencia del dinosaurio volador',257,49,122,52],['river','Diferencia del pez',354,328,69,30]]};
}

function pirateTheme(changed,v,p){
  return{label:'Piratas',art:`
    <rect width="500" height="360" rx="20" fill="${p.sky}"/><path d="M0 265q91-29 178 0t166 0q78-30 156 0v95H0z" fill="#55adcc"/>
    <g><path d="M61 233q109 49 214 0l-25 65H87z" fill="#865532" stroke="#513722" stroke-width="4"/><path d="M162 61v177" stroke="#65442d" stroke-width="8"/><path d="M166 72q71 24 0 104z" fill="#f4e5c2" stroke="#765b44" stroke-width="3"/>${changed?'<path d="M177 99h48" stroke="#d45d50" stroke-width="10"/>':'<path d="M177 99h48M172 129h38" stroke="#d45d50" stroke-width="10"/>'}</g>
    <g><circle cx="340" cy="198" r="27" fill="#efc395"/><path d="M307 194q7-49 34-49t35 49" fill="#333b4b"/><rect x="309" y="229" width="64" height="84" rx="14" fill="${p.accent}"/><path d="M330 229l10 20 11-20" fill="#f3e4c4"/>${changed?'<circle cx="341" cy="171" r="10" fill="#f1d35e"/>':'<path d="M341 158l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="#f1d35e"/>'}</g>
    <g><rect x="391" y="272" width="90" height="56" rx="6" fill="#8c5e35" stroke="#583b25" stroke-width="4"/><path d="M391 272q44-37 90 0" fill="#a8733e" stroke="#583b25" stroke-width="4"/><g fill="#ffd55b"><circle cx="414" cy="267" r="7"/><circle cx="433" cy="262" r="7"/><circle cx="451" cy="267" r="7"/>${changed?'':'<circle cx="469" cy="263" r="7"/>'}</g></g>
    <g><ellipse cx="315" cy="76" rx="27" ry="38" fill="${changed?'#4e9a62':'#4e78bb'}"/><circle cx="322" cy="48" r="20" fill="#e6c64e"/><path d="M339 50l25 9-25 10z" fill="#e98e38"/></g>
    <g><path d="M12 340q78-94 155 0" fill="#e4cd91"/><rect x="87" y="259" width="12" height="67" fill="#765038"/><path d="M93 263q-38-31-63-3 32 12 63 3M93 263q35-33 61-3-30 13-61 3M93 263q-7-41 27-45 5 32-27 45${changed?'':'M93 263q-23-40-45-23 13 27 45 23'}" fill="#4c9658"/></g>
    <path d="M207 78V34" stroke="#5e4435" stroke-width="5"/>${changed?'<rect x="209" y="36" width="50" height="25" fill="#303640"/>':'<path d="M209 36l52 13-52 15z" fill="#303640"/>'}`,targets:[['sail','Diferencia de la vela',162,67,78,115],['pirate','Diferencia del sombrero pirata',305,143,75,52],['chest','Diferencia del tesoro',386,246,101,88],['parrot','Diferencia del loro',283,26,86,93],['island','Diferencia de la palmera',22,214,143,96],['flag','Diferencia de la bandera',198,29,72,43]]};
}

function winterTheme(changed,v,p){
  return{label:'Nieve',art:`
    <rect width="500" height="360" rx="20" fill="#9ccbe3"/><path d="M0 246q93-49 188 0t184-2q72-27 128 6v110H0z" fill="#eef5f5"/><g fill="#fff"><circle cx="58" cy="44" r="5"/><circle cx="194" cy="82" r="5"/><circle cx="309" cy="42" r="5"/><circle cx="460" cy="102" r="5"/></g>
    <g><rect x="289" y="155" width="152" height="110" fill="#b77750" stroke="#674a38" stroke-width="4"/><path d="M267 162l98-78 100 78z" fill="${p.accent}"/><rect x="348" y="207" width="38" height="58" fill="#694b38"/><rect x="399" y="104" width="28" height="49" fill="#745445"/>${changed?'':'<g fill="#e7e8e9"><circle cx="414" cy="90" r="15"/><circle cx="428" cy="68" r="12"/></g>'}</g>
    <g><circle cx="116" cy="244" r="50" fill="#fff" stroke="#c8d8de" stroke-width="3"/><circle cx="116" cy="170" r="36" fill="#fff" stroke="#c8d8de" stroke-width="3"/><path d="M116 170l42 8-42 8z" fill="#ec953c"/><circle cx="104" cy="160" r="4"/><circle cx="126" cy="160" r="4"/><g fill="#4d5961"><circle cx="116" cy="220" r="6"/><circle cx="116" cy="244" r="6"/>${changed?'':'<circle cx="116" cy="268" r="6"/>'}</g></g>
    <g><path d="M190 301h99q-9 31-45 31h-44z" fill="${p.accent}" stroke="#765347" stroke-width="4"/><path d="M198 302v-38M228 302v-38${changed?'':'M258 302v-38'}" stroke="#765347" stroke-width="7"/><path d="M187 334h112" stroke="#765347" stroke-width="5"/></g>
    <g><ellipse cx="339" cy="311" rx="31" ry="42" fill="#354653"/><ellipse cx="339" cy="318" rx="19" ry="28" fill="#f1eee1"/><circle cx="339" cy="273" r="23" fill="#354653"/><path d="M339 277l24 8-24 8z" fill="#e6a43b"/><path d="M311 292h58" stroke="${changed?'#437fc2':'#df5b54'}" stroke-width="10"/></g>
    <g><path d="M427 291l34-91 34 91z" fill="#3f8959"/><path d="M437 259h48" stroke="#315f44" stroke-width="5"/><g fill="#edc84e"><circle cx="455" cy="234" r="7"/><circle cx="470" cy="263" r="7"/>${changed?'':'<circle cx="446" cy="275" r="7"/>'}</g></g>
    <circle cx="58" cy="70" r="31" fill="#f3e4a1"/><g fill="#fff4bd"><path d="M142 40l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/><path d="M209 31l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/>${changed?'':'<path d="M260 66l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/>'}</g>`,targets:[['smoke','Diferencia del humo',389,50,60,69],['snowman','Diferencia del muñeco de nieve',91,203,52,86],['sled','Diferencia del trineo',185,254,109,86],['penguin','Diferencia del pingüino',303,267,72,50],['tree','Diferencia del árbol de Navidad',422,196,75,101],['stars','Diferencia de las estrellas',126,21,154,76]]};
}

const DIFFERENCE_THEMES=[valleyTheme,spaceTheme,farmTheme,oceanTheme,castleTheme,jungleTheme,cityTheme,dinosaurTheme,pirateTheme,winterTheme];

function differenceScene(side,sceneNumber){
  const changed=side==='b',themeIndex=(sceneNumber-1)%DIFFERENCE_THEMES.length,variant=Math.floor((sceneNumber-1)/DIFFERENCE_THEMES.length),palette=DIFFERENCE_PALETTES[variant],suffix=`dif-${sceneNumber}-${side}`;
  const scene=DIFFERENCE_THEMES[themeIndex](changed,variant,palette);
  return `<svg class="difference-scene" viewBox="0 0 500 360" role="img" aria-label="Escena ${side==='a'?'A':'B'}: ${scene.label}"><defs><filter id="${suffix}-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".16"/></filter></defs><g filter="url(#${suffix}-shadow)">${scene.art}</g>${differenceTargetLayer(scene.targets)}</svg>`;
}

function ensureDifferenceProgress(){
  if(!D.diferencias||typeof D.diferencias!=='object')D.diferencias={actual:1,completadas:0};
  D.diferencias.completadas=Math.min(DIFFERENCE_SCENES,Math.max(0,Math.floor(Number(D.diferencias.completadas)||0)));
  D.diferencias.actual=Math.min(DIFFERENCE_SCENES,Math.max(1,Math.floor(Number(D.diferencias.actual)||D.diferencias.completadas+1)));
  return D.diferencias;
}

function differencesCard(){
  const progress=ensureDifferenceProgress();
  return `<button id="differencesHomeCard" class="game-card game-differences" onclick="startDifferencesGame()"><span class="game-icon">🔎</span><b>Encuentra las diferencias</b><small>Escena ${progress.actual} de ${DIFFERENCE_SCENES}</small><small>${progress.completadas} completadas · 6 diferencias</small></button>`;
}

function addDifferencesHomeCard(){
  if(document.getElementById('differencesHomeCard'))return;
  const grid=document.querySelector('.game-grid');
  if(grid)grid.insertAdjacentHTML('beforeend',differencesCard());
}

function startDifferencesGame(sceneNumber){
  const progress=ensureDifferenceProgress(),scene=Math.min(DIFFERENCE_SCENES,Math.max(1,Math.floor(Number(sceneNumber)||progress.actual)));
  differenceGame={scene,found:new Set(),complete:false};
  const theme=DIFFERENCE_THEMES[(scene-1)%DIFFERENCE_THEMES.length](false,Math.floor((scene-1)/10),DIFFERENCE_PALETTES[Math.floor((scene-1)/10)]).label;
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div>
    <div class="differences-heading"><span>ESCENA ${scene} DE ${DIFFERENCE_SCENES}</span><h2>Encuentra las 6 diferencias</h2><p>${theme} · toca una diferencia en cualquiera de las dos imágenes.</p></div>
    <div class="differences-progress"><div id="differencesDots">${Array.from({length:DIFFERENCE_TOTAL},()=>'<i></i>').join('')}</div><b id="differencesCount">0 / ${DIFFERENCE_TOTAL}</b></div>
    <div id="differencesBoard" class="differences-board"><figure><figcaption>ESCENA A</figcaption>${differenceScene('a',scene)}</figure><figure><figcaption>ESCENA B</figcaption>${differenceScene('b',scene)}</figure></div>
    <div id="differencesMessage" class="differences-message">Observa con atención: las seis diferencias tienen una dificultad intermedia.</div>
    <div id="differencesActions" class="differences-actions"><button class="btn secondary" onclick="startDifferencesGame(${scene})">🔄 Reiniciar escena</button></div>`);
  const board=document.getElementById('differencesBoard');
  if(!board)return;
  board.addEventListener('click',event=>{const target=event.target.closest('[data-diff]');if(target)findDifference(target.dataset.diff);});
  board.addEventListener('keydown',event=>{if(!['Enter',' '].includes(event.key))return;const target=event.target.closest('[data-diff]');if(target){event.preventDefault();findDifference(target.dataset.diff);}});
}

function finishDifferenceScene(){
  if(!differenceGame||differenceGame.complete)return;
  differenceGame.complete=true;
  const scene=differenceGame.scene,progress=ensureDifferenceProgress();
  progress.completadas=Math.max(progress.completadas,scene);
  const message=document.getElementById('differencesMessage'),actions=document.getElementById('differencesActions'),board=document.getElementById('differencesBoard');
  board?.classList.add('complete');
  if(scene<DIFFERENCE_SCENES){
    progress.actual=scene+1;save(D);
    if(message)message.innerHTML=`<b>🎉 ¡Escena ${scene} completada! Pasamos a la ${scene+1}…</b>`;
    if(actions)actions.innerHTML=`<button class="btn primary" onclick="startDifferencesGame(${scene+1})">➡️ Ir ahora a la escena ${scene+1}</button>`;
    setTimeout(()=>{if(differenceGame?.complete&&differenceGame.scene===scene)startDifferencesGame(scene+1);},1200);
  }else{
    progress.actual=DIFFERENCE_SCENES;save(D);
    if(message)message.innerHTML='<b>🏆 ¡Has completado las 50 escenas!</b>';
    if(actions)actions.innerHTML=`<button class="btn primary" onclick="startDifferencesGame(${DIFFERENCE_SCENES})">🔄 Repetir escena 50</button><button class="btn secondary" onclick="home()">⌂ Volver al menú</button>`;
  }
}

function findDifference(id){
  if(!differenceGame||differenceGame.complete||differenceGame.found.has(id))return;
  differenceGame.found.add(id);
  document.querySelectorAll(`[data-diff="${id}"]`).forEach(element=>element.classList.add('found'));
  const count=differenceGame.found.size,counter=document.getElementById('differencesCount'),dots=document.querySelectorAll('#differencesDots i');
  if(counter)counter.textContent=`${count} / ${DIFFERENCE_TOTAL}`;
  dots.forEach((dot,index)=>dot.classList.toggle('found',index<count));
  window.GameSound?.play(count===DIFFERENCE_TOTAL?'win':'correct');
  const message=document.getElementById('differencesMessage');
  if(count===DIFFERENCE_TOTAL)finishDifferenceScene();
  else if(message)message.textContent=`¡Bien! Te quedan ${DIFFERENCE_TOTAL-count}.`;
}

const differencesOriginalHome=window.home;
if(typeof differencesOriginalHome==='function'){
  window.home=function(){const result=differencesOriginalHome();addDifferencesHomeCard();return result;};
}
addDifferencesHomeCard();
