// Obtém o host e a porta da URL atual
var currentHost = window.location.hostname;

// Constrói a URL do servidor JSON baseando-se no host e na porta da URL atual
var apiIpSensor = 'http://' + currentHost + ':' + '8001';
var apiIpRegar = 'http://' + currentHost + ':' + '8002';
var apiIpGerenciamento = 'http://' + currentHost + ':' + '8003';

// Exporte as constantes
const apiUrlSensorData = `${apiIpSensor}/sensor-data`;
const apiUrlWaterPlant = `${apiIpRegar}/water-plant`;

class GardenApp {
    constructor() {
        // Elementos do DOM
        this.waterButton = document.getElementById("water-button");
        this.sensorContainer = document.getElementById("sensor-container");
        this.sensorERContainer = document.getElementById("sensorER-container");
        this.sensorERList = document.getElementById("sensorER-list");
        this.sensorsERToggle = document.getElementById("sensorsER");
        this.sensorERToggleIcon = document.getElementById("sensorER-toggle-icon");
        this.sensorESContainer = document.getElementById("sensorES-container");
        this.sensorESList = document.getElementById("sensorES-list");
        this.sensorsESToggle = document.getElementById("sensorsES");
        this.sensorESToggleIcon = document.getElementById("sensorES-toggle-icon");

        this.darkModeToggle = document.getElementById("dark-mode-toggle");
        this.container = document.querySelector(".container");
        this.body = document.body;

        // Modo preferido
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
        const isDarkMode = mode === "dark";
        this.container.classList.toggle("dark-mode", isDarkMode);
        this.body.classList.toggle("dark-mode", isDarkMode);
        this.darkModeToggle.innerText = isDarkMode ? "Light Mode" : "Dark Mode";

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
                this.updateElectricityReservoirData(data);
                this.updateEnvironmentalSensorsData(data);
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
        // Atualização dos dados de sensores do ambiente
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

    toggleSensorList(sensorListId, toggleIconId) {
        const sensorList = document.getElementById(sensorListId);
        const toggleIcon = document.getElementById(toggleIconId);
        sensorList.classList.toggle("hidden");
        toggleIcon.classList.toggle("rotate-icon");
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

function toggleManagement() {
    var managementSection = document.getElementById('management-container');
    var managementToggleIcon = document.getElementById('Management-toggle-icon');

    if (managementSection.classList.contains('hidden')) {
        managementSection.classList.remove('hidden');
        managementToggleIcon.innerText = 'keyboard_arrow_up';
    } else {
        managementSection.classList.add('hidden');
        managementToggleIcon.innerText = 'keyboard_arrow_down';
    }
}

function updateTime() {
    var slider = document.getElementById("time-slider");
    var output = document.getElementById("time-value");
    output.innerHTML = slider.value;
}

function configurarCampoAutocomplete() {
    const cityInput = document.getElementById("cityInput");
    const suggestionsContainer = document.getElementById("suggestions");

    function fetchCitiesFromOpenStreetMap(query) {
        // Use a API de busca do OpenStreetMap diretamente no front-end
        const apiUrl = `${apiIpGerenciamento}/search-city?city=${query}&format=json&limit=1`;
    
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Dados da resposta:", data);
                return data.map(item => item.display_name);
            })
            .catch(error => {
                console.error("Erro ao obter cidades do OpenStreetMap:", error);
                throw error; // Propaga o erro para o próximo bloco catch, se necessário
            });
    }
    
    function showSuggestions(suggestions) {
        suggestionsContainer.innerHTML = "";
    
        if (!Array.isArray(suggestions)) {
            console.error("As sugestões não são um array:", suggestions);
            return;
        }
    
        suggestions.forEach(city => {
            const suggestion = document.createElement("div");
            suggestion.classList.add("suggestion");
            suggestion.textContent = city;
            suggestion.addEventListener("click", () => {
                cityInput.value = city;
                suggestionsContainer.innerHTML = "";
            });
            suggestionsContainer.appendChild(suggestion);
        });
    }
    
    function handleInput() {
        const query = cityInput.value.trim();
    
        if (query.length > 2) {
            fetchCitiesFromOpenStreetMap(query)
                .then(suggestions => showSuggestions(suggestions))
                .catch(error => console.error("Erro ao obter sugestões:", error));
        } else {
            suggestionsContainer.innerHTML = "";
        }
    }
    
    cityInput.addEventListener("input", handleInput);
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new GardenApp();
    app.sensorsERToggle.addEventListener("click", () => app.toggleSensorList("sensorER-list", "sensorER-toggle-icon" ));
    app.sensorsESToggle.addEventListener("click", () => app.toggleSensorList("sensorES-list", "sensorES-toggle-icon" ));
    configurarCampoAutocomplete();
});