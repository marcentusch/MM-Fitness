var bodyparser = require('body-parser');
var Chart = require('chart.js');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var config = require('../config/global.config.json');
var userData = require('./data/users.json');

// Connect to database
mongoose.connect('mongodb://localhost/mm_fitness_app');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    //console.log("CONNECTED TO DB!");
});


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

// Opdatér vægt route
app.post('/home/:id', (req, res) => {
    let newWeight = req.body.newWeight;

});

app.post('/user/new', (req,res) =>{
    console.log("body", req.body);
    createNewUser(req.body.name, req.body.email);
});

// DETTE SKAL FLYTTES TIL FIL!!!!
// Define schema for user
var userSchema = mongoose.Schema({
    _id: String,
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
        ],
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
    }
});

// Compile schema into model
var User = mongoose.model('User', userSchema);

function createNewUser(name, email){
    console.log("name", name);
    User.create(
        {
            name: name, 
            email: email
        }
    ),
    function(err, user){
        if(err){
            console.log(err);
        }else{
            console.log("User created: " + user);
            return user;
        }
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