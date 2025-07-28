const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Funkcija za generisanje tokena
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// POST /api/auth/register
exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Ako postoje greške, vrati 400 i listu grešaka
            return res.status(400).json({ errors: errors.array() });
        }

        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'ROLE_USER' // Default rola
        });

        if (user) {
            res.status(201).json({ message: 'Korisnik uspešno registrovan!' });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
exports.loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        next(error);
    }
};