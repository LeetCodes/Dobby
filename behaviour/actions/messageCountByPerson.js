/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require('winston');
const async = require('async');

function condition (event, cb) {
  const request = formatUtil.formatSentence(event.body);
  cb(null, request === "/topspammers");
}

function execution (event, bot, callback) {
  winston.info("Executing top spammers action");
  bot.getMessageCountByNameInThread(event.threadID, function (err, res) {
    if (err) {
      return console.error(err)
    }
    let topPrintString = "== TOP SPAMMERS ==\n";
    let rank = 1;
    filterTop(res, bot, function (err, res) {
      if (err) return callback(err);
      async.each(res, function (elem, cb) {
        topPrintString += "#"+ rank++ + " " + elem.name + ": " + elem.count + "\n";
        cb();
      },function (err) {
        bot.sendMessage(topPrintString, event.threadID);
      })
    });

  })
}

function filterTop(top, bot, callback) {
  async.each(top, function (elem, cb) {
    console.log(elem);
    bot.getSenderName(elem._id, function (err, info) {
      elem.name = info[elem._id].name;
      cb();
    });
  }, function (err) {
    if (err) return callback(err);
    top.sort(function (a, b) {
      return b.count - a.count;
    });
    callback(null, top);
  })
}
module.exports = {
  name: "messageCount",
  isAccepted: condition,
  execute: execution
};
