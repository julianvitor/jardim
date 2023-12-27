from fastapi import FastAPI
from fastapi.responses import FileResponse 
from fastapi.middleware.cors import CORSMiddleware

from regar.regar import router as rota_regar

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

app.include_router(rota_regar)

# Tratamento de erro para a página não encontrada (404)
@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404
