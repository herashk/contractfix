angular.module('app.verifyemail', [])

.controller('verifyEmailController', function ($scope, $rootScope, $window, $location, $http, $timeout) {

   var url = $location.url();
   var token = url.slice(url.indexOf("=")).slice(1);

   $http({
    method: 'POST',
    url: '/verifyemail',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    data: {}
    })
   .success(function(data){
    $scope.response = data;
    $timeout(function(){ $location.path("/login")}, 5000);
   })
   .catch(function(err){
    $scope.response = err.data.message;
    $timeout(function(){ $location.path("/login")}, 5000);
    console.log(err);
   })

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


});


