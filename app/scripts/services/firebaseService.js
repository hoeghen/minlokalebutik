angular.module('testappApp').factory('firebaseService', ['$firebase', '$rootScope','AlertService',function ($firebase, $rootScope ,AlertService) {
  var ref = new Firebase($rootScope.firebaseref);
  var notificationsArray = $firebase(ref.child("notifications")).$asArray();

  function saveTilbudsEmail(email,postcode,bynavn){
    notificationsArray.$add({email:email,postcode:postcode,bynavn:bynavn}).then(function (emailRef) {
      log("tilbudsemail saved:"+ + emailRef)
    }, function (reason) {
      log("save tilbudsemail failed:" + reason)
    });
  }

  return {
    saveTilbudsEmail:saveTilbudsEmail
  };

  function log(message){
    console.log(message);
  }

}])
