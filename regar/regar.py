from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.post('/water-plant')
async def water_plant():
    response = {"message": "Regando"}
    return response
