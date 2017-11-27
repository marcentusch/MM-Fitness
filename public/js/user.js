function toggleEdit(id) {
    $("#edit" + id).toggle();
}

function toggleEditClass(id) {
    $(".edit" + id).toggle();
}

function toggleEditButtons(pasNumber) {
    $(".editButtons" + pasNumber).toggle();
    console.log("FROM TOGGLE FUNCITON", document.cookie);
    document.cookie = pasNumber;

};