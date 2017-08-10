/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body) === "stalk");
}

function execution (event, bot, callback) {
  bot.setMessageReaction(":sad:", event.messageID);
  bot.getProfilePicture(event.senderID, function (err, res) {
    bot.sendMessage(res, event.threadID);
  })
}
module.exports = {
  name: "stalk",
  isAccepted: condition,
  execute: execution
};
