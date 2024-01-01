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
pkill uvicorn

sleep 3 

pkill gunicorn
pkill uvicorn

sudo apt install gunicorn
sudo apt install uvicorn

#serviço sensores
uvicorn serviços.sensores.mainSensores:app --reload --workers 1 --host 0.0.0.0 --port 8001 &
sleep 1

#serviço regar
uvicorn serviços.regar.mainRegar:app --reload --workers 1 --host 0.0.0.0 --port 8002 &
sleep 1

#serviço gerencimento
uvicorn serviços.gerenciamento.mainGerenciamento:app --reload --workers 1 --host 0.0.0.0 --port 8003 &
sleep 1

#serviço gerencimento
uvicorn serviços.cadastro.mainCadastro:app --reload --workers 1 --host 0.0.0.0 --port 8004 &
sleep 1

# front
python3 views.py

