/**
  * Project : 141Tops
  * Package : ${PACKAGE_NAME}
  * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
  * @date 04/07/2017
  */
const loginModule = require("../modules/facebook-chat-api");
const conf = require("../configurations/config");
const log = require("../loggers/winston-logger");
const async = require("async");
const memeGenerator = require('../services/memes');
const conversationDAO = require("../models/conversationDAO");
const chibres = ["bite", "chibre", "penis", "robinet", "kevin"];
let actions = require('./actions');
let apiInstance = null;
let listeningProfile = null;
let listening = false;
let first = true;
let started = false;
/* ************** */
/* PUBLIC METHODS */
/* ************** */
function login(cb) {
  console.log(conf);
  loginModule({email: conf.fb.login, password: conf.fb.passwd}, (err, api) => {
    if (err) {
      return log.error(err);
    }
    apiInstance = api;
    storeAllUnreadMessagesFromLastThreads(5, function (err, res) {
      if (err) {
        console.error(err);
        if (cb) {
          return cb(err);
        }
      }
      log.info("All messages stored");
      started = true;
      listen();
      if (cb) {
        cb();
      }
    })
  })
}
function listen() {
  listeningProfile = apiInstance.listen((err, event) => {
    if (err) {
      return log.error(err);
    }
    listening =true;

    switch (event.type) {
      case "message":
        log.debug(event);
        if (started) {
          if (first) {
            sendMessage("Dobby is back", event.threadID);
            first = false;
          }
          apiInstance.markAsRead(event.threadID, (err) => {
            if (err) console.error(err);
          });
          checkMessage(event);
        } else {
          log.info("Not started yet");
          if (event.body === "/start") {
            start();
          }
        }
        conversationDAO.saveMessage(event, event.threadID, function (err, ret) {
          if (err) {
            return console.error(err);
          }
        });
        break;
      case "event":
        console.log(event);
        console.log();
        console.log();
        break;
    }
  })
}


function checkMessage(event) {
  const message = event.body.trim().toLowerCase();
  if (message && message !== "") {
    actions.checkAndExecuteAction(event, botModule, function (err2, result) {
      if (err2) {
        return console.error(err2);
      }
    });
  } else {
    log.debug("[VERIFY MESSAGE] Message is undefined or null");
  }
}

function start() {
  log.info("Dobby is starting");
  started = true;
  listening = true;
  first = true;
}
function isAuthenticated(cb) {
  return apiInstance !== null;
}
function isListening() {
  return listening;
}
function sendMessage(message, threadId, cb) {
  if (!isAuthenticated()) {
    return log.log('error', "Bot not authenticated");
  }
  apiInstance.sendMessage(message, threadId, cb);
}

function storeAllUnreadMessagesFromLastThreads(numberOfThreads, callback) {
  log.debug("BEG storeAllUnreadMessagesFromLastThreads");
  apiInstance.getThreadList(0, numberOfThreads, function (err, arr) {
    if (err) return console.error(err);
    async.each(arr, function (thread, cb) {
      saveAllUnreadMessages(thread.threadID, function (err, threadModel) {
        if (err) {
          console.error(err);
          return cb(err);
        } else {
          return cb(null);
        }
      })
    }, function (err) {
        if (err) {
          log.debug("ERROR storeAllUnreadMessagesFromLastThreads");
          return callback(err);
        }
        log.debug("END storeAllUnreadMessagesFromLastThreads<");
        callback();
    });
  })
}
function saveAllUnreadMessages(threadID, callback) {
  conversationDAO.getOrCreateConversation(threadID, function (err, model) {
    if (err) return callback(err);
    else {
      conversationDAO.getLastMessageDate(threadID, function (err, date) {
        log.debug("DATE : "+date);
        getAllMessages(threadID, date, function (err, messages) {
          if (err) { return callback(err)}
          callback();
        });
      })
    }
  });
}

