# Use a imagem base Python 3.11
FROM python:3.11

# Atualize o sistema e instale o Git
RUN apt-get update && apt-get install -y git

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Clone o repositório Git
RUN git clone -b master https://github.com/julianvitor/jardim.git

# Copie os scripts de inicialização para o contêiner
COPY jardim/startup_back.sh /app/startup_back.sh
COPY jardim/startup_front.sh /app/startup_front.sh

# Torne os scripts de inicialização executáveis
RUN chmod +x /app/startup_back.sh
RUN chmod +x /app/startup_front.sh

# Comando padrão para executar o script definido pela variável de ambiente SCRIPT
CMD ["/bin/bash", "/app/startup_back.sh"]
