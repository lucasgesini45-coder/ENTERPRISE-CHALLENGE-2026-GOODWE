const API_URL =
    window.EV_CHARGEOPS_API_URL ||
    "https://enterprise-challenge-2026-goodwe.onrender.com";

async function apiFetch(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(
    () => controller.abort(),
    60000
    );
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

window.addEventListener("DOMContentLoaded", () => {

    const check = async () => {

        let banner =
            document.getElementById(
                "connection-status"
            );

        try {

            const response =
                await apiFetch(
                    `${API_URL}/health`
                );

            if (!response.ok) {

                throw new Error(
                    "Banco indisponível"
                );

            }

            if (banner) {

                banner.remove();

            }

        } catch (erro) {

            if (!banner) {

                banner =
                    document.createElement(
                        "div"
                    );

                banner.id =
                    "connection-status";

                banner.setAttribute(
                    "role",
                    "status"
                );

                banner.style.cssText = `
                    padding: 12px;
                    background: #fff3cd;
                    color: #332701;
                    text-align: center;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                `;

                document.body.prepend(
                    banner
                );

            }

            banner.textContent =
                "Sem conexão confirmada. Os dados exibidos podem estar desatualizados.";

        }

    };

    check();

    setInterval(
        check,
        30000
    );

});

// Session timestamps without an offset are stored as UTC by the API.
function sessionDate(value) {
    if (!value) return new Date(NaN);
    const text = String(value);
    return new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(text) ? text : text + 'Z');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function downloadInvoicePdf(url, filename) {
    const response = await apiFetch(url);
    if (!response.ok) {
        let message = `Não foi possível baixar o PDF (${response.status}).`;
        try {
            const data = await response.json();
            if (typeof data.detail === 'string') message = data.detail;
        } catch {}
        throw Error(message);
    }
    downloadBlob(await response.blob(), filename);
}

function escapeText(value) {
    return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function coordinateNumber(value) {
    return value === null || value === undefined || value === '' ? NaN : Number(value);
}

function requireFreshLogin() {
    sessionStorage.removeItem('ev_chargeops_token');
    sessionStorage.removeItem('ev_chargeops_usuario');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
}
