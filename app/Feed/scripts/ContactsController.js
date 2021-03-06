angular
  .module('Feed')
  .controller('ContactsController', function($scope, supersonic) {

    // Fetch user data
    $scope.user = localStorage.getItem('snail_usr');
    $scope.addShow = false;
    $scope.targetUser = "";
    $scope.searchUser = "";

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

    // Fetch contact list
    $scope.contacts = [];

    var contactRef = '/users/' + $scope.user + '/contacts';
    database.ref(contactRef).once('value').then(function (snapshot) {
      var data = snapshot.val();
      for (var prop in data) {
        var unique = true;
        for (var i = 0; i < $scope.contacts.length; i++) {
          if ($scope.contacts[i] === data[prop]) unique = false;
        }
        if (unique) $scope.contacts.push(data[prop]);
      }
      supersonic.logger.log($scope.contacts);
    });

    // Add friends
    $scope.addFriends = function() {
      $scope.addShow = !$scope.addShow;
    }

    // Check if target user is valid
    $scope.isValid = function() {

      var userListRef = '/users/';
      database.ref(userListRef).once('value').then(function (snapshot) {
        var data = snapshot.val();
        for (var user in data) {
          if (user === $scope.targetUser) {
            $scope.contacts.push(user);
            supersonic.logger.log("user found: Adding to the list");
            database.ref("/users/" + $scope.user + "/contacts/").push(user);
            return;
          }
        }
        var options = {
          message: "We could not find your friend :(",
          buttonLabel: "Close"
        };

        supersonic.ui.dialog.alert("Ooops!", options).then(function() {
          supersonic.logger.log("Alert closed.");
          $scope.targetUser = "";
        });
      });
    }

  });
