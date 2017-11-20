function toggleEdit(id) {
    $("#edit" + id).toggle();
}
function toggleEditButtons(pasNumber) {
    $(".editButtons" + pasNumber).toggle();
};

function updateWorkout(trainingPas, muscleGroup, workoutName, workoutId) {
    $.ajax({
    type: 'POST',
    url: $("form").attr("action"),
    data: {
        trainingPas: trainingPas,
        muscleGroup: muscleGroup,
        workoutName: workoutName,
        formData: $("#form" + workoutId).serialize()
    }, 
    success: function(response) { 
        $("#name" + workoutId).text(response.newWorkoutName);
        $("#reps" + workoutId).text(response.newWorkoutReps + " gentagelser");
        $("#saet" + workoutId).text(response.newWorkoutSaet + " sæt af");
        $("#edit" + workoutId).hide();


        },
    });
    $("#form" + workoutId).find("input").val("");
}

function deleteWorkout(trainingPas, muscleGroup, workoutName, workoutId) {
    $.ajax({
    type: 'POST',
    url: '<%=user._id%>/delete/workout',
    data: {
        trainingPas: trainingPas,
        muscleGroup: muscleGroup,
        workoutName: workoutName,
    }, 
    success: function(response) { 
        $("#noEdit" + workoutId).remove();
        $("#edit" + workoutId).remove();
        },
    });
}

function createWorkout(trainingPas, muscleGroup, muscleGroupId) {
    $.ajax({
    type: 'POST',
    url: '<%=user._id%>/create/workout',
    data: {
        trainingPas: trainingPas,
        muscleGroupId: muscleGroup,
        formData: $("#createExc" + muscleGroupId).serialize()
    }, 
    success: function(response) { 
        location.reload();
        }
    });
}

function createMuscleGroup(trainingPas) {
    $.ajax({
    type: 'POST',
    url: $("#muscleGroup" + trainingPas).attr("action"),
    data: {
        trainingPas: trainingPas,
        formData: $("#muscleGroup" + trainingPas).serialize()
    }, 
    success: function(response) { 
        location.reload();
        }
    });
}