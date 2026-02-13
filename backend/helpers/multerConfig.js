const multer = require('multer');
const fs = require('fs');

// Storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create uploads folder if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename with timestamp
    },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Accept PDFs
    } else if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept images
    } else {
        cb(new Error('Only PDF or image files are allowed!'), false);
    }
};


// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
    },
});

module.exports = upload;