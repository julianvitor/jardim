// Obtém o host e a porta da URL atual
var currentHost = window.location.hostname;

// Constrói a URL do servidor JSON baseando-se no host e na porta da URL atual
var apiIpSensor = 'http://' + currentHost + ':' + '8001';
var apiIpRegar = 'http://' + currentHost + ':' + '8000';
// Exporte as constantes
const apiUrlSensorData = `${apiIpSensor}/sensor-data`;
const apiUrlWaterPlant = `${apiIpRegar}/water-plant`;

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

        // Elementos do DOM para sensores ambiente
        this.sensorESContainer = document.getElementById("sensorES-container");
        this.sensorESList = document.getElementById("sensorES-list");
        this.sensorsESToggle = document.getElementById("sensorsES");
        this.sensorESToggleIcon = document.getElementById("sensorES-toggle-icon");
        // Elementos do DOM para eletricidade e reservatórios
        this.sensorERContainer = document.getElementById("sensorER-container");
        this.sensorERList = document.getElementById("sensorER-list");
        this.sensorsERToggle = document.getElementById("sensorsER");
        this.sensorERToggleIcon = document.getElementById("sensorER-toggle-icon");

        // Elementos do DOM para sensores ambiente
        this.sensorESContainer = document.getElementById("sensorES-container");
        this.sensorESList = document.getElementById("sensorES-list");
        this.sensorsESToggle = document.getElementById("sensorsES");
        this.sensorESToggleIcon = document.getElementById("sensorES-toggle-icon");

        this.darkModeToggle = document.getElementById("dark-mode-toggle");
        this.container = document.querySelector(".container");
        this.body = document.body;

        // Modo preferido
        this.preferredMode = this.getCookie("preferredMode") || "light";
        this.preferredMode = this.getCookie("preferredMode") || "light";

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

        // Armazenamento em cookie
        this.setCookie("preferredMode", mode);
        // Armazenamento em cookie
        this.setCookie("preferredMode", mode);
    }

    toggleDarkMode() {
        // Alternância de Modo Escuro
        this.setMode(this.body.classList.contains("dark-mode") ? "light" : "dark");
    }

    fetchAndUpdateSensorData() {
        // Busca e Atualização de Dados do Sensor
        fetch(apiUrlSensorData)
            .then((response) => response.json())
            .then((data) => {
                this.updateSensorData(data);
                this.updateElectricityReservoirData(data); // Adiciona essa chamada para os dados de eletricidade e reservatorio
                this.updateEnvironmentalSensorsData(data); // Adiciona essa chamada para os dados de sensores ambiente
                this.updateElectricityReservoirData(data); // Adiciona essa chamada para os dados de eletricidade e reservatorio
                this.updateEnvironmentalSensorsData(data); // Adiciona essa chamada para os dados de sensores ambiente
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

    updateEnvironmentalSensorsData(data) {
        //atualização dos dados de sensores do ambiente
        const sensorESData = `
            <div class="sensor-item">
                <i class="material-icons">cloud</i>
                <span>CO2 Level: ${data.co2}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">wb_incandescent</i>
                <span>Light Level: ${data.light}</span>
            </div>
        `;

        if (!this.sensorESList.classList.contains("hidden")) {
            this.sensorESContainer.innerHTML = sensorESData;
        }
    }

    updateEnvironmentalSensorsData(data) {
        //atualização dos dados de sensores do ambiente
        const sensorESData = `
            <div class="sensor-item">
                <i class="material-icons">cloud</i>
                <span>CO2 Level: ${data.co2}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">wb_incandescent</i>
                <span>Light Level: ${data.light}</span>
            </div>
        `;

        if (!this.sensorESList.classList.contains("hidden")) {
            this.sensorESContainer.innerHTML = sensorESData;
        }
    }

    toggleSensorList(sensorListId, toggleIconId, sensorContainer) {
        const sensorList = document.getElementById(sensorListId);
        const toggleIcon = document.getElementById(toggleIconId);
        sensorList.classList.toggle("hidden");
        toggleIcon.classList.toggle("rotate-icon");
        if (sensorContainer && sensorContainer.classList) {
            sensorContainer.classList.toggle("hidden");
        }
    }

    // Funções para manipular cookies
    setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }
    // Funções para manipular cookies
    setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }
    waterPlant() {
        // Irrigação da Planta
        fetch(apiUrlWaterPlant, {
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
    app.sensorsERToggle.addEventListener("click", () => app.toggleSensorList("sensorER-list", "sensorER-toggle-icon" ));
    app.sensorsESToggle.addEventListener("click", () => app.toggleSensorList("sensorES-list", "sensorES-toggle-icon" ));
});
