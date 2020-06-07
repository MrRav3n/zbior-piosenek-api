const express = require('express')
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bandRouting = require('./api-routes/bandRouting')
mongoose.set('useCreateIndex', true);

app.use(cors());

mongoose.connect('mongodb+srv://MrRav3n:DAW100kr@cluster0-6xfty.mongodb.net/band?retryWrites=true&w=majority', { useNewUrlParser: true ,  useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(process.env.PORT || 8081, () => {
    console.log(`Server works on port ${process.env.PORT || 8081}`);
})

app.get('/', (req, res) => {
    res.send('Api working');
})

app.use('/api/band', bandRouting); // user routing

module.exports = app;
