/************************************************
 * AUTHOR:         Alexandre Cazala             *
 * CREATION_DATE:  08/11/16                     *
 * EMAIL:          alexandre.cazala@gmail.com   *
 * LICENSE:        Apache 2.0                   *
 ***********************************************/
'use strict';

app.controller('navBarCtrl', function ($scope, $location, Notification) {
  /* Scope vars */
  $scope.profile = {};
  $scope.user = {};
  $scope.error = {};

  /* Scope Methods */
  /**
   * Return the active url
   * @type {isActive}
   */
  $scope.isActive = isActive;

  /**
   * Log out the user
   * @type {logOutFct}
   */
  $scope.logOut = logOutFct;

  function logOutFct() {
    Auth.logout(function (err) {
      if (!err) {
        $scope.$emit('notify', {
          type: 'info',
          title: 'Déconnecté !'
        });

        //Redirection with notif
        const url = window.location.href;
        const url2 = url.split("catalogue");
        window.location.replace(url2[0]);
        window.location.replace(url);

      } else {
        Notification.error({message: 'Echec de déconnection'})
      }
    });
  }

  function isActive(viewLocation) {
    return viewLocation === $location.path();
  }

});

