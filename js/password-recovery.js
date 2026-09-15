/* V3.17.4 — recuperación de contraseña Supabase. */
(function(){
  'use strict';
  const RECOVERY_CALLBACK='https://davidsinmas.github.io/aprendoyjuego/?passwordRecovery=1';
  const client=window.ludeikoCloud?.getClient?.();
  if(!client)return;

  function setStatus(text,error=false){
    const e=document.querySelector('[data-cloud-status]');
    if(e){e.textContent=text;e.dataset.error=error?'1':'0';}
  }

  function enhanceLogin(){
    const form=document.querySelector('[data-cloud-form]');
    if(!form||form.querySelector('[data-password-recovery]'))return;
    const actions=form.querySelector('div[style*="display:flex"]');
    if(!actions)return;
    const button=document.createElement('button');
    button.type='button';
    button.className='btn secondary';
    button.dataset.passwordRecovery='1';
    button.textContent='He olvidado mi contraseña';
    actions.appendChild(button);
    button.addEventListener('click',async()=>{
      const email=form.email?.value?.trim()||'';
      if(!email){setStatus('Introduce primero el correo de la cuenta.',true);form.email?.focus();return;}
      setStatus('Enviando correo de recuperación…');
      const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:RECOVERY_CALLBACK});
      if(error){setStatus('No se ha podido enviar el correo: '+error.message,true);return;}
      setStatus('Correo enviado. Abre el enlace recibido para crear una contraseña nueva.');
    });
  }

  function showResetScreen(){
    const app=document.getElementById('app');
    if(!app||document.querySelector('[data-password-reset-screen]'))return;
    app.innerHTML=`<div class="parent-login" data-password-reset-screen>
      <div class="parent-lock">🔐</div>
      <h2>Crear nueva contraseña</h2>
      <p class="muted center">Escribe una contraseña nueva para tu cuenta Ludeiko.</p>
      <input id="ludeikoNewPassword" type="password" autocomplete="new-password" minlength="6" placeholder="Nueva contraseña">
      <input id="ludeikoNewPasswordConfirm" type="password" autocomplete="new-password" minlength="6" placeholder="Repite la contraseña">
      <button type="button" class="btn primary" data-save-new-password>Guardar contraseña</button>
      <div class="parent-error" data-password-reset-status></div>
    </div>`;
    const save=app.querySelector('[data-save-new-password]');
    const status=app.querySelector('[data-password-reset-status]');
    save.addEventListener('click',async()=>{
      const password=document.getElementById('ludeikoNewPassword')?.value||'';
      const confirmation=document.getElementById('ludeikoNewPasswordConfirm')?.value||'';
      if(password.length<6){status.textContent='La contraseña debe tener al menos 6 caracteres.';return;}
      if(password!==confirmation){status.textContent='Las dos contraseñas no coinciden.';return;}
      save.disabled=true;status.textContent='Guardando…';
      const {error}=await client.auth.updateUser({password});
      if(error){save.disabled=false;status.textContent='No se ha podido cambiar: '+error.message;return;}
      status.textContent='Contraseña actualizada correctamente.';
      setTimeout(()=>{window.location.href='https://ludeiko.calisoftprojects.com/';},900);
    });
  }

  client.auth.onAuthStateChange((event)=>{
    if(event==='PASSWORD_RECOVERY')setTimeout(showResetScreen,0);
  });

  if(new URLSearchParams(location.search).get('passwordRecovery')==='1'){
    client.auth.getSession().then(({data})=>{if(data?.session)showResetScreen();});
  }

  const observer=new MutationObserver(enhanceLogin);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  enhanceLogin();
})();
