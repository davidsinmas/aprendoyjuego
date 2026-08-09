#!/usr/bin/env bash
set -euo pipefail

echo "=== Aprendo Jugando · Tienda e inventario V2.10.0 ==="

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

for f in js/app.js js/avatar.js js/avatar-data.js js/storage.js css/app.css css/avatar.css index.html assets/avatar/base/avatar_base.png; do
  [ -f "$f" ] || { echo "ERROR: falta $f"; exit 1; }
done

mkdir -p assets/avatar/equipment/_technical
python3 - <<'PY'
from pathlib import Path
import struct, zlib, binascii
out=Path("assets/avatar/equipment/_technical/blank_1024.png")
w=h=1024
raw=b''.join(b'\x00'+b'\x00\x00\x00\x00'*w for _ in range(h))
def chunk(t,d):
    return struct.pack(">I",len(d))+t+d+struct.pack(">I",binascii.crc32(t+d)&0xffffffff)
png=(b'\x89PNG\r\n\x1a\n'
     +chunk(b'IHDR',struct.pack(">IIBBBBB",w,h,8,6,0,0,0))
     +chunk(b'IDAT',zlib.compress(raw,9))
     +chunk(b'IEND',b''))
out.write_bytes(png)
print("Recurso técnico creado:",out)
PY

cat > js/avatar-data.js <<'JS'
const AVATAR={
  schemaVersion:2,
  canvas:{width:1024,height:1024},
  base:{id:'avatar_base',src:'assets/avatar/base/avatar_base.png',layer:10,optional:false},
  slots:{
    back:{layer:0,label:'Espalda'},legs:{layer:20,label:'Piernas'},boots:{layer:30,label:'Botas'},
    chest:{layer:40,label:'Pecho'},shoulders:{layer:50,label:'Hombreras'},gloves:{layer:60,label:'Brazos y guantes'},
    head:{layer:70,label:'Cabeza'},helmet:{layer:80,label:'Casco'},shield:{layer:90,label:'Escudo'},
    weapon:{layer:100,label:'Arma'},effects:{layer:110,label:'Efectos'}
  },
  rarities:{common:{label:'Común'},rare:{label:'Raro'},epic:{label:'Épico'},legendary:{label:'Legendario'}},
  items:[
    {id:'test_helmet_01',name:'Casco de prueba',description:'Objeto técnico para comprobar tienda, inventario y equipamiento.',slot:'helmet',rarity:'common',price:5,shopIcon:'🪖',shopImage:null,avatarLayer:'assets/avatar/equipment/_technical/blank_1024.png',technical:true},
    {id:'test_weapon_01',name:'Arma de prueba',description:'Objeto técnico para comprobar compra y equipamiento.',slot:'weapon',rarity:'rare',price:8,shopIcon:'⚔️',shopImage:null,avatarLayer:'assets/avatar/equipment/_technical/blank_1024.png',technical:true}
  ]
};
JS

python3 - <<'PY'
from pathlib import Path
import sys
p=Path("js/avatar.js")
s=p.read_text(encoding="utf-8")
if "function buy(data,itemId)" not in s:
    anchor="  function revoke(data,itemId){\n"
    insert="""  function buy(data,itemId){
    const item=getItem(itemId);
    if(!item)throw new Error(`Objeto de avatar desconocido: ${itemId}`);
    const avatar=ensureState(data);
    if(avatar.owned.includes(itemId))return{ok:false,reason:'owned',item};
    const price=Math.max(0,Number(item.price)||0);
    const diamonds=Math.max(0,Number(data.diamantes)||0);
    if(diamonds<price)return{ok:false,reason:'diamonds',item};
    data.diamantes=diamonds-price;
    avatar.owned.push(itemId);
    return{ok:true,item,spent:price};
  }

"""
    if anchor not in s: sys.exit("ERROR: no encuentro anclaje en avatar.js")
    s=s.replace(anchor,insert+anchor,1)
if "    buy," not in s:
    anchor="    grant,\n    revoke,\n"
    if anchor not in s: sys.exit("ERROR: no encuentro exportación AvatarSystem")
    s=s.replace(anchor,"    grant,\n    buy,\n    revoke,\n",1)
p.write_text(s,encoding="utf-8")
PY

python3 - <<'PY'
from pathlib import Path
p=Path("js/storage.js")
s=p.read_text(encoding="utf-8").replace("versionDatos:10","versionDatos:11").replace("d.versionDatos=10;","d.versionDatos=11;")
p.write_text(s,encoding="utf-8")
PY

python3 - <<'PY'
from pathlib import Path
import sys
p=Path("js/app.js")
s=p.read_text(encoding="utf-8")
s=s.replace("V2.9.1 · ${parentMode?'🔓 Modo Padres activo':'progresión educativa'}","V2.10.0 · ${parentMode?'🔓 Modo Padres activo':'progresión educativa'}")

