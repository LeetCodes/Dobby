app.controller('SettingsCtrl', ['$scope', 'CatalogueService', function($scope, CatalogueService) {
  /* SCOPE VARIABLES */
  $scope.catalogue = [];

  /* PRIVATE VARIABLES */
  let checkedCpt;

  /* INITIALIZERS */
  init();

  /* SCOPE FUNCTIONS */

  $scope.toggle = function (index) {
    setTimeout(() => {
      CatalogueService.saveState($scope.catalogue[index]).then(function (data) {
        console.log(data);
      });
    }, 100)
  };

  /* PRIVATE FUNCTIONS */
  function init() {
    getActions();
  }

  function getActions() {
    CatalogueService.getCatalogue().then(function(data) {
      $scope.catalogue = data.data;
      checkedCpt = $scope.catalogue.length;

    });
  }

}]);
