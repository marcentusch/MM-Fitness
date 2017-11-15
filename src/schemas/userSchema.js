module.exports =
{
    isAdmin: Boolean,
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
                    isChecked: Boolean,
                    meal: String,
                    name: String,
                    details: String,
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
            message: String,
            fromUser: Boolean
        }
    ],
    news: [
        {
            title: String,
            subdivision: String,
            content: String,
            imageUrl: String,
            link: String,
            linkText: String,
            date: String
        }
    ]
};