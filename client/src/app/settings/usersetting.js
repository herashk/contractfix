angular.module('app.usersetting', [])

.controller('usersettingController', function ($scope, $rootScope, $window, $location, $http, Auth, $timeout) {

	$scope.user = $rootScope.fullname;
	$scope.email = $rootScope.username;
  var token = $rootScope.token;

  $scope.updateEmail = function(newEmail){

  	$http({
      method: 'POST',
      url: '/updateprofile',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type' : 'application/json'
      },
      data: {
        'username': newEmail
      }
    })
    .success(function(data){
      $scope.flag = true;
      $scope.response = data;
    })
    .catch(function(err){
      console.log(err);
    })
  }

   $scope.updateName = function(newName){

  	$http({
      method: 'POST',
      url: '/updateprofile',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type' : 'application/json'
      },
      data: {
        'fullname': newName
      }
    })
    .success(function(data){
      $scope.flag = true;
      $scope.response = data;
    })
    .catch(function(err){
      console.log(err);
    })
  }


  $scope.inputType = 'password';
  $scope.hideShowPassword = function(){
    if($scope.inputType === 'password'){
      $scope.inputType = 'text';
    } else {
      $scope.inputType = 'password';
    }
  };

   $scope.resetPassword = function(newPassword){
     console.log(newPassword);
     $http({
      method: 'POST',
      url: '/resetpassword',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: {
        'password': newPassword
      }
    }).success(function(data){
      $scope.flag = true;
      $scope.response = data;
      $scope.counter = 5;

      $scope.onTimeout = function(){
      if($scope.counter > 0){
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);
       } else {
        $scope.counter = 0;
       }
      }
      var mytimeout = $timeout($scope.onTimeout, 1000);
      $timeout(function(){ $location.path("/login")}, 5000);

     })
     .catch(function(err){
      console.log(err);
     })
   };

   
});