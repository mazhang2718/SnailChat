var orderMsg = function(msg_dict) {
  var out = [];

  for (var msg in msg_dict) {
    var item = {};
    item.image = msg_dict[msg]['image'];
    item.timestamp = msg_dict[msg]['timestamp'];
    item.message = msg_dict[msg]['message'];
    item.sender = msg_dict[msg]['sender'];

    out.push(item);
  }

  return out.reverse();
};

angular
  .module('Feed')
  .controller('IndexController', function($scope, $interval, supersonic) {
    // Controller functionality here
  	// Firebase Setting
    var config = {
        apiKey: "AIzaSyDAuhBy07kgbtxrkWjHu76bS7-Rvsr2Oo8",
        authDomain: "purple-b06c8.firebaseapp.com",
        databaseURL: "https://purple-b06c8.firebaseio.com",
        storageBucket: "purple-b06c8.appspot.com",
        messagingSenderId: "396973912921"
      };

    $scope.user = 'fahad';
    $scope.pass_hash = '';
    $scope.messages = undefined;
    $scope.test = undefined;
    $scope.show_val = false;
    firebase.initializeApp(config);
    var database = firebase.database();

    var getUserMessages = function() {

      var username = '/users/' + $scope.user;
      var userinfo;

      //supersonic.logger.log(username);

      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();

        $scope.messages = orderMsg(userinfo['messages']);
        $scope.pass_hash = userinfo['password'];

        supersonic.logger.log($scope.messages);
        //supersonic.logger.log($scope.pass_hash);
      });

    };

    $scope.image = ""
    $scope.caption = "";
    $scope.receiver = "";

    $scope.pushData = function() {

      var recv_acc = '/users/' + $scope.receiver + '/messages';
      var ref = database.ref().child(recv_acc);
      ref.push({
        'image': $scope.image,
        'message': $scope.caption,
        'sender': $scope.user,
        'timestamp': Date.now()
      });

      $scope.show_val = false;

      $scope.image = "";
      $scope.caption = "";
      $scope.receiver = "";
    }

    $scope.showPost = function() {

      $scope.show_val = !$scope.show_val;
      window.scrollTo(0, 0);

    };

    getUserMessages();

    $interval(getUserMessages, 5000);

  });