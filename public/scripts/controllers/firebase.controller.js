myApp.controller("FirebaseCtrl", function($firebaseAuth, $http, $uibModal) {
  // globals
  var auth = $firebaseAuth();
  var self = this;

  // checks status of user to display content based on whether user is logged in or not
  self.loggedIn = false;
  self.loggedOut = true;

  // // Register with email and password
  // // this is not being used in this application currently (sign in only with gmail--see code below)
  // self.registerWithEmail = function(email, password) {
  //   if (!email) {
  //     alert('email to register');
  //     return console.log('email and password required!');
  //   }
  //   console.log('registering:', email, password);
  //   auth.$createUserWithEmailAndPassword(email, password).catch(function(error) {
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log("sign in error", error);
  //     if (error) {
  //       self.loggedIn = false;
  //       self.loggedOut = true;
  //     }
  //     alert('please use a valid email and password that is at least 6 characters long');
  //   });
  // }; //end register and sign in with email
  //
  // // Sign in with Email
  // // this is not being used in this application currently (sign in only with gmail--see code below)
  // self.signInWithEmail = function(email, password) {
  //   if (!email || !password) {
  //     alert('email and password required');
  //     return console.log('email and password required!');
  //   }
  //   console.log('signing in with:', email, password);
  //
  //   auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
  //     console.log('firebaseUser: ', firebaseUser);
  //     console.log("Firebase Authenticated as: ", firebaseUser.email, firebaseUser.uid);
  //     if (firebaseUser) {
  //       self.loggedIn = true;
  //       self.loggedOut = false;
  //     }
  //
  //   }).catch(function(error) {
  //     console.log("Authentication failed: ", error);
  //     alert('user not found');
  //   });
  // }; //end sign in with email

  // sign in with google!!
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
//end firebase functions


  // add admin function & modal instance, opens modal when add admin button is clicked
  self.addAdmin = function(size, parentSelector){
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
  };  // end addAdmin function

  // edit admin function & modal instance, opens modal when edit/delete admin button is clicked
  self.editAdmin = function(size, parentSelector){
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
    });  // end success
  };  // end editAdmin function

  self.diningPins = [];
  self.lodgingPins = [];
  self.naturePins = [];
  self.shoppingPins = [];

  // Admin Place function & modal instance, opens modal when selection from places dropdown is made
  self.adminPlace = function(place, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin places button clicked for action: ', place);
    // gets all places from database to display in modal
    $http({
      method: 'GET',
      url: '/locations/getAllPins'
    }).then(function success(response) {
      // separates places into their respective categories
      console.log('getting all pins', response);
      self.allPins = response.data;
      console.log('self.allPins: ', self.allPins);
      allPins = self.allPins;
      self.diningPins = [];
      self.shoppingPins = [];
      self.naturePins = [];
      self.lodgingPins = [];
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
      // modal instance for "Add Place"
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
        // modal instance for "Edit/Delete Place"
        var editDeleteModalInstance = $uibModal.open({
          animation: self.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editDeletePlaceModal.html',   // HTML in the admin.html template
          controller: 'EditDeletePlace',
          controllerAs: 'edp',
          size: size,
          appendTo: parentElem,
          // resolve makes places (pins) available for use in modal
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
          }  // end resolve
        });  // end edit delete place modal Instance
      }  // end edit delete place modal
    }); // end GET success
  }; // end adminPlace function and modal instances

  // Admin Trip Function & modal instances, opens modal when selection from trips dropdown is made
  self.adminTrip = function(trip, size, parentSelector){
    var parentElem = parentSelector;
    console.log('admin trip button clicked for action: ', trip);
      if (trip === 'Add Trip'){
        // gets all places from database to display in modal
        $http({
          method: 'GET',
          url: '/pool/getPlaces'
        }).then(function success(response) {
          // separates places into their respective categories
          self.allPlaces = response.data;
          console.log('getting all places: ', self.allPlaces);
          allPlaces = self.allPlaces;
          self.diningPins = [];
          self.shoppingPins = [];
          self.naturePins = [];
          self.lodgingPins = [];
          for (var i = 0; i < allPlaces.length; i++) {
            switch (allPlaces[i].types_id) {
              case 1:
                self.diningPins.push(allPlaces[i]);
                break;
              case 2:
                self.shoppingPins.push(allPlaces[i]);
                break;
              case 3:
                self.naturePins.push(allPlaces[i]);
                break;
              case 4:
                self.lodgingPins.push(allPlaces[i]);
                break;
            }
          }
        // Add Trip modal instance
        var modalInstance = $uibModal.open({
          animation: self.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'addTripModalContent.html',
          controller: 'AddTripModalInstanceController',
          controllerAs: 'atmic',
          size: size,
          appendTo: parentElem,
          // resolve makes places (pins) available for use in modal
          resolve: {
            allPlaces: function() {
              return allPlaces;
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
          }  // end resolve
        });  // end add trip modal Instance
      }); // end if
    } else {
        // gets all existing trips from database
        $http({
          method: 'GET',
          url: '/pool/getTrips'
        }).then(function success(response) {
          self.allTrips = response.data;
          console.log('getting all trips: ', self.allTrips);
          allTrips = self.allTrips;
        // editDelete modal instance
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
            allTrips: function() {
              return allTrips;
            }
          }
        });  // end edit delete place modal Instance
      });  // end .then success response
    } // end else
  };  // end adminTrip

}); // END FIREBASE CONTROLLER


