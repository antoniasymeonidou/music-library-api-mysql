/* src/controllers/songs.js */
const { Artist } = require('../sequelize');
const { Album } = require('../sequelize');
const { Song } = require('../sequelize');

exports.createsSong = (req, res) => {
  const { albumId } = req.params;

  Album.findByPk(albumId).then((album) => {
    if (!album) {
      return res.status(404).json({ error: 'The album could not be found.' });
    } else {
      const songData = {
        name: req.body.name,
        albumId: album.id,
        artistId: album.artistId,
      };
      Song.create(songData).then(song => {
        return res.status(201).json(song);
      })
    }
  });
 
};

exports.listSongsByAlbum = (req,res) => {
  const { albumId } = req.params;
  Album.findByPk(albumId).then(album => {
    if(!album) {
      return res.status(404).json({ error: 'The album could not be found.' });
    }else{
      Song.findAll({ where: {albumId} })
      .then(songs => {return res.status(200).json(songs)});
    };
  })
};

exports.listSongsByArtist = (req, res) => {
  const { artistId } = req.params;
  Artist.findByPk(artistId).then(artist => {
    if(!artist) {
      return res.status(404).json({ error: 'The artist could not be found.' });
    }else{
      Song.findAll({ where: {artistId} })
      .then(songs => {return res.status(200).json(songs)});
    };
  })
}

exports.updatesSongByAlbum = (req,res) => {
  const { albumId } = req.params;
  Album.findByPk(albumId).then(album => {
    if(!album) {
      return res.status(404).json({ error: 'The album could not be found.' });
    }else{
      Song.update(req.body, { where: {albumId} })
      .then(updatedSong => {return res.status(200).json(updatedSong)});
    };
  })
};

exports.updatesSongById = (req, res) => {
  const { songId } = req.params;
  Song.findByPk(songId).then(song => {
    if(!song) {
      return res.status(404).json({ error: 'The song could not be found.' });
    }else{
      Song.update(req.body, { where: {id: songId} })
      .then(updatedSong => {return res.status(200).json(updatedSong)});
    };
  })
}

exports.deletesSongById = (req, res) => {
  const { songId } = req.params;
  Song.findByPk(songId).then(song => {
    if(!song) {
      return res.status(404).json({ error: 'The song could not be found.' });
    }else{
      Song.destroy({ where: {id: songId} })
      .then(updatedSong => {return res.status(204).json(updatedSong)});
    };
  })
};

exports.deletesSongByAlbum = (req, res) => {
  const { albumId } = req.params;
  Album.findByPk(albumId).then(album => {
    if(!album) {
      return res.status(404).json({ error: 'The album could not be found.' });
    }else{
      Song.destroy({ where: {albumId} })
      .then(updatedSong => {return res.status(204).json(updatedSong)});
    };
  })
};