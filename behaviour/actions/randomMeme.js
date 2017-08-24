/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');

function condition (event, cb) {
  cb(null, formatUtil.formatSentence(event.body) === "/meme" || formatUtil.formatSentence(event.body).includes("/@david"));
}

function execution (event, bot, callback) {
  bot.getMeme(function(err, res) {
    bot.sendMessage({
      body: res.name,
      url: res.url
    }, event.threadID);
  });
}
module.exports = {
  name: "randomMeme",
  description: "/meme",
  activated: true,
  isAccepted: condition,
  execute: execution
};
