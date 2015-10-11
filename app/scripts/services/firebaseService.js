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

  function removeTilbudsEmail(email){
    var found = false;
    notificationsArray.forEach(function(item){
      if(item.email == email){
        found = true;
        var notification = notificationsArray.$getRecord(item.$id);
        notificationsArray.$remove(notification).then(function (emailRef) {
          log("email removed "+emailRef);
          alert("din email blev fjernet og du modtager ikke længer emails fra MinLokaleButik.dk");
        },function(error){
          alert("din email kunne ikke fjernes, har du skrevet rigtigt?");
          log("email was not removed "+error);
          return false
        });
      }
    })
    if(!found){
      alert("din email blev fjernet og du modtager ikke længer emails fra MinLokaleButik.dk");
    }
  }

  return {
    saveTilbudsEmail:saveTilbudsEmail,
    removeTilbudsEmail:removeTilbudsEmail
  };

  function log(message){
    console.log(message);
  }

}])
