myApp.controller("FirebaseCtrl", function($firebaseAuth, $http, $uibModal) {
  var auth = $firebaseAuth();
  var self = this;

  self.loggedIn = false;
  self.loggedOut = true;

  //Register with email and password
  self.registerWithEmail = function(email, password) {
    if (!email) {
      alert('email to register');
      return console.log('email and password required!');
    }
    console.log('registering:', email, password);
    // self.loggedIn = true;
    // self.loggedOut = false;

    auth.$createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("sign in error", error);
      if (error) {
        self.loggedIn = false;
        self.loggedOut = true;
      }
      alert('please use a valid email and password that is at least 6 characters long');
    });
  }; //end register and sign in with email

  //Sign in with Email
  self.signInWithEmail = function(email, password) {
    if (!email || !password) {
      alert('email and password required');
      return console.log('email and password required!');
    }
    console.log('signing in with:', email, password);

    auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
      console.log('firebaseUser: ', firebaseUser);
      console.log("Firebase Authenticated as: ", firebaseUser.email, firebaseUser.uid);
      if (firebaseUser) {
        self.loggedIn = true;
        self.loggedOut = false;
      }

    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      alert('user not found');
    });
  }; //end sign in with email

  //sign in with google!!
  // This code runs whenever the user logs in
  self.logIn = function() {
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log(firebaseUser);
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName, firebaseUser.user.uid);
      if (firebaseUser) {
        self.loggedIn = true;
        self.loggedOut = false;
      }
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  }; //end sign in with google

  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser) {
    // firebaseUser will be null if not logged in
    if (firebaseUser) {
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken) {
        $http({
          method: 'GET',
          url: '/privateData',
          headers: {
            id_token: idToken
          }

        }).then(function(response) {
          self.adminName = response.data;

        }).catch(function(error){
          self.logOut();
          console.log("login error: not an admin");
          alert("Sorry! You do not have admin status!");
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
    }
  });

  // This code runs when the user logs out
  self.logOut = function() {
    auth.$signOut().then(function() {
      console.log('Logging the user out!');
      self.loggedIn = false;
      self.loggedOut = true;
    });
  };
//end firebase  functions

self.addAdmin = function(size, parentSelector){
  console.log('clicked add admin button');
  var parentElem = parentSelector;
  var modalInstance = $uibModal.open({
    animation: self.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    templateUrl: 'addAdmin.html',   // HTML in the admin.html template
    controller: 'AddAdmin',
    controllerAs: 'aa',
    size: size,
    appendTo: parentElem,
    resolve: {
    }
  });  // end add admin modalInstance
};

self.editAdmin = function(size, parentSelector){
  console.log('clicked edit / delete admin button');
  $http({
    method: 'GET',
    url: '/pool/admin'
  }).then(function success(response) {
    console.log('getting all admins', response);
    self.allAdmins = response.data.rows;
    console.log('self.allAdmins: ', self.allAdmins);
    allAdmins = self.allAdmins;
    var parentElem = parentSelector;
    var modalInstance = $uibModal.open({
      animation: self.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'editAdmin.html',   // HTML in the admin.html template
      controller: 'EditAdmin',
      controllerAs: 'ea',
      size: size,
      appendTo: parentElem,
      resolve: {
        allAdmins: function() {
          return allAdmins;
        },
      }
    });  // end add admin modalInstance
  });
};

self.diningPins = [];
self.lodgingPins = [];
self.naturePins = [];
self.shoppingPins = [];

// Admin Place function
  self.adminPlace = function(place, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin places button clicked for action: ', place);
    $http({
      method: 'GET',
      url: '/locations/getAllPins'
    }).then(function success(response) {
      console.log('getting all pins', response);
      self.allPins = response.data;
      console.log('self.allPins: ', self.allPins);
      allPins = self.allPins;
      for (var i = 0; i < allPins.length; i++) {
        switch (allPins[i].types_id) {
          case 1:
            self.diningPins.push(allPins[i]);
            break;
          case 2:
            self.shoppingPins.push(allPins[i]);
            break;
          case 3:
            self.naturePins.push(allPins[i]);
            break;
          case 4:
            self.lodgingPins.push(allPins[i]);
            break;
        }
      }
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
            allPins: function() {
              return allPins;
            },
            diningPins: function() {
              return self.diningPins;
            },
            shoppingPins: function() {
              return self.shoppingPins;
            },
            naturePins: function() {
              return self.naturePins;
            },
            lodgingPins: function() {
              return self.lodgingPins;
            },
          }
        });  // end edit delete place modal Instance
      }

    });//ending success
  }; // end admin Place Modal

// Admin Trip Function
  self.adminTrip = function(trip, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin trip button clicked for action: ', trip);

    $http({
      method: 'GET',
      url: '/pool/getPlaces'
    }).then(function success(response) {
      self.allPlaces = response.data;
      console.log('getting all places: ', self.allPlaces);
      allPlaces = self.allPlaces;

      // important--yet to do!
      // likely also need to run a getTrips $http call here and assign to self.allTrips then declare allTrips=self.allTrips so it can be passed through in resolve

      if (trip === 'Add Trip'){
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
      });  // end add trip modal Instance
      } else {
        var editDeleteModalInstance = $uibModal.open({
          animation: self.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editDeleteTripModal.html',   // HTML in the admin.html template
          controller: 'EditDeleteTrip',
          controllerAs: 'edt',
          size: size,
          appendTo: parentElem,
          resolve: {
            allPlaces: function() {
              return allPlaces;
            }
          }
        });  // end edit delete place modal Instance
      }  // end else
    });//ending then success


  }; // end adminTrip



});  // end firebase controller


