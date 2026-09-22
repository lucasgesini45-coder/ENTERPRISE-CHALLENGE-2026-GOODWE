from fastapi import APIRouter

router = APIRouter(
    prefix="/carregadores",
    tags=["Carregadores"]
)


@router.get("/")
def listar_carregadores():
    return {
        "carregadores": []
    }