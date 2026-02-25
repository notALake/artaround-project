const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Definizione delle rotte
router.post('/', itemController.createItem); // POST /api/items -> Crea
router.get('/', itemController.getItems);    // GET /api/items -> Leggi tutte
router.get('/:id', itemController.getItemById); // GET /api/items/123 -> Leggi una

module.exports = router;