myApp.controller("FirebaseCtrl", function($firebaseAuth, $http, $uibModal) {
  var auth = $firebaseAuth();
  var self = this;

  self.loggedIn = false;
  self.loggedOut = true;

//Register with email and password
  self.registerWithEmail = function(email, password){
    if (!email || !password){
      alert ('email and password required to register');
      return console.log('email and password required!');
    }
    console.log('registering:', email, password);
    self.loggedIn = true;
    self.loggedOut = false;

    auth.$createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("sign in error", error);
      if (error){
      self.loggedIn = false;
      self.loggedOut = true;
      }
      alert ('please use a valid email and password that is at least 6 characters long');
    });
  };//end register and sign in with email

//Sign in with Email
  self.signInWithEmail = function (email, password){
      if (!email || !password){
        alert ('email and password required');
        return console.log('email and password required!');
      }
      console.log('signing in with:', email, password);

    auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
      console.log('firebaseUser: ', firebaseUser);
      console.log("Firebase Authenticated as: ", firebaseUser.email, firebaseUser.uid);
      if(firebaseUser) {
      self.loggedIn = true;
      self.loggedOut = false;
      }

    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      alert ('user not found');
    });
  };//end sign in with email

  //sign in with google!!
  // This code runs whenever the user logs in
  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log(firebaseUser);
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName, firebaseUser.user.uid);
      if(firebaseUser) {
      self.loggedIn = true;
      self.loggedOut = false;
      }
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };//end sign in with google

  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/privateData',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.secretData = response.data;
        }).catch(function(error){
          self.logOut();
          console.log("login error: not an admin");
          alert("Sorry! you do not have admin status!");
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.secretData = "Log in to get some secret data.";
    }
  });

  // This code runs when the user logs out
  self.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
      self.loggedIn = false;
      self.loggedOut = true;
    });
  };

//end firebase functions


// Admin Place function
  self.adminPlace = function(place, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin places button clicked for action: ', place);
    $http ({
      method: 'GET',
      url: '/pool/getPlaces'
    }).then(function success( response ){
      self.allPlaces = response.data;
      console.log('getting all places: ', self.allPlaces);
      allPlaces = self.allPlaces;
      if (place === 'Add Place') {
        var modalInstance = $uibModal.open({
          animation: self.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'addPlaceModalContent.html',   // HTML in the admin.html template
          controller: 'AddPlaceModalInstanceController',
          controllerAs: 'apmic',
          size: size,
          appendTo: parentElem,
          resolve: {
          }
        });  // end add place modalInstance
      } else {
        var editDeleteModalInstance = $uibModal.open({
          animation: self.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editDeletePlaceModal.html',   // HTML in the admin.html template
          controller: 'EditDeletePlace',
          controllerAs: 'edp',
          size: size,
          appendTo: parentElem,
          resolve: {
            allPlaces: function() {
              return allPlaces;
            }
          }
        });  // end edit delete modal Instance
      }

    });//ending success
  }; // end admin Place Modal

// Admin Trip Function
  self.adminTrip = function(trip, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin trip button clicked for action: ', trip);

    $http ({
      method: 'GET',
      url: '/pool/getPlaces'
    }).then(function success( response ){
      self.allPlaces = response.data;
      console.log('getting all places: ', self.allPlaces);
      allPlaces = self.allPlaces;

      var modalInstance = $uibModal.open({
        animation: self.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addTripModalContent.html',
        controller: 'AddTripModalInstanceController',
        controllerAs: 'atmic',
        size: size,
        appendTo: parentElem,
        resolve: {
          allPlaces: function() {
            return allPlaces;
          }
        }
      });  // end modalInstance
    });//ending success
  }; // end adminTrip
});//end controller


