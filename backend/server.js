require('dotenv').config();
// --- IMPORTAZIONI (In cima) ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // <--- NUOVO: Importiamo le rotte qui in alto
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connesso a MongoDB con successo!'))
  .catch(err => console.error('❌ Errore di connessione a MongoDB:', err));

// --- ROTTE (Qui attiviamo i percorsi) ---
app.use('/api/auth', authRoutes); // <--- NUOVO: Tutte le richieste che iniziano con /api/auth vanno al nostro file
app.use('/api/items', itemRoutes);

// Rotta di prova base
app.get('/', (req, res) => {
  res.send('Ciao! Il server ArtAround è online. 🎨');
});

// --- AVVIO SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});