const User = require('../models/userModel');
const Ad = require('../models/adModel');
const Category = require('../models/categoryModel');
const Log = require('../models/logModel');

// --- Upravljanje korisnicima ---
// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.size) || 10;
        const page = parseInt(req.query.page) || 0;
        
        const count = await User.countDocuments();
        const users = await User.find({})
            .select('-password')
            .limit(pageSize)
            .skip(pageSize * page);

        res.json({
            content: users,
            totalPages: Math.ceil(count / pageSize),
            totalElements: count,
            number: page
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.status(204).send();
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json({
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// --- Upravljanje kategorijama ---
// POST /api/admin/categories
exports.createCategory = async (req, res, next) => {
    try {
        const category = new Category({ naziv: req.body.naziv });
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/categories/:id
exports.deleteCategory = async (req, res, next) => {
    try {
        const adExists = await Ad.findOne({ kategorija: req.params.id });
        if (adExists) {
            res.status(400);
            throw new Error('Nije moguće obrisati kategoriju jer postoje oglasi koji je koriste.');
        }

        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.status(204).send();
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};

// --- Upravljanje logovima ---
// GET /api/admin/logs
exports.getLogs = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.size) || 10;
        const page = parseInt(req.query.page) || 0;
        const username = req.query.username;

        let query = {};
        if (username) {
            query.username = { $regex: username, $options: 'i' };
        }
        
        const count = await Log.countDocuments(query);
        const logs = await Log.find(query)
            .sort({ timestamp: -1 })
            .limit(pageSize)
            .skip(pageSize * page);

        res.json({
            content: logs,
            totalPages: Math.ceil(count / pageSize),
            totalElements: count,
            number: page
        });
    } catch (error) {
        next(error);
    }
};