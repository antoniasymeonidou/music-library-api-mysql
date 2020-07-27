/* src/models/song.js */

module.exports = (sequelize, DataTypes) => {
    const schema = {
      name: DataTypes.STRING,
    };
  
    const Song = sequelize.define('Song', schema);
    return Song;
  };