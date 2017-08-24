/************************************************
 * AUTHOR:         Alexandre Cazala             *
 * CREATION_DATE:  08/11/16                     *
 * EMAIL:          alexandre.cazala@gmail.com   *
 * LICENSE:        Apache 2.0                   *
 ***********************************************/
(function () {
  app.directive('navBar', [function () {
      return {
        restrict: 'E',
        templateUrl: '/components/navbar/navbar.html',
        controller: 'navBarCtrl'
      };
    }]);
})();




