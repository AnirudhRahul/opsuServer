require('dotenv').config();
const bodyParser = require('body-parser');
const routes = require('../routes.js');

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Server is running');
})
app.use('/test', routes)

port = process.env.PORT;
app.listen(port);
console.log('server started on: ' + port);
