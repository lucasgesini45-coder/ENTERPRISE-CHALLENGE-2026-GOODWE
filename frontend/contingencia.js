const output = document.getElementById('result');
const queueKey = 'evchargeops-pending-measurements-v1';
function queue() {
    const saved = JSON.parse(localStorage.getItem(queueKey) || '[]');
    if (!Array.isArray(saved)) throw Error('Fila local inválida. Preserve os dados e procure suporte.');
    return saved;
}
function saveQueue(items) {
    localStorage.setItem(queueKey, JSON.stringify(items));
    document.getElementById('queue-status').textContent = `${items.length} medição(ões) aguardando reenvio.`;
}
async function send(path, body, method='POST') {
    const response = await apiFetch(API_URL+path, {method, headers: {'Content-Type':'application/json'}, body:JSON.stringify(body)});
    const data = await response.json();
    if (!response.ok) {
        const error = Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
        error.status = response.status;
        throw error;
    }
    return data;
}
function fields(form) {return Object.fromEntries(new FormData(form));}
function display(value) {output.textContent = typeof value === 'string' ? value : JSON.stringify(value,null,2);}
const startForm = document.getElementById('start');
let operationId;
try {operationId = sessionStorage.getItem('evchargeops-start-id') || crypto.randomUUID(); sessionStorage.setItem('evchargeops-start-id',operationId);} catch {operationId=crypto.randomUUID();}
startForm.addEventListener('input',()=>{operationId=crypto.randomUUID();sessionStorage.setItem('evchargeops-start-id',operationId);});
startForm.addEventListener('submit', async event=>{
    event.preventDefault();
    const data=fields(startForm);
    const body={chave_operacao:operationId, usuario_id:Number(data.usuario_id),carregador_id:Number(data.carregador_id),cartao_id:Number(data.cartao_id),inicio:new Date(data.inicio).toISOString(),tarifa:Number(data.tarifa)};
    try {display(await send('/sessoes/',body));} catch(error){display(error.message+' — Tente novamente sem alterar os campos para preservar o identificador.');}
});
document.getElementById('measure').addEventListener('submit',async event=>{
    event.preventDefault();
    const form=event.target, data=fields(form);
    const button=form.querySelector('button');
    if(button.disabled) return;
    button.disabled=true;
    const body={chave_evento:crypto.randomUUID(),instante:new Date(data.instante).toISOString(),consumo_kwh:Number(data.consumo_kwh),encerrar:data.encerrar==='true'};
    const item={path:`/sessoes/${Number(data.sessao_id)}/medicoes`,body};
    try {
        // Persist before transmission: loss of the response never loses the retry identifier.
        const items=queue();items.push(item);saveQueue(items);
        display(await send(item.path,item.body));
        saveQueue(queue().filter(entry=>entry.body.chave_evento!==body.chave_evento));
    } catch(error) {display(error.message+' — Confira a fila antes de enviar outra medição.');} finally {button.disabled=false;}
});
document.getElementById('replay').addEventListener('click',async()=>{
    try {
        for(const item of queue()) {
            await send(item.path,item.body);
            saveQueue(queue().filter(entry=>entry.body.chave_evento!==item.body.chave_evento));
        }
        display('Reenvio concluído.');
    } catch(error){display('Reenvio pausado: '+error.message+'. Os itens restantes foram preservados.');}
});
document.getElementById('pending').addEventListener('submit',async event=>{
    event.preventDefault();
    try {display(await send(`/sessoes/${Number(fields(event.target).sessao_id)}/pendente`,{},'PATCH'));} catch(error){display(error.message);}
});
document.getElementById('report').addEventListener('submit',async event=>{
    event.preventDefault();
    try {
        const response=await apiFetch(API_URL+'/goodwe/importar-relatorio',{method:'POST',body:new FormData(event.target)});
        const data=await response.json();
        if(!response.ok) throw Error(JSON.stringify(data.detail));
        display(data);
    } catch(error){display(error.message);}
});
const inspectButton=document.createElement('button');
inspectButton.textContent='Ver a fila de medições';
inspectButton.addEventListener('click',()=>{try{renderQueue();}catch(error){display(error.message);}});
document.getElementById('queue-status').after(inspectButton);
try {saveQueue(queue());} catch(error){display(error.message);}

const archiveKey = queueKey + '-archive';
function discardReviewed(selected) {
    const current = queue();
    const discarded = current.filter(item => selected.has(JSON.stringify(item)));
    if (!discarded.length) throw Error('Selecione as tentativas que já foram revisadas.');
    if (!window.confirm(`Arquivar e retirar ${discarded.length} tentativa(s) da fila? Confira antes se as sessões estão corretas. Isso não altera as sessões nem as faturas.`)) return false;
    const archive = JSON.parse(localStorage.getItem(archiveKey) || '[]');
    if (!Array.isArray(archive)) throw Error('Arquivo local inválido. A fila foi preservada.');
    // Archive first. If storage fails, no pending measurement is discarded.
    archive.push({archivedAt: new Date().toISOString(), items: discarded});
    localStorage.setItem(archiveKey, JSON.stringify(archive));
    saveQueue(current.filter(item => !selected.has(JSON.stringify(item))));
    return true;
}
function renderQueue() {
    const items = queue();
    const panel = document.getElementById('queue-review');
    panel.hidden = false;
    panel.replaceChildren();
    const title = document.createElement('h2');
    title.textContent = 'Revisar tentativas pendentes';
    panel.append(title);
    const note = document.createElement('p');
    note.textContent = 'Selecione somente tentativas já conferidas. O descarte não modifica as sessões no banco. As tentativas ficam arquivadas neste navegador.';
    panel.append(note);
    const selected = new Set();
    for (const item of items) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.width = 'auto';
        checkbox.addEventListener('change', () => {
            const key = JSON.stringify(item);
            if (checkbox.checked) selected.add(key); else selected.delete(key);
        });
        const description = document.createElement('span');
        const instant = sessionDate(item.body.instante);
        description.textContent = ` ${item.path} — ${instant.toLocaleString('pt-BR')} — ${item.body.consumo_kwh} kWh — ${item.body.encerrar ? 'encerramento' : 'medição'}`;
        label.append(checkbox, description);
        panel.append(label);
    }
    if (!items.length) {
        const empty = document.createElement('p');
        empty.textContent = 'Nenhuma tentativa pendente.';
        panel.append(empty);
    }
    const discard = document.createElement('button');
    discard.textContent = 'Arquivar e descartar selecionadas';
    discard.disabled = !items.length;
    discard.addEventListener('click', () => {
        try {
            if (discardReviewed(selected)) {
                renderQueue();
                display('Tentativas selecionadas arquivadas. As sessões no banco foram preservadas.');
            }
        } catch (error) {display(error.message);}
    });
    panel.append(discard);
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Baixar cópia da fila e do arquivo';
    exportButton.addEventListener('click', () => {
        try {
            const data = {pending: queue(), archived: JSON.parse(localStorage.getItem(archiveKey) || '[]')};
            downloadBlob(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}), 'tentativas-recarga.json');
        } catch (error) {display(error.message);}
    });
    panel.append(exportButton);
}
