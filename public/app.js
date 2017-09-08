'use strict';

// Declare app level module which depends on views, and components
const app = angular.module('dobbydashboard', [
  'ngRoute',
  'ngMaterial',
  'ui-notification',
  'ngCookies',
  'ngResource',
  'ngSanitize',
]);

app.config(['$routeProvider', 'NotificationProvider', '$locationProvider', function($routeProvider, NotificationProvider) {
  $routeProvider
    .when("/", {
      templateUrl: 'views/home/home.html'
    })
    .when("/settings", {
      templateUrl: 'views/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .when("/login", {
      templateUrl: 'views/account/login/login.html',
      controller: 'LoginCtrl',
    })
    .otherwise({
      redirectTo: '/'
    });

  NotificationProvider.setOptions({
    delay: 5000,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'left',
    positionY: 'bottom'
  });
}]);

app.run(function ($rootScope, $location, Auth) {
  $rootScope.$watch('currentUser', function(currentUser) {
    if (!currentUser && (['/'].indexOf($location.path()) === -1 )) {
      Auth.currentUser();
    }
  });
});

