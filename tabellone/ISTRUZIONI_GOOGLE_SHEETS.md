# 🏐 CONFIGURAZIONE GOOGLE SHEETS PER IL SEGNAPUNTI BEACH VOLLEY

## 📋 Passo 1: Creare il foglio Google Sheets

1. Vai su [Google Sheets](https://sheets.google.com)
2. Crea un nuovo foglio di calcolo
3. Rinominalo "Segnapunti Beach Volley 2025"

## 📊 Passo 2: Struttura del foglio

Crea le seguenti colonne nella prima riga (intestazioni):

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Girone** | **Squadra 1** | **Squadra 2** | **Set 1 Squadra 1** | **Set 1 Squadra 2** | **Set 2 Squadra 1** | **Set 2 Squadra 2** | **Set 3 Squadra 1** | **Set 3 Squadra 2** | **Vincitore** | **Orario** | **Note** |

## 🏆 Passo 3: Inserire i dati delle partite

Copia e incolla i dati dal file CSV `segnapunti_beach_volley.csv` nelle righe successive.

**Esempio di riga:**
```
MOSCOW MULE | Spritz Compari | Volley Vintage | 21 | 19 | 21 | 18 | | | Spritz Compari | 9:30 | Partita completata
```

## 🔗 Passo 4: Pubblicare il foglio

1. **File** → **Condividi** → **Pubblica sul web**
2. Seleziona **"Foglio intero"**
3. Scegli **"Valori separati da virgola (.csv)"**
4. Clicca **"Pubblica"**
5. **Copia l'URL generato**

## ⚙️ Passo 5: Aggiornare il codice HTML

Nel file `segnapunti_beach_volley.html`, sostituisci questa riga:

```javascript
const GOOGLE_SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRW8lCwnAo03cDMxGWi5T6xQSpYDm3iO_SyJy6d9kUai2Hl1VFZ_SF35MaqtLNjA6ti6KlU3OiGosNe/pub?gid=0&single=true&output=csv";
```

Con l'URL che hai copiato al Passo 4.

## 📱 Passo 6: Utilizzo del segnapunti

### Durante le partite:
1. **Inserisci i punteggi** nelle colonne Set 1, Set 2, Set 3
2. **Compila il vincitore** al termine della partita
3. **Aggiungi note** se necessario (es. "Partita sospesa per pioggia")

### Aggiornamenti automatici:
- Il segnapunti si aggiorna **ogni 30 secondi**
- I punteggi appaiono in tempo reale sul sito web
- **Non serve ricaricare la pagina**

## 🎨 Passo 7: Personalizzazione (opzionale)

### Formattazione condizionale:
- **Vincitori**: Evidenzia in verde le righe con vincitori
- **Orari**: Usa colori diversi per mattina/pomeriggio
- **Gironi**: Colora le righe per girone

### Esempi di formule utili:
```
// Conta partite completate
=COUNTIF(I:I, "<>")

// Conta partite per girone
=COUNTIF(A:A, "MOSCOW MULE")

// Trova prossima partita
=MINIFS(K:K, I:I, "")
```

## 🔒 Passo 8: Condivisione e permessi

### Per gli arbitri:
1. **Condividi il foglio** con gli arbitri
2. **Permetti la modifica** solo delle colonne punteggi
3. **Blocca le colonne** Girone, Squadre, Orario

### Per il pubblico:
- Il foglio è **pubblico** (pubblicato sul web)
- **Solo visualizzazione** per i visitatori del sito
- **Aggiornamenti in tempo reale**

## 🚨 Risoluzione problemi

### Il segnapunti non si aggiorna:
1. Verifica che il foglio sia **pubblicato sul web**
2. Controlla che l'URL sia **corretto** nel codice HTML
3. Assicurati che il formato sia **CSV**

### Errori di caricamento:
1. **Fallback automatico** al CSV statico
2. Controlla la **console del browser** per errori
3. Verifica i **permessi** del foglio

## 📞 Supporto

Se hai problemi:
1. Controlla che il foglio sia **pubblicato correttamente**
2. Verifica che l'URL nel codice sia **aggiornato**
3. Testa l'URL CSV direttamente nel browser

---

**🎯 Obiettivo finale:** Un segnapunti professionale che si aggiorna automaticamente e permette a tutti di seguire il torneo in tempo reale! 🏖️🏐 