// exports and module.exports is same

exports.getDate = function () {

    const date = new Date();

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };

    return dateToday = date.toLocaleDateString('en-US', options);
}

exports.getDay = function () {

    const date = new Date();

    const options = {
        weekday: 'long',
    };

    return day = date.toLocaleDateString('en-US', options);
}