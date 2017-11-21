const moment = require('moment'),
utility      = require('./utility.js');

module.exports = {
    createNewUser,
    testData,
    updateWeight
};

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
            date: moment().format("DD/MM/YY"),
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
            targetWeight: utility.randomNumber(50, 100, 1),
            weightProgress: 0,
            allWeights: weights
        }
        
        weightStats.weightProgress = weightStats.startWeight - weightStats.currentWeight;


        // Create exercise data
        const muscleGroups = ["ben", "ryg", "biceps", "mave", "skulder", "bryst", "triceps"];

        let trainingPases =[];
        for(let i = 0; i < 3; i++) {
            let trainingPas = {
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
        const foods = ["Havregryn", "Rugbrød"];
        const details = ["Easis müsli 140g", "to styk"];

        let meals = [];

        for(let i = 0; i < 5; i++) {
            const meal = {
                id: i,
                isChecked: false,
                meal: eatTimes[i],
                name: foods[utility.randomNumber(0, foods.length -1, 0)],
                details: details[utility.randomNumber(0, details.length -1, 0)],
                description: "Husk og mos bananen",
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
            caloriesToday: totalCalories,
            totalCalories: totalCalories,
            totalCarbohydrates: totalCarbohydrates,
            totalFat: totalFat,
            totalProtein: totalProtein,
            meals: meals
        };

        const foodStats = {
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
            "Godmorgen chef",
            "Hvor ser du godt ud i dag, har du trænet?",
            "Husk vitaminpiller, det er godt for leveren",
            ";-) ;-* kys tihi f9ser"
        ];

        const trueOrFalse = [true, false];

        const messages = [];

        for(let i = 0; i < 5; i++) {
            const message = {
                    date: utility.randomDate(),
                    message: messageData[utility.randomNumber(0, messageData.length -1, 0)],
                    fromUser: trueOrFalse[utility.randomNumber(0,1,0)]
            }
            messages.push(message);
        }
        //news
        const titles = ["Nyt træningsprogram!", "Fedt event i weekenden", "Husk proteinpulver efter træning", "Husk gains", "Jeg har lige spist aftensmad!"];
        const subdivision = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla hendrerit arcu sed fermentum tristique. Mauris fermentum vestibulum neque quis suscipit. Praesent non aliquam nibh. Integer consequat orci eget nunc consequat commodo. Mauris felis ipsum, interdum eget tristique sit amet, ornare sit amet tellus. Aenean non facilisis metus. Donec quis condimentum ante. Mauris nec dignissim ex, laoreet lobortis nunc. Pellentesque iaculis condimentum placerat. Aenean placerat lectus non lectus sollicitudin vestibulum.";
        const imageUrl = "https://www.organicfacts.net/wp-content/uploads/2013/05/Vegetables4.jpg";
        const link = "http://www.google.dk";
        const linkText = "Google";
        
        const newsList = [];

        for(let i = 0; i < 5; i++){
            const news =
            {
                title: titles[utility.randomNumber(0, titles.length -1, 0)],
                subdivision: subdivision,
                content: content,
                imageUrl: imageUrl,
                link: link,
                linkText: linkText,
                date: utility.randomDate()
            }
            newsList.push(news);
        }

        // User meta data
        const firstNames = ["Jens", "Brian", "Søren", "Ole", "Denise", "Maibrit", "Marc", "Jonas"];
        const lastNames = ["Pedersen", "Hansen", "Jensen", "Mogensen", "Erhardtsen", "Sørensen", "Bolvig", "Larmann"];
        const usernames = ["foo@bar.dk", "test@test.dk"];
        const password = "12345";
        const avatarURL = "http://www.qygjxz.com/data/out/190/5691490-profile-pictures.png";
        
        // Create the actual user from above data

        let newUser = {
            username: usernames[utility.randomNumber(0, usernames.length -1, 0)],
            firstName: firstNames[utility.randomNumber(0, firstNames.length -1, 0)],
            lastName: lastNames[utility.randomNumber(0, lastNames.length -1, 0)],
            password: password,
            street: "genvej",
            houseNumber: "1",
            zipcode: 2860,
            town: "Søborg",
            phone: "88888888 ",
            avatarURL: avatarURL,
            weightStats: weightStats,
            trainingStats: trainingStats,
            foodStats: foodStats,
            messages: messages,
            news: newsList
        }
    

        createNewUser(newUser, User);
        
        if(i === 0) {
            User.findOneAndUpdate({ username: "1" }, { $set: { 
                isAdmin: true,
                firstName: "Tester",
                lastName: "McTestersen",
                trainingStats: newUser.trainingStats,
                weightStats: newUser.weightStats,
                foodStats: newUser.foodStats,
                messages: newUser.messages,
                news: newUser.news
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
                saet: utility.randomNumber(3, 5, 0),
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

