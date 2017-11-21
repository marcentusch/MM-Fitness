// Require packages
const passportLocalMongoose = require('passport-local-mongoose'),
bodyparser                  = require('body-parser'),
Chart                       = require('chart.js'),
express                     = require('express'),
app                         = express(),
server                      = require('http').Server(app),
io                          = require('socket.io')(server),
mongoose                    = require('mongoose'),
passport                    = require('passport'),
LocalStrategy               = require('passport-local').Strategy,
utility                     = require('./services/utility.js'),
moment                      = require('moment'),
schedule                    = require('node-schedule');

// Require local files
const middleware  = require('./middleware/index.js'),
config            = require('../config/global.config.json'),
userData          = require('./schemas/userSchema.js'),
workoutData       = require('./schemas/workoutSchema.js'),
userFactory       = require('./services/userFactory.js'),
workoutFactory    = require('./services/workoutFactory.js');

// Database stuff
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mm_fitness_app', {useMongoClient: true});
const db = mongoose.connection;

// Schemas
// user-schema
const userSchema = mongoose.Schema(userData);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

// workout-schema
const workoutSchema = mongoose.Schema(workoutData);
const Workout = mongoose.model('Workout', workoutSchema);

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

// Creates test data. needs username = 1
userFactory.testData(User, 10);


// Run this to get execise data in DB
/* Workout.remove({}).exec();
const exercises = ["squats", "bænkpres", "dødløft", "biceps curls", "skulder pres", "mavebøjninger"];
exercises.forEach((exercise) => {
    workoutFactory.createNewWorkout(Workout, exercise);
});  */

// ===============================================================
// WEB SOCKETS 
// ===============================================================
io.on('connection', function(socket){

    

    // Message from user
    socket.on("user message", (data) => {

        const newMessage = {
            date: moment().format("DD/MM - hh:mm"),
            message: data.message,
            fromUser: true
        }

        User.findById(data.userId, (err, user) => {
            if(err) {
                throw err;
            } else {
                user.messages.push(newMessage);
                
                user.save((err, updatedUser) => {
                    if(err) {
                        throw err;
                    }
                });
            }
        });
    });



    // Message from Mikael
    socket.on("mikael message", (data) => {

        const newMessage = {
            date: moment().format("DD/MM - hh:mm"),
            message: data.message,
            fromUser: false
        }

        
        User.findById(data.userId, (err, user) => {
            if(err) {
                throw err;
            } else {
                user.messages.push(newMessage);

                user.save((err, updatedUser) => {
                    if(err) {
                        throw err;
                    }
                });
            }
        });

        socket.emit("message to user", {
            id: data.userId,
            date: moment().format("DD/MM - hh:mm"),            
            message: data.message,
            fromUser: false
        });
    });

});

// ===============================================================
// SCHEDULE 
// ===============================================================

var j = schedule.scheduleJob('0 0 * * *', function(){
    User.find({}, (err, users) => {
        if(err) {
            throw err;
        }
        users.forEach((user) => {
            user.foodStats.mealPlan.caloriesToday = user.foodStats.mealPlan.totalCalories;
            user.foodStats.mealPlan.meals.forEach((meal) => {
                meal.isChecked = false;
            });
            user.save(function (err, updatedUsers) {
                if (err){
                    throw(err); 
                } 
            });
        });
    });
});


// ===============================================================
// ROUTES 
// ===============================================================

// Root route
app.get('/', (req, res) => {
    res.render('login'); 
});

// Home
app.get('/home', middleware.isLoggedIn, (req, res) => {
    const user = req.user;
    if(req.user.isAdmin){
        res.redirect('/admin');
    }else{
        res.render('home', {user: user});
    }
});

// Profile
app.get('/profile', middleware.isLoggedIn, (req, res) => {
    const user = req.user;
    res.render('profile', {user: user});
});


// ===============================================================
// WORKOUT ROUTES
// ===============================================================

// Training program
app.get('/program', middleware.isLoggedIn, (req, res) => {
    const user = req.user;
    const today = utility.currentDayDK();
    res.render('program', {user: user, today: today});
});


// ===============================================================
// MEAL ROUTES
// ===============================================================

