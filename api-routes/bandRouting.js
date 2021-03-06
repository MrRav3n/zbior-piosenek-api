const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const Band = require('../models/Band')
const Song = require('../models/Song')
const bcrypt = require('bcrypt');

router.use(bodyParser.json());

router.post('/register', (req, res) => {
    console.log(123);
    const bodyToSend = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    }
    Band.create(bodyToSend, (err, band) => {
        if (band) {
            band.password = undefined;
            res.send({band});
        } else {
            res.status(400);
            res.send({error: 'Taki email już istnieje.'})
        }
    })
})

router.post('/login', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    Band.findOne({name}, (err, band) => {
        if (band) {
                bcrypt.compare(password, band.password, (err, pass) => {
                    if(pass) {
                        Song.find({bandID: band._id}, (err, songs) => {
                            if (songs) {
                                band.password = undefined;
                                res.send({band, songs});
                            }
                        })
                    } else {
                        res.status(400);
                        res.send({error: 'Błędne hasło'})
                    }
                });
        } else {
            res.status(400);
            res.send({error: 'Nie ma takiego zespołu!'})
        }
    })
});

router.post('/add/playlist', (req, res) => {
    const BodyToSend = {
        name: req.body.playlistName,
    }
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

router.post('/delete/song', (req, res) => {
    const songID = {_id: req.body.songID}
    Song.deleteOne(songID, (err, song) => {
        if (song) {
            res.send({message: 'Udalo się!'});
        } else {
            res.status(400);
            res.send({error: 'Błąd przy usuwaniu piosenki!'});
        }
    })

})

router.post('/delete/playlist', (req, res) => {
    const playlistID = req.body.playlistID;
    const bandID = req.body.bandID
    Band.findOne({_id: bandID}, (err, band) => {
        if (band) {
            const index = band.playlist.findIndex(obj => obj._id == playlistID);

            band.playlist.splice(index, 1);
            Band.update({_id: bandID}, band, (err, band2) => {
                if (band2.n) {
                    res.send({message: 'Udało się! Usunięto playlistę.'})
                } else {
                    res.status(404);
                    res.send({error: 403})
                }
            })
        } else {
            res.status(404);
            res.send({error: 'Nie ma takiego zespołu'});
        }
    })
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
        if (song) {
            res.send({message: 'udalo sie'});
        } else {
            res.status(400);
            res.send({error: 'Nie udało się dodać nowej piosenki!'});
        }
    })
})

module.exports = router;
