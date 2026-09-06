/* V3.15.2 · sprites Felino para la tienda. */
(function(){'use strict';
const cells=['helmet','neck','shoulders','chest','gloves','accessory','legs','boots','tail'];
function apply(){document.querySelectorAll('[data-feline-sprite]').forEach(el=>{const id=el.dataset.felineSprite||'',key=id.replace('felino_aprendiz_',''),n=cells.indexOf(key);if(n<0)return;const col=n%3,row=Math.floor(n/3);el.style.backgroundImage='url("assets/shop/felino/aprendiz/atlas16.png?v='+(window.APP_VERSION||'actual')+'")';el.style.backgroundSize='192px 192px';el.style.backgroundPosition=`-${col*64}px -${row*64}px`;el.style.backgroundRepeat='no-repeat';});}
new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});setTimeout(apply,0);
})();
