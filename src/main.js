const bodyparser = require('body-parser');
const Chart = require('chart.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('../config/global.config.json');
const userFactory = require('./services/userFactory.js');


// Setup
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


const userData = require('./schemas/userSchema.js');
// Database stuff
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mm_fitness_app', {useMongoClient: true});
const db = mongoose.connection;

const userSchema = mongoose.Schema(userData);
const User = mongoose.model('User', userSchema);


// Login
app.get('/', (req, res) => {
    res.render('login');
});

// Hjem
app.get('/home', (req, res) => {
    res.render('home', {users: userData});
});

// Profil
app.get('/profile', async (req, res) => {
    try {
        const user = await userFactory.findUser("johnny@johnny.dk", User);
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
app.post('/home/:id', (req, res) => {
    let newWeight = req.body.newWeight;

});

app.post('/user/new', (req,res) => {
    const body = req.body;
    const user = {
        name: body.name,
        email: body.email,
        password: body.password,
        avatarURL: body.avatarURL
    }
    userFactory.createNewUser(user, User);
});



// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});