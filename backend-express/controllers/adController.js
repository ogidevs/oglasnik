const Ad = require('../models/adModel');
const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

// JAVNO: GET /api/ads (sa paginacijom i pretragom)
exports.getAllAds = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.size) || 8;
        const page = parseInt(req.query.page) || 0;
        const keyword = req.query.keyword;
        const categoryId = req.query.categoryId;

        let query = {};
        if (keyword) {
            query.naslov = { $regex: keyword, $options: 'i' }; // 'i' for case-insensitive
        }
        if (categoryId) {
            query.kategorija = categoryId;
        }

        const count = await Ad.countDocuments(query);
        const ads = await Ad.find(query)
            .populate('korisnik', 'username') // Popuni samo username
            .populate('kategorija', 'naziv') // Popuni samo naziv kategorije
            .sort({ datumKreiranja: -1 }) // Sortiranje
            .limit(pageSize)
            .skip(pageSize * page);
        
        // Struktura odgovora mora da odgovara onome što frontend očekuje (Page objekat)
        res.json({
            content: ads,
            totalPages: Math.ceil(count / pageSize),
            totalElements: count,
            number: page,
            size: pageSize
        });
    } catch (error) {
        next(error);
    }
};

// JAVNO: GET /api/ads/:id
exports.getAdById = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.id)
            .populate('korisnik', 'username')
            .populate('kategorija', 'naziv');
        
        if (ad) {
            res.json(ad);
        } else {
            res.status(404);
            throw new Error('Ad not found');
        }
    } catch (error) {
        next(error);
    }
};

// KORISNIK: POST /api/ads
exports.createAd = async (req, res, next) => {
    const { naslov, opis, cena, kategorijaId, slikeUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(kategorijaId)) {
        res.status(400); // Bad Request
        throw new Error(`Invalid Category ID format: ${kategorijaId}`);
    }
    // Provera da li kategorija zaista postoji
    const categoryExists = await Category.findById(kategorijaId);
    if (!categoryExists) {
        res.status(404); // Not Found
        throw new Error('Category with this ID does not exist');
    }

    try {
        const ad = new Ad({
            naslov,
            opis,
            cena,
            kategorija: kategorijaId,
            slikeUrl,
            korisnik: req.user._id // Iz protect middleware-a
        });
        const createdAd = await ad.save();
        const populatedAd = await Ad.findById(createdAd._id)
                                    .populate('korisnik', 'username')
                                    .populate('kategorija', 'naziv');
        res.status(201).json(populatedAd);
    } catch (error) {
        next(error);
    }
};

// KORISNIK/ADMIN: PUT /api/ads/:id
exports.updateAd = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            res.status(404);
            throw new Error('Ad not found');
        }
        // Provera da li je korisnik vlasnik oglasa ili admin
        if (ad.korisnik.toString() !== req.user._id.toString() && req.user.role !== 'ROLE_ADMIN') {
            res.status(403);
            throw new Error('User not authorized to update this ad');
        }
        
        
        const { naslov, opis, cena, kategorijaId, slikeUrl } = req.body;

        if (kategorijaId) {
            if (!mongoose.Types.ObjectId.isValid(kategorijaId)) {
                res.status(400);
                throw new Error(`Invalid Category ID format: ${kategorijaId}`);
            }
            const categoryExists = await Category.findById(kategorijaId);
            if (!categoryExists) {
                res.status(404);
                throw new Error('Category with this ID does not exist');
            }
            ad.kategorija = kategorijaId;
        }

        ad.naslov = naslov || ad.naslov;
        ad.opis = opis || ad.opis;
        ad.cena = cena || ad.cena;
        ad.kategorija = kategorijaId || ad.kategorija;
        ad.slikeUrl = slikeUrl || ad.slikeUrl;

        const updatedAd = await ad.save();
        const populatedAd = await Ad.findById(updatedAd._id)
                                    .populate('korisnik', 'username')
                                    .populate('kategorija', 'naziv');

        res.json(populatedAd);
    } catch (error) {
        next(error);
    }
};

// KORISNIK/ADMIN: DELETE /api/ads/:id
exports.deleteAd = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            res.status(404);
            throw new Error('Ad not found');
        }
        // Provera da li je korisnik vlasnik oglasa ili admin
        if (ad.korisnik.toString() !== req.user._id.toString() && req.user.role !== 'ROLE_ADMIN') {
            res.status(403);
            throw new Error('User not authorized to delete this ad');
        }
        
        await ad.deleteOne(); // Koristimo deleteOne umesto remove da izbegnemo hook ako nije potreban
        res.status(204).send(); // No Content

    } catch (error) {
        next(error);
    }
};