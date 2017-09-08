/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */
'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const log = require('../loggers/winston-logger');
const ObjectId = mongoose.Types.ObjectId;


/*********************************************************
 * IMPLEMENTATION                                        *
 *********************************************************/

function createImpl(req, res, next) {
  let newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save(function (err) {
    if (err) {
      log.error(err);
      return res.status(400).json(err);
    }

    req.login(newUser, function (err) {
      if (err) {
        log.error(err);
        return next(err);
      }
      return res.json(newUser.user_info);
    });
  });
}

/*   update info user */

function updateUserInfoImp(req, res) {
  const user = req.user;
  /*  email or pseudo */
  if (req.body.password === null) {
    User.findOneAndUpdate({_id: user._id}, req.body,
      function (err, user) {
        if (err) {
          return next(new Error('Failed to load User ' + username));
        } else {
          res.json({status: "success", data: user});
        }
      }
    );
  } else {
    /*  password */
    User.findOneAndUpdate({_id: user._id}, {hashedPassword: user.encryptPassword(req.body.password)},
      function (err, user) {
        if (err) {
          log.error(err);
          return next(new Error('Failed to load User ' + username));
        } else {
          res.json({status: "success", data: user});
        }

      }
    );
  }
}

function showImpl(req, res, next) {
  const userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile});
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
}

function existsImpl(req, res, next) {
  const username = req.params.username;
  User.findOne({username: username}, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if (user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
}

module.exports = {
  /**
   * Create user
   * @param req
   * @param req.body {User} the complete User check moongoose schema for details
   * @param res
   * @param next {Function} callback
   * @return email
   * @return password
   * @method
   */
  create: createImpl,
  updateUserInfo: updateUserInfoImp,

  /**
   *  Show profile
   *  @param req
   *  @param req.params.userId {String} user Id of the profile asked
   *  @param res
   *  @param next {Function} callback
   *  @return username
   *  @return profile
   *  @method
   */
  show: showImpl,

  /**
   *  Check if the username exists.
   *  @param req
   *  @param req.params.username {String} Username to check if it exists
   *  @param res
   *  @param next {Function} callback
   *  @return exists
   *  @method
   */
  exists: existsImpl,


};
