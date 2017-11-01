var bodyparser = require('body-parser');
var Chart = require('chart.js');
var express = require('express');
var app = express();

var config = require('../config/global.config.json');
var userData = require('./data/users.json');


// Setup
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Login
app.get('/', (req, res) => {
    res.render('login');
});

// Hjem
app.get('/home', (req, res) => {
    console.log(userData);
    res.render('home', {users: userData});
});

// Trænings program
app.get('/program', (req, res) => {
    res.render('program');
});

// Kost
app.get('/kost', (req, res) => {
    res.render('kost');
});

// Indbakke
app.get('/indbakke', (req, res) => {
    res.render('indbakke');
});

// Nyheder
app.get('/nyheder', (req, res) => {
    res.render('nyheder');
});


// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});