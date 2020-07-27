/* src/models/artist.js */

module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
  };

  const Artist = sequelize.define('Artist', schema);
  return Artist;
};