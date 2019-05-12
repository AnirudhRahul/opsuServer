var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String, index: true, unique: true, required: true},
  password: String,
  displayName: {type: String, index: true, unique: true, required: true}
});

//TODO make proper beatmap Schema
// const beatmapSchema = new Schema({
//   displayName: String,
//   score: String,
//   email: String
// });

module.exports = mongoose.model('User', userSchema);
// module.exports = mongoose.model('Beatmap', beatmapSchema);
