/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 22/08/2017
 */
const log = require("../loggers/winston-logger");
let catalogue = require("../behaviour/catalogue")();

function logd(message){
  log.debug("controllers/catalogue.js " + message );
}

module.exports = {
  getCatalogue: (req, res, next) => {
    logd("entering getCatalogue");
    res.send(catalogue.getCatalogue());
    logd("leaving getCatalogue");
  },
  switchState: (req, res, next) => {
    logd("entering switchState");
    catalogue.switchState(req.params.name, req.body.state);
    res.send({status: 'OK'});
    logd("leaving switchState");
  },
  getCatalogueLength: (req, res, next) => {
    logd("entering getActionCount");
    res.send({
      length: catalogue.getCatalogue().length
    });
    logd("leaving getActionCount")
  }
};