// ADMIN MODAL CONTROLLERS

// add admin modal controller (modal instance controller)
myApp.controller( 'AddAdmin', [ '$uibModalInstance', '$uibModal','$http', function ( $uibModalInstance, $uibModal, $http ) {
  // globals
  var vm = this;
  vm.addAdminTitle = 'Add an Admin';

  // addAdminUser function
  vm.addAdminUser = function(email){
    console.log('email: ', email);
    // sweetalert if no email entered
    if (email===undefined) {
      swal("Email address not entered.", "Admin was not created. Try again.");
      $uibModalInstance.dismiss('cancel');
    }
    // otherwise sends email address to database and creates new admin
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

  // modal cancel button function
  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end Add Admin ModalInstanceController

// edit delete admin controller (modal instance controller)
myApp.controller( 'EditAdmin', [ '$uibModalInstance', '$uibModal','$http', 'allAdmins', function ( $uibModalInstance, $uibModal, $http, allAdmins) {
  // globals
  var vm = this;
  vm.editAdminTitle = 'Edit or Delete an Admin';
  vm.allAdmins = allAdmins;
  vm.edit = false;

  // switches display of information in modal for user to make edits before sending to database
  vm.editInPlace = function(admin) {
    vm.edit = true;
    vm.admin = admin;
    console.log('vm.admin: ', vm.admin);
  };

  // collects changes made to existing admin and sends to database
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
      if (response.status === 200){
        swal("Success!", "Your changes were submitted to the database!", "success");
          $uibModalInstance.close();
      } else {
        swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
      }
    });//ending success
  };//end save edits for place

  // this function allows an admin to delete another admin
  vm.delete = function(id) {
    console.log('id to delete', id);
    // sweetalert confirmation of delete before sending request to database
    swal({
      title: "Are you sure?",
      text: "This will remove this admin from the database!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    },
    // deletes admin (by using id) from database
    function(){
      $http ({
        method: 'DELETE',
        url: '/pool/admin/' + id
      }).then(function success( response ){
        console.log('response: ', response);
        if (response.status === 200){
          swal("Deleted!", "The admin was been deleted.", "success");
            $uibModalInstance.close();
        } else {
          swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
        }
      }  // end .then success response
    );//ending success
  });
};//end delete Item

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // end edit delete Admin ModalInstanceController


// add place modal instance controller
myApp.controller('AddPlaceModalInstanceController', ['$uibModalInstance', '$uibModal', '$http', function($uibModalInstance, $uibModal, $http) {
  var vm = this;
  vm.addPlaceTitle = 'Add a Place';

  // Add Place function - gathers information from form to be submitted to database
  vm.addNewPlace = function(place) {
    var itemToSend = {
      name: place.name,
      description: place.description,
      street: place.street,
      city: place.city,
      zipcode: place.zipcode,
      state: place.state,
      phone: place.phone,
      website: place.website,
      latitude: '',
      longitude: '',
      types_id: place.types_id,
      imageurl: '',
    };
    console.log('itemToSend: ', itemToSend);
    console.log('sending place to google to get coordinates: ', place);
    // get call to google map API to geocode address that is entered by admin
    $http({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      params: {
          address: place.street + place.city + place.state,
          key: 'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
      }
    }).then(function success(response) {
      console.log(response.data.results);
      // sweetalert displayed if no coordinates are obtained
      if (!response.data.results[0]) {
          swal("Sorry!", "We couldn't get coordinates for this address. Check spelling and try again.");
      }
      // otherwise use returned coordinates to request photo from googlePlaces
      console.log("returned coordinates:", response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng);
      //set latitude and logitude in item to send equal to geocoded response
      itemToSend.latitude = response.data.results[0].geometry.location.lat;
      itemToSend.longitude = response.data.results[0].geometry.location.lng;
      var locationToSend = [response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng];
      console.log('itemToSend after lat long addition: ', itemToSend);
      // send itemToSend to server for google places api to get photo based on coordinates
        $http({
          method: 'GET',
          url: '/googlePlaces',
          params: {
            location: locationToSend,
            query: place.street,
            key: 'AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso'
          }
        }).then(function success(response) {
          // if no photo post to db anyway
          if (response.data === ' ') {
            $http({
              method: 'POST',
              url: '/pool/addPlace',
              data: itemToSend
            }).then(function success(response) {
              console.log('response: ', response);
              document.getElementById('addPlaceForm').reset();
              if (response.status === 201) {
                  swal("Success!", "You added a place to the map--but we couldn't find a photo. Edit the place to add a url image manually.", "success");
                  $uibModalInstance.close();
              } else {
                  swal("Uh-oh!", "Your changes were not submitted to the map. Try again.");
              }
            }); //ending success for post without photo
          } else {
            //if photo exists post to db with photo url
            console.log("magic photo url link:", response.data);
            itemToSend.imageurl = response.data;
            console.log('itemToSend to POST to db: ', itemToSend);
            // post new item with latitude and logitude to DB
            $http({
              method: 'POST',
              url: '/pool/addPlace',
              data: itemToSend
            }).then(function success(response) {
              console.log('response: ', response);
              document.getElementById('addPlaceForm').reset();
              if (response.status === 201) {
                  swal("Success!", "You added a place to the map!", "success");
                  $uibModalInstance.close();
              } else {
                  swal("Uh-oh!", "Your changes were not submitted to the map. Try again.");
              }
          }); // ending success post with photo
        } // end else
      }); //end success response after request from server for google places to get photo based on coordinates
    }, function error(response) {
      console.log('nope');
      document.getElementById('addPlaceForm').reset();
    }); //end error response
  }; //END ADD PLACE FUNCTION

  // modal cancel button function
  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]); // end AddPlaceModalInstanceController

// edit delete place modal controller
myApp.controller( 'EditDeletePlace', [ '$uibModalInstance', '$uibModal','$http', 'allPins', 'diningPins', 'shoppingPins', 'naturePins', 'lodgingPins', '$routeParams', function ( $uibModalInstance, $uibModal, $http, allPins, diningPins, shoppingPins, naturePins, lodgingPins, $routeParams ) {
  // globals
  var vm = this;
  vm.title = 'Edit or Delete a Place';
  vm.allPins = allPins;
  vm.diningPins = diningPins;
  vm.shoppingPins = shoppingPins;
  vm.naturePins = naturePins;
  vm.lodgingPins = lodgingPins;
  vm.typeSelected = false;
  vm.placeType='';
  vm.placeIcon='';

  // displays places based on category/type selected
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

  // deletes a place from the map based on id
  vm.delete = function(id) {
    console.log('id to delete', id);
    // sweetalert asks for confirmation before delete
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
};//end delete place

  // switches display of information in modal for user to make edits before sending to database
  vm.edit = false;
  vm.editInPlace = function(place) {
    vm.edit = true;
    vm.place = place;
    console.log('vm.place: ', vm.place);
  };

  // collects changes made to existing place and sends to database
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

  // modal cancel button function\
  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]); // end editDeletePlace controller (Modal Instance Controller)

// add trip modal controller (modal instance controller)
myApp.controller('AddTripModalInstanceController', ['$uibModalInstance', '$uibModal', 'allPlaces', 'diningPins', 'shoppingPins', 'naturePins', 'lodgingPins', '$http', function($uibModalInstance, $uibModal, allPlaces, diningPins, shoppingPins, naturePins, lodgingPins, $http ) {
  // globals
  var vm = this;
  vm.allPlaces = allPlaces;
  vm.addTripTitle = 'Add a Trip';
  vm.diningPins = diningPins;
  vm.shoppingPins = shoppingPins;
  vm.naturePins = naturePins;
  vm.lodgingPins = lodgingPins;
  vm.typeSelected = false;

  // displays places based on category/type selected
  vm.selectType = function (types_id){
    console.log('types_id: ', types_id);
    switch (types_id) {
      case '1':
        vm.allPlaces = [];
        vm.allPlaces = vm.diningPins;
        vm.typeSelected = true;
        break;
      case '2':
        vm.allPlaces = vm.shoppingPins;
        vm.typeSelected = true;
        break;
      case '3':
        vm.allPlaces = vm.naturePins;
        vm.typeSelected = true;
        break;
      case '4':
        vm.allPlaces = vm.lodgingPins;
        vm.typeSelected = true;
        break;
    }
  };

  // allows admin to select places from list and pushes them into checkedPlaces array to create trip
  vm.checkedPlaces = [];
  vm.toggleCheck = function(place) {
    if (vm.checkedPlaces.indexOf(place) === -1) {
      vm.checkedPlaces.push(place);
    } else {
      vm.checkedPlaces.splice(vm.checkedPlaces.indexOf(place), 1);
    }
  };

  // submits newly created trip to database
  vm.submitTrip = function(trip, checkedPlaces) {
    vm.trip = trip;
    vm.checkedPlaces = checkedPlaces;
    if (!trip || checkedPlaces.length === 0) {
      swal("Uh-oh!", "Please enter all the fields for the trip. Try again!");
    }
    else {
      var tripToSend = {
        name: trip.name,
        description: trip.description,
        locations: vm.checkedPlaces
      };
      $http({
        method: 'POST',
        url: '/pool/addTrip',
        data: tripToSend
      }).then(function success(response) {
        if (response.status === 200) {
          swal("Success!", "You added a trip!", "success");
          $uibModalInstance.close();
        } else {
          swal("Uh-oh!", "Your changes were not submitted. Try again.");
        }
      }); //END of success for post
    }//end else statement
  }; //ENDING submitTrip Function

  // modal cancel button function
  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]); // end AddTripModalInstanceController

// edit / delete trip modal controller (modal instance controller)
myApp.controller( 'EditDeleteTrip', [ '$uibModalInstance', '$uibModal', 'allTrips', '$http', function ( $uibModalInstance, $uibModal, allTrips, $http) {
  // globals
  var vm = this;
  vm.allTrips = allTrips;
  vm.editDeleteTripTitle = 'Edit or Delete a Trip';
  vm.edit = false;

  // switches display of information in modal for user to make edits before sending to database
  vm.editInPlace = function(trip) {
    vm.edit = true;
    vm.trip = trip;
    console.log('vm.trip: ', vm.trip);
  };

  // collects changes made to existing trip and sends to database
  vm.saveEdits = function(trip) {
    console.log('edited trip to submit to db', trip.name);
    var editsToSend = {
      id: trip.id,
      name: trip.name,
      description: trip.description,
    };
    console.log('editsToSend: ', editsToSend);
    $http ({
      method: 'PUT',
      url: '/pool/editTrip/' + trip.id,
      data: editsToSend
    }).then(function success( response ){
      vm.edit = false;
      if (response.status === 200){
        swal("Success!", "Your changes were submitted to the map!", "success");
          $uibModalInstance.close();
      } else {
        swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
      }
    });//ending success
  };//end save edits for place

  // deletes a trip from database
  vm.delete = function(id) {
    // sweetalert requests confirmation of delete before request sent to database
    swal({
      title: "Are you sure?",
      text: "This will remove this trip from the map!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    },
    function(){
      $http ({
        method: 'DELETE',
        url: '/pool/deleteTrip/' + id
      }).then(function success( response ){
        // maybe add an if/else statement here to display a success message if response of 201 is received
        if (response.status === 200){
          swal("Deleted!", "The trip has been deleted.", "success");
            $uibModalInstance.close();
        } else {
          swal("Uh-oh!", "Your changes were not submitted to the database.  Try again.");
        }
      });//ending success
    });
  };//end delete Item

  // modal cancel button function
  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]); // end AddTripModalInstanceController
