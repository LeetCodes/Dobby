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
    new winston.transports.File({
      level: 'info',
      filename: '../logs/info.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new (winston.transports.Console)({
      timestamp: tsFormat(),
      formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' ['+ options.level.toUpperCase() +'] '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      },
      colorize: true,
      level: 'debug',
      handleExceptions: true,
      json: false
    })
  ]
});

logger.level = 'debug';
logger.info("Logger configured");

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
