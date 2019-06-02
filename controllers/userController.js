var mongoose = require('mongoose'),
  User = mongoose.model('User');

//TODO implement api responeses

//GET methods
exports.get_user = function(req, res) {
  console.log("called")
  res.send("Get User route working");
  // User.findOne({
  //   email: req.query.email,
  //   password: req.query.password
  // }, function(err, user) {
  //   if (err)
  //     res.status(400).send(err);
  //   else
  //     res.send(user);
  // });

};

exports.get_friendRequests = function(req, res) {
  User.findOne({
    displayName: req.query.displayName
  }, 'friend_requests', function(err, user) {
    if (err)
      res.status(400).send(err);
    else
      res.send(user);
  });

};

exports.get_friends = function(req, res) {

  User.findOne({
    displayName: req.query.displayName
  }, 'friends', function(err, user) {
    if (err)
      res.status(400).send(err);
    else
      res.send(user);
  });

};

exports.create_request = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;

  User.findOneAndUpdate({
      displayName: friendName
    }, {
      $addToSet: {
        friend_requests: self
      }
    },
    function(err, doc) {
      if (err)
        res.status(400).send(err);
      else if (doc == null)
        res.status(403).send("Friend name doesn't exist");
      else
        res.send("Friend Request sent");
    });

};

function addFriend(self, friend) {
  //Add eachother to friends lists
  User.findOneAndUpdate({
      displayName: self
    }, {
      $addToSet: {
        friends: friend
      }
    },
    function(err, doc) {
        if(err){
          res.write(err);
          worked=false;
        }
    });
}

function friendLimitReached(self, callback) {
  //Add eachother to friends lists
  User.findOne({
    displayName: self
  },function(err, user) {
    if (err){
      res.write(err);
      worked=false;
    }
    else if(user.friends.length<user.maxFriend)
      callback();
  });
}


exports.delete_request = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;
  const accept = req.query.accept == 'true';
  var worked = true;
  if (accept) {
    friendLimitReached(self, friendLimitReached(friendName,function() {
         addFriend(self,friendName);
         addFriend(friendName,self);
    }));
    if(!worked){
      res.status(400).end();
      return;
    }
  }

  //Delete friend request
  User.findOneAndUpdate({
      displayName: self
    }, {
      $pull: {
        friend_requests: friendName
      }
    },
    function(err, doc) {
    });

  //Send response
  if (accept)
    res.send("Friend Request accepted");
  else
    res.send("Friend Request deleted");

  //Todo add possibility for friendship badge here
};


exports.add_user = function(req, res) {
  res.send("Add user route is working");

  var newUser = new User({
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function(err, user) {
    if (err)
      res.status(400).send(err);
    else
      res.send(user);
  });
};
