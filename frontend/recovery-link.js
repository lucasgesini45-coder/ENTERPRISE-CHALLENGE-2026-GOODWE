// Open recovery in this tab so the authenticated session is preserved.
const recoveryLink = document.createElement('a');
recoveryLink.href = 'contingencia.html';
recoveryLink.textContent = 'Recuperação de recargas';
recoveryLink.style.cssText = 'display:block;padding:14px;color:inherit';
(document.querySelector('.sidebar') || document.body).append(recoveryLink);
