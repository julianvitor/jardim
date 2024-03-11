#!/bin/bash

# Cria e ativa o ambiente virtual
python3.12 -m venv jardimEnv
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
kill_process_by_port 8004
kill_process_by_port 8005

pkill gunicorn
pkill uvicorn

sleep 3 

pkill gunicorn
pkill uvicorn

# List of applications to check and install
applications=("gunicorn" "uvicorn")

# Function to check and install an application
check_and_install() {
    app=$1
    if ! command -v $app &> /dev/null; then
        echo "$app is not installed. Installing..."
        sudo apt install $app
    else
        echo "$app is already installed."
    fi
}

# Loop through the applications and check/install them
for app in "${applications[@]}"; do
    check_and_install $app
done
#serviço sensores
python3.12 -m uvicorn servicos.sensores.mainSensores:app --reload --workers 1 --host 0.0.0.0 --port 8001 &
sleep 1

#serviço regar
python3.12 -m uvicorn servicos.regar.mainRegar:app --reload --workers 1 --host 0.0.0.0 --port 8002 &
sleep 1

#serviço gerencimento
python3.12 -m uvicorn servicos.gerenciamento.mainGerenciamento:app --reload --workers 1 --host 0.0.0.0 --port 8003 &
sleep 1

#serviço gerencimento
python3.12 -m uvicorn servicos.cadastro.mainCadastro:app --reload --workers 1 --host 0.0.0.0 --port 8004 &
sleep 1

python3.12 -m uvicorn servicos.login.mainLogin:app --reload --workers 1 --host 0.0.0.0 --port 8005 &

# front
python3.12 views.py

