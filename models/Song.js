const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    textToSend: {
        type: String,
        required: true
    },
    bandID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('song', SongSchema);
