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
return new Promise(function(resolve, reject) {
    User.findOneAndUpdate({
        displayName: self
      }, {
        $addToSet: {
          friends: friend
        }
      },
      function(err, doc) {
        if (err)
          reject(err);
        else {
          resolve();
        }
      });
  }
}

function friendLimitReached(self) {
  return new Promise(function(resolve, reject) {

    User.findOne({
      displayName: self
    }, function(err, user) {
      if (err)
        reject(err);
      else if (!user)
        reject(new Error('User ' + self + ' not found'));
      else if (user.friends.length >= user.maxFriend)
        reject(new Error(self + ' Friend limit reached'))
      else
        resolve();
    });

  })

}

function deleteFriendRequest(self, friendName) {
  return new Promise(function(resolve, reject) {
      User.findOneAndUpdate({
          displayName: self
        }, {
          $pull: {
            friend_requests: friendName
          }
        },
        function(err, doc) {
          if (err)
            reject(err);
          else
            resolve();

        });
    }
  }


  exports.delete_request = function(req, res) {
    const friendName = req.query.friendName;
    const self = req.query.displayName;
    const accept = req.query.accept == 'true';
    var worked = true;
    if (accept) {
      Promise.all([friendLimitReached(self), friendLimitReached(friendName)])
        .then(Promise.all([addFriend(self, friendName), addFriend(friendName, self)]))
        .then(deleteFriendRequest(self, friendName)).then(
          function() {
            res.send("Friend Request accepted");
          },
          function(err) {
            res.status(400).send(err);
          }
        );

    } else {
      deleteFriendRequest(self, friendName).then(
        function() {
          res.send("Friend Request deleted");
        },
        function(err) {
          res.status(400).send(err);
        }
      );
    }

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
