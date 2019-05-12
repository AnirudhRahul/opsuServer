var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {type: String, index: true, unique: true, required: true},
  password: String,
  displayName: {type: String, index: true, unique: true, required: true}
});

module.exports = mongoose.model('User', schema);
