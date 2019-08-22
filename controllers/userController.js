const mongoose = require("mongoose");
const fs = require("fs");
var minify = require("html-minifier").minify;

const path = require("path");
const random = require("randomstring");
const resetKeyLength = 64;
User = require("../models/User.js");

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "email-smtp.us-east-1.amazonaws.com",
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
  User.findOne(
    {
      displayName: req.body.displayName,
      password: req.body.password
    },
    function(err, user) {
      if (err) res.status(400).send(err);
      else if (user) res.send(user);
      else res.status(404).send("Username or password incorrect");

      console.log("End reached");
    }
  );
};

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
  User.findOne(
    {
      displayName: req.body.displayName
    },
    "friend_requests",
    function(err, user) {
      if (err) res.status(400).send(err);
      else if (user) res.send(user);
      else res.status(404).send("User not found");
    }
  );
};

/*
Desired behavior:
Returns a list of the user's friends

Purpose:
Allow for easy access to the list of
the users friends since this field
gets updated regularly
*/
exports.get_friends = function(req, res) {
  User.findOne(
    {
      displayName: req.body.displayName
    },
    "friends",
    function(err, user) {
      if (err) res.status(400).send(err);
      else if (user) res.send(user);
      else res.status(404).send("User not found");
    }
  );
};

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

  User.findOneAndUpdate(
    {
      displayName: friendName
    },
    {
      $addToSet: {
        friend_requests: self
      }
    },
    function(err, doc) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else if (doc) {
        res.send("Friend Request sent");
      } else {
        res.status(404).send("Friend name doesn't exist");
      }
    }
  );
};

