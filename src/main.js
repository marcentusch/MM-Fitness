const bodyparser = require('body-parser');
const Chart = require('chart.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const moment = require('moment');

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
app.get('/home', async (req, res) => {
    try {
        const user = await userFactory.findUser("johnny@johnny.dk", User);
        res.render('home', {user: user});
    } catch(err) {
        throw err;
    }
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


function randomUser() {
    const names = ["Jens", "Brian", "Søren", "Ole", "Denise", "Maibrit"];
    const emails = ["foo@bar.dk", "test@test.dk", "lorem@ipsum.dk"];
    const password = "12345";
    const avatarURL = "http://www.qygjxz.com/data/out/190/5691490-profile-pictures.png";
    
    const weights =[];
    for(let i = 0; i < 10; i++) {
        let weight = {
            date: randomDate(),
            weight: randomNumber(50,100, 1)
        }
        weights.push(weight);
    }

    const weightStats = {
        currentWeight: randomNumber(50, 100, 1),
        startWeight: randomNumber(50, 100, 1),
        weightProgress: randomNumber(0, 10, 1),
        allWeights: weights
    }
    const user = {
        name: names[randomNumber(0,5, 0)],
        email: emails[randomNumber(0,2)],
        password: password,
        avatarURL: avatarURL,
        weightStats: weightStats
    }
    console.log(JSON.stringify(user, null, 3));
    userFactory.createNewUser(user, User);
}
randomUser();

function randomDate() {
    const someDate = randomNumber(1,27) + "-" + randomNumber(1, 12) + "-2017";
    const randomDate = moment(someDate, "D-M-YYYY").format("d/M/YY");
    return randomDate;
}

function randomNumber(min, max, decimals) {
    let randomNumber = Math.random() * (max - min) + min;
    return randomNumber.toFixed(decimals);
}



// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});