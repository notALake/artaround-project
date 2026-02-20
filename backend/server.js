const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware (strumenti che preparano i dati prima che arrivino alle tue funzioni)
app.use(cors()); // Permette al frontend di parlare con il backend
app.use(express.json()); // Permette di leggere i dati JSON inviati dal client

// 🔌 Connessione al Database MongoDB
// Notare "mongodb://localhost:27017/artaround":
// - localhost: perché il database gira sul tuo stesso computer (grazie a Docker)
// - 27017: è la porta standard di MongoDB
// - artaround: è il nome che diamo al tuo database
mongoose.connect('mongodb://localhost:27017/artaround')
  .then(() => console.log('✅ Connesso a MongoDB con successo!'))
  .catch(err => console.error('❌ Errore di connessione a MongoDB:', err));

// Rotta di prova (giusto per vedere se il server risponde)
app.get('/', (req, res) => {
  res.send('Ciao! Il server ArtAround è online. 🎨');
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});