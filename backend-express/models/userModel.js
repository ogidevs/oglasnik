const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['ROLE_USER', 'ROLE_ADMIN'],
        default: 'ROLE_USER'
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;