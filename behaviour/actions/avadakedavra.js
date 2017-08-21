/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const dateUtil = require('../../utils/dateUtil');
const winston = require('winston');
const async = require('async');
const roles = require('../../configurations/roles');
let dragon = false;
let confirmations = 0;
let previous = {};
previous.previousMentions = [];
previous.previousThread = "";
previous.previousMaster = "";
let lastMessageDate;
let protego = 0;

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("avadakedavra") || isProtegoState() && formatUtil.formatSentence(event.body).includes("protego"));
}

function isProtegoState() {
  return protego > 0;
}
function execution (event, bot, callback) {
  if (isProtegoState() && formatUtil.formatSentence(event.body).includes("protego")) {
    protego = 2;
  } else {
      executeOthers(event, bot, callback)
  }
}

function executeOthers(event, bot, callback) {
  protego = 1;
  setTimeout(() => {
    if (protego === 2) {
      protegoMaxima();
    } else {
      protego = 0;
      avadakedavra(event,bot, callback);
    }
  }, 4000);
}
function avadakedavra(event, bot, callback) {
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
        bot.protego(senderID, threadID, function (err) {
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

function protegoMaxima(senderID, threadID, callback) {
  bot.sendMessage({
    body: "Protego maxima !!",
    url: "https://media.giphy.com/media/tyNVhFPBVApLG/giphy.gif"
  }, threadID);
  bot.removeUserFromGroup(senderID, threadID, function (err) {
    if (err) return callback(err);
  })
}

module.exports = {
  name: "avadakedavra",
  description: "avadakedavra [tempsEnSecondes] @Mention",
  isAccepted: condition,
  execute: execution
};
