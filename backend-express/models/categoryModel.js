const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    naziv: { type: String, required: true, unique: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Ovo ne postoji u bazi, ali Mongoose ga kreira "u letu"
categorySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;