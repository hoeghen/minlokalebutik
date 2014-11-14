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

        var usersList = $firebase(ref.child('users')).$asArray();

        usersList.$loaded().then(function() {
          usersList.forEach(function(user){
              var tilbudList = user.butik.tilbud;
              if(tilbudList){
                tilbudList.forEach(function(tilbud){
                  tilbud.distance = 10;
                  alleTibud.push(tilbud);
                });
              }
            }
          )
        });

        return alleTibud;

      }

  };
  }])
