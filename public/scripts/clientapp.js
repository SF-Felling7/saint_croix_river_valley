var myApp = angular.module('myApp', ['ngRoute', 'ngMap', 'firebase', 'ui.bootstrap']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/pages/map.html',
      controller: "MapCtrl as mc"
    })
    .when('/admin', {
      templateUrl: '/views/pages/admin.html',
      controller: "FirebaseCtrl as fc"
    });
    $locationProvider.html5Mode(true);
}]);
