module.exports = (function() {
    'use strict';

    var users = require('express').Router();
    var mongoose = require('mongoose'),
    var bodyParser = require('body-parser')
    var jsonParser = bodyParser.json()

    User = mongoose.model('User');
    //TODO implement api responeses

    users.get('/', function (req, res) {
      res.send("get_user route is working");
      User.findOne({ email: req.query.email, password: req.query.password }, function (err, user) {
          if(err)
            res.send(err);
          else
            res.json(user);
      });
    });


     users.put('/', jsonParser, function (req, res) {
       res.send("add_user route is working");
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
     });

    return users;
})();
