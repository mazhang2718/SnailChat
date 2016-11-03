var orderMsg = function(msg_dict, delay_min) {
  var out = [];

  for (var msg in msg_dict) {

    //get last delivery time
    //only push messages before that delivery time

    var delivery_time = getLastDeliveryTime(delay_min);
    var post_time = parseInt((msg_dict[msg]['timestamp']/1000).toFixed(0));
    supersonic.logger.log(post_time);

    if (post_time <= delivery_time)
    {
      var item = {};
      item.image = msg_dict[msg]['image'];
      item.timestamp = msg_dict[msg]['timestamp'];
      item.timestampFuture = delivery_time*1000;
      item.message = msg_dict[msg]['message'];
      item.sender = msg_dict[msg]['sender'];

      out.push(item);
    }

  }

  return out.reverse();
};

var getLastDeliveryTime = function(delay_min) {
  var date = new Date(Date.now());
  var new_date = date;
  var curr_min = date.getMinutes();
  var ret = 0;

  if (curr_min < delay_min)
  {
    //if not passed subtract an hour
    new_date.setMinutes(delay_min);
    new_date.setSeconds(0);
    var ret = parseInt((new_date.getTime()/1000).toFixed(0)) - 3600
  }
  else 
  {
    //otherwise don't
    new_date.setMinutes(delay_min);
    new_date.setSeconds(0);
    var ret = parseInt((new_date.getTime()/1000).toFixed(0))
  }

  supersonic.logger.log(ret);
  return ret;
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
    $scope.delay = 45;
    $scope.pass_hash = '';
    $scope.messages = undefined;
    $scope.test = undefined;
    $scope.show_val = false;
    var date = new Date(Date.now());
    $scope.currHour = date.getHours();
    firebase.initializeApp(config);
    var database = firebase.database();

    var getUserMessages = function() {

      var username = '/users/' + $scope.user;
      var userinfo;

      //supersonic.logger.log(username);
      
      //update current time
      var date = new Date(Date.now());
      var curr_min = date.getMinutes();
      $scope.currHour = date.getHours();
      if (curr_min > $scope.delay)
        {$scope.currHour = ($scope.currHour + 1)%12;}

      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();

        $scope.messages = orderMsg(userinfo['messages'], $scope.delay);
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
        'timestamp': Date.now()
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
      if ($scope.delay < 1)
      {
        $scope.delay = 1;
      }
      else if ($scope.delay > 59)
      {
        $scope.delay = 59;
      }

    }

    $scope.showUser = function() {

      $scope.show_val1 = !$scope.show_val1;
      window.scrollTo(0, 0);

    };

    $interval(getUserMessages, 3000);
    //$interval(updateTime, 30000);

  });