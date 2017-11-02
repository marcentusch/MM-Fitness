const moment = require('moment');

module.exports = {
    randomDate,
    randomNumber
};

// Utility functions
function randomDate() {
    const someDate = randomNumber(1,27) + "-" + randomNumber(1, 12) + "-2017";
    const randomDate = moment(someDate, "D-M-YYYY").format("d/M/YY");
    return randomDate;
};

function randomNumber(min, max, decimals) {
    let randomNumber = Math.random() * (max - min) + min;
    return randomNumber.toFixed(decimals);
};