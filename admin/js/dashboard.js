/**
 * Dashboard Amministrativa Cerresologno
 * Script per la gestione degli articoli, eventi e bozze
 */

// INSERISCI QUI IL LINK CSV DEL TUO FOGLIO GOOGLE
// Per ottenerlo: in Google Sheets, vai su "File" > "Condividi" > "Pubblica sul web".
// Seleziona il foglio corretto, scegli "Valori separati da virgola (.csv)" e clicca "Pubblica".
// Copia il link generato e incollalo qui.
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp8UQplENXEQT2DbGAnBhf1-tW_5yD59NYj9LpwlFlGZsmii9RnWw1_eprSx-ULeTwABLUgd4HuGY2/pub?gid=0&single=true&output=csv';


document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Scrivi il contenuto del tuo articolo qui...'
    });
    
    // Navigation
    initNavigation();
    
    // Toggle event date field based on content type
    initContentTypeToggle();
    
    // Preview functionality
    initPreviewFunctionality(quill);
    
    // Export HTML functionality
    initExportFunctionality(quill);
    
    // Save draft functionality
    initDraftFunctionality(quill);
    
    // Initialize drafts list
    updateDraftsList(quill);
    
    // Initialize analytics section
    initAnalyticsSection();
    
    // Initialize theme toggle
    initThemeToggle();
});

/**
 * Carica i dati di analytics da Google Sheets.
 * @returns {Promise<Array<Object>>} Una promessa che si risolve con un array di oggetti, dove ogni oggetto rappresenta una riga.
 */
