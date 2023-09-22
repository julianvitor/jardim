class GardenApp {
    constructor() {
        this.waterButton = document.getElementById("water-button");
        this.sensorContainer = document.getElementById("sensor-container");
        this.darkModeToggle = document.getElementById("dark-mode-toggle");
        this.container = document.querySelector(".container");
        this.body = document.body;
        this.preferredMode = localStorage.getItem("preferredMode") || "light";
        this.preferredLanguage = "portuguese"; // Idioma padrão
        this.translatedText = {
            // Traduções para o inglês
            english: {
                sensors:"Sensors",
                garden: "Garden",
                darkMode: "Dark Mode",
                lightMode: "Light Mode",
                manualWatering: "Manual Watering",
                sensorSection: "Air and Soil Sensors",
                airTemp: "Air Temperature",
                soilTemp: "Soil Temperature",
                ph: "Soil ph",
                airHumidity: "Air Humidity",
                soilMoisture: "Soil Moisture",
                electricitySection: "Electricity and Reservoirs",
                electricalConsumption: "Electrical Consumption",
                reservoirl1: "Reservoir Level 1",
                reservoirl2: "Reservoir Level 2",
                environmentalSensors: "Environmental Sensors",
                co2: "CO2 Level",
                light: "Light Level",
            },
                // Traduções para o português
                portuguese: {
                sensors:"Sensores",
                garden: "Jardim",
                darkMode: "Modo Escuro",
                lightMode: "Modo Claro",
                manualWatering: "Regar Manualmente",
                sensorSection: "Sensores de Ar e Solo",
                airTemp: "Temperatura do Ar",
                soilTemp: "Temperatura do Solo",
                ph: "ph do Solo",
                airHumidity: "Umidade do Ar",
                soilMoisture: "Umidade do Solo",
                electricitySection: "Eletricidade e Reservatórios",
                electricalConsumption: "Consumo de Eletricidade",
                reservoirl1: "Nível do Reservatório 1",
                reservoirl2: "Nível do Reservatório 2",
                environmentalSensors: "Sensores Ambientais",
                co2: "Nível de CO2",
                light: "Nível de Luz",
                },
        };

        this.init();
    }

    init() {
        this.addEventListeners();
        this.setMode(this.preferredMode);
        this.fetchAndUpdateSensorData();
        setInterval(() => this.fetchAndUpdateSensorData(), 1000);
    }

    addEventListeners() {
        this.darkModeToggle.addEventListener("click", () => this.toggleDarkMode());
        document.getElementById("language-switch-btn").addEventListener("click", () => this.toggleLanguage());
        this.waterButton.addEventListener("click", () => this.waterPlant());
        document.querySelector(".sensor-toggle").addEventListener("click", () => this.toggleSensorList());
    }

    setMode(mode) {
        if (mode === "dark") {
            this.container.classList.add("dark-mode");
            this.body.classList.add("dark-mode");
            this.darkModeToggle.innerText = this.translatedText[this.preferredLanguage].lightMode;
        } else {
            this.container.classList.remove("dark-mode");
            this.body.classList.remove("dark-mode");
            this.darkModeToggle.innerText = this.translatedText[this.preferredLanguage].darkMode;
        }
        localStorage.setItem("preferredMode", mode);
    }

    toggleDarkMode() {
        this.setMode(this.body.classList.contains("dark-mode") ? "light" : "dark");
    }

    toggleLanguage() {
        this.preferredLanguage = this.preferredLanguage === "english" ? "portuguese" : "english";
        this.updateTexts();
    }

    updateTexts() {
        // Atualize os textos na página com base no novo idioma
        this.darkModeToggle.innerText = this.translatedText[this.preferredLanguage].darkMode;
        this.waterButton.innerText = this.translatedText[this.preferredLanguage].manualWatering;
        // ... (atualize outros elementos conforme necessário)
        document.getElementById("language-switch-btn").innerText =
            this.preferredLanguage === "english" ? "Português" : "English";
    }

    fetchAndUpdateSensorData() {
        fetch('/sensor-data')
            .then((response) => response.json())
            .then((data) => {
                this.updateSensorData(data);
            });
    }

    updateSensorData(data) {
        // Atualize os dados dos sensores na página
        const sensorData = `
            <div class="sensor-item">
                <i class="material-icons">thermostat</i>
                <span>${this.translatedText[this.preferredLanguage].airTemp}: ${data.air_temp}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">thermostat</i>
                <span>${this.translatedText[this.preferredLanguage].soilTemp}: ${data.soil_temp}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">invert_colors</i>
                <span>${this.translatedText[this.preferredLanguage].ph}: ${data.ph}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">wb_sunny</i>
                <span>${this.translatedText[this.preferredLanguage].airHumidity}: ${data.air_humidity}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">opacity</i>
                <span>${this.translatedText[this.preferredLanguage].soilMoisture}: ${data.soil_moisture}</span>
            </div>

            <h2>${this.translatedText[this.preferredLanguage].electricitySection}</h2>
            <div class="sensor-item">
                <i class="material-icons">power</i>
                <span>${this.translatedText[this.preferredLanguage].electricalConsumption}: ${data.electrical_consumption}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">local_drink</i>
                <span>${this.translatedText[this.preferredLanguage].reservoirl1}: ${data.reservoir_l1}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">local_drink</i>
                <span>${this.translatedText[this.preferredLanguage].reservoirl2}: ${data.reservoir_l2}</span>
            </div>

            <h2>${this.translatedText[this.preferredLanguage].environmentalSensors}</h2>
            <div class="sensor-item">
                <i class="material-icons">cloud</i>
                <span>${this.translatedText[this.preferredLanguage].co2}: ${data.co2}</span>
            </div>
            
            <div class="sensor-item">
                <i class="material-icons">wb_incandescent</i>
                <span>${this.translatedText[this.preferredLanguage].light}: ${data.light}</span>
            </div>`
        ;
    if (!this.sensorContainer.classList.contains("hidden")) {
        this.sensorContainer.innerHTML = sensorData;
        }
    }

    toggleSensorList() {
        const sensorList = document.getElementById("sensor-list");
        const sensorToggleIcon = document.getElementById("sensor-toggle-icon");
        const sensorTitle = document.querySelector(".sensor-toggle");

        sensorList.classList.toggle("hidden");
        sensorToggleIcon.classList.toggle("rotate-icon");
        sensorTitle.classList.toggle("clicked");
    }

    waterPlant() {
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
    new GardenApp();
});
