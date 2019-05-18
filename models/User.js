var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {type: String, index: true, unique: true, required: true},
  password: {type: String, required: true},
  displayName: {type: String, index: true, unique: true, required: true},
  accuracy: {type: String, default:0},
  score: {type: Number, default:0},
  playsTotal: {type: Number, default:0},
  icons: {type: Array},
});

//Registers the model with mongoose and exports it
module.exports = mongoose.model('User', schema);
