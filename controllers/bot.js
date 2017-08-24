/**
 * Created by A663945 on 03/07/2017.
 */
const logger = require("../loggers/winston-logger");
let bot = require('../behaviour/bot');

module.exports = {
  startBot: (req, res, next) => {
    logger.info("Starting bot");
    if (!bot.isAuthenticated()) {
      bot.login();
      res.send("Starting");
    } else {
      if (!bot.isListening()) {
        bot.listen();
        return res.send("Listening");
      } else {
        return res.send("Already started and listening");
      }
    }
  },
  stopBot: (req, res, next) => {
      bot.stop();
      res.send({
        status: "Stopping"
      })
  },
  getStatus: (req, res, next) => {
    res.send({
      status: bot.getStatus()
    });
  },
  herokuHack: (req, res, next) => {
    console.log("HEROKU HACK");
    res.send("{status: 'OK'}");
  }

};
