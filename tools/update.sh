# APRENDO JUGANDO — ACTUALIZACIÓN V2.10.0
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

echo "Instalando infraestructura de avatar V2.9.0..."

mkdir -p js css assets/avatar/templates

cat > js/avatar-data.js <<'EOF'
/**
 * Infraestructura de avatar paper-doll.
 * Todos los PNG equipables deben compartir exactamente el mismo lienzo maestro.
 * No se permiten coordenadas, escala o rotación por objeto.
 */
const AVATAR={
  schemaVersion:1,
  canvas:{width:1024,height:1024},
  base:{
    id:'avatar_base',
    src:'assets/avatar/base/avatar_base.png',
    layer:10,
    optional:true
  },
  slots:{
    back:{layer:0,label:'Espalda'},
    legs:{layer:20,label:'Piernas'},
    boots:{layer:30,label:'Botas'},
    chest:{layer:40,label:'Pecho'},
    shoulders:{layer:50,label:'Hombreras'},
    gloves:{layer:60,label:'Brazos y guantes'},
    head:{layer:70,label:'Cabeza'},
    helmet:{layer:80,label:'Casco'},
    shield:{layer:90,label:'Escudo'},
    weapon:{layer:100,label:'Arma'},
    effects:{layer:110,label:'Efectos'}
  },
  items:[]
};
EOF

cat > js/avatar.js <<'EOF'
(function(){
  'use strict';

  const VALID_SLOTS=Object.keys(AVATAR.slots);

  function getItem(id){
    return AVATAR.items.find(item=>item.id===id)||null;
  }

  function validateItem(item){
    const errors=[];
    if(!item||typeof item!=='object')return['Objeto no válido'];
    if(!item.id||typeof item.id!=='string')errors.push('Falta id');
    if(!VALID_SLOTS.includes(item.slot))errors.push(`Slot no válido: ${item.slot}`);
    if(!item.avatarLayer||typeof item.avatarLayer!=='string')errors.push('Falta avatarLayer');
    if('x' in item||'y' in item||'scale' in item||'rotation' in item)errors.push('No se permiten ajustes de posición, escala o rotación por objeto');
    return errors;
  }

  function validateCatalog(){
    const seen=new Set(),problems=[];
    for(const item of AVATAR.items){
      const errors=validateItem(item);
      if(seen.has(item.id))errors.push('ID duplicado');
      seen.add(item.id);
      if(errors.length)problems.push({id:item.id||'(sin id)',errors});
    }
    return problems;
  }

  function ensureState(data){
    if(!data.avatar)data.avatar={owned:[],equipped:{}};
    if(!Array.isArray(data.avatar.owned))data.avatar.owned=[];
    if(!data.avatar.equipped||typeof data.avatar.equipped!=='object')data.avatar.equipped={};
    for(const slot of VALID_SLOTS)if(!(slot in data.avatar.equipped))data.avatar.equipped[slot]=null;
    return data.avatar;
  }

  function owns(data,itemId){
    return ensureState(data).owned.includes(itemId);
  }

  function grant(data,itemId){
    const item=getItem(itemId);
    if(!item)throw new Error(`Objeto de avatar desconocido: ${itemId}`);
    const avatar=ensureState(data);
    if(!avatar.owned.includes(itemId))avatar.owned.push(itemId);
    return true;
  }

  function revoke(data,itemId){
    const avatar=ensureState(data);
    avatar.owned=avatar.owned.filter(id=>id!==itemId);
    for(const slot of VALID_SLOTS)if(avatar.equipped[slot]===itemId)avatar.equipped[slot]=null;
  }

  function equip(data,itemId,{allowUnowned=false}={}){
    const item=getItem(itemId);
    if(!item)throw new Error(`Objeto de avatar desconocido: ${itemId}`);
    const errors=validateItem(item);
    if(errors.length)throw new Error(`${itemId}: ${errors.join(', ')}`);
    if(!allowUnowned&&!owns(data,itemId))throw new Error(`El jugador no posee ${itemId}`);
    const avatar=ensureState(data);
    avatar.equipped[item.slot]=itemId;
    return item;
  }

  function unequip(data,slot){
    if(!VALID_SLOTS.includes(slot))throw new Error(`Slot no válido: ${slot}`);
    ensureState(data).equipped[slot]=null;
  }

  function equippedItems(data){
    const avatar=ensureState(data);
    return VALID_SLOTS
      .map(slot=>getItem(avatar.equipped[slot]))
      .filter(Boolean)
      .sort((a,b)=>AVATAR.slots[a.slot].layer-AVATAR.slots[b.slot].layer);
  }

  function makeLayer(src,layer,kind,id){
    const img=document.createElement('img');
    img.src=src;
    img.alt='';
    img.draggable=false;
    img.className='avatar-layer';
    img.dataset.kind=kind;
    if(id)img.dataset.itemId=id;
    img.style.zIndex=String(layer);
    return img;
  }

  function render(container,data,{showBase=true,onAssetError=null}={}){
    if(typeof container==='string')container=document.querySelector(container);
    if(!container)throw new Error('No se encontró el contenedor del avatar');
    container.classList.add('avatar-stage');
    container.style.setProperty('--avatar-aspect',`${AVATAR.canvas.width}/${AVATAR.canvas.height}`);
    container.replaceChildren();

    const add=(img)=>{
      img.addEventListener('error',()=>{
        img.classList.add('avatar-asset-error');
        if(typeof onAssetError==='function')onAssetError(img.src,img.dataset.itemId||'base');
      },{once:true});
      container.appendChild(img);
    };

    if(showBase&&AVATAR.base.src)add(makeLayer(AVATAR.base.src,AVATAR.base.layer,'base',AVATAR.base.id));
    for(const item of equippedItems(data))add(makeLayer(item.avatarLayer,AVATAR.slots[item.slot].layer,'equipment',item.id));
    return container;
  }

  function inspectImageDimensions(src){
    return new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve({src,ok:img.naturalWidth===AVATAR.canvas.width&&img.naturalHeight===AVATAR.canvas.height,width:img.naturalWidth,height:img.naturalHeight,expected:{...AVATAR.canvas}});
      img.onerror=()=>resolve({src,ok:false,error:'No se pudo cargar el recurso',expected:{...AVATAR.canvas}});
      img.src=src;
    });
  }

  async function validateAssets({includeBase=true}={}){
    const checks=[];
    if(includeBase&&AVATAR.base.src)checks.push(inspectImageDimensions(AVATAR.base.src));
    for(const item of AVATAR.items)checks.push(inspectImageDimensions(item.avatarLayer));
    return Promise.all(checks);
  }

  window.AvatarSystem={
    canvas:{...AVATAR.canvas},
    slots:{...AVATAR.slots},
    getItem,
    validateItem,
    validateCatalog,
    validateAssets,
    ensureState,
    owns,
    grant,
    revoke,
    equip,
    unequip,
    equippedItems,
    render
  };
})();
EOF

