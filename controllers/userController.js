var mongoose = require('mongoose');
User = require('../models/User.js')


//TODO implement api responeses

//GET methods
exports.get_user = function(req, res) {
  User.findOne({
    displayName: req.query.displayName,
    password: req.query.password
  }, function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('Username or password incorrect');

    console.log("End reached");
  });

};

exports.get_friendRequests = function(req, res) {
  User.findOne({
    displayName: req.query.displayName
  }, 'friend_requests', function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('User not found');
  });

};

exports.get_friends = function(req, res) {

  User.findOne({
    displayName: req.query.displayName
  }, 'friends', function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('User not found');
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
      else if (doc)
        res.send("Friend Request sent");
      else
        res.status(404).send("Friend name doesn't exist");

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

    });
}

function friendLimitReached(self, errored, callback) {
  if (errored) {
    callback();
    return;
  }
  //Add eachother to friends lists
  User.findOne({
    displayName: self
  }, function(err, user) {
    if (err)
      errored = err;
    else if (!user)
      errored = 'User not found';
    else if (user.friends.length < user.maxFriend)
      errored = user.displayName + ' Friend limit reached';

    callback();
  });
}

function deleteFriendRequest(self, friendName) {}
User.findOneAndUpdate({
    displayName: self
  }, {
    $pull: {
      friend_requests: friendName
    }
  },
  function(err, doc) {});
}


exports.delete_request = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;
  const accept = req.query.accept == 'true';
  var worked = true;
  if (accept) {
    var errored;
    friendLimitReached(self, errored, friendLimitReached(friendName, errored, function() {
      if (errored) {
        res.status(400).send(errored);
      } else {
        addFriend(self, friendName);
        addFriend(friendName, self);
        deleteFriendRequest(self, friendName);
        res.status(200).send("Friend request accepted")
      }
    }));

  } else {

    if (deleteFriendRequest(self, friendName))
      res.send("An error occurred deleting your friend request");
    else
      res.send("Friend Request deleted");
  }

  //Todo add possibility for friendship badge here
};


exports.add_user = function(req, res) {

  var newUser = new User({
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save({}, function(err, user) {
    if (err)
      res.status(400).send(err);
    else
      res.send(user);
  });

};
