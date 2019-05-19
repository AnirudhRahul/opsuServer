require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/opsu_Users', {useNewUrlParser: true});
const models = require('./models/User.js');

const express = require('express');
const bodyParser = require('body-parser');


app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Server is running');
})

const routes = require('./routes.js');
app.use('/test', routes);

port = process.env.PORT;
app.listen(port);
console.log('server started on: ' + port);
