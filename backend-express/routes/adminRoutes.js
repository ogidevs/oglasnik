const express = require('express');
const { getUsers, deleteUser, updateUser, createCategory, deleteCategory, getLogs } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Sve rute ovde su zaštićene i zahtevaju ADMIN rolu
router.use(protect, admin);

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser).put(updateUser);

router.route('/categories').post(createCategory);
router.route('/categories/:id').delete(deleteCategory);

router.route('/logs').get(getLogs);

module.exports = router;