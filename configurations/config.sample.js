/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 10/08/2017
 */

var config = {};

config.fb = {};
config.fb.passwd = process.env.FB_PASSWD || '*******';
config.fb.login = process.env.FB_LOGIN || 'tasakabot@gmail.com';
config.fb.id = process.env.FB_ID || '100019110005550';
config.database = {};
config.database.type = 'mongoDB';
config.database.port = process.env.DATABASE_PORT || '27017';
config.database.username = process.env.DB_LOGIN ||'tasabot';
config.database.password = process.env.DB_PASSWD || '***********';
config.database.host = process.env.DB_HOST || '192.168.99.100';
config.database.name = process.env.NAME || 'Tasabot';
module.exports = config;
