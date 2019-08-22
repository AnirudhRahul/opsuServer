var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://localhost:27017/opsu_Users", {
	useNewUrlParser: true
});

//Add session keys for better security and synchronisation

const schema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	displayName: {type: String, index: true, unique: true, required: true},
	score: {type: Number, default: 0},
	playsTotal: {type: Number, default: 0},
	icons: {type: [Number]},
	friends: {type: [String]},
	friend_requests: {type: [String]},
	maxFriend: {type: Number, default: 5},
	badges: {type: Map, of: Number},
	supporter: {type: Boolean, default: false},
	consecutive: {type: Number, default: 0},
	lastLogin: {type: Number, default: 0},
	coins: {type: Number, default: 0},
	resetKey: {type: String}

});

//Registers the model with mongoose and exports it
module.exports = conn.model("User", schema);
