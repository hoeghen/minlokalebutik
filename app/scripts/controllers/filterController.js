/**
 * Created by cha on 29-12-2014.
 */
/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('filterController', function($scope, dataService) {

  $scope.types = dataService.getTilbudTypes();
  $scope.search = {};
  $scope.$watch('search',function(newValue, oldValue){
      dataService.setSearch($scope.search);
  },true)


})

