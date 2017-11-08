module.exports =
{
    username: String,
    email: String,
    password: String,
    avatarURL: String,
    weightStats: {
        currentWeight: Number,
        startWeight: Number,
        weightProgress: Number,
        allWeights: [
            {
                date: String,
                weight: Number
            }
        ]
    },
    trainingStats: {
        trainingPases:[
            {
                _id: false,                
                muscleGroups: [
                    {
                        _id: false,
                        name: String,
                        assignedWorkouts: [
                            {
                                name: String,
                                sæt: String,
                                reps: String,
                                startWorkLoad: String,
                                currentWorkLoad: String,
                                WorkLoadProgress: String,
                                workLoad: String
                            }                
                        ]
                    }
                ],
                pasNumber: String,
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
};