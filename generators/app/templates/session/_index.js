const environment = process.env.NODE_ENV || 'development';

let sessionProviderInitFunc;

<% if (sessionStorage === 'swarmRedis') { %>
if (environment === 'production') {
    sessionProviderInitFunc = require('./swarmRedis');
} else {
    sessionProviderInitFunc = require('./development');
};
<% } else { %>
    sessionProviderInitFunc = require('./development');
<% } %>    

module.exports = { 
    init: sessionProviderInitFunc
};
