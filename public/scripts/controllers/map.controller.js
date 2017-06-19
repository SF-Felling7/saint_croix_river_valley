myApp.controller('MapCtrl', function($http, NgMap, $interval, $http) {
  var vm = this;

  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    vm.map = map;
  });

  vm.dining = function(){
    console.log('dining button clicked');
  };

  vm.lodging = function(){
    console.log('lodging button clicked');
  };

  vm.nature = function(){
    console.log('nature button clicked');
  };

  vm.shopping = function(){
    console.log('shopping button clicked');
  };

});
