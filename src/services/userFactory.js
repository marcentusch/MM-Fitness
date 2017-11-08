const moment = require('moment');
const utility = require('./utility.js');

module.exports = {
    createNewUser,
    findUser,
    testData,
    updateWeight,
    getMusclegroups
};

// Create new user
function createNewUser(user, User){
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


function findUser(_id, User){
    return User.findById({_id: _id});
}

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

function getMusclegroups(user) {
  /*   let newTrainingPas = [];

    user.trainingStats.trainingPases.forEach((trainingPas) => {
        let newMuscleGroups = [];
        let muscleGroup = {};
        let muscleGroupSearch = trainingPas.assignedWorkouts[0].muscleGroup;
        trainingPas.assignedWorkouts.forEach((workout) => {
            if(workout.muscleGroup === muscleGroupSearch) {
                
            }

        });
    }); */

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
        const exercises = ["squats", "bænkpres", "dødløft", "biceps curls", "skulder pres", "mavebøjninger"];
        const categories = ["ben", "ryg", "arme", "mave"];

        let trainingPases =[];
        for(let i = 0; i < 3; i++) {
            let assignedWorkouts = [];
            for(let i = 0; i < 5; i++){
                const workOut = 
                    {
                        name: exercises[utility.randomNumber(0, exercises.length -1, 0)],
                        category: categories[utility.randomNumber(0, categories.length -1)],
                        reps: utility.randomNumber(6, 20, 0),
                        startWorkLoad: utility.randomNumber(10, 30, 0),
                        currentWorkLoad: utility.randomNumber(25, 40, 0),
                        WorkLoadProgress: utility.randomNumber(1, 5, 0),
                        workLoad: utility.randomNumber(10, 30, 0)
                    }
                assignedWorkouts.push(workOut);
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
                name: foods[utility.randomNumber(0, foods.length -1, 0)],
                description: "beskrivelse..",
                recipe: "put den i ovnen",
                calories: utility.randomNumber(100, 500, 0),
                carbohydrates: utility.randomNumber(0, 30),
                fat: utility.randomNumber(0, 30),
                protein: utility.randomNumber(0, 30)
            }
            mealPlan.push(meal);
        }

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
            User.findOneAndUpdate({ username: "1" }, { $set: { trainingStats: newUser.trainingStats } }, { new: true }, function(err, doc) {
                // console.log(doc);
            });
        }
        /* User.findOne({username: "1"}, (err, user) => {
            if(err) {
                throw err;
            } else {
                user.trainingStats = newUser.trainingStats;
                user.save();
            }  
        }); */
    }
}