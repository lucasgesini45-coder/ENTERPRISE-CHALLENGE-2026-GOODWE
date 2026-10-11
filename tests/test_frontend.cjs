const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {randomUUID} = require('node:crypto');
const script = fs.readFileSync('frontend/contingencia.js','utf8');
function storage() {
    const items=new Map();
    return {getItem:key=>items.get(key)||null,setItem:(key,value)=>items.set(key,value)};
}
function setup(local=storage(),session=storage(),send=async()=>{throw Error('offline')}) {
    const elements={};
    function element(id) {
        if(!elements[id]) elements[id]={listeners:{},values:{},textContent:'',style:{},children:[],button:{disabled:false},
            append(...nodes){this.children.push(...nodes);},replaceChildren(){this.children=[];},
            addEventListener(type,fn){this.listeners[type]=fn;},querySelector(){return this.button;},after(){}};
        return elements[id];
    }
    const context={document:{getElementById:element,createElement:()=>element('dynamic-'+randomUUID())},
        localStorage:local,sessionStorage:session,crypto:{randomUUID},API_URL:'http://localhost',
        window:{confirm:()=>true}, sessionDate:value=>new Date(value), apiFetch:send,Date,FormData:class{constructor(form){this.form=form;}[Symbol.iterator](){return Object.entries(this.form.values)[Symbol.iterator]();}}};
    vm.createContext(context);vm.runInContext(script,context);
    return {elements,local,session,context};
}
function submit(form) {return form.listeners.submit({target:form,preventDefault(){}});}

test('offline measurement survives reload and keeps retry event ID',async()=>{
    const first=setup();
    first.elements.measure.values={sessao_id:'1',instante:'2026-10-08T10:00',consumo_kwh:'1.5',encerrar:'false'};
    await submit(first.elements.measure);
    const saved=JSON.parse(first.local.getItem('evchargeops-pending-measurements-v1'));
    assert.equal(saved.length,1);
    assert.ok(saved[0].body.chave_evento);
    assert.equal(first.elements.measure.button.disabled,false);
    const seen=[];
    const second=setup(first.local,first.session,async(url,opts)=>{
        seen.push(JSON.parse(opts.body));return {ok:true,json:async()=>({id:1})};
    });
    await second.elements.replay.listeners.click();
    assert.equal(seen[0].chave_evento,saved[0].body.chave_evento);
    assert.deepEqual(JSON.parse(first.local.getItem('evchargeops-pending-measurements-v1')),[]);
});

test('lost response retains persisted measurement for idempotent replay',async()=>{
    const app=setup();
    app.elements.measure.values={sessao_id:'1',instante:'2026-10-08T10:00',consumo_kwh:'2',encerrar:'true'};
    await submit(app.elements.measure);
    const before=app.local.getItem('evchargeops-pending-measurements-v1');
    await app.elements.replay.listeners.click();
    assert.equal(app.local.getItem('evchargeops-pending-measurements-v1'),before);
});

test('start retries preserve operation ID while changing input creates a new operation',async()=>{
    const seen=[];
    const app=setup(undefined,undefined,async(url,opts)=>{seen.push(JSON.parse(opts.body));throw Error('lost response');});
    app.elements.start.values={usuario_id:'1',carregador_id:'1',cartao_id:'1',inicio:'2026-10-08T10:00',tarifa:'0.95'};
    await submit(app.elements.start);await submit(app.elements.start);
    assert.equal(seen[0].chave_operacao,seen[1].chave_operacao);
    app.elements.start.listeners.input();
    await submit(app.elements.start);
    assert.notEqual(seen[0].chave_operacao,seen[2].chave_operacao);
});


test('reviewed discard archives only selected entries without sending requests',()=>{
    const local = storage();
    const entries = [{path:'/sessoes/1/medicoes',body:{chave_evento:'old'}}, {path:'/sessoes/5/medicoes',body:{chave_evento:'pending'}}];
    local.setItem('evchargeops-pending-measurements-v1',JSON.stringify(entries));
    const app=setup(local);
    app.context.selected = new Set([JSON.stringify(entries[0])]);
    vm.runInContext('discardReviewed(selected)',app.context);
    assert.deepEqual(JSON.parse(local.getItem('evchargeops-pending-measurements-v1')),[entries[1]]);
    assert.deepEqual(JSON.parse(local.getItem('evchargeops-pending-measurements-v1-archive'))[0].items,[entries[0]]);
});

