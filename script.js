<<<<<<< HEAD
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
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}


function createMobileNavigation() {
    if (window.innerWidth <= 768) {  // Mobile view
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        
        // Get the existing navigation items
        const existingNav = document.querySelector('nav');
        const navItems = existingNav.querySelectorAll('a');
        
        // Create bottom navigation HTML
        nav.innerHTML = Array.from(navItems).map(item => `
            <a href="${item.getAttribute('href')}" class="nav-item">
                <i class="material-icons">${getIconForLink(item.textContent)}</i>
                <span>${item.textContent}</span>
            </a>
        `).join('');
        
        document.body.appendChild(nav);
        existingNav.classList.add('desktop-only');
    }
}

function getIconForLink(text) {
    const iconMap = {
        'Home': 'home',
        'Projects': 'work',
        'About': 'person',
        'Contact': 'mail',
        // Add more mappings as needed
    };
    return iconMap[text] || 'link';
}

// Initialize mobile navigation
window.addEventListener('load', createMobileNavigation);
window.addEventListener('resize', () => {
    const existingNav = document.querySelector('.mobile-nav');
    const desktopNav = document.querySelector('nav:not(.mobile-nav)');
    if (existingNav) {
        existingNav.remove();
    }
    desktopNav?.classList.remove('desktop-only');
    createMobileNavigation();
=======
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
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}


function createMobileNavigation() {
    if (window.innerWidth <= 768) {  // Mobile view
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        
        // Get the existing navigation items
        const existingNav = document.querySelector('nav');
        const navItems = existingNav.querySelectorAll('a');
        
        // Create bottom navigation HTML
        nav.innerHTML = Array.from(navItems).map(item => `
            <a href="${item.getAttribute('href')}" class="nav-item">
                <i class="material-icons">${getIconForLink(item.textContent)}</i>
                <span>${item.textContent}</span>
            </a>
        `).join('');
        
        document.body.appendChild(nav);
        existingNav.classList.add('desktop-only');
    }
}

function getIconForLink(text) {
    const iconMap = {
        'Home': 'home',
        'Projects': 'work',
        'About': 'person',
        'Contact': 'mail',
        // Add more mappings as needed
    };
    return iconMap[text] || 'link';
}

// Initialize mobile navigation
window.addEventListener('load', createMobileNavigation);
window.addEventListener('resize', () => {
    const existingNav = document.querySelector('.mobile-nav');
    const desktopNav = document.querySelector('nav:not(.mobile-nav)');
    if (existingNav) {
        existingNav.remove();
    }
    desktopNav?.classList.remove('desktop-only');
    createMobileNavigation();
>>>>>>> 8f76def3e1a617694796d3e66887dfb3a91a4a87
});