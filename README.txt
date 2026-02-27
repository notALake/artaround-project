Membri del gruppo:
1. [Christian Cani] - [0001171190] - [christian.cani@studio.unibo.it] (Membro 1: Backend & Editor)
2. [Nome Membro 2] - [Matricola] - [Email]
3. [Nome Membro 3] - [Matricola] - [Email]

Tipo di progetto: Estensione 18-27 (Gruppo da 3)
Locazione file e docker: Presente nella cartella root: `./docker-compose.yml`

Contributo Individuale (Membro 1: Christian Cani):
### Backend
- Progettazione dell'architettura e configurazione del server (Node.js, Express). Setup di Mongoose per modelli Schema.org-compatibili (`User`, `Item`).
- Implementazione del sistema di autenticazione basato su JWT (JSON Web Tokens) e hashing delle password con Bcrypt.
- Creazione di endpoint dedicati: funzionalità di ricerca avanzata (`/api/items?q=...`) e protezione delle rotte di scrittura tramite Middleware.
- Gestione della sicurezza e validazione dei dati in ingresso.

### Frontend Editor
- Sviluppo del pannello di controllo in HTML/CSS/Vanilla JS.
- Integrazione delle chiamate API asincrone (fetch) per login e gestione opere.
- Implementazione della logica di visualizzazione dinamica (lista opere, feedback visivo salvataggio).

Contributo LLM:
- Supporto per il refactoring del codice backend per aderenza ai principi REST.
- Setup iniziale dei file di configurazione (es. `.env` example).
- Supporto nel debug della strategia JWT e middleware.

Istruzioni per l'installazione (Membro 1):
1. Database: Assicurarsi che MongoDB sia attivo (tramite Docker o servizio locale).
2. Backend:
   - Entrare nella cartella: `cd backend`
   - Installare dipendenze: `npm install`
   - Creare un file `.env` basato sui parametri di configurazione.
   - Avviare: `node server.js`
3. Frontend Editor:
   - Aprire il file `frontend-editor/index.html` in un browser moderno.
