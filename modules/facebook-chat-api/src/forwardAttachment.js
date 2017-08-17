"use strict";

let utils = require("../utils");
let log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function forwardAttachment(attachmentID, userOrUsers, callback) {
    if (!callback) {
      callback = function() {};
    }

    let form = {
      attachment_id: attachmentID,
    };

    if(utils.getType(userOrUsers) !== "Array") {
      userOrUsers = [userOrUsers];
    }

    let timestamp = Math.floor(Date.now() / 1000);

    for (let i = 0; i < userOrUsers.length; i++) {
      //That's good, the key of the array is really timestmap in seconds + index
      //Probably time when the attachment will be sent?
      form['recipient_map[' + (timestamp + i) + ']'] = userOrUsers[i];
    }

    defaultFuncs
      .post("https://www.messenger.com/mercury/attachments/forward/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback(null);
      })
      .catch(function(err) {
        log.error("forwardAttachment", err);
        return callback(err);
      });
  };
};
