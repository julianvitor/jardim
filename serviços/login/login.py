from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import bcrypt
import asyncpg

router = APIRouter
DATABASE_URL = "postgresql://usuario:senha@localhost:5432/banco_jardim"
payload = Body(...)

class ModeloDadosLogin(BaseModel):
    usuario: str
    senha: str
@router.post("/api-login")
async def login(dados: ModeloDadosLogin = payload) -> None: #parametro dado do tipo modelopydantic recebendo o objeto payload
    dados_sanitizados = await sanitizar_validar(dados)
    usuario, senha = dados_sanitizados.usuario, dados_sanitizados_senha
    usuario = usuario.lower()
    senha_hash = bcrypt.hashpw(se)
    if await verificar_usuario_existente(usuario):
        if senha_hash == senha_cadastrada_hash:
            resposta = {"detail": f"Login realizado com sucesso."}
            return JSONResponse(content=resposta, status_code=200)


async def sanitizar_validar(dados: ModeloDadosLogin = payload)-> ModeloDadosLogin:
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
    
    if len(usuario) < SENHA_TAMANHO_MINIMO or len(senha) < SENHA_TAMANHO_MINIMO:
        raise HTTPException(status_code=400, detail=f"Usuário deve ter entre {USUARIO_TAMANHO_MINIMO} e {USUARIO_TAMANHO_MAXIMO} caracteres e senha deve ter entre {SENHA_TAMANHO_MINIMO} e {SENHA_TAMANHO_MAXIMO} caracteres.")
    
    if len(usuario) > USUARIO_TAMANHO_MAXIMO or len(senha) > SENHA_TAMANHO_MAXIMO:
        raise HTTPException(status_code=400, detail=f"Usuário deve ter entre {USUARIO_TAMANHO_MINIMO} e {USUARIO_TAMANHO_MAXIMO} caracteres e senha deve ter entre {SENHA_TAMANHO_MINIMO} e {SENHA_TAMANHO_MAXIMO} caracteres. ")
    
    if usuario == senha:
        raise HTTPException(status_code=400, detail="Usuário e senha devem ser diferentes.")
    
    for caractere_perigoso in ["'", '"', ';', '--', '/*', '%', '=', 'UNION', '--+']:
        if caractere_perigoso in usuario or caractere_perigoso in senha:
            raise HTTPException(status_code=400, detail=f"A presença do caractere '{caractere_perigoso}' não é permitida.")
        
    return ModeloDadosLogin(usuario=usuario, senha=senha)