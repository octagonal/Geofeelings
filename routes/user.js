var express = require('express');
var router = express.Router();
var authUtils = require('../passport/authUtils');
var User = require('../models/user');

module.exports = function(passport){
  /* GET users listing. */
  router.get('/prefs', authUtils.isAuthenticated, function(req, res) {
    res.render('prefs', {
      message: req.flash('message'),
      currentPrefNamed: req.user.allownamed
    });
  });

  router.post('/prefs', function(req, res) {
      var allow = true;
      if(req.body.allownamed  == 'true'){
        allow = false;
      }
      console.log("user: " + req.user);
      User.update({username: req.user.username}, {allownamed: allow}, function(err, affected){
        console.log(err);
        console.log(affected);
      });
      req.flash('message', 'Settings changed successfully');
      res.redirect('prefs');
  });

  return router;
};
