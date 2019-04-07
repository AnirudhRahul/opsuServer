require('dotenv').config();
var express = require('express');
port = process.env.PORT || 3000;
app = express();
app.listen(port);

console.log('server started on: ' + port);
