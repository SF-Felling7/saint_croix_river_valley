//requires
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require ('pg');


//modules
var decoder = require('./modules/decoder');

// routes
var privateData = require ('./routes/privateData');
var locations = require( './routes/locations.js' );
var pool = require('./routes/pool');

app.use(express.static('public'));
app.use(bodyParser.json());

// Decodes the token in the request header and attaches the decoded token to the request.
// app.use();

/* Whatever you do below this is protected by your authentication.
WARNING: So far you are returning secret data to ANYONE who is logged in.
There is still more work to be done if you want to implement roles.
No authorization has been completed yet in this branch.
You can use req.decodedToken and some logic to do that.
Other branches in the nodeFire repository show how to do that. */

// This is the route for your secretData. The request gets here after it has been authenticated.
app.use("/privateData", decoder.token, privateData);
app.use( '/locations', locations );
app.use( '/pool', pool );


app.use('/*', function(req, res){
  res.sendFile(path.resolve('./public/views/index.html'));
});

var port = process.env.PORT || 5001;

app.listen(port, function(){
  console.log("Listening on port: ", port);
});
