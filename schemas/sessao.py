from pydantic import BaseModel, Field, AwareDatetime, ConfigDict


class SessaoCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    chave_operacao: str = Field(min_length=1, max_length=128)
    usuario_id: int = Field(gt=0)
    carregador_id: int = Field(gt=0)
    cartao_id: int = Field(gt=0)
    inicio: AwareDatetime
    tarifa: float = Field(default=0, ge=0, allow_inf_nan=False)


class MedicaoSessao(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    chave_evento: str = Field(min_length=1, max_length=128)
    instante: AwareDatetime
    consumo_kwh: float = Field(ge=0, allow_inf_nan=False)
    encerrar: bool = False


class SessaoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario_id: int | None
    carregador_id: int
    inicio: AwareDatetime
    fim: AwareDatetime | None = None
    consumo_kwh: float | None
    status: str
