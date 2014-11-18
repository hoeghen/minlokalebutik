/**
 * Created by cha on 08-11-2014.
 */


angular.module('testappApp').factory('dataService',['$firebase','$rootScope','$firebaseSimpleLogin',function($firebase,$rootScope,$firebaseSimpleLogin){
  var ref = new Firebase($rootScope.firebaseref);

  return {
      getButikForAuthUser : function(){
        return $firebase(ref).$child('users').$child($rootScope.auth.user.id).$child("butik");
      },


      getTilbud : function(){
        var alleTibud = [];
        var _self = this;

        var usersList = $firebase(ref.child('users')).$asArray();
        var myLocation = getLocation();


        usersList.$loaded().then(function() {8
          usersList.forEach(function(user){
              var tilbudList = user.butik.tilbud;
              if(tilbudList){
                tilbudList.forEach(function(tilbud){
                  if(myLocation){
                    tilbud.distance = distance(myLocation,user.butik.position);
                  }
                  tilbud.butik = user.butik;
                  alleTibud.push(tilbud);
                });
              }
            }
          )
        });

        getLocation = function myLocation() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
              return position;
            });
          }
        }

        distance = function(lat1,lat2) {
          var φ1 = lat1.toRadians(), φ2 = lat2.toRadians(), Δλ = (lon2-lon1).toRadians(), R = 6371; // gives d in km
          var d = Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
          var d = R * c;
        return d *1000;
      }
    return alleTibud;

      }

  };
  }])
