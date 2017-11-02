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
        assignedWorkouts: [
            {
                name: String,
                reps: String
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