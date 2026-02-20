const mongoose = require('mongoose');

// Schema per gli Item (Opere d'arte)
// Usiamo una struttura compatibile con JSON-LD / Schema.org
// Tipo: https://schema.org/VisualArtwork

const itemSchema = new mongoose.Schema({
  // Identificatori univoci per il Semantic Web
  "@context": { type: String, default: "https://schema.org" },
  "@type": { type: String, default: "VisualArtwork" },

  // Dati base (Carta d'identità)
  name: { type: String, required: true }, // Titolo
  author: { type: String, required: true }, // Autore (in futuro potrebbe essere un Link a un'entità Persona)
  dateCreated: { type: String }, // Data (es. "1865-1866")
  artMedium: { type: String }, // Tecnica (es. "Olio su tela")
  
  // Gestione Dimensioni (complesso perché può avere altezza/larghezza o frammenti)
  width: { type: Number }, // In cm
  height: { type: Number }, // In cm
  
  // Collocazione
  locationCreated: { type: String }, // Luogo di creazione (es. "Foresta di Fontainebleau")
  provider: { type: String }, // Dove si trova ora (es. "Musée d'Orsay")

  // Analisi e Descrizione (Campi lunghi)
  description: { type: String }, // Descrizione generale
  visualAnalysis: { type: String }, // Analisi visiva (Luce, Colore, Composizione)
  historicalContext: { type: String }, // Contesto storico
  
  // Metadati per la ricerca e il quiz
  keywords: [String], // Es: ["Impressionismo", "Picnic", "Luce"]
  
  // URL dell'immagine (fondamentale per il frontend)
  image: { type: String } 
});

module.exports = mongoose.model('Item', itemSchema);