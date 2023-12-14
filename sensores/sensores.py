# sensores.py
from fastapi import APIRouter, HTTPException
from sensores.gerador_dados import generate_sensor_data

router = APIRouter()

@router.get('/sensor-data')
async def get_sensor_data():
    sensor_data = generate_sensor_data()
    return sensor_data
