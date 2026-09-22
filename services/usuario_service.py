usuarios = []


def listar_todos_usuarios():
    return usuarios


def criar_novo_usuario(usuario):
    novo_usuario = {
        "id": len(usuarios) + 1,
        **usuario.model_dump()
    }

    usuarios.append(novo_usuario)

    return novo_usuario