async function fetchAnalyticsFromGoogleSheets() {
    if (GOOGLE_SHEETS_CSV_URL === 'INCOLLA_QUI_IL_TUO_LINK_CSV') {
        console.error("URL del CSV di Google Sheets non configurato.");
        return [];
    }
    try {
        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        if (!response.ok) {
            throw new Error(`Errore nel caricamento del CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        const rows = csvText.trim().split('\n').slice(1); // Salta l'intestazione
        const data = rows.map(row => {
            const [timestamp, page, userAgent, platform, os, browser] = row.split(',');
            return { timestamp, page, userAgent, platform, os, browser };
        });
        return data;
    } catch (error) {
        console.error("Impossibile caricare i dati da Google Sheets:", error);
        return [];
    }
}


/**
 * Inizializza la navigazione tra le sezioni
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        'editor': document.getElementById('editor-section'),
        'news': document.getElementById('news-section'),
        'events': document.getElementById('events-section'),
        'drafts': document.getElementById('drafts-section'),
        'analytics': document.getElementById('analytics-section')
    };
    
    // Verifica se l'utente è Dante (accesso limitato solo alle statistiche)
    const username = localStorage.getItem('adminUsername');
    const isDante = username === 'dante';
    const isEleonora = username === 'eleonora';
    // Se l'utente è Dante, nascondi tutte le sezioni tranne analytics e mostra direttamente analytics
    if (isDante) {
        // Nascondi tutte le sezioni tranne analytics
        Object.keys(sections).forEach(key => {
            if (key !== 'analytics') {
                sections[key].style.display = 'none';
                // Nascondi anche i link nel menu
                const link = document.querySelector(`.nav-link[data-section="${key}"]`);
                if (link) link.style.display = 'none';
            }
        });
        
        // Mostra la sezione analytics
        sections['analytics'].style.display = 'block';
        
        // Attiva il link analytics
        const analyticsLink = document.querySelector('.nav-link[data-section="analytics"]');
        if (analyticsLink) analyticsLink.classList.add('active');
        
        // Aggiorna i dati di analytics
        updateAnalyticsData();
    }
    // Se l'utente è Eleonora, nascondi tutte le sezioni tranne analytics e mostra direttamente analytics
    if (isEleonora) {
        // Nascondi tutte le sezioni tranne analytics
        Object.keys(sections).forEach(key => {
            if (key !== 'analytics') {
                sections[key].style.display = 'none';
                // Nascondi anche i link nel menu
                const link = document.querySelector(`.nav-link[data-section="${key}"]`);
                if (link) link.style.display = 'none';
            }
        });
        
        // Mostra la sezione analytics
        sections['analytics'].style.display = 'block';
        
        // Attiva il link analytics
        const analyticsLink = document.querySelector('.nav-link[data-section="analytics"]');
        if (analyticsLink) analyticsLink.classList.add('active');
        
        // Aggiorna i dati di analytics
        updateAnalyticsData();
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Se l'utente è Dante oppure Eleonora e sta cercando di accedere a una sezione diversa da analytics, blocca
            if (isDante && this.getAttribute('data-section') !== 'analytics') {
                return;
            }
            if (isEleonora && this.getAttribute('data-section') !== 'analytics') {
                return;
            }
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            const sectionToShow = this.getAttribute('data-section');
            Object.keys(sections).forEach(key => {
                sections[key].style.display = key === sectionToShow ? 'block' : 'none';
            });
            
            // Se la sezione è analytics, aggiorna i dati
            if (sectionToShow === 'analytics') {
                updateAnalyticsData();
            }
        });
    });

}

/**
 * Inizializza il toggle per il campo data evento
 */
function initContentTypeToggle() {
    const contentTypeRadios = document.querySelectorAll('input[name="content-type"]');
    const eventDateContainer = document.getElementById('event-date-container');
    
    contentTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            eventDateContainer.style.display = this.value === 'event' ? 'block' : 'none';
        });
    });
}

/**
 * Inizializza la funzionalità di anteprima
 * @param {Quill} quill - L'istanza dell'editor Quill
 */
function initPreviewFunctionality(quill) {
    const previewBtn = document.getElementById('preview-btn');
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    
    previewBtn.addEventListener('click', function() {
        const title = document.getElementById('article-title').value;
        const content = quill.root.innerHTML;
        
        if (!title || quill.getText().trim().length === 0) {
            alert('Per favore, inserisci un titolo e del contenuto prima di visualizzare l\'anteprima.');
            return;
        }
        
        previewContent.innerHTML = `
            <h2>${title}</h2>
            <div class="content">${content}</div>
        `;
        
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });
    });
}

/**
 * Inizializza la funzionalità di esportazione HTML
 * @param {Quill} quill - L'istanza dell'editor Quill
 */
function initExportFunctionality(quill) {
    const exportHtmlBtn = document.getElementById('export-html');
    
    exportHtmlBtn.addEventListener('click', function() {
        const title = document.getElementById('article-title').value;
        const summary = document.getElementById('article-summary').value;
        const content = quill.root.innerHTML;
        const contentType = document.querySelector('input[name="content-type"]:checked').value;
        const tags = document.getElementById('article-tags').value;
        
        if (!title || quill.getText().trim().length === 0) {
            alert('Per favore, inserisci un titolo e del contenuto prima di esportare.');
            return;
        }
        
        let eventDate = '';
        if (contentType === 'event') {
            eventDate = document.getElementById('event-date').value;
            if (!eventDate) {
                alert('Per favore, inserisci una data per l\'evento prima di esportare.');
                return;
            }
        }
        
        // Create formatted HTML
        const htmlContent = generateArticleHTML(title, summary, content, contentType, tags, eventDate);
        
        // Create download link
        downloadHTML(title, htmlContent);
    });
}

/**
 * Genera il codice HTML dell'articolo
 * @param {string} title - Titolo dell'articolo
 * @param {string} summary - Sommario dell'articolo
 * @param {string} content - Contenuto HTML dell'articolo
 * @param {string} contentType - Tipo di contenuto (news o event)
 * @param {string} tags - Tags dell'articolo
 * @param {string} eventDate - Data dell'evento (solo per eventi)
 * @returns {string} - Codice HTML completo dell'articolo
 */
function generateArticleHTML(title, summary, content, contentType, tags, eventDate) {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    // Crea un ID per la pagina basato sul tipo di contenuto e sul titolo
    const pageId = contentType === 'event' ? 'evento' : 'news';
    const fileName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    let htmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Pro Loco Cerrè Sologno</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="mobile.css">
    <script src="script.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        .centered-content {
                margin-top: 50px; /* Aggiunge un po' di spazio sopra il contenuto */
                max-width: 800px; /* Larghezza massima del contenuto */
                margin-left: auto; /* Centra il blocco orizzontalmente */
                margin-right: auto; /* Centra il blocco orizzontalmente */
                padding: 0 20px; /* Aggiunge un po' di padding laterale */
            }
            .centered-content h2, .centered-content h3 {
                text-align: center; /* Centra i titoli orizzontalmente */
            }
            .centered-content p {
                text-align: justify; /* Giustifica i paragrafi */
            }
            .content {
                width: 100%; /* Assicura che il contenuto occupi tutta la larghezza disponibile */
            }
            
            /* Stile per il contenitore della navigazione */
            .nav-container {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            
            /* Stile per il pulsante del tema */
            .theme-toggle {
                position: absolute;
                right: 0;
            }
            
            /* Solo per dispositivi mobili, ripristina il comportamento normale */
            @media (max-width: 768px) {
                .theme-toggle {
                    position: static;
                }
            }
    </style>
</head>
<body onload="checkDarkMode()">
    <header>
        <h1>${title}</h1>
        <div class="nav-container">
            <nav>
                <a href="${contentType === 'event' ? 'eventi' : 'news'}.html" class="button">Indietro</a>
                <a href="home.html" class="button">Home</a>
                <a href="${contentType === 'event' ? 'news' : 'eventi'}.html" class="button">${contentType === 'event' ? 'News' : 'Eventi'}</a>
                <a href="contatti.html" class="button">Chi siamo?</a>
                <a href="storia.html" class="button">La storia di Cerré</a>
                <a href="dove.html" class="button">Dove ci trovi?</a>
            </nav>
            <a onclick="toggleDarkMode()" class="button theme-toggle">Cambia Tema</a>
        </div>
    </header>

    <main class="centered-content">
        <h2>${title}</h2>
        <p>${formattedDate}</p>
        <div class="content">
            ${content}
        </div>
        ${contentType === 'event' && eventDate ? `<p>Data evento: ${new Date(eventDate).toLocaleDateString('it-IT')}</p>` : ''}
        ${summary ? `<p class="summary">${summary}</p>` : ''}
        ${tags ? `<p class="tags">Tags: ${tags}</p>` : ''}
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
    
        checkDarkMode(); // Verifica all'avvio della pagina
    
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
    <iframe src="about:blank" style="display: none;"></iframe>
</body>
</html>`;

    return htmlContent;
}

/**
 * Crea e avvia il download di un file HTML
 * @param {string} title - Titolo dell'articolo (usato per il nome del file)
 * @param {string} htmlContent - Contenuto HTML da scaricare
 */
function downloadHTML(title, htmlContent) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Determina il tipo di contenuto
    const contentType = document.querySelector('input[name="content-type"]:checked').value;
    
    // Format filename based on content type
    // Per eventi: evento1.html, evento2.html, etc.
    // Per news: news1.html, news2.html, etc.
    // Oppure usa il titolo se l'utente preferisce
    const useCustomFilename = confirm('Vuoi usare un nome file basato sul titolo? Altrimenti verrà usato un formato standard (news1.html o evento1.html)');
    
    let filename;
    if (useCustomFilename) {
        filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
    } else {
        // Chiedi all'utente di specificare un numero per il file
        const fileNumber = prompt('Inserisci un numero per il file (es. 1 per news1.html):', '1');
        filename = (contentType === 'event' ? 'evento' : 'news') + fileNumber + '.html';
    }
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Se è un articolo di tipo news, aggiorna la pagina news.html
    if (contentType === 'news') {
        updateNewsPage(title, filename);
    }
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}


/**
 * Inizializza la funzionalità di salvataggio bozze
 * @param {Quill} quill - L'istanza dell'editor Quill
 */
function initDraftFunctionality(quill) {
    const saveDraftBtn = document.getElementById('save-draft');
    
    saveDraftBtn.addEventListener('click', function() {
        const title = document.getElementById('article-title').value || 'Senza titolo';
        const content = quill.root.innerHTML;
        const contentType = document.querySelector('input[name="content-type"]:checked').value;
        const summary = document.getElementById('article-summary').value;
        const tags = document.getElementById('article-tags').value;
        
        let eventDate = '';
        if (contentType === 'event') {
            eventDate = document.getElementById('event-date').value;
        }
        
        const draft = {
            title,
            content,
            contentType,
            summary,
            tags,
            eventDate,
            lastSaved: new Date().toISOString()
        };
        
        // Get existing drafts
        let drafts = JSON.parse(localStorage.getItem('cerresologno-drafts') || '[]');
        drafts.push(draft);
        
        // Save to localStorage
        localStorage.setItem('cerresologno-drafts', JSON.stringify(drafts));
        
        alert('Bozza salvata con successo!');
        
        // Update drafts list
        updateDraftsList(quill);
    });
}

/**
 * Aggiorna la lista delle bozze salvate
 * @param {Quill} quill - L'istanza dell'editor Quill
 */
function updateDraftsList(quill) {
    const draftsContainer = document.querySelector('#drafts-section .article-list');
    const drafts = JSON.parse(localStorage.getItem('cerresologno-drafts') || '[]');
    
    if (drafts.length === 0) {
        draftsContainer.innerHTML = '<p>Nessuna bozza salvata.</p>';
        return;
    }
    
    let html = '';
    drafts.forEach((draft, index) => {
        const date = new Date(draft.lastSaved);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        
        html += `
        <div class="article-item">
            <h5>${draft.title}</h5>
            <p class="text-muted">Ultimo aggiornamento: ${formattedDate}</p>
            <div class="d-flex">
                <button class="btn btn-sm btn-primary me-2" data-draft-index="${index}">Continua Modifica</button>
                <button class="btn btn-sm btn-danger" data-delete-index="${index}">Elimina</button>
            </div>
        </div>
        `;
    });
    
    draftsContainer.innerHTML = html;
    
    // Add event listeners to edit buttons
    document.querySelectorAll('[data-draft-index]').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-draft-index');
            loadDraft(index, quill);
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('[data-delete-index]').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-delete-index');
            deleteDraft(index, quill);
        });
    });
}

