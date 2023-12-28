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

# Inicie os serviç
uvicorn gateway:app --reload --workers 1 --host 0.0.0.0 --port 8000


kill_process_by_port() {
  local port=$1
  local pid=$(netstat -tulpn 2>/dev/null | grep ":$port" | awk '{print $7}' | awk -F'/' '{print $1}')
  
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
kill_process_by_port 8002
kill_process_by_port 8003

pkill gunicorn
sleep 1
pkill uvicorn

#serviço sensores
uvicorn sensores.main:app --workers 2 --host 0.0.0.0 --port 8001 &

#serviço regar
uvicorn regar.main:app --workers 2 --host 0.0.0.0 --port 8002 &

# front
gunicorn -w 2 -b 0.0.0.0:5000 views:app &
