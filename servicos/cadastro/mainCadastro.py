import sys
sys.path.append('.')
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from .cadastro import router as rota_cadastro
from .cadastro import HandlerDb


app = FastAPI()

origins = [
    "http://localhost:5000",
    "http://172.20.87.188:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#incluir o roteador do cadastro
app.include_router(rota_cadastro)

app.add_event_handler("startup", HandlerDb.iniciar_cliente_db)
app.add_event_handler("startup", HandlerDb.criar_tabela)
app.add_event_handler("shutdown", HandlerDb.desligar_cliente_db)

@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404