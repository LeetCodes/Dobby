/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */
const mongoose = require('mongoose');
const crypto = require('crypto');
const UserSchema = require('./user');
const InstanceSchema = new mongoose.Schema({
  name: String,
  description: String,
  login: String,
  hashedPassword: String,
  salt: String,
  created_at: {type: Date, required: true, default: Date.now()}
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

InstanceSchema
  .virtual('password')
  .set((password) => {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

InstanceSchema
  .virtual('instance_info')
  .get(function () {
    return {
      '_id': this._id,
      'name': this.name,
      'description': this.description
    }
  });

/**
 * Validations
 */

let validatePresenceOf = function (value) {
  return value && value.length;
};

InstanceSchema.path('login').validate(function(value, respond) {
  mongoose.models["Instance"].findOne({login: value}, function(err, user) {
    if(err) {
      throw err;
    }
    if(user) {
      return respond(false);
    }
    respond(true);

  });
}, 'The specified login address is already in use.');

InstanceSchema.path('name').validate(function(value, respond) {
  mongoose.models["Instance"].findOne({name: value}, function(err, user) {
    if(err) {
      throw err;
    }
    if(user) {
      return respond(false);
    }
    respond(true);
  });
}, 'The specified name is already in use.');

/**
 * Methods
 */

InstanceSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) {
      return '';
    }
    const salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};
module.exports = mongoose.model('Instance', InstanceSchema);
