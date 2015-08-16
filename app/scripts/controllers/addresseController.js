angular.module('testappApp').controller('AdresseCtrl', function($scope, $http,dataService) {

  $scope.selected = undefined;
  $scope.asyncloading = function(){
    return true;
  }


  // Any function returning a promise object can be used to load values asynchronously
  $scope.getMatches = function(val,postcode) {
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false,
        components:"postal_code:"+postcode + "|country:DK"
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };
});
