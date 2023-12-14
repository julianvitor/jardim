from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from flask_minify import Minify
from sensores.gerador_dados import generate_sensor_data
from sensores.sensores import router as rota_sensores

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
minify = Minify(app=app, js=True)

app.include_router(rota_sensores)


@app.get('/robots.txt')
async def serve_robots():
    with open('static/robots.txt', 'rb') as file:
        content = file.read()
    
    return Response(content, media_type='text/plain')

# Para lidar com erros 404, você pode usar o manipulador padrão do FastAPI
@app.exception_handler(404)
async def page_not_found(request, exc):
    return FileResponse('static/error_images/404.jpg'), 404
