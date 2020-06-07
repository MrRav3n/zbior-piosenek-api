const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    name: {
        type: String,
        required: true,
    },
    playlist: [PlaylistSchema]
})

module.exports = mongoose.model('band', BandSchema);
