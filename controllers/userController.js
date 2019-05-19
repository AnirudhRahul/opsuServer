var mongoose = require('mongoose'),
User = mongoose.model('User');

//TODO implement api responeses

exports.get_user = function(req, res) {
  console.log("get_user route is working");
  User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
    console.log("Finding new user");
    if(err)
      res.send(err);
    else{
      user.password=null;
      res.json(user.username);
    }
  });

};

// exports.dailyCheck = function(req, res) {
//   console.log("get_user route is working");
//   User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
//     console.log("Finding new user");
//     if(err)
//       res.send(err);
//     else{
//       user.password=null;
//       res.json(user);
//     }
//   });
//
// };
//
// exports.addFriend = function(req, res) {
//   console.log("get_user route is working");
//   User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
//     console.log("Finding new user");
//     if(err)
//       res.send(err);
//     else{
//       user.password=null;
//       res.json(user);
//     }
//   });
//
// };


exports.add_user = function(req, res) {
  if(!(req.body.displayName&&req.body.email&&req.body.password)){
    res.status(406).send("Missing input fields");
    return;
  }

  var newUser = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
  });

  newUser.save({}, function(err, user) {
    if(err){
      if(err.code==11000)
        res.status(409);
      res.send(err);
    }
    else
      res.send(user);
  });
};
