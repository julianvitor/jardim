from pydantic import BaseModel
from fastapi import APIRouter, Body, HTTPException

router = APIRouter()

class DadosCadastroModelo(BaseModel):
    usuario: str
    senha: str

@router.post('/cadastro')
async def cadastro(dados_cadastro_json: DadosCadastroModelo = Body(...)):
    dados_sanitizados = sanitizar_validar(dados_cadastro_json)
    usuario = dados_sanitizados["usuario"]
    senha = dados_sanitizados["senha"]

    resposta = {"message": f"Cadastro realizado com sucesso. Usuario{usuario}, Senha: {senha}"}
    return resposta

async def sanitizar_validar(dados: dict) -> str:
    #sanitizar
    usuario = dados["usuario"].strip()
    senha = dados["senha"].strip()
    usuario = usuario.lower()
    
    #validar
    if "usuario" in dados and "senha" in dados:
        for caractere in ["'", '"', ';', '--', '/*', '%', '=', 'UNION', '--+']:
            if caractere in usuario or caractere in senha:
                raise HTTPException(status_code=400, detail = f"A presença do caractere '{caractere}' não é permitida.")
            return {"usuario": usuario, "senha": senha}
        
    elif usuario == "" or senha == "":
        raise HTTPException(status_code=400, detail="Dados inválidos, usuario e senha devem estar presentes")
    
    else:
        raise HTTPException(status_code=400, detail="Dados inválidos, usuario e senha devem estar presentes")
