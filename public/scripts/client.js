console.log('client srcd');
// var app = angular.module("sampleApp", ["firebase"]);
myApp.controller("SampleCtrl", function($firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

//Register with email and password
  self.registerWithEmail = function(email, password){
    if (!email || !password){
      alert ('email and password required to register');
      return console.log('email and password required!');
    }
    console.log('registering:', email, password);

    auth.$createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("sign in error", error);
      alert ('please use a valid email and password that is at least 6 characters long');
    });
  };
//Sign in with Email
  self.signInWithEmail = function (email, password){
    if (!email || !password){
      alert ('email and password required');
      return console.log('email and password required!');
    }
    console.log('signing in with:', email, password);

    auth.$signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("sign in error", error);
    alert ('incorrect email and password');
  });
  };
  //sign in with google!!
  // This code runs whenever the user logs in
  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

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
    });
  };
});
