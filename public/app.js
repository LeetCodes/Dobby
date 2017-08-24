'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('dobbydashboard', [
  'ngRoute',
  'ngMaterial'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: 'views/home/home.html'
    })
    .when("/settings", {
      templateUrl: 'views/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
