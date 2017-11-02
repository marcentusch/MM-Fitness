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

    // User meta data
    const names = ["Jens", "Brian", "Søren", "Ole", "Denise", "Maibrit"];
    const emails = ["foo@bar.dk", "test@test.dk", "lorem@ipsum.dk"];
    const password = "12345";
    const avatarURL = "http://www.qygjxz.com/data/out/190/5691490-profile-pictures.png";
   
    // Create weight data
    const weights = [];

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


    // Create exercise data
    const exercises = ["squats", "bænkpres", "dødløft", "biceps curls", "skulder pres", "mavebøjninger"];

    let trainingPases =[];
    for(let i = 0; i < 3; i++) {
        let assignedWorkouts = [];
        for(let i = 0; i < 5; i++){
            const workOuts = 
                {
                    name: exercises[randomNumber(0, 5, 0)],
                    reps: randomNumber(6, 20, 0),
                    startWorkLoad: randomNumber(10, 30, 0),
                    currentWorkLoad: randomNumber(25, 40, 0),
                    WorkLoadProgress: randomNumber(1, 5, 0),
                    workLoad: randomNumber(10, 30, 0)
                }
            assignedWorkouts.push(workOuts);
        }
        let trainingPas = {
            pasNumber: i + 1,
            assignedWorkouts: assignedWorkouts
        }
        trainingPases.push(trainingPas);  
    }

    const trainingStats = {
        trainingPases: trainingPases
    }


    // Create food data
    const foods = ["nutella", "smør", "banan", "blomme", "mandler", "mango", "burger", "sunde pommes frites", "chips"];

    let mealPlan = [];
    for(let i = 0; i < 5; i++) {
        const meal = {
            name: foods[randomNumber(0, 8, 0)],
            description: "beskrivelse..",
            recipe: "put den i ovnen",
            calories: randomNumber(100, 500, 0),
            carbohydrates: randomNumber(0, 30),
            fat: randomNumber(0, 30),
            protein: randomNumber(0, 30)
        }
        mealPlan.push(meal);
    }

    const foodStats = {
        totalCalories: randomNumber(1900, 3000, 0),
        mealPlan: mealPlan
    }


    // Create message data
    const messageData = [
        "Hej Mikael, har du sovet godt?",
        "Skal du træne i dag, Jens?",
        "Husk at spis godt med proteiner i dag ven",
        "Voldemort did nothing wrong!",
        "Leave Britney alone!",
        "Never trust a fart - Mahatma Gandhi 2017",
        "Godmorgen",
        "Hvor ser du godt ud i dag, har du trænet?",
        "7",
        "Husk vitaminpiller, det er godt for leveren",
        ";-) ;-* kys tihi f9ser",
        "sk8r boi 69"
    ];

    const messages = [];

    for(let i = 0; i < 5; i++) {
        const message = {
                date: randomDate(),
                content: messageData[randomNumber(0, 11, 0)]
        }
        messages.push(message);
    }
        

    // Create the actual user from above data
    const user = {
        name: names[randomNumber(0, 5, 0)],
        email: emails[randomNumber(0, 2, 0)],
        password: password,
        avatarURL: avatarURL,
        weightStats: weightStats,
        trainingStats: trainingStats,
        foodStats: foodStats,
        messages: messages
    }

    console.log(JSON.stringify(user, null, 3));
    userFactory.createNewUser(user, User);
}


randomUser();


// Utility functions
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