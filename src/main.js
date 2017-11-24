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
newsData          = require('./schemas/newsSchema.js'),
userFactory       = require('./services/userFactory.js'),
workoutFactory    = require('./services/workoutFactory.js'),
mealFactory       = require('./services/mealFactory.js'),
newsFactory       = require('./services/newsFactory.js');

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

// news-schema
const newsSchema = mongoose.Schema(newsData);
const News = mongoose.model('News', newsSchema);

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

//run to get a news
//newsFactory.createNewNews(News);

// ===============================================================
// WEB SOCKETS FOR CHAT
// ===============================================================
io.on('connection', function(socket){

    // Handle user message from client to server
    socket.on("from user to server", (data) => {
        let newMessage = {
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
        newMessage.userId = data.userId;

        // Send user message from server to client
        socket.broadcast.emit('from server to admin', newMessage);
    });

/*************************************************************************** */

    // Handle admin message from client to server
    socket.on("from admin to server", (data) => {
        let newMessage = {
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

        newMessage.userId = data.userId;

        // Send admin message from server to client
        socket.broadcast.emit("from server to user", newMessage);
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
    News.find({}, (err, news) =>{
        res.render('news', {user: user, news: news});
    });
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
                res.render('./admin/user-page/user', {
                    user: user, 
                    workouts: workouts, 
                    muscleGroups: workoutFactory.muscleGroups,
                    meals: mealFactory.meals
                });
            });
        });

    } else {
        res.redirect('home');
    }
});

// chat page
app.get('/admin/user/:userId/chat', middleware.isLoggedIn, (req,res) => {
    if(req.user.isAdmin) {

        User.findById(req.params.userId, (err, user) => {
            Workout.find({}, (err, workouts) => {
                res.render('./admin/chat', {
                    user: user, 
                    workouts: workouts, 
                    muscleGroups: workoutFactory.muscleGroups,
                    meals: mealFactory.meals
                });
            });
        });

    } else {
        res.redirect('home');
    }
});

// news page
app.get('/admin/news', middleware.isLoggedIn, (req,res) => {
    if(req.user.isAdmin) {
        News.find({}, (err, news) => {
            res.render('./admin/news', {news: news});
        });
    } else {
        res.redirect('home');
    }
});

// Update the users targetweight
app.post('/admin/user/:userId/update/weight', middleware.isLoggedIn, (req, res) => {
    if(req.user.isAdmin) {

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

    } else {
        res.redirect('home');
    }
});

// ===============================================================
// Admin - Training
// ===============================================================

// Create new trainingPas
app.post('/admin/user/:userId/create/trainingpas', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {

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

    } else {
        res.redirect('home');
    }
});

// Create a new musclegroup in the specific trainingPas
app.post('/admin/user/:userId/create/musclegroup', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {

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
        
    } else {
        res.redirect('home');
    }
});


// Create new workout
app.post('/admin/user/:userId/create/workout', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {

        const userId = req.params.userId;
    
        const trainingPas = req.body.trainingPas;
        const muscleGroup = req.body.muscleGroupId;
        
        let formData = req.body.formData;
        
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
        
    } else {
        res.redirect('home');
    }
});

// Update Workout
app.post('/admin/user/:userId/update/workout/:workoutId', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {
        
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

    } else {
        res.redirect('home');
    }
});

// Delete single pas
app.post('/admin/user/:userId/delete/pas', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {

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
                res.json({msg: "Pas was deleted"});
            });
        });
        
    } else {
        res.redirect('home');
    }
});

// Delete musclegroup in a pas
app.post('/admin/user/:userId/delete/musclegroup', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {
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
                res.json(
                    {
                        muscleGroup: muscleGroup,
                        trainingPas: trainingPas,
                        msg: muscleGroup + " was deleted successfully"
                    }
                );
            });
        });
        
    } else {
        res.redirect('home');
    }
});

// Delete a single workout
app.post('/admin/user/:userId/delete/workout', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {
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
                res.json({msg: "Deleted a single workout"});
            });
        });
        
    } else {
        res.redirect('home');
    }
});

// ===============================================================
// Admin - Meals
// ===============================================================

