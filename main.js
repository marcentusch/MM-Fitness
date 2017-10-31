var bodyparser = require('body-parser');
var Chart = require('chart.js');
var express = require('express');
var app = express();


// Setup
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Home
app.get('/', (req, res) => {
    res.render('home');
});

// Login
app.get('/login', (req, res) => {
    res.render('login');
});



// Server listening
var port = 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});