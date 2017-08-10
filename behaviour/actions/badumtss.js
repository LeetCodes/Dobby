/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("badum"));
}

function execution (event, bot, callback) {
  bot.sendMessage({
    url: "https://www.youtube.com/watch?v=6zXDo4dL7SU"
  }, event.threadID);
}
module.exports = {
  name: "badumtss",
  isAccepted: condition,
  execute: execution
};
