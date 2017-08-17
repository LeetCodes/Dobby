/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 01/08/2017
 */
const http = require('http');

function call() {
  const options = {
    host: 'dobby141.herokuapp.com',
    path: '/bot/hello',
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
  console.log("CALL ALWAYS");
  setInterval(()=> {
    console.log();
    console.log("HEROKU HACK");
    console.log();
    call();
  }, 1000*60*2);
}

module.exports = {
  callAlways: callAlways
};
