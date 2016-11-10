
angular
  .module('Feed')
  .controller('LoginController', function($scope, $rootScope, $interval, supersonic) {
    // Controller functionality here
  	// Firebase Setting


    $scope.delay = undefined;
    $scope.user = undefined;

    var date = new Date(Date.now());
    $scope.currHour = date.getHours();


    $scope.pushDataUser = function() {

      // if ($scope.delay < 1)
      // {
      //   $scope.delay = 1;
      // }
      // else if ($scope.delay > 59)
      // {
      //   $scope.delay = 59;
      // }

      // var user = $scope.user;
      // var delay = $scope.delay;

      // accountService.addInfo(user,delay);



      // supersonic.logger.log(user);

      supersonic.ui.initialView.dismiss();

    }
    

  });
