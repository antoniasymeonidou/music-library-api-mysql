/* src/routes/song.js */

const express = require('express');

const songController = require('../controllers/song')

const router = express.Router();

router.patch('/:songId', songController.updatesSongById)
router.delete('/:songId', songController.deletesSongById)

module.exports = router;