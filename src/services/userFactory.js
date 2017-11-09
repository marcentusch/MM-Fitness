const moment = require('moment'),
utility      = require('./utility.js');

// Create new user
function createNewUser(user, User){
    User.create(user),
    function(err, newUser){
        if(err){
            console.log(err);
        } else{
            console.log("User created: " + newUser);
            return newUser;
        }
    }
}

// Update weight
function updateWeight(weight, user, User){
    const userId = user._id;
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        
        // Create new weight
        user.weightStats.currentWeight = weight;
        const newWeight = {
            date: moment().format("d/M/YY"),
            weight: weight
        };
        user.weightStats.allWeights.push(newWeight);

        // Update weight progress
        user.weightStats.weightProgress = user.weightStats.allWeights[0].weight - weight;

        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            return updatedUser;
        });
    });
}

// Function to make random users
function testData(User, amount) {
    
    User.remove( { username : { $ne: "1" } } ).exec();
    
    for(let i = 0; i < amount; i++){
        
        // User meta data
        const usernames = ["Jens", "Brian", "Søren", "Ole", "Denise", "Maibrit", "Marc", "Jonas"];
        const emails = ["foo@bar.dk", "test@test.dk"];
        const password = "12345";
        const avatarURL = "http://www.qygjxz.com/data/out/190/5691490-profile-pictures.png";
        
        // Create weight data
        const weights = [];

        for(let i = 0; i < 10; i++) {
            let weight = {
                date: utility.randomDate(),
                weight: utility.randomNumber(50,100, 1)
            }
            weights.push(weight);
        }

        const weightStats = {
            currentWeight: utility.randomNumber(50, 100, 1),
            startWeight: utility.randomNumber(50, 100, 1),
            weightProgress: 0,
            allWeights: weights
        }
        
        weightStats.weightProgress = weightStats.startWeight - weightStats.currentWeight;


        // Create exercise data
        const muscleGroups = ["ben", "ryg", "biceps", "mave", "røv", "nakke", "triceps"];
        const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

        let trainingPases =[];
        for(let i = 0; i < 3; i++) {
            let trainingPas = {
                day: days[utility.randomNumber(0, days.length -1)],
                muscleGroups: [
                    {
                        name: muscleGroups[utility.randomNumber(0, muscleGroups.length -1)],
                        assignedWorkouts: createTestWorkouts()
                    },
                    {
                        name: muscleGroups[utility.randomNumber(0, muscleGroups.length -1)],
                        assignedWorkouts: createTestWorkouts()
                    },
                    {
                        name: muscleGroups[utility.randomNumber(0, muscleGroups.length -1)],
                        assignedWorkouts: createTestWorkouts()
                    }
                ],
                pasNumber: i + 1,
            }
            trainingPases.push(trainingPas);  
        }

        const trainingStats = {
            trainingPases: trainingPases
        }

        // Create food data
        const eatTimes = ["Morgenmad", "Mellemmåltid", "Frokost", "post-workout", "Aftensmad"];
        const foods = ["Nutella", "Smør", "Banan", "Blomme", "Mandler", "Mango", "Burger", "Sunde pommes frites", "Chips"];

        let meals = [];

        for(let i = 0; i < 5; i++) {
            const meal = {
                id: i,
                meal: eatTimes[i],
                name: foods[utility.randomNumber(0, foods.length -1, 0)],
                description: "beskrivelse..",
                calories: utility.randomNumber(100, 500, 0),
                carbohydrates: utility.randomNumber(0, 30),
                fat: utility.randomNumber(0, 30),
                protein: utility.randomNumber(0, 30)
            }
            meals.push(meal);
        }

        let totalCalories = 0;
        let totalCarbohydrates = 0;
        let totalFat = 0;
        let totalProtein = 0;

        meals.forEach((meal) => {
            totalCalories += Number(meal.calories);
            totalCarbohydrates += Number(meal.carbohydrates);
            totalFat += Number(meal.fat);
            totalProtein += Number(meal.protein);
        })

        const mealPlan = {
            totalCalories: totalCalories,
            totalCarbohydrates: totalCarbohydrates,
            totalFat: totalFat,
            totalProtein: totalProtein,
            meals: meals
        };

        const foodStats = {
            totalCalories: utility.randomNumber(1900, 3000, 0),
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
                    date: utility.randomDate(),
                    content: messageData[utility.randomNumber(0, messageData.length -1, 0)]
            }
            messages.push(message);
        }
            
        // Create the actual user from above data
        let newUser = {
            username: usernames[utility.randomNumber(0, usernames.length -1, 0)],
            email: emails[utility.randomNumber(0, emails.length -1, 0)],
            password: password,
            avatarURL: avatarURL,
            weightStats: weightStats,
            trainingStats: trainingStats,
            foodStats: foodStats,
            messages: messages
        }
    

        createNewUser(newUser, User);
        
        if(i === 0) {
            User.findOneAndUpdate({ username: "1" }, { $set: { 
                trainingStats: newUser.trainingStats,
                weightStats: newUser.weightStats,
                foodStats: newUser.foodStats
            } }, { new: true }, function(err, doc) {
                // console.log(doc);
            });
        }
    }
}

// Helper function because too many nested objects and arrays in trainingStats
function createTestWorkouts() {
    const exercises = ["squats", "bænkpres", "dødløft", "biceps curls", "skulder pres", "mavebøjninger"];
    
    let assignedWorkouts = [];
    for(let i = 0; i < 5; i++){
        const workOut = 
            {
                name: exercises[utility.randomNumber(0, exercises.length -1, 0)],
                sæt: utility.randomNumber(3, 5, 0),
                reps: utility.randomNumber(10, 20, 0),
                startWorkLoad: utility.randomNumber(10, 30, 0),
                currentWorkLoad: utility.randomNumber(25, 40, 0),
                WorkLoadProgress: utility.randomNumber(1, 5, 0),
                workLoad: utility.randomNumber(10, 30, 0)
            }
        assignedWorkouts.push(workOut);
    }
    return assignedWorkouts;
}

module.exports = {
    createNewUser,
    testData,
    updateWeight
};