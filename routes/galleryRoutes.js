const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { uploadSingle } = require('../middleware/upload');

// GET all gallery/slide items
router.get('/api/gallery', galleryController.getAllItems);

// GET one item by ID
router.get('/api/gallery/:id', galleryController.getItemById);

// POST create new item (with image upload)
router.post('/api/gallery', uploadSingle, galleryController.createItem);

// PUT update item (title, description, type)
router.put('/api/gallery/:id', galleryController.updateItem);

// DELETE item
router.delete('/api/gallery/:id', galleryController.deleteItem);

module.exports = router; 