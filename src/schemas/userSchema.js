module.exports =
{
    isAdmin: Boolean,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    street: String,
    houseNumber: String,
    zipcode: Number,
    town: String,
    phone: String,
    avatarURL: String,
    weightStats: {
        currentWeight: Number,
        startWeight: Number,
        weightProgress: Number,
        targetWeight: Number,
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
                                saet: String,
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