const mongoose = require('mongoose');
User = require('../models/User.js')


exports.get_all_users = function(req, res) {
	if (req.body.admin !== process.env.ADMIN_KEY)
		return;
	var cursor = User.find().cursor();
	//pipes output through res
	cursor.pipe(JSONStream.stringify())
		.pipe(res.type('json'));
}

exports.get_all_field = function(req, res) {
	if (req.body.admin !== process.env.ADMIN_KEY)
		return;
	var cursor = User.find().cursor();
	//pipes output through res
	cursor.pipe(JSONStream.stringify())
		.pipe(res.type('json'));
}