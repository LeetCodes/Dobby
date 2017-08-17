/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const keywords = ["grand", "gros", "énorme", "enorme", "gigantesque"];
const async = require('async');
Array.prototype.contains = function(element){
  return this.indexOf(element) > -1;
};
function condition (event, cb) {
  async.each(keywords, function(keyword, callback) {
    if (formatUtil.formatSentence(event.body).includes(keyword)) {
      cb(null, true);
    }
    callback();
  });
}

function execution (event, bot, callback) {
  winston.info("Executing message count action");
  bot.setMessageReaction(":wow:", event.messageID);
  bot.sendMessage("Comme mon chibre", event.threadID);
}

module.exports = {
  name: "commemonchibre",
  description: "Dobby répond comme mon chibre",
  case: "s'active quand on fait une allusion à la taille",
  isAccepted: condition,
  execute: execution
};
