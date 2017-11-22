function toggleEdit(id) {
    console.log(id);
    $("#edit" + id).toggle();
}

function toggleEditClass(id) {
    $(".edit" + id).toggle();
}

function toggleEditButtons(pasNumber) {
    $(".editButtons" + pasNumber).toggle();
};