// add admin modal controller
myApp.controller( 'AddAdmin', [ '$uibModalInstance', '$uibModal','$http', function ( $uibModalInstance, $uibModal, $http ) {
  var vm = this;
  vm.addAdminTitle = 'Add an Admin';

  //Add Admin function
  vm.addAdminUser = function(email){
    console.log('email: ', email);
    if (email===undefined) {
      swal("Email address not entered.", "Admin was not created. Try again.");
      $uibModalInstance.dismiss('cancel');
    }
    var itemToSend = {
      email: email,
      admin: true
    };
    $http ({
      method: 'POST',
      url: '/pool/admin',
      data: itemToSend
    }).then(function success( response ){
      console.log('response: ', response);
      document.getElementById('addAdminForm').reset();
      if (response.status === 201){
        swal("Success!", "You added an admin!", "success");
          $uibModalInstance.close();
      } else {
        swal("Uh-oh!", "Admin was not created. Try again.");
        }
    });//ending success
  };//end add admin user

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end Add Admin ModalInstanceController

// edit admin controller
myApp.controller( 'EditAdmin', [ '$uibModalInstance', '$uibModal','$http', 'allAdmins', function ( $uibModalInstance, $uibModal, $http, allAdmins) {
  var vm = this;
  vm.editAdminTitle = 'Edit or Delete an Admin';
  vm.allAdmins = allAdmins;

  //Edit/Delete Admin function
  vm.editAdminUser = function(email){
    console.log('email: ', email);

    var itemToSend = {
      id: id,
      email: email,
      admin: true
    };
    $http ({
      method: 'PUT',
      url: '/pool/admin',
      data: itemToSend
    }).then(function success( response ){
      console.log('response: ', response);
      // document.getElementById('addAdminForm').reset();
      if (response.status === 200){
        swal("Success!", "Your changes were submitted!", "success");
          $uibModalInstance.close();
      } else {
        swal("Uh-oh!", "Admin changes were not submitted. Try again.");
        }
    });//ending success
  };//end add admin user

  vm.edit = false;
  vm.editInPlace = function(admin) {
    vm.edit = true;
    vm.admin = admin;
    console.log('vm.admin: ', vm.admin);
  };

  vm.saveEdits = function(admin) {
    console.log('edited admin to submit to db', admin);
    var editsToSend = {
      id: admin.id,
      email: admin.email,
      admin: admin.admin,
    };
    $http ({
      method: 'PUT',
      url: '/pool/admin',
      data: editsToSend
    }).then(function success( response ){
      console.log('response: ', response);
      vm.edit = false;
      // maybe add an if/else statement here to display a success message if response of 200 is received
      if (response.status === 200){
        swal("Success!", "Your changes were submitted to the database!", "success");
          $uibModalInstance.close();
      } else {
        swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
      }
    });//ending success
  };//end save edits for place

  vm.delete = function(id) {
    console.log('id to delete', id);
    swal({
      title: "Are you sure?",
      text: "This will remove this admin from the database!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    },
    function(){
      $http ({
        method: 'DELETE',
        url: '/pool/admin/' + id
      }).then(function success( response ){
        console.log('response: ', response);
        // maybe add an if/else statement here to display a success message if response of 201 is received
        if (response.status === 200){
          swal("Deleted!", "The admin was been deleted.", "success");
            $uibModalInstance.close();
        } else {
          swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
        }
      }
    );//ending success
  });
};//end delete Item

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end edit delete Admin ModalInstanceController


// /////////add place modal controller
myApp.controller('AddPlaceModalInstanceController', ['$uibModalInstance', '$uibModal', '$http', function($uibModalInstance, $uibModal, $http) {
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
      latitude:'',
      longitude:'',
      types_id: place.types_id,
      imageurl: '',

    };
    console.log('itemToSend: ', itemToSend);

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
      if(!response.data.results[0]){
        swal("Sorry!", "We couldn't get coordinates for this address. Check spelling and try again.");
        // $uibModalInstance.dismiss('cancel');
      }
      console.log("returned coordinates:",response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng);

      //set latitude and logitude in item to send equal to geocoded response
      itemToSend.latitude = response.data.results[0].geometry.location.lat;
      itemToSend.longitude = response.data.results[0].geometry.location.lng;
      var locationToSend = [response.data.results[0].geometry.location.lat,response.data.results[0].geometry.location.lng];
    console.log('itemToSend after lat long addition: ', itemToSend);

      //send itemToSend to server for google places api to get coordinates
      $http ({
        method: 'GET',
        url: '/googlePlaces',
        params: {
          location: locationToSend,
          query: place.street,
          key:'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
        }
      }).then(function success(response ){
        //if no photo post to db anyway
        if(response.data===' '){
          $http ({
            method: 'POST',
            url: '/pool/addPlace',
            data: itemToSend
          }).then(function success( response ){
            console.log('response: ', response);
            document.getElementById('addPlaceForm').reset();
            if (response.status === 201){
              swal("Success!", "You added a place to the map! We couldn't find a photo though. Edit the place to add a url image manually", "success");
                $uibModalInstance.close();
            } else {
              swal("Uh-oh!", "Your changes were not submitted to the map. Try again.");
              }
          });//ending success for post without photo
        }

        //if photo exists post to db with photo url
        else {
        console.log("magic photo url link:",response.data);
        itemToSend.imageurl = response.data;
        console.log('itemToSend to POST to db: ', itemToSend);

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
        });
      }//ending success post with photo

      });
      //end send to server for google places to get coordinates

    }, function error(response){
      console.log('nope');
      document.getElementById('addPlaceForm').reset();
      });//end geocode

  };//END ADD PLACE FUNCTION
  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); ////////////////// end AddPlaceModalInstanceController


// edit delete place modal controller
myApp.controller( 'EditDeletePlace', [ '$uibModalInstance', '$uibModal','$http', 'allPins', 'diningPins', 'shoppingPins', 'naturePins', 'lodgingPins', '$routeParams', function ( $uibModalInstance, $uibModal, $http, allPins, diningPins, shoppingPins, naturePins, lodgingPins, $routeParams ) {
  var vm = this;
  vm.title = 'Edit or Delete a Place';
  // vm.allPlaces = allPlaces;
  vm.allPins = allPins;
  vm.diningPins = diningPins;
  vm.shoppingPins = shoppingPins;
  vm.naturePins = naturePins;
  vm.lodgingPins = lodgingPins;
  vm.typeSelected = false;
  vm.placeType='';
  vm.placeIcon='';

  vm.selectType = function (types_id){
    console.log('types_id: ', types_id);
    switch (types_id) {
      case '1':
        vm.allPlaces = vm.diningPins;
        vm.typeSelected = true;
        vm.placeType = 'Dining';
        vm.placeIcon = 'fa-cutlery';
        break;
      case '2':
        vm.allPlaces = vm.shoppingPins;
        vm.typeSelected = true;
        vm.placeType = 'Shopping';
        vm.placeIcon = 'fa-shopping-bag';
        break;
      case '3':
        vm.allPlaces = vm.naturePins;
        vm.typeSelected = true;
        vm.placeType = 'Nature';
        vm.placeIcon = 'fa-tree';
        break;
      case '4':
        vm.allPlaces = vm.lodgingPins;
        vm.typeSelected = true;
        vm.placeType = 'Lodging';
        vm.placeIcon = 'fa-bed';
        break;
    }
  };

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


  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end Edit Delete PlaceModalInstanceController

// add trip modal controller
myApp.controller('AddTripModalInstanceController', ['$uibModalInstance', '$uibModal', 'allPlaces', '$http', function($uibModalInstance, $uibModal, allPlaces, $http) {
  var vm = this;
  vm.allPlaces = allPlaces;
  vm.addTripTitle = 'Add a Trip';
  vm.success = false;
  vm.failed = false;
  vm.successMessage = 'Success!  New trip added to database.';
  vm.failedMessage = 'Uh-oh!  New trip failed to be added to database.  Try again.';

  vm.checkedPlaces = [];
  vm.toggleCheck = function(place) {
    if (vm.checkedPlaces.indexOf(place) === -1) {
      vm.checkedPlaces.push(place);
    } else {
      vm.checkedPlaces.splice(vm.checkedPlaces.indexOf(place), 1);
    }
  };

  vm.submitTrip = function(trip) {
    console.log('checked place ->', vm.checkedPlaces);
    console.log( 'trip', trip );
    console.log('place ->', vm.checkedPlaces);
    var tripToSend = {
      name: trip.name,
      description: trip.description,
      locations: vm.checkedPlaces
    };
    console.log('Trip to send ->', tripToSend);
    $http({
      method: 'POST',
      url: '/pool/addTrip',
      data: tripToSend
    }).then(function success(response) {
      console.log('response ->', response);
      if (response.status === 200) {
        swal("Success!", "You added a trip!", "success");
        $uibModalInstance.dismiss('cancel');
      } else {
        swal("Uh-oh!", "Your changes were not submitted. Try again.");
      }
    }); //END of success
  }; //ENDING submitTrip Function

  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]); // end AddTripModalInstanceController

// edit / delete trip modal controller
myApp.controller( 'EditDeleteTrip', [ '$uibModalInstance', '$uibModal', 'allPlaces', function ( $uibModalInstance, $uibModal, allPlaces ) {
  var vm = this;
  vm.allPlaces = allPlaces;
  // vm.allTrips = allTrips;
  vm.editDeleteTripTitle = 'Edit or Delete a Trip';

  vm.changeTrip = function(trip){
    console.log('trip');
    console.log('Go! button selected to start edit/delete trip procedure');
    // likely $http call here to get
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end AddTripModalInstanceController
