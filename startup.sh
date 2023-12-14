#!/bin/bash

# Navegue até o diretório do repositório
cd /app/jardim

# Atualize o código do repositório com git pull
git pull

cd app/jardim

# Instale as dependências do Flask
pip install -r requirements.txt

# Inicie o aplicativo Flask
gunicorn -w 4 -b 0.0.0.0:5001 app:app

