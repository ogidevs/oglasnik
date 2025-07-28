const Ad = require('../models/adModel');
const User = require('../models/userModel');

// GET /api/users/me
exports.getCurrentUserInfo = async (req, res, next) => {
    // req.user je već dostupan iz `protect` middleware-a
    res.json({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
    });
};

// GET /api/users/me/ads
exports.getCurrentUserAds = async (req, res, next) => {
    try {
        const ads = await Ad.find({ korisnik: req.user._id })
            .populate('kategorija', 'naziv')
            .sort({ datumKreiranja: -1 });
        res.json(ads);
    } catch (error) {
        next(error);
    }
};