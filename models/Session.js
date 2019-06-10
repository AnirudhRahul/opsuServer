var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/opsu_Sessions', {useNewUrlParser: true});

const schema = new mongoose.Schema({
  displayName: {type: String, index: true, unique: true, required: true},
  sessionID: {type: String, index: true, unique: true, required: true},
  expiration: {type: String, required: true},
});

//Registers the model with mongoose and exports it
module.exports = conn.model('Session', schema);
