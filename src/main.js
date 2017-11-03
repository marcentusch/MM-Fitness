const bodyparser = require('body-parser');
const Chart = require('chart.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('../config/global.config.json');
const userFactory = require('./services/userFactory.js');
const userData = require('./schemas/userSchema.js');

// MAKING AUTH FROM THIS: https://scotch.io/tutorials/easy-node-authentication-setup-and-local

// Setup
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


// Database stuff
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mm_fitness_app', {useMongoClient: true});
const db = mongoose.connection;

const userSchema = mongoose.Schema(userData);
const User = mongoose.model('User', userSchema);

// Uncomment this method for test data, specify amount of users
//userFactory.randomUser(User, 35);

// Login
app.get('/', (req, res) => {
    res.render('login');
});

// Hjem
app.get('/home/:_id', async (req, res) => {
    try {
        const user = await userFactory.findUser(req.params._id, User);
        res.render('home', {user: user});
    } catch(err) {
        throw err;
    }
});

// Profil
app.get('/profile', async (req, res) => {
    try {
        const user = await userFactory.findUser("test@test.dk", User);
        res.render('profile', {user: user});
    } catch(err) {
        throw err;
    }
});

// Trænings program
app.get('/program', (req, res) => {
    res.render('program');
});

// Kost
app.get('/meal-plan', (req, res) => {
    res.render('meal-plan');
});

// Indbakke
app.get('/inbox', (req, res) => {
    res.render('inbox');
});

// Nyheder
app.get('/news', (req, res) => {
    res.render('news');
});

// Opdatér vægt route
app.post('/update/:_id/weight', async (req, res) => {
    try {
        const userId = req.params._id;
        const newWeight = req.body.weight;
        await userFactory.updateWeight(newWeight, userId, User);
        
        res.redirect('/home/' + userId);
    } catch(err) {
        throw(err);
    }
});

// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});