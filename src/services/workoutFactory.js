
module.exports = {
    createNewWorkout,
    muscleGroups: ["ben", "ryg", "biceps", "core", "skulder", "bryst", "triceps"]
}



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
            return newWorkout;
        }
    }
}