var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {type: String, index: true, unique: true, required: true},
  password: {type: String, required: true},
  displayName: {type: String, index: true, unique: true, required: true},
  accuracy: {type: Decimal128, default:0},
  score: {type: Number, default:0},
  playsTotal: {type: Number, default:0},
  icons: {type: [Number]},
  friends: {type: [String]},
  pending_friends: {type: [String]},
  badges: {type: Map, of: Number},
  supporter: {type: Boolean, default: false},
  consecutive: {type: Number},
  lastLogin: {type: Number}
});

//Registers the model with mongoose and exports it
module.exports = mongoose.model('User', schema);
