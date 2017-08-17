/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 07/07/2017
 */
const mongoose = require('mongoose');
const config = require('./config').database;

//mongodb://<dbuser>:<dbpassword>@ds145273.mlab.com:45273/tasabot
let connect = "mongodb://";
if (config.username) {
  connect+=config.username+":"+config.password+"@";
}
connect+=config.host+":"+config.port+"/"+config.name;
mongoose.connect(connect);
