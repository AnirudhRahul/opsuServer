require('dotenv').load();
var express = require('express');
app = express();
app.listen(process.env.PORT);

console.log('server started on: ' + port);
