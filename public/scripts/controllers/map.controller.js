
myApp.controller('MapCtrl', function($http, NgMap, $interval) {

  var vm = this;
  vm.showDining = true;

  // NgMap.getMap().then(function(map) {
  //   console.log(map.getCenter());
  //   vm.map = map;
  // });

  vm.dining = function() {
    console.log('dining button clicked');
    $http ({
      method: 'GET',
      url: '/locations/getDining'
    }).then(function success( response ){
      console.log( 'getting dining pins', response );
      vm.diningPins = response.data;
      console.log('vm.diningPins: ', vm.diningPins);
      vm.showDining = true;
    });//ending success
  };//ending dining function
  vm.dining();


  vm.toggleDining = function() {
    if (vm.showDining === true) {
    vm.showDining = false;
    console.log( 'vm.showDining :', vm.showDining );
    } else {
      vm.showDining = true;
      console.log( 'vm.showDining ',vm.showDining);
    }
  };

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
      document.getElementById('mySidenav').style.width = '25%';
      console.log('hamburger open button clicked');
  };

  /* Set the width of the side navigation to 0 */
  vm.closeNav = function () {
      document.getElementById('mySidenav').style.width = '0';
      console.log('x close button clicked');
  };


  vm.suggested = function(){
    console.log('suggested clicked');
  };

  // // use this code if you want to push content over when navbar slides in
  // /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  // vm.openNavPush = function () {
  //     document.getElementById('mySidenav').style.width = '300px';
  //     document.getElementById('main').style.marginLeft = '300px';
  //     console.log('open hamburger button clicked');
  // };
  //
  // // /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  // vm.closeNavPush = function () {
  //     document.getElementById('mySidenav').style.width = '0';
  //     document.getElementById('main').style.marginLeft = '0';
  //     console.log('x close button clicked');
  // };



});
