class GardenApp {
    constructor() {
        // Elementos do DOM
        this.waterButton = document.getElementById("water-button");

        this.sensorContainer = document.getElementById("sensor-container");

       // Elementos do DOM para eletricidade e reservatórios
       this.sensorERContainer = document.getElementById("sensorER-container");
       this.sensorERList = document.getElementById("sensorER-list");
       this.sensorsERToggle = document.getElementById("sensorsER");
       this.sensorERToggleIcon = document.getElementById("sensorER-toggle-icon");

        this.darkModeToggle = document.getElementById("dark-mode-toggle");
        this.container = document.querySelector(".container");
        this.body = document.body;

        // Modo preferido
        this.preferredMode = localStorage.getItem("preferredMode") || "light";

        // Inicialização
        this.init();
    }

    init() {
        this.addEventListeners();
        this.setMode(this.preferredMode);
        this.fetchAndUpdateSensorData();
        setInterval(() => this.fetchAndUpdateSensorData(), 1000);
    }

    addEventListeners() {
        // Event Listeners
        this.darkModeToggle.addEventListener("click", () => this.toggleDarkMode());
        this.waterButton.addEventListener("click", () => this.waterPlant());
        document.getElementById("sensors").addEventListener("click", () => this.toggleSensorList("sensor-list", "sensor-toggle-icon"));
        
    }

    setMode(mode) {
        // Configuração do Modo
        if (mode === "dark") {
            this.container.classList.add("dark-mode");
            this.body.classList.add("dark-mode");
            this.darkModeToggle.innerText = "Light Mode";
        } else {
            this.container.classList.remove("dark-mode");
            this.body.classList.remove("dark-mode");
            this.darkModeToggle.innerText = "Dark Mode";
        }

        // Armazenamento local
        localStorage.setItem("preferredMode", mode);
    }

    toggleDarkMode() {
        // Alternância de Modo Escuro
        this.setMode(this.body.classList.contains("dark-mode") ? "light" : "dark");
    }

    fetchAndUpdateSensorData() {
        // Busca e Atualização de Dados do Sensor
        fetch('/sensor-data')
            .then((response) => response.json())
            .then((data) => {
                this.updateSensorData(data);
                this.updateElectricityReservoirData(data); // Adiciona essa chamada
            });
    }

    updateSensorData(data) {
        // Atualização dos Dados dos Sensores
        const sensorData = `
            <div class="sensor-item">
                <i class="material-icons">thermostat</i>
                <span>Air Temperature: ${data.air_temp}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">thermostat</i>
                <span>Soil Temperature: ${data.soil_temp}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">invert_colors</i>
                <span>Soil pH: ${data.ph}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">wb_sunny</i>
                <span>Air Humidity: ${data.air_humidity}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">opacity</i>
                <span>Soil Moisture: ${data.soil_moisture}</span>
            </div>

            <h2>Environmental Sensors</h2>
            <div class="sensor-item">
                <i class="material-icons">cloud</i>
                <span>CO2 Level: ${data.co2}</span>
            </div>
            
            <div class="sensor-item">
                <i class="material-icons">wb_incandescent</i>
                <span>Light Level: ${data.light}</span>
            </div>
        `;

        if (!this.sensorContainer.classList.contains("hidden")) {
            this.sensorContainer.innerHTML = sensorData;
        }
    }

    updateElectricityReservoirData(data) {
        // Atualização dos Dados de Eletricidade e Reservatórios
        const sensorERData = `
            <div class="sensor-item">
                <i class="material-icons">power</i>
                <span>Electrical Consumption: ${data.electrical_consumption}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">local_drink</i>
                <span>Reservoir Level 1: ${data.reservoir_l1}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">local_drink</i>
                <span>Reservoir Level 2: ${data.reservoir_l2}</span>
            </div>
        `;

        if (!this.sensorERList.classList.contains("hidden")) {
            this.sensorERContainer.innerHTML = sensorERData;
        }
    }

    toggleSensorList(sensorListId, toggleIconId, sensorContainer) {
        // Alternância de Lista de Sensores
        const sensorList = document.getElementById(sensorListId);
        const toggleIcon = document.getElementById(toggleIconId);
        const sensorTitle = document.getElementById(sensorListId.replace("-list", ""));
    
        sensorList.classList.toggle("hidden");
        toggleIcon.classList.toggle("rotate-icon");
        sensorTitle.classList.toggle("clicked");
    
        // Ocultar ou Exibir o Conteúdo do Contêiner de Sensores Específico
        if (sensorContainer && sensorContainer.classList) {
            sensorContainer.classList.toggle("hidden");
        }
    }

    waterPlant() {
        // Irrigação da Planta
        fetch("/water-plant", {
            method: "POST",
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
        })
        .catch((error) => {
            console.error("Erro ao enviar a solicitação:", error);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new GardenApp();
    app.sensorsERToggle.addEventListener("click", () => app.toggleSensorList("sensorER-list", "sensorER-toggle-icon", app.sensorERContainer));
    
});
