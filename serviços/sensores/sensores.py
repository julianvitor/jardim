# sensores.py
import sys
sys.path.append('.')  # Adiciona a lista de onde o Python busca módulos
from fastapi import APIRouter
from .gerador_dados import generate_sensor_data

router = APIRouter()

@router.get('/api-sensor-data')
async def get_sensor_data():
    sensor_data = generate_sensor_data()
    return sensor_data

