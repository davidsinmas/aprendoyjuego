/* V3.15.5 · acceso directo Tienda justo debajo de Mi avatar. */
(function(){'use strict';
function addShopButton(){
  const actions=document.querySelector('.progress-actions');
  if(!actions||actions.querySelector('[data-open-avatar-shop]'))return;
  const avatarButton=actions.querySelector('button[onclick*="avatarScreen"]');
  if(!avatarButton)return;
  const button=document.createElement('button');
  button.type='button';
  button.className='btn primary progress-action avatar-shop-home-button';
  button.dataset.openAvatarShop='true';
  button.textContent='🛍️ Tienda';
  button.addEventListener('click',()=>{if(typeof window.shopScreen==='function')window.shopScreen();});
  avatarButton.insertAdjacentElement('afterend',button);
}
new MutationObserver(addShopButton).observe(document.body,{childList:true,subtree:true});
setTimeout(addShopButton,0);
})();
