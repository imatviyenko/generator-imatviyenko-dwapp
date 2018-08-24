const getNamespace = require('cls-hooked').getNamespace;
const crypto = require('crypto');


const sessionIdHashMiddleware = (req, res, next) => {
  const sessionId = req.sessionID;
  if (sessionId) {
    const sessionIdHash = crypto.createHash('sha256').update(sessionId).digest('hex');
    req.sessionIdHash = sessionIdHash;
    const requestContext = getNamespace('requestContext');
    if (requestContext) {
      requestContext.set('sessionIdHash', sessionIdHash);
    };
  };

  return next();
}

module.exports = sessionIdHashMiddleware;