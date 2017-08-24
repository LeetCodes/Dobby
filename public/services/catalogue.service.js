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

  this.saveState = function (item) {
    return $http({
      method: 'PUT',
      url: '/api/v1/catalogue/'+item.name+'/state',
      data: {
        state: item.activated
      }
    })
  }
});