test('cancelled discard preserves queue and creates no archive',()=>{
    const app=setup();
    const entry={body:{chave_evento:'keep'}};
    app.local.setItem('evchargeops-pending-measurements-v1',JSON.stringify([entry]));
    app.context.window.confirm=()=>false;
    app.context.selected=new Set([JSON.stringify(entry)]);
    vm.runInContext('discardReviewed(selected)',app.context);
    assert.equal(app.local.getItem('evchargeops-pending-measurements-v1-archive'),null);
    assert.deepEqual(JSON.parse(app.local.getItem('evchargeops-pending-measurements-v1')),[entry]);
});

test('archive storage failure never removes a pending measurement',()=>{
    const local=storage();
    const entry={body:{chave_evento:'keep'}};
    local.setItem('evchargeops-pending-measurements-v1',JSON.stringify([entry]));
    const app=setup(local);
    const original=local.setItem;
    local.setItem=(key,value)=>{if(key.endsWith('-archive')) throw Error('quota');original(key,value);};
    app.context.selected=new Set([JSON.stringify(entry)]);
    assert.throws(()=>vm.runInContext('discardReviewed(selected)',app.context),/quota/);
    assert.deepEqual(JSON.parse(local.getItem('evchargeops-pending-measurements-v1')),[entry]);
});

function apiContext(fetchImpl) {
    const context={window:{location:{origin:'http://localhost'},addEventListener(){}},
        sessionStorage:{getItem:()=> 'login-token'}, Headers,AbortController,Date,
        setTimeout:()=>1,clearTimeout(){}, fetch:fetchImpl};
    vm.createContext(context);
    vm.runInContext(fs.readFileSync('frontend/api.js','utf8'),context);
    return context;
}

test('PDF fetch sends bearer authentication before downloading the response',async()=>{
    const requests=[],downloads=[];
    const context=apiContext(async(url,opts)=>{
        requests.push(opts);
        return {ok:true,blob:async()=>({pdf:true})};
    });
    context.downloadBlob=(blob,name)=>downloads.push({blob,name});
    await vm.runInContext("downloadInvoicePdf('/invoice/pdf','invoice.pdf')",context);
    assert.equal(requests[0].headers.get('Authorization'),'Bearer login-token');
    assert.equal(downloads[0].name,'invoice.pdf');
});

test('PDF authentication error is reported without downloading JSON as PDF',async()=>{
    const context=apiContext(async()=>({ok:false,status:401,json:async()=>({detail:'Login expirado'})}));
    context.downloadBlob=()=>assert.fail('must not download');
    await assert.rejects(vm.runInContext("downloadInvoicePdf('/pdf','invoice.pdf')",context),/Login expirado/);
});

test('naive UTC timestamps and explicitly zoned timestamps preserve their instant',()=>{
    const context=apiContext(()=>{});
    assert.equal(vm.runInContext("sessionDate('2026-10-10T23:40:00').toISOString()",context),'2026-10-10T23:40:00.000Z');
    assert.equal(vm.runInContext("sessionDate('2026-10-10T20:40:00-03:00').toISOString()",context),'2026-10-10T23:40:00.000Z');
});


test('queue review renders selections and discards only the checked attempt',()=>{
    const app=setup();
    const entries=[{path:'/sessoes/1/medicoes',body:{chave_evento:'old',instante:'2026-10-09T03:17:00Z',consumo_kwh:.2,encerrar:true}},
        {path:'/sessoes/5/medicoes',body:{chave_evento:'keep',instante:'2026-10-10T03:17:00Z',consumo_kwh:.1,encerrar:false}}];
    app.local.setItem('evchargeops-pending-measurements-v1',JSON.stringify(entries));
    vm.runInContext('renderQueue()',app.context);
    const panel=app.elements['queue-review'];
    const checkbox=panel.children[2].children[0];
    checkbox.checked=true;
    checkbox.listeners.change();
    const discard=panel.children.find(node=>node.textContent==='Arquivar e descartar selecionadas');
    discard.listeners.click();
    assert.deepEqual(JSON.parse(app.local.getItem('evchargeops-pending-measurements-v1')),[entries[1]]);
});
