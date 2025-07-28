const express = require('express');
const { getCurrentUserInfo, getCurrentUserAds } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// protect osigurava da je korisnik ulogovan za sve /me rute
router.get('/me', protect, getCurrentUserInfo);
router.get('/me/ads', protect, getCurrentUserAds);

module.exports = router;