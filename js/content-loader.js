// Funzione per caricare le news nella pagina
function loadNewsContent(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container con ID "${containerId}" non trovato nella pagina.`);
        return;
    }
    
    // Recupera le news dal localStorage
    let news = JSON.parse(localStorage.getItem('news') || '[]');
    console.log('News caricate dal localStorage:', news); // Debug
    
    // Ordina per data (più recenti prima)
    news.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limita il numero di news se specificato
    if (limit) {
        news = news.slice(0, limit);
    }
    
    // Se non ci sono news, mostra esempi
    if (news.length === 0) {
        container.innerHTML = `
            <div class="news-preview">
                <h3>News 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <a href="news1.html" class="button">Leggi tutto</a>
                <span class="news-date">Data: 05/04/2025</span>
            </div>
            <div class="news-preview">
                <h3>News 2</h3>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <a href="news2.html" class="button">Leggi tutto</a>
                <span class="news-date">Data: 05/04/2025</span>
            </div>
        `;
        console.log('Nessuna news trovata, mostrati esempi.'); // Debug
        return;
    }
    
    // Svuota il container
    container.innerHTML = '';
    
    // Crea gli elementi per ogni news
    news.forEach(item => {
        console.log('Rendering news:', item); // Debug
        
        const newsElement = document.createElement('div');
        newsElement.className = 'news-preview';
        
        const formattedDate = new Date(item.date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Crea un estratto del contenuto (primi 150 caratteri)
        const contentPreview = item.content.length > 150 
            ? item.content.substring(0, 150) + '...' 
            : item.content;
        
        // Non generiamo più il file HTML automaticamente qui
        // generateNewsFile(item);
        
        newsElement.innerHTML = `
            <h3>${item.title}</h3>
            <p>${contentPreview}</p>
            <a href="news_${item.id}.html" class="button">Leggi tutto</a>
            <span class="news-date">Data: ${formattedDate}</span>
        `;
        
        container.appendChild(newsElement);
    });
    
    // Se siamo nella pagina di amministrazione, aggiungiamo un pulsante per generare i file
    if (window.location.href.includes('admin')) {
        const generateBtn = document.createElement('button');
        generateBtn.className = 'add-btn';
        generateBtn.style.marginTop = '20px';
        generateBtn.style.backgroundColor = '#4CAF50';
        generateBtn.textContent = 'Genera file HTML per le news';
        generateBtn.onclick = function() {
            news.forEach(item => {
                generateNewsFile(item);
            });
            alert('File HTML generati e scaricati. Caricali nella cartella principale del sito.');
        };
        
        container.parentNode.insertBefore(generateBtn, container.nextSibling);
    }
}

// Funzione per generare file HTML per una news
function generateNewsFile(newsItem) {
    // Crea il contenuto HTML per la pagina della news
    const formattedDate = new Date(newsItem.date).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const htmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsItem.title} - Pro Loco Cerrè Sologno</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="mobile.css">
    <script src="script.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        .centered-content {
            text-align: center;
            margin-top: 50px;
        }
        .news-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: left;
        }
        .news-image {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
            border-radius: 8px;
        }
        .news-date {
            color: #666;
            font-style: italic;
            margin: 20px 0;
            display: block;
        }
        .news-content {
            line-height: 1.6;
        }
    </style>
</head>
<body onload="checkDarkMode()">
    <header>
        <h1>${newsItem.title}</h1>
        <div class="nav-container">
            <nav>
                <a href="news.html" class="button">Indietro</a>
                <a href="home.html" class="button">Home</a>
                <a href="eventi.html" class="button">Eventi</a>
                <a href="contatti.html" class="button">Chi siamo?</a>
                <a href="storia.html" class="button">La storia di Cerré</a>
                <a href="dove.html" class="button">Dove ci trovi?</a>
            </nav>
            <a onclick="toggleDarkMode()" class="button theme-toggle">Cambia Tema</a>
        </div>
    </header>

    <main>
        <div class="news-container">
            <h2>${newsItem.title}</h2>
            <span class="news-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
            
            ${newsItem.image ? `<img src="${newsItem.image}" alt="${newsItem.title}" class="news-image">` : ''}
            
            <div class="news-content">
                ${newsItem.content}
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; ${new Date().getFullYear()} Pro Loco Cerrè Sologno</p>
    </footer>
    
    <script>
        function checkDarkMode() {
            if (localStorage.getItem("darkMode") === "enabled") {
                document.body.classList.add("dark-mode");
            }
        }
    
        checkDarkMode();
    
        window.addEventListener("storage", event => {
            if (event.key === "darkMode") {
                if (event.newValue === "enabled") {
                    document.body.classList.add("dark-mode");
                } else {
                    document.body.classList.remove("dark-mode");
                }
            }
        });
    </script>
</body>
</html>`;

    // Crea un Blob con il contenuto HTML
    const blob = new Blob([htmlContent], {type: 'text/html'});
    
    // Crea un URL per il Blob
    const url = URL.createObjectURL(blob);
    
    // Crea un link per scaricare il file
    const element = document.createElement('a');
    element.href = url;
    element.download = `news_${newsItem.id}.html`;
    element.target = '_blank'; // Apre in una nuova finestra/tab
    
    // Simula un click sull'elemento per avviare il download
    // Questo farà apparire il dialogo di download del browser
    element.click();
    
    // Rilascia l'URL dell'oggetto per liberare memoria
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
    
    console.log(`File news_${newsItem.id}.html generato. Seleziona dove salvarlo.`);
}

