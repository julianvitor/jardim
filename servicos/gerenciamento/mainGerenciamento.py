import sys
sys.path.append('.')  # Adiciona a lista de onde o Python busca módulos
from fastapi import FastAPI
from fastapi.responses import FileResponse 
from fastapi.middleware.cors import CORSMiddleware
from .gerenciamento import router as gerenciamento

app = FastAPI()

# Configurar middleware CORS
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
# Incluir o roteador do gerencimento
app.include_router(gerenciamento)

@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404
