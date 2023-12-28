from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from .sensores import router as rota_sensores
app = FastAPI()

# Configurar middleware CORS pois é um atribudo apeas do FastApi e não do router
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
# Incluir o roteador do sensores
app.include_router(rota_sensores)

@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('../static/error_images/404.jpg'), 404
