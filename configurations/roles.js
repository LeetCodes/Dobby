/**
 * Created by A663945 on 04/07/2017.
 */
const async = require('async');
const winston = require('winston');
let mod = {};
let roles = {};
roles.admin = ['1520977847', '100001912452336', '100019110005550', '1561104666'];
roles.moderator = [];
roles.newb = [];

roles.isRole = (role, id, cb) => {
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
        return cb(null, false)
      }
    })
  }
}

roles.getRole = (id, cb) => {
  isRole("admin", id, (res) => {
    if (res === true) {
      return cb(null, "admin");
    } else {
      isRole("moderator", id, (resModerator) => {
        if (resModerator === true) {
          return cb(null, "moderator");
        } else {
          return cb(null, "nothing");
        }
      })
    }
  })
}

module.exports = roles;
