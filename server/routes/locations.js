//Requires
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var router = express.Router();

//Config for pool
var config = {
  database: 'st-croix-valley',
  host: 'localhost',
  port: 5432,
  max: 20
};

//CREATE POOL
var pool = new pg.Pool(config);

router.get ('/getDining', function (req, res){
  console.log('hit getDining');

  // connect to db
  pool.connect(function(err, connection, done) {
    //check if there was an Error
    if (err) {
      console.log(err);
      // respond with PROBLEM!
      res.sendStatus(500);
    } // end Error
    else {
      console.log('connected to db');
      // send query for dining in the 'locations' table and grab everything with types_id 1
      connection.query("SELECT * FROM locations WHERE types_id = 1", function(err, result) {
        if (err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    } // end no error
  }); //end pool
}); //end dining get

router.get('/getLodging', function(req, res) {
  console.log('hit getLodging');

  pool.connect(function(err, connection, done) {
    //check if there was an Error
    if (err) {
      console.log(err);
      // respond with PROBLEM!
      res.sendStatus(500);
    } // end Error
    else {
      console.log('connected to db');
      // send query for lodging in the 'locations' table and grab everything with types_id 4
      connection.query("SELECT * FROM locations WHERE types_id = 4", function(err, result) {
        if (err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    } // end no error
  }); //end pool
}); //end lodging get


router.get('/getNature', function(req, res) {
  console.log('hit getNature');

  pool.connect(function(err, connection, done) {
    //check if there was an Error
    if (err) {
      console.log(err);
      // respond with PROBLEM!
      res.sendStatus(500);
    } // end Error
    else {
      console.log('connected to db');
      // send query for nature in the 'locations' table and grab everything with types_id 3
      connection.query("SELECT * FROM locations WHERE types_id = 3", function(err, result) {
        if (err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    } // end no error
  }); //end pool
}); //end nature get

router.get('/getShopping', function(req, res) {
  console.log('hit getShopping');

  pool.connect(function(err, connection, done) {
    //check if there was an Error
    if (err) {
      console.log(err);
      // respond with PROBLEM!
      res.sendStatus(500);
    } // end Error
    else {
      console.log('connected to db');
      // send query for shopping in the 'locations' table and grab everything with types_id 2
      connection.query("SELECT * FROM locations WHERE types_id = 2", function(err, result) {
        if (err) {
          console.log('Error selecting locations', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    } // end no error
  }); //end pool
}); //end shopping get

module.exports = router;
