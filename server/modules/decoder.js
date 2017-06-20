console.log('decode srcd');

var admin = require("firebase-admin");

// var serviceAccount = require("./server/firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://interactive-map-e76e0.firebaseio.com"
});

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function(req, res, next){
  if (req.headers.id_token) {
    admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
      // Adding the decodedToken to the request so that downstream processes can use it
      req.decodedToken = decodedToken;
      // SQL query to check if the user with that email is in the database
      // if they are, then next()
      next();
      // if they are not, res.sendStatus(403)
    })
    .catch(function(error) {
      // If the id_token isn't right, you end up in this callback function
      // Here we are returning a forbidden error
      console.log('User token could not be verified');
      res.sendStatus(403);
    });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    res.sendStatus(403);
  }
};

module.exports = { token: tokenDecoder };
