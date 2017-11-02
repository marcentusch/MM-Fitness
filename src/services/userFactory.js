module.exports = {
    createNewUser,
    findUser
};

function createNewUser(user, User){
    User.create(user),
    function(err, newUser){
        if(err){
            console.log(err);
        }else{
            console.log("User created: " + newUser);
            return newUser;
        }
    }
}


function findUser(email, User){
    return User.findOne({email: email});
}

    

// Create a user
/* User.create({name: 'Johnny', email: 'johnny@johnny.dk'}, function(err, user){
    if(err){
        console.log(err);
    }
    console.log(user);
}); */

