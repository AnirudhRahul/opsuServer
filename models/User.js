var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {type: String, index: true, unique: true},
  password: String,
  displayName: {type: String, index: true, unique: true}
});

//Sets every attribute as reqiored
_.each(_.keys(schema), function (attr) { schema[attr].required = true; });
//Registers the model with mongoose and exports it
module.exports = mongoose.model('User', schema);
