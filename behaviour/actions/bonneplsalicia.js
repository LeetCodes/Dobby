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
  const millisecondsPerHour = 1000*60*60;
  cb(null, formatUtil.formatSentence(event.body)===("bonne pls alicia") && ( !date || ((date.getTime() - new Date().getTime())/millisecondsPerHour)>2) );
}

function execution (event, bot, callback) {
  bot.sendMessage({
    body: "bonne pls alicia"
  }, event.threadID);
  date = new Date();
}

module.exports = {
  name: "bonnepls",
  description: "bonne pls alicia",
  activated: true,
  isAccepted: condition,
  execute: execution
};
