from fastapi import FastAPI, HTTPException
from gerador_dados import generate_sensor_data

app = FastAPI()

@app.get('/sensor-data')
async def get_sensor_data():
    sensor_data = generate_sensor_data()
    return sensor_data
