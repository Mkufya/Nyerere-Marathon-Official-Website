const Gallery = require('../models/gallery');
const fs = require('fs');
const path = require('path');

// Get all gallery/slide items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery items.' });
  }
};

// Get one item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
};

// Create gallery/slide item (with image upload)
exports.createItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required.' });
    const { title, description, type } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    const newItem = new Gallery({ title, description, imageUrl, type });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item.' });
  }
};

// Update gallery/slide item (title, description, type)
exports.updateItem = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, type } },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item.' });
  }
};

// Delete gallery/slide item and image file
exports.deleteItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    // Delete image file
    if (item.imageUrl) {
      const filePath = path.join(__dirname, '..', item.imageUrl);
      fs.unlink(filePath, err => {
        // Ignore error if file doesn't exist
      });
    }
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
}; 