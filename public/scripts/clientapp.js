var myApp = angular.module('myApp', ['ngRoute', 'ngMap', 'firebase', 'ui.bootstrap']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  // get rid of 1.6.4 #!
  // $locationProvider.hashPrefix('');

  $routeProvider
    .when('/', {
      templateUrl: '/views/pages/map.html',
      controller: "MapCtrl as mc"
    })
    .when('/admin', {
      templateUrl: '/views/pages/admin.html',
      controller: "FirebaseCtrl as fc"
    });
    // .otherwise({
    //   redirectTo: '/map'
    // });
    $locationProvider.html5Mode(true);
}]);
