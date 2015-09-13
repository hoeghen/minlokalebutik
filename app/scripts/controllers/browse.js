/**
 * Created by cha on 08-11-2014.
 */
'use strict';

angular.module('testappApp')
  .controller('BrowseCtrl', function ($rootScope,$scope, dataService,$location,$anchorScroll) {
    $scope.list = dataService.getFilteredResults();
    $scope.urlEncode =  function(target){
      var replaced = target.toLowerCase().replace("ø","oe").replace("æ","ae").replace("å","aa");
      return encodeURIComponent(replaced);
    };


    $scope.showDetails = function(tilbud){
      tilbud.showdetails = !tilbud.showdetails;
      if(tilbud.showdetails){
        $rootScope.$broadcast("onMarkerSelected", tilbud);
      }else{
        $rootScope.$broadcast("onMarkerDeSelected", tilbud);
      }
    }


 }).filter('afstand', function() {
    return function (input) {
      if (input > 1000) {
        return Number(input / 1000).toFixed(1) + " km";
      } else {
        return Number(input).toFixed(0) + " m"
      }
    }
  });
