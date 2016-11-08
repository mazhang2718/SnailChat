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
  .controller('MessagesController', function($scope, $interval, supersonic) {
    // Controller functionality here
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
    $scope.delay = undefined;
    $scope.user = undefined;

    supersonic.ui.views.current.whenVisible( function(){
      var clickParams = steroids.view.params.id;
      var arr = clickParams.split(",");
      $scope.user = arr[0]
      $scope.sender = arr[1];
      $scope.delay = arr[2];
    });

    var getUserMessages = function() {

      var username = '/users/' + $scope.user + '/messages/' + $scope.sender;
      var userinfo;

      //Get list of messages for sender
      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();
        //$scope.messages = userinfo;
        $scope.messages = orderMsg(userinfo, $scope.delay);

      });

    };

    $interval(getUserMessages, 1000);

  });