/**
 * Carica una bozza nell'editor
 * @param {number} index - Indice della bozza da caricare
 * @param {Quill} quill - L'istanza dell'editor Quill
 */
function loadDraft(index, quill) {
    const drafts = JSON.parse(localStorage.getItem('cerresologno-drafts') || '[]');
    const draft = drafts[index];
    
    if (!draft) return;
    
    // Fill form with draft data
    document.getElementById('article-title').value = draft.title;
    quill.root.innerHTML = draft.content;
    document.getElementById('article-summary').value = draft.summary || '';
    document.getElementById('article-tags').value = draft.tags || '';
    
    // Set content type
    const contentTypeRadio = document.querySelector(`input[name="content-type"][value="${draft.contentType}"]`);
    if (contentTypeRadio) {
        contentTypeRadio.checked = true;
        // Trigger change event
        contentTypeRadio.dispatchEvent(new Event('change'));
    }
    
    // Set event date if applicable
    if (draft.contentType === 'event' && draft.eventDate) {
        document.getElementById('event-date').value = draft.eventDate;
    }
    
    // Switch to editor view
    document.querySelector('[data-section="editor"]').click();
}

/**
 * Elimina una bozza
 * @param {number} index - Indice della bozza da eliminare
 * @param {Quill} quill - L'istanza dell'editor Quill
 */
