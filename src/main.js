var bodyparser = require('body-parser');
var Chart = require('chart.js');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var config = require('../config/global.config.json');
var userData = require('./data/users.json');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mm_fitness_app', {useMongoClient: true});
var db = mongoose.connection;


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
    res.render('home', {users: userData});
});

// Profil
app.get('/profile', (req, res) => {
    let user = findUser("mo@pe.dk");
    console.log("User from route", user);
    res.render('profile', {user: user});
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
    createNewUser(user);
});

// DETTE SKAL FLYTTES TIL FIL!!!!
// Define schema for user
var userSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    avatarURL: String,
    weightStats: {
        currentWeight: String,
        startWeight: String,
        weightProgress: String,
        allWeights: [
            {
                date: String,
                weight: String
            }
        ]
    },
    trainingStats: {
        assignedWorkouts: [
            {
                name: String,
                reps: String
            }                
        ]
    },
    foodStats: {
        totalCalories: String,
        mealPlan: [
            {
                name: String,
                description: String,
                recipe: String,
                calories: String,
                carbohydrates: String,
                fat: String,
                protein: String
            }
        ]
    },
    messages: [
        {
            date: String,
            content: String
        }
    ]
});

// Compile schema into model
let User = mongoose.model('User', userSchema);

function createNewUser(user){
    User.create(user),
    function(err, newUser){
        if(err){
            console.log(err);
        }else{
            console.log("User created: " + newUser);
            return newUser;
        }
    }
}

async function findUser(email){
    try {
        const newUser = await User.findOne({email: email}).exec();
        console.log("user from db", newUser);
        return newUser;
    } catch(err) {
        throw(err);
    }
}

// Create a user
/* User.create({name: 'Johnny', email: 'johnny@johnny.dk'}, function(err, user){
    if(err){
        console.log(err);
    }
    console.log(user);
}); */


// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});