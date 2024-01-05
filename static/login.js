document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("login-btn").addEventListener("click", function(event) {
        event.preventDefault(); // Evita a submissão automática do formulário

        // Obtém os dados do formulário
        var usuario = document.getElementById("username").value;
        var senha = document.getElementById("password").value;

        // Monta o objeto JSON
        var formData = {
            usuario: usuario,
            senha: senha
        };

        // Monta a URL da API
        var url = window.location.protocol + "//" + window.location.hostname + ":8005/api-login";

        // Faz a requisição POST
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    // Se o status não for bem-sucedido, lançar um erro
                    return response.json().then(errorData => {
                        throw new Error(`Erro no servidor: ${errorData.detail}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // Se chegou aqui, significa que a resposta foi bem-sucedida
                console.log(data.detail);
                // Redirecionar para a página desejada
                window.location.href = window.location.protocol + "//" + window.location.hostname + ':5000/dashboard';
            })
            .catch(error => {
                // Se ocorreu um erro, exibir um alerta com os detalhes da mensagem de erro
                alert("Erro ao logar: " + error.message);
                console.error("Erro:", error.message);
            });
        
        // Retornar false para evitar que o formulário seja enviado normalmente
        return false;
        
    });
});
