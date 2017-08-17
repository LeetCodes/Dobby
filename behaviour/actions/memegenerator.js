/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const memeBank = require("../../resources/memebank.json");
const winston = require('winston');
const async = require('async');
Array.prototype.containsKey = function(key){
  return this.filter(function(meme){return meme.key === key}).length > 0;
};
function condition (event, cb) {
  async.each(memeBank, function(meme, callback) {
    if (formatUtil.formatSentence(event.body).includes(meme.key)) {
      return cb(null, true);
    }
    callback();
  }, function (err) {
    return cb(null, false);
  });
}

function execution (event, bot, callback) {
  async.each(memeBank, function(meme, cb) {
    if (formatUtil.formatSentence(event.body).includes(meme.key)) {
      console.log("sending message");
      const message = {
        url: meme.msg
      };
      bot.sendMessage(message, event.threadID, function (err, msgInfo) {
        if (err) {
          console.error(err);
          callback(err);
        } else {
          console.log(msgInfo)
        }
      });
    } else {
      cb();
    }

  }, function (res) {
  });
}
module.exports = {
  name: "memegenerator",
  description: "réagit aux appels de memes",
  isAccepted: condition,
  execute: execution
};
