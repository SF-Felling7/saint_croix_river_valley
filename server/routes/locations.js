//Requires
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require( 'pg' );
var router = express.Router();
var pool = require('../modules/mainPool');

// //Config for pool
// var config = {
//   database: 'st-croix-valley',
//   host: 'localhost',
//   port: 5432,
//   max: 20
// };

//CREATE POOL
// var pool = new pg.Pool(config);

router.get ('/getAllPins', function (req, res){
  console.log('hit getAllPins');

  // connect to db
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.sendStatus( 500 );
    }// end Error
    else{
      console.log('connected to db');
      // send query for dining in the 'locations' table and grab everything with types_id 1
      connection.query( "SELECT * FROM locations", function(err, result) {
          if(err) {
            console.log('Error selecting locations', err);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
      } );
    } // end no error
  }); //end pool
}); //end dining get

module.exports = router;
