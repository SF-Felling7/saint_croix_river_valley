//Requires
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require( 'pg' );
var request = require ('request');
var router = express.Router();
var pool = require('../modules/mainPool');


router.get('/', function(req, res){
  console.log('SEARCHING GOOGLE PLACES FOR : ',req.query.query, req.query.location[0], req.query.location[1], req.query.key);

// 1. google places text search gets id and reference of place (not necessary but return useful info)
request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + req.query.query + '&key=' + req.query.key,
  function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('BODY OF GOOGLE PLACES info!!!:', body);
  var placesInfo = JSON.parse(body);


// 2. PASS COORDINATES IN GOOGLE PLACES API TO GET PHOT REFERENCE
  console.log('///////////////////////PLACES SEARCH TO GET PHOTO REFERENCE///////////////////////////////////////',req.query.location[0], req.query.location[1]);
  request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.query.location[0] + ',' + req.query.location[1] + '&rankby=distance&key=AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso',
    function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var placeInfo = JSON.parse(body);
    console.log(placeInfo.results[0]);
    console.log('PHOTO REFERENCE:',placeInfo.results[0].photos[0].photo_reference);

    // 3. CREATE HTTP REQUEST WITH PHOTO REFERENCE
    var photodata = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=' + placeInfo.results[0].photos[0].photo_reference + '&key=AIzaSyBtaJxh1FdQnwtakxhSCxKkdYSRp35VWso';
    console.log("SAVE THIS TO DB AS PHOTO LINK",photodata);

    // 4. FINALLY, MAKE GOOGLE API REQUEST TO FIND SPECIFIC URL AND RETURN TO CLIENT
      request(photodata,
        function (error, response, body){
          console.log('error:', error);
          console.log('/////////////////////////////REQUEST TO GET IMAGE URL//////////////////////', response.request.href);
          res.send(response.request.href);//RETURN TO CLIENT!
        }); // end request to get specif url (4)

  });//end request to get ohoto reference (2)

});//end request to get basic info on original search (1)

//IF ANYONE KNOWS AN EASIER WAY TO DO THIS HIT CWYMORE UP ON GIT HUB!!!!!!

});//end router.get

module.exports = router;
