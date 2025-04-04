// Verifica se la modalità scura è abilitata all'avvio della pagina
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add("dark-mode");
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
    updateAllPages(); // Aggiorna tutte le pagine
}

function updateAllPages(darkModeEnabled) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach(iframe => {
        try {
            iframe.contentWindow.postMessage({ darkMode: darkModeEnabled }, "*");
        } catch (e) {
            console.error("Errore nell'invio del messaggio all'iframe:", e);
        }
    });
}

// Verifica se la modalità scura è abilitata all'avvio della pagina
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

window.addEventListener("message", event => {
    if (event.data.darkMode !== undefined) {
        if (event.data.darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    }
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
}