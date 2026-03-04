const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Errore nella creazione dell'item", error });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};
    
    if (q) {
      filter = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]
      };
    }

    const items = await Item.find(filter);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli items", error });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Opera non trovata" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Errore server", error });
  }
};