// Meal plan
app.get('/meal-plan', middleware.isLoggedIn, (req, res) => {
    const user = req.user;
    const today = utility.currentDayDK();
    
    res.render('meal-plan', {user: user});
});

// Update Calories
app.post('/meal-plan/update/:userId/mealId/:mealId', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;
    const mealId = req.params.mealId;
    
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 

        let meals = user.foodStats.mealPlan.meals;
        let mealCalories = 0;

        for(let i = 0; i < meals.length; i++){
            if(meals[i].id === mealId){
                mealCalories = meals[i].calories;
                meals[i].isChecked = true;
            }
        }

        const newCaloriesToday = user.foodStats.mealPlan.caloriesToday -= mealCalories;
        user.foodStats.mealPlan.caloriesToday = newCaloriesToday;

        // Update calories today
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"newCalories": newCaloriesToday});
        });
    });
});

// Inbox
app.get('/inbox', middleware.isLoggedIn, (req, res) => {
    const user = req.user;
    res.render('inbox', {user: user});
});

// News
app.get('/news', middleware.isLoggedIn, (req, res) => {
    const user = req.user;
    res.render('news', {user: user});
});

// Update weight route
app.post('/update/weight', middleware.isLoggedIn, (req, res) => {
    const newWeight = req.body.weight;
    userFactory.updateWeight(newWeight, req.user, User);
    res.redirect('/home');
});

// Workout details
app.get('/workout/:name', middleware.isLoggedIn, async (req, res) => {
    const name = req.params.name;
    try {
        Workout.findOne({name: name}, (err, workoutFromDb) => {
            res.render('workout', {workout: workoutFromDb});
        }).exec();
    } catch (err) {
        throw(err);
    }
});


// ===============================================================
// Admin route
// ===============================================================

// front page
app.get('/admin',  middleware.isLoggedIn, (req, res) => {
    if(req.user.isAdmin) {
        User.find({}, (err, users) => {
            res.render('./admin/dashboard', {users: users});
        });
    } else {
        res.redirect('home');
    }
});

// user page
app.get('/admin/user/:userId', middleware.isLoggedIn, (req,res) => {
    if(req.user.isAdmin) {
        User.findById(req.params.userId, (err, user) => {
            Workout.find({}, (err, workouts) => {
                res.render('./admin/user', {user: user, workouts: workouts, muscleGroups: workoutFactory.muscleGroups});
            });
        });
    } else {
        res.redirect('home');
    }
});

// Update the users targetweight
app.post('/admin/user/:userId/update/weight', middleware.isLoggedIn, (req, res) => {
    const userId = req.params.userId;
    const newGoal = req.body.newGoal;
    
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        user.weightStats.targetWeight = newGoal;
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.redirect('/admin/user/' + userId);
        });
    });
});

// Create new trainingPas
app.post('/admin/user/:userId/create/trainingpas', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;
   
    const newPas = {
        pasNumber: '',
        muscleGroups: []
    }


    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        newPas.pasNumber = user.trainingStats.trainingPases.length + 1;
        user.trainingStats.trainingPases.push(newPas);

        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"message": "created new pas"});
        });
    });
});

// Create a new musclegroup in the specific trainingPas
app.post('/admin/user/:userId/create/musclegroup', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;
    const pas = req.body.trainingPas;
    const formData = JSON.parse('{"' + decodeURI(req.body.formData.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    const muscleGroup = formData.muscleGroup;
    const newMuscleGroup = {
        name: muscleGroup,
        assignedWorkouts: []
    }

    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        user.trainingStats.trainingPases[pas -1].muscleGroups.push(newMuscleGroup);
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"message": "created new musclegroup"});
        });
    });
});

app.post('/admin/user/:userId/create/workout', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;

    const trainingPas = req.body.trainingPas;
    const muscleGroup = req.body.muscleGroupId;
    
    let formData = JSON.parse('{"' + decodeURI(req.body.formData.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');

    
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        
        const trainingPasIndex = user.trainingStats.trainingPases.findIndex(i => i.pasNumber === trainingPas);
        const muscleGroupIndex = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups.findIndex(i => i.name === muscleGroup);


        user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts.push(formData);

        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"msg": "New workout was added"});
        });

    });
});

