const express = require('express');
let mongodb = require('mongodb');
let app = express();
let db;

// alow incoming requests to have access to our public folder (IOW serve up static existing files)
app.use(express.static(__dirname + '/public'));

let connectionString =
  'mongodb+srv://todoAppUser:pobox00603@cluster0.hgrns.mongodb.net/TodoApp?retryWrites=true&w=majority';
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db();
    app.listen(3000);
  }
);

// using express to add a body object to async POST requests
app.use(express.json());
// using express to add all form values to a body object & add that body object gets added to the request object bc
// by default express won't do this // that's why we use req.body.sugar  // this is how we access the form data easily
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  db.collection('items')
    .find()
    .toArray(function (err, items) {
      console.log(items);
      res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id='create-form' action= "/create-item" method='POST'>
            <div class="d-flex align-items-center">
            <input id='create-field' name='itemSugar' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add one Item</button>

            </div>
          </form>
        </div>
        
        <ul id='item-list' class="list-group pb-5">

            
        </ul>
        
      </div>
    <script>
    let items = ${JSON.stringify(items)}</script> 
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src='/browser.js'></script>
    </body>
    </html>`);
    });
});

//to create an item
app.post('/create-item', function (req, res) {
  db.collection('items').insertOne(
    { text: req.body.text },
    function (err, info) {
      //res.send('thanks for submitting the form');
      //redirecting to the base url
      //res.redirect('/');
      res.json(info.ops[0]);
    }
  );
});

//to update an item
app.post('/update-item', function (req, res) {
  db.collection('items').findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) } /*doc we want to update */,
    { $set: { text: req.body.text } } /*property we want to update*/,
    function () {
      res.send('Success');
    }
  );
});

// to delete an item
app.post('/delete-item', function (req, res) {
  db.collection('items').deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.send('Success');
    }
  );
});
