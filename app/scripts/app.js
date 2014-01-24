'use strict';

angular.module('testappApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute', 'firebase',
    'flash'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/butik', {
        templateUrl: 'views/butik.html',
        controller: 'ButikCtrl',
        authRequired: true,
        pathTo: '/butik'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/browse', {
        templateUrl: 'views/browse.html'
      })
      .otherwise({
        redirectTo: '/default'
      });

  });
