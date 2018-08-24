const User = require('./User');

function authentication(req, res, next) {
    req.user = new User();
    return next();
}

module.exports =  authentication;