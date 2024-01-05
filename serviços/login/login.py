import bcrypt
import asyncpg
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel


router = APIRouter()

DATABASE_URL = "postgresql://usuario:senha@localhost:5432/banco_jardim"
database_pool = None
payload = Body(...)

class ModeloDadosLogin(BaseModel):
    usuario: str
    senha: str

class ValidarLogin:
    def __init__(self, usuario):
        self.usuario = usuario

    async def consultar_senha_hash(self):
        async with database_pool.acquire() as conexao:
            query = "SELECT senha_hash FROM cadastro WHERE usuario = $1"
            senha_hash = await conexao.fetchval(query, self.usuario)
            if senha_hash:
                usuario_existe = True
                return usuario_existe, senha_hash
            else:
                usuario_existe = False
                senha_hash = None
                return usuario_existe, senha_hash
            
class HandlerDb:
    async def iniciar_cliente_db():
        global database_pool
        if database_pool == None:
            database_pool = await asyncpg.create_pool(DATABASE_URL)

    async def desligar_cliente_db():
        await database_pool.close()

async def sanitizar_validar_entrada(dados: ModeloDadosLogin = payload)-> ModeloDadosLogin:
    #sanitizar
    usuario = dados.usuario.strip().lower()
    senha = dados.senha.strip()

    #validar
    SENHA_TAMANHO_MINIMO: int = 8
    SENHA_TAMANHO_MAXIMO: int = 30
    USUARIO_TAMANHO_MINIMO: int = 1
    USUARIO_TAMANHO_MAXIMO: int = 30

    if not usuario or not senha:
        raise HTTPException(status_code=400, detail="Usuário e senha são obrigatórios.")
    
    if usuario == "admin" or senha == "admin":
        raise HTTPException(status_code=200, detail= "Continue tentando...")
    
    if len(usuario) < USUARIO_TAMANHO_MINIMO or len(senha) < SENHA_TAMANHO_MINIMO:
        raise HTTPException(status_code=400, detail=f"Usuário deve ter entre {USUARIO_TAMANHO_MINIMO} e {USUARIO_TAMANHO_MAXIMO} caracteres e senha deve ter entre {SENHA_TAMANHO_MINIMO} e {SENHA_TAMANHO_MAXIMO} caracteres.")
    
    if len(usuario) > USUARIO_TAMANHO_MAXIMO or len(senha) > SENHA_TAMANHO_MAXIMO:
        raise HTTPException(status_code=400, detail=f"Usuário deve ter entre {USUARIO_TAMANHO_MINIMO} e {USUARIO_TAMANHO_MAXIMO} caracteres e senha deve ter entre {SENHA_TAMANHO_MINIMO} e {SENHA_TAMANHO_MAXIMO} caracteres. ")
    
    if usuario == senha:
        raise HTTPException(status_code=400, detail="Usuário e senha devem ser diferentes.")
    
    for caractere_perigoso in ["'", '"', ';', '--', '/*', '%', '=', 'UNION', '--+']:
        if caractere_perigoso in usuario or caractere_perigoso in senha:
            raise HTTPException(status_code=400, detail=f"A presença do caractere '{caractere_perigoso}' não é permitida.")
        
    return ModeloDadosLogin(usuario=usuario, senha=senha)

@router.post("/api-login")
async def login(dados: ModeloDadosLogin = payload) -> None: #parametro dado do tipo modelopydantic recebendo o objeto payload
    dados_sanitizados = await sanitizar_validar_entrada(dados)
    usuario, senha = dados_sanitizados.usuario, dados_sanitizados.senha
    
    validar_login = ValidarLogin(usuario)
    usuario_existe, senha_hash = await validar_login.consultar_senha_hash()
    
    if usuario_existe:
        senha_esta_correta = bcrypt.checkpw(senha.encode('utf-8'), senha_hash.encode('utf-8'))
        if senha_esta_correta:
            raise HTTPException(status_code=200, detail="Login realizado com sucesso.")
        else:
            raise HTTPException(status_code=401, detail="Senha incorreta.")
    else:
        raise HTTPException(status_code=401, detail="Usuário não cadastrado.")
