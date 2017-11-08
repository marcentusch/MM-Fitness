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
                pasNumber: String,
                assignedWorkouts: [
                    {
                        name: String,
                        category: String,
                        reps: String,
                        startWorkLoad: String,
                        currentWorkLoad: String,
                        WorkLoadProgress: String,
                        workLoad: String
                    }                
                ]
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