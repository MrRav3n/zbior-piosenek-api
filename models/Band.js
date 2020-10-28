const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    songs: {
        type: Array,
        required: true,
    }
})

const BandSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        unique: true,
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    playlist: [PlaylistSchema]
})
BandSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 5);
    next();
})
module.exports = mongoose.model('band', BandSchema);
