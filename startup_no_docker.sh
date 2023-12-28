#!/bin/bash

# Cria e ativa o ambiente virtual
python3 -m venv jardimEnv
source jardimEnv/bin/activate

# Instala as dependências
pip install -r requirements.txt

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
uvicorn sensores.main:app --reload --workers 1 --host 0.0.0.0 --port 8001 &
sleep 1

#serviço regar
uvicorn regar.main:app --reload --workers 1 --host 0.0.0.0 --port 8002 &
sleep 1

#serviço gerencimento
uvicorn gerenciamento.main:app --reload --workers 1 --host 0.0.0.0 --port 8003 &
sleep 1

# front
python3 views.py

