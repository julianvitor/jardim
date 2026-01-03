FROM golang:1.26-alpine3.23
WORKDIR /app
COPY . .
CMD ["go", "run", "main.go"] # comando direto no execve, direto no kernel, sem shell

