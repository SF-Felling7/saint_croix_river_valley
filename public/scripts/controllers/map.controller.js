myApp.controller('MapCtrl', function($http, NgMap, $interval) {
  var vm = this;

  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    vm.map = map;
  });


  // $scope.map .. this exists after the map is initialized



  // var markers = [];
  // for (var i=0; i<8 ; i++) {
  //   markers[i] = new google.maps.Marker({
  //     title: "Hi marker " + i
  //   });
  // }
  // vm.GenerateMapMarkers = function() {
  //     vm.date = Date(); // Just to show that we are updating
  //
  //     var numMarkers = Math.floor(Math.random() * 4) + 4;  // betwween 4 & 8 of them
  //     for (i = 0; i < numMarkers; i++) {
  //         var lat =   44.9666;
  //         var lng = 92.3744;
  //         // You need to set markers according to google api instruction
  //         // you don't need to learn ngMap, but you need to learn google map api v3
  //         // https://developers.google.com/maps/documentation/javascript/markers
  //         var latlng = new google.maps.LatLng(lat, lng);
  //         markers[i].setPosition(latlng);
  //         markers[i].setMap(vm.map);
  //     }
  // };
  // // $interval( vm.GenerateMapMarkers, 2000);

});  // end MapCtrl
