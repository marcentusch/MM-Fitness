const bodyparser = require('body-parser'),
      Chart = require('chart.js'),
      express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      passportLocalMongoose = require('passport-local-mongoose');

const config = require('../config/global.config.json');
const userFactory = require('./services/userFactory.js');
const userData = require('./schemas/userSchema.js');

// MAKING AUTH FROM THIS: https://scotch.io/tutorials/easy-node-authentication-setup-and-local

// Database stuff
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mm_fitness_app', {useMongoClient: true});
const db = mongoose.connection;

// Make user-schema
const userSchema = mongoose.Schema(userData);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

// Setup
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: "MM-Fitness er den vildeste app nogensinde!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Serialize & deserialize the user in the session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Uncomment this method for test data, specify amount of users
//userFactory.randomUser(User, 1);

// ===============================================================
// ROUTES

/* // Hjem
app.get('/home/:_id', async (req, res) => {
    try {
        const user = await userFactory.findUser(req.params._id, User);
        res.render('home', {user: user});
    } catch(err) {
        throw err;
    }
}); */

// Root route
app.get('/', (req, res) => {
    res.send('Root route')
});

app.get('/home', isLoggedIn, (req, res) => {
    let user = req.user;
    res.render('home', {user: user});
});

// Profile
app.get('/profile', isLoggedIn, (req, res) => {
    let user = req.user;
    res.render('profile', {user: user})
});

// Training program
app.get('/program', (req, res) => {
    res.render('program');
});

// Meal plan
app.get('/meal-plan', (req, res) => {
    res.render('meal-plan');
});

// Inbox
app.get('/inbox', (req, res) => {
    res.render('inbox');
});

// News
app.get('/news', (req, res) => {
    res.render('news');
});

// Update weight route
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

// ===============================================================
// AUTH ROUTES

// Show signup form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handling user signup
app.post('/register', (req, res) => {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/home')
        });
    });
});

// ===============================================================
// LOGIN ROUTES

// Render login form
app.get('/login', (req, res) => {
    res.render('login');
});

// Login logic w. middleware
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
}), (req, res) => {

});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});