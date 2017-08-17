/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
const formatUtil = require("../../utils/formatUtil");
const winston = require("../../loggers/winston-logger");
const async = require("async");
function condition (event, cb) {
  const request = formatUtil.formatSentence(event.body);
  const arr = request.split(" ");
  cb(null, (arr[0].trim() === "topword" || arr[0].trim() === "tw") && arr[1] && arr[1].trim() !== '');
}

function execution (event, bot, callback) {
  winston.info("Executing topWord action with params event (threadID = "+event.threadID+")");
  const arr = formatUtil.formatSentence(event.body).split(" ");
  let idx = 2;
  let options = "";
  let stringReq = arr[1];
  if (arr[1].charAt(0) === '-') {
    options = arr[1];
    stringReq = arr[idx++];
  }
  for (let i = idx; i < arr.length; ++i) {
	  stringReq = stringReq + " " + arr[i];
  }
  const unescapedRequest = stringReq
  stringReq = stringReq.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  bot.getTopWord(event.threadID, stringReq, function (err, model) {
    if (err) return callback(err);
    filterTop(model, unescapedRequest.trim(), bot, options.includes("a"), function (err, res) {
      if (err) return callback(err);
      bot.sendMessage(res, event.threadID);
    })
  });
}
function filterTop(top, sentence, bot, full, callback) {
  let topPrintString = "TW "+sentence+"\n";
  let rank = 1;
  formatInArray(top, bot, function (err, topArr) {
    topArr.sort(function(a,b) {
      return b.value - a.value;
    });
    async.each(topArr, function (elem, cb) {
      if (elem.name !== "Tasa Kafei" && (full || rank <= 5)) {
        topPrintString+= "#" + rank++ + " " + elem.name + ": " + elem.value + "\n";
      }
      cb();
    }, function (err) {
      if (err) callback(err);
      callback(null, topPrintString);
    })
  });
}

function formatInArray(top, bot, callback ) {
  let arrTop = [];
  const keys = Object.keys(top);
  bot.getSenderName(keys, function (err, info) {
    async.each(keys, function (key, cb) {
      arrTop.push({ senderID: key, value: top[key], name: info[key].name});
      cb();
    }, function (err) {
      if (err) return callback(err);
      callback(null, arrTop);
    })
  });
}

module.exports = {
  name: "topWord",
  description: "tw [phrase]",
  isAccepted: condition,
  execute: execution
};
