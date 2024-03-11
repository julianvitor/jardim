import sys
sys.path.append('.')
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from .login import router as rota_login
from .login import HandlerDb

DATABASE_URL_CONF = "postgresql://usuario:senha@localhost:5432/banco_jardim"

app = FastAPI()

origins = [
    "http://localhost:5000",
    "http://172.20.87.188:5000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rota_login)
async def ao_ligar(DATABASE_URL = DATABASE_URL_CONF):#a pré atribuição a database_url permite retutilizar essa função no teste
    await HandlerDb.iniciar_cliente_db(DATABASE_URL)

async def ao_desligar():
    await HandlerDb.desligar_cliente_db()

app.add_event_handler("startup", ao_ligar)
app.add_event_handler("shutdown", ao_desligar)

@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404
