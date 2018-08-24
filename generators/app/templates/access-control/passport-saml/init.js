const appLogger = require('../../logging/appLogger')(module);
const config = require('../../config/config.js');
const User = require('./User');

const passport = require('passport');
const wsfedsaml2 = require('passport-wsfed-saml2').Strategy;

let wsfedsaml2Strategy = new wsfedsaml2(
  {
    realm: config.saml.realm,
    identityProviderUrl: config.saml.identityProviderUrl,
    thumbprint: config.saml.thumbprint
  },
  function(profile, done) {
    appLogger.silly('wsfedsaml2.function(profile, done) callback invoked');
    appLogger.silly('profile', {data: {profile}});
    return done(null, new User(profile));
  }
);

passport.use('wsfed-saml2', wsfedsaml2Strategy);

passport.serializeUser(function(user, done) {
  appLogger.debug('passport.serializeUser callback invoked');
  appLogger.debug('user:', {data: {user}});
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  appLogger.debug('passport.deserializeUser callback invoked');
  appLogger.debug('user:', {data: {user}});
  done(null, user);
});


const init = app => {
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Login routes
    app.get('/login', passport.authenticate('wsfed-saml2'));
    
    app.post('/login/callback', passport.authenticate('wsfed-saml2'), // DO NOT use csurf middleware for this route!
        function(req, res) {
            appLogger.silly('/login/callback passport.authenticate callback invoked');
            res.redirect('/');
        }
    );
}

module.exports = init;
