/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body) === "/stop");
}

function execution (event, bot, callback) {
  winston.info("Executing stop action");
  bot.sendMessage("Bye bye...", event.threadID, function (err, res) {
    if (err) {
      return callback(err);
    }
    bot.stop();
  })
}

module.exports = {
    name: "stop",
    isAccepted: condition,
    execute: execution
};
