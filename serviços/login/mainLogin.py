import sys
sys.path.append('.')
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .login import router as rota_login
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

app.include_router()