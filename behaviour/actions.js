/**
 * Created by A663945 on 05/07/2017.
 */
const winston = require('winston');
const bot = require('./bot');
const catalogue = require('./catalogue')();
const actionFuncNames = [
  'stop',
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
  winston.info("action "+v+" added");
  catalogue.push(require('./actions/' + v))
});

function addAction(action) {
  winston.info("action added");
  actionsCatalogue.push(action);
}

function checkAndExecuteAction(event, bot, cb) {
  winston.info("check and execute action");
  catalogue.getCatalogue().forEach(function(action) {
    action.isAccepted(event, function (err, res) {
      if (err) {
        return console.error(err);
      }
      if (res === true) {
        action.execute(event, bot, cb);
      }
    })
  });
}

module.exports = {
  addAction: addAction,
  checkAndExecuteAction: checkAndExecuteAction
};
