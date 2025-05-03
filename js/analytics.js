/**
 * Sistema di monitoraggio delle visite per il sito Pro Loco Cerresologno
 * Questo script traccia le visite alle pagine e memorizza i dati in localStorage
 */

// Inizializza il sistema di analytics quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', function() {
    // Registra la visita alla pagina corrente
    trackPageVisit();
});

/**
 * Registra una visita alla pagina corrente
 */
function trackPageVisit() {
    // Ottieni il percorso della pagina corrente (es. /index.html, /news.html)
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    
    // Ottieni la data corrente in formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Carica i dati di analytics esistenti o inizializza un nuovo oggetto
    let analyticsData = JSON.parse(localStorage.getItem('cerresologno-analytics') || '{}');
    
    // Inizializza la struttura dei dati se non esiste
    if (!analyticsData.totalVisits) analyticsData.totalVisits = 0;
    if (!analyticsData.pageVisits) analyticsData.pageVisits = {};
    if (!analyticsData.dailyVisits) analyticsData.dailyVisits = {};
    
    // Incrementa il contatore delle visite totali
    analyticsData.totalVisits++;
    
    // Incrementa il contatore per la pagina specifica
    analyticsData.pageVisits[currentPage] = (analyticsData.pageVisits[currentPage] || 0) + 1;
    
    // Incrementa il contatore per la data corrente
    analyticsData.dailyVisits[today] = (analyticsData.dailyVisits[today] || 0) + 1;
    
    // Mantieni solo gli ultimi 30 giorni di dati per evitare di occupare troppo spazio
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    // Filtra i dati giornalieri per mantenere solo gli ultimi 30 giorni
    const filteredDailyVisits = {};
    Object.keys(analyticsData.dailyVisits).forEach(date => {
        if (date >= cutoffDate) {
            filteredDailyVisits[date] = analyticsData.dailyVisits[date];
        }
    });
    analyticsData.dailyVisits = filteredDailyVisits;
    
    // Salva i dati aggiornati
    localStorage.setItem('cerresologno-analytics', JSON.stringify(analyticsData));
}

/**
 * Ottiene i dati di analytics
 * @returns {Object} I dati di analytics
 */
function getAnalyticsData() {
    return JSON.parse(localStorage.getItem('cerresologno-analytics') || '{}');
}

/**
 * Ottiene il numero totale di visite
 * @returns {number} Il numero totale di visite
 */
function getTotalVisits() {
    const analyticsData = getAnalyticsData();
    return analyticsData.totalVisits || 0;
}

/**
 * Ottiene il numero di visite per la data specificata
 * @param {string} date - La data in formato YYYY-MM-DD
 * @returns {number} Il numero di visite per la data specificata
 */
function getVisitsForDate(date) {
    const analyticsData = getAnalyticsData();
    return analyticsData.dailyVisits?.[date] || 0;
}

/**
 * Ottiene il numero di visite per la pagina specificata
 * @param {string} page - Il nome della pagina
 * @returns {number} Il numero di visite per la pagina specificata
 */
function getVisitsForPage(page) {
    const analyticsData = getAnalyticsData();
    return analyticsData.pageVisits?.[page] || 0;
}

/**
 * Ottiene le pagine più visitate, ordinate per numero di visite
 * @param {number} limit - Il numero massimo di pagine da restituire
 * @returns {Array} Un array di oggetti {page, visits}
 */
function getTopPages(limit = 10) {
    const analyticsData = getAnalyticsData();
    const pageVisits = analyticsData.pageVisits || {};
    
    // Converti l'oggetto in un array di oggetti {page, visits}
    const pagesArray = Object.keys(pageVisits).map(page => ({
        page,
        visits: pageVisits[page]
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    pagesArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di pagine
    return pagesArray.slice(0, limit);
}

/**
 * Ottiene i dati delle visite giornaliere per gli ultimi N giorni
 * @param {number} days - Il numero di giorni da considerare
 * @returns {Object} Un oggetto con date come chiavi e visite come valori
 */
function getDailyVisitsData(days = 7) {
    const analyticsData = getAnalyticsData();
    const dailyVisits = analyticsData.dailyVisits || {};
    
    // Genera un array di date per gli ultimi N giorni
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    // Crea un oggetto con le date e le visite corrispondenti
    const result = {};
    dates.forEach(date => {
        result[date] = dailyVisits[date] || 0;
    });
    
    return result;
}

/**
 * Azzera tutti i dati di analytics
 */
function resetAnalyticsData() {
    if (confirm('Sei sicuro di voler azzerare tutte le statistiche? Questa azione non può essere annullata.')) {
        localStorage.removeItem('cerresologno-analytics');
        alert('Statistiche azzerate con successo.');
    }
}