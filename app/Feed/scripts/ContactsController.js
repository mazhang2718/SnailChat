angular
  .module('Feed')
  .controller('ContactsController', function($scope, supersonic) {

    // Fetch user data
    $scope.user = localStorage.getItem('snail_usr');
    $scope.addShow = false;
    $scope.targetUser = "";

    // Set up database
    var config = {
      apiKey: "AIzaSyDAuhBy07kgbtxrkWjHu76bS7-Rvsr2Oo8",
      authDomain: "purple-b06c8.firebaseapp.com",
      databaseURL: "https://purple-b06c8.firebaseio.com",
      storageBucket: "purple-b06c8.appspot.com",
      messagingSenderId: "396973912921"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    // Fetch contact list
    $scope.contacts = [];

    var contactRef = '/users/' + $scope.user + '/contacts';
    database.ref(contactRef).once('value').then(function (snapshot) {
      var data = snapshot.val();
      supersonic.logger.log("fetched contact list: " + data);
      for (var prop in data) {
        $scope.contacts.push(data[prop]);
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
        });
      });
    }

  });
