'use strict';

angular.module('testappApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute', 'firebase',
    'ui.bootstrap'
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
      })
 });

angular.module('testappApp')
  .service("AlertService",function(){
        this.alertText = {msg:"test"};
        this.timeoutTime = 1000;
        var self = this;
        this.getAlert = function() {
            return self.alertText;
        };

        this.alert =function(text,type,timeout) {
            this.alertText = {msg: text,type:type};
            this.alertText.close = this.closeAlert();
            if(timeout){
                $timeout(function () {
                    this.alertText = null
                }, timeoutTime);
            }
            console.log(text);
        }

        this.closeAlert = function(){
            this.alertText = null;
        }

    });



