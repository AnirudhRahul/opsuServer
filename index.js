require('dotenv').config();
var express = require('express');
app = express();
port = process.env.PORT;
app.listen(port);
console.log('server started on: ' + port);
var router = require("..api/router.js")
app.use(router);
