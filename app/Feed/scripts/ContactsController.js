angular
  .module('Feed')
  .controller('ContactsController', function($scope, supersonic) {

    // Fetch user data
    $scope.user = localStorage.getItem('snail_usr');

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
    $scope.contacts = null;

    var contactRef = '/users/' + $scope.user + '/contacts';
    database.ref(contactRef).once('value').then(function (snapshot) {
      var data = snapshot.val();
      supersonic.logger.log("fetched contact list: " + data);
      $scope.contacts = data;
    });

  });
