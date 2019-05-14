var mongoose = require('mongoose'),
User = mongoose.model('User');

//TODO implement api responeses

exports.get_user = function(req, res) {
  console.log("get_user route is working");
  User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
    console.log("Finding new user");
    if(err)
      res.send(err);
    else
      res.json(user);
  });

};

exports.add_user = function(req, res) {
  console.log("add_user route is working");
  var newUser = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
  });
  newUser.save({}, function(err, user) {
    console.log("Saving new user");
    if (err)
      res.send(err);
    else
      res.json(user);
  });
};
