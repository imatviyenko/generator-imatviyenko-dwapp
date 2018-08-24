const appLogger = require('../../logging/appLogger')(module);
const config = require('../../config/config.js');

const session = require('express-session');

const init = app => {
    appLogger.debug('Initializing development mode session middleware with default in-memory store');

    const sessionMiddleware = session({ 
        secret: config.secrets.sessionIdHmacSecret,
        saveUninitialized: true,
        resave: false,
        cookie: { 
            secure: true,
            httpOnly: true,
            sameSite: true,
            maxAge: Number(config.session.cookieTtl)
        }
    });
    
    app.use(sessionMiddleware);
}

module.exports = init;