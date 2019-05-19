var mongoose = require('mongoose'),
User = mongoose.model('User');

//TODO implement api responeses

exports.get_user = function(req, res) {
  console.log("get_user route is working");
  User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
    console.log("Finding new user");
    if(err)
      res.status(400).send(err);
    else
      res.json(user);

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
exports.friendRequest = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;
  User.findOne({ displayName: self}, function (err, friend) {
    if(err){
      res.status(400).send(err);
    }
    else{
      if(friend.friends.contains(self))
        res.status(403).send("Already your friend");
      else if(friend.friend_requests.contains(self))
        res.status(403).send("Already sent friend request");
      else{
        friend.friend_requests.push(self);
        // User.findOneAndUpdate(friend._id, {"$push": { "friend_requests": self } })
        res.send("Friend Request Sent")
      }
    }
  });

};

exports.acceptRequest = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;
  
  User.findOne({ displayName: self}, function (err, user) {
    if(err){
      res.status(400).send(err);
    }
    else{
      if(user.friends.contains(friendName))
        res.status(403).send("Already your friend");
      else if(!user.friend_requests.contains(friendName))
        res.status(403).send("Invalid friend request");
      else{
        user.friend_requests.splice(user.friend_requests.indexOf(friendName), 1);
        user.friends.push(friendName);
        User.findOneAndUpdate({displayName: friendName}, {"$push": { "friends": self } });
        res.send("Friend Request Accepted");
      }

    }
  });

};


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
