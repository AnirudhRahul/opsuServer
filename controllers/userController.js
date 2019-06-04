var mongoose = require('mongoose');
User = require('../models/User.js')


//TODO implement api responeses

//GET methods
exports.get_user = function(req, res) {
  User.findOne({
    email: req.query.email,
    password: req.query.password
  }, function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('User not found');


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
      if (err) {
        res.write(err);
        worked = false;
      }
    });
}

function friendLimitReached(self, callback) {
  //Add eachother to friends lists
  User.findOne({
    displayName: self
  }, function(err, user) {
    if (err) {
      res.write(err);
      worked = false;
    } else if (user.friends.length < user.maxFriend)
      callback();
  });
}


exports.delete_request = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;
  const accept = req.query.accept == 'true';
  var worked = true;
  if (accept) {
    friendLimitReached(self, friendLimitReached(friendName, function() {
      addFriend(self, friendName);
      addFriend(friendName, self);
      if (!worked) {
        res.status(400).end();
        return;
      }
    }));

  }

  //Delete friend request
  User.findOneAndUpdate({
      displayName: self
    }, {
      $pull: {
        friend_requests: friendName
      }
    },
    function(err, doc) {});

  //Send response
  if (accept)
    res.send("Friend Request accepted");
  else
    res.send("Friend Request deleted");

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
