const moment = require('moment');
const utility = require('./utility.js');

module.exports = {
    createNewUser,
    findUser,
    randomUser,
    updateWeight
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

// Find specific user using e-mail
function findUser(_id, User){
    return User.findById({_id: _id});
}

function updateWeight(weight, userId, User){
    User.findById(userId, function (err, user) {
        if (err) {
            throw(err);
        } 
        user.weightStats.currentWeight = weight;

        const newWeight = {
            date: moment(),
            weight: weight
        };
        user.weightStats.allWeights.push(newWeight);
        user.save(function (err, updatedUser) {
            if (err){
                throw(err); 
            } 
            return updatedUser;
        });
    });
}

// Function to make a random user
function randomUser(User, amount) {
    
    // Delete everything we have in database
    User.remove({}, (err, user) => {
        if(err){
            console.log(err)
        }
    });

    // Make "amount" of users
    for(let i = 0; i < amount; i++){

        // User meta data
        const names = ["Jens", "Brian", "Søren", "Ole", "Denise", "Maibrit", "Marc", "Jonas"];
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
            weightProgress: null,
            allWeights: weights
        }
        
        weightStats.weightProgress = weightStats.startWeight - weightStats.currentWeight;


        // Create exercise data
        const exercises = ["squats", "bænkpres", "dødløft", "biceps curls", "skulder pres", "mavebøjninger"];

        let trainingPases =[];
        for(let i = 0; i < 3; i++) {
            let assignedWorkouts = [];
            for(let i = 0; i < 5; i++){
                const workOuts = 
                    {
                        name: exercises[utility.randomNumber(0, exercises.length -1, 0)],
                        reps: utility.randomNumber(6, 20, 0),
                        startWorkLoad: utility.randomNumber(10, 30, 0),
                        currentWorkLoad: utility.randomNumber(25, 40, 0),
                        WorkLoadProgress: utility.randomNumber(1, 5, 0),
                        workLoad: utility.randomNumber(10, 30, 0)
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
        const user = {
            name: names[utility.randomNumber(0, names.length -1, 0)],
            email: emails[utility.randomNumber(0, emails.length -1, 0)],
            password: password,
            avatarURL: avatarURL,
            weightStats: weightStats,
            trainingStats: trainingStats,
            foodStats: foodStats,
            messages: messages
        }

        //console.log(JSON.stringify(user, null, 3));
        createNewUser(user, User);
    }
}