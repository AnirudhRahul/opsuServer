const mongoose = require('mongoose');
const fs = require('fs');
const random = require("randomstring");
User = require('../models/User.js')

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

//TODO implement api responeses

//GET methods
/*
Desired behavior:
Gets the most up to date info
on a user

Purpose:
Help sync user information across devices
*/
exports.get_user = function(req, res) {
  User.findOne({
    displayName: req.body.displayName,
    password: req.body.password
  }, function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('Username or password incorrect');

    console.log("End reached");
  });

}

/*
Desired behavior:
Returns a list of the user's
current friend requests

Purpose:
Allow for easy access to the list of
the users friend_requests since this field
gets updated regularly
*/
exports.get_friendRequests = function(req, res) {
  User.findOne({
    displayName: req.body.displayName
  }, 'friend_requests', function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('User not found');
  });

}

/*
Desired behavior:
Returns a list of the user's friends

Purpose:
Allow for easy access to the list of
the users friends since this field
gets updated regularly
*/
exports.get_friends = function(req, res) {

  User.findOne({
    displayName: req.body.displayName
  }, 'friends', function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (user)
      res.send(user);
    else
      res.status(404).send('User not found');
  });

}

/*
Desired behavior:
Allow a user to send a friend
request to other users

Purpose:
Let users make friends
*/
exports.create_request = function(req, res) {
  const friendName = req.body.friendName;
  const self = req.body.displayName;

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

}

var addFriend = function(self, friend) {
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
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      })
  });
}

function friendLimitReached(self) {
  return new Promise(function(resolve, reject) {

    User.findOne({
      displayName: self
    }, function(err, user) {
      if (err) {
        console.log(err);
        reject(err);
      } else if (!user)
        reject(new Error('User ' + self + ' not found'));
      else if (user.friends.length >= user.maxFriend)
        reject(new Error(self + ' Friend limit reached'))
      else
        resolve(true);
    })
  });

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
        if (err) {
          console.log(err);
          reject(err);
        } else
          resolve(true);

      })
  });
}

function deleteFriend(self, friendName) {
  return new Promise(function(resolve, reject) {
    User.findOneAndUpdate({
        displayName: self
      }, {
        $pull: {
          friends: friendName
        }
      },
      function(err, doc) {
        if (err) {
          console.log(err);
          reject(err);
        } else
          resolve(true);

      })
  });
}

/*
Desired behavior:
Allow a user to delete or accept
a friend request they have recieved

Purpose:
Let user get rid of unwanted request
or accept wanted requests
*/
exports.delete_request = function(req, res) {
  const friendName = req.body.friendName;
  const self = req.body.displayName;
  const accept = req.body.accept == 'true';
  if (accept) {
    Promise.all([friendLimitReached(self), friendLimitReached(friendName)])
      .then(Promise.all([addFriend(self, friendName), addFriend(friendName, self)]))
      .then(deleteFriendRequest(self, friendName)).then(
        function(result) {
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

}

/*
Desired behavior:
Given a pair of users remove them
from eachother's friend list

Purpose:
Let user remove a friend to
make room in his friends list
*/
exports.delete_friend = function(req, res) {
  const friendName = req.body.friendName;
  const self = req.body.displayName;
  Promise.all([deleteFriend(self, friendName), deleteFriend(friendName, self)]).then(
    function(result) {
      res.send("Removed friend " + friendName);
    },
    function(err) {
      res.status(400).send(err);
    }
  );
}

/*
Desired behavior:
Add a new user to system

Purpose:
Allow new users to sign up
*/
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

function addResetKey(displayName, resetKey) {
  return new Promise(function(resolve, reject) {
    User.findOneAndUpdate({
        displayName: displayName
      }, {
        $set: {
          resetKey: resetKey
        }
      },
      function(err, doc) {
        if (err) {
          console.log(err);
          reject(err);
        } else
          resolve(true);

      })
  });

}

exports.request_reset = function(req, res) {
  var email = req.body.email;
  var displayName = req.body.displayName
  var resetKey = random.generate({
    length: 64,
    readable: true
  });
  var link = 'http://' + process.env.IP_ADRESS + ':' + process.env.PORT + '/'
  let mailOptions = {
    from: '"Opsu System" <opsuofficial@gmail.com>',
    to: req.body.email,
    subject: 'Opsu Account password reset',
    text: 'If you requested a password reset for ' + displayName + ' please click the following link:' + link + '\nIf not please ignore this message'
  };
  addResetKey.then(
    function() {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err)
          res.send(err);
        else
          res.send(info);
      });
    },
    function(err) {
        res.send(err);
    });

}

exports.request_page = function(req, res) {
  var displayName = req.query.displayName;
  var resetKey = req.query.resetKey;
  fs.readFile('../views/passwordReset.html', function(err, data) {
    if(err)
      res.send(400,err);
    else
      res.send(resetTemplate.replace('$RESET_KEY', resetKey).replace('$DISPLAY_NAME', displayName));

  });

}
