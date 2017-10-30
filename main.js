var express = require('express');
var app = express();
var bodyparser = require('body-parser');

// Setup
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Root route [Login]
app.get('/', (req, res) => {
    res.render('index');
});

// Min side-route
app.get('/home', (req, res) => {
	res.render('home');
});


// Server listening
var port = 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});