function deleteDraft(index, quill) {
    if (!confirm('Sei sicuro di voler eliminare questa bozza?')) return;
    
    let drafts = JSON.parse(localStorage.getItem('cerresologno-drafts') || '[]');
    drafts.splice(index, 1);
    localStorage.setItem('cerresologno-drafts', JSON.stringify(drafts));
    
    updateDraftsList(quill);
}

/**
 * Aggiorna la pagina news.html con la preview dell'ultima notizia
 * @param {string} title - Titolo dell'articolo
 * @param {string} filename - Nome del file HTML dell'articolo
 */
function updateNewsPage(title, filename) {
    // Carica il contenuto attuale della pagina news.html
    fetch('news.html')
        .then(response => response.text())
        .then(html => {
            // Estrai il sommario dall'articolo
            const summary = document.getElementById('article-summary').value || 'Lorem ipsum dolor sit amet...';
            
            // Crea la data formattata
            const date = new Date();
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            
            // Crea il nuovo elemento news-preview
            const newPreview = `
        <div class="news-preview">
            <h3>${title}</h3>
            <p>${summary}</p>
            <a href="${filename}" class="button">Leggi tutto</a>
            <p>Data: ${formattedDate}</p>
        </div>`;
            
            // Trova la posizione dove inserire la nuova preview
            const mainContentStart = html.indexOf('<main class="centered-content">');
            const h2End = html.indexOf('</h2>', mainContentStart) + 5;
            
            // Inserisci la nuova preview dopo il tag h2
            const updatedHtml = html.slice(0, h2End) + newPreview + html.slice(h2End);
            
            // Salva il file aggiornato
            const blob = new Blob([updatedHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'news.html';
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            alert('La pagina news.html è stata aggiornata con la nuova notizia!');
        })
        .catch(error => {
            console.error('Errore durante l\'aggiornamento della pagina news:', error);
            alert('Si è verificato un errore durante l\'aggiornamento della pagina news.html');
        });
}

/**
 * Inizializza la sezione di analytics nella dashboard
 */
function initAnalyticsSection() {
    // Aggiungi script di analytics se non è già presente
    if (!document.querySelector('script[src="../js/analytics.js"]')) {
        const analyticsScript = document.createElement('script');
        analyticsScript.src = '../js/analytics.js';
        document.body.appendChild(analyticsScript);
    }
    
    // Aggiungi event listener per il pulsante di aggiornamento
    const refreshBtn = document.getElementById('refresh-analytics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', updateAnalyticsData);
    }
    
    // Aggiungi event listener per il pulsante di reset
    const resetBtn = document.getElementById('reset-analytics');
    if (resetBtn) {
        // Nascondi il pulsante di reset per Dante
        const username = localStorage.getItem('adminUsername');
        if (username === 'dante' || username === 'eleonora') {
            resetBtn.style.display = 'none';
        }
        
        resetBtn.addEventListener('click', function() {
            if (typeof resetAnalyticsData === 'function') {
                resetAnalyticsData();
                updateAnalyticsData();
            } else {
                alert('Funzione resetAnalyticsData non disponibile. Assicurati che il file analytics.js sia caricato correttamente.');
            }
        });
    }
    
    // Inizializza i dati
    updateAnalyticsData();
}

/**
 * Aggiorna i dati di analytics nella dashboard
 */
async function updateAnalyticsData() {
    // Mostra il messaggio di benvenuto per Dante
    const username = localStorage.getItem('adminUsername');
    const danteWelcome = document.getElementById('dante-welcome');
    if (danteWelcome) {
        danteWelcome.style.display = username === 'dante' ? 'block' : 'none';
    }

    // Carica i dati da Google Sheets
    const analyticsData = await fetchAnalyticsFromGoogleSheets();

    if (!analyticsData || analyticsData.length === 0) {
        console.log("Nessun dato di analytics da visualizzare.");
        // Potresti voler mostrare un messaggio all'utente qui
        return;
    }
    
    // Aggiorna il contatore delle visite totali
    const totalVisitsElement = document.getElementById('total-visits');
    if (totalVisitsElement) {
        totalVisitsElement.textContent = analyticsData.length;
    }
    
    // Aggiorna il contatore delle visite odierne
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = analyticsData.filter(visit => visit.timestamp.startsWith(today)).length;
    const todayVisitsElement = document.getElementById('today-visits');
    if (todayVisitsElement) {
        todayVisitsElement.textContent = todayVisits;
    }
    
    // Aggiorna la tabella delle pagine più visitate
    updateTopPagesTable(analyticsData);
    
    // Aggiorna il grafico delle visite
    updateVisitsChart(analyticsData);
    
    // Aggiorna il grafico dei referrer (se i dati sono disponibili)
    // updateReferrerChart(analyticsData); // Questa funzione richiede la colonna referrer
    
    // Aggiorna il grafico dei dispositivi e sistemi operativi
    updateDeviceOsChart(analyticsData);
    
    // La sezione di riepilogo aggregato non è più necessaria con i dati da Google Sheets
    const aggregatedSection = document.getElementById('aggregated-users-section');
    if (aggregatedSection) {
        aggregatedSection.style.display = 'none';
    }
}

/**
 * Aggiorna la tabella delle pagine più visitate
 * @param {Object} analyticsData - I dati di analytics
 */
function updateTopPagesTable(analyticsData) {
    const tableBody = document.getElementById('top-pages-body');
    if (!tableBody) return;
    
    // Svuota la tabella
    tableBody.innerHTML = '';

    const pageVisits = analyticsData.reduce((acc, visit) => {
        const page = visit.page || 'N/D';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
    }, {});
    
    // Se non ci sono dati, mostra un messaggio
    if (Object.keys(pageVisits).length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" class="text-center">Nessun dato disponibile</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Calcola il totale delle visite alle pagine
    const totalPageVisits = analyticsData.length;
    
    // Ottieni le pagine più visitate
    const topPages = Object.keys(pageVisits).map(page => ({
        page,
        visits: pageVisits[page]
    }));
    
    // Ordina per numero di visite (decrescente)
    topPages.sort((a, b) => b.visits - a.visits);
    
    // Limita a 10 pagine
    const limitedTopPages = topPages.slice(0, 10);
    
    // Popola la tabella
    limitedTopPages.forEach(item => {
        const row = document.createElement('tr');
        const percentage = ((item.visits / totalPageVisits) * 100).toFixed(1);
        
        row.innerHTML = `
            <td>${item.page}</td>
            <td>${item.visits}</td>
            <td>${percentage}%</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Aggiorna il grafico delle visite
 * @param {Object} analyticsData - I dati di analytics
 */
function updateVisitsChart(analyticsData) {
    const chartCanvas = document.getElementById('visits-chart');
    if (!chartCanvas) return;
    
    // Ottieni i dati delle visite giornaliere per gli ultimi 7 giorni
    const dailyVisits = analyticsData.reduce((acc, visit) => {
        const date = new Date(visit.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    
    // Genera un array di date per gli ultimi 7 giorni
    const dates = [];
    const visitsData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        
        dates.push(formattedDate);
        visitsData.push(dailyVisits[dateString] || 0);
    }
    
    // Distruggi il grafico esistente se presente
    if (window.visitsChart) {
        window.visitsChart.destroy();
    }
    
    // Crea il nuovo grafico
    window.visitsChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Visite giornaliere',
                data: visitsData,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Visite: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Ottiene i dati sui referrer (provenienza dei visitatori)
 * @param {number} limit - Il numero massimo di referrer da restituire
 * @returns {Array} Un array di oggetti {referrer, visits, percentage}
 */
function getReferrersData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const referrers = analyticsData.referrers || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {referrer, visits, percentage}
    const referrersArray = Object.keys(referrers).map(referrer => ({
        referrer,
        visits: referrers[referrer],
        percentage: totalVisits > 0 ? (referrers[referrer] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    referrersArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di referrer
    return referrersArray.slice(0, limit);
}

/**
 * Aggiorna il grafico della provenienza dei visitatori
 * @param {Object} analyticsData - I dati di analytics
 */
function updateReferrerChart(analyticsData) {
    const chartCanvas = document.getElementById('referrer-chart');
    if (!chartCanvas) return;
    
    // Ottieni i dati dei referrer
    const referrersData = getReferrersData();
    
    // Se non ci sono dati, mostra un messaggio
    if (referrersData.length === 0) {
        const ctx = chartCanvas.getContext('2d');
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Nessun dato disponibile', chartCanvas.width / 2, chartCanvas.height / 2);
        return;
    }
    
    // Prepara i dati per il grafico
    const labels = referrersData.map(item => item.referrer);
    const data = referrersData.map(item => item.visits);
    
    // Colori per il grafico
    const backgroundColors = [
        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
        '#5a5c69', '#858796', '#6610f2', '#6f42c1', '#fd7e14'
    ];
    
    // Distruggi il grafico esistente se presente
    if (window.referrerChart) {
        window.referrerChart.destroy();
    }
    
    // Crea il nuovo grafico
    window.referrerChart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = ((value / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Ottiene i dati sui dispositivi utilizzati
 * @param {number} limit - Il numero massimo di dispositivi da restituire
 * @returns {Array} Un array di oggetti {device, visits, percentage}
 */
function getDevicesData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const devices = analyticsData.devices || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {device, visits, percentage}
    const devicesArray = Object.keys(devices).map(device => ({
        device,
        visits: devices[device],
        percentage: totalVisits > 0 ? (devices[device] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    devicesArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di dispositivi
    return devicesArray.slice(0, limit);
}

/**
 * Ottiene i dati sui sistemi operativi utilizzati
 * @param {number} limit - Il numero massimo di sistemi operativi da restituire
 * @returns {Array} Un array di oggetti {os, visits, percentage}
 */
function getOsData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const osData = analyticsData.os || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {os, visits, percentage}
    const osArray = Object.keys(osData).map(os => ({
        os,
        visits: osData[os],
        percentage: totalVisits > 0 ? (osData[os] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    osArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di sistemi operativi
    return osArray.slice(0, limit);
}

/**
 * Aggiorna il grafico dei dispositivi e sistemi operativi
 * @param {Object} analyticsData - I dati di analytics
 */
function updateDeviceOsChart(analyticsData) {
    const chartCanvas = document.getElementById('device-os-chart');
    if (!chartCanvas) return;

    const devicesData = analyticsData.reduce((acc, visit) => {
        const device = visit.platform || 'N/D';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {});

    const osData = analyticsData.reduce((acc, visit) => {
        const os = visit.os || 'N/D';
        acc[os] = (acc[os] || 0) + 1;
        return acc;
    }, {});
    
    // Se non ci sono dati, mostra un messaggio
    if (Object.keys(devicesData).length === 0 && Object.keys(osData).length === 0) {
        const ctx = chartCanvas.getContext('2d');
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Nessun dato disponibile', chartCanvas.width / 2, chartCanvas.height / 2);
        return;
    }
    
    // Prepara i dati per il grafico
    const deviceLabels = Object.keys(devicesData);
    const deviceData = Object.values(devicesData);
    
    const osLabels = Object.keys(osData);
    const osData2 = Object.values(osData);
    
    // Colori per il grafico
    const deviceColors = ['#4e73df', '#1cc88a', '#36b9cc'];
    const osColors = ['#f6c23e', '#e74a3b', '#5a5c69', '#858796', '#6610f2'];
    
    // Distruggi il grafico esistente se presente
    if (window.deviceOsChart) {
        window.deviceOsChart.destroy();
    }
}

/**
 * Aggiorna la sezione di riepilogo aggregato degli utenti
 */
function updateAggregatedUserSection() {
    // Questa funzione non è più necessaria perché i dati vengono caricati da Google Sheets
    // e la sezione di riepilogo aggregato è stata nascosta.
    const aggregatedSection = document.getElementById('aggregated-users-section');
    if (aggregatedSection) {
        aggregatedSection.style.display = 'none';
    }
}
    
    // Crea il nuovo grafico
    window.deviceOsChart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: [...deviceLabels, ...osLabels],
            datasets: [{
                data: [...deviceData, ...osData2],
                backgroundColor: [...deviceColors.slice(0, deviceData.length), ...osColors.slice(0, osData2.length)],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = [...deviceData, ...osData2].reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

/**
 * Inizializza il toggle per il tema scuro
 */
function initThemeToggle() {
    const themeToggleInput = document.getElementById('theme-toggle-input');
    
    // Controlla lo stato del tema scuro al caricamento della pagina
    function checkDarkMode() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeToggleInput.checked = true;
        }
    }
    
    checkDarkMode();
    
    themeToggleInput.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    window.addEventListener("storage", event => {
        if (event.key === "darkMode") {
            if (event.newValue === "enabled") {
                document.body.classList.add("dark-mode");
                themeToggleInput.checked = true;
            } else {
                document.body.classList.remove("dark-mode");
                themeToggleInput.checked = false;
            }
        }
    });
}
