var mongoose = require('mongoose');

const schema = new Schema({
  displayName: String,
  score: String,
  email: String
});

module.exports = mongoose.model('Beatmap', schema);
