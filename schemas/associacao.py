from pydantic import BaseModel


class AssociacaoSessaoUsuario(BaseModel):
    sessao_id: int
    usuario_id: int


class AssociacaoLote(BaseModel):
    associacoes: list[AssociacaoSessaoUsuario]