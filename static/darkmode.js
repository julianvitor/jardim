class DarkModeApp {
    constructor() {
        this.initializeDOMElements();
        this.preferredMode = this.getPreferredMode();
        this.init();
    }

    initializeDOMElements() {
        this.myDarkModeToggle = document.getElementById("dark-mode-toggle");
        this.myContainer = document.querySelector(".container");
        this.myBody = document.body;
    }

    init() {
        this.setupEventListeners();
        this.setMyMode(this.preferredMode);
    }

    setupEventListeners() {
        this.myDarkModeToggle.addEventListener("click", () => this.toggleMyDarkMode());
    }

    setMyMode(mode) {
        const isDarkMode = mode === "dark";
        this.myContainer.classList.toggle("dark-mode", isDarkMode);
        this.myBody.classList.toggle("dark-mode", isDarkMode);
        this.updateMyDarkModeToggleText(isDarkMode);
        this.storeMyPreferredMode(mode);
    }

    toggleMyDarkMode() {
        const newMode = this.myBody.classList.contains("dark-mode") ? "light" : "dark";
        this.setMyMode(newMode);
    }

    updateMyDarkModeToggleText(isDarkMode) {
        this.myDarkModeToggle.innerText = isDarkMode ? "Light Mode" : "Dark Mode";
    }

    storeMyPreferredMode(mode) {
        this.setMyCookie("preferredMode", mode);
    }

    getPreferredMode() {
        return this.getMyCookie("preferredMode") || "dark";
    }

    setMyCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    getMyCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length);
            }
        }
        return "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new DarkModeApp();
});
