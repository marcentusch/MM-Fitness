let workouts = require("../data/workouts.json");

module.exports = {
    createNewWorkout
}

/* function getWorkout(name){
    let workoutIndex = workouts.indexOf(name);
    let newWorkout;
    workouts.forEach((workout) => {
        if(workout.name === name){
            newWorkout = workout;
        }
    });
    return newWorkout;
} */


function createNewWorkout(Workout, workout){
    Workout.create({
        name: workout,
        description: "Gør noget",
        videoUrl: "www.google.com"
    }),
    function(err, newWorkout){
        if(err){
            console.log(err);
        } else{
            console.log("Workout created: " + newWorkout);
            return newWorkout;
        }
    }
}