import json
from pathlib import Path

path = Path('js/handwriting.js')
text = path.read_text(encoding='utf-8')

text = text.replace(
    "const LETTER_VOICE_URL='https://cdn.creativeclaw.co/u/d65593e1/audio/34505963-7d20-4e1c-8ce2-f505089dc3d2.mp3';",
    "const LETTER_VOICE_URL='assets/audio/narration/handwriting-letters.mp3';"
)

old_templates = """function templateCanvas(letter,font,lower=false,mirror=false){const c=document.createElement('canvas');c.width=180;c.height=180;const x=c.getContext('2d');x.save();if(mirror){x.translate(c.width,0);x.scale(-1,1);}x.font=`700 132px ${font}`;x.textAlign='center';x.textBaseline='middle';x.strokeStyle='#000';x.lineWidth=4;x.lineJoin='round';x.strokeText(lower?letter.toLocaleLowerCase('es-ES'):letter,90,94);x.restore();return c;}
  function ensureTemplates(){if(hw.templates)return hw.templates;const fonts=['Arial','Trebuchet MS','Verdana','Avenir Next'];hw.templates={};for(const letter of ALPHABET){const variants=[];for(const font of fonts)for(const lower of [false,true])for(const mirror of [false,true]){const mask=normalizedMask(templateCanvas(letter,font,lower,mirror));if(mask)variants.push(mask);}hw.templates[letter]=variants;}return hw.templates;}"""
new_templates = """function templateCanvas(letter,font,mode='fill'){const c=document.createElement('canvas');c.width=180;c.height=180;const x=c.getContext('2d');x.font=`700 132px ${font}`;x.textAlign='center';x.textBaseline='middle';x.fillStyle='#000';x.strokeStyle='#000';x.lineJoin='round';if(mode==='fill')x.fillText(letter,90,94);else{x.lineWidth=7;x.strokeText(letter,90,94);}return c;}
  function ensureTemplates(){if(hw.templates)return hw.templates;const fonts=['Arial','Trebuchet MS','Verdana','Avenir Next'];hw.templates={};for(const letter of ALPHABET){const variants=[];for(const font of fonts)for(const mode of ['fill','stroke']){const mask=normalizedMask(templateCanvas(letter,font,mode));if(mask)variants.push(mask);}hw.templates[letter]=variants;}return hw.templates;}"""
if old_templates not in text:
    raise SystemExit('No se encontró el bloque de plantillas esperado')
text = text.replace(old_templates, new_templates)

old_accept = """function acceptanceLimits(){const level=Number(state.level?.level||1);if(level<=6)return{maxDistance:3.25,strongDistance:2.35,minGap:.08};if(level<=16)return{maxDistance:3,strongDistance:2.15,minGap:.12};return{maxDistance:2.75,strongDistance:1.95,minGap:.16};}
  function isExpectedLetter(result,expected){if(!result?.ranking?.length||result.letter!==expected)return false;const target=result.ranking[0],second=result.ranking[1],limits=acceptanceLimits();if(!Number.isFinite(target.distance)||target.distance>limits.maxDistance)return false;const gap=second&&Number.isFinite(second.distance)?second.distance-target.distance:Infinity;return target.distance<=limits.strongDistance||gap>=limits.minGap;}"""
new_accept = """function acceptanceLimits(){const level=Number(state.level?.level||1);if(level<=6)return{maxDistance:3.85,strongDistance:2.75,ambiguity:.55,maxRank:3};if(level<=16)return{maxDistance:3.55,strongDistance:2.5,ambiguity:.42,maxRank:2};return{maxDistance:3.25,strongDistance:2.3,ambiguity:.3,maxRank:2};}
  function isExpectedLetter(result,expected){if(!result?.ranking?.length)return false;const limits=acceptanceLimits(),rank=result.ranking.findIndex(item=>item.letter===expected);if(rank<0||rank>=limits.maxRank)return false;const target=result.ranking[rank],best=result.ranking[0];if(!Number.isFinite(target.distance)||target.distance>limits.maxDistance)return false;if(target.distance<=limits.strongDistance)return true;const delta=target.distance-(Number.isFinite(best?.distance)?best.distance:target.distance);return delta<=limits.ambiguity;}"""
if old_accept not in text:
    raise SystemExit('No se encontró el bloque de aceptación esperado')
text = text.replace(old_accept, new_accept)

path.write_text(text, encoding='utf-8')

version = Path('version.json')
data = json.loads(version.read_text(encoding='utf-8'))
data.update({'version': '3.17.6', 'name': 'Reconocimiento de escritura mejorado', 'date': '2026-09-16'})
version.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

changelog = Path('CHANGELOG.md')
if changelog.exists():
    content = changelog.read_text(encoding='utf-8')
    entry = '## V3.17.6 — 2026-09-16\n- Mejora el reconocimiento de letras manuscritas: plantillas adecuadas para mayúsculas, tolerancia a variaciones infantiles y audio de escritura servido desde el propio proyecto.\n\n'
    if '## V3.17.6' not in content:
        if content.startswith('#') and '\n' in content:
            first, rest = content.split('\n', 1)
            content = first + '\n\n' + entry + rest.lstrip('\n')
        else:
            content = entry + content
        changelog.write_text(content, encoding='utf-8')
