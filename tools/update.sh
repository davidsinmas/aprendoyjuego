#!/usr/bin/env bash
set -euo pipefail

echo "=== Aprendo Jugando · Integración avatar base V2.9.1 ==="

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

ASSET="assets/avatar/base/avatar_base.png"
APP="js/app.js"
CSS="css/avatar.css"

for f in "$ASSET" "$APP" "$CSS" "js/avatar.js" "js/avatar-data.js" "js/storage.js" "index.html"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: falta $f"
    exit 1
  fi
done

python3 - <<'PY'
from pathlib import Path
import struct, sys

p = Path("assets/avatar/base/avatar_base.png")
data = p.read_bytes()

if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
    sys.exit("ERROR: avatar_base.png no es un PNG válido.")

w, h = struct.unpack(">II", data[16:24])
print(f"Avatar maestro detectado: {w}x{h}px")

if (w, h) != (1024, 1024):
    sys.exit(f"ERROR: el avatar maestro debe ser 1024x1024 y es {w}x{h}.")
PY

python3 - <<'PY'
from pathlib import Path
import sys

path = Path("js/app.js")
text = path.read_text(encoding="utf-8")

text = text.replace(
    "V2.8.0 · ${parentMode?'🔓 Modo Padres activo':'progresión educativa'}",
    "V2.9.1 · ${parentMode?'🔓 Modo Padres activo':'progresión educativa'}"
)

old_actions = '<div class="bottom-actions">${parentMode?\'<button class="btn danger" onclick="disableParentMode()">🔒 Quitar modo Padres</button>\':\'\'}<button class="btn secondary" onclick="parents()">⚙️ Zona de padres</button></div>`);}'
new_actions = '<div class="bottom-actions"><button class="btn secondary" onclick="avatarScreen()">👤 Mi avatar</button>${parentMode?\'<button class="btn danger" onclick="disableParentMode()">🔒 Quitar modo Padres</button>\':\'\'}<button class="btn secondary" onclick="parents()">⚙️ Zona de padres</button></div>`);}'

if 'onclick="avatarScreen()"' not in text:
    if old_actions not in text:
        sys.exit("ERROR: no encuentro el anclaje de acciones de inicio. No se modifica app.js.")
    text = text.replace(old_actions, new_actions, 1)

if "function avatarScreen()" not in text:
    anchor = "function levelDone(n){return stats(n.id).partidas>0;}"
    if anchor not in text:
        sys.exit("ERROR: no encuentro el anclaje levelDone(). No se modifica app.js.")

    avatar_code = r"""function avatarScreen(){
  layout(`<div class="top"><button class="btn secondary back" onclick="home()">← Volver</button>${diamond()}</div>
  <div class="avatar-page">
    <div class="avatar-page-head"><div><h2>Mi avatar</h2><p class="muted">Este es tu personaje. Aquí podrás equipar los objetos que consigas.</p></div></div>
    <div class="avatar-preview-card">
      <div id="avatarPreview" class="avatar-preview" aria-label="Avatar del jugador"></div>
      <div id="avatarAssetStatus" class="avatar-status muted">Comprobando avatar…</div>
    </div>
    <div class="avatar-empty-shop">
      <b>Equipamiento</b>
      <p class="muted">La infraestructura está preparada. Los próximos objetos se colocarán automáticamente sobre este avatar, sin ajustar posiciones.</p>
    </div>
  </div>`);
  requestAnimationFrame(async()=>{
    const preview=document.getElementById('avatarPreview');
    const status=document.getElementById('avatarAssetStatus');
    if(!preview||!window.AvatarSystem){
      if(status)status.textContent='No se pudo iniciar el sistema de avatar.';
      return;
    }
    AvatarSystem.render(preview,D,{onAssetError:()=>{if(status)status.textContent='⚠️ No se pudo cargar el avatar base.';}});
    const checks=await AvatarSystem.validateAssets({includeBase:true});
    const base=checks[0];
    if(status&&base){
      status.textContent=base.ok?'✓ Avatar maestro 1024 × 1024 cargado correctamente':`⚠️ Recurso no válido${base.width?` (${base.width} × ${base.height})`:''}`;
      status.classList.toggle('avatar-status-ok',!!base.ok);
      status.classList.toggle('avatar-status-error',!base.ok);
    }
  });
}
"""
    text = text.replace(anchor, avatar_code + anchor, 1)

path.write_text(text, encoding="utf-8")
print("app.js actualizado")
PY

if ! grep -q "AJ_AVATAR_SCREEN_V291" "$CSS"; then
cat >> "$CSS" <<'CSS'

/* AJ_AVATAR_SCREEN_V291 */
.avatar-page{display:grid;gap:16px}
.avatar-page-head h2{margin-bottom:4px}
.avatar-preview-card{max-width:520px;width:100%;margin:0 auto;padding:14px;border-radius:24px;background:linear-gradient(180deg,#f5fbff,#edf4f1);border:1px solid rgba(30,65,80,.12);box-shadow:0 10px 28px rgba(30,60,80,.10)}
.avatar-preview{width:100%;max-width:430px;margin:0 auto;aspect-ratio:1/1}
.avatar-status{text-align:center;font-size:.86rem;margin-top:8px}
.avatar-status-ok{color:#26734d;font-weight:700}
.avatar-status-error{color:#a33a32;font-weight:700}
.avatar-empty-shop{padding:16px;border-radius:18px;border:1px dashed rgba(30,65,80,.22);background:rgba(255,255,255,.55)}
.avatar-empty-shop p{margin:6px 0 0}
@media(max-width:600px){
  .avatar-preview-card{padding:8px;border-radius:18px}
  .avatar-preview{max-width:360px}
}
CSS
fi

node --check js/avatar-data.js
node --check js/storage.js
node --check js/avatar.js
node --check js/app.js

grep -q 'function avatarScreen()' js/app.js
grep -q 'onclick="avatarScreen()"' js/app.js
grep -q 'AJ_AVATAR_SCREEN_V291' css/avatar.css

echo "OK: avatar base integrado."
echo "Versión: V2.9.1"
echo "Abre el juego y pulsa: Mi avatar"
