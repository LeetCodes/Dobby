/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const async = require('async');
const roles = require('../../configurations/roles');
let date;
function condition (event, cb) {
  const tokens = formatUtil.formatSentence(event.body).split(" ");
  if (tokens[0] === "megaphone" && tokens[1] && tokens[1] !== " "){
    roles.isRole("admin", event.senderID, function (err, res) {
      cb(null, res);
    });
  }
}

function execution (event, bot, callback) {
  bot.getThreadInfo(event.threadID, function (err, res) {
    console.log(res.participantIDs);
    let tokens = event.body.split(" ");
    tokens[0] = "Admin au mégaphone du 141 : ";
    let msgToSend = tokens.join(" ");
    async.each(res.participantIDs, (member, cb) => {
      bot.sendMessage({
        body: msgToSend
      }, member);
      cb();
    }, function (err) {
      if (err) return callback(err);
    });
  });
}

module.exports = {
  name: "megaphone",
  description: "UN PUTIN DE MEGAPHONE GROS !",
  activated: true,
  isAccepted: condition,
  execute: execution
};
