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
  const request = formatUtil.formatSentence(event.body);
  const arr = request.split(" ");
  console.log(arr);
  cb(null, arr[0].trim() === "/changecolor" && arr[1] && arr[1].trim() !== '');
}

function execution (event, bot, callback) {
  winston.info("Executing changeColor action");
  const arr = formatUtil.formatSentence(event.body).split(" ");
  bot.changeColor(event.threadID, arr[1], event.senderID, function(err) {
    if (err) return console.error(err);
  });
}

module.exports = {
  name: "changeColor",
  isAccepted: condition,
  execute: execution
};
