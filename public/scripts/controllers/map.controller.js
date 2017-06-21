
myApp.controller('MapCtrl', function($http, NgMap, $interval) {

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
