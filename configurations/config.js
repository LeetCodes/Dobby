/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 10/08/2017
 */

var config = {};

config.fb = {};
config.fb.passwd = process.env.FB_PASSWD;
config.fb.login = process.env.FB_LOGIN;
config.fb.id = process.env.FB_ID;
config.database = {};
config.database.type = 'mongoDB';
config.database.port = process.env.DATABASE_PORT || '27017';
config.database.username = process.env.DB_LOGIN;
config.database.password = process.env.DB_PASSWD;
config.database.host = process.env.DB_HOST || 'localhost';
config.database.name = process.env.NAME || 'Tasabot';
module.exports = config;
