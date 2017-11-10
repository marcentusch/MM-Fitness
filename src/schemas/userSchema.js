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
                pasNumber: String,
                day: String,
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
            }
        ]
    },
    foodStats: {
        mealPlan: {
            caloriesToday: Number,
            totalCalories: Number,
            totalCarbohydrates: Number,
            totalFat: Number,
            totalProtein: Number,
            meals: [
                {
                    id: String,
                    meal: String,
                    name: String,
                    description: String,
                    calories: Number,
                    carbohydrates: Number,
                    fat: Number,
                    protein: Number
                }
            ],
        }
    },
    messages: [ 
        {
            date: String,
            content: String
        }
    ]
};