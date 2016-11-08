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

    $scope.publicIds = [];

    // James' Cloudinary Account
    // $.cloudinary.config({ cloud_name: 'ddwxpmknv', api_key: "834654812264824"});
    // $('.upload_form').append($.cloudinary.unsigned_upload_tag("qx113r10",
    //   { cloud_name: 'ddwxpmknv' }));

    // Lenny's Cloudinary Account
    $.cloudinary.config({cloud_name: "daxutqqyt"});

    // For Android
    $(".cloudinary_fileupload").attr("accept", "image/*;capture=camera");

    $('.upload_form').append($.cloudinary.unsigned_upload_tag("mmbawtto",
      { cloud_name: 'daxutqqyt', tags: "browser_uploads"}))

    .bind("cloudinarydone", function(e, data) {
      $(".preview").append("<div id="+ data.result.public_id+"></div>");
      $("#"+data.result.public_id).append($.cloudinary.image(data.result.public_id,
        { format: data.result.format, version: data.result.version,
          crop: "fill", width: 300, height: 300}))
        // .append("<button class="+data.result.public_id+">X</button>");

      $scope.publicIds.push(data.result.public_id);
      // supersonic.logger.log("public IDs: ");
      // supersonic.logger.log($scope.publicIds);
      $scope.image = "http://res.cloudinary.com/daxutqqyt/image/upload/v1478125497/" + $scope.publicIds.pop();
      // supersonic.logger.log("image: ");
      // supersonic.logger.log($scope.image);
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


    $scope.user = '';

    $scope.pass_hash = '';
    $scope.messages = undefined;
    $scope.test = undefined;
    $scope.senders = undefined;
    $scope.show_val = false;


    var date = new Date(Date.now());
    $scope.currHour = date.getHours();

    firebase.initializeApp(config);
    var database = firebase.database();

    var getSenders = function() {

      var username = '/users/' + $scope.user + '/messages/';
      var userinfo;
      supersonic.logger.log("hi");

      //supersonic.logger.log(username);

      //update current time
      var date = new Date(Date.now());
      var curr_min = date.getMinutes();
      $scope.currHour = date.getHours();
      if (curr_min > $scope.delay)
      {
        $scope.currHour = $scope.currHour + 1;
      }
      if ($scope.currHour > 12)
      {
        $scope.currHour = $scope.currHour - 12;
      }
      if ($scope.currHour == 0)
      {
        $scope.currHour = 12;
      }

      //Get list of senders
      database.ref(username).once('value').then(function(snapshot) {
        userinfo = snapshot.val();

        $scope.senders = Object.keys(userinfo);
        //$scope.pass_hash = userinfo['password'];
        supersonic.logger.log($scope.senders);
        //supersonic.logger.log($scope.pass_hash);
      });

    };


    $scope.image = 'http://images.hellogiggles.com/uploads/2015/03/08/purple-suede.jpg';

    $scope.caption = "";
    $scope.receiver = "";

    $scope.pushData = function() {

      var recv_acc = '/users/' + $scope.receiver + '/messages/' + $scope.user;
      var ref = database.ref().child(recv_acc);

      ref.push({
        'image': $scope.image,
        'message': $scope.caption,
        // 'sender': $scope.user,
        'timestamp': Date.now()
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
      $scope.show_val = false;
      window.scrollTo(0, 0);

    };

    $interval(getSenders, 1000);
    //$interval(updateTime, 30000);

  });
