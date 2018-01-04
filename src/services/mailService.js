const nodemailer = require('nodemailer');

module.exports = {
    sendMail
}


function sendMail(user, env) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'mmfitness.noreply@gmail.com',
            pass: env.adminEmailPass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    let HelperOptions = {
        from: '"MM Fitness" <MMFitness.NoReply@gmail.com>',
        to: user.username,
        subject: 'Velkommen til MM-Fitness',
        text: 'Velkommen ' + user.firstName + " " + user.lastName +  "! \n \nDu er nu medlem af MM-Fitness-applikationen. \n \nVenlig hilsen, \nAdministratoren"
    };
    
    transporter.sendMail(HelperOptions, (error, info) => {
        if(error) {
            console.log(error);
        };
    });

};

