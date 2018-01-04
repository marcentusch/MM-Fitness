
module.exports = {
    getWorkout,
    getWorkouts,
    addTrainingPas,
    addMuscleGroup,
    createNewWorkout,
    muscleGroups: ["ben", "ryg", "biceps", "core", "skulder", "bryst", "triceps"]
}

function getWorkouts(Workout, callback){
    Workout.find({}, (err, workouts) => {
        callback(workouts);
    });
}


function getWorkout(Workout, workoutName, callback) {
    try {
        Workout.findOne({name: workoutName}, (err, workoutFromDb) => {
            callback(workoutFromDb);
        });
    } catch (err) {
        throw(err);
    }
}

function addTrainingPas(User, userId, callback) {
    const newPas = {
        pasNumber: '',
        muscleGroups: []
    }

    User.findById(userId, (err, user) => {
        if (err) {
            throw(err);
        } 
        newPas.pasNumber = user.trainingStats.trainingPases.length + 1;
        user.trainingStats.trainingPases.push(newPas);
        user.lastEdit = moment().format("DD/MM - HH:mm");
        
        user.save((err, updatedUser) => {
            if (err){
                throw(err); 
            } 
            callback("Pas created")
        });
    });
};

function addMuscleGroup(User, userId, pas, muscleGroup, callback) {

    const newMuscleGroup = {
        name: muscleGroup,
        assignedWorkouts: []
    }

    User.findById(userId, (err, user) => {
        if (err) {
            throw(err);
        } 
        user.trainingStats.trainingPases[pas -1].muscleGroups.push(newMuscleGroup);
        user.lastEdit = moment().format("DD/MM - HH:mm");
        
        user.save((err, updatedUser) => {
            if (err){
                throw(err); 
            } 
            callback("Musclegroup added")
        });
    });

}



function createNewWorkout(Workout, workout){
    Workout.create({
        name: workout,
        description: "Gør noget",
        videoUrl: "www.google.com"
    }),
    function(err, newWorkout){
        if(err){
            throw(err);
        } else{
            return newWorkout;
        }
    }
}