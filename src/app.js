const express = require('express');
const artistControllers = require('./controllers/artist');
const albumControllers = require('./controllers/album');

const app = express();

app.use(express.json());

// endpoints for artist
app.post('/artist', artistControllers.create); // creates an artist
app.get('/artist', artistControllers.list); // shows all the artists
app.get('/artist/:artistid', artistControllers.getArtistById); // find an artist by id
app.patch('/artist/:artistid', artistControllers.updateArtist); // updating the information of the artist
app.delete('/artist/:artistid', artistControllers.deleteArtist); // deleting an artist 

// endpoints for album
app.post('/artist/:artistId/album', albumControllers.create);
app.get('/artist/:artistId/album', albumControllers.list);
app.get('/artist/:artistId/album/:albumId', albumControllers.getAlbumById);
app.patch('/artist/:artistId/album/:albumId', albumControllers.updateAlbum);
app.delete('/artist/:artistId/album/:albumId', albumControllers.deleteAlbum);

module.exports = app; //  which bits of code to “export” from a given file so other files are allowed to access the exported code