// modal controller
myApp.controller( 'AddPlaceModalInstanceController', [ '$uibModalInstance', '$uibModal','$http', function ( $uibModalInstance, $uibModal, $http ) {
  var vm = this;
  vm.addPlaceTitle = 'Add a Place';

  //Add Place function
  vm.addNewPlace = function(place){
    var itemToSend = {
      name: place.name,
      description: place.description,
      street: place.street,
      city: place.city,
      zipcode: place.zipcode,
      state: place.state,
      phone: place.phone,
      website: place.website,
      imageurl: '',
      latitude:'',
      longitude:'',
      types_id: place.types_id,

    };

    console.log('sending place to google to get coordinates: ', place);
    //geocode address that is entered by admin
    $http ({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      params:{address: place.street + place.city + place.state,
            key:'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
            }
    }).then(function success( response ){
      console.log(response.data.results);
      console.log("returned coordinates:",response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng);

      //set latitude and logitude in item to send equal to geocoded response
      itemToSend.latitude = response.data.results[0].geometry.location.lat;
      itemToSend.longitude = response.data.results[0].geometry.location.lng;
      var locationToSend = [response.data.results[0].geometry.location.lat,response.data.results[0].geometry.location.lng];


      //send itemToSend to server for google places api
      $http ({
        method: 'GET',
        url: '/googlePlaces',
        params: {
          location: locationToSend,
          query: place.street,
          key:'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
        }
      }).then(function success(response ){
        console.log("magic photo url link:",response.data);

        itemToSend.imageurl = response.data;
        console.log("saving Object",itemToSend);


        //post new item with latitude and logitude to DB
        $http ({
          method: 'POST',
          url: '/pool/addPlace',
          data: itemToSend
        }).then(function success( response ){
          console.log('response: ', response);
          document.getElementById('addPlaceForm').reset();
          if (response.status === 201){
            swal("Success!", "You added a place to the map!", "success");
              $uibModalInstance.close();
          } else {
            swal("Uh-oh!", "Your changes were not submitted to the map. Try again.");
            }
        });//ending success
      });
      //end send to server for google places

    }, function error(response){
      console.log('nope');

      document.getElementById('addPlaceForm').reset();


    });//end geocode
  };//end add place

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end AddPlaceModalInstanceController

// edit delete place modal controller
myApp.controller( 'EditDeletePlace', [ '$uibModalInstance', '$uibModal','$http', 'allPlaces', '$routeParams', function ( $uibModalInstance, $uibModal, $http, allPlaces, $routeParams ) {
  var vm = this;
  vm.title = 'Edit or Delete a Place';
  vm.allPlaces = allPlaces;

  vm.delete = function(id) {
    console.log('id to delete', id);
    swal({
      title: "Are you sure?",
      text: "This will remove this location from the map!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    },
    function(){
      $http ({
        method: 'DELETE',
        url: '/pool/deletePlace/' + id
      }).then(function success( response ){
        console.log('response: ', response);
        // maybe add an if/else statement here to display a success message if response of 201 is received
        if (response.status === 200){
          swal("Deleted!", "The location was been deleted.", "success");
            $uibModalInstance.close();
        } else {
          swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
        }
      }
    );//ending success
  });
};//end delete Item

  vm.edit = false;
  vm.editInPlace = function(place) {
    vm.edit = true;
    vm.place = place;
    console.log('vm.place: ', vm.place);
  };


  vm.saveEdits = function(place) {
    console.log('edited place to submit to db', place.name);
    var editsToSend = {
      id: place.id,
      name: place.name,
      street: place.street,
      city: place.city,
      state: place.state,
      zipcode: place.zipcode,
      website: place.website,
      phone: place.phone,
      description: place.description,
      imageurl: place.imageurl,
      latitude: place.latitude,
      longitude: place.longitude,
      types_id: place.types_id
    };
    $http ({
      method: 'PUT',
      url: '/pool/editPlace',
      data: editsToSend
    }).then(function success( response ){
      console.log('response: ', response);
      vm.edit = false;
      // maybe add an if/else statement here to display a success message if response of 200 is received
      if (response.status === 200){
        swal("Success!", "Your changes were submitted to the map!", "success");
          $uibModalInstance.close();
      } else {
        swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
      }
    });//ending success
  };//end save edits for place


  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end Edit Delete PlaceModalInstanceController

// add trip modal controller
myApp.controller( 'AddTripModalInstanceController', [ '$uibModalInstance', '$uibModal', 'allPlaces', function ( $uibModalInstance, $uibModal, allPlaces ) {
  var vm = this;
  vm.allPlaces = allPlaces;
  vm.addTripTitle = 'Add a Trip';
  vm.success = false;
  vm.failed = false;
  vm.successMessage = 'Success!  New trip added to database.';
  vm.failedMessage = 'Uh-oh!  New trip failed to be added to database.  Try again.';

  vm.checkedPlaces = [];
  vm.toggleCheck = function (place) {
      if (vm.checkedPlaces.indexOf(place) === -1) {
          vm.checkedPlaces.push(place);
      } else {
          vm.checkedPlaces.splice(vm.checkedPlaces.indexOf(place), 1);
      }
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end AddTripModalInstanceController
