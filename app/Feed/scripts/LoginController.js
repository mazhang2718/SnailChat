String.prototype.hashCode = function() {
  var hash = 0;
  var i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

angular
  .module('Feed')
  .controller('LoginController', function($scope, $interval, supersonic) {
    // Controller functionality here
  	// Firebase Setting

    $scope.user = undefined;
    $scope.pass = undefined;
    $scope.cond = undefined;

    var config = {
      apiKey: "AIzaSyDAuhBy07kgbtxrkWjHu76bS7-Rvsr2Oo8",
      authDomain: "purple-b06c8.firebaseapp.com",
      databaseURL: "https://purple-b06c8.firebaseio.com",
      storageBucket: "purple-b06c8.appspot.com",
      messagingSenderId: "396973912921"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    var fail_case = function() {
      $scope.cond = 'Incorrect Password!';
    }

    $scope.auth = function() {
      var remote_hash_query = '/users/' + $scope.user + '/password';
      var remote_hash;

      //Get password
      database.ref(remote_hash_query).once('value').then(function(snapshot) {

        remote_hash = snapshot.val();
        //this isn't actually a secure hash
        var pass_hash = $scope.pass.hashCode();

        if (remote_hash == pass_hash) {
          $scope.cond = undefined;
          localStorage.setItem('snail_usr', $scope.user);
          localStorage.setItem('snail_test', 'False');
          steroids.initialView.dismiss();
        }
        else {fail_case();}

      });

    }


  });
