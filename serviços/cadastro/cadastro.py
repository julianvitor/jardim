from pydantic import BaseModel
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

class ModeloDadosCadastro(BaseModel):
    usuario: str
    senha: str

@router.post('/cadastro')
async def cadastro(dados: ModeloDadosCadastro = Body(...)):
    dados_sanitizados = await sanitizar_validar(dados)
    usuario = dados_sanitizados.usuario.strip()
    senha = dados_sanitizados.senha.strip()
    usuario = usuario.lower()
    await guardar_dados(usuario, senha)
    resposta = {"message": f"Cadastro realizado com sucesso."}
    return JSONResponse(content=resposta, status_code=200)

async def guardar_dados(usuario, senha):
    # essa função é apenas para fins de teste e é totalmente insegura
    with open('teste_cadastro.txt', 'a') as arquivo:
        arquivo.write(f"usuario : {usuario}\n")
        arquivo.write(f"senha : {senha}\n")

async def sanitizar_validar(dados: ModeloDadosCadastro) -> str:
    #sanitizar
    usuario = dados.usuario.strip().lower()
    senha = dados.senha.strip()

    #validar
    SENHA_TAMANHO_MINIMO: int = 8
    SENHA_TAMANHO_MAXIMO: int = 50
    USUARIO_TAMANHO_MINIMO: int = 3
    USUARIO_TAMANHO_MAXIMO: int = 50

    if not usuario or not senha:
        raise HTTPException(status_code=400, detail="Usuário e senha são obrigatórios.")
    if usuario == "admin" or senha == "admin":
        raise HTTPException(status_code=400, detail=" ATA MUITO ENGRAÇADINHO VOCÊ NÉ?")
    
    if len(usuario) < USUARIO_TAMANHO_MINIMO or len(senha) < SENHA_TAMANHO_MINIMO:
        raise HTTPException(status_code=400, detail=f"Usuário deve ter entre {USUARIO_TAMANHO_MINIMO} e {USUARIO_TAMANHO_MAXIMO} caracteres, e senha deve ter entre {SENHA_TAMANHO_MINIMO} e {SENHA_TAMANHO_MAXIMO} caracteres.")

    if usuario == senha:
        raise HTTPException(status_code=400, detail="Usuário e senha devem ser diferentes.")

    if len(usuario) > USUARIO_TAMANHO_MAXIMO or len(senha) > SENHA_TAMANHO_MAXIMO:
        raise HTTPException(status_code=400, detail=f"Usuário deve ter entre {USUARIO_TAMANHO_MINIMO} e {USUARIO_TAMANHO_MAXIMO} caracteres, e senha deve ter entre {SENHA_TAMANHO_MINIMO} e {SENHA_TAMANHO_MAXIMO} caracteres.")

    for caractere in ["'", '"', ';', '--', '/*', '%', '=', 'UNION', '--+']:
        if caractere in usuario or caractere in senha:
            raise HTTPException(status_code=400, detail=f"A presença do caractere '{caractere}' não é permitida.")

    return ModeloDadosCadastro(usuario=usuario, senha=senha)

