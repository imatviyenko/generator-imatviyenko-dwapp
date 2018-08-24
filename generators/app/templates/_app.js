const appLogger = require('./logging/appLogger')(module);
const httpLogger = require('./logging/httpLogger');
const correlator = require('./logging/correlator');

const environment = process.env.NODE_ENV || 'development';

const createError = require('http-errors');
const serializeError = require('serialize-error');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

var app = express();

app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'pug');

// Give Views/Layouts access to moment library
const moment = require('moment');
app.use(function(req, res, next){
  res.locals.moment = moment;
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files WITHOUT session retrieval, as this line is BEFORE app.use(session ...
app.use(express.static(path.join(__dirname, 'web/public')));

//parse application/x-www-form-urlencoded body data in the incoming requests
app.use(bodyParser.urlencoded({
	extended: true
}));

//parse application/json body data in the incoming requests
app.use(bodyParser.json());


const sessionProvider = require('./session');
sessionProvider.init(app);


app.use(helmet());
app.use(correlator);
app.use(httpLogger);


const sessionIdHash = require('./logging/sessionIdHash');
app.use(sessionIdHash);  // Generate session id hashes for logging purposes and store them in the session


const mainRooter = require('./web/routes');

<% if (authenticationScheme === 'saml') { %>
const accessControlProvider = require('./access-control');
accessControlProvider.init(app);

// Access to the start page is allowed only for authenticated users
app.use('/', accessControlProvider.authentication, mainRooter); 
<% } else { %>
// Anonymous access enabled
app.use('/', mainRooter);
<% } %>

// if we got to this middleware, then no other middlewares processed the request and therefore we should return '404 Not Found'
app.use(function(req, res, next) {
  appLogger.debug("Default catch all route invoked");
  next(createError(404));
});


// error handler
app.use(function(error, req, res, next) {
  appLogger.error("Error handling middleware invoked", {data: {error: serializeError(error)}});
  
  const correlationId = req.correlationId || '-';
  const sessionIdHash = req.sessionIdHash || '-';

  res.locals.message = error.message;
  res.locals.status = error.status;
  res.locals.stack = (environment === 'production')  ? {}: error.stack;
  res.locals.correlationId = correlationId; 
  res.locals.sessionIdHash = sessionIdHash;

  res.status(error.status || 500);
  res.render('error');

});

module.exports = app;
