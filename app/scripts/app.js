'use strict';

angular.module('testappApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute', 'firebase',
    'ui.bootstrap'
  ])
    .run(function($rootScope){
        $rootScope.alert = function(text){alert(text);};
    })


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
  .service("AlertService",function($timeout){
        this.alertText = null;
        this.defaultFlashTime = 1000;
        var _self = this;
        this.getAlert = function() {
            return _self.alertText;
        };

        this.alert =function(text,type,timeout) {
            this.alertText = {msg: text,type:type};
            this.alertText.close = this.closeAlert;
            if(timeout){
                $timeout(function () {
                    _self.alertText = null
                }, 1000);
            }
            console.log(text);
        }

        _self.closeAlert = function(){
            _self.alertText = null;
        }

    });



