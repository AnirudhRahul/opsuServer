var mongoose = require('mongoose'),
User = mongoose.model('User');

//TODO implement api responeses
exports.add_user = function(req, res) {
  const { displayName, email, password} = req.body
  var newUser = new User({
      displayName=req.body.displayName,
      email=req.body.email,
      password=req.body.password
  });
  newUser.save({}, function(err, task) {
    if (err)
      res.send(err);
    else
      res.json(task);
  });
};

exports.get_user = function(req, res) {
  var userToFind = new User({
      email=req.query.email,
      password=req.query.password
  });

  User.find({}, function(error, documents){

  });

  newUser.save({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