// Create meal
app.post('/admin/user/:userId/create/meal', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {

        const userId = req.params.userId;
        const formData = JSON.parse('{"' + decodeURI(req.body.formData.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
        
        User.findById(userId, function (err, user) {
            if (err) {
                throw(err);
            } 
            const newMealId = user.foodStats.mealPlan.meals.length + 1;
            
            const newMeal = {
                isChecked: false,
                id: newMealId,
                meal: formData.newMealName,
                name: "<indsæt navn>",
                details: "<indsæt detaljer>",
                description: "<indsæt beskrivelse>",
                calories: 0,
                carbohydrates: 0,
                fat: 0,
                protein: 0
            }
    
            user.foodStats.mealPlan.meals.push(newMeal);
    
            user.save(function (err, updatedUser) {
                if (err){
                    throw(err); 
                } 
                res.json({"msg": "Created new meal"});
            });
        });
        
    } else {
        res.redirect('home');
    }
});

// Update meal name
app.post('/admin/user/:userId/update/meal', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {

        const userId = req.params.userId;
    
        const whatToUpdate = req.body.whatToUpdate;
        const formData = JSON.parse('{"' + decodeURI(req.body.formData.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
        
        const mealId = req.body.mealId;
        
        User.findById(userId, function (err, user) {
            if (err) {
                throw(err);
            }
            
            const mealIndex = user.foodStats.mealPlan.meals.findIndex(i => i.id === mealId);
    
            if(whatToUpdate === "name") {
                user.foodStats.mealPlan.meals[mealIndex].name = formData.name;
            } else if(whatToUpdate === "details") {
                user.foodStats.mealPlan.meals[mealIndex].details = formData.details;
            } else if(whatToUpdate === "description") {
                user.foodStats.mealPlan.meals[mealIndex].description = formData.description;
            } else if(whatToUpdate === 'calories'){
                user.foodStats.mealPlan.meals[mealIndex].calories = formData.calories;
                let newTotalCalories = 0;
                user.foodStats.mealPlan.meals.forEach((meal) => {
                   newTotalCalories += meal.calories; 
                });
                user.foodStats.mealPlan.totalCalories = newTotalCalories;
            } else if(whatToUpdate === 'carbs') {
                user.foodStats.mealPlan.meals[mealIndex].carbohydrates = formData.carbs;
                let newTotalCarbohydrates = 0;
                user.foodStats.mealPlan.meals.forEach((meal) => {
                    newTotalCarbohydrates += meal.carbohydrates; 
                });
                user.foodStats.mealPlan.totalCarbohydrates = newTotalCarbohydrates;
            } else if(whatToUpdate === 'fat'){
                user.foodStats.mealPlan.meals[mealIndex].fat = formData.fat;
                let newTotalFat = 0;
                user.foodStats.mealPlan.meals.forEach((meal) => {
                    newTotalFat += meal.fat; 
                });
                user.foodStats.mealPlan.totalFat = newTotalFat;
            } else if(whatToUpdate === 'protein'){
                user.foodStats.mealPlan.meals[mealIndex].protein = formData.protein;
                let newTotalProtein = 0;
                user.foodStats.mealPlan.meals.forEach((meal) => {
                    newTotalProtein += meal.protein; 
                });
                user.foodStats.mealPlan.totalProtein = newTotalProtein;
            }
    
            user.save(function (err, updatedUser) {
                if (err){
                    throw(err); 
                } 
                res.json({"msg": "Updated meal name"});
            });
        });
        
    } else {
        res.redirect('home');
    }
});

// delete meal
app.post('/admin/user/:userId/delete/meal', middleware.isLoggedIn, async (req, res) => {
    if(req.user.isAdmin) {
        
        const userId = req.params.userId;
        const mealId = req.body.mealId; 
        
        User.findById(userId, function (err, user) {
            if (err) {
                throw(err);
            } 
            let mealPlan = user.foodStats.mealPlan;
            // Getting meal-index
            const mealIndex = mealPlan.meals.findIndex(i => i.id === mealId);
            // Updating values
            const newTotalCalories = mealPlan.totalCalories - mealPlan.meals[mealIndex].calories;
            mealPlan.totalCalories = newTotalCalories;
            const newTotalCarbohydrates = mealPlan.totalCarbohydrates - mealPlan.meals[mealIndex].carbohydrates;
            mealPlan.totalCarbohydrates = newTotalCarbohydrates;
            const newTotalProtein = mealPlan.totalProtein - mealPlan.meals[mealIndex].protein;
            mealPlan.totalProtein = newTotalProtein;
            const newTotalFat = mealPlan.totalFat - mealPlan.meals[mealIndex].fat;
            mealPlan.totalFat = newTotalFat;
            mealPlan.meals.splice(mealIndex, 1);
    
            // Makes sure that the passes above the deleted one gets updated their pasnumber
            for(let i = mealIndex; i < mealPlan.meals.length; i ++) {
                mealPlan.meals[i].id = JSON.stringify(i + 1);
            }
    
            // Update new workout data
            user.save(function (err, updatedUser) {
                if (err){
                    throw(err); 
                } 
                res.json({msg: "Meal was deleted"});
            });
        });
        
    } else {
        res.redirect('home');
    }
});

// ===============================================================
// Admin - NEWS
// ===============================================================

// Create new news
app.post('/admin/news/create', (req, res) => {
    const newNews = {
        title: req.body.title,
        subdivision: req.body.subdivision,
        content: req.body.content,
        imageUrl: "",
        link: req.body.link,
        linkText: req.body.linkText,
        date: moment().format("DD/MM/YY")
    }
    News.create(newNews, (err) => {
        if(err){
            throw err;
        } else {
            res.redirect('/admin/news');
        }
    });
});

// Delete specific news
app.post('/admin/news/delete/:newsId', (req, res) => {
    const newsId = req.params.newsId;

    News.findByIdAndRemove(newsId, (err) => {
        if(err){
            throw err;
        } else {
            res.json({"msg": "Deleted news"});
        }
    });
});


// ===============================================================
// DELETE A USER
// ===============================================================

app.post('/admin/delete/:userId', (req, res) => {
    if(req.user.isAdmin) {

        const userId = req.params.userId;

        User.findByIdAndRemove(userId, (err, deletedUser) => {
            if(err){
                throw err;
            } else {
                res.redirect('/admin');
            }
        });

    } else {
        res.redirect('home');
    }
});

// ===============================================================
// AUTHENTICATION ROUTES
// ===============================================================

// Show signup form
app.get('/admin/register', (req, res) => {
    res.render('admin/register');
});

// Register user
app.post('/admin/register', (req, res) => {
    User.register(new User(
        userFactory.newUser(req.body)
    ), 
        req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('admin/register');
        }
        res.redirect('/admin')
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