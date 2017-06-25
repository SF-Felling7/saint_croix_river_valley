myApp.controller('MapCtrl', function($http, NgMap, $interval, $uibModal) {

  var vm = this;

  vm.showDining = true;
  vm.showLodging = true;
  vm.showNature = true;
  vm.showShopping = true;

  // NgMap.getMap().then(function(map) {
  //   console.log(map.getCenter());
  //   vm.map = map;
  // });


  NgMap.getMap().then(function(map) {
    vm.map = map;
  });


  vm.clicked = function(place, size, parentSelector) {
    var parentElem = parentSelector;
    console.log('link clicked to see more info on: ', place);
    var modalInstance = $uibModal.open({
      animation: self.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'detailedPlaceInfo.html',   // HTML in the modal.html template???
      controller: 'detailedPlaceInfoCtrl',
      controllerAs: 'dpic',
      size: size,
      appendTo: parentElem,
      resolve: {
        place: function(){
          return place;
        }
      }
    });  // end modalInstance
  };

  vm.showDetail = function(e, place) {
    console.log('place: ', place);
    console.log('place.id: ', place.id);
    vm.place = place;
    vm.map.showInfoWindow('mapwindow', 'x'+place.id);
  };

  vm.hideDetail = function() {
    vm.map.hideInfoWindow('mapwindow');
  };

  vm.dining = function() {
    console.log('dining button clicked');
    $http({
      method: 'GET',
      url: '/locations/getDining'
    }).then(function success(response) {
      console.log('getting dining pins', response);
      vm.diningPins = response.data;
      console.log('vm.diningPins: ', vm.diningPins);

    }); //ending success
  }; //ending dining function
  vm.dining();


  vm.toggleDining = function() {
    vm.showDining = !vm.showDining;
    console.log(vm.showDining);
  };

  vm.lodging = function() {
    console.log('lodging button clicked');
    $http({
      method: 'GET',
      url: '/locations/getLodging'
    }).then(function success(response) {
      console.log('getting lodging', response);
      vm.lodgingPins = response.data;
      console.log('vm.lodgingPins: ', vm.lodgingPins);
    }); //ending success
  }; //ending lodging function
  vm.lodging();

  vm.toggleLodging = function() {
    vm.showLodging = !vm.showLodging;
    console.log(vm.showLodging);
  };

  vm.nature = function() {
    console.log('nature button clicked');
    $http({
      method: 'GET',
      url: '/locations/getNature'
    }).then(function success(response) {
      console.log('getting nature', response);
      vm.naturePins = response.data;
      console.log('vm.naturePins: ', vm.naturePins);
    }); //ending success
  }; //ending nature function
  vm.nature();

  vm.toggleNature = function() {
    vm.showNature = !vm.showNature;
    console.log(vm.showNature);
  };

  vm.shopping = function() {
    console.log('shopping button clicked');
    $http({
      method: 'GET',
      url: '/locations/getShopping'
    }).then(function success(response) {
      console.log('getting shopping', response);
      vm.shoppingPins = response.data;
      console.log('vm.shoppingPins: ', vm.shoppingPins);
    }); //ending success
  }; //ending shopping function
  vm.shopping();

  vm.toggleShopping = function() {
    vm.showShopping = !vm.showShopping;
    console.log(vm.showShopping);
  };

  var h = parseInt(window.innerHeight);
  var w = parseInt(window.innerWidth);

  vm.openRightOne = function() {
    if (w <= 544) {
      vm.openNav();
    } else {
      vm.openNavPush();
    }
  };

  vm.closeRightOne = function() {
    if (w <= 544) {
      vm.closeNav();
    } else {
      vm.closeNavPush();
    }
  };

  // use this code if you want to slide on top of content
  vm.openNav = function() {

    console.log('toggle hamburger menu');
    if (document.getElementById('mySidenav').style.width === '25%') {
      document.getElementById('mySidenav').style.width = '0%';
    } else {
      document.getElementById('mySidenav').style.width = '25%';
    }

  };

  /* Set the width of the side navigation to 0 */
  vm.closeNav = function() {
    document.getElementById('mySidenav').style.width = '0';
    console.log('x close button clicked');
  };

  vm.suggested = function() {
    console.log('suggested clicked');
  };

});

myApp.controller( 'detailedPlaceInfoCtrl', [ '$uibModalInstance', '$uibModal', 'place', function ( $uibModalInstance, $uibModal, place ) {
  var vm = this;

  console.log( 'in detailed place info controller for place: ', place);

  vm.name = place.name;
  vm.phone = place.phone;
  vm.street = place.street;
  vm.city = place.city;
  vm.state = place.state;
  vm.zipcode = place.zipcode;
  vm.website = place.website;
  vm.description = place.description;

  // when OK button is clicked on modal
  vm.okay = function () {
    console.log('okay button clicked--modal closing');
    $uibModalInstance.close();
  }; // end ok

}]); // end activityModalInstanceCtrl
