#!/bin/bash

# Navegue até o diretório do repositório
cd /app/jardim

# Atualize o código do repositório com git pull
git pull

cd app/jardim

# Instale as dependências do Flask
pip install -r requirements.txt

# Inicie o front flask
gunicorn -w 1 -b 0.0.0.0:5000 views:app

# Inicie o back fastapi
uvicorn gateway:app --reload --workers 1 --host 0.0.0.0 --port 8000
