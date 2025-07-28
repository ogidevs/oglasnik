const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Konfiguracija za čuvanje fajlova
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.FILE_UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        // Kreira jedinstveno ime fajla da se izbegne preklapanje
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Provera tipa fajla
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Kreiramo rutu /api/files/upload
router.post('/upload', protect, upload.array('files', 5), (req, res) => { // 'files' je ime polja, 5 je max broj fajlova
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }

    // Vraćamo listu URL-ova, baš kao u Java verziji
    const fileUrls = req.files.map(file => {
        // Konstruišemo pun URL
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });
    
    res.status(200).json(fileUrls);
});

module.exports = router;