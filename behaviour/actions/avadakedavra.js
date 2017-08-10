/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const roles = require('../../configurations/roles');
let dragon = false;
function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body).includes("avadakedavra"));
}

function execution (event, bot, callback) {
  roles.isRole("admin", event.senderID, function (err, res) {
    if (err) {
      return console.error(err);
    }
    if (!res || res === false) {
      return bot.sendMessage("Yes ?", event.threadID);
    } else if (res === true) {
      bot.removeUserFromGroup('1114719289', event.threadID, function (err) {
        if (err) return callback(err);
        setTimeout(function() {
          bot.sendMessage("Ne touche pas à mon maître !", event.threadID);
          if (dragon) {
            bot.sendMessage({
              body:"Dobby vous avait prévenu !",
              url: "https://media.giphy.com/media/ZlLPK8aF04nmg/giphy.gif"
            }, event.threadID);
          } else {
            bot.sendMessage({
              body:"Avada kedavra !",
              url: "https://media.giphy.com/media/JAbAmpu1TshlS/giphy.gif"
            }, event.threadID);
            dragon = true;
          }
          setTimeout(function () {
            setTimeout(function () {
              bot.addUserToGroup('1114719289', event.threadID, function (err) {
                setTimeout(function () {
                  bot.sendMessage("Dobby reviendra avec un dragon la prochaine fois!", event.threadID)
                }, 5500)
              })
            }, 7000);
          }, 5000);
        }, 2000)

      });
    }
  });
}
module.exports = {
  name: "avadakedavra",
  isAccepted: condition,
  execute: execution
};