// Aggiungiamo una funzione per aggiungere il pulsante di generazione alla dashboard
function addGenerateButtonToDashboard() {
    // Verifichiamo se siamo in una pagina di amministrazione
    if (window.location.href.includes('admin')) {
        console.log('Pagina admin rilevata, aggiungo pulsante di generazione...');
        
        // Aggiungiamo un pulsante di generazione anche se non siamo nella dashboard specifica
        const adminSection = document.createElement('div');
        adminSection.id = 'generateFilesSection';
        adminSection.className = 'generate-section';
        adminSection.style.margin = '20px 0';
        adminSection.style.padding = '20px';
        adminSection.style.backgroundColor = '#f5f5f5';
        adminSection.style.borderRadius = '8px';
        adminSection.style.textAlign = 'center';
        
        adminSection.innerHTML = `
            <h3>Generazione File HTML</h3>
            <p>Dopo aver aggiunto o modificato news ed eventi, genera i file HTML e caricali sul tuo server.</p>
            <div style="display: flex; gap: 10px; margin-top: 15px; justify-content: center;">
                <button id="generateNewsBtn" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Genera file HTML per le News</button>
                <button id="generateEventsBtn" style="background-color: #2196F3; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Genera file HTML per gli Eventi</button>
            </div>
        `;
        
        // Inseriamo il pulsante in un punto più visibile della pagina
        // Cerchiamo prima il form di modifica news o il titolo "Gestione News"
        const newsForm = document.getElementById('addEditNewsForm');
        const newsTitle = Array.from(document.querySelectorAll('h2, h3')).find(el => el.textContent.includes('Gestione News'));
        
        if (newsForm) {
            // Se troviamo il form, inseriamo dopo di esso
            newsForm.parentNode.insertBefore(adminSection, newsForm.nextSibling);
        } else if (newsTitle) {
            // Se troviamo il titolo, inseriamo dopo di esso
            newsTitle.parentNode.insertBefore(adminSection, newsTitle.nextSibling);
        } else {
            // Altrimenti, inseriamo all'inizio del body dopo l'header
            const header = document.querySelector('header');
            if (header) {
                document.body.insertBefore(adminSection, header.nextSibling);
            } else {
                document.body.insertBefore(adminSection, document.body.firstChild);
            }
        }
        
        // Aggiungiamo anche un pulsante direttamente nella sezione di gestione news
        const newsSection = document.querySelector('h2, h3, h4').textContent.includes('News');
        if (newsSection) {
            const generateBtnSimple = document.createElement('button');
            generateBtnSimple.className = 'add-btn';
            generateBtnSimple.style.backgroundColor = '#4CAF50';
            generateBtnSimple.style.color = 'white';
            generateBtnSimple.style.padding = '10px 15px';
            generateBtnSimple.style.border = 'none';
            generateBtnSimple.style.borderRadius = '4px';
            generateBtnSimple.style.cursor = 'pointer';
            generateBtnSimple.style.margin = '10px';
            generateBtnSimple.textContent = 'Genera file HTML per le News';
            
            // Inseriamo vicino ai pulsanti esistenti
            const existingButtons = document.querySelectorAll('.add-btn, button');
            if (existingButtons.length > 0) {
                const lastButton = existingButtons[existingButtons.length - 1];
                lastButton.parentNode.insertBefore(generateBtnSimple, lastButton.nextSibling);
            } else {
                newsSection.parentNode.insertBefore(generateBtnSimple, newsSection.nextSibling);
            }
            
            generateBtnSimple.addEventListener('click', function() {
                const news = JSON.parse(localStorage.getItem('news') || '[]');
                if (news.length === 0) {
                    alert('Non ci sono news da generare.');
                    return;
                }
                
                alert(`Verranno generati ${news.length} file HTML per le news. Seleziona dove salvare ogni file.`);
                
                news.forEach(item => {
                    generateNewsFile(item);
                });
            });
        }
        
        // Aggiungiamo gli event listener ai pulsanti
        document.getElementById('generateNewsBtn').addEventListener('click', function() {
            console.log('Pulsante generazione news cliccato');
            const news = JSON.parse(localStorage.getItem('news') || '[]');
            if (news.length === 0) {
                alert('Non ci sono news da generare.');
                return;
            }
            
            alert(`Verranno generati ${news.length} file HTML per le news. Seleziona dove salvare ogni file.`);
            
            news.forEach(item => {
                generateNewsFile(item);
            });
        });
        
        document.getElementById('generateEventsBtn').addEventListener('click', function() {
            alert('Funzionalità in sviluppo.');
        });
        
        console.log('Pulsanti di generazione aggiunti alla pagina');
    }
}

