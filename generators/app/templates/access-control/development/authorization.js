const appLogger = require('../../logging/appLogger')(module);
const createError = require('http-errors');

// https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff
const authorization = (...roles) => {
    
    const isAuthorized = (userRoles) => {
        appLogger.silly('isAuthorized invoked');
        appLogger.silly('userRoles:', {data: {userRoles}});
            
        let result = false;
        userRoles.some(userRole => {
            if (roles.indexOf(userRole) > -1) {
                result = true;
                return true;
            }
        });
        return result;
    }

    // return a middleware
    return (req, res, next) => {
      if (req.user && isAuthorized(req.user.roles))
        return next(); // role is allowed, so continue on the next middleware
      else {
        appLogger.warn('User is not authorized');
        return next(createError(401));
      }
  }
}

module.exports = authorization;