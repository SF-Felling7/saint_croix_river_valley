myApp.controller('MapCtrl', function($http, NgMap, $interval) {

  var vm = this;

  NgMap.getMap().then(function(map) {
    vm.map = map;
  });

  vm.dining = function() {
    console.log('dining button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getDining'
    }).then(function success( response ){
      console.log( 'getting dining pins', response );
      vm.diningPins = response.data;
      console.log('vm.diningPins: ', vm.diningPins);
    });//ending success
  };//ending dining function
  vm.dining();

  vm.lodging = function(){
    console.log('lodging button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getLodging'
    }).then(function success( response ){
      console.log('getting lodging', response);
      vm.lodgingPins = response.data;
      console.log('vm.lodgingPins: ', vm.lodgingPins);
    });//ending success
  };//ending lodging function
  vm.lodging();

  vm.nature = function(){
    console.log('nature button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getNature'
    }).then(function success( response ) {
      console.log( 'getting nature', response );
      vm.naturePins = response.data;
      console.log('vm.naturePins: ', vm.naturePins);
    });//ending success
  };//ending nature function
  vm.nature();

  vm.shopping = function(){
    console.log('shopping button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getShopping'
    }).then(function success( response ) {
      console.log( 'getting shopping', response );
      vm.shoppingPins = response.data;
      console.log('vm.shoppingPins: ', vm.shoppingPins);
    });//ending success
  };//ending shopping function
  vm.shopping();

  var h = parseInt(window.innerHeight);
  var w = parseInt(window.innerWidth);

  vm.openRightOne = function () {
    if(w <= 544) {
      vm.openNav();
    } else {
      vm.openNavPush();
    }
  };

  vm.closeRightOne = function(){
    if(w <= 544) {
      vm.closeNav();
    } else {
      vm.closeNavPush();
    }
  };

  // use this code if you want to slide on top of content
  /* Set the width of the side navigation to 250px */
  vm.openNav = function() {
    console.log('toggle hamburger menu');
      if (  document.getElementById('mySidenav').style.width === '25%') {
        document.getElementById('mySidenav').style.width = '0%';
      }
      else {
        document.getElementById('mySidenav').style.width = '25%';
      }
  };

  /* Set the width of the side navigation to 0 */
  vm.closeNav = function () {
      document.getElementById('mySidenav').style.width = '0';
      console.log('x close button clicked');
  };

  vm.suggested = function(){
    console.log('suggested clicked');
  };

  vm.showDetail = function(e, place) {
    console.log('in show detail function for ', place);
    vm.place = place;
    vm.map.showInfoWindow('foo-iw', vm.place.id);
  };

  vm.hideDetail = function() {
    vm.map.hideInfoWindow('foo-iw');
  };

});//end myapp controller