cat > css/avatar.css <<'EOF'
/* Avatar paper-doll: todas las capas ocupan el mismo lienzo maestro. */
.avatar-stage{position:relative;width:100%;aspect-ratio:var(--avatar-aspect,1/1);overflow:hidden;isolation:isolate}
.avatar-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;pointer-events:none;user-select:none;-webkit-user-drag:none}
.avatar-layer.avatar-asset-error{visibility:hidden}
EOF

cat > assets/avatar/README.md <<'EOF'
# Avatar paper-doll

Todos los recursos equipables usan un lienzo maestro de 1024x1024 px y deben conservar exactamente la misma posición, escala y orientación del avatar maestro.

No se utilizan ajustes individuales de x, y, escala o rotación dentro del juego.

Las carpetas de categorías se crearán únicamente cuando existan recursos reales para ellas.
EOF

cat > assets/avatar/templates/README.md <<'EOF'
# Plantillas de avatar

Aquí se guardará la plantilla maestra cuando exista el avatar definitivo.

Reglas:
- lienzo: 1024x1024 px
- fondo transparente
- misma postura y origen
- no recortar al contenido
- cada accesorio conserva el lienzo completo
EOF

python3 <<'PY'
from pathlib import Path

# index.html: añadir CSS y JS sin duplicarlos
p=Path('index.html')
s=p.read_text(encoding='utf-8')
if 'css/avatar.css' not in s:
    s=s.replace('<link rel="stylesheet" href="css/app.css">', '<link rel="stylesheet" href="css/app.css">\n<link rel="stylesheet" href="css/avatar.css">')
if 'js/avatar-data.js' not in s:
    s=s.replace('<script src="js/data.js"></script>', '<script src="js/data.js"></script>\n<script src="js/avatar-data.js"></script>')
if 'js/avatar.js' not in s:
    s=s.replace('<script src="js/storage.js"></script>', '<script src="js/storage.js"></script>\n<script src="js/avatar.js"></script>')
p.write_text(s,encoding='utf-8')

# storage.js: parche conservador del almacenamiento actual
p=Path('js/storage.js')
s=p.read_text(encoding='utf-8')

if 'function normalizeAvatar' not in s:
    marker='function load(){'
    helper="""function normalizeAvatar(raw){\n  const slots=['back','legs','boots','chest','shoulders','gloves','head','helmet','shield','weapon','effects'];\n  const avatar=raw&&typeof raw==='object'?raw:{};\n  const owned=Array.isArray(avatar.owned)?[...new Set(avatar.owned.filter(x=>typeof x==='string'))]:[];\n  const source=avatar.equipped&&typeof avatar.equipped==='object'?avatar.equipped:{};\n  const equipped={};\n  for(const slot of slots)equipped[slot]=typeof source[slot]==='string'?source[slot]:null;\n  return{owned,equipped};\n}\n"""
    if marker not in s:
        raise SystemExit('No se reconoce js/storage.js: falta function load()')
    s=s.replace(marker,helper+marker,1)

# Añadir avatar al blank() solo si aún no existe
if 'avatar:{' not in s:
    needle='logros:[]'
    replacement="""logros:[],\n    avatar:{\n      owned:[],\n      equipped:{back:null,legs:null,boots:null,chest:null,shoulders:null,gloves:null,head:null,helmet:null,shield:null,weapon:null,effects:null}\n    }"""
    if needle not in s:
        raise SystemExit('No se reconoce js/storage.js: falta logros:[]')
    s=s.replace(needle,replacement,1)

# Normalizar avatar al cargar, antes de save(d);return d;
if 'd.avatar=normalizeAvatar(d.avatar);' not in s:
    needle='save(d);return d;'
    if needle not in s:
        raise SystemExit('No se reconoce js/storage.js: falta save(d);return d;')
    s=s.replace(needle,'d.avatar=normalizeAvatar(d.avatar);\n  '+needle,1)

p.write_text(s,encoding='utf-8')
PY

cat > version.json <<'EOF'
{
  "version": "2.9.0",
  "name": "Infraestructura de avatar paper-doll",
  "date": "2026-08-09"
}
EOF

echo "Comprobando sintaxis JavaScript..."
node --check js/avatar-data.js
node --check js/avatar.js
node --check js/storage.js

echo "Infraestructura de avatar V2.9.0 instalada correctamente."
