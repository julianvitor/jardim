#!/bin/bash

# Cria e ativa o ambiente virtual
python3 -m venv jardimEnv
source jardimEnv/bin/activate

# Atualiza o código do repositório
git pull

# Instala as dependências
pip install -r requirements.txt

# back
uvicorn gateway:app --reload --workers 1 --host 0.0.0.0 --port 8000 &

# Aguarda um curto período para garantir que o uvicorn tenha iniciado antes de iniciar o gunicorn
sleep 5

# front
gunicorn -w 1 -b 0.0.0.0:5000 views:app
