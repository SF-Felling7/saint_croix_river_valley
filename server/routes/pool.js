var express = require ('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var pg = require ('pg');
var pool = require('../modules/mainPool');

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
        // send query for everything in the 'locations' table and grab everything
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

router.post( '/addPlace', function ( req, res ){
  console.log( 'hit addPlace' );

    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('connected to db');
        console.log('req.body: ', req.body);
        connection.query( "INSERT INTO locations (name, street, city, state, zipcode, website, phone, description, types_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.website, req.body.phone, req.body.description, req.body.types_id] , function(err, result) {
            if(err) {
              console.log('Error selecting locations', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(201);
            }
        });
      } // end no error
    }); //end pool

});

router.post( '/addTrip', function( req, res ) {
  console.log( 'hit the addTrip ROUTE');

  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.sendStatus( 500 );
    }// end Error
    else{
      console.log('connected to db');
      console.log('req.body: ', req.body);
      connection.query( " INSERT INTO trips (name, description) VALUES ( $1, $2 )", [req.body.name, req.body.description],

      function(err, result) {
          if(err) {
            console.log('Error selecting locations', err);
            res.sendStatus(500);
          } else {
            res.sendStatus(201);
          }
      });
    }  //ENDING ELSE

  });//ENDING pool connect
});


module.exports = router;
