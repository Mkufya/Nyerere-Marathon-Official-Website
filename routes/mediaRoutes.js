const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const sliderDir = path.join(uploadsDir, 'slider');
const galleryDir = path.join(uploadsDir, 'gallery');
const newsDir = path.join(uploadsDir, 'news');
const sponsorsDir = path.join(uploadsDir, 'sponsors');

[uploadsDir, sliderDir, galleryDir, newsDir, sponsorsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.body.type || 'gallery';
    let uploadPath = galleryDir;
    
    switch (type) {
      case 'slider':
        uploadPath = sliderDir;
        break;
      case 'gallery':
        uploadPath = galleryDir;
        break;
      case 'news':
        uploadPath = newsDir;
        break;
      case 'sponsor':
        uploadPath = sponsorsDir;
        break;
      default:
        uploadPath = galleryDir;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Temporary in-memory storage for media items
let mediaItems = [
  {
    id: '1',
    title: 'Marathon Start Line',
    description: 'Exciting start of the marathon event',
    filename: 'marathon-start.jpg',
    originalName: 'marathon-start.jpg',
    url: '/uploads/slider/marathon-start.jpg',
    type: 'slider',
    category: 'events',
    size: 2048576,
    mimeType: 'image/jpeg',
    uploadedAt: '2025-01-15T10:30:00Z',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    title: 'Runners on Course',
    description: 'Participants running through the city',
    filename: 'runners-course.jpg',
    originalName: 'runners-course.jpg',
    url: '/uploads/slider/runners-course.jpg',
    type: 'slider',
    category: 'events',
    size: 1536000,
    mimeType: 'image/jpeg',
    uploadedAt: '2025-01-15T11:00:00Z',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    title: 'Finish Line Celebration',
    description: 'Celebrating marathon completion',
    filename: 'finish-line.jpg',
    originalName: 'finish-line.jpg',
    url: '/uploads/gallery/finish-line.jpg',
    type: 'gallery',
    category: 'events',
    size: 3072000,
    mimeType: 'image/jpeg',
    uploadedAt: '2025-01-15T12:00:00Z',
    isActive: true
  }
];

// Get all media items
router.get('/', (req, res) => {
  try {
    const { type, category, isActive } = req.query;
    
    let filteredMedia = mediaItems;
    
    if (type) {
      filteredMedia = filteredMedia.filter(item => item.type === type);
    }
    
    if (category) {
      filteredMedia = filteredMedia.filter(item => item.category === category);
    }
    
    if (isActive !== undefined) {
      filteredMedia = filteredMedia.filter(item => item.isActive === (isActive === 'true'));
    }
    
    res.json(filteredMedia);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get media by ID
router.get('/:id', (req, res) => {
  try {
    const mediaItem = mediaItems.find(item => item.id === req.params.id);
    
    if (!mediaItem) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    res.json(mediaItem);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new media
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, type, category, isActive, order } = req.body;
    
    const newMedia = {
      id: Date.now().toString(),
      title: title || req.file.originalname,
      description: description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${type}/${req.file.filename}`,
      type: type || 'gallery',
      category: category || 'general',
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      isActive: isActive === 'true' || isActive === true,
      order: order ? parseInt(order) : undefined
    };

    mediaItems.unshift(newMedia);
    
    console.log('✅ Media uploaded successfully:', newMedia.title);
    
    res.status(201).json({
      message: 'Media uploaded successfully',
      media: newMedia
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Update media item
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const mediaIndex = mediaItems.findIndex(item => item.id === id);
    
    if (mediaIndex === -1) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    mediaItems[mediaIndex] = {
      ...mediaItems[mediaIndex],
      ...updateData,
      id: id // Ensure ID doesn't change
    };
    
    console.log('✅ Media updated successfully:', mediaItems[mediaIndex].title);
    
    res.json({
      message: 'Media updated successfully',
      media: mediaItems[mediaIndex]
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ message: 'Server error during update' });
  }
});

// Delete media item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const mediaIndex = mediaItems.findIndex(item => item.id === id);
    
    if (mediaIndex === -1) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    const deletedMedia = mediaItems[mediaIndex];
    
    // Remove from array
    mediaItems.splice(mediaIndex, 1);
    
    // TODO: Delete actual file from filesystem
    // const filePath = path.join(__dirname, '..', deletedMedia.url);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }
    
    console.log('✅ Media deleted successfully:', deletedMedia.title);
    
    res.json({
      message: 'Media deleted successfully',
      media: deletedMedia
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

// Get media statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      total: mediaItems.length,
      byType: {
        slider: mediaItems.filter(item => item.type === 'slider').length,
        gallery: mediaItems.filter(item => item.type === 'gallery').length,
        news: mediaItems.filter(item => item.type === 'news').length,
        sponsor: mediaItems.filter(item => item.type === 'sponsor').length
      },
      byStatus: {
        active: mediaItems.filter(item => item.isActive).length,
        inactive: mediaItems.filter(item => !item.isActive).length
      },
      totalSize: mediaItems.reduce((total, item) => total + item.size, 0)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching media stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
