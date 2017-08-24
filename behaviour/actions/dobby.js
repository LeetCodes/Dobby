/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const roles = require('../../configurations/roles');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("dobby"));
}

function execution (event, bot, callback) {
  winston.info("Executing dobby action");
  if (formatUtil.formatSentence(event.body) === "dobby") {
    roles.isRole("admin", event.senderID, function (err, res) {
      if (err) {
        return console.error(err);
      }
      if (!res || res === false) {
        return bot.sendMessage("Hum ?", event.threadID);
      } else if (res === true) {
        return bot.sendMessage("Yes Master ?", event.threadID);
      }
    });
  }
}

module.exports = {
  name: "dobby",
  description: "It's me Dobbyyy",
  case: "Dobby réagit quand on parle de lui",
  activated: true,
  isAccepted: condition,
  execute: execution
};
