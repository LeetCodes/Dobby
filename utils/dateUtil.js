/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 21/08/2017
 */

const log = require("../loggers/winston-logger");

function isFlooding (date) {
  log.info("[dateUtil] enter: isFlooding");
  const millisecondsPerHour = 1000*60*60;
  let res = date && ((date.getTime() - new Date().getTime())/millisecondsPerHour)<2;
  console.log("isFlooding " + res);
  return res;
}

module.exports = {
  isFlooding: isFlooding
};
