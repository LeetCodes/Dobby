/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("huehuehue"));
}

function execution (event, bot, callback) {
  bot.sendMessage({
    url: "http://i.imgur.com/pqt7zgz.gif"
  }, event.threadID);
}
module.exports = {
  name: "huehuehue",
  isAccepted: condition,
  execute: execution
};
