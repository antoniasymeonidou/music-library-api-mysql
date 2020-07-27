/* src/routes/album.js */

const express = require('express');

const albumController = require('../controllers/album');
const songController = require('../controllers/song');

const router = express.Router();


router.patch('/:albumId', albumController.updatesAlbumByID);
router.delete('/:albumId', albumController.deletesAlbumById);


router.post('/:albumId/song', songController.createsSong);
router.get('/:albumId/song', songController.listSongsByAlbum);
router.patch('/:albumId/song', songController.updatesSongByAlbum);
router.delete('/:albumId/song', songController.deletesSongByAlbum);

module.exports = router;

