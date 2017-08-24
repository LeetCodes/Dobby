/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 01/08/2017
 */
const http = require('http');
const log = require('./loggers/winston-logger');
function call() {
  const options = {
    host: 'dobby141.herokuapp.com',
    path: 'api/v1/bot/herokuHack',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  http.get(options, function(resp){

  }).on("error", function(e){
    console.error(e);
  });
}

function callAlways() {
  log.info("Heroku hack configured to be called every 2 minutes");
  setInterval(()=> {
    log.debug("Heroku hack called");
    call();
  }, 1000*60*2);
}

module.exports = {
  callAlways: callAlways
};
