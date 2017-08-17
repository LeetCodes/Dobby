/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("mort") || formatUtil.formatSentence(event.body).includes("tuer"));
}

function execution (event, bot, callback) {
  bot.setMessageReaction(":sad:", event.messageID);
}
module.exports = {
  name: "mort",
  description: "réagit à la mort",
  isAccepted: condition,
  execute: execution
};