// Update Workout
app.post('/admin/user/:userId/update/workout/:workoutId', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;

    const trainingPas = req.body.trainingPas;
    const muscleGroup = req.body.muscleGroup;
    const workoutName = req.body.workoutName;
    const workoutId = req.body.workoutId;

    // Format query string to JSON-object
    formData = JSON.parse('{"' + decodeURI(req.body.formData.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    
    // Data to be returned to ajax call 
    returnData = {
        "newWorkoutName": formData.name,
        "newWorkoutReps": formData.reps,
        "newWorkoutSaet": formData.saet
    };
    
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 

        const trainingPasIndex = user.trainingStats.trainingPases.findIndex(i => i.pasNumber === trainingPas);
        const muscleGroupIndex = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups.findIndex(i => i.name === muscleGroup);
        const workoutIndex = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts.findIndex(i => i.name === workoutName);
        
        // Makes sure the old data is returned if nothing was entered
        if(formData.name) {
            user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts[workoutIndex].name = formData.name;        
        } else {
            returnData.newWorkoutName =  user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts[workoutIndex].name;
        }
        
        if(formData.reps) {
            user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts[workoutIndex].reps = formData.reps;
        } else {
            returnData.newWorkoutReps = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts[workoutIndex].reps;
        }

        if(formData.saet) {
            user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts[workoutIndex].saet = formData.saet;        
        } else {
            returnData.newWorkoutSaet = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts[workoutIndex].saet;
        }
        

        // Update new workout data
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json(returnData);
        });
    });
});


app.post('/admin/user/:userId/delete/pas', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;
    

    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        
        const trainingPasIndex = user.trainingStats.trainingPases.findIndex(i => i.pasNumber === req.body.trainingPas);
        user.trainingStats.trainingPases.splice(trainingPasIndex, 1);

        // Makes sure that the passes above the deleted one gets updated their pasnumber
        for(let i = trainingPasIndex; i < user.trainingStats.trainingPases.length; i ++) {
            user.trainingStats.trainingPases[i].pasNumber = JSON.stringify(i +1);
        }


        // Update new workout data
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"msg": "stuff was deleted"});
        });
    });
});

app.post('/admin/user/:userId/delete/musclegroup', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;

    const muscleGroup = req.body.muscleGroup;
    const trainingPas = req.body.trainingPas;
    

    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        
        const trainingPasIndex = user.trainingStats.trainingPases.findIndex(i => i.pasNumber === req.body.trainingPas);
        const muscleGroupIndex = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups.findIndex(i => i.name === muscleGroup);

        user.trainingStats.trainingPases[trainingPasIndex].muscleGroups.splice(muscleGroupIndex, 1);

        // Update new workout data
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"msg": "stuff was deleted"});
        });
    });
});

app.post('/admin/user/:userId/delete/workout', middleware.isLoggedIn, async (req, res) => {
    const userId = req.params.userId;

    const trainingPas = req.body.trainingPas;
    const muscleGroup = req.body.muscleGroup;
    const workoutName = req.body.workoutName;
    
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        
        const trainingPasIndex = user.trainingStats.trainingPases.findIndex(i => i.pasNumber === trainingPas);
        const muscleGroupIndex = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups.findIndex(i => i.name === muscleGroup);
        const workoutIndex = user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts.findIndex(i => i.name === workoutName);


        user.trainingStats.trainingPases[trainingPasIndex].muscleGroups[muscleGroupIndex].assignedWorkouts.splice(workoutIndex, 1);

            // Update new workout data
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            res.json({"msg": "stuff was deleted"});
        });
    });
});



// ===============================================================
// AUTH ROUTES
// ===============================================================

// Show signup form
app.get('/admin/register', (req, res) => {
    res.render('admin/register');
});

// Handling user signup
app.post('/admin/register', (req, res) => {
    User.register(new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    ), 
        req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('admin/register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/home')
        });
    });
});

// ===============================================================
// LOGIN ROUTES
// ===============================================================

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
server.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});