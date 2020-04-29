require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');

const fs = require('fs');
// const privateKey  = fs.readFileSync(__dirname + '/ssl.key');
// const certificate = fs.readFileSync(__dirname + '/ssl.crt');
// const credentials = {key: privateKey, cert: certificate};


app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app2 = express();
// app2.use(bodyParser.json());
// app2.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes.js');
// const authentication = require("./middleware/auth")
app.use('/test', routes);

// const routes2 = require('./resetRoutes.js');
// app2.use(routes2);

// const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

// httpsServer.listen(process.env.PORT);
httpServer.listen(process.env.PORT | 3000)
