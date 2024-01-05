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
        .then(response => response.json())
        .then(data => {
            alert(data.detail);
        })
        .catch(error => {
            alert("Erro ao cadastrar. Detalhes: " + error.message);
            console.error("Erro:", error.message);
        });

        return false;
    });
});
