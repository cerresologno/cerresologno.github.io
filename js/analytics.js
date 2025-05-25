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
    if (!analyticsData.devices) analyticsData.devices = {};
    if (!analyticsData.browsers) analyticsData.browsers = {};
    if (!analyticsData.os) analyticsData.os = {};
    if (!analyticsData.referrers) analyticsData.referrers = {};
    
    // Incrementa il contatore delle visite totali
    analyticsData.totalVisits++;
    
    // Incrementa il contatore per la pagina specifica
    analyticsData.pageVisits[currentPage] = (analyticsData.pageVisits[currentPage] || 0) + 1;
    
    // Incrementa il contatore per la data corrente
    analyticsData.dailyVisits[today] = (analyticsData.dailyVisits[today] || 0) + 1;
    
    // Rileva e registra informazioni sul dispositivo
    const userAgent = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceType = 'Mobile';
        if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) {
            deviceType = 'Tablet';
        }
    }
    analyticsData.devices[deviceType] = (analyticsData.devices[deviceType] || 0) + 1;
    
    // Rileva e registra informazioni sulla provenienza (referrer)
    let referrer = 'Accesso Diretto';
    if (document.referrer) {
        const referrerUrl = new URL(document.referrer);
        const referrerDomain = referrerUrl.hostname;
        
        if (referrerDomain.includes('google')) referrer = 'Google';
        else if (referrerDomain.includes('facebook')) referrer = 'Facebook';
        else if (referrerDomain.includes('instagram')) referrer = 'Instagram';
        else if (referrerDomain.includes('twitter') || referrerDomain.includes('x.com')) referrer = 'Twitter';
        else if (referrerDomain.includes('linkedin')) referrer = 'LinkedIn';
        else if (referrerDomain.includes('bing')) referrer = 'Bing';
        else if (referrerDomain.includes('yahoo')) referrer = 'Yahoo';
        else if (referrerDomain !== window.location.hostname) referrer = 'Altri Siti';
    }
    analyticsData.referrers[referrer] = (analyticsData.referrers[referrer] || 0) + 1;
    
    // Rileva e registra informazioni sul browser
    let browser = 'Altro';
    if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('SamsungBrowser') > -1) browser = 'Samsung Browser';
    else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) browser = 'Opera';
    else if (userAgent.indexOf('Trident') > -1) browser = 'Internet Explorer';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
    else if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    analyticsData.browsers[browser] = (analyticsData.browsers[browser] || 0) + 1;
    
    // Rileva e registra informazioni sul sistema operativo
    let os = 'Altro';
    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac OS') > -1) os = 'MacOS';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    analyticsData.os[os] = (analyticsData.os[os] || 0) + 1;
    
    // La funzionalità di geolocalizzazione è stata rimossa per rispettare la privacy degli utenti
    
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
 * Ottiene i dati sui browser utilizzati
 * @param {number} limit - Il numero massimo di browser da restituire
 * @returns {Array} Un array di oggetti {browser, visits, percentage}
 */
