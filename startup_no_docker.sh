#!/bin/bash

# Cria e ativa o ambiente virtual
python3 -m venv jardimEnv
source jardimEnv/bin/activate

# Atualiza o código do repositório
git pull

# Instala as dependências
pip install -r requirements.txt

kill_process_by_port() {
  local port=$1
  local pid=$(lsof -t -i :$port)
  
  if [ -n "$pid" ]; then
    echo "Killing process using port $port (PID: $pid)"
    kill -9 $pid
  else
    echo "No process found using port $port"
  fi
}

# Matar processos nas portas especificadas
kill_process_by_port 5000
kill_process_by_port 8000
kill_process_by_port 8001

# gateway
uvicorn gateway:app --reload --workers 2 --host 0.0.0.0 --port 8000 &

# Aguarda um curto período para garantir que o uvicorn tenha iniciado antes de iniciar o gunicorn
sleep 5

#serviço sensores
uvicorn sensores.main:app --reload --workers 2 --host 0.0.0.0 --port 8001 &

# Aguarda um curto período para garantir que o uvicorn tenha iniciado antes de iniciar o gunicorn
sleep 5

# front
gunicorn -w 2 -b 0.0.0.0:5000 views:app
