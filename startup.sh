#!/bin/bash

# Função para instalar pacotes do sistema, incluindo o PostgreSQL
install_system_dependencies() {
    echo "Verificando dependências do sistema..."
    sudo apt update
    sudo apt install -y python3.12 python3.12-venv python3.12-dev build-essential libpq-dev net-tools postgresql postgresql-contrib python3-pip
    echo "Dependências do sistema instaladas."
}

# Função para configurar o PostgreSQL
setup_postgresql() {
    echo "Configurando o banco de dados PostgreSQL..."

    # Variáveis de configuração do banco
    DB_NAME="jardim"
    DB_USER="teste"
    DB_PASSWORD="senha"
    
    # Inicia o serviço do PostgreSQL
    sudo service postgresql start

    # Cria o banco de dados se não existir
    sudo -u postgres psql -c "DO \$\$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '$DB_NAME') THEN
            CREATE DATABASE $DB_NAME;
        END IF;
    END \$\$;"

    # Cria o usuário, se necessário, e garante que tenha permissões adequadas
    sudo -u postgres psql -c "DO \$\$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER') THEN
            CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
        END IF;
        GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
    END \$\$;"

    echo "Banco de dados PostgreSQL configurado."
}
# Cria e ativa o ambiente virtual
setup_virtual_environment() {
    echo "Configurando o ambiente virtual..."
    python3.12 -m venv jardimEnv
    source jardimEnv/bin/activate
    pip install --upgrade pip
    echo "Ambiente virtual configurado."
}

# Instala as dependências do projeto
install_project_dependencies() {
    if [ -f "requirements.txt" ]; then
        echo "Instalando dependências do projeto..."
        pip install -r requirements.txt
        echo "Dependências do projeto instaladas."
    else
        echo "Arquivo requirements.txt não encontrado. Verifique e tente novamente."
        exit 1
    fi
}

# Função para matar processos em portas específicas
kill_process_by_port() {
    local port=$1
    local pid=$(netstat -tulpn 2>/dev/null | grep ":$port" | awk '{print $7}' | awk -F'/' '{print $1}')
    if [ -n "$pid" ]; then
        echo "Matando processo na porta $port (PID: $pid)..."
        kill -9 $pid
    else
        echo "Nenhum processo encontrado na porta $port."
    fi
}

# Finaliza processos em portas específicas
kill_ports_and_processes() {
    local ports=(5000 8000 8001 8002 8003 8004 8005)
    echo "Matando processos nas portas específicas..."
    for port in "${ports[@]}"; do
        kill_process_by_port $port
    done

    echo "Finalizando processos do gunicorn e uvicorn..."
    pkill gunicorn
    pkill uvicorn
    sleep 3
    pkill gunicorn
    pkill uvicorn
}

# Instala as ferramentas gunicorn e uvicorn, se necessário
check_and_install_applications() {
    local applications=("gunicorn" "uvicorn")
    echo "Verificando e instalando ferramentas necessárias..."
    for app in "${applications[@]}"; do
        if ! command -v $app &> /dev/null; then
            echo "$app não está instalado. Instalando..."
            pip install $app
        else
            echo "$app já está instalado."
        fi
    done
}

# Inicia os serviços do projeto
start_services() {
    echo "Iniciando serviços..."
    python3.12 -m uvicorn servicos.sensores.mainSensores:app --reload --workers 1 --host 0.0.0.0 --port 8001 &
    sleep 1

    python3.12 -m uvicorn servicos.regar.mainRegar:app --reload --workers 1 --host 0.0.0.0 --port 8002 &
    sleep 1

    python3.12 -m uvicorn servicos.gerenciamento.mainGerenciamento:app --reload --workers 1 --host 0.0.0.0 --port 8003 &
    sleep 1

    python3.12 -m uvicorn servicos.cadastro.mainCadastro:app --reload --workers 1 --host 0.0.0.0 --port 8004 &
    sleep 1

    python3.12 -m uvicorn servicos.login.mainLogin:app --reload --workers 1 --host 0.0.0.0 --port 8005 &
    sleep 1
}

# Inicia o front-end
start_frontend() {
    echo "Iniciando o front-end..."
    python3.12 views.py
}

# Executa as funções sequencialmente
main() {
    install_system_dependencies
    setup_postgresql
    setup_virtual_environment
    install_project_dependencies
    kill_ports_and_processes
    check_and_install_applications
    start_services
    start_frontend
}

# Chama a função principal
main
