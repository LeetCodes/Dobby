/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 23/08/2017
 */
app.service('CatalogueService', function ($http) {

  delete $http.defaults.headers.common['X-Requested-With'];
  this.getCatalogue = function () {
    return $http({
      method: 'GET',
      url: '/api/v1/catalogue'
    });
  };
});
