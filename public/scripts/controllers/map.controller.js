myApp.controller('MapCtrl', function( $http, NgMap, $interval ) {
  var vm = this;


  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    vm.map = map;
  });

  vm.dining = function() {
    console.log('dining button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getDining'
    }).then(function success( response ){
      console.log( 'getting dining pins', response );

    });//ending success
  };//ending dining function

  vm.lodging = function(){
    console.log('lodging button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getLodging'
    }).then(function success( response ){
      console.log('getting lodging', response);
      
    });//ending success
  };//ending lodging function

  vm.nature = function(){
    console.log('nature button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getNature'
    }).then(function success( response ) {
      console.log( 'getting nature', response );
    });//ending success
  };//ending nature function

  vm.shopping = function(){
    console.log('shopping button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getShopping'
    }).then(function success( response ) {
      console.log( 'getting shopping', response );
    });//ending success
  };//ending shopping function
});
