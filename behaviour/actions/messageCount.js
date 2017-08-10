/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("message count"));
}

function execution (event, bot, callback) {
  winston.info("Executing message count action");
  bot.getThreadInfo(event.threadID, function (err, res) {
    if (err) {
      return console.error(err)
    }
    bot.sendMessage("Hey ! Yo ! "+res.messageCount +" messages has been sent since I'm here dude", event.threadID);

  })
}

module.exports = {
  name: "messageCount",
  isAccepted: condition,
  execute: execution
};
