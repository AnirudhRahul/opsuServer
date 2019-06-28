const mongoose = require('mongoose');
User = require('../models/User.js')


exports.get_all_users = function(req, res) {
	if (req.body.admin !== process.env.ADMIN_KEY)
		return;
	var stream = User.find().cursor();
	stream.pipe(res);
	stream.on('end', function() {
		res.end();
	});

}

exports.get_all_field = function(req, res) {
	if (req.body.admin !== process.env.ADMIN_KEY)
		return;
	var stream = User.find().cursor();
	stream.pipe(res);
	stream.on('end', function() {
		res.end();
	});

}