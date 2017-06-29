myApp.controller('MapCtrl', function($http, NgMap, $interval, $uibModal) {

  var vm = this;

  vm.showDining = true;
  vm.showLodging = true;
  vm.showNature = true;
  vm.showShopping = true;

  vm.diningPins = [];
  vm.lodgingPins = [];
  vm.naturePins = [];
  vm.shoppingPins = [];

  vm.diningClass = 'navButton';
  vm.shoppingClass = 'navButton';
  vm.natureClass = 'navButton';
  vm.lodgingClass = 'navButton';

  NgMap.getMap().then(function(map) {
    vm.map = map;
  });

  vm.clicked = function(place, size, parentSelector) {
    //use google place to search for place and return photo reference
    // $http ({
    //   method: 'GET',
    //   url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&key=AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso',
    //   // params:{query: 200,
    //   //       key:'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
    //   //       }
    // }).then(function success( response ){
    //   console.log(response);
    // });

    // use google places to grab photos with returned photoreference
    // $http ({
    //   method: 'GET',
    //   url: 'https://maps.googleapis.com/maps/api/place/photo',
    //   params:{maxwidth: 200,
    //             photoreference:'CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU',
    //         key:'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
    //         }
    // }).then(function success( response ){
    //   console.log(response);
    // });

    var parentElem = parentSelector;
    console.log('link clicked to see more info on: ', place);


    var modalInstance = $uibModal.open({
      animation: self.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'detailedPlaceInfo.html', // HTML in the modal.html template???
      controller: 'detailedPlaceInfoCtrl',
      controllerAs: 'dpic',
      size: size,
      appendTo: parentElem,
      resolve: {
        place: function() {
          return place;
        }
      }
    }); // end modalInstance
  };//end clicked


  vm.showDetail = function(e, place) {
    console.log('place: ', place);
    console.log('place.id: ', place.id);
    vm.place = place;
    vm.map.showInfoWindow('mapwindow', 'x' + place.id);
  };

  vm.hideDetail = function() {
    vm.map.hideInfoWindow('mapwindow');
  };

  vm.getAllPins = function() {
    console.log('dining button clicked');
    $http({
      method: 'GET',
      url: '/locations/getAllPins'
    }).then(function success(response) {
      console.log('getting all pins', response);
      vm.allPins = response.data;
      console.log('vm.allPins: ', vm.allPins);
      allPins = vm.allPins;

      for (var i = 0; i < allPins.length; i++) {
        switch (allPins[i].types_id) {
          case 1:
            vm.diningPins.push(allPins[i]);
            break;
          case 2:
            vm.shoppingPins.push(allPins[i]);
            break;
          case 3:
            vm.naturePins.push(allPins[i]);
            break;
          case 4:
            vm.lodgingPins.push(allPins[i]);
            break;
        }
      }
    }); //ending success
  }; //ending get allPins function
  vm.getAllPins();

  vm.toggleDining = function() {
    vm.showDining = !vm.showDining;
    console.log(vm.showDining);
    if (vm.diningClass === 'navButton') {
      vm.diningClass = 'off';
    } else {
      vm.diningClass = 'navButton';
    }
  };


  vm.toggleLodging = function() {
    vm.showLodging = !vm.showLodging;
    console.log(vm.showLodging);
    if (vm.lodgingClass === 'navButton') {
      vm.lodgingClass = 'off';
    } else {
      vm.lodgingClass = 'navButton';
    }
  };


  vm.toggleNature = function() {
    vm.showNature = !vm.showNature;
    console.log(vm.showNature);
    if (vm.natureClass === 'navButton') {
      vm.natureClass = 'off';
    } else {
      vm.natureClass = 'navButton';
    }
  };


  vm.toggleShopping = function() {
    vm.showShopping = !vm.showShopping;
    console.log(vm.showShopping);
    if (vm.shoppingClass === 'navButton') {
      vm.shoppingClass = 'off';
    } else {
      vm.shoppingClass = 'navButton';
    }
  };

  vm.resetMap = function() {
    location.reload();
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

// modal controller
myApp.controller( 'detailedPlaceInfoCtrl', [ '$uibModalInstance', '$uibModal', '$http', 'place', function ( $uibModalInstance, $uibModal, $http, place ) {
  var vm = this;

  console.log('in detailed place info controller for place: ', place);

  vm.name = place.name;
  vm.phone = place.phone;
  vm.street = place.street;
  vm.city = place.city;
  vm.state = place.state;
  vm.zipcode = place.zipcode;
  vm.website = place.website;
  vm.description = place.description;
  vm.imageurl = place.imageurl;


  // when OK button is clicked on modal
  vm.okay = function() {
    console.log('okay button clicked--modal closing');
    $uibModalInstance.close();
  }; // end ok

}]); // end detailedPlaceInfoCtrl
