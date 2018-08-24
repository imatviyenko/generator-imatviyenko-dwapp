const appLogger = require('../../logging/appLogger')(module);
const Item = require('../models/Item');

const express = require('express');
const router = express.Router();
const csurfProtection = require('csurf')();
const serializeError = require('serialize-error');


/* GET home page. */
/* csurf middleware is used to generate CSRF protection token, save it in the user session and add it to the req object for the use in views */
router.get('/', csurfProtection, function(req, res, next) {
  appLogger.debug('/ GET handler invoked');

  const sessionData = req.session.data || (req.session.data = {}); 
  Item.getAll(sessionData)
    .then( items => {
      const props = {
        title: '<%= projectName %>', 
        userInfo: req.user, 
        items: items, 
        csrfToken: req.csrfToken()
      };
      res.render('home', props);
    })
    .catch ( error => {
      appLogger.error('Error calling Item.getAll:', {data: {error: serializeError(error)}});
      return next(error);
    });
 
});


/* POST to /item - create a new fake item and redirect with GET to the home page / */
/* csurf middleware is used to check that the body of the posted form of one of the predefined headers contain a valid CSRF token */
<% if (authenticationScheme === 'saml') { %>
const accessControlProvider = require('../../access-control');
/* this route can be executed only by members of the 'user' role */
router.post('/item', csurfProtection, accessControlProvider.authorization('user'), function(req, res, next) {
<% } else { %>
router.post('/item', csurfProtection, function(req, res, next) {  
<% } %>  
  appLogger.debug('/item POST handler invoked');

  const item = {
    title: req.body.txtTitle
  };
  const sessionData = req.session.data || (req.session.data = {}); 
  Item.add(sessionData, item)
    .then( () => res.redirect("/") )
    .catch ( error => {
      appLogger.error('Error calling Item.add:', {data: {error: serializeError(error)}});
      return next(error);
    });

});

/* DELETE to /item - delete the item with the specified Id and redirect with GET to the home page / */
/* csurf middleware is used to check that the body of the posted form of one of the predefined headers contain a valid CSRF token */
<% if (authenticationScheme === 'saml') { %>
/* this route can be executed only by members of the 'admin' role */
router.delete('/item', csurfProtection, accessControlProvider.authorization('admin'), function(req, res, next) {
<% } else { %>
router.delete('/item', csurfProtection, function(req, res, next) {
<% } %>
  appLogger.debug('/item DELETE handler invoked');

  const itemId = Number(req.body.txtItemId);
  const sessionData = req.session.data
  if (!sessionData) {
    appLogger.error('Error getting data from session');
    return next(createError(500, 'Error getting data from session'));
  };
  
  Item.remove(sessionData, itemId)
    .then( () => {
      return res.status(200).json({status:"ok"})
    })
    .catch ( error => {
      appLogger.error('Error calling Item.remove:', {data: {error: serializeError(error)}});
      return next(error);
    });

});


module.exports = router;
