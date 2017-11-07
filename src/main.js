// Require packages
const passportLocalMongoose = require('passport-local-mongoose'),
      bodyparser            = require('body-parser'),
      Chart                 = require('chart.js'),
      express               = require('express'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local').Strategy,
      app                   = express();

// Require local files
const middleware  = require('./middleware/index.js');
const config      = require('../config/global.config.json');
const userData    = require('./schemas/userSchema.js');

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
const userFactory = require('./services/userFactory.js');
//userFactory.randomUser(User, 1);


// ===============================================================
// ROUTES
// ===============================================================

// Root route
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/home', middleware.isLoggedIn, (req, res) => {
    let user = req.user;
    res.render('home', {user: user});
});

// Profile
app.get('/profile', middleware.isLoggedIn, (req, res) => {
    let user = req.user;
    res.render('profile', {user: user})
});

// Training program
app.get('/program', middleware.isLoggedIn, (req, res) => {
    res.render('program');
});

// Meal plan
app.get('/meal-plan', middleware.isLoggedIn, (req, res) => {
    res.render('meal-plan');
});

// Inbox
app.get('/inbox', middleware.isLoggedIn, (req, res) => {
    res.render('inbox');
});

// News
app.get('/news', middleware.isLoggedIn, (req, res) => {
    res.render('news');
});

// Update weight route
app.post('/update/weight', (req, res) => {
    console.log()
    const newWeight = req.params.weight;
    console.log("newWeight", newWeight);
    userFactory.updateWeight(newWeight, req.user, User);
    
    res.redirect('/home');
});


// ===============================================================
// AUTH ROUTES
// ===============================================================

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

// Server listening
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});