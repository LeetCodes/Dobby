/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 10/07/2017
 */
const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat(),
      colorize: true,
      level: 'debug'
    })
  ]
});

logger.level = 'debug';
logger.info("Logger configured");

module.exports = logger;
