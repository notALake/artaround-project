const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { code, name, items } = req.body;

    const existing = await Visit.findOne({ code: code.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Codice visita già in uso' });
    }

    const visit = new Visit({
      code: code.toLowerCase().trim(),
      name,
      teacher: req.user.id,
      items: items || [],
    });

    await visit.save();
    res.status(201).json(visit);

  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione della visita', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const visits = await Visit.find({ status: { $ne: 'ended' } })
      .populate('teacher', 'username email')
      .populate('items', 'title description')
      .sort({ createdAt: -1 });

    res.json(visits);

  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle visite', error: err.message });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const visit = await Visit.findOne({ code: req.params.code.toLowerCase() })
      .populate('teacher', 'username email')
      .populate('items')
      .populate('quiz');

    if (!visit) {
      return res.status(404).json({ message: 'Visita non trovata' });
    }

    res.json(visit);

  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero della visita', error: err.message });
  }
});

router.patch('/:code/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const visit = await Visit.findOne({ code: req.params.code.toLowerCase() });
    if (!visit) {
      return res.status(404).json({ message: 'Visita non trovata' });
    }

    if (visit.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    visit.status = status;
    await visit.save();

    res.json(visit);

  } catch (err) {
    res.status(500).json({ message: 'Errore aggiornamento status', error: err.message });
  }
});

router.patch('/:code/items', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;

    const visit = await Visit.findOne({ code: req.params.code.toLowerCase() });
    if (!visit) {
      return res.status(404).json({ message: 'Visita non trovata' });
    }

    if (visit.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    visit.items = items;
    await visit.save();

    res.json(visit);

  } catch (err) {
    res.status(500).json({ message: 'Errore aggiornamento opere', error: err.message });
  }
});

module.exports = router;
