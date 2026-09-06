/* V3.15.4 · acceso directo a la Tienda de Avatar desde la pantalla principal. */
(function(){'use strict';
function addShopButton(){
  const actions=document.querySelector('.bottom-actions');
  if(!actions||actions.querySelector('[data-open-avatar-shop]'))return;
  const button=document.createElement('button');
  button.type='button';
  button.className='btn primary';
  button.dataset.openAvatarShop='true';
  button.textContent='🛍️ Tienda de Avatar';
  button.addEventListener('click',()=>{if(typeof window.shopScreen==='function')window.shopScreen();});
  actions.insertBefore(button,actions.firstChild);
}
new MutationObserver(addShopButton).observe(document.body,{childList:true,subtree:true});
setTimeout(addShopButton,0);
})();
