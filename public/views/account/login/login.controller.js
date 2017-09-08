/************************************************
 * AUTHOR:         Alexandre Cazala             *
 * CREATION_DATE:  08/11/16                     *
 * EMAIL:          alexandre.cazala@gmail.com   *
 * LICENSE:        Apache 2.0                   *
 ***********************************************/
'use strict';

app.controller('LoginCtrl', function ($scope, $location, Notification) {
  /* Scope vars */
  $scope.profile = {};
  $scope.user = {};
  $scope.error = {};

  /* Scope Methods */
  /**
   * Display a modal to log in the user
   * @type {logInFct}
   */
  $scope.logIn = logInFct;

  /**
   * Display a modal to register the user
   * @type {registerFct}
   */
  $scope.register = registerFct;

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

  /* Implémentation */
  function logInFct() {
    Auth.login('password', {
        'email': $scope.user.email,
        'password': $scope.user.password
      },
      function (err) {
        $scope.errors = {};
        if (!err) {
          Notification.success({message: 'Vous avez bien été connecté'});
        } else {
          Notification.error({message: 'Impossible de se connecter'});
        }
      });
  }

  function registerFct() {
    Auth.createUser({
        email: $scope.user.email,
        username: $scope.user.username,
        password: $scope.user.password
      },
      function (err) {
        $scope.errors = {};
        if (!err) {
          Notification.success({message:  'Votre compte a bien été créé'});
        } else {
          angular.forEach(err.errors, function (error, field) {
            console.error("ERROR : " + error + " : " + field);
          });

          Notification.error({message: 'Votre compte n\' pas pu être créé'});
        }
      }
    );
    $scope.user = {};
  }

  function logOutFct() {
    Auth.logout(function (err) {
      if (!err) {
        $scope.$emit('notify', {
          type: 'info',
          title: 'Déconnecté !'
        });

        //Redirection with notif
        var url = window.location.href;
        var url2 = url.split("catalogue");
        window.location.replace(url2[0]);
        window.location.replace(url);

      } else {
        $scope.$emit('notify', {
          type: 'warning',
          title: 'Échec de déconnection !'
        });
      }
    });
  }

  function isActive(viewLocation) {
    return viewLocation === $location.path();
  }

});

