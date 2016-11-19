angular
  .module('Feed')
  .controller('PostController', function($scope, $interval, $timeout, supersonic){


    var width = window.innerWidth;
   // Lenny's Cloudinary Account

    var config = {
      apiKey: "AIzaSyDAuhBy07kgbtxrkWjHu76bS7-Rvsr2Oo8",
      authDomain: "purple-b06c8.firebaseapp.com",
      databaseURL: "https://purple-b06c8.firebaseio.com",
      storageBucket: "purple-b06c8.appspot.com",
      messagingSenderId: "396973912921"
    };


    firebase.initializeApp(config);
    var database = firebase.database();
    $scope.publicIds = [];

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

    $scope.user = localStorage.getItem('snail_usr');



    $scope.image = 'http://images.hellogiggles.com/uploads/2015/03/08/purple-suede.jpg';

    $scope.pushData = function() {

      var recv_acc = '/users/' + $scope.receiver + '/messages/' + $scope.user;
      var ref = database.ref().child(recv_acc);

      var currentTime = Date.now();
      var futureTime = Math.floor(2000*60 + 3000*60*Math.random()) + currentTime ;

      var data = {
        'image': $scope.image,
        'message': $scope.caption,
        'timestamp': currentTime,
        'timestampFuture': futureTime,
        'read': 0,
        'delivered': 0
      }


      ref.push(data);

      $scope.image = "";
      $scope.caption = "";
      $scope.receiver = "";

      $(".preview").empty();

      supersonic.ui.layers.pop();
    }

  if ($scope.user) {
    $scope.contacts = [];
    $scope.loadContact = (function() {
      var ref = "/users/" + $scope.user + "/contacts";
      database.ref(ref).once('value').then(function (snapshot) {
        var data = snapshot.val();
        for (var prop in data) {
          $scope.contacts.push(data[prop]);
        }
      })

    })();
  }

  $scope.contactVisible = false;
  $scope.searchUser = "";
  $scope.showContacts = function () {
    $scope.contactVisible = true;

  }
  $scope.selectFriend = function(input) {
    $scope.receiver = input;
    $scope.contactVisible = false;
  }



});