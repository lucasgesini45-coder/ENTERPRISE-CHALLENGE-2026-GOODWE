from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Usuario
from schemas.auth import (
    LoginRequest,
    TokenResponse,
    AlterarSenhaRequest,
    EsqueciSenhaRequest,
    RedefinirSenhaRequest
)

from services.auth_service import (
    verificar_senha,
    gerar_hash_senha,
    criar_access_token,
    obter_usuario_atual,
    obter_usuario_admin,
    criar_token_redefinicao_senha,
    decodificar_token_redefinicao_senha
)

router = APIRouter(
    prefix="/auth",
    tags=["Autenticacao"]
)


@router.post("/login", response_model=TokenResponse)
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.email == dados.email)
        .first()
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos."
        )

    if not usuario.senha or not verificar_senha(
        dados.senha,
        usuario.senha
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos."
        )

    access_token = criar_access_token({
        "sub": str(usuario.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def usuario_logado(
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    return {
        "id": usuario_atual.id,
        "nome": usuario_atual.nome,
        "email": usuario_atual.email,
        "telefone": usuario_atual.telefone,
        "perfil": usuario_atual.perfil
    }


@router.get("/admin/teste")
def testar_acesso_admin(
    usuario_admin: Usuario = Depends(obter_usuario_admin)
):
    return {
        "mensagem": "Acesso administrativo autorizado.",
        "usuario": usuario_admin.nome,
        "perfil": usuario_admin.perfil
    }

@router.put("/alterar-senha")
def alterar_senha(
    dados: AlterarSenhaRequest,
    usuario_atual: Usuario = Depends(obter_usuario_atual),
    db: Session = Depends(get_db)
):
    # Confirma que o usuário realmente possui uma senha cadastrada
    if not usuario_atual.senha:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário não possui senha cadastrada."
        )

    # Confirma a senha atual
    if not verificar_senha(
        dados.senha_atual,
        usuario_atual.senha
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha atual incorreta."
        )

    # Evita senha muito curta
    if len(dados.nova_senha) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A nova senha deve possuir pelo menos 8 caracteres."
        )

    # Evita reutilizar exatamente a mesma senha
    if verificar_senha(
        dados.nova_senha,
        usuario_atual.senha
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A nova senha deve ser diferente da senha atual."
        )

    usuario_atual.senha = gerar_hash_senha(
        dados.nova_senha
    )

    db.commit()
    db.refresh(usuario_atual)

    return {
        "mensagem": "Senha alterada com sucesso."
    }


@router.post("/esqueci-senha")
def esqueci_senha(
    dados: EsqueciSenhaRequest,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.email == dados.email)
        .first()
    )

    mensagem = (
        "Se o e-mail estiver cadastrado, "
        "você receberá instruções para redefinir sua senha."
    )

    # Não revela se o e-mail existe ou não
    if usuario is None:
        return {
            "mensagem": mensagem
        }

    token_reset = criar_token_redefinicao_senha(
        usuario.id
    )

    return {
        "mensagem": mensagem,

        # Apenas durante o desenvolvimento local.
        # Na versão publicada, esse token será enviado por e-mail.
        "token_reset": token_reset
    }

@router.post("/redefinir-senha")
def redefinir_senha(
    dados: RedefinirSenhaRequest,
    db: Session = Depends(get_db)
):
    # Valida o token de recuperação
    dados_token = decodificar_token_redefinicao_senha(
        dados.token
    )

    if dados_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de recuperação inválido ou expirado."
        )

    usuario_id = dados_token.get("sub")

    try:
        usuario_id = int(usuario_id)

    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de recuperação inválido."
        )

    # Procura o usuário associado ao token
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de recuperação inválido."
        )

    # Valida a nova senha
    if len(dados.nova_senha) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A nova senha deve possuir pelo menos 8 caracteres."
        )

    # Gera novo hash
    usuario.senha = gerar_hash_senha(
        dados.nova_senha
    )

    db.commit()
    db.refresh(usuario)

    return {
        "mensagem": "Senha redefinida com sucesso."
    }