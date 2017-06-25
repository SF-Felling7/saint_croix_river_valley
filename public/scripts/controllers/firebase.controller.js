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

  self.adminPlace = function(place, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin places button clicked for action: ', place);
    $http ({
      method: 'GET',
      url: '/pool/getPlaces'
    }).then(function success( response ){
      self.allPlaces = response.data;
      console.log('getting all places: ', self.allPlaces);
    });//ending success

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
    });  // end modalInstance
  };

  self.adminTrip = function(trip, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin trip button clicked for action: ', trip);

    var modalInstance = $uibModal.open({
      animation: self.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'addTripModalContent.html',   // HTML in the modal.html template
      controller: 'AddTripModalInstanceController',
      controllerAs: 'atmic',
      size: size,
      appendTo: parentElem,
      resolve: {
      }
    });  // end modalInstance
  };

});//end controller


// modal controller
myApp.controller( 'AddPlaceModalInstanceController', [ '$uibModalInstance', '$uibModal','$http', function ( $uibModalInstance, $uibModal, $http ) {
  var vm = this;
  vm.addPlaceTitle = "Add a Place";
  vm.success = false;
  vm.failed = false;
  vm.successMessage = "New place added to database.";
  vm.failedMessage = "New place failed to be added to database.  Try again.";

  vm.addNewPlace = function(place){
    console.log('place: ', place);
    var itemToSend = {
      name: place.name,
      description: place.description,
      street: place.street,
      city: place.city,
      zipcode: place.zipcode,
      state: place.state,
      phone: place.phone,
      website: place.website,
      types_id: place.types_id
    };
    $http ({
      method: 'POST',
      url: '/pool/addPlace',
      data: itemToSend
    }).then(function success( response ){
      console.log('response: ', response);
      document.getElementById("addPlaceForm").reset();
      // maybe add an if/else statement here to display a success message if response of 201 is received
      if (response.status === 200){
        vm.success = true;
      } else {
        vm.failed = true;
      }
    });//ending success
  };//end add Item


  // when OK button is clicked on modal
  vm.okay = function () {
    console.log('okay button clicked--modal closing');
    $uibModalInstance.close();
  }; // end ok

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end AddPlaceModalInstanceController


// modal controller
myApp.controller( 'AddTripModalInstanceController', [ '$uibModalInstance', '$uibModal', function ( $uibModalInstance, $uibModal ) {
  var vm = this;
  vm.addTripTitle = "Add a Trip";

  // when OK button is clicked on modal
  vm.okay = function () {
    console.log('okay button clicked--modal closing');
    $uibModalInstance.close();
  }; // end ok

}]); // end AddTripModalInstanceController
