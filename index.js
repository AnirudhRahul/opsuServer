require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const fs = require('fs');
const privateKey  = fs.readFileSync(__dirname + '/ssl.key');
const certificate = fs.readFileSync(__dirname + '/ssl.crt');
const credentials = {key: privateKey, cert: certificate};


app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Server is running');
})

const routes = require('./routes.js');
app.use('/test', routes);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT);
console.log('server started on: ' + port);
