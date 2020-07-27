/* src/routes/artist.js */

const express = require('express');

const artistController = require('../controllers/artist');
const albumController = require('../controllers/album');
const songController = require('../controllers/song');

const router = express.Router();


router.post('/', artistController.createsArtist); // create artist by requesting name and genre 
router.get('/',  artistController.listArtists); // get the list of all artists
router.get('/:artistId', artistController.getArtistById); // find a specific id
router.patch('/:artistId', artistController.updatesArtistById); // update information about artist by requesting name and genre
router.delete('/:artistId', artistController.deletesArtist); // delete an artist

router.post('/:artistId/album', albumController.createAlbum); // create album by requeasting name and year
router.get('/:artistId/album', albumController.listAllAlbumsByArtist); // get the list of all albums

router.get('/:artistId/song', songController.listSongsByArtist);

module.exports = router;