/**
 * Created by cha on 29-12-2014.
 */
/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('filterController', function($scope, dataService) {


  $scope.types = dataService.getTilbudTypes();
  $scope.search = dataService.defaultFilter;

  $scope.$watch('search',function(newValue, oldValue){
      dataService.setSearch($scope.search);
  },true)
  $scope.location = dataService.getCurrentPosition();

  $scope.onButton= function(){
    $scope.search.butik = undefined;
    $scope.search.dirty = !$scope.search.dirty;
    dataService.setSearch($scope.search);
  }

})

