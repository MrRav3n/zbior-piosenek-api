const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const Band = require('../models/Band')
const Song = require('../models/Song')
router.use(bodyParser.json());

router.get('/allBand', (req, res) => {
    const name = req.query.bandName;
    Band.findOne({name}, (err, band) => {
        if (band) {
            Song.find({bandID: band._id}, (err, songs) => {
                if (songs) {
                    res.send({band, songs});
                }
            })

        } else {
            res.status(400);
            res.send({error: 'Nie ma takiego zespołu!'})
        }
    })
})

router.post('/add/playlist', (req, res) => {
    const BodyToSend = {
        name: req.body.playlistName,
    }
    console.log(req.body.bandID)
    console.log(req.body.playlistName)
    Band.update(
        { _id: req.body.bandID },
        { $push: { "playlist" : BodyToSend } }, (err, response) => {
            console.log(err);
            if (response.n) {
                res.send({message: 'Udało się! Dodano nową playlistę'})
            } else {
                res.status(404);
                res.send({error: 'Błąd przy dodawaniu playlisty!'});
            }
        });

})
router.post('/add/songToPlaylist', (req, res) => {
    const songID = req.body.songID
    Band.update(
        { _id: req.body.bandID, "playlist._id": req.body.playlistID },
        { $push: { "playlist.$.songs" : songID } }, (err, response) => {
            if (response.n) {
                res.send({message: 'Udało się! Dodano nową piosenkę!'})
            } else {
                res.status(404);
                res.send({error: 'Błąd przy dodawaniu nowej piosenki'});
            }
        });

})
router.post('/add/song', (req, res) => {
    const bodyToAdd = {
        name: req.body.songName,
        bandID: req.body.bandID,
        textToSend: req.body.textToSend,
    }
    Song.create(bodyToAdd, (err, song) => {
        console.log(err);
        if (song) {
            res.send({message: 'udalo sie'});
        } else {
            res.status(400);
            res.send({error: 'Nie udało się dodać nowej piosenki!'});
        }
    })
})

module.exports = router;
