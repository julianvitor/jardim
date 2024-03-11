// Obtém o host e a porta da URL atual
var currentHost = window.location.hostname;

// Constrói a URL do servidor JSON baseando-se no host e na porta da URL atual
var apiIpSensor = 'http://' + currentHost + ':' + '8001';
var apiIpRegar = 'http://' + currentHost + ':' + '8002';
var apiIpGerenciamento = 'http://' + currentHost + ':' + '8003';

// Exporte as constantes
const apiUrlSensorData = `${apiIpSensor}/api-sensor-data`;
const apiUrlWaterPlant = `${apiIpRegar}/api-water-plant`;

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
        this.managementToggleIcon = document.getElementById("Management-toggle-icon")

        this.container = document.querySelector(".container");
        this.body = document.body;

        // Inicialização
        this.init();
    }

    init() {
        this.addEventListeners();
        this.fetchAndUpdateSensorData();
        setInterval(() => this.fetchAndUpdateSensorData(), 2000);
    }

    addEventListeners() {
        // Event Listeners
        this.waterButton.addEventListener("click", () => this.waterPlant());
        document.getElementById("sensors").addEventListener("click", () => this.toggleVisibility("sensor-list", "sensor-toggle-icon"));
        document.getElementById("management").addEventListener("click", () => this.toggleVisibility("management-container", "Management-toggle-icon"));
        document.getElementById("sensorsER").addEventListener("click", () => this.toggleVisibility("sensorER-list", "sensorER-toggle-icon"));
        document.getElementById("sensorsES").addEventListener("click", () => this.toggleVisibility("sensorES-list", "sensorES-toggle-icon"));
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
                <span>Consumption: ${data.electrical_consumption}</span>
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

    toggleVisibility(elementId, toggleIconId) {
        const element = document.getElementById(elementId);
        const toggleIcon = document.getElementById(toggleIconId);
    
        if (element && toggleIcon) {
            element.classList.toggle("hidden");
            toggleIcon.classList.toggle("rotate-icon");
        }
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
        const apiUrl = `${apiIpGerenciamento}/api-search-city?city=${query}&format=json&limit=1`;
    
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
    
    let timeoutId;

    function handleInput() {
        const query = cityInput.value.trim();

        if (query.length > 2) {
            clearTimeout(timeoutId); // Limpa o timeout anterior, se existir

            timeoutId = setTimeout(() => {
                fetchCitiesFromOpenStreetMap(query)
                    .then(suggestions => showSuggestions(suggestions))
                    .catch(error => console.error("Erro ao obter sugestões:", error));
            }, 500); // Aguarda 500 milissegundos após a última tecla ser pressionada
        } else {
            suggestionsContainer.innerHTML = "";
        }
    }

    cityInput.addEventListener("input", handleInput);
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new GardenApp();
    configurarCampoAutocomplete();
});