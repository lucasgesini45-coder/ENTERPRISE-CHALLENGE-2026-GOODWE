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
        if(!elements[id]) elements[id]={listeners:{},values:{},textContent:'',button:{disabled:false},
            addEventListener(type,fn){this.listeners[type]=fn;},querySelector(){return this.button;},after(){}};
        return elements[id];
    }
    const context={document:{getElementById:element,createElement:()=>({textContent:'',addEventListener(){}})},
        localStorage:local,sessionStorage:session,crypto:{randomUUID},API_URL:'http://localhost',
        apiFetch:send,Date,FormData:class{constructor(form){this.form=form;}[Symbol.iterator](){return Object.entries(this.form.values)[Symbol.iterator]();}}};
    vm.createContext(context);vm.runInContext(script,context);
    return {elements,local,session};
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
