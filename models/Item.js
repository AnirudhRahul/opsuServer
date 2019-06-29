var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://localhost:27017/opsu_Items", {
	useNewUrlParser: true
});

const schema = new mongoose.Schema({
	name: {type: String, unique: true, required: true},
	cost: {type: Number}
});

//Registers the model with mongoose and exports it
module.exports = conn.model("Item", schema);
