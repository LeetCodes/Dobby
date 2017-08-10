/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const keywords = ["tom", "nain", "petit homme", "tomme", "dwarf", "minipouce", "bg"];
const async = require('async');
function condition (event, cb) {
  async.each(keywords, function(keyword, callback) {
    if (formatUtil.formatSentence(event.body).includes(keyword)) {
      cb(null, true);
    }
    callback();
  });
}

function execution (event, bot, callback) {
  winston.info("Executing tom action");
  bot.setMessageReaction(":wow:", event.messageID);
  bot.sendMessage("<3 Tom <3 ?", event.threadID);
}

module.exports = {
  name: "tom",
  isAccepted: condition,
  execute: execution
};
