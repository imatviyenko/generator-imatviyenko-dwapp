const appLogger = require('../../logging/appLogger')(module);
const config = require('../../config/config.js');

const redis = require('redis');
const session = require('express-session');

const init = app => {
    appLogger.debug('Initializing production mode session middleware with Redis store (Redis as a swarm service)');

    const RedisStore = require('connect-redis')(session);

    // Monkey patch redis client module to make it play well with cls-hooked
    const patchRedis = require('./patchRedis');
    patchRedis('requestContext');

    const redisOptions = {
        host: config.swarmRedis.host,   // Redis host
        port: config.swarmRedis.port,          // Redis port
        no_ready_check: true,
        ttl: config.swarmRedis.ttl
    };
    const redisClient = redis.createClient(redisOptions);

    const redisSessionStore = new RedisStore({ 
        host: config.swarmRedis.host, 
        port: config.swarmRedis.port,
        logErrors: true,
        client: redisClient
    });

    const sessionMiddleware = session({ 
        secret: config.secrets.sessionIdHmacSecret,
        saveUninitialized: true,
        resave: false,
        store: redisSessionStore,
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