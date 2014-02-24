"use strict";angular.module("testappApp",["ngCookies","ngResource","ngSanitize","ngRoute","firebase","flash"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/butik",{templateUrl:"views/butik.html",controller:"ButikCtrl",authRequired:!0,pathTo:"/butik"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/browse",{templateUrl:"views/browse.html"}).otherwise({redirectTo:"/default"})}]),angular.module("testappApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("testappApp").controller("ButikCtrl",["$scope","$rootScope","$firebaseAuth","$firebase","$http","flash",function(a,b,c,d,e,f){function g(a){f(a),console.log(a)}function f(a){alert(a)}var h=new Firebase("https://jobspot.firebaseio.com");b.auth||(b.auth=c(h,{path:"/login"})),console.log("controller called"),b.auth&&b.auth.user&&(a.butik=d(h).$child("users").$child(b.auth.user.id).$child("butik")),a.saveShop=function(){console.log("butik = "+a.butik);var b="http://maps.googleapis.com/maps/api/geocode/json?address=";b=b+a.butik.vejnavn+","+a.butik.husnummer+","+a.butik.postnummer+"&sensor=false",console.log("URL ="+b),e({method:"GET",url:b}).success(function(b){if("OK"==b.status)if(console.log("RESULT ="+b),b.results.length>1)g("butikkens adresse kan ikke findes på google maps, vær mere specifik");else if(b.results[0].partial_match)alert("butikkens adresse kan ikke findes på google maps, vær mere specifik"),g("butikkens adresse kan ikke findes på google maps, vær mere specifik");else{var c=b.results[0].geometry.location;a.butik.position=c,a.butik.$save(),g("butikken er gemt")}else g("butikkens adresse kan ikke findes på google maps, vær mere specifik"),console.log(b.status+":"+b.error_message)}).error(function(a){g("butikkens adresse kan ikke findes på googlemaps, prøv en anden andresse eller en adresse tæt på"),console.log(a.status+":"+a.error_message)})}}]),angular.module("testappApp").controller("LoginCtrl",["$rootScope","$scope","$firebaseAuth","$location",function(a,b,c,d){function e(a){alert(a),console.log(a)}if(null==a.auth){var f=new Firebase("https://jobspot.firebaseio.com");a.auth=c(f,{path:"/login"})}a.$on("$firebaseAuth:logout",function(){e("User is logged out")}),b.login=function(){a.auth.$login("password",{email:b.user.email,password:b.user.password}).then(function(a){e("Logged in as: ",a.uid)},function(a){e("Login failed: ",a)})},b.testLogin=function(){a.auth.$login("password",{email:"carverdk@gmail.com",password:"wobler"}).then(function(a){e("Du er logget på som "+a.email)},function(a){e("Login failed: ",a)})},b.create=function(){a.auth.$createUser(b.user.email,b.user.password,function(a){a||e("Du er oprettet")})},b.logout=function(){a.auth.$logout(),d.path("/")},b.redirect=function(){d.path("/browse")}}]);