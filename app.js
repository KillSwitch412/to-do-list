const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// setting our view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.listen(port, function () {
    console.log('Server started on port ' + port);
});