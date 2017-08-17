/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 07/07/2017
 */
const mongoose = require('mongoose');
const config = require('./config').database;

let connect = "mongodb://localhost/"+config.name;
mongoose.connect(connect);
