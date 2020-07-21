const express = require('express');

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');
const artistControllers = require('./controllers/artist');

const app = express();

app.use(express.json());
app.post('/artist', artistControllers.create);
app.get('/artist', artistControllers.list);
app.get('/artist/:id', artistControllers.getArtistById);
app.patch('/artist/:id', artistControllers.updateArtist);
app.delete('/artist/:id', artistControllers.deleteArtist);

module.exports = app;
