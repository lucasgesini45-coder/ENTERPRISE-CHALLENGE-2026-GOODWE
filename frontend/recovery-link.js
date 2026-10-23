// Open recovery in this tab so the authenticated session is preserved.
(() => {
    const menu = document.querySelector('.sidebar-menu');
    const target = menu?.querySelector('.menu-group') || menu || document.body;
    const link = document.createElement('a');
    link.href = 'contingencia.html';
    link.className = 'menu-item';
    link.style.textDecoration = 'none';
    link.innerHTML = '<span class="menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 1-8.5 12H6a6 6 0 1 0 1-7H10v3H2V3h3v3a9 9 0 0 1 7-3z"/></svg></span><span>Contingências</span>';
    target.append(link);
})();
