from fastapi import HTTPException, APIRouter
import requests
from pydantic import BaseModel
router = APIRouter()
#função proxy para api do openstreetmap
@router.get("/search-city")
async def search(city: str):
    api_url = f'https://nominatim.openstreetmap.org/search?city={city}&format=json&limit=2'
    
    response = requests.get(api_url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Erro ao consultar a API externa")
    
    response = response.json()
    return response
