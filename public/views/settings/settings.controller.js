app.controller('SettingsCtrl', ['$scope', 'CatalogueService', function($scope, CatalogueService) {
  /* SCOPE VARIABLES */
  $scope.catalogue = [];

  /* PRIVATE VARIABLES */
  let checkedCpt;

  /* INITIALIZERS */
  init();

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

  $scope.toggle = function (item, list) {
  };

  /**
   * @return {boolean}
   */
  $scope.AreAllChecked = function() {
    return checkedCpt === $scope.catalogue.length;
  };

  $scope.toggleAll = function() {

  };
}]);
