var express = require ('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var pg = require ('pg');

var config = {
  database: 'st-croix-valley',
  host: 'localhost',
  port: 5432,
  max: 20
}; // end config

var pool = new pg.Pool( config );

router.get( '/getPlaces', function ( req, res ){
  console.log( 'hit getPlaces' );


    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('connected to db');
        // send query for lodging in the 'locations' table and grab everything with types_id 4
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

});


module.exports = router;
