/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const dateUtil = require('../../utils/dateUtil');
const winston = require('winston');
const keywords = ["bite", "queue", "pine", "vit", "dard", "chibre", "engin", "braquemard", "membre", "quéquette", "zob", "zizi",
"instrument", "boobs", "chatte", "chat", "minou", "love", "keur", "poireau", "biroute", "parties", "gaule", "dardillon", "bistouquette", "robinet", "priape", "penis", "pénis"];
const async = require('async');
let lastMessageDate;
Array.prototype.contains = function(element){
  return this.indexOf(element) > -1;
};
function condition (event, cb) {

    async.each(keywords, function(keyword, callback) {
      if (formatUtil.formatSentence(event.body).includes(" "+keyword)) {
        cb(null, true);
      }
      callback();
    });

}

function execution (event, bot, callback) {
  winston.info("Executing message count action");
  bot.setMessageReaction(":love:", event.messageID);
}

module.exports = {
  name: "chibre",
  description: "Réagit aux chibres",
  case: "s'active quand quelqu'un utilise un synonyme de chibre",
  isAccepted: condition,
  execute: execution
};
