/************************************************
 * AUTHOR:         Alexandre Cazala             *
 * CREATION_DATE:  23/11/16                      *
 * EMAIL:          alexandre.cazala@gmail.com   *
 * LICENSE:        Apache 2.0                   *
 ***********************************************/
'use strict';

angular.module('dobbydashboard')
  .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {

      login: function (provider, user, callback) {
        const cb = callback || angular.noop;
        Session.save({
          provider: provider,
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        }, function (user) {
          $rootScope.currentUser = user;
          return cb();
        }, function (err) {
          console.error(err);
          return cb(err.data);
        });
      },

      logout: function (callback) {
        const cb = callback || angular.noop;
        Session.delete(function () {
            $rootScope.currentUser = null;
            return cb();
          },
          function (err) {
            return cb(err.data);
          });
      },

      createUser: function (userinfo, callback) {
        const cb = callback || angular.noop;
        User.save(userinfo,
          function (user) {
            $rootScope.currentUser = user;
            return cb();
          },
          function (err) {
            return cb(err.data);
          });
      },

      currentUser: function () {
        Session.get(function (user) {
          $rootScope.currentUser = user;
        });
      },

      isConnected: function () {
        return !!$rootScope.currentUser;
      },
      updateUser: function (newInfo, callback) {
        var cb = callback || angular.noop;
        User.updateUserInfo(newInfo, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err.data);
        });
      },


      removeUser: function (email, password, callback) {
        var cb = callback || angular.noop;
        User.delete({
          email: email,
          password: password
        }, function () {
          return cb();
        }, function (err) {
          return cb(err.data);
        });
      }
    };
  });
