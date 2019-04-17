require('dotenv').config();
var express = require('express');
app = express();
port = process.env.PORT;

var usersRoute = require('./routes/users');
app.use('/users', usersRoute);

app.listen(port);
console.log('server started on: ' + port);
