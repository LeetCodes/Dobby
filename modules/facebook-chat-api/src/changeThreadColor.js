"use strict";

let utils = require("../utils");
let log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function changeThreadColor(color, threadID, userID, callback) {
    if(!callback) {
      callback = function() {};
    }
    let form = {
      'color_choice' : "#105B63",
      'thread_or_other_fbid' : threadID,
      '__user' : userID
    };

    defaultFuncs
      .post("https://www.messenger.com/messaging/save_thread_color/?source=thread_settings&dpr=1", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error === 1357031) {
          throw {error: "Trying to change colors of a chat that doesn't exist. Have at least one message in the thread before trying to change the colors."};
        }
        if (resData.error) {
          console.error(resData.error);
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("changeThreadColor", err);
        return callback(err);
      });
  };
};
