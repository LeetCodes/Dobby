/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body) === "/random");
}

function execution (event, bot, callback) {
  bot.getRandom(event.threadID, function (err, res){
    let keys = Object.keys(res);
    let name = res[keys[0]].name;
    bot.sendMessage(name + " tu es l'élu", event.threadID);
  });
}
module.exports = {
  name: "random",
  description: "/random",
  activated: true,
  isAccepted: condition,
  execute: execution
};
