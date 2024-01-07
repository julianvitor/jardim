import asyncpg
import bcrypt
from pydantic import BaseModel
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

database_pool = None # Variavel de estado do pool db
payload = Body(...)
#constantes para validação das entradas
SENHA_TAMANHO_MINIMO: int = 8
SENHA_TAMANHO_MAXIMO: int = 30
USUARIO_TAMANHO_MINIMO: int = 1
USUARIO_TAMANHO_MAXIMO: int = 30

class ModeloDadosCadastro(BaseModel):
    usuario: str
    senha: str

class HandlerDb:
    async def criar_tabela()-> None:
        async with database_pool.acquire() as conexao:
            await conexao.execute("""
                CREATE TABLE IF NOT EXISTS cadastro (
                    id SERIAL PRIMARY KEY,
                    usuario VARCHAR(30) UNIQUE NOT NULL,
                    senha_hash VARCHAR(60) NOT NULL
                )
            """)
    async def iniciar_cliente_db(DATABASE_URL: str)-> None:
        global database_pool
        if database_pool == None:
            database_pool = await asyncpg.create_pool(DATABASE_URL)

    async def desligar_cliente_db()-> None:
        await database_pool.close()

class AcessarDb:
    async def verificar_usuario_existe(usuario) -> bool:
        async with database_pool.acquire() as conexao:
            query = "SELECT EXISTS(SELECT 1 FROM cadastro WHERE usuario = $1)"
            result = await conexao.fetchval(query, usuario)
            return result

    async def gravar_dados(usuario, senha_hash)-> None:
        async with database_pool.acquire() as conexao:
            await conexao.execute("INSERT INTO cadastro (usuario, senha_hash) VALUES($1, $2)", usuario, senha_hash)

async def sanitizar_validar(dados: ModeloDadosCadastro) -> ModeloDadosCadastro:
    #sanitizar
    usuario = dados.usuario.strip().lower()
    senha = dados.senha.strip()
    #validar
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

    for caractere_perigoso in ["'", '"', ';', '--', '/*', '%', '=', 'UNION', '--+']:
        if caractere_perigoso in usuario or caractere_perigoso in senha:
            raise HTTPException(status_code=400, detail=f"A presença do caractere '{caractere_perigoso}' não é permitida.")

    return ModeloDadosCadastro(usuario=usuario, senha=senha)

async def criar_hash_senha(senha)-> str:
    salt = bcrypt.gensalt()
    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), salt)
    return senha_hash.decode('utf-8') #traduzir a senha_hash em binario para string utf-8

@router.post('/api-cadastro')
async def cadastro(dados: ModeloDadosCadastro = Body(...)):# o fastapi vai entender que body deve ser do tipo ModeloDadosCadastro sozinho
    dados_sanitizados = await sanitizar_validar(dados)
    usuario, senha = map(str.strip, (dados_sanitizados.usuario, dados_sanitizados.senha))
    usuario = usuario.lower()

    if await AcessarDb.verificar_usuario_existe(usuario):
        raise HTTPException(status_code=409, detail="Usuário já cadastrado")
    
    senha_hash = await criar_hash_senha(senha)
    await AcessarDb.gravar_dados(usuario, senha_hash)
    resposta = {"detail": f"Cadastro realizado com sucesso."}
    return JSONResponse(content=resposta, status_code=201)
