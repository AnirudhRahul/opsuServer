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
  newUser.save({}, function(err, user) {
    if (err)
      res.send(err);
    else
      res.json(user);
  });
};

exports.get_user = function(req, res) {

  User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
    if(err)
      res.send(error)
    else
      res.json(user);
  });

};
