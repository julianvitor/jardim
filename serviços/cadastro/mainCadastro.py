import sys
sys.path.append('.')
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from .cadastro import router as rota_cadastro
from .cadastro import iniciar_cliente_db

app = FastAPI()
app.add_event_handler("startup", iniciar_cliente_db)#iniciar banco ao iniciar serviço

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

@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404
