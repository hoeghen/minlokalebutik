/**
 * Created by cha on 08-11-2014.
 */
'use strict';

angular.module('testappApp')
  .controller('BrowseCtrl', function ($scope, dataService) {
    $scope.list = dataService.getFilteredResults();
    $scope.urlEncode =  function(target){
      var replaced = target.toLowerCase().replace("ø","oe").replace("æ","ae").replace("å","aa");
      return encodeURIComponent(replaced);
    }
 });
