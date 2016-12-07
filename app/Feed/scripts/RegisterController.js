angular
  .module('Feed')
  .controller('RegisterController', function($scope, $location, supersonic) {
    // Controller functionality here

    $scope.newUser = undefined;
    $scope.newPass = undefined;
    $scope.newPass2 = undefined;
    $scope.ph = undefined;
    $scope.pph = undefined;
    $scope.cond = undefined;

    // Set up database
    /*
    var config =
      {
        apiKey: "<API_KEY>",
        authDomain: "<PROJECT_ID>.firebaseapp.com",
        databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
        storageBucket: "<BUCKET>.appspot.com",
        messagingSenderId: "<SENDER_ID>"
      }
    */

    firebase.initializeApp(config);
    var database = firebase.database();

    var userList = undefined;
    var newPassHash = undefined;

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

      if($scope.newPass == undefined || $scope.newPass2 == undefined){
        $scope.cond = "You must type in your new password twice!";
        return;
      }

      if($scope.newPass != $scope.newPass2){
        $scope.cond = "Your re-typed password doesn't match!";
        return;
      }


      newPassHash = $scope.newPass.hashCode();


      var updates = {};
      updates['/users/' + $scope.newUser + '/password'] = newPassHash;

      database.ref().update(updates);


      $scope.cond = 'Success!';

      localStorage.setItem('snail_usr', $scope.newUser);


      steroids.initialView.dismiss();
      supersonic.ui.layers.pop();

    }


  });
