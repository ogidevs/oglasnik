const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    naslov: { type: String, required: true },
    opis: { type: String, required: true },
    cena: { type: Number, required: true },
    korisnik: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kategorija: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    slikeUrl: [{ type: String }],
    datumKreiranja: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

adSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Nećemo brisati _id iz oglasa, jer ga frontend možda ne koristi direktno,
// ali nam je koristan za debug. Ažuriraćemo ga samo tamo gde je striktno neophodno.
adSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // Ovde moramo da transformišemo i podatke iz `populate`
        if (ret.korisnik) {
            ret.korisnikUsername = ret.korisnik.username;
            delete ret.korisnik;
        }
        if (ret.kategorija) {
            ret.kategorijaNaziv = ret.kategorija.naziv;
            delete ret.kategorija;
        }
        delete ret._id;
    }
});


const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;