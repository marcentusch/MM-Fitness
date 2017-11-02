module.exports =
{
    id: String,
    name: String,
    email: String,
    password: String,
    avatarURL: String,
    weightStats: {
        currentWeight: String,
        startWeight: String,
        weightProgress: String,
        allWeights: [
            {
                date: String,
                weight: String
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