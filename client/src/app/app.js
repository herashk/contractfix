var app = angular.module('app', [
    'ngRoute',
    'app.auth',
    'app.dashboard',
    'app.services',
    'app.editor',
    'app.forgotPassword',
    'app.resetPassword',
    'app.verifyemail',
    'app.signup2',
    'app.usersetting',
    'app.invitation',
    'app.templates',
    'app.signature'
    ]);


app.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
    })
    .when('/login', {
    	templateUrl: 'app/auth/login.html',
    	controller: 'AuthController',
    })
    .when('/signup', {
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthController'
    })
    .when('/signup2', {
        templateUrl: 'app/auth/signup2.html',
        controller: 'signup2Controller'
    })
    .when('/verifyemail', {
        templateUrl: 'app/auth/verifyemail.html',
        controller: 'verifyEmailController'
    })
    .when('/forgotpassword', {
        templateUrl: 'app/settings/forgotpassword.html',
        controller: 'forgotPasswordController'
    })
    .when('/resetpassword', {
        templateUrl: 'app/settings/resetpassword.html',
        controller: 'resetPasswordController'
    })
    .when('/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
    .when('/editor', {
        templateUrl: 'app/editor/editor.html',
        controller: 'EditorController',
        reloadOnSearch: false
    })
    .when('/contactus', {
        templateUrl: 'app/about/contactus.html',
    })
     .when('/howitworks', {
        templateUrl: 'app/about/howitworks.html',
    })
    .when('/whatisit', {
        templateUrl: 'app/about/whatisit.html'
    })
    .when('/usersetting', {
        templateUrl: 'app/settings/usersetting.html',
        controller: 'usersettingController'
    })
    .when('/invitation', {
        templateUrl: 'app/invitation/invitation.html',
        controller: 'invitationController'
    })
    .when('/templates', {
        templateUrl: 'app/templates/templates.html',
        controller: 'TemplatesController'
    })
    .when('/signatures', {
        templateUrl: 'app/signature/signature.html',
        controller: 'SignatureController'
    })
    .when('/signed', {
        templateUrl: 'app/signature/signature.html',
        controller: 'SignatureController'
    })
    // .when('/prepareSig', {
    //     templateUrl: 'app/editor/prepareSig.html',
    // })

});



app.run(function ($rootScope, $location, Auth) {
//   // here inside the run phase of angular, our services and controllers
//   // have just been registered and our app is ready
//   // however, we want to make sure the user is authorized
//   // we listen for when angular is trying to change routes
//   // when it does change routes, we then look for the token in localstorage
//   // and send that token to the server to see if it is a real user or hasn't expired
//   // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    var isPublicRoute = ['/dashboard', '/editor'].indexOf(next.$$route.originalPath) === -1;
    if (next.$$route && !isPublicRoute && !Auth.isAuth()) {
      $location.path('/login');
    }
  });

  if (Auth.isAuth())
    Auth.refresh();
});