old=""" ${xpPanel()}
 <div class="dashboard-grid"><div class="dashboard-main">${dailyHTML()}</div><div class="dashboard-side">${progressSummary()}<button class="btn secondary side-action" onclick="achievements()">🏆 Ver logros</button></div></div>
"""
new=""" ${xpPanel()}
 <div class="progress-actions"><button class="btn secondary progress-action" onclick="avatarScreen()">👤 Mi avatar</button><button class="btn secondary progress-action" onclick="achievements()">🏆 Logros</button></div>
 <div class="dashboard-grid"><div class="dashboard-main">${dailyHTML()}</div><div class="dashboard-side">${progressSummary()}</div></div>
"""
if old not in s: sys.exit("ERROR: no encuentro cabecera actual")
s=s.replace(old,new,1)

old_bottom='<div class="bottom-actions"><button class="btn secondary" onclick="avatarScreen()">👤 Mi avatar</button>${parentMode?\'<button class="btn danger" onclick="disableParentMode()">🔒 Quitar modo Padres</button>\':\'\'}<button class="btn secondary" onclick="parents()">⚙️ Zona de padres</button></div>`);}'
new_bottom='<div class="bottom-actions">${parentMode?\'<button class="btn danger" onclick="disableParentMode()">🔒 Quitar modo Padres</button>\':\'\'}<button class="btn secondary" onclick="parents()">⚙️ Zona de padres</button></div>`);}'
if old_bottom in s: s=s.replace(old_bottom,new_bottom,1)

start=s.find("function avatarScreen(){")
end=s.find("function levelDone(",start)
if start<0 or end<0: sys.exit("ERROR: no encuentro avatarScreen()")

block="""function avatarScreen(){
  const owned=AvatarSystem.ensureState(D).owned.length;
  const equipped=AvatarSystem.equippedItems(D).length;
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div>
  <div class="avatar-page">
    <div class="avatar-page-head"><div><h2>Mi avatar</h2><p class="muted">Personaliza tu personaje con los objetos que consigas.</p></div></div>
    <div class="avatar-preview-card">
      <div id="avatarPreview" class="avatar-preview" aria-label="Avatar del jugador"></div>
      <div id="avatarAssetStatus" class="avatar-status muted">Cargando avatar…</div>
    </div>
    <div class="avatar-menu-grid">
      <button class="btn primary avatar-menu-btn" onclick="shopScreen()">🛒 Tienda</button>
      <button class="btn secondary avatar-menu-btn" onclick="inventoryScreen()">🎒 Inventario <span>${owned}</span></button>
    </div>
    <div class="avatar-summary muted">${equipped} objeto${equipped===1?'':'s'} equipado${equipped===1?'':'s'}</div>
  </div>`);
  requestAnimationFrame(async()=>{
    const preview=document.getElementById('avatarPreview');
    const status=document.getElementById('avatarAssetStatus');
    if(!preview||!window.AvatarSystem)return;
    AvatarSystem.render(preview,D,{onAssetError:()=>{if(status)status.textContent='⚠️ No se pudo cargar un recurso del avatar.';}});
    const checks=await AvatarSystem.validateAssets({includeBase:true});
    const base=checks[0];
    if(status&&base){
      status.textContent=base.ok?'✓ Avatar listo':'⚠️ El avatar maestro no tiene el formato esperado';
      status.classList.toggle('avatar-status-ok',!!base.ok);
      status.classList.toggle('avatar-status-error',!base.ok);
    }
  });
}
function rarityLabel(item){return AVATAR.rarities?.[item.rarity]?.label||item.rarity||'Objeto';}
function shopItemCard(item){
  const owned=AvatarSystem.owns(D,item.id),canBuy=D.diamantes>=item.price;
  return `<div class="shop-card ${owned?'owned':''}"><div class="shop-icon">${item.shopIcon||'🎁'}</div><div class="shop-info"><div class="shop-title"><b>${item.name}</b><span class="rarity rarity-${item.rarity}">${rarityLabel(item)}</span></div><div class="muted shop-desc">${item.description||''}</div><div class="shop-slot">${AVATAR.slots[item.slot]?.label||item.slot}</div></div><div class="shop-buy">${owned?'<span class="owned-badge">✓ Tuyo</span>':`<button class="btn ${canBuy?'primary':'secondary'} shop-buy-btn" onclick="buyAvatarItem('${item.id}')" ${canBuy?'':'disabled'}>${item.price} 💎</button>`}</div></div>`;
}
function shopScreen(){
  const items=AVATAR.items||[];
  layout(`<div class="top"><button class="btn secondary back" onclick="avatarScreen()">← Avatar</button>${diamond()}</div><div class="shop-head"><div><h2>🛒 Tienda</h2><p class="muted">Consigue objetos con los diamantes que ganas jugando.</p></div></div>${items.length?`<div class="shop-list">${items.map(shopItemCard).join('')}</div>`:'<div class="empty-state">Todavía no hay objetos disponibles.</div>'}<p class="technical-note muted">Los objetos de prueba sirven únicamente para comprobar el funcionamiento y se sustituirán por equipamiento real.</p>`);
}
function buyAvatarItem(id){
  const result=AvatarSystem.buy(D,id);
  if(result.ok){save(D);playChime('ok');shopScreen();return;}
  if(result.reason==='owned'){shopScreen();return;}
  if(result.reason==='diamonds')alert('Necesitas más diamantes para comprar este objeto.');
}
function inventoryItemCard(item){
  const equipped=AvatarSystem.ensureState(D).equipped[item.slot]===item.id;
  return `<div class="inventory-card ${equipped?'equipped':''}"><div class="shop-icon">${item.shopIcon||'🎁'}</div><div class="shop-info"><div class="shop-title"><b>${item.name}</b><span class="rarity rarity-${item.rarity}">${rarityLabel(item)}</span></div><div class="muted">${AVATAR.slots[item.slot]?.label||item.slot}</div></div><div>${equipped?`<button class="btn secondary" onclick="unequipAvatarSlot('${item.slot}')">Quitar</button>`:`<button class="btn primary" onclick="equipAvatarItem('${item.id}')">Equipar</button>`}</div></div>`;
}
function inventoryScreen(){
  const avatar=AvatarSystem.ensureState(D),items=avatar.owned.map(id=>AvatarSystem.getItem(id)).filter(Boolean);
  layout(`<div class="top"><button class="btn secondary back" onclick="avatarScreen()">← Avatar</button>${diamond()}</div><h2>🎒 Inventario</h2><p class="muted">Toca Equipar para poner un objeto en el avatar. Solo puede haber uno de cada categoría.</p>${items.length?`<div class="inventory-list">${items.map(inventoryItemCard).join('')}</div>`:'<div class="empty-state">Aún no tienes objetos. Visita la tienda para conseguir el primero.</div>'}`);
}
function equipAvatarItem(id){try{AvatarSystem.equip(D,id);save(D);playChime('ok');inventoryScreen();}catch(e){alert(e.message);}}
function unequipAvatarSlot(slot){try{AvatarSystem.unequip(D,slot);save(D);inventoryScreen();}catch(e){alert(e.message);}}
"""
s=s[:start]+block+s[end:]
p.write_text(s,encoding="utf-8")
PY

