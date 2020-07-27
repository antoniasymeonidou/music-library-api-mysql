const Sequelize = require('sequelize');
const ArtistModel = require('./artist');
const AlbumModel = require('./album');
const SongModel = require('./song');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  const Artist = ArtistModel(connection, Sequelize);
  const Album = AlbumModel(connection, Sequelize);

  Album.belongsTo(Artist, { as: 'artist' });

  connection.sync({ alter: true });
  return {
    Artist,
    Album
  };
};

module.exports = setupDatabase();
