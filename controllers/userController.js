var mongoose = require('mongoose'),
User = mongoose.model('User');

//TODO implement api responeses

//GET methods
exports.get_user = function(req, res) {

  User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
    if(err)
      res.status(400).send(err);
    else
      res.send(user);
  });

};

exports.get_friendRequests = function(req, res) {

  User.findOne({ displayName: req.query.displayName}, function (err, user) {
    if(err)
      res.status(400).send(err);
    else
      res.send(user.friend_requests);
  });

};

exports.get_friends = function(req, res) {

  User.findOne({ displayName: req.query.displayName}, function (err, user) {
    if(err)
      res.status(400).send(err);
    else
      res.send(user.friends);
  });

};

exports.create_request = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;

  User.findOneAndUpdate(
    {displayName : friendName},
    {$addToSet : {friend_requests: self}},
    function(err, doc) {
        if(err)
          res.status(400).send(err);
        else if(doc == null)
          res.status(403).send("Friend name doesn't exist");
        else
          res.send("Friend Request sent");
    });

};

exports.delete_request = function(req, res) {
  const friendName = req.query.friendName;
  const self = req.query.displayName;
  const accept = req.query.accept;
  var worked = true;
  if(accept){
    var withinLimit=true;
    //Add eachother to friends lists
    User.findOneAndUpdate(
      {displayName : self},
      {$addToSet : {friends: friendName}},
      function(err, doc) {
          if(err)
            worked = false;
          if(doc.friend_requests.length >= doc.maxFriend)
            withinLimit = false;
      });
    User.findOneAndUpdate(
      {displayName : friendName},
      {$addToSet : {friends: self}},
      function(err, doc) {
        if(err)
          worked = false;
        if(doc.friend_requests.length >= doc.maxFriend)
          withinLimit = false;
      });
    }
    if(!withinLimit){
      //Remove friends since limit was Reached
      User.findOneAndUpdate(
        {displayName : self},
        {$pull : {friends: friendName}});
      User.findOneAndUpdate(
        {displayName : self},
        {$pull : {friends: friendName}});
        res.status(403).send("Friend Limit Reached");
        return;
    }

    //Delete friend request
    User.findOneAndUpdate(
      {displayName : self},
      {$pull : {friend_requests: friendName}},
      function(err, doc) {
        if(err)
          worked = false;
      });

    //Send response
    if(worked&&accept)
      res.send("Friend Request accepted");
    else if(worked&&!accept)
      res.send("Friend Request deleted");
    else
      res.status(400).send("Friend Request failed ");
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
        res.status(403);
      res.send(err);
    }
    else
      res.send(user);
  });
};
