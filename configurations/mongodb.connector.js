/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 07/07/2017
 */
const mongoose = require('mongoose');
const config = require('./config').database;

let connect = "mongodb:"+config.username+":"+config.password+"@"+config.host+":"+config.port+"/"+config.name
mongoose.connect(connect);
