from pydantic import BaseModel
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
import asyncpg
import bcrypt

router = APIRouter()
BANCO_DE_DADOS_URL = "postgresql://user:password@localhost/dbname"

class ModeloDadosCadastro(BaseModel):
    usuario: str
    senha: str

@router.post('/cadastro')
async def cadastro(dados: ModeloDadosCadastro = Body(...)):
    dados_sanitizados = await sanitizar_validar(dados)
    usuario, senha = map(str.strip, (dados_sanitizados.usuario, dados_sanitizados.senha))
    usuario = usuario.lower()
    senha_hash = criar_hash_senha(senha)
    await gravar_dados(usuario, senha_hash)
    resposta = {"message": f"Cadastro realizado com sucesso."}
    return JSONResponse(content=resposta, status_code=200)

async def criar_tabela():
    conexao = await asyncpg.connect(BANCO_DE_DADOS_URL)     
    try:
        await conexao.execute("""
            CREATE TABLE IF NOT EXISTS cadastro (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR(30) UNIQUE NOT NULL,
                senha VARCHAR(30) NOT NULL
            )
        """)
    finally:
        await conexao.close()

async def gravar_dados(usuario, senha_hash):
    conexao = await asyncpg.connect(BANCO_DE_DADOS_URL)
    try:
        await conexao.execute("INSERT INTO usuarios (username, password) VALUES($1, $2)", usuario, senha_hash)
    finally:
        await conexao.close()
    
def criar_hash_senha(senha):
    salt = bcrypt.gensalt()
    senha_hash = bcrypt.hashpw(senha.encode('utf-8'),salt)
    return senha_hash.decode('utf-8') #traduzir a senha_hash em binario para string utf-8

async def sanitizar_validar(dados: ModeloDadosCadastro) -> str:
    #sanitizar
    usuario = dados.usuario.strip().lower()
    senha = dados.senha.strip()

    #validar
    SENHA_TAMANHO_MINIMO: int = 8
    SENHA_TAMANHO_MAXIMO: int = 30
    USUARIO_TAMANHO_MINIMO: int = 3
    USUARIO_TAMANHO_MAXIMO: int = 30

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

