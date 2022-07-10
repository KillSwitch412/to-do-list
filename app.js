const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
const port = 3000;

// setting our view engine to ejs
app.set('view engine', 'ejs');
// setting up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// serve static files
app.use(express.static('public'));


// ! setting up mongoDB database
// * connecting mongoose
mongoose.connect('mongodb://localhost:27017/todolistDB');
// * schema
const itemsSchema = {
    'name': String
};

// * mongoose model
// * createing a mongoose model automatically 
// * creates a DB and the collection in it.
// mongoose.model(singularCollectionName, schema);
const Item = mongoose.model('Item', itemsSchema);

// ! adding default items in the DB
function addDefaultItemsInDB() {

    // * mongoose document
    const item1 = new Item({
        name: 'Learn Flutter',
    });
    
    const item2 = new Item({
        name: 'Learn Data Structures',
    });
    
    const item3 = new Item({
        name: 'Learn Algorithms',
    });
    
    const defaultItems = [item1, item2, item3];
    
    Item.insertMany(defaultItems, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Successfully added default items.');
        }
    });

}


app.get('/', function (req, res) {

    Item.find({}, function (err, result) {

        if (result.length == 0) {
            addDefaultItemsInDB();
        }

        res.render('list', { listTitle: 'Today', items: result });
    });

});

app.get('/work', function (req, res) {
    res.render('list', { listTitle: 'Work', items: workItems });
});

app.post('/', function (req, res) {

    const itemName = req.body.newItem;

    const itemDoc = new Item({
        name: itemName,
    });

    itemDoc.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });

    // if (req.body.list === 'Work') {
    //     workItems.push(newItem);
    //     res.redirect('/work');
    // } else {
    //     items.push(newItem);
    //     res.redirect('/');
    // }

});

app.post('/delete', function (req, res) {
    // console.log(req.body.checkbox);
    const item_id = req.body.checkbox;
    
    Item.findByIdAndRemove(item_id, function (err) {
        if (err) {
            console.log(`Item ${item_id} could NOT be deleted`);
        } else {
            console.log(`Item ${item_id} SUCCESSFULLY deleted`);
        }
    });

    res.redirect('/');

});

app.get('/about', function (req, res) {
    res.render('about');
});



app.listen(port, function () {
    console.log('Server started on port ' + port);
});