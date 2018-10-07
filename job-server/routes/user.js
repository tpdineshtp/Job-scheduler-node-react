var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'),
    User = mongoose.model('User');


router.get('/health-check', function(req, res, next) {
  res.send('Hello World');
});

router.post('/login', function(req, res, next){
  User.findOne({ userName : req.body.username, password: req.body.password }, function(err, user) {
    if (err)
      res.send(err);
    // Username not exists in DB
    if(user === null) {
      res.status(404).send({});
    }
    else{
      res.json(user);
    }
});
})

module.exports = router;
