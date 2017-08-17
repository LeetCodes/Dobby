/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 01/08/2017
 */
const http = require('http');

function call(callback) {
  const options = {
    host: 'localhost',
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
  setInterval(()=> {
    call();
  }, 1000*60*5);
}

module.exports = {
  callAlways: callAlways
};
