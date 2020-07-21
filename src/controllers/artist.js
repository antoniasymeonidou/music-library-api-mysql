const { Artist } = require('../models');

exports.create = (req, res) => {
    Artist.create(req.body).then(user => res.status(201).json(user));
};

exports.list = (_, res) => {
    Artist.findAll().then(artists => {res.status(200).json(artists);
    });
  };

  exports.getArtistById = (req, res) => {
    const { id } = req.params;
    Artist.findByPk(id).then(artist => {
      if (!artist) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else {
        res.status(200).json(artist);
      }
    });
  };

  exports.updateArtist = (req, res) => {
    const { id } = req.params;
    Artist.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
      if (!rowsUpdated) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else {
        res.status(200).json("Successful Updates:" + "_" + rowsUpdated);
      }
    });
  };

  exports.deleteArtist = (req, res) => {
    const { id } = req.params;
    Artist.destroy(req.body, { where: { id } }).then(([deleterow]) => {
      if (!deleterow) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else {
        res.status(204).json("Successful Request" + "_" + deleterow);
      }
    });
  };