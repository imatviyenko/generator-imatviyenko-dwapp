const environment = process.env.NODE_ENV || 'development';
let accessControlProvider;

<% if (authenticationScheme === 'saml') { %>
if (environment === 'production') {
    accessControlProvider = require('./passport-saml');
} else {
    accessControlProvider = require('./development');
};
<% } else { %>
    accessControlProvider = require('./development');    
<% } %>    

module.exports = accessControlProvider;