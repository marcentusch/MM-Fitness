var express = require('express');
var app = express();
var bodyparser = require('body-parser');

// Setup
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});

var port = 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});