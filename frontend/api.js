const API_URL = window.EV_CHARGEOPS_API_URL || window.location.origin;

async function apiFetch(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const cancel = () => controller.abort();
    if (options.signal?.aborted) cancel();
    options.signal?.addEventListener('abort', cancel, {once: true});
    try {
        const headers = new Headers(options.headers || {});
        const token = sessionStorage.getItem('ev_chargeops_token');
        if (token && !headers.has('Authorization')) headers.set('Authorization', 'Bearer '+token);
        return await fetch(url, {...options, headers, credentials: 'same-origin', signal: controller.signal});
    } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', cancel);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const banner = document.createElement('div');
    banner.id = 'connection-status';
    banner.setAttribute('role', 'status');
    banner.style.cssText = 'padding:12px;background:#fff3cd;color:#332701;text-align:center;position:sticky;top:0;z-index:1000';
    banner.textContent = 'Verificando conexão. Os dados exibidos podem estar desatualizados.';
    document.body.prepend(banner);
    const check = async () => {
        try {
            const response = await apiFetch(`${API_URL}/health`);
            if (!response.ok) throw Error('Banco indisponível');
            banner.textContent = `Banco acessível. Última verificação: ${new Date().toLocaleString('pt-BR')}. As medições têm seus próprios horários.`;
        } catch {
            banner.textContent = 'Sem conexão confirmada. Os dados exibidos podem estar desatualizados; tente novamente antes de alterar registros.';
        }
    };
    check();
    setInterval(check, 30000);
});
