# Use a imagem base Python 3.11
FROM python:3.11

# Atualize o sistema e instale o Git
RUN apt-get update && apt-get install -y git

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Clone o repositório Git
RUN git clone -b master https://github.com/julianvitor/jardim.git

# Copie os scripts de inicialização para o contêiner
COPY jardim/startup/startup.sh /app/startup.sh

# Torne os scripts de inicialização executáveis
RUN chmod +x /app/startup.sh
