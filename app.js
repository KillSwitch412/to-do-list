const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();
const port = 3000;

const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];

// setting our view engine to ejs
app.set('view engine', 'ejs');
// setting up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// serve static files
app.use(express.static('public'));

app.get('/', function (req, res) {

    let dateToday = date.getDate();
    res.render('list', { listTitle: dateToday, items: items });
});

app.get('/work', function (req, res) {
    res.render('list', { listTitle: 'Work', items: workItems });
});

app.post('/', function (req, res) {

    let newItem = req.body.newItem;

    if (req.body.list === 'Work') {
        workItems.push(newItem);
        res.redirect('/work');
    } else {
        items.push(newItem);
        res.redirect('/');
    }

});

app.get('/about', function (req, res) {
    res.render('about');
});



app.listen(port, function () {
    console.log('Server started on port ' + port);
});