var mongoose = require('mongoose'),
User = mongoose.model('User');

//TODO implement api responeses
exports.add_user = function(req, res) {
  res.send("add_user route is working");
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
  res.send("get_user route is working");
  User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
    if(err)
      res.send(error);
    else
      res.json(user);
  });

};
