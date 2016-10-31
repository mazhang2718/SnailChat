var orderMsg = function(msg_dict) {
  var out = [];

  for (var msg in msg_dict) {

    var currentTime = Date.now();
    var futureTime = parseInt(msg_dict[msg]['timestampFuture']);

    if (futureTime <= currentTime)
    {
      var item = {};
      item.image = msg_dict[msg]['image'];
      item.timestamp = msg_dict[msg]['timestamp'];
      item.timestampFuture = msg_dict[msg]['timestampFuture'];
      item.message = msg_dict[msg]['message'];
      item.sender = msg_dict[msg]['sender'];

      out.push(item);
    }

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

    $scope.user = undefined;
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

    $scope.image = 'http://images.hellogiggles.com/uploads/2015/03/08/purple-suede.jpg';
    $scope.caption = "";
    $scope.receiver = "";

    $scope.pushData = function() {

      var recv_acc = '/users/' + $scope.receiver + '/messages';
      var ref = database.ref().child(recv_acc);

      ref.push({
        'image': $scope.image,
        'message': $scope.caption,
        'sender': $scope.user,
        'timestamp': Date.now(),
        'timestampFuture': Date.now() + (60000 + 60000*Math.floor(Math.random()*4))
      });

      $scope.show_val = false;

      //$scope.image = '';
      $scope.caption = "";
      $scope.receiver = "";
    }

    $scope.showPost = function() {

      $scope.show_val = !$scope.show_val;
      window.scrollTo(0, 0);

    };

    $scope.pushDataUser = function() {

      $scope.show_val1 = false;

    }

    $scope.showUser = function() {

      $scope.show_val1 = !$scope.show_val1;
      window.scrollTo(0, 0);

    };

    //getUserMessages();

    $interval(getUserMessages, 1000);

  });