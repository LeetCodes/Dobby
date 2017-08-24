/**
 * Created by A663945 on 05/07/2017.
 */
const log = require('../loggers/winston-logger');
const bot = require('./bot');
const catalogue = require('./catalogue')();
const actionFuncNames = [
  'tom',
  'dobby',
  'messageCount',
  'bonjour',
  'mort',
  'random',
  'chibre',
  'topWord',
  'changeColor',
  'messageCountByPerson',
  'randomMeme',
  'avadakedavra',
  'memegenerator',
  'help',
  'bonneplsalicia',
  'megaphone',
  'rekt'
];

actionFuncNames.map(function(v) {
  log.info("action "+v+" added");
  catalogue.push(require('./actions/' + v))
});

function addAction(action) {
  log.info("action added");
  catalogue.push(action);
}

function checkAndExecuteAction(event, bot, cb) {
  log.info("check and execute action");
  catalogue.getCatalogue().forEach(function(action) {
    if (action.activated) {
      action.isAccepted(event, function (err, res) {
        if (err) {
          return console.error(err);
        }
        if (res === true) {
          action.execute(event, bot, cb);
        }
      })
    }
  });
}
module.exports = {
  addAction: addAction,
  checkAndExecuteAction: checkAndExecuteAction
};
