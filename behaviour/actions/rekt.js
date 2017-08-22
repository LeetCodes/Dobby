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
let letter = "R";
let step = {
  1: "R",
  2: "E",
  3: "K",
  4: "T",
  5: "REKT"
};
let triggered = false;
function condition (event, cb) {
  cb(null, ((!triggered && (formatUtil.formatSentence(event.body).includes("4 lettres") ||
    formatUtil.formatSentence(event.body).includes("quatres lettres"))) ||
  (triggered && formatUtil.formatSentence(event.body) === 'e') ||
  (triggered && formatUtil.formatSentence(event.body) === 'k') ||
  (triggered && formatUtil.formatSentence(event.body) === 't')));
}

function execution (event, bot, callback) {
  switch(formatUtil.formatSentence(event.body)) {
    case "r":
      triggered = true;
      bot.sendMessage("E", event.threadID);
      break;
    case "e":
      triggered = true;
      bot.sendMessage("K", event.threadID);
      break;
    case "k":
      triggered = true;
      bot.sendMessage("T", event.threadID);
      break;
    case "t":
      triggered = true;
      bot.sendMessage("REKT", event.threadID);
      bot.sendMessage({
        url: "https://media.giphy.com/media/EldfH1VJdbrwY/giphy.gif"
      }, event.threadID);
      triggered = false;
      break;
    default:
      bot.sendMessage("R", event.threadID);
      triggered = true;
      break;
  }
}

module.exports = {
  name: "rekt",
  description: "YOU'RE REKT",
  isAccepted: condition,
  execute: execution
};