function addFriend(self, friend) {
  console.log("Called part 2");
  //Add eachother to friends lists
  return new Promise(function(resolve, reject) {
    User.findOneAndUpdate(
      {
        displayName: self
      },
      {
        $addToSet: {
          friends: friend
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
}

function friendLimitReached(self) {
  console.log("Called part 1");
  return new Promise(function(resolve, reject) {
    User.findOne(
      {
        displayName: self
      },
      function(err, user) {
        console.log(
          "Name: " +
            self +
            "\nFriends: " +
            user.friends.length +
            " MaxFriends: " +
            user.maxFriend
        );
        if (err) {
          console.log(err);
          reject(err);
        } else if (!user) {
          reject(new Error("User " + self + " not found"));
        } else if (user.friends.length >= user.maxFriend) {
          reject(new Error(self + " Friend limit reached"));
        } else {
          resolve(true);
        }
      }
    );
  });
}

function deleteFriendRequest(self, friendName) {
  console.log("Called part 3");
  return new Promise(function(resolve, reject) {
    User.findOneAndUpdate(
      {
        displayName: self
      },
      {
        $pull: {
          friend_requests: friendName
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
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
  const accept = req.body.accept == "true";
  if (accept) {
    Promise.all([friendLimitReached(self), friendLimitReached(friendName)])
      .then(() =>
        Promise.all([addFriend(self, friendName), addFriend(friendName, self)])
      )
      .then(() => deleteFriendRequest(self, friendName))
      .then(result => {
        res.send("Friend Request accepted");
      })
      .catch(err => {
        res.status(400).send(err.toString());
      });
  } else {
    deleteFriendRequest(self, friendName)
      .then(result => {
        res.send("Friend Request accepted");
      })
      .catch(err => {
        res.status(400).send(err.toString());
      });
  }
};

function deleteFriend(self, friendName) {
  return User.findOneAndUpdate(
    {
      displayName: self
    },
    {
      $pull: {
        friends: friendName
      }
    }
  ).exec();
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
  Promise.all([deleteFriend(self, friendName), deleteFriend(friendName, self)])
    .then(result => {
      res.send("Friend Request accepted");
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err.toString());
    });
};

function resetLink(displayName, resetKey) {
  return (
    "http://" +
    process.env.IP_ADRESS +
    "/user/reset?" +
    "displayName=" +
    displayName +
    "&resetKey=" +
    resetKey
  );
}

function rejectLink(displayName, resetKey) {
  return (
    "http://" +
    process.env.IP_ADRESS +
    "/user/rejectReset?" +
    "displayName=" +
    displayName +
    "&resetKey=" +
    resetKey
  );
}

function addResetKey(displayName, resetKey) {
  return User.findOneAndUpdate(
    {
      displayName: displayName
    },
    {
      $set: {
        resetKey: resetKey
      }
    }
  ).exec();
}

function createUser(displayName, email) {
  var newUser = new User({
    displayName: displayName,
    email: email,
    password: ""
  });

  return newUser.save();
  }

const createPageTemplate = fs
  .readFileSync(path.resolve(__dirname, "./../views/passwordCreation.html"))
  .toString();

/*
Desired behavior:
Add a new user to system

Purpose:
Allow new users to sign up
*/
exports.add_user = function(req, res) {
  const displayName = req.body.displayName;
  const email = req.body.email;

  if (!(displayName && email)) {
    res.status(401).send("Missing Parameters");
    return;
  }

  const resetKey = random.generate({
    length: resetKeyLength,
    readable: true
  });
  const link = resetLink(displayName, resetKey);

  let mailOptions = {
    from: '"Opsu System" <opsuofficial@gmail.com>',
    to: email,
    subject: "Opsu Account Creation",
    text: createPageTemplate
      .replace("{{name}}", displayName)
      .replace("{{action_url}}", link)
  };

  createUser(displayName, email)
    .then(() => addResetKey(displayName, resetKey))
    .then(function() {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.send("Mail Error:\n" + err);
        } else res.send(info);
      });
    })
    .catch(err => {
      console.log(err);
      res.send("Server Error:\n" + err);
    });
};

exports.request_reset = function(req, res) {
  var email = req.body.email;
  var displayName = req.body.displayName;
  var resetKey = random.generate({
    length: resetKeyLength,
    readable: true
  });

  const link = resetLink(displayName, resetKey);
  const rejectLink = rejectLink(displayName, resetKey);

  let mailOptions = {
    from: '"Opsu System" <opsuofficial@gmail.com>',
    to: req.body.email,
    subject: "Opsu Account password reset",
    text:
      "If you requested a password reset for " +
      displayName +
      " please click the following link:\n" +
      link +
      "\n\nIf not please click here to reject the link:\n" +
      rejectLink
  };
  addResetKey(displayName, resetKey)
    .then(function() {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.send("Mail Error:\n" + err);
        } else res.send(info);
      });
    })
    .catch(err => {
      console.log(err);
      res.send("Server Error:\n" + err);
    });
};

const resetPageTemplate = fs
  .readFileSync(path.resolve(__dirname, "./../views/passwordReset.html"))
  .toString();

exports.request_page = function(req, res) {
  var displayName = req.query.displayName;
  var resetKey = req.query.resetKey;

  res.send(
    resetPageTemplate
      .replace("{{RESET_KEY}}", resetKey)
      .replace("{{DISPLAY_NAME}}", displayName)
  );
};

exports.reset_password = function(req, res) {
  var displayName = req.body.displayName;
  var newPassword = req.body.password;
  var resetKey = req.body.resetKey;

  if (!(displayName && newPassword && resetKey)) {
    res.status(401).send("Missing Parameters");
    return;
  }

  if (resetKey.length != resetKeyLength) {
    res.status(401).send("Invalid Reset Key");
    return;
  }

  User.findOneAndUpdate(
    {
      displayName: displayName,
      resetKey: resetKey
    },
    {
      $set: {
        password: newPassword,
        resetKey: ""
      }
    },
    function(err, user) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else if (user) res.send("Password Reset");
      else res.status(404).send("Username or reset key incorrect");
    }
  );
};

exports.reject_reset = function(req, res) {
  var displayName = req.query.displayName;
  var resetKey = req.query.resetKey;

  if (!(displayName && resetKey)) {
    res.status(401).send("Missing Parameters");
    return;
  }

  User.findOneAndUpdate(
    {
      displayName: displayName,
      resetKey: resetKey
    },
    {
      $set: {
        resetKey: ""
      }
    },
    function(err, user) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else if (user) res.send("Rejected reset link 👍");
      else res.status(404).send("Username or reset key not found");
    }
  );
};
