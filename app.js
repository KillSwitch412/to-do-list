const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const lodash = require('lodash');

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
const listSchema = {
    'name': String,
    'items': [itemsSchema], 
};

// * mongoose model
// * createing a mongoose model automatically 
// * creates a DB and the collection in it.
// mongoose.model(singularCollectionName, schema);
const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listSchema);

// ! adding default items in the DB
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

// ! GET AND POST

app.get('/', function (req, res) {

    Item.find({}, function (err, result) {

        if (result.length == 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully added default items.');
                }
            });
        }

        res.render('list', { listTitle: 'Today', items: result });
    });

});

app.get('/:listName', function(req, res) {
    const listName = lodash.capitalize(req.params.listName);

    // creating a custom list for the user, if it doesn't exist
    // and adding the default items in it
    List.findOne({name: listName}, function(err, results) {
        if (err) {
            console.log(err); 
        } else {

            if (results == null) {
                
                console.log('Creating customList named: ' + listName);

                const list = new List({
                    name: listName,
                    items: defaultItems,
                });

                list.save();
                res.redirect('/' + listName);
                
            } else {
                res.render('list', { listTitle: listName, items: results.items });
            }
            
        }
    });

});

app.get('/about', function (req, res) {
    res.render('about');
});

app.post('/', function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const itemDoc = new Item({
        name: itemName,
    });

    // 'Today' is the listTitle of the default list
    if (listName == 'Today') {
        itemDoc.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, function (err, foundList) {
            foundList.items.push(itemDoc);
            foundList.save();
            res.redirect('/' + listName);
        });
    }

});

app.post('/delete', function (req, res) {
    const item_id = req.body.checkbox;
    const listName = req.body.listName;

    // 'Today' is the name of the todo List.
    if (listName == 'Today') {

        Item.findByIdAndRemove(item_id, function (err) {
            if (err) {
                console.log(`Item ${item_id} could NOT be deleted`);
            } else {
                console.log(`Item ${item_id} SUCCESSFULLY deleted`);
            }
        });

        res.redirect('/');

    } else {

        // The $pull operator removes from an existing array all instances of a value or values
        // that match a specified condition.   
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: item_id}}}, function (err, foundList) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/' + listName);
            }
        });
    }

});




// ! APP LISTEN

app.listen(port, function () {
    console.log('Server started on port ' + port);
});