function getBrowsersData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const browsers = analyticsData.browsers || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {browser, visits, percentage}
    const browsersArray = Object.keys(browsers).map(browser => ({
        browser,
        visits: browsers[browser],
        percentage: totalVisits > 0 ? (browsers[browser] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    browsersArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di browser
    return browsersArray.slice(0, limit);
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

// La funzione getRegionsData è stata rimossa per rispettare la privacy degli utenti

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
 * Ottiene un riepilogo aggregato di tutti gli utenti che visitano il sito
 * @returns {Object} Un oggetto con i dati aggregati degli utenti
 */
function getAggregatedUserData() {
    const analyticsData = getAnalyticsData();
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Calcola il numero di visite negli ultimi 7 giorni
    const dailyVisits = analyticsData.dailyVisits || {};
    const last7Days = [];
    let visitsLast7Days = 0;
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        last7Days.push(dateString);
        visitsLast7Days += (dailyVisits[dateString] || 0);
    }
    
    // Calcola il numero di visite nell'ultimo mese (30 giorni)
    let visitsLastMonth = 0;
    Object.keys(dailyVisits).forEach(date => {
        visitsLastMonth += dailyVisits[date];
    });
    
    // Calcola la media giornaliera di visite negli ultimi 7 giorni
    const avgDailyVisits = visitsLast7Days > 0 ? (visitsLast7Days / 7).toFixed(1) : 0;
    
    // Ottieni i dati sui dispositivi, browser e sistemi operativi più utilizzati
    const topDevices = getDevicesData(3);
    const topBrowsers = getBrowsersData(3);
    const topOs = getOsData(3);
    const topReferrers = getReferrersData(3);
    
    // Calcola la distribuzione percentuale dei dispositivi
    const deviceDistribution = {};
    topDevices.forEach(item => {
        deviceDistribution[item.device] = item.percentage;
    });
    
    return {
        totalVisits,
        visitsLast7Days,
        visitsLastMonth,
        avgDailyVisits,
        topDevices,
        topBrowsers,
        topOs,
        topReferrers,
        deviceDistribution
    };
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

/**
 * Ottiene i dati sui browser utilizzati
 * @param {number} limit - Il numero massimo di browser da restituire
 * @returns {Array} Un array di oggetti {browser, visits, percentage}
 */
function getBrowsersData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const browsers = analyticsData.browsers || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {browser, visits, percentage}
    const browsersArray = Object.keys(browsers).map(browser => ({
        browser,
        visits: browsers[browser],
        percentage: totalVisits > 0 ? (browsers[browser] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    browsersArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di browser
    return browsersArray.slice(0, limit);
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

// La funzione getRegionsData è stata rimossa per rispettare la privacy degli utenti

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
 * Azzera tutti i dati di analytics
 */
function resetAnalyticsData() {
    if (confirm('Sei sicuro di voler azzerare tutte le statistiche? Questa azione non può essere annullata.')) {
        localStorage.removeItem('cerresologno-analytics');
        alert('Statistiche azzerate con successo.');
    }
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
 * Ottiene i dati sui browser utilizzati
 * @param {number} limit - Il numero massimo di browser da restituire
 * @returns {Array} Un array di oggetti {browser, visits, percentage}
 */
function getBrowsersData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const browsers = analyticsData.browsers || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {browser, visits, percentage}
    const browsersArray = Object.keys(browsers).map(browser => ({
        browser,
        visits: browsers[browser],
        percentage: totalVisits > 0 ? (browsers[browser] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    browsersArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di browser
    return browsersArray.slice(0, limit);
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

// La funzione getRegionsData è stata rimossa per rispettare la privacy degli utenti

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
 * Ottiene un riepilogo aggregato di tutti gli utenti che visitano il sito
 * @returns {Object} Un oggetto con i dati aggregati degli utenti
 */
function getAggregatedUserData() {
    const analyticsData = getAnalyticsData();
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Calcola il numero di visite negli ultimi 7 giorni
    const dailyVisits = analyticsData.dailyVisits || {};
    const last7Days = [];
    let visitsLast7Days = 0;
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        last7Days.push(dateString);
        visitsLast7Days += (dailyVisits[dateString] || 0);
    }
    
    // Calcola il numero di visite nell'ultimo mese (30 giorni)
    let visitsLastMonth = 0;
    Object.keys(dailyVisits).forEach(date => {
        visitsLastMonth += dailyVisits[date];
    });
    
    // Calcola la media giornaliera di visite negli ultimi 7 giorni
    const avgDailyVisits = visitsLast7Days > 0 ? (visitsLast7Days / 7).toFixed(1) : 0;
    
    // Ottieni i dati sui dispositivi, browser e sistemi operativi più utilizzati
    const topDevices = getDevicesData(3);
    const topBrowsers = getBrowsersData(3);
    const topOs = getOsData(3);
    const topReferrers = getReferrersData(3);
    
    // Calcola la distribuzione percentuale dei dispositivi
    const deviceDistribution = {};
    topDevices.forEach(item => {
        deviceDistribution[item.device] = item.percentage;
    });
    
    return {
        totalVisits,
        visitsLast7Days,
        visitsLastMonth,
        avgDailyVisits,
        topDevices,
        topBrowsers,
        topOs,
        topReferrers,
        deviceDistribution
    };
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

/**
 * Ottiene i dati sui browser utilizzati
 * @param {number} limit - Il numero massimo di browser da restituire
 * @returns {Array} Un array di oggetti {browser, visits, percentage}
 */
function getBrowsersData(limit = 10) {
    const analyticsData = getAnalyticsData();
    const browsers = analyticsData.browsers || {};
    const totalVisits = analyticsData.totalVisits || 0;
    
    // Converti l'oggetto in un array di oggetti {browser, visits, percentage}
    const browsersArray = Object.keys(browsers).map(browser => ({
        browser,
        visits: browsers[browser],
        percentage: totalVisits > 0 ? (browsers[browser] / totalVisits * 100).toFixed(1) : 0
    }));
    
    // Ordina l'array per numero di visite (decrescente)
    browsersArray.sort((a, b) => b.visits - a.visits);
    
    // Restituisci solo il numero richiesto di browser
    return browsersArray.slice(0, limit);
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

// La funzione getRegionsData è stata rimossa per rispettare la privacy degli utenti

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
 * Azzera tutti i dati di analytics
 */
function resetAnalyticsData() {
    if (confirm('Sei sicuro di voler azzerare tutte le statistiche? Questa azione non può essere annullata.')) {
        localStorage.removeItem('cerresologno-analytics');
        alert('Statistiche azzerate con successo.');
    }
}
// Funzione sendAnalyticsToGoogleSheet rimossa perché non implementata
