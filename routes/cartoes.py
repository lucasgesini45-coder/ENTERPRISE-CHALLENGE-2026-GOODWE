from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from schemas.cartao import CartaoCreate, CartaoAssociar, CartaoStatus
from services.cartao_service import (
    listar_todos_cartoes,
    buscar_cartao_por_id,
    criar_novo_cartao,
    associar_cartao_usuario,
    alterar_status_cartao,
    desassociar_cartao,
)

router = APIRouter(prefix="/cartoes", tags=["Cartões RFID"])


@router.get("/manutencao", response_class=HTMLResponse, include_in_schema=False)
def caixa_manutencao():
    return HTMLResponse("""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>EV ChargeOps | Manutenção RFID</title>
<style>
:root{font-family:Inter,system-ui,Arial,sans-serif;color:#17212b;background:#f4f7f9}*{box-sizing:border-box}body{margin:0}.top{background:#101b24;color:white;padding:22px 6vw}.top b{font-size:22px}.top span{color:#9ed8bd}.wrap{max-width:1100px;margin:28px auto;padding:0 20px}.grid{display:grid;grid-template-columns:1fr 1.4fr;gap:20px}.card{background:white;border:1px solid #dfe7eb;border-radius:14px;padding:20px;box-shadow:0 4px 18px #0000000a}h2{margin-top:0;font-size:18px}label{display:block;font-size:13px;margin:12px 0 5px}input,select,button{width:100%;padding:10px;border-radius:8px;border:1px solid #cbd7dd}button{background:#176b4b;color:white;border:0;font-weight:700;cursor:pointer;margin-top:12px}.secondary{background:#334b5c}.danger{background:#9b3434}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.item{border:1px solid #e1e8ec;border-radius:10px;padding:13px;margin:9px 0}.badge{font-size:11px;padding:4px 8px;border-radius:999px;background:#e7f5ee}.muted{color:#657680;font-size:13px}.actions{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.actions button{font-size:12px;padding:8px}.msg{min-height:22px;margin-top:10px;font-size:13px}@media(max-width:760px){.grid{grid-template-columns:1fr}.actions{grid-template-columns:1fr}.row{grid-template-columns:1fr}}
</style></head><body>
<div class="top"><b>EV <span>ChargeOps</span></b><div class="muted" style="color:#c7d2d8">Caixa de manutenção • Cartões RFID</div></div>
<div class="wrap"><div class="grid">
<section class="card"><h2>Cadastrar cartão</h2><label>UID do cartão</label><input id="uid" placeholder="Ex.: RFID-A1B2C3"><div class="row"><div><label>ID do usuário (opcional)</label><input id="usuario" type="number" min="1" placeholder="Ex.: 1"></div><div><label>Status</label><select id="status"><option>ATIVO</option><option>BLOQUEADO</option><option>CANCELADO</option></select></div></div><button onclick="criar()">Cadastrar cartão</button><div id="msg" class="msg"></div></section>
<section class="card"><h2>Cartões cadastrados</h2><div class="muted">Gerencie associação e status das credenciais.</div><div id="lista"></div></section>
</div></div>
<script>
const api='/cartoes'; const msg=t=>document.getElementById('msg').textContent=t;
async function req(url,opt={}){const r=await fetch(url,{headers:{'Content-Type':'application/json'},...opt});const d=await r.json();if(!r.ok)throw Error(d.detail||'Erro na operação');return d}
async function criar(){try{const uid=document.getElementById('uid').value.trim();if(!uid)return msg('Informe o UID.');const u=document.getElementById('usuario').value;await req(api+'/',{method:'POST',body:JSON.stringify({uid,usuario_id:u?Number(u):null,status:document.getElementById('status').value})});msg('Cartão cadastrado com sucesso.');document.getElementById('uid').value='';await carregar()}catch(e){msg(e.message)}}
async function statusCartao(id,status){try{await req(`${api}/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});await carregar()}catch(e){alert(e.message)}}
async function associar(id){const u=prompt('ID do usuário a associar:');if(!u)return;try{await req(`${api}/${id}/associar`,{method:'PATCH',body:JSON.stringify({usuario_id:Number(u)})});await carregar()}catch(e){alert(e.message)}}
async function desassociar(id){try{await req(`${api}/${id}/desassociar`,{method:'PATCH'});await carregar()}catch(e){alert(e.message)}}
async function carregar(){try{const d=await req(api+'/');const el=document.getElementById('lista');el.innerHTML=d.cartoes.length?'':'<p class="muted">Nenhum cartão cadastrado.</p>';d.cartoes.forEach(c=>{el.innerHTML+=`<div class="item"><b>${c.uid}</b> <span class="badge">${c.status}</span><div class="muted">Cartão #${c.id} • Usuário: ${c.usuario_id??'não associado'}</div><div class="actions"><button class="secondary" onclick="associar(${c.id})">Associar</button><button class="secondary" onclick="desassociar(${c.id})">Desassociar</button><button class="${c.status==='BLOQUEADO'?'':'danger'}" onclick="statusCartao(${c.id},'${c.status==='BLOQUEADO'?'ATIVO':'BLOQUEADO'}')">${c.status==='BLOQUEADO'?'Ativar':'Bloquear'}</button></div></div>`})}catch(e){document.getElementById('lista').innerHTML='<p>Falha ao carregar.</p>'}}
carregar();
</script></body></html>""")


@router.get("/")
def listar_cartoes():
    return {"cartoes": listar_todos_cartoes()}


@router.post("/")
def criar_cartao(cartao: CartaoCreate):
    return criar_novo_cartao(cartao)


@router.get("/{cartao_id}")
def consultar_cartao(cartao_id: int):
    return buscar_cartao_por_id(cartao_id)


@router.patch("/{cartao_id}/associar")
def associar_usuario(cartao_id: int, dados: CartaoAssociar):
    return associar_cartao_usuario(cartao_id, dados.usuario_id)


@router.patch("/{cartao_id}/status")
def atualizar_status(cartao_id: int, dados: CartaoStatus):
    return alterar_status_cartao(cartao_id, dados.status)


@router.patch("/{cartao_id}/desassociar")
def desassociar_usuario(cartao_id: int):
    return desassociar_cartao(cartao_id)
