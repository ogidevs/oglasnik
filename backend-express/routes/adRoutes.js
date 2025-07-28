const express = require('express');
const { getAllAds, getAdById, createAd, updateAd, deleteAd } = require('../controllers/adController');
const { protect, getUser } = require('../middleware/authMiddleware');
const { logAction } = require('../middleware/logMiddleware');

const router = express.Router();

router.route('/')
    .get(getAllAds)
    .post(protect, logAction('Created post'), createAd);

router.route('/:id')
    .get(getUser, logAction('Details about post'), getAdById)
    .put(protect, logAction('Updated post'), updateAd)
    .delete(protect, logAction('Deleted post'), deleteAd);

module.exports = router;