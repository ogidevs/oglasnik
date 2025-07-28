const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('password', 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
], registerUser);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], loginUser);

module.exports = router;