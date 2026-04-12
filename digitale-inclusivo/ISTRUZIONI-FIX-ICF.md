# Istruzioni: Fix e Verifica Dashboard Decodificatore ICF

## Contesto

Il file `/Users/ivanferrero/Documents/GitHub/ivanferreroit/digitale-inclusivo/decodificatore-icf/index.html` è una dashboard interattiva single-page (~1550 righe) per decodificare codici ICF. Contiene HTML + CSS + JS inline, con un database di 374 codici ICF in un array `icfDatabase`.

Il file è stato riscritto nella sessione precedente per correggere bug critici, ma l'utente riporta che **ancora non funziona nulla**: tab, ricerca, navigazione ad albero. L'obiettivo è diagnosticare e risolvere definitivamente.

## Cosa fare

### 1. DIAGNOSI — Apri il file nel browser e verifica

Apri il file `index.html` direttamente in Chrome (via `open` su Mac) e usa lo strumento Chrome MCP per:

- Verificare se ci sono **errori JavaScript in console** (`read_console_messages`)
- Cliccare sulla tab "Cerca per Parola" e verificare se cambia
- Digitare "memoria" nel campo di ricerca e verificare se appaiono risultati
- Cliccare su "Naviga per Categoria" e verificare se l'albero si espande
- Cliccare su un codice e verificare se si apre il modal

### 2. FIX — Se trovi errori, ecco l'architettura che DEVE funzionare

Il JS ha questa struttura (NON cambiarla, fixala se rotta):

**Tab switching**: I `<button>` hanno `data-tab="search-tab"` etc. Un event listener su `#tabBar` cattura i click e chiama `switchTab(tabId)` che:
- Rimuove `.active` da tutti `.tab-btn` e `.tab-content`
- Aggiunge `.active` al bottone con `[data-tab="${tabId}"]` e al `div#${tabId}`

**Ricerca**: I risultati sono resi con `data-code="${code.code}"` (NO inline onclick). Un event listener document-level con `e.target.closest('.result-item[data-code]')` legge il codice e lo cerca in `icfMap` (oggetto `{code: index}`).

**Albero**: `initializeTree()` costruisce il DOM programmaticamente con `onclick` diretti sugli elementi creati (OK perché sono closure, non stringhe interpolate).

**Modal**: `showCodeCard(code)` popola `#detailContent` e aggiunge `.active` a `#detailModal`. Chiusura via click esterno, bottone "Chiudi", o Escape.

### 3. VISUAL CHECK

- Il background deve usare `body::before` con `opacity: 0.15` (griglia sottile, non quadratoni visibili)
- Il design system è: `--bg-primary: #0a0e14`, `--accent-cyan: #00d9ff`, font Outfit + JetBrains Mono
- NON ci deve essere CSS hardcoded per `#site-menu` (lo inietta `menu.js`)
- Confronta con una dashboard funzionante tipo `/dashboards/ashby-dashboard-with-menu.html`

### 4. MENU

Il file `/Users/ivanferrero/Documents/GitHub/ivanferreroit/assets/menu.js` contiene già "Digitale Inclusivo" come voce del menu (aggiunto nella sessione precedente). Verifica che sia presente.

### 5. TEST FINALE

Dopo ogni fix, ricarica la pagina e verifica TUTTE e 4 le funzionalità:
1. Tab switching (tutte e 4 le tab)
2. Ricerca per codice (prova "b140", "d220", "e310")
3. Ricerca per parola (prova "memoria", "scuola", "ambiente")
4. Navigazione albero (espandi B, clicca su un codice, verifica modal)
5. Modal (apertura, chiusura con X, chiusura con click esterno, chiusura con Escape)

## File coinvolti

- **Dashboard**: `/Users/ivanferrero/Documents/GitHub/ivanferreroit/digitale-inclusivo/decodificatore-icf/index.html`
- **Menu sito**: `/Users/ivanferrero/Documents/GitHub/ivanferreroit/assets/menu.js`
- **Dashboard reference** (funzionante): `/Users/ivanferrero/Documents/GitHub/ivanferreroit/dashboards/ashby-dashboard-with-menu.html`
- **Spec originale**: `/Users/ivanferrero/Documents/reference/Research/icf/decodificatore-icf-spec.md`

## Vincoli

- Il file deve restare **single-page** (HTML + CSS + JS inline, nessun file esterno oltre menu.js e Google Fonts)
- I nomi ufficiali ICF **NON possono essere modificati** (licenza CC BY-ND 3.0 IGO dell'OMS)
- Esegui tutto autonomamente senza chiedere conferme
