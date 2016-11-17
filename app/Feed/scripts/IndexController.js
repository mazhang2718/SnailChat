var getLastDeliveryTime = function(delay_min) {
  var date = new Date(Date.now());
  var new_date = date;
  var curr_min = date.getMinutes();
  var ret = 0;

  if (curr_min < delay_min) {
    //if not passed subtract an hour
    new_date.setMinutes(delay_min);
    new_date.setSeconds(0);
    var ret = parseInt((new_date.getTime() / 1000).toFixed(0)) - 3600
  } else {
    //otherwise don't
    new_date.setMinutes(delay_min);
    new_date.setSeconds(0);
    var ret = parseInt((new_date.getTime() / 1000).toFixed(0))
  }

  return ret;
};


angular
  .module('Feed')
  .controller('IndexController', function($scope, $interval, $timeout, supersonic) {
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
    $scope.delay = undefined;

    $scope.publicIds = [];

    // James' Cloudinary Account
    // $.cloudinary.config({ cloud_name: 'ddwxpmknv', api_key: "834654812264824"});
    // $('.upload_form').append($.cloudinary.unsigned_upload_tag("qx113r10",
    //   { cloud_name: 'ddwxpmknv' }));

    // Lenny's Cloudinary Account
    $.cloudinary.config({
      cloud_name: "daxutqqyt"
    });

    // For Android
    $(".cloudinary_fileupload").attr("accept", "image/*;capture=camera");

    $('.upload_form').append($.cloudinary.unsigned_upload_tag("mmbawtto", {
      cloud_name: 'daxutqqyt',
      tags: "browser_uploads"
    }))

    .bind("cloudinarydone", function(e, data) {
      $(".preview").append("<div id=" + data.result.public_id + "></div>");
      $("#" + data.result.public_id).append($.cloudinary.image(data.result.public_id, {
          format: data.result.format,
          version: data.result.version,
          crop: "fill",
          width: 300,
          height: 300
        }))
        // .append("<button class="+data.result.public_id+">X</button>");

      $scope.publicIds.push(data.result.public_id);
      $scope.image = "http://res.cloudinary.com/daxutqqyt/image/upload/v1478125497/" + $scope.publicIds.pop();
      $(".progress_bar").css("width", 0 + "%");
      flag = true;
      if (flag) {
        $("#placeholder").css("display", "none");
      }
    })

    .bind("cloudinaryprogress", function(e, data) {
      $(".progress_bar").css("width",
        Math.round((data.loaded * 100.0) / data.total) + "%");
    });


    $scope.user = "";

    $scope.pass_hash = '';
    $scope.messages = undefined;
    $scope.test = undefined;
    $scope.senders = undefined;
    $scope.icons = undefined;
    $scope.show_val = false;
    $scope.show_alert = false;


    $scope.pending = false;
    $scope.delivered = false;
    $scope.alertMessage = "No new updates ):";
    $scope.triggerModal = false;


    var pendingMessages = 0;
    var deliveredMessages = 0;




    var date = new Date(Date.now());
    $scope.currHour = date.getHours();

    firebase.initializeApp(config);
    var database = firebase.database();


var updateTime = function(){





      //update current time
      var date = new Date(Date.now());
      var curr_min = date.getMinutes();
      $scope.currHour = date.getHours();
      if (curr_min > $scope.delay) {
        $scope.currHour = $scope.currHour + 1;
      }
      if ($scope.currHour > 12) {
        $scope.currHour = $scope.currHour - 12;
      }
      if ($scope.currHour == 0) {
        $scope.currHour = 12;
      }


}

    var getSenders = function() {

      updateTime();

      var username = '/users/' + $scope.user + '/messages/';
      var userinfo;


      //Get list of senders
      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();
        $scope.senders = Object.keys(userinfo);
        if ($scope.icons == undefined) {
          $scope.icons = {};
          for (var sender in $scope.senders) {
            $scope.icons[$scope.senders[sender]] = '/icons/email_open.svg';
          }
        }


      });

    };


    var unreadMail = function(sender) {

      var query = '/users/' + $scope.user + '/messages/' + sender + '/';
      var messages;



      var userinfo;

      // Get list of messages for sender
      database.ref(query).once('value').then(function(snapshot) {
        userinfo = snapshot.val();
        // Update delivered tag of posts
        var updates = {};
        for (key in Object.keys(userinfo)) {
          key = Object.keys(userinfo)[key];
          var firebase_path = '/users/' + $scope.user + '/messages/' + sender + '/' + key + '/delivered/'
          if (parseInt((userinfo[key]['timestamp'] / 1000).toFixed(0)) <= getLastDeliveryTime($scope.delay)) {
            updates[firebase_path] = 1;
          }
          else{
            updates[firebase_path] = 0;
          }
        }
        database.ref().update(updates);
      });




      database.ref(query).once('value').then(function(snapshot) {
        messages = snapshot.val();

        for (var message in messages) {
          message = messages[message];
          if ((getLastDeliveryTime($scope.delay) > message.timestamp/1000 && message['read'] === 0)) {
            $scope.icons[sender] = '/icons/email.svg';
            deliveredMessages += 1;
            return;
          }
          else if ((getLastDeliveryTime($scope.delay) <= message.timestamp/1000 && message['read'] === 0)){
            pendingMessages += 1;
          }
        }
        $scope.icons[sender] = '/icons/email_open.svg';
      });
    };

    var updateMailIcons = function() {

      //pendingMessages = 0;
      //deliveredMessages = 0;

      for (var sender in $scope.senders) {
        sender = $scope.senders[sender];
        unreadMail(sender);

      }


      if (pendingMessages > 0){
        $scope.pending = true;
      }
      else{
        $scope.pending = false;
      }

      if (deliveredMessages > 0){
        $scope.delivered = true;
      }
      else{
        $scope.delivered = false;
      }

      updateMessage();

    };

    $scope.image = 'http://images.hellogiggles.com/uploads/2015/03/08/purple-suede.jpg';
    $scope.caption = '';
    $scope.receiver = '';

    $scope.pushData = function() {

      var recv_acc = '/users/' + $scope.receiver + '/messages/' + $scope.user;
      var ref = database.ref().child(recv_acc);

      ref.push({
        'image': $scope.image,
        'message': $scope.caption,
        'timestamp': Date.now(),
        'read': 0,
        'delivered': 0
      });

      $scope.show_val = false;


      $scope.image = "";
      $scope.caption = "";
      $scope.receiver = "";

      $(".preview").empty();
    }

    $scope.showPost = function() {

      $scope.show_val = !$scope.show_val;
      $scope.show_val1 = false;
      window.scrollTo(0, 0);

    };

    var showModals = false;
    var pushedDelay = undefined;

    $scope.pushDataUser = function() {

      showModals = false;


      $scope.show_val1 = false;

      if ($scope.delay < 1) {
        $scope.delay = 1;
      } else if ($scope.delay > 59) {
        $scope.delay = 59;
      }

      pushedDelay = $scope.delay;

      updateModals();

       $timeout(function() {
           showModals = true;
        }, 2000);

    }

    $scope.showUser = function() {

      $scope.show_val1 = !$scope.show_val1;
      $scope.show_val = false;
      window.scrollTo(0, 0);

    };



    var updateModals = function(){


        var ref = database.ref("users/" + $scope.user + "/messages");
        
        ref.on("value", function(snapshot){

          var allUsers = snapshot.val();

          var users = Object.keys(allUsers);

          var msg;
          var msgs;
          var user;

          for (var i = 0; i<users.length; i++){

            user = users[i];
            msgs = Object.keys(allUsers[user]);

              for (var j = 0; j<msgs.length; j++) {
                msg = allUsers[user][msgs[j]];
                if (msg['delivered'] == 1 && msg['read'] == 0 && showModals && pushedDelay == $scope.delay) {
                  $scope.modalMessage = "New messages have been delivered for you!";
                  $("#myModal").modal();
                  return;
                }
                else if (msg['delivered'] == 0 && msg['read'] == 0 && showModals && pushedDelay == $scope.delay){
                  $scope.modalMessage = "New messages are being sent to you!";
                  $("#myModal").modal();
                  return;
                }
              }
           }

        });

    }

    

    var updateMessage = function(){

      if ($scope.delivered == true){
        $scope.alertMessage = "New messages have been delivered for you!";
        deliveredMessages = 0;
      }
      else if ($scope.pending == true){
        $scope.alertMessage = "New messages are being sent to you!";
        pendingMessages = 0;
      }
      else{
        $scope.alertMessage = "No new updates ):"
      }

    }

    var logs_temp = localStorage.getItem('snail_usr');
    if(typeof logs_temp !== undefined)
    {
      $scope.user = logs_temp;
    }

    $interval(getSenders, 1000);
    $interval(updateMailIcons, 1000);

  });
