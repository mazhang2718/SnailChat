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

    $scope.messages = undefined;
    $scope.test = undefined;
    $scope.senders = undefined;
    $scope.icons = undefined;
    $scope.show_val = false;
    $scope.show_alert = false;
    $scope.tester = undefined;
    $scope.testVal = false;


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


    var getSenders = function() {


      var username = '/users/' + $scope.user + '/messages/';
      var userinfo;


      //Get list of senders
      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();
        $scope.senders = Object.keys(userinfo);

        if ($scope.icons == undefined) {
          $scope.icons = {};
        }
        var toRemove = [];
        for (var sender in $scope.senders) {
          sender_name = $scope.senders[sender];
          if (noMatureMessages(userinfo[sender_name])) {
            //Remove user from the list of senders
            toRemove.push(sender);
          }
          else {
            if ($scope.icons[sender_name] == null) {
              $scope.icons[sender_name] = '/icons/opened.svg';
            }
          }
          for (var i in toRemove){
            var index = toRemove[i];
            $scope.senders.splice(index, 1);
          }
        }
        var newestPost = function(a) {

          //
          var newest = 0;
          var senderMessages = userinfo[a];
          for (var message in senderMessages) {
            message = senderMessages[message];
            newest = Math.max(message.timestampFuture, newest);
          }
          return newest;
        };

        var newerSender = function(a,b) {
          return newestPost(b) - newestPost(a);
        };

        $scope.senders.sort(newerSender);
      });
    };

    var noMatureMessages = function(messages) {
      for (var message in messages) {
        message = messages[message];

        if (message.timestampFuture <= Date.now()) {
          return false;
        }
      }
      return true;
    };


    var unreadMail = function(sender) {

      var query = '/users/' + $scope.user + '/messages/' + sender + '/';
      var messages;
      var currentTime = Date.now();

      var userinfo;

      // Get list of messages for sender
      database.ref(query).once('value').then(function(snapshot) {
        userinfo = snapshot.val();
        // Update delivered tag of posts
        var updates = {};
        for (key in Object.keys(userinfo)) {
          key = Object.keys(userinfo)[key];
          var firebase_path = '/users/' + $scope.user + '/messages/' + sender + '/' + key + '/delivered/';
          if (userinfo[key]['timestampFuture'] <= currentTime || $scope.tester == 'True') {
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
          if (message['read'] === 0 && message['delivered'] == 1) {
            $scope.icons[sender] = '/icons/not_opened.svg';
            deliveredMessages += 1;
            return;
          }
          else if ((message['read'] === 0)){
            pendingMessages += 1;
          }
        }
        $scope.icons[sender] = '/icons/opened.svg';
      });


    };

    var updateMailIcons = function() {

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


    $scope.showPost = function() {

      $scope.show_val = !$scope.show_val;
      $scope.show_val1 = false;
      window.scrollTo(0, 0);

    };

    var showModals = false;
    var pushedDelay = undefined;


    $scope.showDraw = function() {
      supersonic.ui.drawers.open('leftDrawer');

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
                if (msg['delivered'] == 1 && msg['read'] == 0 && showModals) {
                  $scope.modalMessage = "New messages have been delivered for you!";
                  $("#status").hide();
                  $("#myModal").modal();
                  return;
                }
                else if (msg['delivered'] == 0 && msg['read'] == 0 && showModals){
                  $scope.modalMessage = "New messages are being sent to you!";
                  $("#status").show();
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
        $("#status").show();
        pendingMessages = 0;
      }

      if ($scope.pending != true){
        $("#status").hide();
      }

    }

    var updateTest = function(){

      var test = localStorage.getItem('snail_test');

      if(typeof test !== undefined)
      {
        $scope.tester = test;

        if ($scope.tester == 'True')
        {
          updateMailIcons();
          getSenders();
          $scope.testVal = true;
        }
      }
    }

    var logs_temp = localStorage.getItem('snail_usr');

    if(typeof logs_temp !== undefined)
    {
      $scope.user = logs_temp;
    }

    //localStorage.removeItem('snail_usr');

    getSenders();
    updateMailIcons();

    $timeout(function() {
       showModals = true;
    }, 3000);

    updateModals();

    $interval(getSenders, 10000);
    $interval(updateMailIcons, 5000);
    $interval(updateTest, 1000);
    //$interval(updateTime, 1000);

  });
