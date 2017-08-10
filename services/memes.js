/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 01/08/2017
 */
const http = require('http');

function getMemes(callback) {
  const options = {
    host: 'api.imgflip.com',
    path: '/get_memes',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  http.get(options, function(resp){
    let str = '';
    resp.setEncoding('utf8');
    resp.on('data', function(chunk){
      str += chunk;
    });
    resp.on('end', function() {
      callback(null, JSON.parse(str));
    })
  }).on("error", function(e){
    callback(e);
  });
  return [];
}

function getMeme(callback) {
  getMemes(function (err, res) {
    console.log(res.data.memes.length);
    console.log(getRandomArbitrary(res.data.memes.length));
    callback(null, res.data.memes[Math.floor(getRandomArbitrary(res.data.memes.length))]);
  })
}

function getRandomArbitrary( max) {
  return Math.random() * max;
}
module.exports = {
  getMemes: getMemes,
  getMeme: getMeme
};
