/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('mapController', function($scope, $http) {


//  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  $scope.$on('mapInitialized', function(event, map) {
    navigator.geolocation.getCurrentPosition(function (position) {
      map.setCenter({lat:position.coords.latitude,lng:position.coords.longitude});
      map.setZoom(16);
      map.setOptions({disableDefaultUI:true});
      //map.fitBounds();

    });
  });




})

