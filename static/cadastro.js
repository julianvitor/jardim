function sendFormData() {
    // Obtenha os valores dos campos
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // Valide se senha e repita senha são iguais
    if (password !== confirmPassword) {
        alert("A senha e a repetição da senha devem ser iguais.");
        return false;
    }

    // Construa os dados a serem enviados
    var formData = {
        usuario: username,
        senha: password
    };

    // Construa o endereço completo com o protocolo, host e porta
    var url = window.location.protocol + "//" + window.location.hostname + ":8004/api-cadastro";

    // Envie a requisição POST
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

    // Impede o envio do formulário tradicional
    return false;
}
