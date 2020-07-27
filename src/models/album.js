 
/* src/models/album.js */

module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    year: DataTypes.INTEGER,
  };

  const Album = sequelize.define('Album', schema);
  return Album;
};