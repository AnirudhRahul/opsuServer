var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  displayName: String
});

const beatmapSchema = new Schema({
  displayName: String,
  score: String,
  ...
  email: String
});

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Beatmap', beatmapSchema);
