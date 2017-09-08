/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */
const logger = require("../loggers/winston-logger");
const status = require("../utils/devStatus");
let bot = require('../behaviour/bot');

module.exports = {
  getInstances: (req, res, next) => {
    status.dev(res);
  },
  getInstance: (req, res, next) => {
    status.dev(res);
  },
  updateInstance: (req, res, next) => {
    status.dev(res);
  },
  createInstance: (req, res, next) => {
    status.dev(res);
  }
};
