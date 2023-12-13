class GardenApp {
    constructor() {
        this.waterButton = document.getElementById("water-button");
        this.sensorContainer = document.getElementById("sensor-container");
        this.darkModeToggle = document.getElementById("dark-mode-toggle");
        this.container = document.querySelector(".container");
        this.body = document.body;
        this.preferredMode = localStorage.getItem("preferredMode") || "light";
        this.text = {
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
        this.waterButton.addEventListener("click", () => this.waterPlant());
        document.querySelector(".sensor-toggle").addEventListener("click", () => this.toggleSensorList());
    }

    setMode(mode) {
        if (mode === "dark") {
            this.container.classList.add("dark-mode");
            this.body.classList.add("dark-mode");
            this.darkModeToggle.innerText = this.text.lightMode;
        } else {
            this.container.classList.remove("dark-mode");
            this.body.classList.remove("dark-mode");
            this.darkModeToggle.innerText = this.text.darkMode;
        }
        localStorage.setItem("preferredMode", mode);
    }

    toggleDarkMode() {
        this.setMode(this.body.classList.contains("dark-mode") ? "light" : "dark");
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
                <span>${this.text.airTemp}: ${data.air_temp}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">thermostat</i>
                <span>${this.text.soilTemp}: ${data.soil_temp}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">invert_colors</i>
                <span>${this.text.ph}: ${data.ph}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">wb_sunny</i>
                <span>${this.text.airHumidity}: ${data.air_humidity}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">opacity</i>
                <span>${this.text.soilMoisture}: ${data.soil_moisture}</span>
            </div>

            <h2>${this.text.electricitySection}</h2>
            <div class="sensor-item">
                <i class="material-icons">power</i>
                <span>${this.text.electricalConsumption}: ${data.electrical_consumption}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">local_drink</i>
                <span>${this.text.reservoirl1}: ${data.reservoir_l1}</span>
            </div>
            <div class="sensor-item">
                <i class="material-icons">local_drink</i>
                <span>${this.text.reservoirl2}: ${data.reservoir_l2}</span>
            </div>

            <h2>${this.text.environmentalSensors}</h2>
            <div class="sensor-item">
                <i class="material-icons">cloud</i>
                <span>${this.text.co2}: ${data.co2}</span>
            </div>
            
            <div class="sensor-item">
                <i class="material-icons">wb_incandescent</i>
                <span>${this.text.light}: ${data.light}</span>
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
