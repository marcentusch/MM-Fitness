
module.exports = {
    getWorkout,
    createNewWorkout,
    getWorkouts,
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