from fastapi import APIRouter

router = APIRouter()

@router.post('/api-water-plant')
async def water_plant():
    response = {"message": "Regando"}
    return response
