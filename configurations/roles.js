/**
 * Created by A663945 on 04/07/2017.
 */
const async = require('async');
const winston = require('winston');
let roles = {};
roles.admin = ['1520977847', '100001912452336'];
roles.moderator = [];

roles.isRole = function(role, id, cb) {
  if (roles[role]) {
    return async.each(roles[role], function (item, callback) {
      if (item === id) {
        callback(true)
      } else {
        callback(false);
      }
    }, function(ret) {
      if (ret === true) {
        winston.info("User {} is {}", id, role);
        return cb(null, ret);
      } else {
        winston.info("User {} is not {}", id, role);
      }
    })
  }
}

module.exports = roles;
