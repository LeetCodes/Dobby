/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const roles = require('../../configurations/roles');
const keywords = ["bonjour", "hello", "coucou"];
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
  winston.info("Executing bonjour action");
  bot.getSenderName(event.senderID , function (err, res) {
    console.log(res);
    let keys = Object.keys(res);
    let name = formatUtil.formatSentence(res[keys[0]].name);
    let sentence = "Bonjour ";
    roles.isRole("admin", event.senderID, function (err, res) {
      if (err) {
        return console.error(err);
      }
      if (res && res=== true) {
        return bot.sendMessage("Bonjour Maître", event.threadID);
      } else{
        if (name.includes("kevin")) {
          name = "Kevin 8)";
        } else if (name.includes("alicia")) {
          name = "";
          sentence = "Hey Gorgeous ;) !!"
        } else if (name.includes("marie") || name.includes("benj") || name.includes("adrien")) {
          sentence = "Hej "+ name +", hur mår du?"
          name = "";
        } else if (name.includes("bighetti")) {
          name = "Régisseur <3";
        } else if (name.includes("salah")) {
          sentence = "صلاح مرحبا";
          name = "";
        } else if (name.includes("meurgues")) {
          sentence = "Kon'nichiwa";
        }
        sentence += name;
        bot.sendMessage(sentence, event.threadID);
      }

    });
  })
}

module.exports = {
  name: "bonjour",
  description: "Il faut toujours dire bonjour",
  case: "s'active quand quelqu'un dit bonjour",
  activated: true,
  isAccepted: condition,
  execute: execution
};
