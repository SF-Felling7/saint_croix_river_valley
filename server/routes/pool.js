var express = require ('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var pg = require ('pg');
var pool = require('../modules/mainPool');

// get (all) places
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
});  // end get (all) places

// post place
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
        console.log('in add place');
        console.log('adding place:', req.body);
        connection.query( "INSERT INTO locations (name, street, city, state, zipcode, website, phone, description, imageurl, latitude, longitude, types_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.website, req.body.phone, req.body.description, req.body.imageurl, req.body.latitude, req.body.longitude, req.body.types_id] , function(err, result) {
            if(err) {
              console.log('Error selecting locations', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(201);
            }
        } );
      } // end no error
    }); //end pool
});  // end post place

// put (edit) place
router.put( '/editPlace/', function ( req, res ){
  console.log( 'hit edit place' );
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.sendStatus( 500 );
    }// end Error
    else{
      console.log('connected to db');
      console.log('req.body', req.body);
      // need to revise to edit
      connection.query( "UPDATE locations SET name=$1, street=$2, city=$3, state=$4, zipcode=$5, phone=$6, website=$7, description=$8, latitude=$9, longitude=$10, types_id=$11, imageurl=$12 WHERE id=" + req.body.id, [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.phone, req.body.website, req.body.description, req.body.latitude, req.body.longitude, req.body.types_id, req.body.imageurl] , function(err, result) {
        if(err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });  // end pool
}); //end put

// delete place
router.delete( '/deletePlace/:id', function ( req, res ){
  console.log( 'hit delete place' );
    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('connected to db');
        console.log('req.params.id: ', req.params.id);
        connection.query( "DELETE FROM locations WHERE id = $1" , [req.params.id] , function(err, result) {
            if(err) {
              console.log('Error selecting locations', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
        } );
      } // end no error
    }); //end pool
});  // end delete place

// post trip
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
      connection.query( " INSERT INTO trips (name, description)  VALUES ( $1, $2 ) RETURNING id", [req.body.name, req.body.description],

      function(err, result) {
        if(err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          for (var i = 0; i < req.body.locations.length; i++) {
            connection.query("INSERT INTO locations_trips (locations_id, trips_id, stop_number) VALUES ($1, $2, $3)", [req.body.locations[i].id, result.rows[0].id, i + 1],
            function (err, result) {
              if(err) {
                res.sendStatus(500);
              }
            });      // end second query function

          } // end for loop
          res.sendStatus(200);
        } // end medium else
      }); // end first query function
    }  //ENDING  big ELSE

  });//ENDING pool connect
});  // end post trip

// get trips
router.get('/getTrips', function (req, res) {
  console.log('in Get Trips route');
pool.connect(function (err, connection, done) {
  if(err) {
    console.log(err);
    res.sendStatus(500);
  } else {
    console.log('no err for get trips');
    connection.query("SELECT * FROM trips", function (err, results) {
      if(err){
        console.log('Error grabbing trips', err);
        res.sendStatus(500);
      } else {
        res.send(results.rows);
      }
    });
  }
});
});

// getLocationByTripId
router.get('/getLocationByTripId/:id', function(req, res){
  console.log('in GET Location By Trip Id: req.params', req.params);
  pool.connect(function(err, connection, done){
     if(err){
       console.log(err);
       res.sendStatus(500);
     } else {
       console.log('no err from get Location By Trip Id');
       connection.query("SELECT * FROM trips JOIN locations_trips ON trips.id = locations_trips.trips_id JOIN locations ON locations.id = locations_trips.locations_id WHERE trips.id ="+req.params.id,
       function (err, results) {
         if(err){
           console.log('error grabbing locations from trips');
           res.sendStatus(500);
         } else {
           res.send(results.rows);
         }
       });
     }
  });
});

// delete trip
router.delete( '/deleteTrip/:id', function ( req, res ){
  console.log( 'hit delete trip' );
    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('connected to db');
        console.log('req.params.id: ', req.params.id);
        connection.query( "DELETE FROM trips WHERE id = $1" , [req.params.id] , function(err, result) {
            if(err) {
              console.log('Error selecting trip to delete', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
        } );
      } // end no error
    }); //end pool
});  // end delete trip

// edit trip
// put (edit) place
router.put( '/editTrip/', function ( req, res ){
  console.log( 'hit edit trip name and description' );
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.sendStatus( 500 );
    }// end Error
    else{
      console.log('coming from edit trip connected to db');
      console.log('req.body', req.body);
      // need to revise to edit
      connection.query( "UPDATE trips SET name=$1, description=$2 WHERE id=" + req.body.id, [req.body.name, req.body.description] , function(err, result) {
        if(err) {
          console.log('Error selecting trips to edit', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });  // end pool
}); //end put

router.post( '/admin', function ( req, res ){
  console.log( 'hit addAdmin' );
    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('in add admin-->adding admin:', req.body.email);
        connection.query( "INSERT INTO admins (email, admin) VALUES ($1, $2)", [req.body.email, req.body.admin] , function(err, result) {
            if(err) {
              console.log('Error selecting locations', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(201);
            }
        } );
      } // end no error
    }); //end pool
});

router.get( '/admin', function ( req, res ){
  console.log( 'hit get admin route' );
    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('in get admins');
        connection.query( "SELECT * FROM admins", function(err, result) {
            if(err) {
              console.log('Error selecting locations', err);
              res.sendStatus(500);
            } else {
              res.send(result);
            }
        } );
      } // end no error
    }); //end pool
});

router.delete( '/admin/:id', function ( req, res ){
  console.log( 'hit delete admin' );
    pool.connect( function( err, connection, done ){
      //check if there was an Error
      if( err ){
        console.log( err );
        // respond with PROBLEM!
        res.sendStatus( 500 );
      }// end Error
      else{
        console.log('connected to db');
        console.log('req.params.id: ', req.params.id);
        connection.query( "DELETE FROM admins WHERE id = $1" , [req.params.id] , function(err, result) {
            if(err) {
              console.log('Error selecting locations', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
        } );
      } // end no error
    }); //end pool
});

router.put( '/admin/', function ( req, res ){
  console.log( 'hit edit admin' );
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.sendStatus( 500 );
    }// end Error
    else{
      console.log('connected to db');
      console.log('req.body', req.body);
      // need to revise to edit
      connection.query( "UPDATE admins SET email=$1, admin=$2 WHERE id=" + req.body.id, [req.body.email, req.body.admin] , function(err, result) {
        if(err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });  // end pool
}); //end put

module.exports = router;