// Rendi la funzione generateNewsFile disponibile globalmente
window.generateNewsFile = generateNewsFile;

// Aggiungiamo un pulsante diretto nella pagina
document.addEventListener('DOMContentLoaded', function() {
    // Aggiungiamo un pulsante diretto nella pagina dopo i pulsanti esistenti
    setTimeout(function() {
        const buttons = document.querySelectorAll('button');
        if (buttons.length > 0) {
            const lastButton = buttons[buttons.length - 1];
            
            const generateBtn = document.createElement('button');
            generateBtn.className = 'add-btn';
            generateBtn.style.backgroundColor = '#4CAF50';
            generateBtn.style.color = 'white';
            generateBtn.style.padding = '10px 15px';
            generateBtn.style.border = 'none';
            generateBtn.style.borderRadius = '4px';
            generateBtn.style.cursor = 'pointer';
            generateBtn.style.margin = '10px';
            generateBtn.textContent = 'Genera file HTML per le News';
            
            lastButton.parentNode.insertBefore(generateBtn, lastButton.nextSibling);
            
            generateBtn.addEventListener('click', function() {
                const news = JSON.parse(localStorage.getItem('news') || '[]');
                if (news.length === 0) {
                    alert('Non ci sono news da generare.');
                    return;
                }
                
                alert(`Verranno generati ${news.length} file HTML per le news. Seleziona dove salvare ogni file.`);
                
                news.forEach(item => {
                    generateNewsFile(item);
                });
            });
        }
    }, 1000); // Attendiamo un secondo per assicurarci che la pagina sia completamente caricata
});


// Inizializza i contenuti quando il documento è pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM caricato, inizializzazione content-loader.js');
    
    // Aggiungi il pulsante di generazione alla dashboard
    addGenerateButtonToDashboard();
    
    // Cerca contenitori per news
    if (document.getElementById('news-container')) {
        console.log('Container news trovato, caricamento news...');
        loadNewsContent('news-container');
    }
});