/**
 * Created by A663945 on 03/07/2017.
 */
const logger = require("winston");
let bot = require('../behaviour/bot');

module.exports = {
  startBot: startBotImpl,
  hello: hello
};

function startBotImpl (req, res, next) {
  logger.info("Starting bot");
  if (!bot.isAuthenticated()) {
    bot.login();
    res.send("Starting");
  } else {
    if (!bot.isListening()) {
      bot.listen()
      return res.send("Listening");
    } else {
      return res.send("Already started and listening");
    }
  }
}

function hello(req, res, next) {
  console.log("HEROKU HACK");
  res.send("{status: 'OK'}");
}
