const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/gallery',
    'uploads/sliders', 
    'uploads/highlights',
    'uploads/interviews',
    'uploads/sponsors',
    'uploads/news'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/gallery'; // default
    
    // Ensure req.body exists
    if (!req.body) req.body = {};
    
    // Determine upload path based on type
    if (req.body.type) {
      switch (req.body.type) {
        case 'slider':
          uploadPath = 'uploads/sliders';
          break;
        case 'highlight':
          uploadPath = 'uploads/highlights';
          break;
        case 'interview':
          uploadPath = 'uploads/interviews';
          break;
        case 'sponsor':
          uploadPath = 'uploads/sponsors';
          break;
        case 'news':
          uploadPath = 'uploads/news';
          break;
        default:
          uploadPath = 'uploads/gallery';
      }
    }
    
    cb(null, path.join(__dirname, '..', uploadPath));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, ext);
    cb(null, `${originalName}-${uniqueSuffix}${ext}`);
  }
});

// File filter
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg, jpg, png, webp, gif files are allowed!'), false);
  }
}

// Create different upload instances for different purposes
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadSingle = upload.single('image');
const uploadMultiple = upload.array('images', 10); // Max 10 images

// Wrapper functions for different upload types
const uploadGallery = (req, res, next) => {
  if (!req.body) req.body = {};
  req.body.type = 'gallery';
  uploadSingle(req, res, next);
};

const uploadSlider = (req, res, next) => {
  if (!req.body) req.body = {};
  req.body.type = 'slider';
  uploadSingle(req, res, next);
};

const uploadHighlight = (req, res, next) => {
  if (!req.body) req.body = {};
  req.body.type = 'highlight';
  uploadSingle(req, res, next);
};

const uploadInterview = (req, res, next) => {
  if (!req.body) req.body = {};
  req.body.type = 'interview';
  uploadSingle(req, res, next);
};

const uploadSponsor = (req, res, next) => {
  if (!req.body) req.body = {};
  req.body.type = 'sponsor';
  uploadSingle(req, res, next);
};

const uploadNews = (req, res, next) => {
  if (!req.body) req.body = {};
  req.body.type = 'news';
  uploadSingle(req, res, next);
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadGallery,
  uploadSlider,
  uploadHighlight,
  uploadInterview,
  uploadSponsor,
  uploadNews
}; 