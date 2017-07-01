//Requires
var express = require('express');
var pg = require( 'pg' );
var url = require('url');
var config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
  var params = url.parse(process.env.DATABASE_URL);
  var auth = params.auth.split(':postgresql-cubic-31212');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

} else {
  //Config for pooll
   config = {
    database: 'st-croix-valley',
    host: 'localhost',
    port: 5432,
    max: 20
  };
}

module.exports = new pg.Pool(config);
