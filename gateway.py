from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse  # Importe FileResponse corretamente
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from sensores.sensores import router as rota_sensores
from regar.regar import router as rota_regar



app = FastAPI()

# Configurar middleware CORS
origins = [
    "http://127.0.0.1:5000",  # Origem do front-end
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo rotas dos sensores e de regar
app.include_router(rota_sensores)
app.include_router(rota_regar)

# Tratamento de erro para a página não encontrada (404)
@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404
