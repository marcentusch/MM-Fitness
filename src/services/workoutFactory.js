
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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend felis ex, iaculis feugiat lectus placerat ac. Morbi erat justo, volutpat eu molestie ac, mattis eget nisl. Phasellus interdum id leo at egestas. Nam hendrerit massa sed risus tincidunt ullamcorper. Ut ex turpis, vestibulum et maximus eu, viverra eu dui. Donec ullamcorper eleifend fringilla. Aliquam rhoncus, eros eu ultricies tincidunt, ligula eros tincidunt tortor, venenatis mattis dolor sem in nisi. Proin pharetra a metus vel porta. Suspendisse at urna nunc. Mauris vehicula facilisis ultricies. Vivamus libero quam, sollicitudin vitae egestas at, porta non libero. Curabitur augue nulla, cursus et tempor non, faucibus nec purus. Sed vitae ipsum feugiat, varius felis vitae, fringilla diam. Curabitur eget malesuada ligula. Aliquam ac enim justo.",
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