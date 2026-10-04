from dataclasses import dataclass
from enum import Enum

from pydantic import BaseModel, Field


class Papel(str, Enum):
    ADMIN = "admin"
    USUARIO = "usuario"


@dataclass(frozen=True)
class ContextoUsuario:
    """Quem está perguntando e qual escopo de dados ele enxerga."""

    papel: Papel
    usuario_id: int | None = None  # None para admin


class PerguntaIn(BaseModel):
    pergunta: str = Field(min_length=3, max_length=300)
    # None = administrador (visão geral); com id = só os dados desse usuário
    usuario_id: int | None = None


class RespostaOut(BaseModel):
    resposta: str
    intencao: str
    periodo: str | None = None
    dados: dict | None = None
    aviso: str | None = None