function getAllMessages(threadID, fromDate, callback) {
  let count = 10;
  let timestamp = null;
  const nbMessagesToFetch = 300;
  let moreMessages = true;
  let messages = [];

  async.whilst(
    function () {
      log.debug("moreMessages "+moreMessages );
      return moreMessages;
      },
    function (cb1) {
      log.debug("iteration");
      async.whilst(
        function() {
          if (count === 0) {
            moreMessages = false;
          }
          return count > 0 && messages.length < 5000;
        },
        function(cb) {
          log.info("Retrieving thread " + threadID + " chat history");
          apiInstance.getThreadHistory(threadID, nbMessagesToFetch, timestamp, function (err, history) {
            if (err) return;
            if (timestamp) history.pop();
            if (history.length > 0) {
              timestamp = history[0].timestamp;
              const dtime = new Date(history[0].timestamp);
              if (fromDate >= dtime) {
                let fieldResults = [];
                async.each(history, function (elem, cb2) {
                  if (fromDate > new Date(elem.timestamp)) {
                    fieldResults.push(elem);
                  }
                  return cb2();
                }, function (err) {
                  if (err) return cb(err);
                  if (fieldResults.length > 0) {
                    messages = messages.concat(fieldResults);
                    count = 0;
                    return cb();
                  } else {
                    count = 0;
                    return cb();
                  }
                });
              } else {
                count = history.length;
                messages = messages.concat(history);
                return cb();
              }
            } else {
              count = 0;
              return cb();
            }
          })
        },
        function(err) {
          if (!err) {
            conversationDAO.saveMessages(messages, threadID, function (err, model) {
              if (err) {
                return cb1(err);
              } else {
                log.info("("+messages.length+") saved in thread "+threadID);
                messages = [];
                return cb1();
              }
            })
          } else {
            console.error("Oops");
          }
        }
      )
    },
    function(err) {
      if (err) {
        return callback(err)
      } else {
        return callback(null);
      }
    }
  )
}
function getSenderName(senderID, cb) {
  apiInstance.getUserInfo(senderID, function (err, obj) {
    if (err) {
      console.error(err);
      return cb(err);
    }
    cb(null, obj);
  })
}

function setMessageReaction(reaction, messageID) {
  apiInstance.setMessageReaction(reaction, messageID);
}

function getThreadInfo(threadID, callback) {
  apiInstance.getThreadInfo(threadID, callback)
}

function stop() {
  log.info("Dobby is stopping");
  started = false;
}

function getProfilePicture(senderID, callback) {
  apiInstance.getUserInfo(senderID, function (err, obj) {
    if (err) {
      return console.error(err)
    }
    let keys = Object.keys(obj);
    let thumb = obj[keys[0]].thumbSrc;
    callback(null, thumb);
  })
}

function getRandom(threadID, callback) {
  getThreadInfo(threadID, function (err, res) {
    let idRandom = res.participantIDs[Math.floor(Math.random()*res.participantIDs.length)];
    getSenderName(idRandom, callback);
  })
}

function getTopWord(threadID, word, callback) {
  log.info("Request get top word with arguments : {threadID: "+threadID+", word: "+word+"}");
  conversationDAO.getTopWithWord(threadID, word, function (err, top) {
    if(err) { return callback(err)}
    return callback(null, top);
  })
}

function sendTypingIndicator(threadID, callback) {
  apiInstance.sendTypingIndicator(threadID, callback);
}

function changeColor(threadID, color, userID, callback) {
  apiInstance.changeThreadColor("0000FF", threadID, userID, function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
}

function messageCountByNameInThread(threadID, callback) {
  conversationDAO.messageCountByNameInThread(threadID, callback);
}

function getMeme(callback) {
  memeGenerator.getMeme(function (err, res) {
    if (err) {
      return callback(err);
    } else {
      callback(null, res);
    }

  });
}

function removeUserFromGroup(userID, threadID, callback) {
  apiInstance.removeUserFromGroup(userID, threadID, callback);
}

function addUserToGroup(userID, threadID, callback) {
  apiInstance.addUserToGroup(userID, threadID, callback);
}

let botModule = {
  login: login,
  isAuthenticated: isAuthenticated,
  sendMessage: sendMessage,
  listen: listen,
  isListening: isListening,
  stop: stop,
  getThreadInfo: getThreadInfo,
  setMessageReaction: setMessageReaction,
  getSenderName: getSenderName,
  getProfilePicture: getProfilePicture,
  getRandom: getRandom,
  getTopWord: getTopWord,
  sendTypingIndicator: sendTypingIndicator,
  changeColor: changeColor,
  getMessageCountByNameInThread: messageCountByNameInThread,
  getMeme: getMeme,
  removeUserFromGroup: removeUserFromGroup,
  addUserToGroup: addUserToGroup
};

module.exports = botModule;
