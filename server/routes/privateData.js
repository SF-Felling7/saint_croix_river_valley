var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  console.log(req.decodedToken); // Here you can see the information firebase gives you about the user
  res.send("Secret DATA!!! You got it!!! Great work " + req.decodedToken.name + "!!!");
});

module.exports = router;
