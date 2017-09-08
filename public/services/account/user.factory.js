/************************************************
 * AUTHOR:         Alexandre Cazala             *
 * CREATION_DATE:  28/08/17                     *
 * EMAIL:          alexandre.cazala@gmail.com   *
 * LICENSE:        Apache 2.0                   *
 ***********************************************/
'use strict';

angular.module('dobbydashboard')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'updateUserInfo': {
          method: 'PUT'
        }
      });
  });