if ! grep -q "AJ_SHOP_V2100" css/avatar.css; then
cat >> css/avatar.css <<'CSS'

/* AJ_SHOP_V2100 */
.progress-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 14px}
.progress-action{min-height:62px;font-size:1.05rem}
.avatar-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:520px;margin:0 auto}
.avatar-menu-btn{min-height:58px}.avatar-summary{text-align:center}
.shop-list,.inventory-list{display:grid;gap:12px}
.shop-card,.inventory-card{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:14px;border:1px solid var(--line);border-radius:20px;background:#f7f3ec}
.shop-card.owned,.inventory-card.equipped{background:#eef5ed}
.shop-icon{width:64px;height:64px;border-radius:18px;background:#fff;display:grid;place-items:center;font-size:2.3rem;border:1px solid var(--line)}
.shop-info{min-width:0}.shop-title{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.shop-desc{margin-top:4px}.shop-slot{font-size:.82rem;font-weight:800;margin-top:7px}
.rarity,.owned-badge{font-size:.72rem;font-weight:900;border-radius:999px;padding:5px 8px;background:#e7e1d7}
.rarity-rare{background:#dce9f1}.rarity-epic{background:#eadff2}.rarity-legendary{background:#f3e3b5}
.shop-buy-btn{min-width:90px;padding:12px 14px}.shop-buy-btn:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}
.technical-note{font-size:.8rem;margin-top:16px}.empty-state{padding:24px;border:1px dashed var(--line);border-radius:18px;text-align:center;background:#f7f3ec}
@media(max-width:600px){.shop-card,.inventory-card{grid-template-columns:auto 1fr}.shop-buy,.shop-card>div:last-child,.inventory-card>div:last-child{grid-column:1/-1}.shop-buy-btn,.inventory-card .btn{width:100%}}
CSS
fi

node --check js/avatar-data.js
node --check js/storage.js
node --check js/avatar.js
node --check js/app.js
grep -q "function shopScreen()" js/app.js
grep -q "function inventoryScreen()" js/app.js
grep -q "function buy(data,itemId)" js/avatar.js
grep -q "V2.10.0" js/app.js
grep -q "AJ_SHOP_V2100" css/avatar.css

echo "OK: V2.10.0 instalada."
