var express = require('express');
var router = express.Router();
var auth = require('../core/authentication.js');
const { checkSchema, validationResult } = require('express-validator/check');
var validators = require('../core/validators.js');
var passport = require('passport');

/**
 * JWT provider for the service. Requires { username: string_value, password: string_value }
 * as input. If valid, returns an object containing a JWT in the "token" field. Returns 401 
 * Unauthorized if provided credentials are invalid. Require an email address by modifying 
 * validators.js/userSchema.
 */
router.post('/signin', checkSchema(validators.userSchema), function(req, res, next) {

  var errors = validationResult(req).formatWith(({ location, msg, param, value, nestedErrors }) => {
      //Validation package will echo inputs by default when validation fails. Because we're dealing with authentication,
      //create a custom formatter so that the values (such as a password) aren't sent back to the user.
      return { "param": param, "msg": msg };
  });

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var authentication = new auth.authentication();

  authentication.signIn(req.body.username, req.body.password, (jwt) => {
    return res.status(200).json({ token: jwt });
  }, () => {
    //For security purposes, don't tell the user whether the username or password was incorrect.
    return res.status(403).json({ errors: ["Invalid username or password"] });
  });


});

/**
 * Signs out. No inputs required. Requires authenticated user.
 */
router.post("/signout", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  var authentication = new auth.authentication();
  //Sign out based on the user id passed in the JWT.
  authentication.signOut(req.user.userId);
  return res.sendStatus(200);
});

module.exports = router;
