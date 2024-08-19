const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Add a new menu item
router.post('/menu', async (req, res) => {
  const { name, price, quantity, image } = req.body;
  try {
    const newItem = new MenuItem({ name, price, quantity, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all menu items
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
