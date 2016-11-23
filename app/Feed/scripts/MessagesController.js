var orderMsg = function(msg_dict, tester) {
  var out = [];

  for (var msg in msg_dict) {

    //get last delivery time
    //only push messages before that delivery time
    //var delivery_time = getLastDeliveryTime(delay_min);
    var deliveryTime = msg_dict[msg]['timestampFuture'];
    var currentTime = Date.now();


     if (currentTime >= deliveryTime || tester == 'True')
     {
      var item = {};
      item.image = msg_dict[msg]['image'];
      item.timestamp = msg_dict[msg]['timestamp'];
      item.timestampFuture = deliveryTime;
      item.message = msg_dict[msg]['message'];

      out.push(item);
     }

  }

  return out.reverse();
};


angular
  .module('Feed')
  .controller('MessagesController', function($scope, $interval, supersonic) {

  	// Firebase Setting
    var config = {
        apiKey: "AIzaSyDAuhBy07kgbtxrkWjHu76bS7-Rvsr2Oo8",
        authDomain: "purple-b06c8.firebaseapp.com",
        databaseURL: "https://purple-b06c8.firebaseio.com",
        storageBucket: "purple-b06c8.appspot.com",
        messagingSenderId: "396973912921"
      };

    firebase.initializeApp(config);
    var database = firebase.database();

    $scope.sender = undefined;
    $scope.messages = undefined;
    $scope.user = undefined;
    $scope.tester = undefined;
    $scope.curr = 0;
    $scope.messageLength = 0;

    var getUserMessages = function() {

      var username = '/users/' + $scope.user + '/messages/' + $scope.sender;
      var userinfo;
      var currentTime = Date.now();

      // Get list of messages for sender
      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();
        //$scope.messages = userinfo;
        $scope.messages = orderMsg(userinfo, $scope.tester);
        $scope.messageLength = $scope.messages.length;
        // Update read tag of posts
        var updates = {};
        for (key in Object.keys(userinfo)) {
          key = Object.keys(userinfo)[key];
          if (userinfo[key]['timestampFuture'] <= currentTime || $scope.tester == 'True') {
            supersonic.logger.log("key: " + key);
            var firebase_path = '/users/' + $scope.user + '/messages/' + $scope.sender + '/' + key + '/read/'
            updates[firebase_path] = 1;
          }
        }
        database.ref().update(updates);
      });

    };

    $scope.goRight = function() {
      $scope.curr = $scope.curr + 1;
      if ($scope.curr > $scope.messageLength - 1)
        {$scope.curr = $scope.messageLength - 1;}
    }

    $scope.goLeft = function() {
      $scope.curr = $scope.curr - 1;
      if ($scope.curr < 0)
        {$scope.curr = 0;}
    }

    var updateTest = function(){
      var test = localStorage.getItem('snail_test');

      if(typeof test !== undefined)
      {
        $scope.tester = test;
        if ($scope.tester == 'True')
        {
          getUserMessages();
        }
      }
    }

    supersonic.ui.views.current.whenVisible( function(){
      var clickParams = steroids.view.params.id;
      var arr = clickParams.split(",");
      $scope.user = arr[0]
      $scope.sender = arr[1];
    });

    getUserMessages();



    $interval(getUserMessages, 15000);
    $interval(updateTest, 1000);

  });
