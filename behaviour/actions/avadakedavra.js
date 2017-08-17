/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const async = require('async');
const roles = require('../../configurations/roles');
let dragon = false;
let confirmations = 0;
let previous = {};
previous.previousMentions = [];
previous.previousThread = "";
previous.previousMaster = "";
function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("avadakedavra") ||
    (confirmations > 0 && event.threadID === previous.previousThread && event.senderID === previous.previousMaster));
}

function execution (event, bot, callback) {
  roles.isRole("admin", event.senderID, function (err, res) {
    if (err) {
      return console.error(err);
    }
    if (!res || res === false) {
      bot.sendMessage("Dobby... dobby ne peut pas accepter ça !", event.threadID);
      bot.removeUserFromGroup(event.senderID, event.threadID, function (err) {
        if (err) return callback(err);
        return callback();
      })
    } else if (res === true) {
      executeAdmin(event, bot, callback);
    }
  });
}

function executeAdmin(event, bot, callback) {
  if (event.mentions) {
    bot.sendMessage({
      body:"Avada kedavra !",
      url: "https://media.giphy.com/media/JAbAmpu1TshlS/giphy.gif"
    }, event.threadID);
    killAll(event.senderID,event.mentions, event.threadID, bot, function(err) {
      if (event.mentions.length > 2) {
        bot.sendMessage({
          body: "Tant de monde...",
          url: "https://media.giphy.com/media/6jemHpKLDe27C/giphy.gif"
        }, event.threadID)
      }
      let timer = 10*1000;
      let tmp = parseInt(event.body.split(" ")[1]);
      if (Number.isInteger(tmp)) {
        timer = tmp * 1000;
        console.log(timer);
        console.log();
        console.log();
        console.log();
      }
      setTimeout(() => {
        addAll(event.mentions, event.threadID, bot, function(err) {
          if (err) {
            return callback(err);
          }
        });
        setTimeout(() => {
          bot.sendMessage({
            body: "Dobby is watching you ",
            url: "https://media.giphy.com/media/gF9RwnaklCRLG/giphy.gif"
          }, event.threadID)
        }, 1000)
      }, timer)
    })
  }
}

function killAll(senderID, users, threadID, bot, callback) {
  async.each(users, (user, cb) =>  {
    roles.isRole("admin", user.userID, function (err, res) {
      if (res && res=== true) {
        bot.sendMessage({
          body: "Protego maxima !!",
          url: "https://media.giphy.com/media/tyNVhFPBVApLG/giphy.gif"
        }, threadID);
        bot.removeUserFromGroup(senderID, threadID, function (err) {
          if (err) return callback(err);
          cb();
        })
      } else {
        bot.removeUserFromGroup(user.userID, threadID, function (err) {
          if (err) return callback(err);
          cb();
        })
      }
    });
  }, function (err) {
    if (err) {
      return callback(err);
    }
    callback();
  })
}

function addAll(users, threadID, bot, callback) {
  async.each(users, (user, cb) =>  {
    bot.addUserToGroup(user.userID, threadID, function (err) {
      if (err) return callback(err);
      cb();
    })
  }, function (err) {
    if (err) {
      return callback(err);
    }
    callback();
  })
}
module.exports = {
  name: "avadakedavra",
  description: "avadakedavra [tempsEnSecondes] @Mention",
  isAccepted: condition,
  execute: execution
};
