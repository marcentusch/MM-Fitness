module.exports = {
    findNextMeal,
    meals:  ["morgenmad", "hovedmåltid", "snack", "pre-workout", "post-workout", "natmad"]
}

function findNextMeal(mealList) {
    let nextMeal = {};
    for(let i = 0; i < mealList.length; i++){
        if(mealList[i].isChecked === false){
            nextMeal = mealList[i];
            break;
        } else {
            nextMeal = {};
        }
    }
    return nextMeal;
}

// Vi skal lave funktioner som skal opdatere, oprette og slette måltider. 
// Selvom de ikke virker skal de være der da vi nok har planlagt i modeller og planlægning af program