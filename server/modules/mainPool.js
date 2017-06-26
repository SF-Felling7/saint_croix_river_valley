//Requires

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require( 'pg' );
var router = express.Router();


//Config for pool
var config = {
  database: 'st-croix-valley',
  host: 'localhost',
  port: 5432,
  max: 20
};

 var pool = new pg.Pool( config );

module.exports = pool;
