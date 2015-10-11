'use strict';

angular.module('testappApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute', 'firebase',
    'ui.bootstrap',
    'ngMap',
    'ngStorage',
    'ngAutocomplete'
  ])
  .run(function($rootScope){
        $rootScope.alert = function(text){alert(text);};
  })



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
                }, 3000);
            }
            console.log(text);
        }

        _self.closeAlert = function(){
            _self.alertText = null;
        }

    });

  angular.module('testappApp').config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
  angular.module('testappApp').
    run(function($rootScope) {
      $rootScope.firebaseref = 'https://minlokalebutik.firebaseio.com';
      $rootScope.baseUrl = "/";
      //$rootScope.baseUrl = "/minlokalebutik/app/";
  }
);



