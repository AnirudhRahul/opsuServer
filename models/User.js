var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {type: String, index: true, unique: true, required: true},
  password: {type: String, required: true},
  displayName: {type: String, index: true, unique: true, required: true}
});

//Registers the model with mongoose and exports it
module.exports = mongoose.model('User', schema);
