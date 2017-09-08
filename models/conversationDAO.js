/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 07/07/2017
 */
const mongoose = require('mongoose');
const userDAO = require('./userDAO');
const Conversation = require('./schemas/conversation');
const Message = require('./schemas/message');
const formatUtil = require('../utils/formatUtil');
const async = require('async');
const log = require("../loggers/winston-logger");
function saveMessage(message, threadID, callback) {
  log.info("Call Save message");
  Conversation.findOne({threadID: threadID}, function (err, model) {
    if (err) {
      return callback(err);
    }
    if (!model) {
      return callback(404);
    }
    message.createdAt = message.timestamp;
    let messageModel = new Message(message);
    messageModel.save(function (err, modelmsg) {
      model.messages.push(modelmsg);
      model.save(function (err, model) {
        if(err) { return callback(err) }
        log.info("End Save message");
        return callback(null);

      });
    });
  });
}

function saveMessages(messages, threadID, callback) {
  log.info("Call Save messages");
  Conversation.findOne({threadID: threadID}, function (err, model) {
    if (err) {
      return callback(err);
    }
    if (!model) {
      return callback(404);
    }
    async.each(messages, function(message, cbEach) {
      if (message.body !== "") {
        message.createdAt = new Date(message.timestamp);
        let tmpMessage = new Message(message);
        tmpMessage.save(function (err, msg) {
          if (err) {
            console.error(err);
            return cbEach(err);
          }
          model.messages.push(msg);
          return cbEach();
        });
      } else {
        return cbEach();
      }

    }, function (err) {
      model.save(function (err, model) {
        if (err) {
          console.error("ERROR : conversationDAO saveMessages model.save");
          console.error(err);
          return callback(err);
        }
        callback(null, model);
      });
    });
  })
  log.info("End Save messages");
}
function getOrCreateConversation (threadID, callback) {
  getConversation(threadID, function (err, model) {
    if (err) return callback(err);
    if (model === null) {
      return createConversation(threadID, callback)
    } else {
      return callback(null, model);
    }
  })
}

function getConversation(threadID, callback) {
  Conversation.findOne({threadID: threadID}, function (err, model) {
    if (err) return callback(err);
    callback(null, model);
  })
}
function createConversation(threadID, callback ) {
  Conversation.findOne({threadID: threadID}, function (err, model) {
    if (err) {
      return callback(err);
    }
    if (model && model.threadID === threadID) {
      callback("ALREADY EXISTING");
    }
    let conversation = new Conversation;
    conversation.threadID = threadID;
    conversation.save(function(err, model) {
      if(err) {
        return callback(err);
      }
      return callback(null, model);
    })
  })
}

function getLastMessageDate(threadID, callback) {
  Conversation.findOne({ threadID: threadID }, function (err, conversation) {
    if (err) return callback(err);
    if (0 < conversation.messages.length) {
      Message.find({ _id: { "$in": conversation.messages}}).sort({'createdAt': -1}).limit(1).exec(function (err, messageFound) {
        callback(null, messageFound[0].createdAt);
      });
    } else {
      callback(null, null);
    }
  })
}

function getTopWithWord(threadID, word, callback) {
  log.info("Call conversation.getTopWithWord");
  Conversation.findOne({threadID: threadID}, function (err, conversation) {
    if (err) return callback(err);
    console.log(threadID);
    Message.find({_id: { "$in": conversation.messages}, "body": {$regex: new RegExp(".*"+word.toLowerCase()+".*", "i")}}).sort({senderID: 1}).exec(function(err, messagesArr) {
      let top = {};
      console.log(messagesArr.length);
      async.each(messagesArr, function (elem, cb) {
        if (top[elem.senderID]) {
          top[elem.senderID]++;
          return cb();
        } else {
          top[elem.senderID] = 1;
          return cb();
        }
      }, function (err) {
        console.log("CB getTopWithWord");
        console.log(top);
        if (err) return callback(err);
        return callback(null, top);
      })
    });
  })

  log.info("[END] conversation.getTopWithWord");
}

function messageCountByNameInThread(threadID, callback) {
  Conversation.findOne({"threadID": threadID}, function (err, conversationResult) {
    Message.aggregate([
      {
        $match: {"_id": {"$in": conversationResult.messages}}
      }, {
      $group: {
        _id: "$senderID",
        count: {$sum: 1}
      }
    },
      {
        "$sort": {"count": 1}
      }]).exec(function (err, results) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, results);
      }
    })
  })
}
module.exports = {
  getOrCreateConversation: getOrCreateConversation,
  getConversation: getConversation,
  createConversation: createConversation,
  saveMessage: saveMessage,
  saveMessages: saveMessages,
  getLastMessageDate: getLastMessageDate,
  getTopWithWord: getTopWithWord,
  messageCountByNameInThread: messageCountByNameInThread
};
