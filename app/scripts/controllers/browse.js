/**
 * Created by cha on 08-11-2014.
 */
'use strict';

angular.module('testappApp')
  .controller('BrowseCtrl', function ($scope,dataService) {
    $scope.users = dataService.getUsers();
  });
