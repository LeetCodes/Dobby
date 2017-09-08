/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */
'use strict';

const passport = require('passport');
const log = require('../loggers/winston-logger');
/**
 * Session
 * returns info on authenticated user
 */
exports.session = function (req, res) {
  res.json(req.user.user_info);
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
  if(req.user) {
    req.logout();
    res.send(200);
  } else {
    res.status(400).send("Not logged in");
  }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    const error = err || info;
    if (error) {
      log.error(error);
      return res.json(400, error);
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.send(err);
      }
      res.json(req.user.user_info);
    });
  })(req, res, next);
};
