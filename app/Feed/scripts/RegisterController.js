angular
  .module('Feed')
  .controller('RegisterController', function($scope, $location, supersonic) {
    // Controller functionality here
  	// Firebase Setting

    $scope.newUser = undefined;
    $scope.newPass = undefined;
    $scope.ph = undefined;
    $scope.pph = undefined;
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

    var userList;
    var newPassHash;

    database.ref('/users').once('value').then(function(snapshot) {
        userList = snapshot.val();
        userList = Object.keys(userList);
    });


    $scope.createAccount = function() {
      var remote_hash_query = '/users/' + $scope.user + '/password';
      var remote_hash;

      supersonic.logger.log(userList);
 

      for (var i=0; i<userList.length; i++){
        if ($scope.newUser == userList[i]){
          $scope.cond = 'User already exists!';
          return;
        }
      }

      newPassHash = $scope.newPass.hashCode();
  

      var updates = {};
      updates['/users/' + $scope.newUser + '/password'] = newPassHash;

      database.ref().update(updates);


      $scope.cond = 'Success!';

      //$window.location.assign('Feed#login');

    }
    

  });
