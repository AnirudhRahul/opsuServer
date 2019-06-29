var mongoose = require("mongoose"),
	Beatmap = require("../models/Beatmap.js");

//TODO implement api responeses

exports.get_leaderboard = function(req, res) {
	if (req.query.type == "top") {
		start = 0;
		if (req.query.start) start = req.query.start;
		Beatmap.findOneAndUpdate(
			{
				beatmapID: req.query.email
			},
			{
				skip: start, // Starting Row
				limit: 100, // Ending Row
				sort: {
					score: -1 //Sort by Score descending
				}
			},
			function(err, user) {
				if (err) res.status(400).send(err);
				else if (user) res.send(user);
				else res.status(404).send("User not found");
			}
		);
	} else if (req.query.type == "my") {
	}
};

exports.add_to_leaderboard = function(req, res) {
	var newScore = new Beatmap({
		username: req.body.username,
		beatmapID: req.body.beatmapID,
		setID: req.body.setID,
		title: req.body.title,
		creator: req.body.creator,
		artist: req.body.artist,
		version: req.body.version,
		hit300: req.body.hit300,
		hit100: req.body.hit100,
		hit50: req.body.hit50,
		geki: req.body.geki,
		katu: req.body.katu,
		miss: req.body.miss,
		score: req.body.score,
		combo: req.body.combo,
		perfect: req.body.perfect,
		mods: req.body.mods,
		time: req.body.time
	});

	newScore.save({}, function(err, beatmap) {
		if (err) res.status(400).send(err);
		else res.send(beatmap);
	});
};
