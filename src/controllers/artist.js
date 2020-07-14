const { Artist } = require('../models');

exports.create = (req, res) => {
    Artist.create(req.body).then(user => res.status(201).json(user));
};

exports.list = (_, res) => {
    Artist.findAll().then(artists => {res.status(200).json(artists);
    });
  };
