var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {type: String, index: true, unique: true, required: true},
  password: {type: String, required: true},
  displayName: {type: String, index: true, unique: true, required: true},
  score: {type: Number, default:0},
  playsTotal: {type: Number, default:0},
  icons: {type: [Number]},
  friends: {type: [String]},
  friend_requests: {type: [String]},
  maxFriend: {type:Number, default:5},
  badges: {type: Map, of: Number},
  supporter: {type: Boolean, default: false},
  consecutive: {type: Number},
  lastLogin: {type: Number}
});
schema.pre('validate', function(next) {
    if (this.friends.length > this.maxFriend) {
        next(new Error('Friend limit exceeded'));
    } else {
        next();
    }
});

//Registers the model with mongoose and exports it
module.exports = mongoose.model('User', schema);
